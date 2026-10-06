# Deploying JobBear

```
Cloudflare Pages (frontend, static Vite build)
        │  HTTPS, VITE_API_URL
        ▼
Railway service "api" (FastAPI in backend/Dockerfile, one process, runs APScheduler)
        │  DATABASE_URL (private network)
        ▼
Railway Postgres
```

> **Status:** login isn't implemented yet, so a deployed API boots but `/auth/login` returns
> 500. Deploy once login works end to end locally. To run it on your own machine instead, see
> [Self-hosting](self-hosting.md).

## 1. Railway: database and API

1. **New project → Deploy from GitHub repo** → pick `jobbear`.
2. **Add a database:** in the project, **+ New → Database → PostgreSQL**.
3. **API service settings** (the service created from the repo):
   - **Root Directory:** `/backend`
   - **Config-as-code file path:** `/backend/railway.json`. Railway does *not* look inside the
     root directory for this file, so the absolute path is required.
   - **Networking → Generate Domain** to get the public `https://…up.railway.app` URL.
4. **Variables** on the API service:

   | Variable | Value |
   |---|---|
   | `DATABASE_URL` | `${{Postgres.DATABASE_URL}}` (reference variable; `config.py` switches it to psycopg 3) |
   | `JWT_SECRET` | a fresh one: `python -c "import secrets; print(secrets.token_urlsafe(48))"` |
   | `ADMIN_EMAIL` | your login email |
   | `ADMIN_PASSWORD_HASH` | a fresh argon2 hash (see `.env.example`). Paste it raw, no quotes |
   | `CORS_ORIGINS` | `["https://<your-project>.pages.dev"]`, plus any custom domain |
   | `ANTHROPIC_API_KEY` | your key |
   | `SCHEDULER_ENABLED` | `false` until Gmail sync works, then `true` |

   Don't reuse your local secrets.

What `railway.json` does on every deploy:
- builds `backend/Dockerfile` (which already listens on Railway's `$PORT`)
- runs `alembic upgrade head` before the new version takes traffic; a failed migration
  stops the deploy
- waits for `GET /health` to pass before switching over
- only redeploys when something under `/backend` changes

Keep the service at **one replica**. Each process runs its own APScheduler, so two replicas
would sync Gmail twice.

## 2. Cloudflare Pages: frontend

1. **Workers & Pages → Create → Pages → Connect to Git** → pick `jobbear`.
2. **Build settings:**

   | Setting | Value |
   |---|---|
   | Framework preset | None (or Vite) |
   | Root directory | `frontend` |
   | Build command | `npm run build` |
   | Build output directory | `dist` |

3. **Environment variables** (Production *and* Preview):
   - `VITE_API_URL` = your Railway URL, e.g. `https://jobbear-api.up.railway.app`
   - Vite bakes this in at build time, so changing it needs a redeploy.

Node 20 is pinned by `frontend/.nvmrc`, matching CI. There's no `404.html`, so Pages
serves `index.html` for unknown paths and React Router handles `/dashboard` and so on.
`frontend/public/_headers` adds security headers and long caching for `/assets/*`.

## 3. Connect the two

1. Put the Pages URL into the API's `CORS_ORIGINS` on Railway (it redeploys).
2. Open the Pages site and log in.
3. Preview deploys get their own `*.pages.dev` URLs. Add one to `CORS_ORIGINS` if you need
   to test a preview against the real API.

## Later: Gmail

The Gmail OAuth client needs the deployed redirect URI added in Google Cloud Console, and
`client_secret.json` / the token can't live in the image (`secrets/` is excluded by
`.dockerignore`). Plan to load them from env vars or a Railway volume when you get there.
