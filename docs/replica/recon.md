# Recon: Jobright.ai

> Produced following the `/replica-recon` method, done by hand from public sources only (marketing pages, review sites, third-party reviews). No scraping, no bundles, no account. Clean-room: we map *what it does*, never its code, copy, or assets.
> Date: 2026-10-03

## 1. Scope

| | |
|---|---|
| App | Jobright.ai (web app, Chrome extension, iOS app) |
| What it is | An AI job-search copilot: find jobs → tailor resume → autofill applications → track |
| Slice JobBear cares about | **Track + understand outcomes.** Not job discovery, not auto-apply |
| Why that slice | JobBear's core is tracking with status history and analytics. Discovery and auto-apply need huge job datasets and ATS automation that don't fit 2–3 weeks or the learning goals |

## 2. Sources

| Priority | Source | What it gave us |
|---|---|---|
| 1 | Trustpilot (1–3★ filter), [link](https://www.trustpilot.com/review/jobright.ai) | ~20 recent low/mid-star reviews (Sep 2026) |
| 2 | Adzuna review, [link](https://www.adzuna.co.uk/blog/jobright-review-better-alternative-in-2025/) | Feature list, pricing (~$40/mo "Turbo"), weaknesses |
| 3 | Review roundups: [favtutor](https://favtutor.com/jobright-ai-review/), [jobhire](https://jobhire.ai/blog/jobright-ai-review-and-decision-guide-2026), [jobcopilot](https://jobcopilot.com/jobright-best-alternative/), [scoutify](https://scoutify.com/blog/jobright-review) | Summarized Reddit sentiment, feature descriptions |
| 4 | G2 discussions, [link](https://www.g2.com/products/jobright/discuss) | Feature confirmation |
| 5 | App Store listing, [link](https://apps.apple.com/app/id6738236788) | Confirms tracker, insider connections, alerts |

Caveat: roundup sites often sell a competing product, so treat their summaries as biased.

## 3. Screen inventory (inferred from public descriptions)

| Screen | Purpose | States to design for |
|---|---|---|
| Job feed / recommendations | Ranked jobs with a match score | empty (new profile), loading, filled, no matches |
| Job detail | Description, match breakdown, insider connections, apply button | expired posting, duplicate |
| Resume builder / tailor | AI rewrite of bullets per job | generating, diff/review, error |
| Cover letter generator | Generated letter per job | |
| Autofill (extension overlay) | Fills ATS forms | partial fill, wrong fill (a frequent complaint) |
| Application tracker | List or board of applied jobs with status | empty, many items |
| AI coach | Chat assistant | |
| Pricing / billing | Free credits vs. paid tier | |

**JobBear equivalent screens:** Dashboard (analytics), Applications list, Application detail (status timeline + linked emails), Email review queue (low-confidence classifications), Login.

## 4. Key user flows

1. **Discover → apply** (Jobright core): feed → job detail → tailor resume → autofill → marked applied. *Out of JobBear scope.*
2. **Track** (JobBear core): add application (manually or via Notion import) → status changes over time → see the history.
3. **Outcome loop** (JobBear's differentiator): recruiter email arrives → classified → application status updates → dashboard rates update.
   - Edge case: email can't be matched to an application → review queue
   - Edge case: low confidence → review queue, no auto-change
   - Edge case: no reply in 14 days → GHOSTED (system event)

## 5. Components (JobBear-relevant)

StatusBadge (exists), status timeline, application table with filters and pagination, stat tile, weekly volume chart, email card with classification + confidence, confirm/override buttons on review items.

## 6. Data model (inferred for Jobright, with confidence)

| Entity | Likely fields | Confidence |
|---|---|---|
| User / Profile | skills, experience, preferences, resume(s) | High (needed for matching) |
| Job | title, company, location, posted_at, source, match_score | High |
| Application | job, status, applied_at | Medium (tracker exists; depth of status history unknown) |
| Resume version | per-job tailored copy | Medium |
| Connection | insider contact at company | Medium |

**Unknown:** whether Jobright keeps a status *history* (events) or just a current status, and whether status updates from email at all. We found no evidence either way. **Don't claim in marketing that Jobright lacks it without verifying with a real account.**

JobBear already models this more deeply: `applications` + `status_events` (full history) + `emails` (linked evidence).

## 7. Feature matrix

See `features.csv`.

## 8. Scope exclusions (can't or won't clone)

- Job aggregation from hundreds of thousands of daily listings (data licensing and scraping issues, plus infra)
- Auto-apply / ATS autofill (fragile, ToS issues, and a top source of complaints anyway)
- Insider connections (needs LinkedIn data access)
- Resume tailoring (possible later, but not backend learning; see the v2 list)
- Multi-user SaaS, billing, mobile app

## 9. Sizing

| Area | Size | Hardest part |
|---|---|---|
| Tracker + status history | M | Transition rules, keeping events consistent |
| Analytics dashboard | M | Correct rate definitions and aggregate SQL |
| Gmail sync + Claude classification | L | Email → application matching, idempotent sync, confidence handling |
| Ghosting job | S | Idempotency, controlling time in tests |
| Notion import | S | Dedup rule, date parsing |

## Summary

1. Jobright is a *discovery + apply* tool; tracking is a side feature.
2. JobBear should not compete on discovery. It should compete on **what happens after you apply**.
3. JobBear's schema (status_events + emails) already supports a deeper outcome loop than Jobright appears to offer.
4. Biggest build risk: Gmail → application matching.
5. Next: `fixes.md` (from the entrepreneur pass), then `/replica-architect` as a proposal you review.
