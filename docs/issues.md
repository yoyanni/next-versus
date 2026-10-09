# Issues and gaps

Known problems and missing pieces, found by reading the code on 2026-09-26. Each item says where it is, what goes wrong, and a suggested fix. Delete an item in the same commit that fixes it.

**Severity:** **High** means data loss, a security hole, or a broken page in production. **Medium** means wrong behaviour that users can hit. **Low** means cleanup, polish, or a latent risk.

## Bugs

### B3. Unselected stats are saved as 0

- **Severity:** Medium
- **Where:** [FormStepRender.tsx:60-66](../client/src/components/FormStepRender.tsx#L60-L66)
- **Problem:** The placeholder option for levels and stats has the value `0`, and nothing stops the form from being submitted with it. A new fighter with any skipped stat is saved with that stat at 0.
- **Fix:** Add client-side validation (see [C3](#c3-the-wizard-has-no-validation-and-cant-remove-moves)) that rejects the placeholder value.

### B4. A non-numeric `:id` isn't rejected

- **Severity:** Medium
- **Where:** [fighter.controller.ts:24](../server/src/controllers/fighter.controller.ts#L24), plus `editFighter` and `deleteFighter`
- **Problem:** `getFighterById` checks the numeric ID with `mongoose.Types.ObjectId.isValid`, which returns `true` for any number, `NaN` included. `/api/fighters/abc` reaches Mongo and fails with a `CastError`. GET and DELETE return `500`, and PUT returns `400`. Edit and delete don't check the ID at all.
- **Fix:** A shared check for all three: `if (!Number.isInteger(id) || id < 1) return res.status(400)…`. Update [api.md](api.md), which documents the current behaviour.

### B6. Two creates at the same moment can get the same ID

- **Severity:** Low
- **Where:** [fighter.controller.ts:49-50](../server/src/controllers/fighter.controller.ts#L49-L50)
- **Problem:** The next ID is read as "highest `_id` + 1" before the insert. Two concurrent creates both read the same value, and the second fails with a duplicate-key error that the user sees as `400 Failed to create fighter.`
- **Fix:** Either a `counters` collection updated with `findOneAndUpdate({ $inc })`, or a retry when the insert fails with error code `11000`. [ADR 0001](decisions/0001-numeric-fighter-ids.md) mentions the counter option.

### B7. The Perks card header shows stand-up levels

- **Severity:** Low
- **Where:** [Cards/index.tsx:27-28](../client/src/components/Cards/index.tsx#L27-L28)
- **Problem:** The Perks card passes `standUp.level` as its red and blue levels, so it repeats the Stand-Up card's numbers.
- **Fix:** Show the perk count, or no number at all.

## Security

### S2. No request validation, and edit skips schema validators

- **Severity:** Medium
- **Where:** [fighter.controller.ts:46-77](../server/src/controllers/fighter.controller.ts#L46-L77)
- **Problem:** `req.body` goes straight into `new Fighter(...)` and `findByIdAndUpdate(...)`. `findByIdAndUpdate` doesn't run schema validators unless it's given `runValidators: true`, so edits bypass the schema's required-field checks that creates and seeding get. Nothing checks value ranges, such as stats between 79 and 100 or at most 5 perks.
- **Fix:** Validate the body with zod (already suggested in a comment in the controller), derived from or checked against `shared/types.ts`. Pass `runValidators: true` on update.

### S3. Errors outside the controllers return HTML, not JSON

- **Severity:** Low
- **Where:** [app.ts](../server/src/app.ts)
- **Problem:** There's no JSON error handler or 404 handler. Malformed JSON bodies and unknown routes get Express's default HTML responses, which break the `{ message }` contract that `apiClient` expects (see [C2](#c2-apiclient-hides-errors-that-arent-json)).
- **Fix:** Add a final `app.use((err, req, res, next) => …)` that returns `{ message }`, and a catch-all 404 handler.

### S4. Outdated dependencies with published advisories

- **Severity:** Medium
- **Where:** [client/package.json](../client/package.json), [server/package.json](../server/package.json)
- **Problem:** The client pins Next.js `13.4.19`, which has several published security advisories. The server is on Express 4 and Mongoose 7.
- **Fix:** Run `npm audit`, upgrade Next.js to at least the latest 13.x patch (or plan a move to 14 or 15), and schedule the Express 5 and Mongoose 8 upgrades.

## API and data

### D1. Every page load downloads every fighter

- **Severity:** Medium
- **Where:** [getFighters](../server/src/controllers/fighter.controller.ts#L8-L18), [useFighters.ts](../client/src/hooks/useFighters.ts)
- **Problem:** `GET /api/fighters` returns all 390 fighters in full (about 2.4 MB). The home page and the fighter list only need names, rank, level and weight class for the lists, plus the two fighters being compared. On the server, each request builds the whole array and its JSON string in a 192 MB heap, so a few concurrent requests add up.
- **Fix:** Return a summary projection (for example `?fields=summary`, or a separate endpoint) for the lists, and fetch the two compared fighters by ID. Keep `.lean()`.

### D2. A failed seed is never retried

- **Severity:** Medium
- **Where:** [seed.ts](../server/src/seed.ts)
- **Problem:** Automatic seeding only runs when the collection is empty. If the process dies or an insert fails partway through, the collection keeps some fighters and is never completed. With `reset`, `deleteMany` runs before the inserts, so a failure leaves the collection partly empty.
- **Fix:** Seed when the count is below the seed file's count, and insert with `ordered: false` while skipping duplicate-key errors. Alternatively, write a marker document once seeding finishes and seed when the marker is missing.

### D3. `getFighterById` hydrates a full Mongoose document

- **Severity:** Low
- **Where:** [fighter.controller.ts:29](../server/src/controllers/fighter.controller.ts#L29)
- **Problem:** The fighter is only serialised, so building a Mongoose document is wasted work.
- **Fix:** Add `.lean()`.

### D4. Numbers travel as strings from the wizard

- **Severity:** Low
- **Where:** [FormStepRender.tsx](../client/src/components/FormStepRender.tsx), [formConfig.ts](../client/src/config/formConfig.ts)
- **Problem:** Selects and number inputs are registered without `valueAsNumber`, so levels, stats and reach are sent as strings (`"1.5"`, `"85"`). This works only because Mongoose casts them. A new fighter's reach defaults to `NaN`.
- **Fix:** Use `setValueAs: Number` for numeric fields, and default reach to an empty or valid value.

## Client and UI

### C1. Error states show "Loading..." forever

- **Severity:** Medium
- **Where:** [fighters/[id]/index.tsx:36](../client/src/pages/fighters/[id]/index.tsx#L36), [fighters/[id]/edit.tsx:9](../client/src/pages/fighters/[id]/edit.tsx#L9), [fighters/index.tsx:17](../client/src/pages/fighters/index.tsx#L17)
- **Problem:** These pages only check `!data`. A 404 or a network error leaves them on "Loading..." indefinitely. The home page shows "No fighters were available..." on error, with no retry.
- **Fix:** Handle `isError` and show a not-found or error message with a retry or a link back.

### C2. `apiClient` hides errors that aren't JSON

- **Severity:** Medium
- **Where:** [apiClient.ts:23-26](../client/src/service/apiClient.ts#L23-L26)
- **Problem:** On a non-2xx response, it calls `response.json()`. When the body is HTML or empty (a Caddy 502, or Express's default error pages from [S3](#s3-errors-outside-the-controllers-return-html-not-json)), that throws a `SyntaxError`, which replaces the real status. A missing `NEXT_PUBLIC_API_URI` isn't caught either: requests go to `undefined/fighters`.
- **Fix:** Parse the error body in a `try`, and fall back to `` `${response.status} ${response.statusText}` ``. Throw early when `BASE_URL` is unset.

### C3. The wizard has no validation and can't remove moves

- **Severity:** Medium
- **Where:** [WizardForm.tsx](../client/src/components/WizardForm.tsx), [FormStepRender.tsx](../client/src/components/FormStepRender.tsx)
- **Problem:**
  - No fields have validation rules, and `formState.errors` is read but never shown. An empty fighter can be submitted.
  - The perks step shows 5 slots, but more than 5 perks can be selected.
  - Moves can be added but not removed or changed. The same move can be added twice (which also duplicates the React keys in `MoveAccordion`). "Add move" with nothing selected does nothing and says nothing.
  - The heading says "Create a Fighter" in edit mode.
- **Fix:** Add react-hook-form rules (or a zod resolver shared with [S2](#s2-no-request-validation-and-edit-skips-schema-validators)), cap perks at 5, add a remove button per move, and set the heading from the mode.

### C4. Failed writes give the user no feedback

- **Severity:** Medium
- **Where:** [WizardForm.tsx:79-84](../client/src/components/WizardForm.tsx#L79-L84), [fighters/[id]/index.tsx:28-31](../client/src/pages/fighters/[id]/index.tsx#L28-L31)
- **Problem:** Create, edit and delete failures only go to `console.error`. The dialog closes or the form stays put as if nothing happened.
- **Fix:** Show an inline error or a toast. Moving writes to `useMutation` would provide `isPending` and `error` state as well.

### C5. Delete leaves the fighter in the cache

- **Severity:** Low
- **Where:** [fighters/[id]/index.tsx:26](../client/src/pages/fighters/[id]/index.tsx#L26)
- **Problem:** Delete invalidates `["fighters"]` but not `["fighter", id]`, which the rule in `CLAUDE.md` requires. Going back to the deleted fighter's page shows cached data for up to 5 minutes.
- **Fix:** `queryClient.removeQueries({ queryKey: ["fighter", String(id)] })`. The key is a string because `useFighter` uses `router.query.id`.

### C6. Placeholder UI in the layout

- **Severity:** Low
- **Where:** [Layout.tsx:23](../client/src/components/Layout.tsx#L23)
- **Problem:** "Combos" in the nav isn't a link and has no page.
- **Fix:** Build the combos page or remove the item.

### C7. Accessibility

- **Severity:** Medium
- **Where:** `Accordion`, `ChildAccordion`, `CardWrapper`, `Versebar`, `ConfirmDialog`
- **Problem:** Accordions, the card toggles, the weight-class list and the fighter table rows are clickable `div`, `p` and `tr` elements. They can't be focused or used with a keyboard, and screen readers don't announce them as controls. `ConfirmDialog` has no `role="dialog"`, `aria-modal`, Escape to close, or focus handling. The perks multi-select has no label.
- **Fix:** Use `button` elements (or `role="button"`, `tabIndex={0}` and key handlers), add `aria-expanded` to accordions, and give the dialog proper semantics and focus handling.

### C8. Small display issues

- **Severity:** Low
- **Problem:** The fighter page shows the rank as `#{rank}`, which renders "#Champ" for champions ([fighters/[id]/index.tsx:51](../client/src/pages/fighters/[id]/index.tsx#L51)). `WizardForm` renders its steps through seven near-identical `if` branches that could be one `FormStepRender` call ([WizardForm.tsx:157-215](../client/src/components/WizardForm.tsx#L157-L215)).

## Deployment and operations

### O1. The health check can't see a lost database connection

- **Severity:** Medium
- **Where:** [app.ts:13-15](../server/src/app.ts#L13-L15), [Dockerfile](../Dockerfile)
- **Problem:** `/health` always returns `ok`, even when MongoDB is disconnected and every API call fails. The Compose `healthcheck` on the VPS calls `/health`, so it (and the deploy's `docker compose up --wait`) passes as long as the process answers HTTP, even with no database. The Dockerfile has no `HEALTHCHECK` of its own.
- **Fix:** Keep `/health` as it is, but report `mongoose.connection.readyState` (an in-memory value, not a database call) in the response or in a separate `/ready` route. Point the Compose health check at it.

### O2. Shutdown doesn't close the HTTP server

- **Severity:** Low
- **Where:** [db.ts:46-56](../server/src/config/db.ts#L46-L56), [server.ts:10](../server/src/server.ts#L10)
- **Problem:** On SIGTERM the process closes the Mongo connection and exits straight away, so in-flight requests are cut off and new ones can still arrive while it closes.
- **Fix:** Keep the `server` returned by `app.listen`, call `server.close()` first, then `disconnectDB()` (keeping the no-reconnect behaviour), then exit.

### O3. The reconnect logic needs checking

- **Severity:** Low
- **Where:** [db.ts:12-32](../server/src/config/db.ts#L12-L32)
- **Problem:** After startup, a failed reconnect is only logged in `connectDB`'s `catch`, which doesn't schedule another attempt itself. Whether retries continue depends on Mongoose emitting `disconnected` again after a failed connect, which hasn't been checked. The `error` listener also calls `mongoose.disconnect()` on any runtime error, even though the driver reconnects on its own.
- **Fix:** Test by stopping MongoDB while the server is running. If retries stop, schedule the next attempt in the `catch`. Consider relying on the driver's own reconnection instead.

## Tooling and code quality

### T1. No tests

- **Severity:** Medium
- **Problem:** There's no test framework. The riskiest logic (ID generation, seeding, the form mapper, `handleMoveAddition`, the controllers' error paths) is untested.
- **Fix:** Add Vitest, with Supertest and `mongodb-memory-server` for the API. Start with the controllers and `createFighterForm`, which would have caught the health level being reset on edit.

### T2. The server has no linter

- **Severity:** Low
- **Problem:** Only the client runs ESLint.
- **Fix:** Add a shared ESLint config at the root that covers both workspaces.

### T3. Package and config cleanup

- **Severity:** Low
- **Problem:**
  - The client lists `typescript`, `eslint`, `eslint-config-next` and the `@types/*` packages under `dependencies` instead of `devDependencies`.
  - The server has an unused `nodemon` dev dependency, and its `"main": "server.ts"` points at a file that doesn't exist.
  - `client/tsconfig.tsbuildinfo` isn't in `.gitignore`.
  - `client/tsconfig.json` sets `target: "es5"`, overriding the base `ES2022`.
  - `client/src/pages/api/hello.ts` is leftover Next.js boilerplate.
  - `types/component.ts` and `types/generic.ts` import `../../../shared/types` instead of `@shared/types`.

## Documentation

### X1. Docs that don't match the code

- **Severity:** Low
- **Problem:** [architecture.md](architecture.md) says a dropped connection is "retried every 3 s", which is unverified (see [O3](#o3-the-reconnect-logic-needs-checking)). The README still has TODOs for a live demo link and a screenshot.
- **Fix:** Update these as the related items are fixed.
