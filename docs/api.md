# API reference

The base URL is `http://localhost:5000` locally. All fighter routes are under `/api`. Request and response bodies are JSON. Errors come back as `{ "message": string }`, which `apiClient` turns into a thrown `Error`.

The `Fighter` shape is defined in [`shared/types.ts`](../shared/types.ts). `_id` is a **number** (see [ADR 0001](decisions/0001-numeric-fighter-ids.md)).

| Method | Path | Body | Success | Errors |
| --- | --- | --- | --- | --- |
| GET | `/health` | none | `200 {"status":"ok"}` | none |
| GET | `/api/fighters` | none | `200 Fighter[]` | `500` |
| GET | `/api/fighters/:id` | none | `200 Fighter` | `404`, `500` |
| POST | `/api/fighters` | `Fighter` without `_id` | `201 <new _id>` | `400` |
| PUT | `/api/fighters/:id` | `Fighter` without `_id` | `200 <_id>` | `404`, `400` |
| DELETE | `/api/fighters/:id` | none | `200 {"message": "Fighter deleted successfully."}` | `404`, `500` |

## Notes

- **`/health`** never touches the database, so it only shows that the process is up. It's meant for container and uptime checks.
- **`GET /api/fighters`** returns every fighter (about 2.4 MB) with `.lean()`, which skips building Mongoose documents to keep memory down. There's no pagination.
- **Create and edit return only the `_id`**, not the document. The client then goes to `/fighters/:id`, which fetches the fighter.
- **New IDs** are the highest existing `_id` + 1, starting at 1 when the collection is empty. Two creates at the same moment could get the same ID.
- **Validation** relies only on the Mongoose schema. There's no request validation layer yet.
- **A non-numeric `:id`** (for example `/api/fighters/abc`) returns `500` from GET and DELETE and `400` from PUT. The `400 Invalid ID format` check in `getFighterById` uses `ObjectId.isValid`, which accepts any number, `NaN` included, so it never fires.
