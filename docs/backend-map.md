# Backend map: how JobBear's backend fits together

Read this before any backend issue. Everything else is detail.

## The whole backend in one sentence

The frontend asks for something over HTTP, a **router** receives it, a **service** applies
the rules, the **models** read or write the database, and a **schema** shapes the answer.

## The four tables

JobBear stores four things. That's it.

```
 companies                 applications                 status_events
 ─────────                 ────────────                 ─────────────
 Stripe        1 ───── many  "Backend intern"  1 ───── many  APPLIED → OA      (Oct 3)
 Shopify                     status: OA                    OA → INTERVIEWING (Oct 9)
                             next_action: PREPARE_OA
                                   1
                                   │
                                  many
                                emails
                                ──────
                                "Your online assessment"   (from Stripe, Oct 3)
```

| Table | One row is… | Example |
|---|---|---|
| `companies` | a company you applied to | Stripe |
| `applications` | one job you applied for, with its **current** status | Backend intern at Stripe, status OA |
| `status_events` | one **change** of status, kept forever as history | "moved APPLIED → OA on Oct 3, because of an email" |
| `emails` | one email you received about a job | "Your online assessment" |

**Why both `applications.status` and `status_events`?** The application holds where it is
*now*; the events hold *how it got there*. That history is what the timeline and the stats
are built from.

**How the arrows are made:** a line between two tables is a **foreign key**, a column that
stores the other row's `id`. `applications.company_id = 1` means "this application belongs
to company 1". A **relationship** is the Python shortcut on top of that, so you can write
`application.company` instead of looking up company 1 yourself.

## One request, start to finish

What happens when you click "Move to Interview" on an application:

```
 Frontend   POST /applications/7/status   {"to_status": "INTERVIEWING"}
    │
    ▼
 api/applications.py        ROUTER: "what URL, what goes in, what comes out"
    │  checks the JSON with schemas/application.py (StatusChangeRequest)
    │  gets a database session from api/deps.py (DbSession)
    ▼
 services/status_rules.py   SERVICE: "is this allowed, and what else changes?"
    │  OA → INTERVIEWING allowed?  yes
    │  set status, next_action = PREPARE_INTERVIEW, last_activity_at = now
    │  add a StatusEvent row (the history)
    ▼
 models/*.py  +  db.py      MODELS: Python classes that are the tables
    │  session.commit()  →  Postgres saves it
    ▼
 schemas/application.py     SCHEMA: turns the Application into JSON (ApplicationRead)
    │
    ▼
 Frontend   200  {"id": 7, "status": "INTERVIEWING", ...}
```

Routers stay thin. If you're writing an `if` about business rules inside `api/`, it
belongs in `services/`.

## Every folder, in plain words

| Folder | What it is | You write it? |
|---|---|---|
| `app/models/` | The tables, as Python classes. Columns and the links between tables. | Yes (relationships, constraints) |
| `alembic/versions/` | **Migrations**: the scripts that create or change the real tables in Postgres to match the models. Generated, then you check them. | Yes |
| `app/schemas/` | The shape of JSON going in and out (Pydantic). Separate from models, so the API never leaks internal columns. | Already written |
| `app/api/` | **Routers**: one file per URL group (`/companies`, `/applications`, …). | Yes (the bodies) |
| `app/services/` | The rules: allowed status changes, stats math, ghosting. Pure logic, no HTTP. | Yes |
| `app/integrations/` | Talking to the outside: Gmail and the AI classifier. | Yes |
| `app/jobs/` | Things that run on a timer (daily ghosting, email sync). | Yes |
| `app/scripts/` | One-off commands (import your Notion CSV). | Yes |
| `app/config.py`, `db.py`, `main.py` | Wiring: settings, the database connection, plugging routers into the app. | Already written |
| `tests/` | pytest tests. `conftest.py` sets up a test database. | Yes (not conftest) |

## Words that keep coming up

| Word | Plain meaning |
|---|---|
| **Model** | A Python class that *is* a table. One attribute = one column. |
| **Schema** | A Pydantic class that describes JSON. Checks input, shapes output. |
| **Migration** | A script that changes the real database to match the models. Models alone change nothing in Postgres. |
| **Foreign key** | A column holding another table's `id`. It's the arrow in the diagram. |
| **Relationship** | The Python shortcut over a foreign key (`application.company`). |
| **`back_populates`** | Ties the two ends of one relationship together, so each side knows its partner. |
| **Nullable** | The column may be empty (`None`). Written `Mapped[X | None]`. |
| **Session** | Your conversation with the database for one request. Add, change, then `commit()`. |
| **Router** | Groups the URLs for one resource. |
| **Service** | A plain function holding a business rule. Easy to test without HTTP. |
| **Dependency** | Something FastAPI hands your endpoint automatically (like the session). |

## The order you build in

1. **Finish the models**: the four tables are right.
2. **First migration**: the tables now really exist in Postgres.
3. **Companies endpoints**: your first full request, from URL to database and back. Simplest table, no rules.
4. **Applications endpoints**: same pattern, plus filters.
5. **Status rules and the status endpoint**: your first service.
6. Stats, then email, then background jobs, then login and deploy.

Each step ends with something you can try at `http://localhost:8000/docs`.
