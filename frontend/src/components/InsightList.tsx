import Icon from './Icon'

export interface Insight {
  id: string
  headline: string
  detail: string
}

/** Findings in plain sentences: the "why", not just the "how many". */
export default function InsightList({ insights }: { insights: Insight[] }) {
  return (
    <ul className="list-in divide-y divide-birch/10">
      {insights.map((insight, index) => (
        <li
          key={insight.id}
          className="group flex gap-3.5 py-4 first:pt-0 last:pb-0"
          style={{ '--i': index + 2 } as React.CSSProperties}
        >
          <span
            aria-hidden
            className="ease-arrive mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-honey/15 text-honey ring-1 ring-inset ring-honey/30 transition-transform duration-300 group-hover:rotate-45 group-hover:scale-110"
          >
            <Icon name="sparkle" size={14} />
          </span>
          <div className="min-w-0">
            <p className="text-balance font-display text-xl font-semibold leading-snug tracking-tight text-birch-50">
              {insight.headline}
            </p>
            <p className="mt-1.5 text-sm text-birch-300">{insight.detail}</p>
          </div>
        </li>
      ))}
    </ul>
  )
}
