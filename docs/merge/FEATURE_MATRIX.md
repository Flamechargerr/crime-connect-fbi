# CrimeConnect ↔ ai-hideout-helper feature matrix

Status legend:
- `Current`: implemented in this repo now.
- `Import`: should come from `ai-hideout-helper` (source repo accessible; staged import pending).
- `Unified`: final canonical implementation after merge.

| Domain | Current (crime-connect-fbi) | ai-hideout-helper | Decision | Notes |
|---|---|---|---|---|
| Auth | Supabase Auth + role table (`user_roles`) | Pending source | Unified | Keep Supabase session model unless stronger backend auth is provided. |
| Profiles | `profiles` table + self-service update | Pending source | Unified | Preserve profile metadata compatibility. |
| Case management | `cases`, `case_criminals`, add/list/detail screens | Pending source | Unified | Use existing UUID-based schema as canonical base. |
| Criminal intelligence | `criminals` + Most Wanted + globe/corkboard views | Pending source | Unified | Keep threat/status enums and enrich from incoming features. |
| Evidence | `evidence` table + listing + case detail linkage | Pending source | Unified | Keep chain-of-custody JSON shape stable. |
| Officers | `officers` table + assignment in case creation | Pending source | Unified | Preserve assigned officer foreign-key model. |
| Dashboard/reporting | KPI cards + chart pages + hideouts view | Pending source | Unified | Hideouts route added in current shell with schema-adapted telemetry and recommendation scoring. |
| Routing/layout | React Router + protected layout shell | Pending source | Canonical current | Keep single app shell to avoid duplicate navigation systems. |
| API/persistence | Supabase/Postgres + RLS policies | Pending source | Canonical current | Migrate external API features into this data model where feasible. |
| CI quality gates | None in repo yet | Pending source | Unified | Add lint/build workflow now; extend with tests when available. |
| Deployment/runbook | README only | Pending source | Unified | Add explicit runbook and smoke-test checklist. |

## Source-of-truth decisions (current)
1. Frontend routing + app shell: `src/App.tsx` and layout components.
2. Auth/session + role model: Supabase auth + `public.user_roles`.
3. Data model and authorization: `supabase/migrations/*.sql` with RLS policies.
4. Integration staging: `legacy/ai-hideout-helper/source/` (source access verified).

## First-wave migration targets from accessible source
1. ✅ **Hideouts domain** (`src/routes/hideouts.tsx`, tactical map/globe components) → initial route integrated as `/hideouts` in current React Router shell using existing `cases/criminals` telemetry.
2. **Intel domain** (`src/routes/intel.tsx`) → merge into current dashboard/reporting pathways.
3. **Agents domain** (`src/routes/agents.tsx`) → map into current officers/personnel model.
4. **Auth screen variants** (`login.tsx`, `signup.tsx`, `AuthGuard.tsx`) → evaluate only for UX parity; keep current Supabase session contract.
