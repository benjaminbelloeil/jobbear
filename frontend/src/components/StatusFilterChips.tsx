import { APPLICATION_STATUSES, type ApplicationStatus } from '../types'
import { STATUS_META } from './statusStyles'

interface StatusFilterChipsProps {
  selected: ApplicationStatus[]
  onToggle: (status: ApplicationStatus) => void
}

/** Toggleable status chips. Purely visual: the caller owns `selected` and what toggling does. */
export default function StatusFilterChips({ selected, onToggle }: StatusFilterChipsProps) {
  return (
    <div role="group" aria-label="Filter by status" className="flex flex-wrap gap-2">
      {APPLICATION_STATUSES.map((status) => {
        const active = selected.includes(status)
        return (
          <button
            key={status}
            type="button"
            aria-pressed={active}
            onClick={() => onToggle(status)}
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors ${
              active
                ? 'border-bark bg-bark text-birch-50'
                : 'border-birch-300 bg-birch-50 text-bark-700 hover:border-bark-400'
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${STATUS_META[status].dot} ${active ? 'ring-1 ring-birch-50' : ''}`}
            />
            {STATUS_META[status].label}
          </button>
        )
      })}
    </div>
  )
}
