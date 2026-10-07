# Self-hosting JobBear

JobBear runs as three containers: PostgreSQL, the FastAPI backend and the React frontend.
`docker-compose.yml` starts all three.

Your data stays on the machine it runs on. The one exception: the sender, subject and first
lines of recruiter emails go to your AI provider for classification.

> Anything marked *(planned)* isn't built yet. See the [roadmap](../README.md#roadmap).

**On this page:** [What you need](#what-you-need) · [1. Configure](#1-download-and-configure) ·
[2. Start](#2-start-jobbear) · [3. Gmail](#3-connect-gmail) · [4. Import](#4-import-your-existing-applications-optional) ·
[Settings](#settings) · [Running 24/7](#keeping-it-running) · [Updates and backups](#updates-and-backups) ·
[Troubleshooting](#troubleshooting)

## What you need

| | Why | Cost |
|---|---|---|
| [Docker Desktop](https://docs.docker.com/get-docker/) (or Docker Engine + Compose) | Runs everything | Free |
| [Git](https://git-scm.com/downloads) | Downloads the code | Free |
| An [Anthropic API key](https://console.anthropic.com/settings/keys) | Classifies recruiter emails | A few cents a month. A Claude.ai chat subscription does not include API access |
| A Google account | Gmail sync | Free |
| [uv](https://docs.astral.sh/uv/getting-started/installation/) | Only for the one-time Gmail sign-in | Free |

## 1. Download and configure

```bash
git clone https://github.com/benjaminbelloeil/jobbear.git
cd jobbear
cp .env.example .env
```

Open `.env` and set these. The rest can stay as they are.

| Variable | What to put |
|---|---|
| `JWT_SECRET` | A long random string: `openssl rand -base64 48` |
| `ADMIN_EMAIL` | The email you'll log in with |
| `ADMIN_PASSWORD_HASH` | A hash of your password (next step). Keep the single quotes |
| `ANTHROPIC_API_KEY` | Your Anthropic API key |
| `SCHEDULER_ENABLED` | `true` to sync email in the background |

Create the password hash (replace `your-password`) and paste the output between the single quotes:

```bash
docker compose run --rm --no-deps backend python -c "from pwdlib import PasswordHash; print(PasswordHash.recommended().hash('your-password'))"
```

## 2. Start JobBear

```bash
docker compose up -d --build
docker compose exec backend alembic upgrade head
```

The first command builds and starts the containers. The second creates the database tables;
run it again after every update.

- App: http://localhost:5173 (log in with `ADMIN_EMAIL` and your password)
- API docs: http://localhost:8000/docs

## 3. Connect Gmail

JobBear only asks for read-only access (`gmail.readonly`), through a Google OAuth app **you**
create. No one else, including the maintainers, can read your inbox.

1. In the [Google Cloud Console](https://console.cloud.google.com/), create a project.
2. **APIs & Services → Library:** enable the **Gmail API**.
3. **OAuth consent screen:** choose **External**, add the scope
   `https://www.googleapis.com/auth/gmail.readonly`, and add your Gmail address under **Test users**.
4. **Credentials → Create credentials → OAuth client ID:** type **Desktop app**. Download the JSON.
5. Save it as `secrets/client_secret.json` (create `secrets/`; git ignores it).
6. Sign in once on your own computer. This opens a browser and saves `secrets/gmail_token.json`:

   <!-- TODO(me): add the one-time sign-in command once load_credentials() is implemented. -->
   ```bash
   # (planned) cd backend && uv run python -m app.scripts.gmail_login
   ```

7. Restart the backend: `docker compose restart backend`.

> **Google's 7-day limit.** While your OAuth app is in **Testing** mode, Google expires its
> refresh tokens after about 7 days, so repeat step 6 weekly. Publishing the app removes the
> limit but needs Google's verification for Gmail scopes.
> [Google's OAuth docs](https://developers.google.com/identity/protocols/oauth2#expiration)
> have the current rule.

## 4. Import your existing applications (optional)

Export your Notion database as CSV and put it in `imports/` (gitignored). Expected columns:
Company, Position, Status, Next Action, Application Date.

```bash
docker compose exec backend python -m app.scripts.import_notion_csv imports/your-export.csv --dry-run
docker compose exec backend python -m app.scripts.import_notion_csv imports/your-export.csv
```

The dry run shows what would be imported without saving anything.

## Settings

All settings live in `.env`. Restart the backend after a change (`docker compose restart backend`).

| Variable | Default | What it does |
|---|---|---|
| `GMAIL_SYNC_INTERVAL_MINUTES` | `60` | How often new email is checked |
| `GHOSTED_AFTER_DAYS` | `21` | Days of silence before an application is marked ghosted |
| `WEEKLY_GOAL` | `35` | Applications per week shown on the dashboard |
| `CORS_ORIGINS` | `["http://localhost:5173"]` | Where the frontend runs |
| `VITE_API_URL` | `http://localhost:8000` | Where the frontend finds the API |

## Keeping it running

On your own computer, JobBear syncs only while the computer is on. The next sync catches up
on anything missed. To run it 24/7:

| Option | Cost (approx.) | Effort |
|---|---|---|
| Your own computer | Free | Lowest. Sync pauses while it's off |
| [Railway + Cloudflare Pages](deploying.md) | ~$5 / month | Low. Managed Postgres and HTTPS |
| A VPS (Hetzner, DigitalOcean) | ~$4–6 / month | Highest. *(planned)* production compose file. Never expose the dev database port |

## Updates and backups

Update:

```bash
git pull
docker compose up -d --build
docker compose exec backend alembic upgrade head
```

Your data lives in the `pgdata` Docker volume. Back it up and restore it with:

```bash
docker compose exec -T db pg_dump -U jobbear jobbear > jobbear-backup.sql
docker compose exec -T db psql -U jobbear jobbear < jobbear-backup.sql
```

Backups hold your personal data. Store them outside the project folder.

## Troubleshooting

| Problem | Fix |
|---|---|
| `port is already allocated` | Something else uses 5432, 8000 or 5173. Stop it, or change the left-hand port in `docker-compose.yml` |
| Login fails | Check `ADMIN_PASSWORD_HASH` is wrapped in single quotes, then `docker compose restart backend` |
| `relation ... does not exist` | Run the migrations: `docker compose exec backend alembic upgrade head` |
| Gmail sync stopped after a week | The test-mode token expired. Repeat step 6 of [Connect Gmail](#3-connect-gmail) |
| See what the backend is doing | `docker compose logs -f backend` |
