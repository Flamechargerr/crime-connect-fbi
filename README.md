# CrimeConnect – Production-Ready Full-Stack Platform

CrimeConnect is a production-oriented full-stack investigation analytics platform with a React frontend and FastAPI backend.

## Production features implemented

- Token-based authentication (`/api/auth/*`) with role-based API authorization
- Strict runtime configuration for environment-specific behavior
- Security middleware: request IDs, security headers, API rate limiting, structured request logging
- Readiness and health endpoints for service orchestration
- Database index bootstrapping and controlled seed behavior
- Frontend integration with authenticated API client and backend-backed case management pages
- CI workflow for backend tests and frontend production build
- Containerization for frontend and backend deployment

## Repository layout

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

## Required environment variables

Backend:

- `APP_ENV`
- `MONGO_URL`
- `DB_NAME`
- `API_TOKEN_SECRET`
- `CORS_ORIGINS`
- `APP_ADMIN_EMAIL`
- `APP_ADMIN_PASSWORD`
- `APP_ANALYST_EMAIL`
- `APP_ANALYST_PASSWORD`

Frontend:

- `VITE_BACKEND_URL`

See `docs/PRODUCTION_OPERATIONS.md` for complete deployment/runbook details.

## Local validation commands

Backend tests:

```bash
cd backend
python -m unittest discover -s tests -v
```

Frontend production build:

```bash
cd frontend
npm run build
```

## Production-style containers

```bash
cd .

docker compose -f docker-compose.production.yml build

docker compose -f docker-compose.production.yml up -d
```
