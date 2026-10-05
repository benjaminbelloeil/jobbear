import type { ComponentType } from 'react'

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

/**
 * One step: its text, and right beside it the illustration of that step. The scene's motion
 * waits (paused at its first frame) until the scene is on screen, then plays once.
 */
function StepRow({ step, index }: { step: Step; index: number }) {
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.35, once: true })
  const { Scene } = step

  return (
    <li className="grid items-center gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
      <div className="max-w-md">
        <p className="font-display text-sm font-bold text-honey-800">Step {index + 1}</p>
        <h3 className="mt-2 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
          {step.title}
        </h3>
        <p className="mt-4 text-lg leading-relaxed text-bark-700">{step.body}</p>
      </div>
      <div
        ref={ref}
        className="rounded-[1.75rem] border border-birch-200 bg-birch-50 p-5 shadow-[0_30px_60px_-40px_rgba(42,31,25,0.5)] sm:p-8"
      >
        <div className={`scene play lg:h-[24rem] ${inView ? '' : 'scene-wait'}`}>
          <Scene />
        </div>
      </div>
    </li>
  )
}

/** Four steps, each paired with its own scene, so the picture always matches the words. */
export default function HowItWorks() {
  return (
    <ol className="space-y-24 lg:space-y-32">
      {STEPS.map((step, index) => (
        <StepRow key={step.title} step={step} index={index} />
      ))}
    </ol>
  )
}
