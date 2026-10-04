import type { ApplicationStatus } from '../../types'
import { STATUS_META } from '../statusStyles'

export interface StatusCount {
  status: ApplicationStatus
  count: number
}

interface StatusBreakdownProps {
  items: StatusCount[]
}

/** Horizontal bars, one per status, scaled to the largest count. */
export default function StatusBreakdown({ items }: StatusBreakdownProps) {
  const max = Math.max(1, ...items.map((item) => item.count))
  return (
    <ul className="space-y-3">
      {items.map(({ status, count }) => {
        const meta = STATUS_META[status]
        return (
          <li key={status} className="grid grid-cols-[6.5rem_1fr_2rem] items-center gap-3 text-sm">
            <span className="flex items-center gap-2 text-bark-700">
              <span className={`h-2 w-2 rounded-full ${meta.dot}`} />
              {meta.label}
            </span>
            <span className="h-2.5 overflow-hidden rounded-full bg-birch-200">
              <span
                className="fill-in block h-full rounded-full"
                style={{ width: `${(count / max) * 100}%`, backgroundColor: meta.hex }}
              />
            </span>
            <span className="text-right font-medium tabular-nums">{count}</span>
          </li>
        )
      })}
    </ul>
  )
}
