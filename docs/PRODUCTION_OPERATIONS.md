# CrimeConnect Production Operations Guide

## 1) Deployment target and scope

This repository is standardized for a three-environment deployment model:

- **dev**: engineer sandbox environment
- **staging**: pre-production validation environment
- **prod**: production environment

Recommended target stack:

- Frontend container (Nginx) behind CDN
- Backend FastAPI container
- Managed MongoDB-compatible database
- Secrets provided by environment-level secret manager

## 2) Non-functional requirements baseline

- **Security**: token auth for protected APIs, role-based authorization, strict CORS, security headers, request IDs, rate limiting
- **Availability**: backend and frontend services configured with restart policy
- **Latency**: API responses expected under 500ms for standard read operations under nominal load
- **Auditability**: request logging with request IDs and authentication checks
- **Recovery**: database backup/restore process documented below

## 3) Environment variables

### Backend required

- `APP_ENV` (`development|staging|production`)
- `MONGO_URL`
- `DB_NAME`
- `API_TOKEN_SECRET`
- `CORS_ORIGINS` (comma-separated)
- `APP_ADMIN_EMAIL`
- `APP_ADMIN_PASSWORD`
- `APP_ANALYST_EMAIL`
- `APP_ANALYST_PASSWORD`

### Backend optional

- `RATE_LIMIT_PER_MINUTE` (default: 120)
- `ACCESS_TOKEN_TTL_MINUTES` (default: 60)
- `SEED_DEMO_DATA` (`true|false`, default: `false`)

### Frontend required

- `VITE_BACKEND_URL` (must point to backend URL)

## 4) Build and deploy

### Local production-style build

```bash
cd <repository_root>

docker compose -f docker-compose.production.yml build

docker compose -f docker-compose.production.yml up -d
```

### Service URLs (default local mapping)

- Frontend: `http://localhost:8080`
- Backend: `http://localhost:8002/api/health`

## 5) Runtime checks

- Liveness: `GET /api/health`
- Readiness: `GET /api/readiness`

## 6) Backup and restore workflow (Mongo-compatible)

### Backup

```bash
mongodump --uri "$MONGO_URL" --archive=backup.archive --gzip
```

### Restore

```bash
mongorestore --uri "$MONGO_URL" --archive=backup.archive --gzip --drop
```

## 7) Incident runbook

1. Check frontend availability.
2. Check backend `/api/health` and `/api/readiness`.
3. Review backend logs for request IDs and failures.
4. Verify database connectivity and credentials.
5. If needed, perform rollback to previous container image and re-run readiness checks.
