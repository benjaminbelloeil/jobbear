# JobBear

[![CI](https://github.com/benjaminbelloeil/jobbear/actions/workflows/ci.yml/badge.svg)](https://github.com/benjaminbelloeil/jobbear/actions/workflows/ci.yml)
[![License: AGPL-3.0](https://img.shields.io/badge/license-AGPL--3.0-2A1F19.svg)](LICENSE)

A full-stack job application tracker with analytics. It pulls job emails from Gmail, classifies them with the Claude API, and updates each application's status automatically, so I can see my real pipeline: response rates, OA rates, and time to first reply.

> Built to replace my Notion + manual tracking workflow while I apply to 5+ software engineering roles a day.

> **Status: in active development.** The interface runs on sample data today. The API, Gmail
> sync and AI classification are being built (see [Roadmap](#roadmap)). The self-hosting steps
> below describe how JobBear runs; anything marked *(planned)* isn't there yet.

## Features
- Track applications, companies, and a full status history (Applied → OA → Interviewing → Offer)
- Gmail sync (read-only) with AI email classification (rejection, OA invite, interview invite, offer)
- Automatic "Ghosted" after 21 days with no response (configurable)
- Dashboard: response rate, OA rate, interview rate, days to first reply, weekly volume vs. goal
- Import from a Notion CSV export
- Open source: self-host it for free, on your own AI key
- *(planned)* Other AI providers (OpenAI, Gemini, Grok) or a free local model through Ollama
- *(planned)* A forwarding address, so any email provider works without Google sign-in

## Ways to use JobBear

| | What you get | Cost |
|---|---|---|
| **Demo** | The full interface with sample data, no sign-up | Free |
| **[Self-hosted](#self-hosting)** | Everything, on your own computer or server, with your own AI key | Free, forever |
| **JobBear Cloud** *(planned)* | Hosted for you, AI included, one-click email. Hunt Pass $12 / 30 days or Season Pass $29 / 90 days, each with a 7-day free trial | One-time pass, no auto-renew |

Every feature is in the open-source version. Cloud passes pay for convenience, not features.

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

## Self-hosting

JobBear runs as three containers: PostgreSQL, the FastAPI backend and the React frontend.
`docker-compose.yml` starts all three. Your data never leaves the machine it runs on, except
the sender, subject and first lines of recruiter emails, which go to your AI provider for
classification.

### What you need

| | Why | Cost |
|---|---|---|
| [Docker Desktop](https://docs.docker.com/get-docker/) (or Docker Engine + Compose) | Runs everything | Free |
| [Git](https://git-scm.com/downloads) | Downloads the code | Free |
| An [Anthropic API key](https://console.anthropic.com/settings/keys) | Classifies recruiter emails | Pay per use, a few cents a month. A Claude.ai chat subscription does not include API access |
| A Google account | Gmail sync | Free |
| [uv](https://docs.astral.sh/uv/getting-started/installation/) | Only for the one-time Gmail sign-in | Free |

### 1. Download and configure

```bash
git clone https://github.com/benjaminbelloeil/jobbear.git
cd jobbear
cp .env.example .env
```

Open `.env` and set these values. The rest can stay as they are.

| Variable | What to put |
|---|---|
| `JWT_SECRET` | A long random string. Generate one with `openssl rand -base64 48` |
| `ADMIN_EMAIL` | The email you'll log in with |
| `ADMIN_PASSWORD_HASH` | A hash of your password, see the next step. Keep the single quotes |
| `ANTHROPIC_API_KEY` | Your Anthropic API key |
| `SCHEDULER_ENABLED` | `true` to sync email in the background |

Create the password hash (replace `your-password`), then paste the output into `.env` between
the single quotes:

```bash
docker compose run --rm --no-deps backend python -c "from pwdlib import PasswordHash; print(PasswordHash.recommended().hash('your-password'))"
```

### 2. Start JobBear

```bash
docker compose up -d --build
docker compose exec backend alembic upgrade head
```

The first command builds and starts the three containers. The second creates the database
tables; run it again after every update.

Open http://localhost:5173 and log in with `ADMIN_EMAIL` and your password. The API and its
docs are at http://localhost:8000/docs.

### 3. Connect Gmail

JobBear only asks for read-only access (`gmail.readonly`). You create your own Google OAuth
app, so no one else, including the JobBear maintainers, can read your inbox.

1. Go to the [Google Cloud Console](https://console.cloud.google.com/) and create a project.
2. **APIs & Services → Library:** enable the **Gmail API**.
3. **APIs & Services → OAuth consent screen:** choose **External**, fill in the app name and
   your email, add the scope `https://www.googleapis.com/auth/gmail.readonly`, and add your
   own Gmail address under **Test users**.
4. **APIs & Services → Credentials → Create credentials → OAuth client ID:** application type
   **Desktop app**. Download the JSON file.
5. Save it as `secrets/client_secret.json` in the project folder (create the `secrets/` folder;
   git ignores it).
6. Sign in once on your own computer. This opens a browser window and saves
   `secrets/gmail_token.json`:

   <!-- TODO(me): add the one-time sign-in command once load_credentials() is implemented. -->
   ```bash
   # (planned) cd backend && uv run python -m app.scripts.gmail_login
   ```

7. Restart the backend so it picks up the token: `docker compose restart backend`.

> **Google's 7-day limit:** while your OAuth app is in **Testing** mode, Google expires its
> refresh tokens after about 7 days, so the sync stops until you sign in again (step 6).
> Publishing the app removes the limit, but apps using Gmail scopes need Google's
> verification. For a personal instance, re-running the sign-in weekly is the simple option.
> Check [Google's OAuth docs](https://developers.google.com/identity/protocols/oauth2#expiration)
> for the current rule.

### 4. Import your existing applications (optional)

Export your Notion applications database as CSV, put the file in `imports/` (gitignored, so
your job-search history never ends up in git), then:

```bash
docker compose exec backend python -m app.scripts.import_notion_csv imports/your-export.csv --dry-run
docker compose exec backend python -m app.scripts.import_notion_csv imports/your-export.csv
```

The dry run shows what would be imported without saving anything. Expected columns:
Company, Position, Status, Next Action, Application Date.

### Settings you can change

All settings live in `.env`. Restart the backend after changing them
(`docker compose restart backend`).

| Variable | Default | What it does |
|---|---|---|
| `GMAIL_SYNC_INTERVAL_MINUTES` | `60` | How often new email is checked |
| `GHOSTED_AFTER_DAYS` | `21` | Days of silence before an application is marked ghosted |
| `WEEKLY_GOAL` | `35` | Applications per week shown on the dashboard |
| `CORS_ORIGINS` | `["http://localhost:5173"]` | Where the frontend runs. Change it if you host the frontend elsewhere |
| `VITE_API_URL` | `http://localhost:8000` | Where the frontend finds the API |

### Keeping it running

On your own computer, JobBear only syncs while the computer is on and Docker is running.
That's fine for most people: the next sync catches up on everything you missed.

To run it 24/7, deploy it to a host:

| Option | Cost (approx.) | Effort |
|---|---|---|
| Your own computer | Free | Lowest. Sync pauses while it's off |
| [Railway](#deploying-to-railway) | ~$5 / month | Low. Managed Postgres and HTTPS |
| A VPS (Hetzner, DigitalOcean) | ~$4–6 / month | Highest. *(planned)* production compose file. Don't expose the dev setup's database port to the internet |

### Updating

```bash
git pull
docker compose up -d --build
docker compose exec backend alembic upgrade head
```

### Backups

Your data lives in the `pgdata` Docker volume. To back it up to a file:

```bash
docker compose exec -T db pg_dump -U jobbear jobbear > jobbear-backup.sql
```

To restore it into a fresh install:

```bash
docker compose exec -T db psql -U jobbear jobbear < jobbear-backup.sql
```

Backup files hold your personal data: keep them out of the repo. Git already ignores `*.dump`
and `*.backup`; store `.sql` backups outside the project folder.

### Troubleshooting

| Problem | Fix |
|---|---|
| `port is already allocated` | Something else uses 5432, 8000 or 5173. Stop it, or change the left side of the port in `docker-compose.yml` |
| Login fails | Check the hash in `ADMIN_PASSWORD_HASH` is wrapped in single quotes, then `docker compose restart backend` |
| `relation ... does not exist` | Run the migrations: `docker compose exec backend alembic upgrade head` |
| Gmail sync stopped after a week | Your test-mode token expired. Repeat step 6 of [Connect Gmail](#3-connect-gmail) |
| See what the backend is doing | `docker compose logs -f backend` |

## Development

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

## Deploying to Railway
1. Create a Railway project and add a **PostgreSQL** database.
2. Add a service from this GitHub repo with **Root Directory** `backend`. Railway builds `backend/Dockerfile` and injects `PORT`.
3. Set variables on the backend service: `DATABASE_URL` (the Postgres URL with the scheme changed to `postgresql+psycopg://`), `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`, `ANTHROPIC_API_KEY`, `SCHEDULER_ENABLED=true`, `CORS_ORIGINS=["https://<frontend-domain>"]`.
4. Run migrations once: `railway run --service backend uv run alembic upgrade head` (or add it as a pre-deploy command).
5. Add a second service with **Root Directory** `frontend`, build command `npm ci && npm run build`, start command `npx vite preview --host 0.0.0.0 --port $PORT`, and `VITE_API_URL` set to the backend's public URL.
6. Gmail OAuth tokens: generate `secrets/gmail_token.json` on your own computer (step 6 of [Connect Gmail](#3-connect-gmail)), then provide it to the backend (e.g. via a volume), since the OAuth consent flow can't run on the server.

## Roadmap
- [ ] Core CRUD + status history
- [ ] Dashboard analytics
- [ ] Gmail sync + Claude classification
- [ ] Deploy to Railway
- [ ] Bring your own AI provider (OpenAI, Gemini, Grok, Ollama)
- [ ] Forwarding address for any email provider
- [ ] Production compose file for VPS hosting
- [ ] JobBear Cloud (hosted passes)

## Contributing

Issues and pull requests are welcome; read [CONTRIBUTING.md](CONTRIBUTING.md) first (this is also a
learning project, so backend core changes start as a discussion). Please report security
problems privately, as described in [SECURITY.md](SECURITY.md).

## License

[GNU AGPL-3.0](LICENSE). You can use, modify and self-host JobBear freely. If you run a modified
version as a hosted service, you must publish your changes under the same license.

## What I learned
<!-- TODO: fill in after building -->
