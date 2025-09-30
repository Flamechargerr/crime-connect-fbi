# Crime Connect FBI — Mission Control Dashboard

Tactical, FBI-style mission control UI/UX for operations, intel, and case management. Built with React + Tailwind + shadcn/ui.

## ✨ What you get
- Dark, tactical UI with neon-emerald accents and monospace headings
- Sections: Hero, Ops Metrics, Intel Feed, Case Files (tabs), Timeline, Command Center form
- Smooth micro-interactions, accessible components (shadcn/ui), and clean layout
- Frontend uses backend when available and gracefully falls back to mocked data when offline (GitHub Pages)

> Note: Backend is optional. If FastAPI isn’t configured, the UI auto-falls back to mocks.

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
- Command Center: Form with progress + toast; posts to /api/command when backend exists, otherwise stores locally

## 🗃️ Mock Data
All mocks live in frontend/src/mock.js and are used across sections so we can later replace them with API data without touching UI.

## ⚙️ Tech Stack
- React 19, React Router (HashRouter for GH Pages)
- TailwindCSS + shadcn/ui components
- lucide-react icons
- FastAPI backend (optional now; endpoints scaffolded, see contracts.md)

## 🚀 Deploy to GitHub Pages (already configured)
This repo contains a GitHub Actions workflow at .github/workflows/gh-pages.yml.

How to deploy:
1) Push to main (or trigger workflow manually in Actions)
2) In Repo Settings → Pages: Set Source = GitHub Actions (first time only)
3) Wait ~1–2 minutes for build + deploy
4) Visit https://flamechargerr.github.io/crime-connect-fbi/

Notes:
- We use HashRouter, so refreshes work on GitHub Pages.
- PUBLIC_URL is set to /crime-connect-fbi during build for correct asset paths.

## 🛠️ Local Development
- Install: cd frontend && yarn
- Run: yarn start
- Build: yarn build

## 🔗 Backend (when you want it)
- See /app/contracts.md for API contracts
- FastAPI endpoints implemented under /api/* (metrics, intel, cases, timeline, command)
- They return 503 until MONGO_URL is set in backend/.env. When ready, I’ll wire env and complete integration tests.

## 📸 Demo GIF
Coming right after first Pages deploy — I’ll record a short flow (scroll, tab switch, form submit) and add it here.

## ✅ Accessibility & Design Notes
- Avoids purple/blue gradients; uses muted dark with emerald accents
- Uses lucide-react icons (no emojis in UI). Emojis reserved for README only.
- Inline editing patterns, minimal modals, high contrast text, natural focus rings

---
Built with care — ready to extend into a production-grade MVP.