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
| Dashboard/reporting | KPI cards + chart pages | Pending source | Unified | Prefer existing route shell and expand widgets from import. |
| Routing/layout | React Router + protected layout shell | Pending source | Canonical current | Keep single app shell to avoid duplicate navigation systems. |
| API/persistence | Supabase/Postgres + RLS policies | Pending source | Canonical current | Migrate external API features into this data model where feasible. |
| CI quality gates | None in repo yet | Pending source | Unified | Add lint/build workflow now; extend with tests when available. |
| Deployment/runbook | README only | Pending source | Unified | Add explicit runbook and smoke-test checklist. |

## Source-of-truth decisions (current)
1. Frontend routing + app shell: `src/App.tsx` and layout components.
2. Auth/session + role model: Supabase auth + `public.user_roles`.
3. Data model and authorization: `supabase/migrations/*.sql` with RLS policies.
4. Integration staging: `legacy/ai-hideout-helper/source/` (pending source access).
