# API reference

The base URL is `http://localhost:5000` locally. All fighter routes are under `/api`. Request and response bodies are JSON. Errors come back as `{ "message": string }`, which `apiClient` turns into a thrown `Error`.

The `Fighter` shape is defined in [`shared/types.ts`](../shared/types.ts). `_id` is a **number** (see [ADR 0001](decisions/0001-numeric-fighter-ids.md)).

  | Method | Path | Who | Body | Success | Errors |
| --- | --- | --- | --- | --- | --- |
| GET | `/health` | Anyone | none | `200 {"status":"ok"}` | none |
| GET | `/api/fighters` | Anyone | none | `200 Fighter[]` | `500` |
| GET | `/api/fighters/:id` | Anyone | none | `200 Fighter` | `404`, `500` |
| POST | `/api/fighters` | Anyone, rate limited | `Fighter` without `_id` | `201 <new _id>` | `400`, `413`, `429` |
| PUT | `/api/fighters/:id` | Sandbox fighter: anyone, rate limited. Seed fighter: admin token | `Fighter` without `_id` | `200 <_id>` | `403`, `404`, `400`, `413`, `429` |
| DELETE | `/api/fighters/:id` | Sandbox fighter: anyone, rate limited. Seed fighter: admin token | none | `200 {"message": "Fighter deleted successfully."}` | `403`, `404`, `429`, `500` |

## Who can write

The write routes are public, but only for **sandbox fighters**. See [ADR 0003](decisions/0003-public-sandbox-with-protected-seed.md) for why.

- **Seed and sandbox fighters:** a fighter with `_id` below `SANDBOX_ID_START` (100 000, in [`shared/limits.ts`](../shared/limits.ts)) is a seed fighter. Fighters created through the API get IDs from that value up and are sandbox fighters.
- **Seed fighters are read-only.** `PUT` and `DELETE` on one return `403 {"message": "Seed fighters are read-only."}` unless the request has `Authorization: Bearer <ADMIN_TOKEN>`. When `ADMIN_TOKEN` isn't set on the server, nothing gets past this check. A wrong token and a non-numeric `:id` also get `403`.
- **Sandbox fighters have no owner.** Anyone can edit or delete any of them.
- **The sandbox keeps the newest 3 fighters.** A create that would go over that deletes the oldest sandbox fighter first.
- **Rate limit:** 20 write requests per 30 minutes per IP address, counted across `POST`, `PUT` and `DELETE`. Refused requests (`403`) count too. Over the limit, the response is `429 {"message": "Too many changes. Try again later."}` with `RateLimit` and `Retry-After` headers. Requests with a valid admin token aren't counted. Reads are never limited.
- **Body size:** request bodies over 16 KB get `413`. The largest seed fighter is under 5 KB. This `413` is Express's default response, not `{ message }` (see [S3](issues.md#s3-errors-outside-the-controllers-return-html-not-json)).

## Notes

- **`/health`** never touches the database, so it only shows that the process is up. It's meant for container and uptime checks.
- **`GET /api/fighters`** returns every fighter (about 2.4 MB) with `.lean()`, which skips building Mongoose documents to keep memory down. There's no pagination.
- **Create and edit return only the `_id`**, not the document. The client then goes to `/fighters/:id`, which fetches the fighter.
- **New IDs** are the highest existing `_id` + 1, and never below `SANDBOX_ID_START`, so the first created fighter is `100000`. Two creates at the same moment could get the same ID.
- **Validation** relies only on the Mongoose schema. There's no request validation layer yet.
- **A non-numeric `:id`** (for example `/api/fighters/abc`) returns `500` from GET and DELETE and `400` from PUT. The `400 Invalid ID format` check in `getFighterById` uses `ObjectId.isValid`, which accepts any number, `NaN` included, so it never fires.
