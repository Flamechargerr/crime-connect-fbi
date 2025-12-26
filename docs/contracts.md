# Crime Connect FBI – API Contracts

This document defines API contracts, current mocked data mapping, and the backend plan to integrate the frontend UI.

## A) API Contracts (all routes prefixed with /api)

- GET /api/metrics → 200 OK
  - Response: {
      open_cases: number,
      active_ops: number,
      alerts_today: number,
      resolution_rate: number
    }

- GET /api/intel → 200 OK
  - Query: none (future: pagination)
  - Response: Array<IntelEvent>

- POST /api/intel → 201 Created
  - Body: { title: string, severity: "low|medium|high|critical", tags: string[] }
  - Response: IntelEvent

- GET /api/cases → 200 OK
  - Query: status? = active|backlog|archived (optional)
  - Response: Array<CaseFile>

- POST /api/cases → 201 Created
  - Body: { title: string, status: string, priority: string, owner: string, notes?: number }
  - Response: CaseFile

- PATCH /api/cases/{id} → 200 OK
  - Body: Partial<CaseFile> (title/status/priority/owner/notes)
  - Response: CaseFile

- GET /api/timeline → 200 OK
  - Response: Array<TimelineEvent>

- POST /api/timeline → 201 Created
  - Body: { type: string, text: string }
  - Response: TimelineEvent

- POST /api/command → 201 Created
  - Body: { codename: string, agent: string, channel: string, message: string }
  - Response: CommandTransmission

- GET /api/command → 200 OK
  - Response: Array<CommandTransmission>

Types:
- IntelEvent { id: string, title: string, severity: string, tags: string[], created_at: string }
- CaseFile { id: string, title: string, status: string, priority: string, owner: string, updated_at: string, notes: number }
- TimelineEvent { id: string, type: string, text: string, created_at: string }
- CommandTransmission { id: string, codename: string, agent: string, channel: string, message: string, created_at: string }

## B) What’s mocked now (frontend/src/mock.js)
- opsMetrics, intelFeed, caseFiles, timeline, agents
- Command form currently only saves to localStorage and simulates a progress bar. No real network request.

## C) Backend implementation plan
- Add MongoDB collections: cases, intel_events, timelines, transmissions
- Startup seeding with a small static dataset so the UI isn’t empty at first run
- Implement above CRUD endpoints; compute /api/metrics on the fly
- Keep existing /api/status for health sample
- Ensure CORS and prefix already configured

## D) Integration
- Create frontend/src/lib/api.js to read base URL from process.env.REACT_APP_BACKEND_URL (fallback to import.meta.env if available)
- Replace all mock reads in App.js with API calls:
  - GET metrics → Ops cards
  - GET intel → Intel Feed table
  - GET cases (once, no filter on BE; filter client-side for tabs or use status query)
  - GET timeline → Timeline list
  - POST command → On form submit; still persist a copy to localStorage for UX

After this, mocks will be removed from runtime (file kept only for reference).