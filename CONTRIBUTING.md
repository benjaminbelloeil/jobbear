# Contributing to JobBear

Thanks for your interest! JobBear is an open-source job application tracker, and it is also
a **learning project**: the maintainer writes the core backend (models, endpoints, services,
integrations, migrations and their tests) himself to learn Python backend development.

## What's welcome

| Area | Contributions |
|---|---|
| Bugs | Issues with clear steps to reproduce, always welcome |
| Frontend presentation | Components, styling, accessibility, responsive fixes (`frontend/src/components`, `frontend/src/pages`) |
| Docs | README, setup guides, typos, diagrams |
| Tooling / CI | GitHub Actions, Docker, lint config |
| Backend core | **Please open an issue to discuss first.** Until v1 ships, backend logic is written by the maintainer; suggestions and reviews are very welcome, finished implementations usually won't be merged |

## Getting set up

```bash
cp .env.example .env              # never commit .env
docker compose up --build         # Postgres + API + frontend
cd backend && uv run alembic upgrade head
```

Frontend only (no backend needed; pages use sample data from `frontend/src/sample/`):

```bash
cd frontend && npm ci && npm run dev
```

## Before you open a pull request

```bash
# Frontend
cd frontend && npm run format && npm run lint && npm run typecheck && npm test && npm run build
# Backend
cd backend && uv run ruff check . && uv run ruff format --check . && uv run mypy app alembic tests && uv run pytest
```

CI runs the same checks on every pull request.

## Conventions

- **Branches:** `feat/<topic>`, `fix/<topic>`, `docs/<topic>`, `chore/<topic>`. Never commit to `main` directly.
- **Commits:** [Conventional Commits](https://www.conventionalcommits.org/) with an optional scope:
  `feat(frontend): …`, `fix(backend): …`, `docs: …`, `chore: …`, `test: …`. One logical change per commit.
- **Pull requests:** small and focused, filled-in template, linked issue (`Closes #12`).
- **Design:** UI changes follow the brand tokens in `frontend/tailwind.config.ts` (birch, bark, honey;
  Bricolage Grotesque + Onest) and the [Impeccable](.claude/skills/impeccable) craft rules. Respect
  `prefers-reduced-motion`, keep text contrast at WCAG AA, and test at 375px wide.
- **Secrets:** never commit API keys, OAuth client secrets or tokens. Everything goes through `.env`.

## License

By contributing, you agree that your contributions are licensed under the
[GNU AGPL-3.0](LICENSE), the same license as the project.
