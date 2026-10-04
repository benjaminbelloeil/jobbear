# Open source + bring your own AI key (BYOK)

> Evaluation of the idea, 2026-10-04: open-source JobBear, let people plug in the AI they
> already use (Claude, GPT, Gemini, Grok, local models), and test whether anyone will pay
> for a hosted version, the way Supabase does. **Proposal only.** You decide and write the
> backend. The Settings screen (`frontend/src/pages/Settings.tsx`) and the landing page
> (`frontend/src/pages/Landing.tsx`) already show it with sample data.

## Verdict

**Good idea, with one correction and one constraint.**

- It answers complaint #5 in `feedback.md` (price, price rises, auto-renew) head-on.
- Open source solves the biggest objection to an app that reads your inbox: *trust*.
  People can read exactly what JobBear sends to the model.
- It's a stronger portfolio and interview story than "a SaaS with a Stripe button".

## The correction: a chat subscription is not an API key

ChatGPT Plus, Claude Pro, Gemini Advanced and SuperGrok are **consumer chat plans**. They
don't include API access. API usage is billed separately, per token, from each provider's
developer console. So the honest pitch is "use your own API key (a few cents a month)",
not "use the subscription you already pay for". The landing and Settings copy already say
"your own API key" for this reason.

Two ways to keep it near-free for people without a key:
- **Ollama / local models**: free, private, slower; fine for one classification per email.
- **Your hosted tier** includes the model (that's what they'd pay for).

## The constraint: Gmail for self-hosters

A self-hoster needs their own Google Cloud project and OAuth client. An unverified app in
"Testing" status issues refresh tokens that expire after 7 days (check Google's OAuth docs
for the current rule), so sync silently stops every week. Options, best first:
1. **Forwarding address / IMAP**: the user forwards recruiter mail (a Gmail filter) to an
   inbox JobBear reads. No Google verification, any provider.
2. Gmail API in Testing mode, with a clear "reconnect weekly" warning.
3. The hosted tier does Gmail properly (verified app, CASA assessment paid once for everyone).
   That is a real reason to pay.

## How the Supabase model maps

| | Self-hosted (free) | JobBear Cloud (paid, waitlist first) |
|---|---|---|
| Code | Same open-source repo | Same |
| AI | Your API key, or Ollama | Included |
| Email | Forwarding/IMAP, or your own Google app | One-click verified Gmail |
| Setup | Docker | None |
| Price | $0 | Hunt Pass, $12 / 30 days, no auto-renew (`pricing.md`) |

People pay for **convenience and the verified Gmail connection**, not for features. Keep
every feature in the open-source version, or the trust argument falls apart.

## License (your decision)

- **Apache-2.0 / MIT**: anyone can do anything, including running a closed competing cloud.
  Easiest for contributors and employers reading your code.
- **AGPL-3.0**: anyone hosting a modified version must publish their changes. Protects a
  future paid cloud. Some companies avoid AGPL code.
**Decided 2026-10-04: AGPL-3.0** (`LICENSE` at the repo root; named on the landing page). It keeps a future paid cloud protected, like Plausible and Cal.com.

## Backend proposal (you write all of this)

1. **One interface, many providers.** In `integrations/`, define a `Protocol` (e.g.
   `EmailClassifier`) with one method that takes subject + snippet and returns the
   `ClassificationResult` you already have. One adapter per provider. The rest of the app
   (`jobs/`, `services/`) only knows the Protocol. *Interview question: why a Protocol and
   not a base class?*
2. **Same output contract for every model.** Validate every provider's answer with the
   same Pydantic model; on invalid JSON fall back to `OTHER` / confidence 0, exactly as
   `classifier.py` already specifies.
3. **Key storage.** Table `ai_providers` (provider, encrypted_key, model, last_four,
   created_at). Encrypt with a key from `config.py`/`.env` (e.g. `cryptography.Fernet`).
   Never return the key, never log it. The API returns `last_four` only (the UI already
   expects that).
4. **Endpoints.** `GET /settings/ai-providers`, `PUT /settings/ai-providers/{provider}`,
   `DELETE …/{provider}`, `POST …/{provider}/test` (one tiny classification call).
5. **Measure, don't guess.** Label ~50 of your real recruiter emails once, then score
   each provider on them (accuracy + calibration of `confidence`). That's a great
   README section and an even better interview answer.

## Scope (keep the 2–3 week plan)

- **v1 (now):** Claude only, key in `.env`, exactly as planned. Settings screen shows sample.
- **v1.5:** the Protocol + one more adapter (OpenAI or Ollama) to prove the abstraction.
- **v2:** key storage + settings endpoints, forwarding inbox, public repo + license,
  landing page live with the waitlist.

## How to know if people want it (pass bars)

Run the landing page for 2–4 weeks and post it where students job-hunt.
- **Self-host demand:** GitHub stars and clones. 100+ stars = people want the tool.
- **Paid demand:** waitlist signups at the shown $12 price. **≥5% of unique visitors**, or
  **10 people paying up front** = a real business signal (`pricing.md` §5).
- If stars are high and signups are near zero, it's a great open-source project and a
  great portfolio piece, not a business. That's a fine outcome too.
