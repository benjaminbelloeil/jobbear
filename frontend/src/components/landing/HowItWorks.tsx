import { useEffect, useState, type ComponentType } from 'react'

import { useInView } from '../../hooks/useInView'
import { InboxScene, InsightScene, SortScene, TrackScene } from './Scenes'

interface Step {
  title: string
  body: string
  Scene: ComponentType
}

const STEPS: Step[] = [
  {
    title: 'Add what you applied to',
    body: 'Paste the role and where you found it, or import your Notion export. Every application starts as Applied, and its source is recorded so you can compare channels later.',
    Scene: TrackScene,
  },
  {
    title: 'Point JobBear at your inbox',
    body: 'Read-only Gmail, or a forwarding address that works with any provider. JobBear never sends, deletes or replies.',
    Scene: InboxScene,
  },
  {
    title: 'The bear sorts every reply',
    body: 'When the model is sure, the status changes and the email is logged as the reason. When it isn’t, the email waits in your Inbox for a yes or no.',
    Scene: SortScene,
  },
  {
    title: 'See what’s actually working',
    body: 'Response and interview rates per channel, a quiet counter on every application, and findings in plain sentences you can act on this week.',
    Scene: InsightScene,
  },
]

/** One step's text. On small screens its scene sits right under it. */
function StepBlock({
  step,
  index,
  onActive,
}: {
  step: Step
  index: number
  onActive: (index: number) => void
}) {
  const [ref, inView] = useInView<HTMLLIElement>({ rootMargin: '-45% 0px -45% 0px', threshold: 0 })
  const [mobileRef, mobileInView] = useInView<HTMLDivElement>({ threshold: 0.5 })
  const [plays, setPlays] = useState(0)

  useEffect(() => {
    if (inView) onActive(index)
  }, [inView, index, onActive])

  useEffect(() => {
    if (mobileInView) setPlays((n) => n + 1)
  }, [mobileInView])

  const { Scene } = step
  return (
    <li ref={ref} className="lg:flex lg:min-h-[78vh] lg:items-center">
      <div className="max-w-md">
        <p className="font-display text-sm font-bold text-honey-800">Step {index + 1}</p>
        <h3 className="mt-2 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
          {step.title}
        </h3>
        <p className="mt-4 text-lg leading-relaxed text-bark-700">{step.body}</p>
      </div>
      <div
        ref={mobileRef}
        className="mt-8 rounded-panel border border-birch-200 bg-birch-50 p-5 lg:hidden"
      >
        <div key={plays} className={`scene min-h-[18rem] ${plays > 0 ? 'play' : ''}`}>
          <Scene />
        </div>
      </div>
    </li>
  )
}

/**
 * Scroll-driven explainer. Desktop: the steps scroll on the left while a sticky stage on
 * the right plays the active step's scene. Mobile: each scene plays under its step.
 */
export default function HowItWorks() {
  const [active, setActive] = useState(0)
  const { Scene } = STEPS[active]!

  return (
    <div className="grid gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-20">
      <div className="relative">
        {/* Progress rail */}
        <span
          aria-hidden
          className="absolute -left-6 top-0 hidden h-full w-[3px] rounded-full bg-birch-300 lg:block xl:-left-10"
        >
          <span
            className="ease-arrive block h-full origin-top rounded-full bg-honey transition-transform duration-500 motion-reduce:transition-none"
            style={{ transform: `scaleY(${(active + 1) / STEPS.length})` }}
          />
        </span>
        <ol className="space-y-24 lg:space-y-0">
          {STEPS.map((step, index) => (
            <StepBlock key={step.title} step={step} index={index} onActive={setActive} />
          ))}
        </ol>
      </div>

      {/* The step text is already in the DOM; the stage is a visual echo of it. */}
      <div className="hidden lg:block" aria-hidden>
        <div className="sticky top-[12vh]">
          <div className="relative rounded-[1.75rem] border border-birch-200 bg-birch-50 p-8 shadow-[0_30px_60px_-40px_rgba(42,31,25,0.5)]">
            <div className="mb-6 flex items-center gap-2" aria-hidden>
              {STEPS.map((step, index) => (
                <span
                  key={step.title}
                  className={`ease-arrive h-1.5 rounded-full transition-all duration-300 motion-reduce:transition-none ${
                    index === active ? 'w-8 bg-bark' : 'w-3 bg-birch-300'
                  }`}
                />
              ))}
            </div>
            <div key={active} className="scene play h-[26rem]">
              <Scene />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
