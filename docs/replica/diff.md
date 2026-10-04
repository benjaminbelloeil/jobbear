# Diff: JobBear v1 vs. the plan (2026-10-04)

> `/replica-diff` parity check against `features.csv`, plus a `/replica-architect`-style
> **proposal** for backend changes. Per CLAUDE.md, Benjamin decides and writes every model,
> migration and endpoint below. Nothing here has been implemented in the backend.

## 1. Parity (v1 rows of features.csv)

Weights: P0 = 3, P1 = 2, P2 = 1. "Working" means usable end to end (UI + API + data).

| Feature | Pri | UI (presentation) | API | Working |
|---|---|---|---|---|
| Application CRUD | P0 | ✅ list, new, detail shells | stubs (`NotImplementedError`) | ❌ |
| Status history | P0 | ✅ `StatusTimeline` | stub | ❌ |
| Status transition rules | P0 | ✅ "Change status" panel slot | stub | ❌ |
| Single-user auth (JWT) | P0 | ✅ login page; route guard TODO | stub | ❌ |
| Outcome dashboard | P0 | ✅ `MetricStrip`, `StatusBreakdown` | stub | ❌ |
| Gmail sync | P0 | ✅ Inbox "Sync now" | stub | ❌ |
| Claude classification + threshold | P0 | ✅ confidence shown on `EmailReviewCard` | stub | ❌ |
| Per-source funnel | P0 | ✅ `SourceFunnel` | **no endpoint or schema** | ❌ |
| Days to first reply | P1 | ✅ metric slot | stub | ❌ |
| Weekly volume vs goal | P1 | ✅ `WeeklyVolumeChart` | stub | ❌ |
| Auto-ghosting | P1 | ✅ SYSTEM events labelled "Automatic" | stub | ❌ |
| Email review queue | P1 | ✅ `/inbox` page | **only `/emails/unmatched`; no actions** | ❌ |
| Notion CSV import | P2 | n/a (CLI) | stub | ❌ |

**Score: UI 100% of v1 (presentation only) · working 0 / 33 points.** That is expected at
this stage: the frontend is ahead on purpose, so every backend endpoint you finish lights
up a screen that already exists. Next in build order: auth → companies/applications CRUD →
status rules + events → stats.

## 2. Mismatches between docs and backend stubs (decide these)

1. **Ghosting deadline.** `fixes.md` and `features.csv` say ghosting is *deadline-aware*,
   but `Application` has no deadline column and `services/ghosting.py` only uses
   `last_activity_at` / `applied_at`. **Recommendation:** drop "deadline-aware" from v1
   (it needs a column, a form field and a fuzzy definition). Put it on the v2 list.
2. **Review queue misses matched-but-unsure emails.** `classifier.py` says below-threshold
   emails are "stored unmatched", but an email can match an application *and* be
   low-confidence. `GET /emails/unmatched` (`application_id IS NULL`) would never show it.
   Fix #3 in `fixes.md` ("never a silent change below 0.8") needs those emails visible.
3. **Per-source funnel has no API.** It's a P0 differentiator but `StatsSummary` has no
   per-source field. The UI expects rows of `{source, applications, response_rate,
   interview_rate}` (`SourceFunnelRow` in `frontend/src/components/charts/SourceFunnel.tsx`).
4. **Traceability claim.** Positioning angle 2 says every change is "traceable to the email
   that caused it", but `status_events` has no link to `emails`.

## 3. Proposal: backend additions (you design and write these)

| # | Change | Why | Size |
|---|---|---|---|
| A | `emails.reviewed_at` (nullable) | Lets the queue be "needs a decision" instead of "unmatched" | S |
| B | `GET /emails/review`: unreviewed emails where `application_id IS NULL` **or** `confidence < threshold` | Fixes mismatch 2 | S |
| C | `POST /emails/{id}/apply` (body: `application_id`, optional `to_status`) and `POST /emails/{id}/dismiss` | The Inbox page's two buttons; `apply` goes through `status_rules.change_status` with source=EMAIL | M |
| D | `status_events.email_id` (nullable FK) | Makes "traceable to the email" true, and the timeline can show "From email: <subject>" | S |
| E | `by_source` in `StatsSummary` **or** `GET /stats/sources` | Mismatch 3. A separate endpoint keeps `get_summary` simple | S |

Questions to think through before you write them (interview material):
- Should `apply` be idempotent if the same email is applied twice?
- What happens to `reviewed_at` emails when their application is deleted? (Ties to the
  open `ondelete` TODO in `models/email.py`.)

## 4. Frontend changes made in this pass

- **Added** `/applications/new` as a page, not a modal (the task needs no interruption).
- **Added** `/inbox` (review queue) and an Inbox nav link: the "AI that asks before it
  acts" promise needs a visible place to ask.
- **Added** `Pagination` (the API returns `total/page/page_size`), `DetailList`,
  `EmailReviewCard`, and an authored `Icon` set (replacing unicode `‹ ›`).
- **Changed** the company search box to a company **select**, because the API filters by
  `company_id`, not by name. If you want type-to-search, that's a new `q` param (v2).
- **Changed** `StatusTimeline` to render in API order (oldest first), matching
  `GET /applications/{id}/events`.
- **Removed** the big-number hero block on the dashboard (a templated pattern); the five
  metrics now share one quiet strip.

## 5. v2 / later (not v1)

Deadline-aware ghosting · stale-posting check · follow-up reminders · type-to-search
companies · email forwarding inbox (see `pricing.md`) · multi-user accounts and billing.
