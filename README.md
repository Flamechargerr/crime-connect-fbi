# 🕵️‍♂️ CrimeConnect – Production-Ready Full-Stack Platform

<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=700&size=22&pause=1200&color=00E5FF&center=true&vCenter=true&width=980&lines=%F0%9F%94%90+CLASSIFIED+%7C+FBI+CYBER+DIVISION+%7C+CRIMECONNECT;%F0%9F%96%A5%EF%B8%8F+React+Frontend+%2B+FastAPI+Backend;%F0%9F%9A%A8+Not+just+connecting+clues+%E2%80%94+connecting+dots+with+data" alt="CrimeConnect classified hero" />
</p>

> 🚨 **TOP SECRET // FBI CYBER DIVISION // OPERATION CRIMECONNECT**  
> 🔎 Mission Tagline: **Not just connecting clues — connecting dots with data.**

CrimeConnect is a production-oriented full-stack investigation analytics platform with a React frontend and FastAPI backend.

## ⚙️ Production features implemented

| 🧩 Capability | 🔐 Operational detail |
| --- | --- |
| 🕵️‍♂️ Authentication & authorization | Token-based authentication (`/api/auth/*`) with role-based API authorization |
| 🌐 Runtime controls | Strict runtime configuration for environment-specific behavior |
| 🛡️ Security middleware | Request IDs, security headers, API rate limiting, structured request logging |
| ❤️ Service health | Readiness and health endpoints for service orchestration |
| 🗃️ Data readiness | Database index bootstrapping and controlled seed behavior |
| 🖥️ Frontend integration | Authenticated API client and backend-backed case management pages |
| 🚦 CI pipeline | CI workflow for backend tests and frontend production build |
| 🐳 Deployment strategy | Containerization for frontend and backend deployment |

## 🏢 Repository layout

```text
backend/
  server.py
  requirements.txt
  Dockerfile
  tests/
frontend/
  src/
  Dockerfile
  nginx.conf
.github/workflows/
  ci.yml
docs/
  PRODUCTION_OPERATIONS.md
```

## 🔐 Required environment variables

<details>
<summary><strong>Backend variables 🕵️‍♂️</strong></summary>

| Variable | Purpose |
| --- | --- |
| `APP_ENV` | Application environment selection |
| `MONGO_URL` | MongoDB connection URI |
| `DB_NAME` | Target database name |
| `API_TOKEN_SECRET` | Token signing secret |
| `CORS_ORIGINS` | Allowed frontend origins |
| `APP_ADMIN_EMAIL` | Seed/admin account email |
| `APP_ADMIN_PASSWORD` | Seed/admin account password |
| `APP_ANALYST_EMAIL` | Seed/analyst account email |
| `APP_ANALYST_PASSWORD` | Seed/analyst account password |

</details>

<details>
<summary><strong>Frontend variables 🖥️</strong></summary>

| Variable | Purpose |
| --- | --- |
| `VITE_BACKEND_URL` | Backend API base URL |

</details>

> 📘 See `docs/PRODUCTION_OPERATIONS.md` for complete deployment/runbook details.

## 🚨 Local validation commands

<details open>
<summary><strong>Run local mission checks ⚙️</strong></summary>

| Check | Command |
| --- | --- |
| Backend tests | `cd backend && python -m unittest discover -s tests -v` |
| Frontend production build | `cd frontend && npm run build` |

```bash
cd backend
python -m unittest discover -s tests -v

cd frontend
npm run build
```

</details>

## 🐳 Production-style containers

> 🏢 Deploy both services with production compose settings.

```bash
cd .

docker compose -f docker-compose.production.yml build

docker compose -f docker-compose.production.yml up -d
```
