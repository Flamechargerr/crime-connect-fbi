user_problem_statement:
- Critical frontend issue: React app not loading due to missing Vite proxy for /api -> backend:8001, and JSX conflicts.
- All UI features untestable as a result.

current_status_by_main_agent:
- Migrated the Vite React app to /app/frontend so supervisor can manage it on port 3000.
- Implemented minimal FastAPI backend at /app/backend with required '/api' prefix and added /api/health endpoint.
- Added backend requirements and installed them.
- Configured Vite dev server (and preview) on port 3000 with proxy for '/api' -> 'http://localhost:8001'.
- Restarted services via supervisor. Verified:
  * curl http://localhost:3000/api/health returns JSON {status: ok, ...}
  * App renders (Login screen visible).

repo_summary:
- Frontend (Vite + React + TS + Tailwind + shadcn) now in /app/frontend
- Backend (FastAPI) in /app/backend
- No DB integration yet; Auth is demo-only on frontend via context.

next_actions_proposed:
- Backend testing: Verify /api/health reliability (status code, JSON format, CORS headers) and that all routes are prefixed with /api.
- If approved by user, proceed to frontend tests (login demo flow, navigation rendering), then plan Supabase integration if required.

Testing Protocol:
- First run backend tests using deep_testing_backend_v2.
- After backend tests complete, ask user before running any frontend UI tests.

Incorporate User Feedback:
- The user approved migrating frontend and scaffolding backend. Planning Supabase later; for now, ensure working MVP with proxy.
