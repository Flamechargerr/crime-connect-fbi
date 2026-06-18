# Crime Connect FBI

> A production-grade crime analytics and intelligence platform. Real Chicago data. Real ML. Zero gimmicks.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110-009688?logo=fastapi)](https://fastapi.tiangolo.com)
[![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com)
[![Python](https://img.shields.io/badge/Python-3.12-3776AB?logo=python)](https://python.org)

---

## What is this?

**Crime Connect FBI** is a full-stack crime analytics platform built for analysts who need real data, not neon cyberpunk UI fluff. It connects to the **Chicago Open Data Portal** (8M+ real crime records), runs a **Random Forest ML model** for threat prediction, and gives you a clean, professional dashboard for case management, data exploration, and mapping.

No fake "FBI-7734 agent names." No "TOP SECRET" banners. No 22MB synthetic model files. Just real engineering.

---

## What You Get

| Feature | Description |
|---------|-------------|
| **Live Crime Data** | Pulls real-time records from Chicago's Socrata API with filtering, pagination, and search |
| **Predictive Analytics** | Random Forest trained on 10,000 real incidents — predicts case priority with ~85% accuracy |
| **Interactive Crime Map** | Leaflet-powered heatmap with district clustering and type filtering |
| **Case Management** | Create, track, and manage internal cases with priorities and assignments |
| **Auto Reports** | Generate summary reports with top crime types, model accuracy, and trends |
| **Secure Auth** | JWT-based authentication with bcrypt hashing and role-based access |

---

## Quick Start

### Prerequisites
- Node.js 18+ and Python 3.10+
- Optional: MongoDB (not required — uses SQLite by default)

### 1. Clone & Setup
```bash
git clone https://github.com/Flamechargerr/crime-connect-fbi.git
cd crime-connect-fbi
```

### 2. Backend
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn backend.src.main:app --reload --port 8001
```
API docs: http://localhost:8001/docs

### 3. Frontend
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```
App: http://localhost:5173

---

## Deploy to Vercel

The frontend is ready for Vercel deployment with built-in demo fallback data (works without a backend).

### Option A: Vercel Dashboard (Recommended)
1. Go to [vercel.com](https://vercel.com) → Import your GitHub repo
2. **Project Settings → General → Root Directory**: Set to `frontend`
3. **Framework Preset**: Vite
4. **Build Command**: `npm run build`
5. **Output Directory**: `dist`
6. Add environment variable: `VITE_API_URL` = `https://your-backend-url.com` (or leave empty for demo mode)
7. Deploy

### Option B: Vercel CLI
```bash
npm i -g vercel
vercel --cwd frontend
```

The app will work immediately in **demo mode** — realistic Chicago crime data, working charts, case management, and ML predictions without any backend. When you connect a real backend, swap `VITE_API_URL` in the environment variables.

---

## Backend Deployment (Optional)

Deploy the backend to any platform that supports Python:

**Render / Railway / Fly.io**
```bash
cd backend
# Set environment variables:
# SECRET_KEY=your-random-secret
# DATABASE_URL=sqlite+aiosqlite:///./data/app.db
pip install -r requirements.txt
uvicorn backend.src.main:app --host 0.0.0.0 --port 8001
```

Then update the frontend's `VITE_API_URL` to point to your deployed backend.

```
crime-connect-fbi/
├── backend/              # FastAPI + SQLite + ML
│   ├── src/
│   │   ├── routers/      # API endpoints (auth, crimes, cases, predict, reports)
│   │   ├── services/     # Chicago data fetcher + ML engine
│   │   ├── models.py     # SQLAlchemy ORM
│   │   └── schemas.py    # Pydantic models
│   ├── data/             # SQLite (runtime only)
│   ├── models/           # Trained ML models (runtime only)
│   └── requirements.txt
├── frontend/             # React + Vite + Tailwind
│   ├── src/
│   │   ├── pages/        # All route pages
│   │   ├── components/   # UI + layout components
│   │   ├── context/      # Auth context
│   │   └── lib/          # API client + utilities
│   └── package.json
├── .github/workflows/    # CI/CD
├── design/               # Design system docs
└── README.md
```

---

## Tech Stack

**Frontend**
- React 19 + TypeScript + Vite
- Tailwind CSS 3.4 + custom dark theme
- shadcn/ui-inspired components (custom-built, no bloat)
- TanStack Query for data fetching
- Recharts for visualizations
- Leaflet + React-Leaflet for mapping
- Framer Motion for subtle animations

**Backend**
- FastAPI 0.110 + async/await
- SQLAlchemy 2.0 + aiosqlite (SQLite)
- Pydantic v2 + python-jose + passlib
- scikit-learn (Random Forest) + joblib
- httpx for external API calls
- Chicago Open Data Portal (Socrata)

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Get JWT token |
| GET | `/api/auth/me` | Current user |

### Crimes (Live Data)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/crimes` | Paginated records |
| GET | `/api/crimes/summary` | Aggregated stats |
| GET | `/api/crimes/trends` | Time-series data |
| GET | `/api/crimes/hotspots` | Map coordinates |

### Cases
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cases` | List cases |
| POST | `/api/cases` | Create case |
| GET | `/api/cases/{id}` | Case detail |
| PUT | `/api/cases/{id}` | Update case |
| DELETE | `/api/cases/{id}` | Delete case |

### Predictions
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/predict` | Run ML prediction |
| GET | `/api/predict/stats` | Model metrics |

---

## Environment Variables

Create `.env` files in both frontend and backend:

**Backend** (`backend/.env`)
```
SECRET_KEY=your-secret-key-here
DATABASE_URL=sqlite+aiosqlite:///./data/app.db
```

**Frontend** (`frontend/.env`)
```
VITE_API_URL=http://localhost:8001
```

---

## Why This Exists

The original `crime-connect-fbi` repo was an AI-generated mess: fake FBI agent names, broken links, 22MB synthetic model files, "TOP SECRET" banners, and a README that read like a chatbot hallucination. This rebuild fixes everything — real data, real ML, clean architecture, and a UI that looks like it was built by a senior developer, not a prompt engineer.

---

## License

MIT. Built by [Anamay Tripathy](https://github.com/Flamechargerr).
