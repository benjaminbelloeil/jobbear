# Fixes and positioning: JobBear vs. Jobright

> Output of the `/replica-entrepreneur` pass. Evidence lives in `feedback.md`.
> Rule from CLAUDE.md: this decides *what* to build. Benjamin writes the backend code.

## Fix plan (ranked)

| # | Fix | Complaint it answers | Size | Release | Where it lives (you write it) |
|---|---|---|---|---|---|
| 1 | **Outcome dashboard**: response, OA, interview rates; days to first reply | #1 "no results, no insight" | M | v1 | `services/stats.py`, `api/stats.py` |
| 2 | **Inbox-driven status updates**: Gmail + Claude classification | #1 (sees outcomes automatically) | L | v1 | `integrations/`, `jobs/` |
| 3 | **Human-in-the-loop AI**: confidence threshold + review queue, never a silent change below 0.8 | #2, #3 "AI is confidently wrong" | M | v1 | `classifier.should_auto_update`, `api/emails.py` |
| 4 | **Ghost detection**: auto GHOSTED after 21 days (or after the application's own deadline, if later), logged as a SYSTEM event | unsolved "am I being ghosted?" | S | v1 | `services/ghosting.py` |
| 5 | **Per-source funnel**: response rate by referral / LinkedIn / ATS, so you know which channel to fix | missing "which channel works?" | S | v1 | `services/stats.py` |
| 6 | **Stale-posting flag**: check that `job_url` is still live | #4 phantom listings | M | v2 | new job |
| 7 | **Follow-up reminders** from `next_action` | ghosting | S | v2 | |

v1 = fixes 1–5. Every one of them is already in the CLAUDE.md build order, so **no new scope**. The research just confirms which features matter most.

## Positioning (three evidence-backed angles)

1. **"Know why, not just how many."** Jobright helps you send more applications; JobBear shows which ones work. (Answers theme #1.)
2. **"Your inbox keeps score."** Status updates come from real recruiter emails, with every change logged and traceable to the email that caused it. (Answers #1 and #7. Verify Jobright doesn't already do this before saying so publicly.)
3. **"AI that asks before it acts."** Low-confidence classifications go to you for review; nothing is ever invented. (Answers #2 and #3.)

## Interview angle

"I researched a competitor's real user complaints, found that the pain was *post-application visibility* rather than discovery, and scoped my project around that." That's a stronger story than "I cloned Jobright."

## Metric definitions (decided 2026-10-03)

- **Response** = the application reached OA, INTERVIEWING (includes phone screens), OFFER, or REJECTED at any point. Judge this from `status_events` history, not current status.
- **Ghosted** = no response 21 days after `applied_at`, or after the application's own deadline if that's later. GHOSTED counts as a *non-response* in rates.
- **Per-source funnel** = response rate grouped by `applications.source`.
- Open questions (decide when writing `stats.py`): maturity window for the denominator, WITHDRAWN handling, whether "deadline" means the closing date or the expected-reply date.
