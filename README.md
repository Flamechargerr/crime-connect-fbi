# CrimeConnect — Clean, Professional Dashboard

A refined, production‑ready React + FastAPI + MongoDB starter focused on clarity and usability. The UI adopts a modern, neutral design (auto light/dark) with accessible components and consistent spacing.

## Highlights
- Clean, professional visual design (system light/dark, subtle borders, clear hierarchy)
- React + Vite + Tailwind + shadcn/ui component patterns
- Ready FastAPI backend with /api prefix and MongoDB models (UUIDs only)
- Sensible auth shell (demo login) with protected routing

## Screenshots
> The following images illustrate the core areas of the app. (provided by you)
- Dashboard: https://customer-assets.emergentagent.com/job_6c7378a1-9e3e-45bb-a9a3-4c6db8ffca0b/artifacts/8q7odfrq_image.png
- Reports: https://customer-assets.emergentagent.com/job_6c7378a1-9e3e-45bb-a9a3-4c6db8ffca0b/artifacts/39184krj_image.png
- Investigation Board: https://customer-assets.emergentagent.com/job_6c7378a1-9e3e-45bb-a9a3-4c6db8ffca0b/artifacts/h2mqmzro_image.png

## Quickstart

- Frontend
  - cd frontend
  - yarn
  - yarn start (hot reload)

- Backend
  - Ensure backend/.env contains MONGO_URL (we only read env, never hardcode)
  - Supervisor runs FastAPI on 0.0.0.0:8001 internally (do not change)
  - All routes must start with /api to pass ingress

- Environment rules (critical)
  - Frontend must call process.env.REACT_APP_BACKEND_URL or import.meta.env.REACT_APP_BACKEND_URL
  - Do not hardcode URLs or ports
  - Never edit .env values via code — only use what's already provided

## Demo GIFs
We’ll attach short clips demonstrating navigation and theme toggle in this section.

Suggested clips (to be recorded from the running app):
- 10s: Login → Dashboard → Cases navigation
- 8s: Theme switch (system/auto + manual toggle)
- 8s: Investigation board interactions (drag, zoom)

Placeholders (replace later):
- assets/demo-dashboard.gif
- assets/demo-corkboard.gif

## Architecture
- Frontend: React 18, Vite, Tailwind 3, shadcn/ui, Radix primitives
- State/data: TanStack Query for data fetching/cache; context for demo auth
- Backend: FastAPI with /api router, MongoDB via motor (UUIDs, no ObjectId leakage)
- Ingress: All API traffic under /api prefix → port 8001; frontend → port 3000

## API Contracts (summary)
- GET /api/metrics → { open_cases, active_ops, alerts_today, resolution_rate }
- GET/POST /api/intel → list/create intel events
- GET/POST/PATCH /api/cases → list/create/update cases
- GET/POST /api/timeline → list/create timeline events
- GET/POST /api/command → list/create command center messages

All responses use string UUIDs. Backend reads MONGO_URL from backend/.env, never from code.

## Design System
- Typography: system default with improved leading; Inter can be added if desired
- Spacing scale: 4/6/8/12/16 with max content width at 1280px
- Color tokens: defined in src/index.css with light/dark themes
- Components: card-pro, input-pro, btn-pro utility patterns

## Local Development
- Frontend
  - yarn start → http://localhost:3000
  - REACT_APP_BACKEND_URL must be set in frontend/.env (already configured in deployment)

- Backend
  - Uses supervisor; check logs if needed
  - tail -n 100 /var/log/supervisor/backend.*.log

## Testing
- Backend tests first (deep testing agent)
- Frontend tests on request (Playwright)

## Deployment Notes
- Keep all backend routes prefixed with /api
- Do not modify ports or .env
- Frontend calls backend using REACT_APP_BACKEND_URL exclusively

---
If you want a brand color or font applied globally, share a hex and font, and I’ll wire it in.