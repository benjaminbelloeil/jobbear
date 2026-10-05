import type { ReactNode } from 'react'

import CountUp from './CountUp'

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
      {metrics.map((metric, index) => {
        // A hint that reads as growth ("+4 this week") gets the good-news colour.
        const rising = typeof metric.hint === 'string' && metric.hint.startsWith('+')
        return (
          <div
            key={metric.label}
            className="group relative -mb-px -mr-px border-b border-r border-birch-200 px-5 py-4 transition-colors duration-200 last:col-span-2 hover:bg-white sm:last:col-span-1"
          >
            {/* Honey hairline that draws in along the top edge on hover. */}
            <span
              aria-hidden
              className="ease-arrive absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-honey transition-transform duration-300 group-hover:scale-x-100"
            />
            <p className="text-sm text-bark-500">{metric.label}</p>
            <p className="mt-1.5 font-display text-3xl font-bold tabular-nums tracking-tight">
              {metric.value === undefined ? (
                <span className="text-bark-500">—</span>
              ) : (
                <CountUp value={metric.value} delay={index * 70} />
              )}
            </p>
            {metric.hint && (
              <p className={`mt-1 text-xs ${rising ? 'font-medium text-pine' : 'text-bark-500'}`}>
                {metric.hint}
              </p>
            )}
          </div>
        )
      })}
    </section>
  )
}
