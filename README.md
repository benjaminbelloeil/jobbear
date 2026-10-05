# JobBear

[![CI](https://github.com/benjaminbelloeil/jobbear/actions/workflows/ci.yml/badge.svg)](https://github.com/benjaminbelloeil/jobbear/actions/workflows/ci.yml)
[![License: AGPL-3.0](https://img.shields.io/badge/license-AGPL--3.0-2A1F19.svg)](LICENSE)

A full-stack job application tracker with analytics. It pulls job emails from Gmail, classifies them with the Claude API, and updates each application's status automatically, so I can see my real pipeline: response rates, OA rates, and time to first reply.

> Built to replace my Notion + manual tracking workflow while I apply to 5+ software engineering roles a day.

## Features
- Track applications, companies, and a full status history (Applied → OA → Interviewing → Offer)
- Gmail sync (read-only) with AI email classification (rejection, OA invite, interview invite, offer)
- Automatic "Ghosted" after 21 days with no response (configurable)
- Dashboard: response rate, OA rate, interview rate, days to first reply, weekly volume vs. goal
- Import from a Notion CSV export
- Open source: self-host it, and (planned) bring your own AI key: Claude, GPT, Gemini, Grok or a local model

## Tech Stack
| Layer | Tech |
|---|---|
| Backend | Python 3.12, FastAPI, SQLAlchemy 2.0, Alembic, Pydantic v2 |
| Database | PostgreSQL 16 |
| Frontend | React, TypeScript, Vite, Tailwind CSS, TanStack Query, Recharts |
| AI / Integrations | Claude API, Gmail API |
| Testing | pytest, Vitest, React Testing Library |
| DevOps | Docker Compose, GitHub Actions, Railway |

## Architecture
<!-- TODO: add a diagram: React ⇄ FastAPI ⇄ PostgreSQL; APScheduler → Gmail API → Claude API → status updates -->

## Project structure

```
backend/            FastAPI app (api/, models/, schemas/, services/, integrations/, jobs/), Alembic, tests
frontend/           React + Vite + Tailwind. src/pages, src/components, src/sample (demo data)
infra/              Postgres init script
.github/            CI, issue and PR templates, Dependabot
.claude/skills/     Impeccable design skill used for all UI work (Apache-2.0)
```

## Getting Started
### Prerequisites
Docker, uv, Node 20+

### Setup
```bash
cp .env.example .env
docker compose up --build
cd backend && uv run alembic upgrade head
```
Frontend: http://localhost:5173 · API docs: http://localhost:8000/docs

### Running tests
```bash
cd backend && uv run pytest --cov=app
cd frontend && npm test
```

The backend tests use a separate `jobbear_test` database. Docker Compose creates it the first time the `db` volume is initialised (`infra/postgres/init.sql`).

## Gmail setup
<!-- TODO: steps to create OAuth credentials with the gmail.readonly scope -->

## Deploying to Railway
1. Create a Railway project and add a **PostgreSQL** database.
2. Add a service from this GitHub repo with **Root Directory** `backend`. Railway builds `backend/Dockerfile` and injects `PORT`.
3. Set variables on the backend service: `DATABASE_URL` (the Postgres URL with the scheme changed to `postgresql+psycopg://`), `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`, `ANTHROPIC_API_KEY`, `SCHEDULER_ENABLED=true`, `CORS_ORIGINS=["https://<frontend-domain>"]`.
4. Run migrations once: `railway run --service backend uv run alembic upgrade head` (or add it as a pre-deploy command).
5. Add a second service with **Root Directory** `frontend`, build command `npm ci && npm run build`, start command `npx vite preview --host 0.0.0.0 --port $PORT`, and `VITE_API_URL` set to the backend's public URL.
6. Gmail OAuth tokens: generate `gmail_token.json` locally, then provide it to the backend (e.g. via a volume) since the OAuth consent flow can't run on the server.

## Roadmap
- [ ] Core CRUD + status history
- [ ] Dashboard analytics
- [ ] Gmail sync + Claude classification
- [ ] Deploy to Railway

## Contributing

Issues and pull requests are welcome; read [CONTRIBUTING.md](CONTRIBUTING.md) first (this is also a
learning project, so backend core changes start as a discussion). Please report security
problems privately, as described in [SECURITY.md](SECURITY.md).

## License

[GNU AGPL-3.0](LICENSE). You can use, modify and self-host JobBear freely. If you run a modified
version as a hosted service, you must publish your changes under the same license.

## What I learned
<!-- TODO: fill in after building -->
