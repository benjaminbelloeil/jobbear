import type { ReactNode } from 'react'

interface PanelProps {
  title?: string
  description?: ReactNode
  actions?: ReactNode
  className?: string
  children: ReactNode
}

/** A titled surface for grouping a chart, list, or form on a page. */
export default function Panel({
  title,
  description,
  actions,
  className = '',
  children,
}: PanelProps) {
  return (
    <section className={`panel min-w-0 p-5 sm:p-6 ${className}`}>
      {(title || actions) && (
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div>
            {title && <h2 className="text-lg font-bold tracking-tight">{title}</h2>}
            {description && <p className="mt-0.5 text-sm text-bark-500">{description}</p>}
          </div>
          {actions}
        </div>
      )}
      {children}
    </section>
  )
}
