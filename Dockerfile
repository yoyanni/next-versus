# versus-api: the Express server from the `server` workspace.
# Built from the repo root because the server shares the root lockfile and `shared/` types.

# ---- Build: bundle server/src into server/dist/server.js ----
FROM node:22-alpine AS build
WORKDIR /app

# Workspace manifests only (client's is needed so the root lockfile validates)
COPY package.json package-lock.json tsconfig.base.json ./
COPY server/package.json server/
COPY client/package.json client/
RUN npm ci --workspace=server

COPY shared shared
COPY server server
RUN npm run build --workspace=server

# ---- Runtime: production deps + bundle + seed data ----
FROM node:22-alpine
ENV NODE_ENV=production
WORKDIR /app

COPY package.json package-lock.json ./
COPY server/package.json server/
COPY client/package.json client/
RUN npm ci --omit=dev --workspace=server && npm cache clean --force

COPY --from=build /app/server/dist server/dist
COPY server/seed server/seed

USER node
EXPOSE 3000
CMD ["node", "server/dist/server.js"]
