import type { ApplicationStatus } from '../types'

const STYLES: Record<ApplicationStatus, { label: string; className: string }> = {
  APPLIED: { label: 'Applied', className: 'bg-sky-50 text-sky-700 ring-sky-600/20' },
  OA: { label: 'OA', className: 'bg-violet-50 text-violet-700 ring-violet-600/20' },
  INTERVIEWING: { label: 'Interviewing', className: 'bg-amber-50 text-amber-800 ring-amber-600/20' },
  OFFER: { label: 'Offer', className: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20' },
  ACCEPTED: { label: 'Accepted', className: 'bg-emerald-600 text-white ring-emerald-700' },
  REJECTED: { label: 'Rejected', className: 'bg-rose-50 text-rose-700 ring-rose-600/20' },
  GHOSTED: { label: 'Ghosted', className: 'bg-slate-100 text-slate-600 ring-slate-500/20' },
  WITHDRAWN: { label: 'Withdrawn', className: 'bg-slate-50 text-slate-500 ring-slate-400/20' },
}

interface StatusBadgeProps {
  status: ApplicationStatus
  className?: string
}

export default function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const { label, className: tone } = STYLES[status]
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${tone} ${className}`}
    >
      {label}
    </span>
  )
}
