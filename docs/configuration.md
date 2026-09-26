# Configuration

`.env` files are gitignored, and none are committed.

## Server

`server/src/config/env.ts` loads `server/.env` through dotenv and validates it before anything else runs. Read `env` from there, never `process.env`. `server/.env.example` is the template.

| Variable | Required | Default | Notes |
| --- | --- | --- | --- |
| `MONGODB_URI` | Yes | none | The server exits at startup if it's missing, or if the first connection fails. |
| `PORT` | No | `5000` | Production sets `3000`. |
| `CORS_ORIGIN` | In production | none | The only origin allowed. If it's unset in dev, any origin is allowed. |
| `NODE_ENV` | No | none | `production` makes `CORS_ORIGIN` required. The Docker image sets it. |

## Client

| Variable | Example | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URI` | `http://localhost:5000/api` | The API base URL. It **must** include `/api`, because client calls use paths like `/fighters`. Next.js builds it into the bundle, so changing it needs a rebuild or redeploy. |

Put it in `client/.env.local` locally. In production it's set in the Vercel project settings.

## Rules

- Never hardcode connection strings, secrets or CORS origins, and never give them defaults.
- A new server variable goes in `env.ts` (with validation), `.env.example`, and the table above.
