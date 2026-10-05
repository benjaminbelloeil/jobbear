import type { ApplicationStatus } from '../../types'
import { STATUS_META } from '../statusStyles'

export interface StatusCount {
  status: ApplicationStatus
  count: number
}

interface StatusBreakdownProps {
  items: StatusCount[]
}

/**
 * One segmented bar for the whole picture at a glance, then a row per status with its
 * own bar scaled to the largest count.
 */
export default function StatusBreakdown({ items }: StatusBreakdownProps) {
  const max = Math.max(1, ...items.map((item) => item.count))
  const total = Math.max(
    1,
    items.reduce((sum, item) => sum + item.count, 0),
  )
  return (
    <div>
      <div aria-hidden className="fill-in mb-5 flex h-3.5 gap-0.5 overflow-hidden rounded-full">
        {items.map(({ status, count }) => (
          <span
            key={status}
            title={`${STATUS_META[status].label}: ${count}`}
            className="h-full transition-[filter] duration-150 hover:brightness-110"
            style={{
              width: `${(count / total) * 100}%`,
              backgroundColor: STATUS_META[status].hex,
            }}
          />
        ))}
      </div>

      <ul className="space-y-1">
        {items.map(({ status, count }, index) => {
          const meta = STATUS_META[status]
          return (
            <li
              key={status}
              className="-mx-2 grid grid-cols-[6.5rem_1fr_2rem] items-center gap-3 rounded-control px-2 py-1.5 text-sm transition-colors duration-150 hover:bg-white"
            >
              <span className="flex items-center gap-2 text-bark-700">
                <span className={`h-2 w-2 rounded-full ${meta.dot}`} />
                {meta.label}
              </span>
              <span className="h-2 overflow-hidden rounded-full bg-birch-200">
                <span
                  className="fill-in block h-full rounded-full"
                  style={
                    {
                      width: `${(count / max) * 100}%`,
                      backgroundColor: meta.hex,
                      '--delay': `${index * 50}ms`,
                    } as React.CSSProperties
                  }
                />
              </span>
              <span className="text-right font-medium tabular-nums">{count}</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
