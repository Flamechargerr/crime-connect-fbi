# Deployment runbook

## 1) Prerequisites
- Node.js 20+
- npm 9+
- Supabase project with schema migration access

## 2) Environment variables
Set in deployment platform and local `.env`:

- `VITE_SUPABASE_URL` (required)
- `VITE_SUPABASE_PUBLISHABLE_KEY` (required)
- `VITE_APP_ENV` (`development` | `staging` | `production`, optional)

## 3) Build and verify
```bash
npm ci
npm run build
```

## 4) Database migration
Apply SQL in:
- `supabase/migrations/20260417064133_91924afc-5862-4f6e-b088-910d9aeb612a.sql`

Validate:
- tables exist (`profiles`, `user_roles`, `cases`, `criminals`, `evidence`, `officers`)
- RLS policies are enabled and active

## 5) Smoke tests (post-deploy)
1. Open `/health` and confirm `status: healthy`.
2. Register a new account.
3. Login and reach `/dashboard`.
4. Create a case from `/cases/add`.
5. Create a criminal from `/criminals/add`.
6. Open `/cases/:id` and confirm evidence/criminal relations render.

## 6) Rollback
1. Re-deploy previous frontend build artifact/version.
2. If schema rollback is needed, restore from Supabase backup/snapshot.
3. Re-run smoke tests for auth + dashboard + cases list.

## 7) Operational checks
- Monitor client error logs for auth/session issues.
- Track failed Supabase requests from browser console logging.
- Verify `/health` endpoint remains reachable from uptime checks.
