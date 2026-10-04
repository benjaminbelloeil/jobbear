export interface Insight {
  id: string
  headline: string
  detail: string
}

/** Findings in plain sentences: the "why", not just the "how many". */
export default function InsightList({ insights }: { insights: Insight[] }) {
  return (
    <ul className="divide-y divide-birch/10">
      {insights.map((insight) => (
        <li key={insight.id} className="py-4 first:pt-0 last:pb-0">
          <p className="font-display text-xl font-semibold leading-snug tracking-tight text-birch-50">
            {insight.headline}
          </p>
          <p className="mt-1.5 text-sm text-birch-300">{insight.detail}</p>
        </li>
      ))}
    </ul>
  )
}
