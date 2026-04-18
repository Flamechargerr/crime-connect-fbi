# ai-hideout-helper staged inventory

Source repository:
- `Flamechargerr/ai-hideout-helper`
- Snapshot ref: `1e72d02bff159468a3f9e7b1300acdf517e344c2`

## Safety filters for staged import
- Do **not** import `.env` or any secrets-bearing configuration.
- Use staged path only: `legacy/ai-hideout-helper/source/`.
- Keep imported files as audit artifacts until feature-level migration is completed.

## Top-level source tree (snapshot)
- `.gitignore`
- `.lovable/`
- `.prettierignore`
- `.prettierrc`
- `bun.lockb`
- `bunfig.toml`
- `components.json`
- `eslint.config.js`
- `package-lock.json`
- `package.json`
- `src/`
- `supabase/`
- `tsconfig.json`
- `vite.config.ts`
- `wrangler.jsonc`

## Route candidates discovered (`src/routes`)
- `agents.tsx`
- `cases.tsx`
- `criminals.tsx`
- `dashboard.tsx`
- `evidence.tsx`
- `hideouts.tsx`
- `index.tsx`
- `intel.tsx`
- `login.tsx`
- `signup.tsx`

## Component candidates discovered (`src/components`)
- `AuthGuard.tsx`
- `LiveClock.tsx`
- `PortalLayout.tsx`
- `TacticalGlobe.client.tsx`
- `TacticalGlobe.tsx`
- `TacticalMap.client.tsx`
- `TacticalMap.tsx`
- `ThreatLevel.tsx`
- `ui/`

## Notable stack differences
- Source app uses TanStack Router/Start + React 19 + Vite 7.
- Current app uses React Router + React 18 + Vite 5.
- Integration should remain feature-level migration into current canonical shell.
