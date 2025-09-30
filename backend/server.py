from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone, date


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
DB_NAME = os.environ.get('DB_NAME', 'crime_connect')
db = client[DB_NAME]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# =========================
# Existing Sample Models
# =========================
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str


# =========================
# Crime Connect Models
# =========================
class IntelCreate(BaseModel):
    title: str
    severity: str
    tags: List[str] = []

class IntelItem(IntelCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class CaseCreate(BaseModel):
    title: str
    status: str
    priority: str
    owner: str
    notes: int = 0

class CaseItem(CaseCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class CaseUpdate(BaseModel):
    title: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    owner: Optional[str] = None
    notes: Optional[int] = None

class TimelineCreate(BaseModel):
    type: str
    text: str

class TimelineItem(TimelineCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class CommandCreate(BaseModel):
    codename: str
    agent: str
    channel: str
    message: str

class CommandItem(CommandCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


# =========================
# Utilities
# =========================
async def ensure_seed_data():
    # Seed intel
    if await db.intel_events.count_documents({}) == 0:
        seed_intel = [
            IntelItem(title="License plate match near Sector 7", severity="high", tags=["ANPR", "vehicle"]).dict(),
            IntelItem(title="ATM fraud pattern detected", severity="medium", tags=["financial", "pattern"]).dict(),
            IntelItem(title="Irregular comms burst on known channel", severity="critical", tags=["radio", "signal"]).dict(),
            IntelItem(title="Face match at transit hub", severity="high", tags=["facial", "transit"]).dict(),
            IntelItem(title="Anonymous tip - warehouse meetup", severity="low", tags=["tip", "warehouse"]).dict(),
        ]
        await db.intel_events.insert_many(seed_intel)

    # Seed cases
    if await db.cases.count_documents({}) == 0:
        seed_cases = [
            CaseItem(title="Operation Blackline", status="active", priority="P1", owner="A. Shaw", notes=14).dict(),
            CaseItem(title="Courier Sting", status="active", priority="P2", owner="D. Reyes", notes=7).dict(),
            CaseItem(title="Wire Sweep", status="backlog", priority="P3", owner="T. Khan", notes=3).dict(),
            CaseItem(title="Safehouse Audit", status="backlog", priority="P2", owner="E. Chen", notes=2).dict(),
            CaseItem(title="Ghost Ledger", status="archived", priority="P4", owner="S. Patel", notes=23).dict(),
        ]
        await db.cases.insert_many(seed_cases)

    # Seed timeline
    if await db.timelines.count_documents({}) == 0:
        seed_timeline = [
            TimelineItem(type="ingest", text="Surveillance batch processed (482 frames).").dict(),
            TimelineItem(type="match", text="License plate partial match confidence 0.79.").dict(),
            TimelineItem(type="dispatch", text="Team BRAVO dispatched to perimeter.").dict(),
            TimelineItem(type="update", text="Case priority raised to P2.").dict(),
            TimelineItem(type="secure", text="New classified memo uploaded.").dict(),
        ]
        await db.timelines.insert_many(seed_timeline)


def today_bounds() -> Dict[str, datetime]:
    start = datetime.combine(date.today(), datetime.min.time(), tzinfo=timezone.utc)
    end = datetime.combine(date.today(), datetime.max.time(), tzinfo=timezone.utc)
    return {"$gte": start, "$lte": end}


# =========================
# Routes
# =========================
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_obj = StatusCheck(**input.dict())
    await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]


# ---- Intel ----
@api_router.get("/intel", response_model=List[IntelItem])
async def list_intel():
    await ensure_seed_data()
    rows = await db.intel_events.find().sort("created_at", -1).to_list(1000)
    return [IntelItem(**r) for r in rows]

@api_router.post("/intel", response_model=IntelItem, status_code=201)
async def create_intel(body: IntelCreate):
    item = IntelItem(**body.dict())
    await db.intel_events.insert_one(item.dict())
    return item


# ---- Cases ----
@api_router.get("/cases", response_model=List[CaseItem])
async def list_cases(status: Optional[str] = None):
    await ensure_seed_data()
    query: Dict[str, Any] = {}
    if status:
        query["status"] = status
    rows = await db.cases.find(query).sort("updated_at", -1).to_list(1000)
    return [CaseItem(**r) for r in rows]

@api_router.post("/cases", response_model=CaseItem, status_code=201)
async def create_case(body: CaseCreate):
    item = CaseItem(**body.dict())
    await db.cases.insert_one(item.dict())
    return item

@api_router.patch("/cases/{case_id}", response_model=CaseItem)
async def update_case(case_id: str, body: CaseUpdate):
    fields = {k: v for k, v in body.dict().items() if v is not None}
    if not fields:
        raise HTTPException(status_code=400, detail="No fields to update")
    fields["updated_at"] = datetime.now(timezone.utc)
    res = await db.cases.find_one_and_update({"id": case_id}, {"$set": fields}, return_document=True)
    if not res:
        raise HTTPException(status_code=404, detail="Case not found")
    return CaseItem(**res)


# ---- Timeline ----
@api_router.get("/timeline", response_model=List[TimelineItem])
async def list_timeline():
    await ensure_seed_data()
    rows = await db.timelines.find().sort("created_at", -1).to_list(1000)
    return [TimelineItem(**r) for r in rows]

@api_router.post("/timeline", response_model=TimelineItem, status_code=201)
async def create_timeline(body: TimelineCreate):
    item = TimelineItem(**body.dict())
    await db.timelines.insert_one(item.dict())
    return item


# ---- Command Center ----
@api_router.post("/command", response_model=CommandItem, status_code=201)
async def create_command(body: CommandCreate):
    item = CommandItem(**body.dict())
    await db.transmissions.insert_one(item.dict())
    return item

@api_router.get("/command", response_model=List[CommandItem])
async def list_command():
    rows = await db.transmissions.find().sort("created_at", -1).to_list(1000)
    return [CommandItem(**r) for r in rows]


# ---- Metrics (computed) ----
@api_router.get("/metrics")
async def get_metrics():
    await ensure_seed_data()
    total_cases = await db.cases.count_documents({})
    active_ops = await db.cases.count_documents({"status": "active"})
    backlog = await db.cases.count_documents({"status": "backlog"})
    archived = await db.cases.count_documents({"status": "archived"})
    open_cases = active_ops + backlog

    # Alerts today from intel events created today
    alerts_today = await db.intel_events.count_documents({"created_at": today_bounds()})

    # Simple resolution rate = archived / total (as %)
    resolution_rate = int((archived / total_cases) * 100) if total_cases else 0

    return {
        "open_cases": open_cases,
        "active_ops": active_ops,
        "alerts_today": alerts_today,
        "resolution_rate": resolution_rate,
    }


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()