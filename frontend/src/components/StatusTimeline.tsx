import type { StatusEvent } from '../types'
import Icon from './Icon'
import StatusBadge from './StatusBadge'
import { EVENT_SOURCE_LABELS, STATUS_META } from './statusStyles'

interface StatusTimelineProps {
  /** Rendered in the order given; GET /applications/:id/events returns oldest first. */
  events: StatusEvent[]
}

const dateTime = new Intl.DateTimeFormat(undefined, {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
})

/** Vertical history of status changes, each with who or what caused it. */
export default function StatusTimeline({ events }: StatusTimelineProps) {
  return (
    <ol className="relative space-y-6 before:absolute before:bottom-2 before:left-[5px] before:top-2 before:w-px before:bg-birch-300">
      {events.map((event) => (
        <li key={event.id} className="relative pl-7">
          <span
            className={`absolute left-0 top-1.5 h-[11px] w-[11px] rounded-full ring-4 ring-birch-50 ${
              STATUS_META[event.to_status].dot
            }`}
          />
          <div className="flex flex-wrap items-center gap-1.5 text-sm">
            {event.from_status && (
              <>
                <StatusBadge status={event.from_status} />
                <Icon name="chevronRight" size={14} className="text-bark-500" />
                <span className="sr-only">changed to</span>
              </>
            )}
            <StatusBadge status={event.to_status} />
          </div>
          <p className="mt-1.5 text-xs text-bark-500">
            <time dateTime={event.occurred_at}>{dateTime.format(new Date(event.occurred_at))}</time>
            <span className="mx-1.5 text-bark-500">/</span>
            {EVENT_SOURCE_LABELS[event.source]}
          </p>
          {event.note && <p className="mt-1.5 text-sm text-bark-700">{event.note}</p>}
        </li>
      ))}
    </ol>
  )
}
