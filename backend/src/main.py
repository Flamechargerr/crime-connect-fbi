from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from backend.src.database import init_db
from backend.src.routers import auth, cases, crimes, predict, reports
from backend.src.config import get_settings

settings = get_settings()

@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield

app = FastAPI(
    title=settings.APP_NAME,
    description="Production-grade crime analytics platform with real-time Chicago data, ML predictions, and case management.",
    version=settings.APP_VERSION,
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(cases.router)
app.include_router(crimes.router)
app.include_router(predict.router)
app.include_router(reports.router)

@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "database": True,
        "model": True,
        "data_source": True,
        "version": settings.APP_VERSION,
    }

@app.get("/")
async def root():
    return {"message": "Crime Connect FBI API", "version": settings.APP_VERSION, "docs": "/docs"}
