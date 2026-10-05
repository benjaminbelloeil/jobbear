import { Link } from 'react-router-dom'

export interface QuietItem {
  applicationId: number
  company: string
  position: string
  daysQuiet: number
}

interface GoingQuietListProps {
  items: QuietItem[]
  /** Days of silence after which JobBear marks an application ghosted. */
  ghostAfterDays: number
}

/**
 * Answers "am I being ghosted, or is it just slow?": each meter fills toward the day
 * JobBear will mark the application ghosted. Near the end it turns honey.
 */
export default function GoingQuietList({ items, ghostAfterDays }: GoingQuietListProps) {
  return (
    <ul className="space-y-1.5">
      {items.map((item, index) => {
        const share = Math.min(1, item.daysQuiet / ghostAfterDays)
        const left = Math.max(0, ghostAfterDays - item.daysQuiet)
        const late = share >= 0.75
        return (
          <li key={item.applicationId}>
            <Link
              to={`/applications/${item.applicationId}`}
              className="-mx-2 block rounded-control px-2 py-2 transition-colors duration-150 hover:bg-white"
            >
              <span className="flex items-baseline justify-between gap-3 text-sm">
                <span className="min-w-0 truncate">
                  <span className="font-medium">{item.company}</span>
                  <span className="text-bark-500">, {item.position}</span>
                </span>
                <span className="flex items-center gap-2 whitespace-nowrap tabular-nums text-bark-500">
                  {item.daysQuiet} days quiet
                  <span
                    aria-hidden
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      late
                        ? 'bg-honey-50 text-honey-800 ring-1 ring-inset ring-honey/40'
                        : 'bg-birch-200/70 text-bark-700'
                    }`}
                  >
                    {left === 0 ? 'ghosted' : `${left}d left`}
                  </span>
                </span>
              </span>
              <span
                className="mt-2 block h-2 overflow-hidden rounded-full bg-birch-200"
                role="meter"
                aria-valuemin={0}
                aria-valuemax={ghostAfterDays}
                aria-valuenow={item.daysQuiet}
                aria-label={`${item.company}: ${left} days until marked ghosted`}
              >
                <span
                  className={`fill-in block h-full rounded-full ${
                    late
                      ? 'meter-warn bg-gradient-to-r from-honey-600 to-honey'
                      : 'bg-gradient-to-r from-bark to-bark-700'
                  }`}
                  style={
                    {
                      width: `${share * 100}%`,
                      '--delay': `${index * 60}ms`,
                    } as React.CSSProperties
                  }
                />
              </span>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
