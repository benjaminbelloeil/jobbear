import type { ReactNode } from 'react'

interface EmptyStateProps {
  title: string
  children?: ReactNode
}

export default function EmptyState({ title, children }: EmptyStateProps) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
      <p className="font-medium text-slate-700">{title}</p>
      {children && <div className="mt-1 text-sm text-slate-500">{children}</div>}
    </div>
  )
}
