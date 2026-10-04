# Pricing: what people already pay for, and what JobBear could charge

> Research pass, 2026-10-04. **Scope guard:** pricing is **v2**. v1 is single-user with an
> admin login, so there is nobody to bill yet. This doc decides *what* a paid tier would be,
> so v1 choices don't block it.

## 1. What's verified vs. what isn't

| Claim | Status |
|---|---|
| Competitor prices below | **Verified**: pricing page or a dated review that checked the in-app price |
| Job seekers pay for these tools at all | **Verified indirectly**: several companies have kept $29–40/month plans running, and Jobright *raised* its price (users kept paying) |
| People will pay **for JobBear's specific features** | **Not verified.** No product, no users. Needs the test in §5 |

Don't say "verified" about §4 until §5 has run.

## 2. Market prices (2026)

| Product | Free tier | Paid | Source |
|---|---|---|---|
| Jobright Turbo | 4 autofills, 2 resumes, 2 cover letters per day; full job feed | **$39.99/mo**, $89.98/quarter, **$17.99/week**; raised from $29.99 | [jobity, checked 2026-08-31](https://jobity.io/blog/jobright-review), [favtutor](https://favtutor.com/jobright-ai-review/) |
| Huntr Pro | Tracking up to **100 jobs**, 2 tailored resumes | **$40/mo**, $90/quarter, $160/6 months | [huntr.co/pricing](https://huntr.co/pricing) |
| Teal+ | Unlimited job tracking | **$29 / 30 days**, $13/week, $79/quarter | [prentus roundup](https://prentus.com/blog/we-found-the-5-best-job-tracker-tools-on-the-market) (Teal's own page blocked automated access) |
| Simplify+ | Unlimited tracking and autofill, free forever | Price not public; weekly, monthly or quarterly plans | [Simplify help center](https://help.simplify.jobs/en/articles/8410005-how-to-manage-or-cancel-your-subscription) |

## 3. What the evidence says

1. **Tracking is free everywhere.** Simplify and Teal track for free, and Huntr is free up to
   100 jobs. JobBear can't charge for a tracker.
2. **People pay for automation and AI output**: autofill, tailored resumes, cover letters.
   Those are exactly the features JobBear leaves out (they're Jobright's top complaints).
3. **Job searches are episodic.** Every competitor sells weekly or quarterly passes. People
   pay for a burst, then want to stop.
4. **Billing is a complaint theme** (`feedback.md` #5): price rises, auto-renew, hard
   cancellation.
5. **Gmail access has a fixed cost.** `gmail.readonly` is a *restricted* scope. A public app
   using it needs Google's annual third-party security assessment (CASA), reported at a few
   hundred to several thousand dollars a year
   ([Nylas](https://developer.nylas.com/docs/cookbook/use-cases/build/google-oauth-scopes/),
   [GMass](https://www.gmass.co/blog/google-oauth-verification-security-assessment/)).
   Your personal, unverified OAuth app (yourself as test user) is fine for v1. A paid public
   product is not.

## 4. Proposal (unvalidated)

**Free (the hook): know why.** Unlimited manual tracking, status history, the dashboard
and the **per-source funnel**. Competitors charge for output, so give away the insight they
don't have.

**Hunt Pass (paid): your inbox keeps score.** Automatic status updates from recruiter
emails, the review queue, and ghost detection.
- **$12 for 30 days or $29 for 90 days, ending on its own (no auto-renew).** Fits the
  episodic pattern, answers the billing complaint, and stays well under the $29–40 tier
  because there's no AI resume generation.
- Your data and dashboard stay free after the pass ends.
- **Ingestion by forwarding, not Gmail OAuth:** the user sets a Gmail filter that forwards
  recruiter mail to a personal JobBear address. No restricted scope, no CASA fee, and it
  works with any email provider. Keep the Gmail API path for your own v1 instance.

Unit cost to check before pricing: Claude classification per email (Haiku-class model;
subject + snippet only) × ~50–200 recruiter emails per search. Should be cents, but
measure it with your real v1 data.

## 5. How to verify willingness to pay (cheap, before building billing)

1. **Fake-door test** on the landing page (`/replica-launch`): show the two tiers with real
   prices. "Get Hunt Pass" opens a waitlist form instead of checkout.
   **Pass bar:** at least 5% of unique visitors click it, from at least 200 visitors.
2. **Ten conversations** with students mid-search (your own network): show the dashboard
   with their own Notion data imported. Ask what they'd pay for the inbox part. A useful
   answer is a number they'd pay *this week*, not "maybe".
3. **Pre-sale:** if 10 people pay $12 up front for a pass that starts at launch, that is
   verification. Clicks and compliments are not.

## 6. What this changes in v1 (nothing big)

- Keep `source` required on every application: the free tier's best feature depends on it.
- Keep Gmail-specific code inside `integrations/gmail_client.py`, so a forwarding inbox can
  replace it later without touching `services/`.
- Add nothing billing-related to v1.
