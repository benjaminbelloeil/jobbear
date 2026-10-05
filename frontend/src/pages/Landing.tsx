import { lazy, Suspense, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'

import Icon, { type IconName } from '../components/Icon'
import AiSwitchboard from '../components/landing/AiSwitchboard'
import Comparison from '../components/landing/Comparison'
import HowItWorks from '../components/landing/HowItWorks'
import SiteFooter from '../components/landing/SiteFooter'
import SiteHeader, { type NavLink } from '../components/landing/SiteHeader'
import WakeUpBear from '../components/landing/WakeUpBear'
import LandingDemo from '../components/LandingDemo'
import { useInView } from '../hooks/useInView'

// The preview carries the chart library; loading it on demand keeps the first paint light.
const ProductPreview = lazy(() => import('../components/landing/ProductPreview'))

const REPO_URL = 'https://github.com/benjaminbelloeil/jobbear'
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

const AI_FACTS: [icon: IconName, text: string][] = [
  ['shield', 'Keys stay encrypted on your own server.'],
  ['mail', 'Only an email’s sender, subject and first lines go to the model.'],
  ['refresh', 'Switch providers whenever you like. Your history stays put.'],
]

const SELF_HOSTED = [
  'Tracker, dashboard and channel stats',
  'Status updates from recruiter email',
  'Your own AI key, or a free local model',
  'Gmail, or forwarding from any provider',
  'You run updates and backups',
]

// Hosted passes: one-time payments that end on their own. Founding prices hold for the first 50
// people; the regular price shows struck through. See "Business model" in CLAUDE.md.
const PASSES = [
  {
    name: 'Hunt Pass',
    days: 30,
    price: '$12',
    founding: '$9',
    blurb: 'For a short, focused search. Nothing to install.',
    featured: false,
  },
  {
    name: 'Season Pass',
    days: 90,
    price: '$29',
    founding: '$19',
    blurb: 'Most searches run longer than a month. Under $7 a month at the founding price.',
    featured: true,
  },
]

const PASS_FEATURES = [
  'Everything in self-hosted',
  'AI included, no key needed',
  'One-click email connection',
  'Updates and backups handled for you',
  '7-day free trial',
  'Your data stays readable after it ends',
]

const NAV_LINKS: NavLink[] = [
  { id: 'compare', label: 'Compare' },
  { id: 'how', label: 'How it works' },
  { id: 'why', label: 'Why JobBear' },
  { id: 'your-ai', label: 'Your AI' },
  { id: 'pricing', label: 'Pricing' },
]

const HEADLINE = ['Know which job', 'applications', 'actually work.']

/** Section headings share one scale, a step below the hero. */
const H2 =
  'text-4xl font-extrabold leading-[1.04] tracking-[-0.025em] [text-wrap:balance] sm:text-5xl lg:text-6xl'

const delay = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties

export default function Landing() {
  const [copied, setCopied] = useState(false)
  const [answersRef, answersInView] = useInView<HTMLOListElement>({ threshold: 0.15, once: true })
  const [plansRef, plansInView] = useInView<HTMLDivElement>({ threshold: 0.15, once: true })

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
      <SiteHeader links={NAV_LINKS} repoUrl={REPO_URL} />

      <main id="main">
        {/* Hero: the claim and the way in on the left, the demo proving it on the right.
          Sized to fit one laptop screen under the header. */}
        <section className="bg-bark text-birch-50">
          <div className="mx-auto grid max-w-[90rem] grid-cols-[minmax(0,1fr)] items-center gap-12 px-5 pb-16 pt-12 sm:px-8 sm:pt-16 lg:min-h-[calc(100svh-4.5rem)] lg:grid-cols-[minmax(0,1fr)_minmax(0,34rem)] lg:gap-14 lg:px-12 lg:py-10 xl:grid-cols-[minmax(0,1fr)_minmax(0,40rem)] xl:gap-20">
            <div>
              <h1 className="text-[2.625rem] font-extrabold leading-[0.98] tracking-[-0.03em] sm:text-6xl lg:text-[4rem] xl:text-[4.75rem]">
                {HEADLINE.map((line, index) => (
                  <span key={line} className="mask-line">
                    <span style={delay(index * 90)}>{line}</span>{' '}
                  </span>
                ))}
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-birch-300">
                <strong className="font-semibold text-birch-50">
                  Not a job board, and not another spreadsheet.
                </strong>{' '}
                JobBear reads your recruiter emails, updates every application’s status on its own,
                and shows which channels actually get you replies. Open source, on your own AI key
                or a local model.
              </p>
              <div className="mt-8 max-w-xl">
                <div className="flex items-center justify-between rounded-t-control border border-b-0 border-birch/15 px-4 py-2 text-sm text-birch-300">
                  Run it yourself, free
                  <button
                    type="button"
                    onClick={copyInstall}
                    className="rounded-control px-2 py-1 text-birch-50 hover:bg-birch/10"
                  >
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                  <span role="status" className="sr-only">
                    {copied ? 'Install commands copied' : ''}
                  </span>
                </div>
                <pre
                  tabIndex={0}
                  aria-label="Install commands"
                  className="overflow-x-auto rounded-b-control border border-birch/15 bg-black/25 px-4 py-3 font-mono text-[0.8125rem] leading-relaxed text-birch-50"
                >
                  <code>{INSTALL}</code>
                </pre>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href={REPO_URL} className="btn-honey btn-lg btn-lift group">
                  <Icon name="github" size={20} />
                  Get the code
                  <Icon
                    name="arrowRight"
                    size={18}
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  />
                </a>
                <a href="#how" className="btn-outline-light btn-lg">
                  See how it works
                </a>
              </div>
            </div>

            <LandingDemo />
          </div>
        </section>

        {/* Positioning: what JobBear is, next to the two things people mistake it for */}
        <section id="compare" className="scroll-mt-20 border-b border-birch-200 bg-birch-50">
          <div className="mx-auto max-w-[90rem] px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
            <div className="max-w-3xl">
              <h2 className={H2}>Not a job board. Not another spreadsheet.</h2>
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-bark-700">
                Job boards help you find roles. Spreadsheets only know what you type into them.
                JobBear starts once you’ve applied, and keeps every application up to date from the
                emails recruiters send you.
              </p>
            </div>
            <div className="mt-14">
              <Comparison repoUrl={REPO_URL} />
            </div>
          </div>
        </section>

        {/* How it works: each step beside its own scene */}
        <section
          id="how"
          className="mx-auto max-w-[90rem] scroll-mt-20 px-5 py-20 sm:px-8 sm:py-28 lg:px-12"
        >
          <div className="max-w-3xl">
            <h2 className={H2}>How it works</h2>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-bark-700">
              Four steps from a pile of recruiter emails to knowing where to spend your week.
            </p>
          </div>
          <div className="mt-16 lg:mt-24">
            <HowItWorks />
          </div>
        </section>

        {/* The product itself, with sample data */}
        <section className="bg-bark text-birch-50">
          <div className="mx-auto max-w-[90rem] px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
              <div>
                <h2 className={`${H2} max-w-3xl`}>Your whole search on one screen.</h2>
                <p className="mt-5 max-w-xl text-lg leading-relaxed text-birch-300">
                  The real dashboard, filled with sample data: replies by channel, weekly volume,
                  and the applications going quiet.
                </p>
              </div>
              <Link to="/login" className="btn-honey btn-lg btn-lift group justify-self-start">
                Open the app
                <Icon
                  name="arrowRight"
                  size={18}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </Link>
            </div>
            <div className="mt-12">
              <Suspense
                fallback={
                  <div className="h-[42rem] rounded-[1.5rem] border border-birch/15 bg-birch/5" />
                }
              >
                <ProductPreview />
              </Suspense>
            </div>
          </div>
        </section>

        {/* Why: each complaint we kept reading, and what JobBear does about it */}
        <section
          id="why"
          className="mx-auto max-w-[90rem] scroll-mt-20 px-5 py-20 sm:px-8 sm:py-28 lg:px-12"
        >
          <div className="grid gap-14 lg:grid-cols-[minmax(0,30rem)_minmax(0,1fr)] lg:gap-20">
            <div className="lg:sticky lg:top-32 lg:self-start">
              <h2 className={H2}>Built from what job seekers complain about.</h2>
              <p className="mt-5 text-lg leading-relaxed text-bark-700">
                We read reviews of popular AI job tools and built for the problems that kept coming
                up.
              </p>
            </div>
            <ol ref={answersRef} className={answersInView ? 'revealed' : 'reveal-armed'}>
              {ANSWERS.map((row, index) => (
                <li
                  key={row.heard}
                  style={delay(index * 110)}
                  className="reveal-item grid gap-5 border-t border-birch-300 py-8 first:border-t-0 first:pt-0 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:items-start md:gap-8"
                >
                  <p className="font-display text-2xl font-semibold leading-snug text-bark-500 lg:text-[1.75rem]">
                    <span aria-hidden className="text-honey-600">
                      “
                    </span>
                    {row.heard}
                    <span aria-hidden className="text-honey-600">
                      ”
                    </span>
                  </p>
                  <span
                    aria-hidden
                    className="hidden h-10 w-10 place-items-center rounded-full bg-honey text-bark md:grid"
                  >
                    <Icon name="arrowRight" size={18} />
                  </span>
                  <p className="text-lg leading-relaxed text-bark">
                    <span className="sr-only">What JobBear does: </span>
                    {row.answer}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Bring your own AI */}
        <section id="your-ai" className="scroll-mt-20 overflow-hidden bg-bark text-birch-50">
          <div className="mx-auto grid max-w-[90rem] items-center gap-14 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-20 lg:px-12">
            <div>
              <h2 className={H2}>Use your own AI key, or none at all.</h2>
              <p className="mt-5 max-w-lg text-lg leading-relaxed text-birch-300">
                Paste an API key from Anthropic, OpenAI, Google or xAI, or run a free local model
                with Ollama. You pay the provider cents of usage, not us for a subscription.
              </p>
              <ul className="mt-10 space-y-5">
                {AI_FACTS.map(([icon, text]) => (
                  <li key={text} className="flex items-start gap-4">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-birch/10 text-honey">
                      <Icon name={icon} size={18} />
                    </span>
                    <span className="pt-2 leading-relaxed text-birch-300">{text}</span>
                  </li>
                ))}
              </ul>
            </div>
            <AiSwitchboard />
          </div>
        </section>

        {/* Pricing: free to self-host, or a hosted pass that ends on its own. No subscriptions.
          The business model behind this lives in CLAUDE.md ("Business model"). */}
        <section
          id="pricing"
          className="mx-auto max-w-[90rem] scroll-mt-20 px-5 py-20 sm:px-8 sm:py-28 lg:px-12"
        >
          <div className="flex flex-wrap items-end justify-between gap-8">
            <div className="max-w-3xl">
              <h2 className={H2}>Free to run yourself. A pass if you’d rather not.</h2>
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-bark-700">
                No subscription either way. Self-host it for free, or let us host it for the 30 or
                90 days you’re searching. Every pass starts with a 7-day free trial and ends on its
                own.
              </p>
            </div>
            {/* TODO(me): once the route guard exists, point this at a public demo route that
              renders the sample data without a login. */}
            <Link to="/dashboard" className="btn-outline-dark btn-lg group">
              Try the demo, no sign-up
              <Icon
                name="arrowRight"
                size={18}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </Link>
          </div>

          <div
            ref={plansRef}
            className={`mt-14 grid gap-6 lg:grid-cols-3 ${plansInView ? 'revealed' : 'reveal-armed'}`}
          >
            {/* Self-hosted */}
            <article className="reveal-item flex flex-col rounded-[1.75rem] border border-birch-300 bg-birch-50 p-7 sm:p-9">
              <h3 className="font-display text-2xl font-bold">Self-hosted</h3>
              <p className="mt-4 flex items-baseline gap-2">
                <span className="font-display text-6xl font-extrabold tracking-tight">$0</span>
                <span className="text-bark-500">free, forever</span>
              </p>
              <p className="mt-3 text-bark-700 lg:min-h-12">
                Run it on your own machine or server with Docker.
              </p>
              <ul className="mt-8 space-y-3.5 border-t border-birch-300 pt-8">
                {SELF_HOSTED.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <Icon name="check" size={18} className="mt-0.5 shrink-0 text-pine" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-10">
                <a href={`${REPO_URL}#self-hosting`} className="btn-outline-dark btn-lg w-full">
                  <Icon name="github" size={20} />
                  Self-hosting guide
                </a>
              </div>
            </article>

            {/* Passes: same features, different length. Season is the one to pick. */}
            {PASSES.map((pass, index) => {
              const dark = pass.featured
              return (
                <article
                  key={pass.name}
                  className={`reveal-item relative flex flex-col rounded-[1.75rem] p-7 sm:p-9 ${
                    dark
                      ? 'bg-bark text-birch-50 shadow-[0_40px_80px_-40px_rgba(42,31,25,0.8)]'
                      : 'border border-birch-300 bg-birch-50'
                  }`}
                  style={delay((index + 1) * 120)}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="font-display text-2xl font-bold">{pass.name}</h3>
                    {dark && (
                      <span className="rounded-full bg-honey px-3 py-1 text-xs font-bold text-bark">
                        Best value
                      </span>
                    )}
                  </div>
                  <p className="mt-4 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                    <span className="sr-only">
                      {`Founding price ${pass.founding}, regular price ${pass.price}, for ${pass.days} days.`}
                    </span>
                    <span
                      aria-hidden="true"
                      className={`font-display text-6xl font-extrabold tracking-tight ${dark ? 'text-honey' : ''}`}
                    >
                      {pass.founding}
                    </span>
                    <s aria-hidden="true" className={dark ? 'text-birch-300' : 'text-bark-500'}>
                      {pass.price}
                    </s>
                    <span aria-hidden="true" className={dark ? 'text-birch-300' : 'text-bark-500'}>
                      for {pass.days} days
                    </span>
                  </p>
                  <p className={`mt-3 lg:min-h-12 ${dark ? 'text-birch-300' : 'text-bark-700'}`}>
                    {pass.blurb}
                  </p>
                  <ul
                    className={`mt-8 space-y-3.5 border-t pt-8 ${dark ? 'border-birch/15' : 'border-birch-300'}`}
                  >
                    {PASS_FEATURES.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <Icon
                          name="check"
                          size={18}
                          className={`mt-0.5 shrink-0 ${dark ? 'text-honey' : 'text-pine'}`}
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto pt-10">
                    <a
                      href="#reserve"
                      className={`btn-lg btn-lift w-full ${dark ? 'btn-honey' : 'btn-primary'}`}
                    >
                      Reserve the {pass.name}
                    </a>
                  </div>
                </article>
              )
            })}
          </div>

          {/* One reservation form for both passes */}
          <div
            id="reserve"
            tabIndex={-1}
            className="mt-6 grid scroll-mt-24 items-center gap-6 rounded-[1.75rem] border border-birch-300 bg-birch-50 p-7 sm:p-9 lg:grid-cols-[minmax(0,1fr)_minmax(0,32rem)] lg:gap-12"
          >
            <div>
              <h3 id="reserve-title" className="font-display text-2xl font-bold">
                Founding prices for the first 50
              </h3>
              <p className="mt-2 max-w-xl text-bark-700">
                JobBear Cloud isn’t open yet. Reserve a pass now and keep the founding price, or
                start a 7-day free trial when it opens.
              </p>
            </div>
            <div>
              {/* TODO(me): store the email and which pass they want (waitlist endpoint or a form
                service), and count submissions: this is the willingness-to-pay test in
                docs/replica/pricing.md. Later this becomes a pre-sale checkout. */}
              <form
                aria-labelledby="reserve-title"
                className="flex flex-col gap-2 sm:flex-row"
                onSubmit={(e) => e.preventDefault()}
              >
                <label htmlFor="waitlist-email" className="sr-only">
                  Email
                </label>
                <input
                  id="waitlist-email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="you@example.com"
                  aria-describedby="reserve-note"
                  className="field py-3"
                />
                <button type="submit" className="btn-primary btn-lg btn-lift shrink-0">
                  Reserve my pass
                </button>
              </form>
              <p id="reserve-note" className="mt-3 text-sm text-bark-500">
                We’ll email you once, when Cloud opens. Nothing is charged today.
              </p>
            </div>
          </div>
        </section>

        {/* Final call to action: a honey band, and the bear wakes up when you get here */}
        <section className="bg-honey text-bark">
          <div className="mx-auto grid max-w-[90rem] items-center gap-12 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-[auto_minmax(0,1fr)] lg:gap-20 lg:px-12">
            <div className="grid aspect-square w-48 place-items-center justify-self-center rounded-full bg-birch shadow-[0_30px_60px_-30px_rgba(42,31,25,0.6)] sm:w-60 lg:w-72">
              <WakeUpBear size={170} />
            </div>
            <div className="text-center lg:text-left">
              <h2 className="text-4xl font-extrabold leading-[1.02] tracking-[-0.03em] [text-wrap:balance] sm:text-6xl lg:text-7xl">
                Stop guessing where your applications went.
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-bark-700 sm:text-xl">
                Clone it, run it, and let the bear read the inbox.
              </p>
              <div className="mt-9 flex flex-wrap justify-center gap-3 lg:justify-start">
                <a href={REPO_URL} className="btn-primary btn-lg btn-lift group">
                  <Icon name="github" size={20} />
                  Get the code
                  <Icon
                    name="arrowRight"
                    size={18}
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  />
                </a>
                <Link to="/login" className="btn-outline-dark btn-lg">
                  Open the app
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter links={NAV_LINKS} repoUrl={REPO_URL} />
    </div>
  )
}
