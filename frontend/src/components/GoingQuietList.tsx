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
    <ul className="space-y-4">
      {items.map((item, index) => {
        const share = Math.min(1, item.daysQuiet / ghostAfterDays)
        const left = Math.max(0, ghostAfterDays - item.daysQuiet)
        const late = share >= 0.75
        return (
          <li key={item.applicationId}>
            <Link
              to={`/applications/${item.applicationId}`}
              className="block rounded-control transition-colors hover:text-bark-700"
            >
              <span className="flex items-baseline justify-between gap-3 text-sm">
                <span className="min-w-0 truncate">
                  <span className="font-medium">{item.company}</span>
                  <span className="text-bark-500">, {item.position}</span>
                </span>
                <span className="whitespace-nowrap tabular-nums text-bark-500">
                  {item.daysQuiet} days quiet
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
                  className={`fill-in block h-full rounded-full ${late ? 'bg-honey' : 'bg-bark-700'}`}
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
