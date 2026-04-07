import unittest
from datetime import datetime, timezone
from unittest.mock import ANY, AsyncMock, MagicMock, patch

from fastapi import HTTPException

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
        self.assertEqual(bounds["$gte"].date(), bounds["$lte"].date())

    async def test_list_cases_filters_by_status(self):
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
        existing = {
            "id": "case-2",
            "title": "Courier Sting",
            "status": "active",
            "priority": "P2",
            "owner": "D. Reyes",
            "notes": 7,
            "updated_at": datetime.now(timezone.utc),
        }
        db = MagicMock()
        db.cases.find_one_and_update = AsyncMock(return_value=existing)
        server.db = db

        item = await server.update_case("case-2", server.CaseUpdate(status="active", notes=8))

        db.cases.find_one_and_update.assert_awaited_once_with(
            {"id": "case-2"},
            {"$set": {"status": "active", "notes": 8, "updated_at": ANY}},
            return_document=True,
        )
        self.assertEqual(item.id, "case-2")
        self.assertEqual(item.notes, 7)

    async def test_get_metrics_computes_expected_fields(self):
        db = MagicMock()
        db.cases.count_documents = AsyncMock(side_effect=[10, 4, 3, 2])
        db.intel_events.count_documents = AsyncMock(return_value=5)
        server.db = db

        with patch.object(server, "ensure_seed_data", AsyncMock()):
            metrics = await server.get_metrics()

        self.assertEqual(
            metrics,
            {
                "open_cases": 7,
                "active_ops": 4,
                "alerts_today": 5,
                "resolution_rate": 20,
            },
        )
        alerts_query = db.intel_events.count_documents.await_args.args[0]
        self.assertIn("created_at", alerts_query)
        self.assertIn("$gte", alerts_query["created_at"])
        self.assertIn("$lte", alerts_query["created_at"])


if __name__ == "__main__":
    unittest.main()
