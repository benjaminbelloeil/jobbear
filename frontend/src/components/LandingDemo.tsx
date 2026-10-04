import { useState } from 'react'

import BearMark from './BearMark'
import Icon from './Icon'

/**
 * The landing page's one authored moment: a recruiter email turns into a status change
 * with a logged reason. Pure CSS (see `.demo` in index.css); "Replay" remounts it.
 */
export default function LandingDemo() {
  const [run, setRun] = useState(0)

  return (
    <div className="relative">
      <div
        key={run}
        className="demo grid items-center gap-4 lg:grid-cols-[minmax(0,1fr)_4rem_auto_4rem_minmax(0,1fr)] lg:gap-0"
        aria-label="Example: an interview invite email changes an application from Applied to Interviewing, and the change is logged."
        role="img"
      >
        {/* 1. The email */}
        <div
          data-step="email"
          className="rounded-panel bg-birch-50 p-5 text-bark shadow-[0_18px_40px_-24px_rgba(0,0,0,0.6)]"
        >
          <p className="flex items-center gap-2 text-sm text-bark-500">
            <Icon name="mail" size={16} />
            careers@meridian.example
          </p>
          <p className="mt-2 font-display text-lg font-semibold leading-snug">
            Scheduling your interview
          </p>
          <p className="mt-1 text-sm leading-relaxed text-bark-700">
            The team enjoyed your application. Could you share a few time slots next week?
          </p>
        </div>

        <span
          data-step="link-1"
          aria-hidden
          className="mx-auto hidden h-[3px] w-full origin-left rounded-full bg-honey lg:block"
        />

        {/* 2. The bear reads it */}
        <div
          data-step="read"
          className="mx-auto flex w-full max-w-[15rem] flex-col items-center rounded-panel border border-birch/15 px-5 py-5 text-center lg:w-56"
        >
          <span className="grid h-16 w-16 place-items-center rounded-full bg-birch">
            <BearMark size={48} />
          </span>
          <p className="mt-3 text-sm text-birch-300">Looks like</p>
          <p className="font-display text-lg font-semibold text-birch-50">Interview invite</p>
          <span className="mt-3 flex w-full items-center gap-2 text-sm">
            <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-birch/15">
              <span data-step="meter" className="block h-full w-[94%] rounded-full bg-honey" />
            </span>
            <span className="tabular-nums text-birch-50">94%</span>
          </span>
        </div>

        <span
          data-step="link-2"
          aria-hidden
          className="mx-auto hidden h-[3px] w-full origin-left rounded-full bg-honey lg:block"
        />

        {/* 3. The application updates, with a reason */}
        <div className="rounded-panel bg-birch-50 p-5 text-bark shadow-[0_18px_40px_-24px_rgba(0,0,0,0.6)]">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-display text-lg font-semibold leading-snug">Meridian Maps</p>
              <p className="text-sm text-bark-700">Data Engineer Intern</p>
            </div>
            <span className="relative inline-grid">
              <span
                data-step="old-badge"
                className="col-start-1 row-start-1 rounded-full bg-lake-50 px-2.5 py-0.5 text-xs font-medium text-lake ring-1 ring-inset ring-lake/25"
              >
                Applied
              </span>
              <span
                data-step="new-badge"
                className="col-start-1 row-start-1 whitespace-nowrap rounded-full bg-honey-50 px-2.5 py-0.5 text-xs font-medium text-honey-800 ring-1 ring-inset ring-honey/40"
              >
                Interviewing
              </span>
            </span>
          </div>
          <p
            data-step="history"
            className="mt-4 flex items-center gap-2 border-t border-birch-200 pt-3 text-sm text-bark-700"
          >
            <span className="h-2 w-2 shrink-0 rounded-full bg-honey" />
            Changed from email, just now
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setRun((n) => n + 1)}
        className="mt-6 inline-flex items-center gap-2 rounded-control text-sm text-birch-300 hover:text-birch-50"
      >
        <Icon name="refresh" size={16} />
        Replay
      </button>
    </div>
  )
}
