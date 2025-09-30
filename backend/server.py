import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# IMPORTANT: All backend API routes MUST be prefixed with '/api'
app = FastAPI(title="CrimeConnect Backend")

# CORS: Allow frontend origin(s). In cluster, ingress handles, but keep permissive for dev.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
async def health():
    return {
        "status": "ok",
        "service": "backend",
        "mongo_url_configured": bool(os.environ.get("MONGO_URL")),
    }

# Keep the server bound by supervisor to 0.0.0.0:8001 (do not run uvicorn here)
