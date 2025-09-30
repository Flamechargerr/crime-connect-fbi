# Crime Connect FBI — Mission Control Dashboard

Tactical, FBI-style mission control UI/UX for operations, intel, and case management. Built with React + Tailwind + shadcn/ui.

## ✨ What you get
- Dark, tactical UI with neon-emerald accents and monospace headings
- Sections: Hero, Ops Metrics, Intel Feed, Case Files (tabs), Timeline, Command Center form
- Smooth micro-interactions, accessible components (shadcn/ui), and clean layout
- Frontend-only mock data for an immediate “aha” demo

> Note: Data is currently mocked (frontend-only). Backend wiring comes next on request.

## 🔥 Live Demo
Once GitHub Pages workflow runs, your app will be available at:
https://flamechargerr.github.io/crime-connect-fbi/

We’ll also add a short demo GIF here after first deployment.

## 🧭 Screens & Behavior
- Hero: Mission status, CTA buttons (briefing & dossier)
- Ops Metrics: Open Cases, Active Ops, Alerts, Resolution Rate
- Intel Feed: Real-time style table with severity tags
- Case Files: Tabbed views (Active, Backlog, Archived)
- Timeline: Vertical activity timeline
- Command Center: Local-only form with progress “transmission” + toast feedback

## 🗃️ Mock Data
All mocks live in frontend/src/mock.js and are used across sections so we can later replace them with API data without touching UI.

## ⚙️ Tech Stack
- React 19, React Router
- TailwindCSS + shadcn/ui components
- lucide-react icons

## 🚀 Deploy to GitHub Pages (already configured)
This repo contains a GitHub Actions workflow at .github/workflows/gh-pages.yml.

How to deploy:
1) Push to main (or trigger workflow manually in Actions)
2) In Repo Settings → Pages: Set Source = GitHub Actions (first time only)
3) Wait ~1–2 minutes for build + deploy
4) Visit https://flamechargerr.github.io/crime-connect-fbi/

No gh-pages NPM package required — this uses the official Pages workflow.

## 🛠️ Local Development
- Install: yarn (from repo root will not install; use folder)
  - cd frontend && yarn
- Run: yarn start
- Build: yarn build

Front and back are hot-reload enabled in the Emergent environment.

## 🔗 Backend (next step)
When you’re ready, I’ll create contracts.md, then build FastAPI models + CRUD, and replace mocks with real API calls under /api/* (as required by ingress rules). Mongo usage will respect MONGO_URL from backend/.env only.

## 📸 Demo GIF
Coming right after first Pages deploy — I’ll record a short flow (scroll, tab switch, form submit) and add it here.

## ✅ Accessibility & Design Notes
- Avoids purple/blue gradients; uses muted dark with emerald accents
- Uses lucide-react icons (no emojis in UI). Emojis reserved for README only.
- Inline editing patterns, minimal modals, high contrast text, natural focus rings

---
Built with care — ready to extend into a production-grade MVP.