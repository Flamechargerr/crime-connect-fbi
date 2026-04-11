import sys
import types
import unittest
from datetime import datetime, timezone
from unittest.mock import ANY, AsyncMock, MagicMock, patch

from fastapi import HTTPException

motor_module = types.ModuleType("motor")
motor_asyncio_module = types.ModuleType("motor.motor_asyncio")
motor_asyncio_module.AsyncIOMotorClient = MagicMock
motor_module.motor_asyncio = motor_asyncio_module
sys.modules.setdefault("motor", motor_module)
sys.modules.setdefault("motor.motor_asyncio", motor_asyncio_module)

import server


def make_cursor(rows):
    cursor = MagicMock()
    cursor.sort.return_value = cursor
    cursor.to_list = AsyncMock(return_value=rows)
    return cursor


class ServerCoverageTests(unittest.IsolatedAsyncioTestCase):
    def setUp(self):
        self.original_db = server.db

    def tearDown(self):
        server.db = self.original_db

    def test_require_db_raises_when_db_not_configured(self):
        server.db = None
        with self.assertRaises(HTTPException) as context:
            server.require_db()
        self.assertEqual(context.exception.status_code, 503)

    def test_today_bounds_returns_utc_day_window(self):
        bounds = server.today_bounds()
        self.assertIn("$gte", bounds)
        self.assertIn("$lte", bounds)
        self.assertEqual(bounds["$gte"].tzinfo, timezone.utc)
        self.assertEqual(bounds["$lte"].tzinfo, timezone.utc)
        self.assertLess(bounds["$gte"], bounds["$lte"])
        self.assertEqual((bounds["$gte"].hour, bounds["$gte"].minute, bounds["$gte"].second), (0, 0, 0))
        self.assertEqual((bounds["$lte"].hour, bounds["$lte"].minute, bounds["$lte"].second), (23, 59, 59))

    async def test_root_returns_service_metadata(self):
        result = await server.root()
        self.assertEqual(result["service"], "CrimeConnect API")
        self.assertEqual(result["status"], "ok")
        self.assertIn("environment", result)
        self.assertIn("timestamp", result)

    async def test_health_check_returns_status_and_iso_timestamp(self):
        result = await server.health_check()
        self.assertEqual(result["status"], "healthy")
        parsed = datetime.fromisoformat(result["timestamp"])
        self.assertIsNotNone(parsed)

    async def test_create_status_check_persists_and_returns_item(self):
        db = MagicMock()
        db.status_checks.insert_one = AsyncMock()
        server.db = db

        item = await server.create_status_check(server.StatusCheckCreate(client_name="unit-test-client"))

        db.status_checks.insert_one.assert_awaited_once()
        self.assertEqual(item.client_name, "unit-test-client")
        self.assertIsNotNone(item.id)

    async def test_get_status_checks_maps_documents(self):
        rows = [
            {
                "id": "status-1",
                "client_name": "alpha",
                "timestamp": datetime.now(timezone.utc),
            }
        ]
        db = MagicMock()
        db.status_checks.find.return_value = make_cursor(rows)
        server.db = db

        items = await server.get_status_checks()

        self.assertEqual(len(items), 1)
        self.assertEqual(items[0].id, "status-1")
        self.assertEqual(items[0].client_name, "alpha")

    async def test_list_cases_filters_by_active_status(self):
        row = {
            "id": "case-1",
            "title": "Operation Blackline",
            "status": "active",
            "priority": "P1",
            "owner": "A. Shaw",
            "notes": 14,
            "updated_at": datetime.now(timezone.utc),
        }
        db = MagicMock()
        db.cases.find.return_value = make_cursor([row])
        server.db = db

        with patch.object(server, "ensure_seed_data", AsyncMock()):
            cases = await server.list_cases(status="active")

        db.cases.find.assert_called_once_with({"status": "active"})
        self.assertEqual(len(cases), 1)
        self.assertEqual(cases[0].id, "case-1")
        self.assertEqual(cases[0].status, "active")

    async def test_create_case_persists_and_returns_item(self):
        db = MagicMock()
        db.cases.insert_one = AsyncMock()
        server.db = db

        payload = server.CaseCreate(
            title="Test Case",
            status="active",
            priority="P1",
            owner="Agent Smith",
            notes=4,
        )
        item = await server.create_case(payload)

        db.cases.insert_one.assert_awaited_once()
        self.assertEqual(item.title, "Test Case")
        self.assertEqual(item.notes, 4)

    async def test_update_case_requires_at_least_one_field(self):
        server.db = MagicMock()
        with self.assertRaises(HTTPException) as context:
            await server.update_case("case-1", server.CaseUpdate())
        self.assertEqual(context.exception.status_code, 400)

    async def test_update_case_returns_404_when_case_not_found(self):
        db = MagicMock()
        db.cases.find_one_and_update = AsyncMock(return_value=None)
        server.db = db

        with self.assertRaises(HTTPException) as context:
            await server.update_case("missing-case", server.CaseUpdate(status="active"))

        self.assertEqual(context.exception.status_code, 404)
        db.cases.find_one_and_update.assert_awaited_once()

    async def test_update_case_updates_timestamp_and_returns_case(self):
        updated = {
            "id": "case-2",
            "title": "Courier Sting",
            "status": "active",
            "priority": "P2",
            "owner": "D. Reyes",
            "notes": 8,
            "updated_at": datetime.now(timezone.utc),
        }
        db = MagicMock()
        db.cases.find_one_and_update = AsyncMock(return_value=updated)
        server.db = db

        item = await server.update_case("case-2", server.CaseUpdate(status="active", notes=8))

        db.cases.find_one_and_update.assert_awaited_once_with(
            {"id": "case-2"},
            {"$set": {"status": "active", "notes": 8, "updated_at": ANY}},
            return_document=True,
        )
        self.assertEqual(item.id, "case-2")
        self.assertEqual(item.notes, 8)

    async def test_get_metrics_computes_expected_fields(self):
        total_cases = 10
        active_cases = 4
        backlog_cases = 3
        archived_cases = 2
        alerts_today = 5

        db = MagicMock()
        db.cases.count_documents = AsyncMock(side_effect=[total_cases, active_cases, backlog_cases, archived_cases])
        db.intel_events.count_documents = AsyncMock(return_value=alerts_today)
        server.db = db

        with patch.object(server, "ensure_seed_data", AsyncMock()):
            metrics = await server.get_metrics()

        expected_resolution_rate = int((archived_cases / total_cases) * 100)
        self.assertEqual(
            metrics,
            {
                "open_cases": active_cases + backlog_cases,
                "active_ops": active_cases,
                "alerts_today": alerts_today,
                "resolution_rate": expected_resolution_rate,
            },
        )
        alerts_query = db.intel_events.count_documents.await_args.args[0]
        self.assertIn("created_at", alerts_query)
        self.assertIn("$gte", alerts_query["created_at"])
        self.assertIn("$lte", alerts_query["created_at"])

    async def test_get_metrics_handles_zero_total_cases(self):
        db = MagicMock()
        db.cases.count_documents = AsyncMock(side_effect=[0, 0, 0, 0])
        db.intel_events.count_documents = AsyncMock(return_value=0)
        server.db = db

        with patch.object(server, "ensure_seed_data", AsyncMock()):
            metrics = await server.get_metrics()

        self.assertEqual(metrics["resolution_rate"], 0)
        self.assertEqual(metrics["open_cases"], 0)
        self.assertEqual(metrics["active_ops"], 0)
        self.assertEqual(metrics["alerts_today"], 0)

    async def test_get_analytics_summary_returns_model_metadata_without_db(self):
        server.db = None

        summary = await server.get_analytics_summary()

        self.assertEqual(summary["platform"], "CrimeConnect")
        self.assertEqual(summary["dataset_records"], 10000)
        self.assertFalse(summary["kpis"]["db_connected"])
        self.assertGreaterEqual(summary["model"]["accuracy"], 0.75)

    async def test_get_analytics_summary_includes_db_kpis(self):
        db = MagicMock()
        db.cases.count_documents = AsyncMock(side_effect=[10, 4, 3, 2])
        db.intel_events.count_documents = AsyncMock(return_value=5)
        server.db = db

        with patch.object(server, "ensure_seed_data", AsyncMock()):
            summary = await server.get_analytics_summary()

        self.assertTrue(summary["kpis"]["db_connected"])
        self.assertEqual(summary["kpis"]["total_cases"], 10)
        self.assertEqual(summary["kpis"]["open_cases"], 7)
        self.assertEqual(summary["kpis"]["active_ops"], 4)
        self.assertEqual(summary["kpis"]["alerts_today"], 5)
        self.assertEqual(summary["kpis"]["resolution_rate"], 20)

    async def test_classify_case_risk_returns_prediction(self):
        prediction = await server.classify_case_risk(
            server.CaseRiskFeatures(
                prior_offenses=4,
                evidence_items=6,
                witness_count=3,
                financial_red_flags=2,
                digital_footprint_score=0.71,
                violent_history_score=0.62,
                cross_border_activity=True,
                active_warrants=1,
            )
        )

        self.assertIn(prediction.risk_label, {"low", "medium", "high"})
        self.assertGreaterEqual(prediction.risk_score, 0.0)
        self.assertLessEqual(prediction.risk_score, 1.0)
        self.assertGreaterEqual(prediction.confidence, 0.0)
        self.assertLessEqual(prediction.confidence, 1.0)
        self.assertIn("high", prediction.class_probabilities)
        self.assertGreaterEqual(prediction.model_accuracy, 0.75)

    def test_case_risk_features_validates_ranges(self):
        with self.assertRaises(Exception):
            server.CaseRiskFeatures(
                prior_offenses=-1,
                evidence_items=1,
                witness_count=1,
                financial_red_flags=0,
                digital_footprint_score=0.2,
                violent_history_score=0.2,
                cross_border_activity=False,
                active_warrants=0,
            )

    async def test_create_intel_persists_and_returns_item(self):
        db = MagicMock()
        db.intel_events.insert_one = AsyncMock()
        server.db = db

        created = await server.create_intel(server.IntelCreate(title="Signal intercept", severity="high", tags=["signal"]))

        db.intel_events.insert_one.assert_awaited_once()
        self.assertEqual(created.title, "Signal intercept")
        self.assertEqual(created.severity, "high")

    async def test_list_intel_returns_all_events(self):
        db = MagicMock()
        intel_row = {
            "id": "intel-1",
            "title": "Signal intercept",
            "severity": "high",
            "tags": ["signal"],
            "created_at": datetime.now(timezone.utc),
        }
        db.intel_events.find.return_value = make_cursor([intel_row])
        server.db = db

        with patch.object(server, "ensure_seed_data", AsyncMock()):
            listed = await server.list_intel()

        db.intel_events.find.assert_called_once_with()
        self.assertEqual(len(listed), 1)
        self.assertEqual(listed[0].id, "intel-1")

    async def test_create_timeline_persists_and_returns_item(self):
        db = MagicMock()
        db.timelines.insert_one = AsyncMock()
        server.db = db

        created = await server.create_timeline(server.TimelineCreate(type="update", text="Case updated"))

        db.timelines.insert_one.assert_awaited_once()
        self.assertEqual(created.type, "update")
        self.assertEqual(created.text, "Case updated")

    async def test_list_timeline_returns_all_entries(self):
        db = MagicMock()
        timeline_row = {
            "id": "timeline-1",
            "type": "update",
            "text": "Case updated",
            "created_at": datetime.now(timezone.utc),
        }
        db.timelines.find.return_value = make_cursor([timeline_row])
        server.db = db

        with patch.object(server, "ensure_seed_data", AsyncMock()):
            listed = await server.list_timeline()

        db.timelines.find.assert_called_once_with()
        self.assertEqual(len(listed), 1)
        self.assertEqual(listed[0].id, "timeline-1")

    async def test_create_command_persists_and_returns_item(self):
        db = MagicMock()
        db.transmissions.insert_one = AsyncMock()
        server.db = db

        created = await server.create_command(
            server.CommandCreate(codename="EAGLE", agent="Agent Lee", channel="secure", message="Proceed")
        )

        db.transmissions.insert_one.assert_awaited_once()
        self.assertEqual(created.codename, "EAGLE")
        self.assertEqual(created.channel, "secure")

    async def test_list_command_returns_all_transmissions(self):
        db = MagicMock()
        command_row = {
            "id": "command-1",
            "codename": "EAGLE",
            "agent": "Agent Lee",
            "channel": "secure",
            "message": "Proceed",
            "created_at": datetime.now(timezone.utc),
        }
        db.transmissions.find.return_value = make_cursor([command_row])
        server.db = db

        listed = await server.list_command()

        db.transmissions.find.assert_called_once_with()
        self.assertEqual(len(listed), 1)
        self.assertEqual(listed[0].id, "command-1")


if __name__ == "__main__":
    unittest.main()
