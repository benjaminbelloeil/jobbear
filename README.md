<p align="center">
  <img src="docs/brand/logo/lockup.svg" alt="JobBear" height="72">
</p>

<p align="center">
  A job application tracker that reads your inbox, so your pipeline updates itself.
</p>

<p align="center">
  <a href="https://github.com/benjaminbelloeil/jobbear/actions/workflows/ci.yml"><img src="https://github.com/benjaminbelloeil/jobbear/actions/workflows/ci.yml/badge.svg" alt="CI"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-AGPL--3.0-2A1F19.svg" alt="License: AGPL-3.0"></a>
</p>

JobBear pulls job emails from Gmail, classifies them with the Claude API and moves each
application along on its own. You see your real pipeline: response rate, OA rate and time to
first reply.

> Built to replace my Notion + manual tracking while I apply to 5+ software engineering roles a day.

> [!NOTE]
> **In active development.** The interface runs on sample data today; the API, Gmail sync
> and AI classification are being built. See the [roadmap](#roadmap).

## Features

- Applications, companies and a full status history (Applied → OA → Interviewing → Offer)
- Read-only Gmail sync with AI classification: rejection, OA invite, interview invite, offer
- Marks an application "Ghosted" after 21 days of silence (configurable)
- Dashboard: response, OA and interview rates, days to first reply, weekly volume vs. goal
- Import from a Notion CSV export
- Open source: self-host it for free, on your own AI key

## Ways to use it

| | What you get | Cost |
|---|---|---|
| **Demo** | The full interface on sample data, no sign-up | Free |
| **[Self-hosted](docs/self-hosting.md)** | Everything, on your own machine, with your own AI key | Free, forever |
| **JobBear Cloud** *(planned)* | Hosted for you, AI included. 30- or 90-day passes, no auto-renew | One-time pass |

Every feature is in the open-source version. Cloud passes pay for convenience, not features.

## Quick start

```bash
git clone https://github.com/benjaminbelloeil/jobbear.git && cd jobbear
cp .env.example .env            # then fill in the values (see the self-hosting guide)
docker compose up -d --build
docker compose exec backend alembic upgrade head
```

Open http://localhost:5173. The full walkthrough, including Gmail, is in
[docs/self-hosting.md](docs/self-hosting.md).

## Tech stack

| Layer | Tech |
|---|---|
| Backend | Python 3.12, FastAPI, SQLAlchemy 2.0, Alembic, Pydantic v2 |
| Database | PostgreSQL 16 |
| Frontend | React, TypeScript, Vite, Tailwind CSS, TanStack Query, Recharts |
| AI and email | Claude API, Gmail API |
| Testing | pytest, Vitest, React Testing Library |
| DevOps | Docker Compose, GitHub Actions, Railway, Cloudflare Pages |

## Documentation

| | |
|---|---|
| [Self-hosting](docs/self-hosting.md) | Install, Gmail setup, settings, backups, troubleshooting |
| [Deploying](docs/deploying.md) | Railway + Cloudflare Pages |
| [Development](docs/development.md) | Architecture, project structure, tests |
| [Brand kit](docs/brand/README.md) | The bear, logos, colors and type |

## Roadmap

- [ ] Core CRUD + status history
- [ ] Dashboard analytics
- [ ] Gmail sync + Claude classification
- [ ] Deploy to Railway
- [ ] **v1.5** Save the job posting with each application (pasted, or filled from Greenhouse, Lever and Ashby links)
- [ ] **v2** Resume versions: which resume went where, and how each one performs
- [ ] **v2** Keyword match: which skills in the posting your resume covers, with the evidence
- [ ] Bring your own AI provider (OpenAI, Gemini, Grok, Ollama)
- [ ] Forwarding address, so any email provider works
- [ ] Production compose file for VPS hosting
- [ ] JobBear Cloud

## Contributing

Issues and pull requests are welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md) first: this is
also a learning project, so backend core changes start as a discussion. Report security
problems privately, as described in [SECURITY.md](.github/SECURITY.md).

## License

[GNU AGPL-3.0](LICENSE). Use, modify and self-host JobBear freely. If you run a modified
version as a hosted service, you must publish your changes under the same license.

<!-- TODO(me): add a "What I learned" section after v1 ships. -->
