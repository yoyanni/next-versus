# 0002. Seed at startup, from a file read at runtime, in batches

- Status: Accepted
- Date: 2026-09-25

## Context

- The VPS is periodically destroyed and recreated, and nothing on local disk persists, so a fresh deployment has to be able to fill an empty database by itself.
- The API container has a 256 MB limit and a 192 MB heap. A single `insertMany` of all 390 fighters built every Mongoose document at once and peaked at about 184 MiB.

## Decision

- At startup, `seedFighters()` seeds the `fighters` collection only if it's empty.
- It reads `server/seed/fighters.json` from disk at runtime rather than importing it, so the roughly 3 MB file stays out of the esbuild bundle and out of memory unless seeding actually runs.
- It inserts in batches of 50.
- It resolves the file path relative to the module. That works because `src/seed.ts` (dev) and `dist/server.js` (prod) both sit one level below `server/`.

## Consequences

- The Docker image has to copy `server/seed/`.
- Moving `seed.ts` or changing the bundle's output directory breaks the path.
- Once the collection holds any fighters, changes to the seed file don't reach the database. Run `npm run seed --workspace=server` to reset it, which loses your edits.
