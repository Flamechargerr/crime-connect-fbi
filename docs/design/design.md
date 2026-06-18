# Crime Connect FBI — Design System

## Product Concept
A production-grade crime analytics and intelligence platform. Think **Palantir Gotham** meets **Bloomberg Terminal** — dense, purposeful, and authoritative. No gimmicks. No fake "FBI classified" badges. Real data, real insights, real utility.

**Target user:** Law enforcement analysts, data journalists, public safety researchers, and citizens interested in crime trends.

**Data source:** Chicago Crime Data API (Socrata/Open Data) — 8M+ real records, no API key required, fully public.

**Name:** Crime Connect FBI — clean, serious, no gimmicks.

---

## Page / Route Map

| Route | Purpose | Auth |
|---|---|---|
| `/` | Public landing — hero, feature grid, CTA to demo | Public |
| `/login` | JWT auth entry | Public |
| `/register` | Account creation | Public |
| `/dashboard` | Main analytics — KPIs, trends, recent incidents | Required |
| `/data` | Live data browser — table with search, filter, pagination | Required |
| `/map` | Interactive crime heatmap (Leaflet) | Required |
| `/cases` | Internal case management (SQLite) | Required |
| `/cases/:id` | Case detail view | Required |
| `/cases/new` | Create new case | Required |
| `/predictions` | ML threat prediction trained on real Chicago data | Required |
| `/reports` | Auto-generated PDF/markdown reports | Required |
| `/profile` | User settings | Required |

---

## Color Palette

Dark is the only canonical theme. Light mode is not required.

```css
:root {
  --background: 220 13% 5%;        /* #0a0a0f */
  --foreground: 220 10% 96%;       /* #f4f4f5 */
  --card: 220 13% 8%;              /* #111118 */
  --card-elevated: 220 12% 11%;    /* #18181f */
  --popover: 220 13% 8%;
  --primary: 210 100% 56%;           /* #0ea5e9 */
  --primary-foreground: 0 0% 100%;
  --secondary: 220 12% 14%;        /* #1e1e26 */
  --secondary-foreground: 220 10% 96%;
  --muted: 220 12% 18%;            /* #272730 */
  --muted-foreground: 220 10% 55%; /* #8a8a99 */
  --accent: 210 100% 56%;
  --accent-foreground: 0 0% 100%;
  --destructive: 0 72% 51%;        /* #dc2626 */
  --destructive-foreground: 0 0% 100%;
  --warning: 38 92% 50%;           /* #f59e0b */
  --warning-foreground: 0 0% 0%;
  --success: 142 76% 36%;          /* #16a34a */
  --success-foreground: 0 0% 100%;
  --border: 220 12% 16%;           /* #22222a */
  --input: 220 12% 14%;
  --ring: 210 100% 56%;
  --radius: 0.5rem;

  --sidebar-bg: 220 13% 6%;
  --sidebar-fg: 220 10% 88%;
  --sidebar-primary: 210 100% 56%;
  --sidebar-border: 220 12% 14%;
}
```

No neon glows. No scan lines. No grid backgrounds. Subtlety is the point.

---

## Typography

- **Primary:** `Inter` (300, 400, 500, 600, 700)
- **Monospace:** `JetBrains Mono` (400, 500) — only for data, timestamps, case numbers
- **Scale:** `text-xs` for metadata, `text-sm` for body, `text-base` for labels, `text-lg` for section headers, `text-2xl` for page titles
- **Case numbers & timestamps:** `font-mono text-xs uppercase tracking-wider text-muted-foreground`

---

## Layout Rules

- **Sidebar:** 240px fixed, collapsible to 64px on desktop. Hidden on mobile (drawer).
- **Content:** `max-w-7xl mx-auto p-6` on desktop, `p-4` on mobile.
- **Cards:** `rounded-lg border border-border bg-card` — no gradient backgrounds, no hover glows. Subtle `hover:border-primary/30` transition.
- **Grid:** Dashboard uses `grid-cols-2 lg:grid-cols-4` for KPIs, `lg:grid-cols-3` for charts + list.
- **Spacing:** `space-y-6` between major sections, `gap-4` for grids.

---

## Shared Components

- **AppSidebar:** Navigation with icons + labels. Active state uses `bg-primary/10 text-primary` not neon borders.
- **TopBar:** Breadcrumb, search input, user avatar dropdown, notification bell.
- **KpiCard:** Icon + number + label + small trend indicator. No fake deltas — show real computed trends from data.
- **DataTable:** Shadcn Table with sorting, filtering, pagination. Used on `/data` and `/cases`.
- **ChartCard:** Recharts wrapper with consistent tooltip styling.
- **PageHeader:** Title + description + optional action button.
- **EmptyState:** Icon + message + CTA for no data scenarios.
- **LoadingState:** Skeleton screens, not spinners.

---

## Animation Language

- **Entrance:** `opacity 0→1`, `translateY 4px→0`, `duration 300ms`, `ease-out`.
- **Hover:** `border-color transition 200ms`, `background-color transition 200ms`. No scale transforms.
- **Loading:** Skeleton shimmer `animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite`.
- **Page transitions:** None. React Router instant switch is fine for a tool.
- **Toast notifications:** `sonner` with `position: bottom-right`.

---

## Dependencies

### Backend
- `fastapi`, `uvicorn`, `python-multipart`
- `sqlalchemy`, `alembic` (SQLite)
- `pydantic`, `pydantic-settings`
- `httpx` (for Chicago API calls)
- `pandas`, `scikit-learn`, `joblib` (real ML on real data)
- `python-jose`, `passlib` (JWT auth)
- `pytest`, `httpx` (for testing)

### Frontend
- `react`, `react-dom`, `react-router-dom`
- `vite`, `@vitejs/plugin-react-swc`
- `tailwindcss`, `postcss`, `autoprefixer`
- `shadcn/ui` components (card, button, input, table, badge, dialog, dropdown, select, tabs, toast, tooltip, skeleton, pagination, sheet, scroll-area, separator, avatar, checkbox, calendar, popover, command)
- `lucide-react`
- `@tanstack/react-query`
- `recharts`
- `framer-motion` (minimal use — only for entrance animations)
- `leaflet`, `react-leaflet` (map page)
- `date-fns`
- `zod`, `react-hook-form`, `@hookform/resolvers`
- `sonner`
- `tailwind-merge`, `clsx`, `class-variance-authority`

---

## Asset Manifest

- No custom images needed. Landing page uses abstract geometric SVG shapes (code-generated).
- Map page uses standard OpenStreetMap tiles via Leaflet.
- Favicon: simple shield/badge icon (Lucide `Shield` rendered as SVG).

---

## API Contract (Backend ↔ Frontend)

### Auth
- `POST /api/auth/register` → `{ email, password, name }` → `{ access_token, token_type }`
- `POST /api/auth/login` → `{ email, password }` → `{ access_token, token_type }`
- `GET /api/auth/me` → `Authorization: Bearer <token>` → `{ id, email, name, role }`

### Chicago Data (Live)
- `GET /api/crimes?limit=50&offset=0&type=THEFT&date_from=2024-01-01` → paginated crime records
- `GET /api/crimes/summary` → aggregated stats (total, by type, by district, trends)
- `GET /api/crimes/hotspots` → lat/lng coordinates for map clustering
- `GET /api/crimes/trends?group_by=month` → time-series data for charts

### Cases (Internal)
- `GET /api/cases` → list user's cases
- `POST /api/cases` → create case
- `GET /api/cases/:id` → case detail
- `PUT /api/cases/:id` → update case
- `DELETE /api/cases/:id` → delete case

### Predictions
- `POST /api/predict` → `{ hour, district, crime_type, arrest_history }` → `{ priority, confidence, probabilities }`
- `GET /api/predict/stats` → model performance metrics

### Reports
- `GET /api/reports/summary` → generated report data
- `POST /api/reports/generate` → trigger report generation

### Health
- `GET /api/health` → `{ status, database, model, data_source }`

---

## Worker Grouping

1. **Backend worker:** FastAPI server, SQLite schema, Chicago data fetcher, auth, ML model training
2. **Scaffold worker:** Vite + Tailwind + shadcn setup, global theme, layout, routing, auth context
3. **Dashboard worker:** Dashboard page with real KPIs, charts, recent data
4. **Data & Map worker:** Data table page + Leaflet map with crime hotspots
5. **Cases & Forms worker:** Case CRUD pages, forms, detail view
6. **Predictions & Reports worker:** Prediction console, reports page
7. **Landing & Auth worker:** Public landing page, login/register pages
8. **Integration:** README, CI/CD, final polish
