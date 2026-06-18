# Crime Connect FBI — Backend

FastAPI backend with real-time Chicago crime data, ML predictions, and case management.

## Quick Start

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn backend.src.main:app --reload --port 8001
```

API docs: http://localhost:8001/docs

## Environment Variables

```bash
SECRET_KEY=your-secret-key-here
DATABASE_URL=sqlite+aiosqlite:///./data/app.db
```

## Architecture

- `src/routers/` — API endpoints (auth, cases, crimes, predictions, reports)
- `src/services/` — Business logic (Chicago data fetcher, ML engine)
- `src/models.py` — SQLAlchemy ORM models
- `src/schemas.py` — Pydantic request/response models
- `data/` — SQLite database (runtime only)
- `models/` — Trained ML models (runtime only)
