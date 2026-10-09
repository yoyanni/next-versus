# 0003. Public writes limited to a sandbox, with read-only seed fighters

- Status: Accepted
- Date: 2026-10-05

## Context

- The write API had no authentication. Anyone could edit or delete every fighter, and deleting fighter 1 or 2 broke the home page.
- The VPS is periodically destroyed and recreated, and the database is then reseeded from `server/seed/fighters.json`. A change made on the live site doesn't last, so the seed file is the real source of truth.
- The site is a demo. The create and edit wizard is a large part of it, and a token on every write would hide it from visitors.
- A missing required variable makes the server exit at startup, and a failed deploy leaves the broken container running.

## Decision

- Fighters with `_id` below `SANDBOX_ID_START` (100 000) are seed fighters. `PUT` and `DELETE` on them need `Authorization: Bearer <ADMIN_TOKEN>`.
- `ADMIN_TOKEN` is optional. When it's unset, seed fighters can't be changed through the API at all.
- Fighters created through the API get IDs from 100 000 up. Anyone can create, edit or delete them.
- Public writes are bounded: 20 per 30 minutes per IP, request bodies up to 16 KB, and only the newest 3 sandbox fighters are kept.
- The client has no token prompt. It hides the edit and delete controls on seed fighters.

A fixed ID boundary was chosen over a `seeded` field or a value computed from the seed file. It needs no change to the fighter shape, it stays correct when the seed file grows, and the client can tell the two kinds apart from the ID alone.

## Consequences

- Text that visitors enter is public. An offensive fighter name stays visible until it's evicted, deleted with the token, or the VPS is rebuilt.
- Sandbox fighters have no owner, so one visitor can change or delete another's. With a cap of 3, a fighter can be evicted while its creator is still looking at it.
- A lasting change to a seed fighter is made in the seed file, not through the site.
- Seed IDs must stay below 100 000.
- The rate limit lives in the container's memory, so it resets on restart and wouldn't be shared between instances.
- The rate limit trusts one proxy (`trust proxy` is `1`). Another proxy in front of Caddy means changing that value.
- `shared/` now exports a runtime value, which needs `experimental.externalDir` in the client and `"type": "module"` in `shared/package.json`.
