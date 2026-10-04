import { useState } from 'react'
import { Link } from 'react-router-dom'

import BearMark from '../components/BearMark'
import Icon from '../components/Icon'
import LandingDemo from '../components/LandingDemo'

// TODO(me): set this once the repo is public.
const REPO_URL = 'https://github.com/YOUR-USERNAME/jobbear'
const INSTALL = `git clone ${REPO_URL}\ncd jobbear && docker compose up -d`

// Each row answers a complaint theme in docs/replica/feedback.md (paraphrased, not quoted).
const ANSWERS = [
  {
    heard: 'Hundreds of applications, a handful of interviews, and no idea why.',
    answer:
      'Response, OA and interview rates per channel, so you can see that referrals get answers and the job board doesn’t.',
  },
  {
    heard: 'The AI confidently gets things wrong.',
    answer:
      'JobBear only acts alone when the model is sure. Anything below your threshold waits in your inbox for a yes or no.',
  },
  {
    heard: 'Am I being ghosted, or is it just slow?',
    answer:
      'A quiet counter on every application, and an automatic “ghosted” after 21 days of silence, logged so you can undo it.',
  },
  {
    heard: 'Duplicate, expired and phantom listings.',
    answer: 'JobBear doesn’t list jobs at all. It tracks the ones you chose to apply to.',
  },
  {
    heard: 'Too expensive, prices go up, and cancelling is hard.',
    answer:
      'Self-hosting is free. The hosted pass ends on its own: no auto-renew, nothing to cancel.',
  },
]

const PROVIDERS = ['Claude', 'GPT', 'Gemini', 'Grok', 'Ollama (local)']

const PLAN_ROWS: [feature: string, selfHost: string, cloud: string][] = [
  ['Tracker, dashboard and channel stats', 'Included', 'Included'],
  ['Status updates from recruiter email', 'Included', 'Included'],
  ['AI model', 'Your own key', 'Included, no key needed'],
  ['Email connection', 'Your own Google app or forwarding', 'One click'],
  ['Setup', 'Docker on your machine or server', 'None'],
  ['Updates and backups', 'You', 'Us'],
]

export default function Landing() {
  const [copied, setCopied] = useState(false)

  const copyInstall = async () => {
    try {
      await navigator.clipboard.writeText(INSTALL)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="bg-birch">
      <header className="bg-bark text-birch-50">
        <nav
          aria-label="Site"
          className="mx-auto flex h-16 max-w-[90rem] items-center gap-6 px-5 sm:px-8 lg:px-12"
        >
          <Link
            to="/"
            className="flex items-center gap-2.5 rounded-control font-display text-xl font-bold"
          >
            <span className="grid h-9 w-9 place-items-center rounded-full bg-birch">
              <BearMark size={28} />
            </span>
            JobBear
          </Link>
          <ul className="ml-6 hidden items-center gap-6 text-sm text-birch-300 md:flex">
            <li>
              <a href="#why" className="hover:text-birch-50">
                Why JobBear
              </a>
            </li>
            <li>
              <a href="#your-ai" className="hover:text-birch-50">
                Bring your AI
              </a>
            </li>
            <li>
              <a href="#pricing" className="hover:text-birch-50">
                Pricing
              </a>
            </li>
          </ul>
          <div className="ml-auto flex items-center gap-2">
            <a
              href={REPO_URL}
              className="hidden items-center gap-2 rounded-control px-3 py-2 text-sm text-birch-300 hover:text-birch-50 sm:inline-flex"
            >
              <Icon name="github" size={18} />
              GitHub
            </a>
            <Link to="/login" className="btn-honey">
              Open the app
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero: the claim, the working install, then the product proving it */}
      <section className="bg-bark pb-20 text-birch-50 sm:pb-24">
        <div className="mx-auto max-w-[90rem] px-5 pt-14 sm:px-8 sm:pt-20 lg:px-12">
          <h1 className="max-w-[14ch] text-5xl font-extrabold leading-[0.98] tracking-[-0.03em] sm:text-7xl lg:text-[5.5rem]">
            Know which job applications actually work.
          </h1>
          <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,32rem)] lg:items-end">
            <p className="max-w-xl text-lg leading-relaxed text-birch-300 sm:text-xl">
              JobBear reads your recruiter emails, keeps every status change on record, and shows
              which channels get you replies. Open source, and it runs on your own AI key or a local
              model.
            </p>
            <div className="min-w-0">
              <div className="flex items-center justify-between rounded-t-control border border-b-0 border-birch/15 px-4 py-2 text-sm text-birch-300">
                Run it yourself, free
                <button
                  type="button"
                  onClick={copyInstall}
                  className="rounded-control px-2 py-1 text-birch-50 hover:bg-birch/10"
                  aria-live="polite"
                >
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
              <pre className="overflow-x-auto rounded-b-control border border-birch/15 bg-black/25 px-4 py-3 font-mono text-[0.8125rem] leading-relaxed text-birch-50">
                <code>{INSTALL}</code>
              </pre>
            </div>
          </div>

          <div className="mt-16 border-t border-birch/10 pt-12 sm:mt-20">
            <LandingDemo />
          </div>
        </div>
      </section>

      {/* Why: built from what people complain about */}
      <section id="why" className="mx-auto max-w-[90rem] px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
          <div>
            <h2 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
              Built from what job seekers complain about.
            </h2>
            <p className="mt-4 text-bark-500">
              We read reviews of popular AI job tools and built for the problems that kept coming
              up.
            </p>
          </div>
          <dl className="divide-y divide-birch-300 border-y border-birch-300">
            {ANSWERS.map((row) => (
              <div key={row.heard} className="grid gap-2 py-6 md:grid-cols-2 md:gap-10">
                <dt className="font-display text-xl font-semibold leading-snug">{row.heard}</dt>
                <dd className="leading-relaxed text-bark-700">{row.answer}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Bring your own AI */}
      <section id="your-ai" className="border-y border-birch-200 bg-birch-50">
        <div className="mx-auto grid max-w-[90rem] gap-12 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-2 lg:px-12">
          <div>
            <h2 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
              Use your own AI key, or none at all.
            </h2>
            <p className="mt-4 max-w-lg text-lg leading-relaxed text-bark-700">
              Paste an API key from Anthropic, OpenAI, Google or xAI, or run a free local model with
              Ollama. You pay the provider cents of usage, not us for a subscription.
            </p>
          </div>
          <div className="self-end">
            <ul className="flex flex-wrap gap-2">
              {PROVIDERS.map((name) => (
                <li
                  key={name}
                  className="rounded-full border border-birch-300 bg-white px-4 py-2 font-medium"
                >
                  {name}
                </li>
              ))}
            </ul>
            <p className="mt-6 flex items-start gap-3 text-sm leading-relaxed text-bark-500">
              <Icon name="shield" size={18} className="mt-0.5 text-bark" />
              Keys stay encrypted on your own server. Only an email’s sender, subject and first
              lines go to the model.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing: a real comparison, plus a waitlist that measures demand */}
      <section id="pricing" className="mx-auto max-w-[90rem] px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <h2 className="max-w-3xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          Free to run yourself. A pass if you’d rather not.
        </h2>

        <div className="relative mt-12 overflow-x-auto">
          <table className="w-full min-w-[40rem] text-left">
            <caption className="sr-only">Self-hosted versus JobBear Cloud</caption>
            <thead>
              <tr className="align-bottom">
                <th scope="col" className="w-[36%] pb-6" />
                <th scope="col" className="pb-6 pr-6 font-normal">
                  <span className="block font-display text-2xl font-bold">Self-hosted</span>
                  <span className="mt-1 block text-bark-500">Free, forever</span>
                </th>
                <th
                  scope="col"
                  className="rounded-t-panel bg-bark px-6 pb-6 pt-6 font-normal text-birch-50"
                >
                  <span className="block font-display text-2xl font-bold">JobBear Cloud</span>
                  <span className="mt-1 block text-birch-300">
                    <span className="font-display text-3xl font-bold text-honey">$12</span> for 30
                    days, ends on its own
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {PLAN_ROWS.map(([feature, selfHost, cloud]) => (
                <tr key={feature} className="border-t border-birch-300">
                  <th scope="row" className="py-4 pr-6 font-medium">
                    {feature}
                  </th>
                  <td className="py-4 pr-6 text-bark-700">{selfHost}</td>
                  <td className="border-t border-birch/10 bg-bark px-6 py-4 text-birch-50">
                    {cloud}
                  </td>
                </tr>
              ))}
              <tr>
                <td />
                <td className="pt-6 align-top">
                  <a href={REPO_URL} className="btn-primary">
                    <Icon name="github" size={16} />
                    Get the code
                  </a>
                </td>
                <td className="rounded-b-panel bg-bark px-6 pb-6 pt-2">
                  {/* TODO(me): store the email (waitlist endpoint or a form service) and count
                      submissions: this is the willingness-to-pay test in docs/replica/pricing.md. */}
                  <form
                    className="flex flex-col gap-2 sm:flex-row"
                    onSubmit={(e) => e.preventDefault()}
                  >
                    <label htmlFor="waitlist-email" className="sr-only">
                      Email
                    </label>
                    <input
                      id="waitlist-email"
                      type="email"
                      required
                      placeholder="you@example.com"
                      className="field border-birch/20"
                    />
                    <button type="submit" className="btn-honey shrink-0">
                      Join the waitlist
                    </button>
                  </form>
                  <p className="mt-2 text-xs text-birch-300">
                    Cloud is in early access. We’ll email you once, when it opens.
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <footer className="bg-bark text-birch-300">
        <div className="mx-auto flex max-w-[90rem] flex-wrap items-center gap-4 px-5 py-10 text-sm sm:px-8 lg:px-12">
          <BearMark size={28} mood="asleep" />
          <p>JobBear is an open-source job application tracker, licensed under AGPL-3.0.</p>
          <a href={REPO_URL} className="ml-auto hover:text-birch-50">
            Source on GitHub
          </a>
        </div>
      </footer>
    </div>
  )
}
