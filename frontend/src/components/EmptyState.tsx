import type { ReactNode } from 'react'

import BearMark from './BearMark'

interface EmptyStateProps {
  title: string
  children?: ReactNode
  /** Optional call to action, e.g. a button. */
  action?: ReactNode
  /** Smaller variant for use inside panels. */
  compact?: boolean
}

export default function EmptyState({ title, children, action, compact = false }: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center rounded-panel border border-dashed border-birch-300 text-center ${
        compact ? 'px-4 py-8' : 'px-6 py-14'
      }`}
    >
      <BearMark size={compact ? 36 : 52} mood="asleep" className="opacity-80" />
      <p className={`mt-3 font-display font-semibold ${compact ? 'text-base' : 'text-lg'}`}>
        {title}
      </p>
      {children && <div className="mt-1 max-w-sm text-sm text-bark-500">{children}</div>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
