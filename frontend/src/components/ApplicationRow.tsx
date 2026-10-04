import { Link } from 'react-router-dom'

import type { Application } from '../types'
import StatusBadge from './StatusBadge'
import { NEXT_ACTION_LABELS } from './statusStyles'

interface ApplicationRowProps {
  application: Application
}

// applied_at is a plain date ("2026-09-14"): format in UTC so it never shifts a day.
// last_activity_at is a real timestamp: format in the viewer's time zone.
const plainDate = new Intl.DateTimeFormat(undefined, {
  month: 'short',
  day: 'numeric',
  timeZone: 'UTC',
})
const localDate = new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' })

/** One <tr> in the applications table. The company cell links to the detail page. */
export default function ApplicationRow({ application }: ApplicationRowProps) {
  return (
    <tr className="relative transition-colors hover:bg-birch has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:-outline-offset-2 has-[:focus-visible]:outline-bark">
      <td className="px-4 py-3.5">
        <Link
          to={`/applications/${application.id}`}
          className="font-medium after:absolute after:inset-0 focus-visible:outline-none"
        >
          {application.company?.name ?? 'Unknown company'}
        </Link>
      </td>
      <td className="px-4 py-3.5 text-bark-700">
        {application.position}
        {application.remote && (
          <span className="ml-2 rounded-full bg-birch-200 px-2 py-0.5 text-xs text-bark-700">
            Remote
          </span>
        )}
      </td>
      <td className="px-4 py-3.5">
        <StatusBadge status={application.status} />
      </td>
      <td className="px-4 py-3.5 text-bark-500">{NEXT_ACTION_LABELS[application.next_action]}</td>
      <td className="px-4 py-3.5 tabular-nums text-bark-500">
        {plainDate.format(new Date(application.applied_at))}
      </td>
      <td className="px-4 py-3.5 tabular-nums text-bark-500">
        {application.last_activity_at
          ? localDate.format(new Date(application.last_activity_at))
          : '—'}
      </td>
    </tr>
  )
}
