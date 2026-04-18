# ai-hideout-helper integration status

## Objective
Import and merge `ai-hideout-helper` features into this repository in a controlled way.

## Current status (2026-04-18)
- The referenced repository `Flamechargerr/ai-hideout-helper` is now accessible from this environment.
- Root content and `package.json` are readable via GitHub API.
- Repository cloning is still disallowed in this environment, so source staging must use GitHub API file reads or a user-provided export.
- First-wave route/component snapshots are staged under `legacy/ai-hideout-helper/source/src/` for audited porting.

## Import readiness notes
1. Source stack differs from current app shell:
   - `ai-hideout-helper`: TanStack Start/Router + Vite 7 + React 19
   - `crime-connect-fbi`: React Router + Vite 5 + React 18
2. A committed `.env` file exists in `ai-hideout-helper`; secrets/config material must not be imported into tracked files.
3. Immediate merge should prioritize feature-level migration over framework replacement.

## Next actions
1. Map staged incoming routes/pages/components to existing React Router structure using `docs/merge/FEATURE_MATRIX.md`.
2. Exclude `.env` and any secret-bearing configuration from import.
3. Incrementally port feature modules into canonical current shell and Supabase data model.
4. Start with hideouts/intel/agents UI and adapt data contracts to existing schema + RLS policies.

## Integration target location
When source is available, imported files should be staged under:
- `legacy/ai-hideout-helper/source/`

This keeps migration auditable and prevents accidental overwrite of production paths.
