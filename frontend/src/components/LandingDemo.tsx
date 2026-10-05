import { Fragment, useEffect, useState, type ReactNode } from 'react'

import { useInView } from '../hooks/useInView'
import BearCharacter, { type BearMood } from './BearCharacter'
import BearMark from './BearMark'
import Icon, { type IconName } from './Icon'

// The story in six beats, as it looks on screen. Each starts at its time (ms) after the
// demo comes into view; the gaps leave time to read each moment.
// 0 inbox, bear asleep · 1 new email lands · 2 the bear opens and reads it
// 3 it decides: interview invite · 4 the screen switches to your tracker · 5 status updated
const BEATS = [0, 900, 2400, 4000, 5400, 6300]
const LAST = BEATS.length - 1

const MOOD: BearMood[] = ['sleeping', 'idle', 'reading', 'reading', 'idle', 'waving']
const SAYS = ['', 'Mail!', 'Reading…', 'An interview!', 'To your tracker…', 'Updated it for you.']

// The three stations of the flow strip under the screen.
const STATIONS: { label: string; icon: IconName | 'bear' }[] = [
  { label: 'Your inbox', icon: 'mail' },
  { label: 'The bear reads', icon: 'bear' },
  { label: 'Your tracker', icon: 'board' },
]

// Older mail already in the inbox, and other applications already in the tracker.
const OLD_MAIL: [from: string, subject: string, when: string][] = [
  ['Northwind Labs', 'Your coding assessment', 'Tue'],
  ['Halcyon Data', 'Thanks for applying', 'Mon'],
  ['Tidepool', 'We received your application', 'Sep 28'],
]
const OTHER_APPS: [company: string, role: string, status: string, tone: string][] = [
  ['Northwind Labs', 'Backend Intern', 'Assessment', 'bg-heather-50 text-heather ring-heather/25'],
  ['Halcyon Data', 'Software Engineer', 'Applied', 'bg-lake-50 text-lake ring-lake/25'],
]

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(query.matches)
    const onChange = () => setReduced(query.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])
  return reduced
}

function Badge({ tone, children }: { tone: string; children: ReactNode }) {
  return (
    <span
      className={`whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${tone}`}
    >
      {children}
    </span>
  )
}

/** A window title bar, shared by the inbox and the tracker screens. */
function TitleBar({ icon, title, extra }: { icon: ReactNode; title: string; extra: ReactNode }) {
  return (
    <div className="flex items-center gap-2.5 border-b border-birch-200 px-4 py-2.5">
      {icon}
      <span className="font-display text-sm font-bold">{title}</span>
      <span className="ml-auto">{extra}</span>
    </div>
  )
}

/**
 * The hero's one authored moment, shown the way it happens on screen. A recruiter email
 * lands in your inbox; the bear (perched on top, narrating) opens it, highlights what
 * matters and decides it's an interview invite; then the screen slides over to JobBear,
 * where that application moves to Interviewing on its own. Beats are timed in JS so the
 * bear, the screens and the flow strip stay in step; reduced motion shows the end.
 */
export default function LandingDemo() {
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.4, once: true })
  const reducedMotion = usePrefersReducedMotion()
  const [run, setRun] = useState(0)
  const [beat, setBeat] = useState(0)

  useEffect(() => {
    if (reducedMotion) {
      setBeat(LAST)
      return
    }
    if (!inView) return
    setBeat(0)
    const timers = BEATS.slice(1).map((ms, index) =>
      window.setTimeout(() => setBeat(index + 1), ms),
    )
    return () => timers.forEach((timer) => window.clearTimeout(timer))
  }, [inView, run, reducedMotion])

  const step = beat <= 1 ? 0 : beat <= 3 ? 1 : 2
  const onTracker = beat >= 4

  return (
    <div ref={ref} className="relative pt-28 sm:pt-36">
      <p className="sr-only">
        Example: an interview email arrives in your inbox, JobBear reads it as an interview invite,
        and in your JobBear tracker the application moves from Applied to Interviewing on its own.
      </p>

      {/* A faint dot texture behind the card, fading out at the edges */}
      <div
        aria-hidden
        className="demo-dots pointer-events-none absolute -inset-x-5 -bottom-10 top-12 sm:-inset-x-10"
      />

      <button
        type="button"
        onClick={() => setRun((count) => count + 1)}
        className="absolute left-1 top-16 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-birch-300 ring-1 ring-birch/20 hover:bg-birch/10 hover:text-birch-50 sm:top-20"
      >
        <Icon name="refresh" size={14} />
        Replay
      </button>

      <div className="relative">
        {/* The bear peeks over the card's top edge: its body sits behind the card, its paws
          grip the rim in front, so it looks like it's holding the whole thing up. The
          card's top lines up with the bear's chest (y≈148 of its 220-tall artboard). */}
        <div
          aria-hidden
          className="absolute bottom-full left-1/2 w-36 -translate-x-1/2 translate-y-[32.7%] sm:w-44"
        >
          <BearCharacter mood={MOOD[beat]} paused={!inView} outlined className="h-auto w-full" />
          <span
            key={beat}
            className={`bubble-in absolute bottom-[58%] left-[88%] w-max max-w-[8.5rem] rounded-2xl rounded-bl-md bg-birch-50 px-3.5 py-2 font-display text-sm font-bold leading-snug text-bark shadow-[0_12px_24px_-12px_rgba(0,0,0,0.7)] sm:max-w-none sm:px-4 sm:py-2.5 sm:text-base ${
              SAYS[beat] ? '' : 'invisible'
            }`}
          >
            {SAYS[beat] || '…'}
          </span>
        </div>

        {/* The paws, drawn on the bear's artboard scale so they line up under its shoulders.
          When it waves, the right paw lets go and the arm comes up from behind the card. */}
        <svg
          aria-hidden
          viewBox="0 0 200 40"
          className="pointer-events-none absolute left-1/2 top-0 z-20 h-auto w-36 -translate-x-1/2 -translate-y-1/2 overflow-visible sm:w-44"
        >
          {[46, 154].map((x) => (
            <g key={x} className={x > 100 && MOOD[beat] === 'waving' ? 'paw paw-let-go' : 'paw'}>
              {/* A round paw with the same birch rim as the bear (5 units outside the fur),
                  and three toe pads where the paw curls over the card's edge. */}
              <ellipse
                cx={x}
                cy="20"
                rx="21"
                ry="16"
                className="fill-bark stroke-birch-50"
                strokeWidth="10"
                paintOrder="stroke"
              />
              {[-8, 0, 8].map((dx) => (
                <ellipse
                  key={dx}
                  cx={x + dx}
                  cy={dx === 0 ? 27 : 25}
                  rx="4.4"
                  ry="3.8"
                  className="fill-honey/80"
                />
              ))}
            </g>
          ))}
        </svg>

        <div className="relative z-10 rounded-[1.75rem] bg-[#33271f] p-4 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.9)] ring-1 ring-birch/10 sm:p-5">
          {/* The screen: the inbox, then it slides over to the tracker */}
          <div
            aria-hidden
            className="relative h-[19.5rem] overflow-hidden rounded-panel bg-birch-50 text-bark shadow-[0_14px_30px_-20px_rgba(0,0,0,0.8)]"
          >
            {/* Screen 1: the inbox */}
            <div
              className={`ease-arrive absolute inset-0 transition duration-700 ${
                onTracker ? '-translate-x-full opacity-0' : 'translate-x-0 opacity-100'
              }`}
            >
              <TitleBar
                icon={<Icon name="inbox" size={16} className="text-bark-500" />}
                title="Inbox"
                extra={
                  <span className="flex items-center gap-1.5 rounded-full bg-birch px-3 py-1 text-xs text-bark-500">
                    <Icon name="mail" size={12} />
                    {beat >= 1 ? '1 new' : 'Up to date'}
                  </span>
                }
              />

              {/* The new email grows in at the top and pushes the rest down */}
              <div
                className={`ease-arrive grid transition-[grid-template-rows] duration-700 ${
                  beat >= 1 ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                }`}
              >
                <div className="overflow-hidden">
                  <div
                    className={`border-b border-birch-200 px-4 py-3 transition-colors duration-500 ${
                      beat >= 2 ? 'bg-honey-50' : 'bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="h-2 w-2 shrink-0 rounded-full bg-honey" />
                      <span className="text-sm font-bold">Meridian Maps</span>
                      <span className="ml-auto text-xs font-semibold text-bark">now</span>
                    </div>
                    <p className="mt-1 pl-[1.125rem] font-display text-[0.9375rem] font-bold leading-snug">
                      Can we{' '}
                      <mark
                        className={`demo-mark ease-arrive text-bark transition-[background-size] duration-1000 ${
                          beat >= 2 ? 'demo-mark-on' : ''
                        }`}
                      >
                        schedule an interview
                      </mark>
                      ?
                    </p>
                    {/* Opening it shows the preview, then the bear's verdict */}
                    <div
                      className={`ease-arrive grid transition-[grid-template-rows] duration-700 ${
                        beat >= 2 ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                      }`}
                    >
                      <div className="overflow-hidden pl-[1.125rem]">
                        <p className="pt-1 text-sm text-bark-700">
                          The team loved your application. Are you free next week?
                        </p>
                        <p
                          className={`ease-arrive mt-2.5 flex items-center gap-2 transition duration-500 ${
                            beat >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
                          }`}
                        >
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-bark px-2.5 py-1 text-xs font-semibold text-birch-50">
                            <BearMark size={14} />
                            Interview invite
                          </span>
                          <span className="text-xs font-semibold tabular-nums text-bark-500">
                            94% sure
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {OLD_MAIL.map(([from, subject, when]) => (
                <div
                  key={from}
                  className="flex items-center gap-3 border-b border-birch-200 px-4 py-3 text-sm text-bark-500"
                >
                  <span className="w-28 shrink-0 truncate pl-[1.125rem]">{from}</span>
                  <span className="min-w-0 flex-1 truncate">{subject}</span>
                  <span className="text-xs">{when}</span>
                </div>
              ))}
            </div>

            {/* Screen 2: the JobBear tracker */}
            <div
              className={`ease-arrive absolute inset-0 transition duration-700 ${
                onTracker ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
              }`}
            >
              <TitleBar
                icon={<BearMark size={18} />}
                title="JobBear · Applications"
                extra={<span className="text-xs text-bark-500">3 active</span>}
              />
              <div
                className={`border-b border-birch-200 px-4 py-3.5 ${
                  beat >= LAST ? 'tracker-glow bg-honey-50' : ''
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-display font-bold">Meridian Maps</p>
                    <p className="text-sm text-bark-500">Data Engineer Intern</p>
                  </div>
                  {beat >= LAST ? (
                    <span className="badge-pop">
                      <Badge tone="bg-honey-50 text-honey-800 ring-honey/40">Interviewing</Badge>
                    </span>
                  ) : (
                    <Badge tone="bg-lake-50 text-lake ring-lake/25">Applied</Badge>
                  )}
                </div>
              </div>
              {OTHER_APPS.map(([company, role, status, tone]) => (
                <div
                  key={company}
                  className="flex items-center justify-between gap-3 border-b border-birch-200 px-4 py-3.5"
                >
                  <div>
                    <p className="font-display font-semibold text-bark-700">{company}</p>
                    <p className="text-sm text-bark-500">{role}</p>
                  </div>
                  <Badge tone={tone}>{status}</Badge>
                </div>
              ))}

              {/* The toast confirming what changed and why */}
              <div
                className={`ease-arrive absolute inset-x-4 bottom-4 flex items-center gap-2.5 rounded-control bg-bark px-4 py-3 text-sm text-birch-50 shadow-[0_14px_30px_-12px_rgba(0,0,0,0.6)] transition duration-500 ${
                  beat >= LAST ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                }`}
              >
                <Icon name="check" size={16} className="shrink-0 text-honey" />
                Moved to Interviewing from the email
              </div>
            </div>
          </div>

          {/* The flow: inbox → bear → tracker. The current station lights up honey; once the
              update lands, all three settle to white as done. */}
          <ol
            aria-hidden
            className="mt-4 grid grid-cols-[auto_minmax(0,1fr)_auto_minmax(0,1fr)_auto] items-start gap-x-2 pt-1"
          >
            {STATIONS.map((station, index) => {
              // On the last beat the update has landed: every station reads as done (white).
              const finished = beat === LAST
              const active = !finished && index === step && beat > 0
              const done = finished || index < step
              return (
                <Fragment key={station.label}>
                  {index > 0 && (
                    <span
                      className={`mt-[1.375rem] h-0.5 rounded-full transition-colors duration-500 ${
                        done || active ? 'bg-honey' : 'bg-birch/15'
                      }`}
                    />
                  )}
                  <li className="flex w-20 flex-col items-center gap-2 text-center sm:w-24">
                    <span
                      className={`ease-arrive grid h-11 w-11 place-items-center rounded-full transition duration-500 ${
                        active
                          ? 'scale-110 bg-honey text-bark ring-4 ring-honey/25'
                          : done
                            ? 'bg-birch text-bark'
                            : 'bg-birch text-bark opacity-40'
                      }`}
                    >
                      {station.icon === 'bear' ? (
                        <BearMark size={26} />
                      ) : (
                        <Icon name={station.icon} size={20} />
                      )}
                    </span>
                    <span
                      className={`text-xs font-semibold leading-tight transition-colors duration-500 sm:text-sm ${
                        active || done ? 'text-birch-50' : 'text-birch-300'
                      }`}
                    >
                      {station.label}
                    </span>
                  </li>
                </Fragment>
              )
            })}
          </ol>
        </div>
      </div>
    </div>
  )
}
