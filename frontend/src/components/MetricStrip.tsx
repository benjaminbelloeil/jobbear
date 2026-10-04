import type { ReactNode } from 'react'

export interface Metric {
  label: string
  /** Pre-formatted value, e.g. "42%" or "6.5 days". Pass undefined while loading or empty. */
  value?: ReactNode
  /** Short context under the value, e.g. "12 of 48 applications". */
  hint?: ReactNode
}

interface MetricStripProps {
  metrics: Metric[]
}

/** One strip of headline numbers, divided by hairlines rather than split into cards. */
export default function MetricStrip({ metrics }: MetricStripProps) {
  return (
    <section className="panel grid grid-cols-2 overflow-hidden sm:grid-cols-3 lg:grid-cols-5">
      {metrics.map((metric) => (
        <div
          key={metric.label}
          className="-mb-px -mr-px border-b border-r border-birch-200 px-5 py-4 last:col-span-2 sm:last:col-span-1"
        >
          <p className="text-sm text-bark-500">{metric.label}</p>
          <p className="mt-1.5 font-display text-3xl font-bold tabular-nums tracking-tight">
            {metric.value ?? <span className="text-bark-500">—</span>}
          </p>
          {metric.hint && <p className="mt-1 text-xs text-bark-500">{metric.hint}</p>}
        </div>
      ))}
    </section>
  )
}
