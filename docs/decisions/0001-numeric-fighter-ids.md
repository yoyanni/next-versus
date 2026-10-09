# 0001. Numeric fighter IDs instead of ObjectIds

- Status: Accepted
- Date: 2023-09-19

## Context

The home page needs a default red and blue fighter for each weight class. ObjectIds change every time the data is seeded, so they can't be hardcoded in the client.

## Decision

`_id` is a `Number`. The seed file sets IDs 1 to 390, and `createFighter` assigns the highest existing `_id` + 1 (starting at 1 when the collection is empty). The controllers convert `req.params.id` with `Number(...)`.

## Consequences

- `defaultFighters` in `client/src/pages/index.tsx` can hardcode IDs, but those IDs must exist in `server/seed/fighters.json`. (Removed on 2026-10-09; the home page now picks by rank.)
- Two creates at the same moment could get the same ID. Mongo's unique `_id` index rejects the second one, which then fails with `400`. That's acceptable at this app's traffic.
- IDs are enumerable and predictable, which is fine because the data isn't sensitive.
- Alternatives for later: a counter collection that assigns IDs atomically, or picking defaults by a field such as rank instead of by ID.
