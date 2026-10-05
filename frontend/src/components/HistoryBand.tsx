import type { StatusEvent } from '../types'
import { EVENT_SOURCE_LABELS, STATUS_META } from './statusStyles'

interface HistoryBandProps {
  /** Oldest first, as GET /applications/:id/events returns them. */
  events: StatusEvent[]
  /** What comes next, shown as a dashed final step. Omit when nothing is pending. */
  upNext?: string
}

const dateTime = new Intl.DateTimeFormat(undefined, {
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
})

/**
 * An application's history as one bark band: each status change left to right on wide
 * screens (top to bottom on phones), the current status in honey, and the next step dashed.
 */
export default function HistoryBand({ events, upNext }: HistoryBandProps) {
  return (
    <section
      aria-labelledby="history-title"
      className="rounded-panel bg-bark p-6 text-birch-50 shadow-[0_30px_60px_-40px_rgba(42,31,25,0.9)] sm:p-8"
    >
      <h2 id="history-title" className="text-lg font-bold tracking-tight">
        History
      </h2>
      <p className="mt-0.5 text-sm text-birch-300">Every change, and what caused it.</p>

      {events.length === 0 ? (
        <p className="mt-6 text-sm text-birch-300">No changes yet.</p>
      ) : (
        <ol className="mt-8 grid gap-7 md:auto-cols-fr md:grid-flow-col md:gap-0">
          {events.map((event, index) => {
            const current = index === events.length - 1
            return (
              <li key={event.id} className="relative pl-8 md:pl-0 md:pr-6 md:pt-9">
                {/* The rail: down to the next step on phones, across to it on wide screens. */}
                {(!current || upNext) && (
                  <span
                    aria-hidden
                    className={`absolute -bottom-7 left-[5px] top-4 w-px md:bottom-auto md:left-5 md:right-0 md:top-[5px] md:h-px md:w-auto ${
                      current
                        ? 'border-l border-dashed border-honey/60 md:border-l-0 md:border-t'
                        : 'bg-birch/25'
                    }`}
                  />
                )}
                <span
                  aria-hidden
                  className={`absolute left-0 top-1 h-3 w-3 rounded-full md:top-0 ${
                    current
                      ? 'bg-honey shadow-[0_0_0_5px_rgb(233_168_37/0.25)]'
                      : 'bg-birch-300 ring-4 ring-bark'
                  }`}
                />
                <p
                  className={`font-display text-xl font-bold tracking-tight ${current ? 'text-honey' : ''}`}
                >
                  {STATUS_META[event.to_status].label}
                </p>
                <p className="mt-1 flex flex-wrap items-center gap-2 text-xs text-birch-300">
                  <time dateTime={event.occurred_at}>
                    {dateTime.format(new Date(event.occurred_at))}
                  </time>
                  <span className="rounded-full border border-birch/20 px-2 py-0.5">
                    {EVENT_SOURCE_LABELS[event.source]}
                  </span>
                </p>
                {event.note && (
                  <p className="mt-2 max-w-xs text-sm leading-relaxed text-birch-300">
                    {event.note}
                  </p>
                )}
              </li>
            )
          })}
          {upNext && (
            <li className="relative pl-8 md:pl-0 md:pt-9">
              <span
                aria-hidden
                className="absolute left-0 top-1 h-3 w-3 rounded-full border border-dashed border-honey md:top-0"
              />
              <p className="font-display text-xl font-bold tracking-tight">{upNext}</p>
              <p className="mt-1 text-xs text-birch-300">Up next</p>
            </li>
          )}
        </ol>
      )}
    </section>
  )
}
