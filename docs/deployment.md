# Deployment

```mermaid
flowchart LR
  G[push to main] --> GA[GitHub Actions] --> I[ghcr.io versus-api image] --> VPS[VPS: docker compose pull + up --wait] --> H{healthy within 90 s?}
  G --> VC[Vercel builds client]
```

## Client (Vercel)

Vercel builds `client/` on push. Set `NEXT_PUBLIC_API_URI=https://versus-api.<domain>/api` in the project's environment variables.

## API (Docker on a VPS)

- **Image:** the root [`Dockerfile`](../Dockerfile) builds `versus-api`. The build context is the repo root, because the server needs the root lockfile and `shared/`.
  - The **build stage** runs `npm ci` for the server workspace, then bundles `server/src` to `server/dist/server.js` with esbuild.
  - The **runtime stage** (`node:22-alpine`, `NODE_ENV=production`) installs production dependencies only, copies `server/dist` and `server/seed`, runs as `node`, and starts with `node server/dist/server.js`.
  - `.dockerignore` leaves out `node_modules`, every `.env`, and all of `client/` except its `package.json`, which the workspace lockfile needs.
- **CI/CD:** [`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml) builds the image, pushes it to GHCR as `versus-api:latest` and `versus-api:<commit sha>`, then SSHes into the VPS as `deploy` and runs `docker compose pull versus-api && docker compose up -d --wait --wait-timeout 90 versus-api && docker image prune -f` in `~/app`. The Compose file lives on the VPS, not in this repo.
  - `--wait` makes `docker compose up` block until `versus-api` (and the `mongo` service it depends on) reports `healthy`, using the Compose `healthcheck` described below. If the container doesn't become healthy within 90 s, or exits, the command fails and so does the job. A red deploy run therefore means the new container is unhealthy, not just that the restart was issued. Compose has already replaced the old container by then, so a failed deploy leaves the broken one running (see the rollback note below).
  - `docker image prune -f` removes dangling images, which stops old `:latest` layers from piling up on the VPS disk after each deploy. It runs only if the new container became healthy, and it applies to the whole Docker host, so it also clears other projects' dangling images on the shared VPS. Tagged and in-use images are kept.
  - It runs on push to `main` only when a file that goes into the image changes (`server/`, `shared/`, the root manifests and lockfile, `client/package.json`, `Dockerfile`, `.dockerignore`, or the workflow itself). Client-only and docs-only pushes don't redeploy the API. Run it by hand from the Actions tab (`workflow_dispatch`) to force a redeploy.
  - Repository secrets: `DEPLOY_HOST` (the VPS hostname or IP) and `DEPLOY_SSH_KEY` (a private ed25519 key whose public key is in the `deploy` user's `authorized_keys`). GHCR login uses the built-in `GITHUB_TOKEN`.
  - To roll back, point the Compose service at an older `versus-api:<sha>` tag and run `docker compose up -d --wait versus-api` on the VPS. Compose pulls that tag from GHCR, because the prune step has already removed the old image from the VPS.
- **Compose on the VPS** (`~/app/docker-compose.yml`, not in this repo): the Compose project is named `portfolio`, and it also runs other projects' services, which aren't covered here.

  ```mermaid
  flowchart LR
    I[Internet] -- "80, 443 (TCP + UDP)" --> C[caddy]
    subgraph web["web network"]
      C
    end
    C -- "versus-api:3000" --> V[versus-api]
    subgraph db["db network (internal)"]
      M[(mongo)]
    end
    V --> M
  ```

  | Service | Image | Memory limit | Networks |
  | --- | --- | --- | --- |
  | `caddy` | `caddy:2` | 96 MB | `web` |
  | `mongo` | `mongo:7` | 512 MB | `db` |
  | `versus-api` | `ghcr.io/yoyanni/versus-api:latest` | 256 MB | `web`, `db` |

  - Every service has `restart: unless-stopped`. `versus-api` takes its restart policy, networks and 256 MB limit from an `x-api` template that other projects' APIs share.
  - The `db` network is `internal: true`, so Mongo has no route in or out of the host, and Caddy, which is only on `web`, can't reach it. `versus-api` is on both networks. Other projects' services share these networks, so Mongo is kept apart from them only by its credentials.
  - Compose fills `${…}` values (`DOMAIN`, `ACME_EMAIL`, `MONGO_ROOT_PASSWORD`, `VERSUS_DB_PASSWORD`) from the environment or a `.env` file next to the Compose file.
- **The `versus-api` service:**
  - Its `environment` sets `NODE_ENV=production`, `PORT=3000`, `NODE_OPTIONS=--max-old-space-size=192` and `MONGODB_URI=mongodb://versus:${VERSUS_DB_PASSWORD}@mongo:27017/versus?authSource=versus`. `CORS_ORIGIN` comes from `env_file: ./env/versus.env`.
  - Port 3000 is hardcoded in three places: `PORT`, the health check URL and the Caddyfile's `reverse_proxy`. Change all three together. The container publishes no ports; only Caddy reaches it.
  - It has `depends_on: mongo: condition: service_healthy`, because the app exits if its first connection fails.
  - It has a `healthcheck`, which the deploy's `--wait` depends on, so don't remove it:

    ```yaml
    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://127.0.0.1:3000/health"]
      interval: 15s
      timeout: 3s
      retries: 3
      start_period: 20s
      start_interval: 2s
    ```

    - It uses BusyBox `wget` because the `node:22-alpine` runtime image has no `curl`.
    - For the first 20 s it probes every 2 s, and the container turns `healthy` on the first success, so a normal deploy finishes in a few seconds. Failed probes in that window don't count. After it, Docker probes every 15 s and marks the container `unhealthy` after 3 failures in a row. `start_interval` needs Docker Engine 25 or later.
    - A container that starts but never answers turns `unhealthy` after about 65 s (20 s plus 3 × 15 s), so the deploy fails with `unhealthy` inside its 90 s `--wait-timeout`. The interval is 15 s rather than 30 s for this reason: with 30 s it would take about 110 s, and the deploy would report a bare timeout instead. Keep `start_period + retries × interval` under 90 s, with some margin, if you change any of them. A container that exits also fails the deploy: straight away if Compose sees it stopped, or at the timeout if the restart policy keeps restarting it.
    - Outside Swarm, Docker doesn't restart a container for being `unhealthy`. If the API goes unhealthy after a deploy, the status only shows in `docker ps`; the restart policy acts only if the process exits.
    - `/health` doesn't touch the database, so the check only shows that the process is up and serving HTTP, not that MongoDB is reachable (see [O1](issues.md#o1-the-health-check-cant-see-a-lost-database-connection)).
- **The `mongo` service:**
  - It runs `mongod --wiredTigerCacheSizeGB 0.25 --bind_ip_all`. The small cache keeps it inside its 512 MB limit, and binding to all interfaces is safe because `db` is internal.
  - The root user is `root` with `MONGO_ROOT_PASSWORD`. The app connects as a `versus` user with `authSource=versus`, which an init script in `./initdb/mongo` creates from `VERSUS_DB_PASSWORD` the first time the database starts empty. Changing `VERSUS_DB_PASSWORD` later doesn't change the user's password, because the init script doesn't run again.
  - Data lives in the named volume `mongodata` at `/data/db`. It survives redeploys and container recreation, but not a rebuild of the VPS (see the constraints below).
  - Its health check runs `mongosh` with `db.adminCommand('ping')` every 5 s (10 s timeout, 20 retries, 15 s start period). `versus-api` won't start until it passes. A deploy normally finds `mongo` already healthy. If `mongo` has to start too, for example on a fresh VPS, the time it takes counts against the deploy's 90 s `--wait-timeout`.
- **Caddy** (`~/app/Caddyfile`, mounted read-only):
  - The site `versus-api.{$DOMAIN}` does `reverse_proxy versus-api:3000`. Caddy terminates TLS, so the container serves plain HTTP.
  - Caddy gets and renews the certificates itself from Let's Encrypt, using `ACME_EMAIL` as the account email. Certificates are kept in the `caddy_data` volume. Port 443/UDP is published for HTTP/3.
  - A shared `(common)` snippet, imported by every site, compresses responses (zstd or gzip), sets `Strict-Transport-Security: max-age=31536000` and `X-Content-Type-Options: nosniff`, and removes the `Server` header. The app doesn't need its own compression or these headers.
  - Caddy doesn't handle CORS; the app does, using `CORS_ORIGIN`.
  - When the container is down or restarting, Caddy returns a `502` with an empty body.

### Build and run the image locally

```bash
docker build -t versus-api .
docker run --rm -p 3000:3000 \
  -e PORT=3000 -e MONGODB_URI=mongodb://host.docker.internal/localDB \
  -e CORS_ORIGIN=http://localhost:3000 versus-api
curl localhost:3000/health
```

## Constraints of the VPS

The VPS is a shared machine with 2 GB of RAM.

- **Memory:** the container is limited to 256 MB and runs with `--max-old-space-size=192`, both set in the Compose file (the image sets neither). With other projects' containers included, the memory limits already add up to about 1.5 GB of the 2 GB, so there's little room to raise any of them. Avoid large in-memory caches and loading whole datasets at once. Anything that needs more memory has to be planned first.
- **Nothing on local disk survives a rebuild.** The VPS is periodically destroyed and recreated. The Mongo volume keeps data across redeploys, but it's lost when the VPS is recreated, which is why seeding runs automatically. Logs go to stdout and stderr only. Storing files would need external object storage.
- **Shutdown:** `docker stop` sends SIGTERM, and the server closes the Mongo connection and exits instead of waiting to be SIGKILLed after 10 s.

## Troubleshooting

| Symptom | Likely cause |
| --- | --- |
| The container exits right away with `MONGODB_URI is not set` or `CORS_ORIGIN must be set in production` | A variable is missing from the Compose environment |
| The container exits with `MongoDB initial connection error` | The database is unreachable at startup |
| The deploy job fails at "Deploy over SSH" with a container `unhealthy` or a wait timeout | The new container crashed or stopped answering `/health` (see the health check timing above). Run `docker compose logs versus-api` and `docker inspect --format '{{json .State.Health}}' <container>` on the VPS, then fix forward or roll back |
| Requests to `versus-api.<domain>` get a `502` | The container is down, restarting or still starting. Check `docker compose ps` |
| The browser shows CORS errors | `CORS_ORIGIN` doesn't exactly match the Vercel origin (scheme and host, no trailing slash) |
| Every client call fails with a 404 or a JSON parse error | `NEXT_PUBLIC_API_URI` is missing its `/api` suffix |
| The home page says "There was an issue selecting fighters." | A default fighter ID is missing from the database (see [Data and seeding](data-and-seeding.md)) |
