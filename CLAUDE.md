# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

A cheatsheet site for EA Sports UFC 4 & 5: compare two fighters' stats and perks side by side, browse their moves, and create, edit or delete fighters. It is a TypeScript/Next.js rewrite of an earlier vanilla-JS version.

The full documentation is in `docs/`. Read the relevant doc before changing that area, and update it in the same change:
- `docs/architecture.md`: layout, client data flow, wizard form, styling
- `docs/api.md`: endpoints and their quirks
- `docs/configuration.md`: every environment variable
- `docs/data-and-seeding.md`: the fighter shape, seeding, default fighter IDs
- `docs/deployment.md`: Docker, CI/CD, VPS constraints
- `docs/issues.md`: known bugs and gaps (remove an item in the change that fixes it)
- `docs/decisions/`: records of why things are the way they are (add a new one for a significant decision)

## Commands

This is an npm workspaces monorepo (`client`, `server`). Run commands from the repo root.

```bash
npm install                              # install all workspaces
npm run dev --workspace=client           # Next.js dev server (port 3000)
npm run dev --workspace=server           # Express API via `tsx watch` (port 5000)
npm run build --workspace=client
npm run build --workspace=server         # bundle server/src into server/dist/server.js (esbuild)
npm run start --workspace=server         # run the bundle with node
npm run seed --workspace=server          # wipe the fighters collection and reseed it from server/seed/fighters.json
npm run lint --workspace=client          # next lint (client only; the server has no linter)
npx tsc --noEmit -p client               # type-check the client
npx tsc --noEmit -p server               # type-check the server
```

There is no test framework or test suite.

## Rules and gotchas

- **Env:** server code reads `env` from `server/src/config/env.ts`, never `process.env`. `NEXT_PUBLIC_API_URI` must include the `/api` suffix. Never hardcode connection strings, secrets or CORS origins, and never give them defaults.
- **Fighter shape:** when you change it, update `shared/types.ts`, `server/src/models/fighter.model.ts`, `FighterForm` in `client/src/types/component.ts`, and `client/src/mapper/createFighterForm.ts` together.
- **IDs are numbers, not ObjectIds.** Controllers convert `req.params.id` with `Number(...)`. `defaultFighters` in `client/src/pages/index.tsx` hardcodes IDs, and those IDs must exist in `server/seed/fighters.json`.
- **API:** create and edit return only the `_id`. `GET /api/fighters` returns every fighter, so keep `.lean()`. `/health` must not touch the database.
- **Client writes** call `apiClient` directly, then invalidate `["fighters"]` and `["fighter", id]` by hand.
- **Wizard move values** are `"<path>:<name>"` strings that `handleMoveAddition` splits.
- **Tailwind:** class names built at runtime must be added to `safelist` in `client/tailwind.config.ts`.
- **CI:** `.github/workflows/deploy.yml` is managed separately. Don't add CI files unless asked.

## Production constraints (shared 2 GB VPS)

- The container has a 256 MB limit and runs with `--max-old-space-size=192`. Avoid large in-memory caches and loading big datasets at once, and flag any feature that needs more.
- Nothing persists on local disk, which is why seeding is automatic. Logs go to stdout and stderr only. File storage would need external object storage (ask first).
- Caddy terminates TLS, so the app serves plain HTTP.
- The server handles SIGTERM with `disconnectDB()`, which stops the `disconnected` listener from reconnecting during shutdown. Keep that behaviour.
