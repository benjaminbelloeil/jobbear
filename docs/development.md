<p align="center"><picture><source media="(prefers-color-scheme: dark)" srcset="brand/readme/headers/development-dark.svg"><img src="brand/readme/headers/development-light.svg" alt="Development" width="100%"></picture></p>

<p align="center">
  <a href="../README.md"><picture><source media="(prefers-color-scheme: dark)" srcset="brand/readme/nav/home-dark.svg"><img src="brand/readme/nav/home-light.svg" alt="Home" height="38"></picture></a>
  <a href="README.md"><picture><source media="(prefers-color-scheme: dark)" srcset="brand/readme/nav/docs-dark.svg"><img src="brand/readme/nav/docs-light.svg" alt="Docs" height="38"></picture></a>
  <a href="self-hosting.md"><picture><source media="(prefers-color-scheme: dark)" srcset="brand/readme/nav/self-hosting-dark.svg"><img src="brand/readme/nav/self-hosting-light.svg" alt="Self-hosting" height="38"></picture></a>
  <a href="deploying.md"><picture><source media="(prefers-color-scheme: dark)" srcset="brand/readme/nav/deploying-dark.svg"><img src="brand/readme/nav/deploying-light.svg" alt="Deploying" height="38"></picture></a>
  <a href="development.md"><picture><source media="(prefers-color-scheme: dark)" srcset="brand/readme/nav/development-current-dark.svg"><img src="brand/readme/nav/development-current-light.svg" alt="Development" height="38"></picture></a>
  <a href="backend-map.md"><picture><source media="(prefers-color-scheme: dark)" srcset="brand/readme/nav/backend-map-dark.svg"><img src="brand/readme/nav/backend-map-light.svg" alt="Backend map" height="38"></picture></a>
  <a href="brand/README.md"><picture><source media="(prefers-color-scheme: dark)" srcset="brand/readme/nav/brand-dark.svg"><img src="brand/readme/nav/brand-light.svg" alt="Brand kit" height="38"></picture></a>
</p>

How the code is laid out, how to run it locally and how to test it. Before opening a pull
request, read [CONTRIBUTING.md](../CONTRIBUTING.md).

## Architecture

New to the backend? Start with the [backend map](backend-map.md): the four tables and one
request traced from URL to database and back.

```mermaid
flowchart LR
    UI["React app<br/>(Vite, TanStack Query)"] -- "REST + JWT" --> API["FastAPI<br/>routers"]
    API --> SVC["services/<br/>status rules, stats, ghosting"]
    SVC --> DB[("PostgreSQL<br/>applications, companies,<br/>status_events, emails")]
    JOBS["APScheduler jobs"] --> MAIL["Email intake<br/>(Gmail API or forwarding)"]
    MAIL --> AI["AI classifier<br/>(Claude API)"]
    AI -- "confident" --> SVC
    AI -- "unsure" --> REVIEW["Review queue<br/>(/inbox)"]
    JOBS --> SVC
```

- **Routers stay thin.** Business rules live in `services/`.
- **One way to change a status.** Every change, manual or automatic, goes through one
  function that also writes a `status_events` row. The timeline and the analytics read from it.
- **The AI never acts alone when unsure.** Low-confidence results wait in the review queue.

## Project structure

```
backend/
  app/
    api/            FastAPI routers (thin)
    models/         SQLAlchemy 2.0 models
    schemas/        Pydantic v2 request/response models
    services/       Business rules: status changes, stats, ghosting
    integrations/   Gmail and Claude clients
    jobs/           APScheduler jobs (email sync, ghosting)
    scripts/        One-off commands (Notion CSV import)
  alembic/          Database migrations
  tests/            pytest
frontend/
  src/
    pages/          One file per route
    components/     UI building blocks
    api/, hooks/    Data access (TanStack Query)
    sample/         Demo data the UI runs on today
infra/postgres/     Database init script (creates the test database)
docs/               Guides and the brand kit
.github/            CI, issue and PR templates, code of conduct, security policy
.claude/skills/     Impeccable design skill used for all UI work (Apache-2.0)
```

## Run it locally

You need Docker, [uv](https://docs.astral.sh/uv/) and Node 20+.

```bash
cp .env.example .env
docker compose up --build
cd backend && uv run alembic upgrade head
```

Frontend: http://localhost:5173 · API docs: http://localhost:8000/docs

Frontend only (no backend; pages use the sample data in `frontend/src/sample/`):

```bash
cd frontend && npm ci && npm run dev
```

## Checks and tests

Run these before every pull request. CI runs the same ones.

```bash
# Backend
cd backend && uv run ruff check . && uv run ruff format --check . && uv run mypy app alembic tests && uv run pytest

# Frontend
cd frontend && npm run format:check && npm run lint && npm run typecheck && npm test && npm run build
```

The backend tests use a separate `jobbear_test` database. Docker Compose creates it the first
time the `db` volume starts (`infra/postgres/init.sql`).

## Design

UI work follows the [brand kit](brand/README.md) (colors, type, the bear) and the
[Impeccable](../.claude/skills/impeccable) craft rules. Respect `prefers-reduced-motion`, keep
text contrast at WCAG AA and test at 375px wide.

---

<p align="center">
  <a href="backend-map.md"><picture><source media="(prefers-color-scheme: dark)" srcset="brand/readme/buttons/next-backend-map-dark.svg"><img src="brand/readme/buttons/next-backend-map-light.svg" alt="Next: Backend map" height="64"></picture></a>
</p>
