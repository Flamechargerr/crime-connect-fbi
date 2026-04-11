from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, Depends, status
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import hmac
import hashlib
import base64
import json
from collections import defaultdict, deque
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any, Literal, Tuple
import uuid
from datetime import datetime, timezone, date, timedelta
try:
    from .ml_pipeline import get_model_metadata, predict_case_risk
except ImportError:
    from ml_pipeline import get_model_metadata, predict_case_risk


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

logger = logging.getLogger(__name__)


# =========================
# Configuration
# =========================
def parse_origins(value: str) -> List[str]:
    origins = [origin.strip() for origin in value.split(',') if origin.strip()]
    return origins or ["http://localhost:3000"]


class AppConfig(BaseModel):
    environment: Literal["development", "staging", "production"] = "development"
    db_name: str = "crime_connect"
    mongo_url: Optional[str] = None
    cors_origins: List[str] = Field(default_factory=lambda: ["http://localhost:3000"])
    seed_demo_data: bool = False
    api_token_secret: str = "dev-insecure-change-me"
    access_token_ttl_minutes: int = 60
    rate_limit_per_minute: int = 120
    admin_email: str = "admin@crimeconnect.local"
    admin_password: str = "change-me"
    analyst_email: str = "analyst@crimeconnect.local"
    analyst_password: str = "change-me"


CONFIG = AppConfig(
    environment=os.environ.get("APP_ENV", "development").lower(),
    db_name=os.environ.get("DB_NAME", "crime_connect"),
    mongo_url=os.environ.get("MONGO_URL"),
    cors_origins=parse_origins(os.environ.get("CORS_ORIGINS", "http://localhost:3000")),
    seed_demo_data=os.environ.get("SEED_DEMO_DATA", "false").lower() == "true",
    api_token_secret=os.environ.get("API_TOKEN_SECRET", "dev-insecure-change-me"),
    access_token_ttl_minutes=max(int(os.environ.get("ACCESS_TOKEN_TTL_MINUTES", "60")), 5),
    rate_limit_per_minute=max(int(os.environ.get("RATE_LIMIT_PER_MINUTE", "120")), 10),
    admin_email=os.environ.get("APP_ADMIN_EMAIL", "admin@crimeconnect.local"),
    admin_password=os.environ.get("APP_ADMIN_PASSWORD", "change-me"),
    analyst_email=os.environ.get("APP_ANALYST_EMAIL", "analyst@crimeconnect.local"),
    analyst_password=os.environ.get("APP_ANALYST_PASSWORD", "change-me"),
)


if CONFIG.environment in {"staging", "production"} and CONFIG.api_token_secret == "dev-insecure-change-me":
    raise RuntimeError("API_TOKEN_SECRET must be configured for staging/production environments")

if CONFIG.environment == "production" and (
    CONFIG.admin_password == "change-me" or CONFIG.analyst_password == "change-me"
):
    raise RuntimeError("Production credentials must be provided via APP_ADMIN_PASSWORD and APP_ANALYST_PASSWORD")


# Globals for DB, initialized at startup
client: Optional[AsyncIOMotorClient] = None
db = None
rate_limit_store: Dict[str, deque[datetime]] = defaultdict(deque)

# Create the main app without a prefix
app = FastAPI(title="CrimeConnect API", version="1.0.0")

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
# Auth Models
# =========================
class AuthLoginRequest(BaseModel):
    email: str
    password: str


class AuthRegisterRequest(BaseModel):
    email: str
    password: str = Field(min_length=8)


class AuthResetRequest(BaseModel):
    email: str


class AuthTokenResponse(BaseModel):
    access_token: str
    token_type: Literal["bearer"] = "bearer"
    expires_in: int
    user: Dict[str, str]


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


class CaseRiskFeatures(BaseModel):
    prior_offenses: int = Field(ge=0, le=100)
    evidence_items: int = Field(ge=0, le=1000)
    witness_count: int = Field(ge=0, le=500)
    financial_red_flags: int = Field(ge=0, le=100)
    digital_footprint_score: float = Field(ge=0.0, le=1.0)
    violent_history_score: float = Field(ge=0.0, le=1.0)
    cross_border_activity: bool = False
    active_warrants: int = Field(ge=0, le=100)


class CaseRiskPrediction(BaseModel):
    risk_label: Literal["low", "medium", "high"]
    risk_score: float
    confidence: float
    class_probabilities: Dict[str, float]
    top_factors: Dict[str, float]
    model_accuracy: float


# =========================
# Security + Auth Utilities
# =========================
def _b64url_encode(raw: bytes) -> str:
    return base64.urlsafe_b64encode(raw).rstrip(b"=").decode("utf-8")


def _b64url_decode(encoded: str) -> bytes:
    padding = '=' * (-len(encoded) % 4)
    return base64.urlsafe_b64decode((encoded + padding).encode("utf-8"))


def issue_access_token(subject: str, role: str) -> Tuple[str, int]:
    now = datetime.now(timezone.utc)
    expires_at = now + timedelta(minutes=CONFIG.access_token_ttl_minutes)
    header = {"alg": "HS256", "typ": "JWT"}
    payload = {
        "sub": subject,
        "role": role,
        "iat": int(now.timestamp()),
        "exp": int(expires_at.timestamp()),
        "iss": "crimeconnect-api",
    }

    header_b64 = _b64url_encode(json.dumps(header, separators=(",", ":")).encode("utf-8"))
    payload_b64 = _b64url_encode(json.dumps(payload, separators=(",", ":")).encode("utf-8"))
    signing_input = f"{header_b64}.{payload_b64}".encode("utf-8")
    signature = hmac.new(CONFIG.api_token_secret.encode("utf-8"), signing_input, hashlib.sha256).digest()
    token = f"{header_b64}.{payload_b64}.{_b64url_encode(signature)}"
    return token, int((expires_at - now).total_seconds())


def decode_access_token(token: str) -> Dict[str, Any]:
    try:
        header_b64, payload_b64, signature_b64 = token.split('.')
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Malformed token") from exc

    signing_input = f"{header_b64}.{payload_b64}".encode("utf-8")
    expected_signature = hmac.new(CONFIG.api_token_secret.encode("utf-8"), signing_input, hashlib.sha256).digest()
    provided_signature = _b64url_decode(signature_b64)

    if not hmac.compare_digest(expected_signature, provided_signature):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token signature")

    payload = json.loads(_b64url_decode(payload_b64).decode("utf-8"))
    if int(payload.get("exp", 0)) < int(datetime.now(timezone.utc).timestamp()):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token expired")
    return payload


def authenticate_user(email: str, password: str) -> Dict[str, str]:
    if hmac.compare_digest(email, CONFIG.admin_email) and hmac.compare_digest(password, CONFIG.admin_password):
        return {"email": CONFIG.admin_email, "role": "admin"}
    if hmac.compare_digest(email, CONFIG.analyst_email) and hmac.compare_digest(password, CONFIG.analyst_password):
        return {"email": CONFIG.analyst_email, "role": "analyst"}
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")


async def get_current_principal(request: Request) -> Dict[str, Any]:
    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing bearer token")

    token = auth_header.split(" ", 1)[1]
    claims = decode_access_token(token)
    return {"email": claims["sub"], "role": claims.get("role", "analyst")}


def require_roles(*roles: str):
    async def _role_guard(principal: Dict[str, Any] = Depends(get_current_principal)) -> Dict[str, Any]:
        if principal.get("role") not in roles:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient permissions")
        return principal

    return _role_guard


# =========================
# Utilities
# =========================
async def ensure_seed_data():
    if db is None or not CONFIG.seed_demo_data:
        return

    if await db.intel_events.count_documents({}) == 0:
        seed_intel = [
            IntelItem(title="License plate match near Sector 7", severity="high", tags=["ANPR", "vehicle"]).model_dump(),
            IntelItem(title="ATM fraud pattern detected", severity="medium", tags=["financial", "pattern"]).model_dump(),
            IntelItem(title="Irregular comms burst on known channel", severity="critical", tags=["radio", "signal"]).model_dump(),
            IntelItem(title="Face match at transit hub", severity="high", tags=["facial", "transit"]).model_dump(),
            IntelItem(title="Anonymous tip - warehouse meetup", severity="low", tags=["tip", "warehouse"]).model_dump(),
        ]
        await db.intel_events.insert_many(seed_intel)

    if await db.cases.count_documents({}) == 0:
        seed_cases = [
            CaseItem(title="Operation Blackline", status="active", priority="P1", owner="A. Shaw", notes=14).model_dump(),
            CaseItem(title="Courier Sting", status="active", priority="P2", owner="D. Reyes", notes=7).model_dump(),
            CaseItem(title="Wire Sweep", status="backlog", priority="P3", owner="T. Khan", notes=3).model_dump(),
            CaseItem(title="Safehouse Audit", status="backlog", priority="P2", owner="E. Chen", notes=2).model_dump(),
            CaseItem(title="Ghost Ledger", status="archived", priority="P4", owner="S. Patel", notes=23).model_dump(),
        ]
        await db.cases.insert_many(seed_cases)

    if await db.timelines.count_documents({}) == 0:
        seed_timeline = [
            TimelineItem(type="ingest", text="Surveillance batch processed (482 frames).",).model_dump(),
            TimelineItem(type="match", text="License plate partial match confidence 0.79.").model_dump(),
            TimelineItem(type="dispatch", text="Team BRAVO dispatched to perimeter.").model_dump(),
            TimelineItem(type="update", text="Case priority raised to P2.").model_dump(),
            TimelineItem(type="secure", text="New classified memo uploaded.").model_dump(),
        ]
        await db.timelines.insert_many(seed_timeline)


async def ensure_indexes():
    if db is None:
        return

    await db.cases.create_index("id", unique=True)
    await db.cases.create_index([("status", 1), ("updated_at", -1)])

    await db.intel_events.create_index("id", unique=True)
    await db.intel_events.create_index("created_at")

    await db.timelines.create_index("id", unique=True)
    await db.timelines.create_index("created_at")

    await db.transmissions.create_index("id", unique=True)
    await db.transmissions.create_index("created_at")


async def check_rate_limit(request: Request):
    if request.url.path in {"/api/health", "/api/readiness"}:
        return

    client_ip = request.client.host if request.client else "unknown"
    key = f"{client_ip}:{request.url.path}"
    now = datetime.now(timezone.utc)

    window = rate_limit_store[key]
    cutoff = now - timedelta(minutes=1)
    while window and window[0] < cutoff:
        window.popleft()

    if len(window) >= CONFIG.rate_limit_per_minute:
        raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail="Rate limit exceeded")

    window.append(now)


def today_bounds() -> Dict[str, datetime]:
    start = datetime.combine(date.today(), datetime.min.time(), tzinfo=timezone.utc)
    end = datetime.combine(date.today(), datetime.max.time(), tzinfo=timezone.utc)
    return {"$gte": start, "$lte": end}


def require_db():
    if db is None:
        raise HTTPException(status_code=503, detail="Database not configured. Ensure MONGO_URL is set in backend/.env")


# =========================
# Middleware + Error handling
# =========================
@app.middleware("http")
async def request_context_middleware(request: Request, call_next):
    request_id = request.headers.get("X-Request-Id", str(uuid.uuid4()))
    request.state.request_id = request_id
    request.state.request_started = datetime.now(timezone.utc)

    try:
        await check_rate_limit(request)
        response = await call_next(request)
    except HTTPException as exc:
        response = JSONResponse(status_code=exc.status_code, content={"error": exc.detail, "request_id": request_id})
    except Exception:
        logger.exception("Unhandled error", extra={"request_id": request_id})
        response = JSONResponse(status_code=500, content={"error": "Internal server error", "request_id": request_id})

    response.headers["X-Request-Id"] = request_id
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"
    response.headers["Content-Security-Policy"] = "default-src 'self'; frame-ancestors 'none'; object-src 'none'"

    duration_ms = int((datetime.now(timezone.utc) - request.state.request_started).total_seconds() * 1000)
    logger.info(
        "%s %s -> %s (%sms)",
        request.method,
        request.url.path,
        response.status_code,
        duration_ms,
        extra={"request_id": request_id},
    )
    return response


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    request_id = getattr(request.state, "request_id", str(uuid.uuid4()))
    return JSONResponse(status_code=exc.status_code, content={"error": exc.detail, "request_id": request_id})


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    request_id = getattr(request.state, "request_id", str(uuid.uuid4()))
    logger.exception("Unhandled exception", extra={"request_id": request_id, "path": request.url.path})
    return JSONResponse(status_code=500, content={"error": "Internal server error", "request_id": request_id})


# =========================
# Routes
# =========================
@api_router.get("/")
async def root():
    return {
        "service": "CrimeConnect API",
        "status": "ok",
        "environment": CONFIG.environment,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }


@api_router.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now(timezone.utc).isoformat()}


@api_router.get("/readiness")
async def readiness_check():
    if db is None:
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content={"status": "not_ready", "db_connected": False, "timestamp": datetime.now(timezone.utc).isoformat()},
        )
    return {"status": "ready", "db_connected": True, "timestamp": datetime.now(timezone.utc).isoformat()}


@api_router.post("/auth/login", response_model=AuthTokenResponse)
async def auth_login(body: AuthLoginRequest):
    user = authenticate_user(body.email, body.password)
    token, expires_in = issue_access_token(subject=user["email"], role=user["role"])
    return AuthTokenResponse(access_token=token, expires_in=expires_in, user=user)


@api_router.post("/auth/register")
async def auth_register(body: AuthRegisterRequest):
    if CONFIG.environment == "production":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Self-registration disabled in production")

    role = "analyst"
    token, expires_in = issue_access_token(subject=body.email, role=role)
    return AuthTokenResponse(
        access_token=token,
        expires_in=expires_in,
        user={"email": body.email, "role": role},
    )


@api_router.post("/auth/reset-password")
async def auth_reset_password(body: AuthResetRequest):
    logger.info("Password reset requested for %s", body.email)
    return {"status": "accepted", "message": "If the account exists, reset instructions were sent."}


@api_router.get("/auth/me")
async def auth_me(principal: Dict[str, Any] = Depends(get_current_principal)):
    return principal


@api_router.post("/status", response_model=StatusCheck, dependencies=[Depends(require_roles("admin", "analyst"))])
async def create_status_check(input: StatusCheckCreate):
    require_db()
    status_obj = StatusCheck(**input.model_dump())
    await db.status_checks.insert_one(status_obj.model_dump())
    return status_obj


@api_router.get("/status", response_model=List[StatusCheck], dependencies=[Depends(require_roles("admin", "analyst"))])
async def get_status_checks():
    require_db()
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]


# ---- Intel ----
@api_router.get("/intel", response_model=List[IntelItem], dependencies=[Depends(require_roles("admin", "analyst"))])
async def list_intel():
    require_db()
    await ensure_seed_data()
    rows = await db.intel_events.find().sort("created_at", -1).to_list(1000)
    return [IntelItem(**r) for r in rows]


@api_router.post("/intel", response_model=IntelItem, status_code=201, dependencies=[Depends(require_roles("admin"))])
async def create_intel(body: IntelCreate):
    require_db()
    item = IntelItem(**body.model_dump())
    await db.intel_events.insert_one(item.model_dump())
    return item


# ---- Cases ----
@api_router.get("/cases", response_model=List[CaseItem], dependencies=[Depends(require_roles("admin", "analyst"))])
async def list_cases(status: Optional[str] = None):
    require_db()
    await ensure_seed_data()
    query: Dict[str, Any] = {}
    if status:
        query["status"] = status
    rows = await db.cases.find(query).sort("updated_at", -1).to_list(1000)
    return [CaseItem(**r) for r in rows]


@api_router.post("/cases", response_model=CaseItem, status_code=201, dependencies=[Depends(require_roles("admin", "analyst"))])
async def create_case(body: CaseCreate):
    require_db()
    item = CaseItem(**body.model_dump())
    await db.cases.insert_one(item.model_dump())
    return item


@api_router.patch("/cases/{case_id}", response_model=CaseItem, dependencies=[Depends(require_roles("admin", "analyst"))])
async def update_case(case_id: str, body: CaseUpdate):
    require_db()
    fields = {k: v for k, v in body.model_dump().items() if v is not None}
    if not fields:
        raise HTTPException(status_code=400, detail="No fields to update")
    fields["updated_at"] = datetime.now(timezone.utc)
    res = await db.cases.find_one_and_update({"id": case_id}, {"$set": fields}, return_document=True)
    if not res:
        raise HTTPException(status_code=404, detail="Case not found")
    return CaseItem(**res)


# ---- Timeline ----
@api_router.get("/timeline", response_model=List[TimelineItem], dependencies=[Depends(require_roles("admin", "analyst"))])
async def list_timeline():
    require_db()
    await ensure_seed_data()
    rows = await db.timelines.find().sort("created_at", -1).to_list(1000)
    return [TimelineItem(**r) for r in rows]


@api_router.post("/timeline", response_model=TimelineItem, status_code=201, dependencies=[Depends(require_roles("admin", "analyst"))])
async def create_timeline(body: TimelineCreate):
    require_db()
    item = TimelineItem(**body.model_dump())
    await db.timelines.insert_one(item.model_dump())
    return item


# ---- Command Center ----
@api_router.post("/command", response_model=CommandItem, status_code=201, dependencies=[Depends(require_roles("admin", "analyst"))])
async def create_command(body: CommandCreate):
    require_db()
    item = CommandItem(**body.model_dump())
    await db.transmissions.insert_one(item.model_dump())
    return item


@api_router.get("/command", response_model=List[CommandItem], dependencies=[Depends(require_roles("admin", "analyst"))])
async def list_command():
    require_db()
    rows = await db.transmissions.find().sort("created_at", -1).to_list(1000)
    return [CommandItem(**r) for r in rows]


# ---- Metrics (computed) ----
@api_router.get("/metrics", dependencies=[Depends(require_roles("admin", "analyst"))])
async def get_metrics():
    require_db()
    await ensure_seed_data()
    total_cases = await db.cases.count_documents({})
    active_ops = await db.cases.count_documents({"status": "active"})
    backlog = await db.cases.count_documents({"status": "backlog"})
    archived = await db.cases.count_documents({"status": "archived"})
    open_cases = active_ops + backlog

    alerts_today = await db.intel_events.count_documents({"created_at": today_bounds()})
    resolution_rate = int((archived / total_cases) * 100) if total_cases else 0

    return {
        "open_cases": open_cases,
        "active_ops": active_ops,
        "alerts_today": alerts_today,
        "resolution_rate": resolution_rate,
    }


@api_router.get("/analytics/summary", dependencies=[Depends(require_roles("admin", "analyst"))])
async def get_analytics_summary():
    metadata = get_model_metadata()
    summary = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "platform": "CrimeConnect",
        "dataset_records": metadata["training_records"],
        "model": metadata,
        "kpis": {
            "total_cases": 0,
            "open_cases": 0,
            "active_ops": 0,
            "alerts_today": 0,
            "resolution_rate": 0,
            "db_connected": False,
        },
    }

    if db is None:
        return summary

    await ensure_seed_data()
    total_cases = await db.cases.count_documents({})
    active_ops = await db.cases.count_documents({"status": "active"})
    backlog = await db.cases.count_documents({"status": "backlog"})
    archived = await db.cases.count_documents({"status": "archived"})
    open_cases = active_ops + backlog
    alerts_today = await db.intel_events.count_documents({"created_at": today_bounds()})

    summary["kpis"] = {
        "total_cases": total_cases,
        "open_cases": open_cases,
        "active_ops": active_ops,
        "alerts_today": alerts_today,
        "resolution_rate": int((archived / total_cases) * 100) if total_cases else 0,
        "db_connected": True,
    }
    return summary


@api_router.post("/analytics/classify", response_model=CaseRiskPrediction, dependencies=[Depends(require_roles("admin", "analyst"))])
async def classify_case_risk(body: CaseRiskFeatures):
    payload = {
        "prior_offenses": body.prior_offenses,
        "evidence_items": body.evidence_items,
        "witness_count": body.witness_count,
        "financial_red_flags": body.financial_red_flags,
        "digital_footprint_score": body.digital_footprint_score,
        "violent_history_score": body.violent_history_score,
        "cross_border_activity": int(body.cross_border_activity),
        "active_warrants": body.active_warrants,
    }
    prediction = predict_case_risk(payload)
    return CaseRiskPrediction(**prediction)


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=CONFIG.cors_origins,
    allow_methods=["GET", "POST", "PATCH", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "X-Request-Id"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)


@app.on_event("startup")
async def init_db():
    global client, db
    if not CONFIG.mongo_url:
        message = "MONGO_URL not set. Backend will run in degraded mode and DB-backed routes return 503."
        if CONFIG.environment == "production":
            raise RuntimeError(message)
        logger.warning(message)
        return

    client = AsyncIOMotorClient(CONFIG.mongo_url)
    db = client[CONFIG.db_name]
    await ensure_indexes()
    await ensure_seed_data()


@app.on_event("shutdown")
async def shutdown_db_client():
    global client
    if client:
        client.close()


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8002)
