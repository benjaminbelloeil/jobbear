import type { ApplicationStatus } from '../types'
import { STATUS_META } from './statusStyles'

interface StatusBadgeProps {
  status: ApplicationStatus
  className?: string
}

export default function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const { label, badge } = STATUS_META[status]
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${badge} ${className}`}
    >
      {label}
    </span>
  )
}
