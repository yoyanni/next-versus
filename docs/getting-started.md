# Getting started

## Prerequisites

- Node 22 (the production image uses `node:22-alpine`)
- A MongoDB instance: local, Docker (`docker run -d -p 27017:27017 mongo`) or Atlas

## Install

This is an npm workspaces monorepo (`client`, `server`). Run every command from the repo root.

```bash
npm install
```

## Configure

```bash
cp server/.env.example server/.env                                 # set MONGODB_URI
echo "NEXT_PUBLIC_API_URI=http://localhost:5000/api" > client/.env.local
```

The `/api` suffix is required. See [Configuration](configuration.md) for every variable.

## Run

```bash
npm run dev --workspace=server   # Express via tsx watch, http://localhost:5000
npm run dev --workspace=client   # Next.js, http://localhost:3000
```

In VS Code, the **Start Application** task (`.vscode/tasks.json`) starts both.

On its first start against an empty database, the server seeds 390 fighters. Check that it's up:

```bash
curl localhost:5000/health          # {"status":"ok"}
curl localhost:5000/api/fighters/1
```

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev --workspace=client` | Next.js dev server |
| `npm run build --workspace=client` | Production build of the client |
| `npm run lint --workspace=client` | `next lint` (the server has no linter) |
| `npm run dev --workspace=server` | API with hot reload |
| `npm run build --workspace=server` | Bundle to `server/dist/server.js` with esbuild |
| `npm run start --workspace=server` | Run the bundle |
| `npm run seed --workspace=server` | **Wipe** the fighters collection and reseed it |
| `npx tsc --noEmit -p client` / `-p server` | Type-check |

There are no automated tests yet.
