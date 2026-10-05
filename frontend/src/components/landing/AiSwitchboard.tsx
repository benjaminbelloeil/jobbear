import { useEffect, useState, type CSSProperties } from 'react'
import { siClaude, siGooglegemini, siOllama } from 'simple-icons'

import { useInView } from '../../hooks/useInView'
import BearMark from '../BearMark'
import Icon from '../Icon'
import { grokLogo, openaiLogo, type LogoPath } from './providerLogos'

// Logos: Claude, Gemini and Ollama from Simple Icons (CC0); OpenAI and Grok from Lobe
// Icons (MIT, see providerLogos.ts). All are drawn in the current text colour.
interface Provider {
  name: string
  vendor: string
  logo: LogoPath
  key: string
  sure: number
}

const PROVIDERS: Provider[] = [
  { name: 'Claude', vendor: 'Anthropic', logo: siClaude, key: 'sk-ant-••••••••', sure: 96 },
  { name: 'GPT', vendor: 'OpenAI', logo: openaiLogo, key: 'sk-••••••••', sure: 94 },
  { name: 'Gemini', vendor: 'Google', logo: siGooglegemini, key: 'AIza••••••••', sure: 95 },
  { name: 'Grok', vendor: 'xAI', logo: grokLogo, key: 'xai-••••••••', sure: 93 },
  { name: 'Ollama', vendor: 'Local model', logo: siOllama, key: '', sure: 91 },
]

// Long enough for the card's relay (email → model → badge → meter) to finish and be read.
const CYCLE_MS = 3600
// Tiles sit on a 33% orbit; the dashed ring (r=51) stays clear of them and their labels.
const RADIUS = 33 // % of the ring, centre to tile

/** Tile centre on the ring, in % of the square. First tile at 12 o'clock. */
function spot(index: number) {
  const angle = ((-90 + (index * 360) / PROVIDERS.length) * Math.PI) / 180
  return { x: 50 + RADIUS * Math.cos(angle), y: 50 + RADIUS * Math.sin(angle) }
}

const delay = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties

function ProviderGlyph({ provider, size }: { provider: Provider; size: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden className="fill-current">
      <path d={provider.logo.path} fillRule={provider.logo.evenOdd ? 'evenodd' : undefined} />
    </svg>
  )
}

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

/**
 * Bring-your-own-AI visual: the providers sit on a ring around the bear. The active one
 * sends a honey signal to the centre, and the card below shows it reading a recruiter
 * email. Cycles on its own while on screen; picking a tile stops the cycle.
 */
export default function AiSwitchboard() {
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.3 })
  const reducedMotion = usePrefersReducedMotion()
  const [active, setActive] = useState(0)
  const [picked, setPicked] = useState(false)
  // Hovering or focusing the ring pauses the cycle (WCAG 2.2.2), so it can be read.
  const [held, setHeld] = useState(false)

  useEffect(() => {
    if (!inView || picked || held || reducedMotion) return
    const timer = window.setInterval(
      () => setActive((index) => (index + 1) % PROVIDERS.length),
      CYCLE_MS,
    )
    return () => window.clearInterval(timer)
  }, [inView, picked, held, reducedMotion])

  const provider = PROVIDERS[active]!
  const local = !provider.key

  return (
    <div
      ref={ref}
      className={inView ? '' : 'ai-board-paused'}
      onMouseEnter={() => setHeld(true)}
      onMouseLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setHeld(false)
      }}
    >
      <div className="relative mx-auto aspect-square w-full max-w-[26rem] lg:max-w-[32rem]">
        {/* Wires and the slow outer ring. The ring runs just past the square's edge so the
            tiles and their labels sit well inside it. */}
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 h-full w-full overflow-visible"
          aria-hidden
        >
          <circle
            cx="50"
            cy="50"
            r="51"
            className="ai-orbit fill-none stroke-birch/25"
            strokeWidth="0.4"
            strokeDasharray="1 2.2"
          />
          {PROVIDERS.map((p, index) => {
            const { x, y } = spot(index)
            const on = index === active
            return (
              <line
                key={p.name}
                x1={x}
                y1={y}
                x2="50"
                y2="50"
                strokeLinecap="round"
                strokeWidth={on ? 0.9 : 0.4}
                strokeDasharray={on ? '1.6 2.4' : undefined}
                className={on ? 'ai-flow stroke-honey' : 'stroke-birch/15'}
              />
            )
          })}
        </svg>

        {/* The bear in the middle; it pulses each time a signal arrives */}
        <div className="absolute left-1/2 top-1/2 grid h-[32%] w-[32%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-birch shadow-[0_20px_40px_-20px_rgba(0,0,0,0.8)]">
          <span key={active} aria-hidden className="ai-pulse absolute inset-0 rounded-full" />
          <BearMark size={64} className="h-[58%] w-[58%]" />
        </div>

        {/* Provider tiles */}
        <ul aria-label="AI providers JobBear works with">
          {PROVIDERS.map((p, index) => {
            const { x, y } = spot(index)
            const on = index === active
            return (
              <li
                key={p.name}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${x}%`, top: `${y}%` }}
              >
                <button
                  type="button"
                  aria-pressed={on}
                  onClick={() => {
                    setActive(index)
                    setPicked(true)
                  }}
                  className="group flex flex-col items-center gap-1.5 rounded-control focus-visible:outline-none"
                >
                  <span
                    className={`ease-arrive grid h-12 w-12 place-items-center rounded-2xl transition duration-300 group-focus-visible:ring-2 group-focus-visible:ring-honey motion-reduce:transition-none sm:h-16 sm:w-16 ${
                      on
                        ? 'scale-110 bg-birch text-bark shadow-[0_14px_30px_-12px_rgba(0,0,0,0.7)] ring-2 ring-honey'
                        : 'bg-bark text-birch-300 ring-1 ring-birch/20 group-hover:text-birch-50 group-hover:ring-birch/40'
                    }`}
                  >
                    <ProviderGlyph provider={p} size={26} />
                  </span>
                  <span
                    className={`rounded bg-bark px-1.5 text-xs font-medium transition-colors sm:text-sm ${
                      on ? 'text-birch-50' : 'text-birch-300'
                    }`}
                  >
                    {p.name}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>

      {/* What the active provider just did, as a relay: the email comes in, the model
          carries it along the track, the status pops out the other end, then the meter
          shows how sure it was. Re-keyed per provider so it replays on every switch.
          Visual only: the tiles carry the state. */}
      <div
        key={active}
        aria-hidden
        className="scene play mt-10 rounded-[1.5rem] bg-black/25 p-5 ring-1 ring-birch/15 sm:p-6"
      >
        {/* Who's reading, and with whose key */}
        <div data-a="in" className="flex flex-wrap items-center justify-between gap-3">
          <span className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-birch text-bark ring-2 ring-honey">
              <ProviderGlyph provider={provider} size={20} />
            </span>
            <span>
              <span className="block font-display font-bold leading-tight text-birch-50">
                {provider.name}
              </span>
              <span className="block text-xs text-birch-300">{provider.vendor}</span>
            </span>
          </span>
          <span className="flex items-center gap-1.5 rounded-full bg-black/25 px-3 py-1.5 text-xs text-birch-300 ring-1 ring-birch/15">
            <Icon name={local ? 'shield' : 'key'} size={13} className="text-honey" />
            {local ? (
              'No key, runs on your machine'
            ) : (
              <code className="font-mono text-birch-50">{provider.key}</code>
            )}
          </span>
        </div>

        {/* The relay: email → model → status */}
        <div className="mt-5 grid grid-cols-[minmax(0,1fr)_minmax(2.5rem,5rem)_auto] items-center gap-2 sm:gap-3">
          <div
            data-a="slide"
            style={delay(100)}
            className="min-w-0 rounded-xl bg-birch-50 px-3 py-2.5 text-bark shadow-[0_12px_24px_-14px_rgba(0,0,0,0.8)]"
          >
            <span className="flex items-center gap-1.5 text-[0.6875rem] font-semibold text-bark-500">
              <Icon name="mail" size={12} />
              Meridian Maps
            </span>
            <span className="mt-0.5 block truncate font-display text-sm font-bold">
              Scheduling your interview
            </span>
          </div>

          <div className="relative h-10">
            <span
              data-a="draw"
              style={delay(250)}
              className="absolute inset-x-0 top-[calc(50%-1px)] h-0.5 rounded-full bg-honey/60"
            />
            {/* The model's logo carries the email down the track */}
            <span className="ai-relay absolute inset-y-0 left-0 w-full" style={delay(300)}>
              <span className="absolute left-0 top-1/2 grid h-8 w-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-birch text-bark shadow-[0_8px_16px_-8px_rgba(0,0,0,0.8)] ring-2 ring-honey">
                <ProviderGlyph provider={provider} size={15} />
              </span>
            </span>
          </div>

          <span
            data-a="pop"
            style={delay(1150)}
            className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-honey px-3 py-1.5 text-sm font-semibold text-bark shadow-[0_10px_22px_-10px_rgba(233,168,37,0.7)]"
          >
            <Icon name="check" size={14} />
            Interviewing
          </span>
        </div>

        {/* How sure it was, against your threshold */}
        <div data-a="in" style={delay(1300)} className="mt-6">
          <div className="flex items-baseline justify-between text-xs text-birch-300">
            <span>Confidence</span>
            <span className="font-display text-base font-bold tabular-nums text-birch-50">
              {provider.sure}% sure
            </span>
          </div>
          <div className="relative mt-2">
            <span className="block h-2 overflow-hidden rounded-full bg-birch/10">
              <span
                data-a="fill"
                style={{ ...delay(1400), width: `${provider.sure}%` }}
                className="block h-full rounded-full bg-honey"
              />
            </span>
            {/* Your threshold: above it, JobBear acts on its own */}
            <span className="absolute -bottom-1 -top-1 left-[80%] w-0.5 rounded-full bg-birch-50/70" />
          </div>
          <p className="mt-2.5 flex items-center gap-1.5 text-xs text-birch-300">
            <Icon name="check" size={13} className="text-honey" />
            Above your threshold, so it moved the card on its own.
          </p>
        </div>
      </div>
    </div>
  )
}
