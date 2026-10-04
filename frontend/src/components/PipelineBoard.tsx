import { Link } from 'react-router-dom'

import type { Application, ApplicationStatus } from '../types'
import { SOURCE_LABELS, STATUS_META } from './statusStyles'

export interface BoardColumn {
  status: ApplicationStatus
  applications: Application[]
}

/** Read-only board: one column per status. Scrolls sideways on small screens. */
export default function PipelineBoard({ columns }: { columns: BoardColumn[] }) {
  return (
    <div className="-mx-4 overflow-x-auto px-4 pb-2 sm:-mx-8 sm:px-8 lg:-mx-10 lg:px-10">
      <div className="grid min-w-[72rem] grid-cols-6 gap-4">
        {columns.map((column) => (
          <section key={column.status} aria-label={STATUS_META[column.status].label}>
            <h2 className="mb-3 flex items-center gap-2 font-sans text-sm font-medium text-bark-700">
              <span className={`h-2 w-2 rounded-full ${STATUS_META[column.status].dot}`} />
              {STATUS_META[column.status].label}
              <span className="ml-auto tabular-nums text-bark-500">
                {column.applications.length}
              </span>
            </h2>
            <ul className="list-in space-y-2">
              {column.applications.map((app, index) => (
                <li key={app.id} style={{ '--i': index } as React.CSSProperties}>
                  <Link
                    to={`/applications/${app.id}`}
                    className="block rounded-control border border-birch-200 bg-birch-50 p-3 transition-colors duration-150 hover:border-bark-400"
                  >
                    <span className="block font-medium">{app.company?.name}</span>
                    <span className="mt-0.5 block text-sm text-bark-700">{app.position}</span>
                    <span className="mt-2 block text-xs text-bark-500">
                      {SOURCE_LABELS[app.source]}
                    </span>
                  </Link>
                </li>
              ))}
              {column.applications.length === 0 && (
                <li className="rounded-control border border-dashed border-birch-300 p-3 text-sm text-bark-500">
                  None
                </li>
              )}
            </ul>
          </section>
        ))}
      </div>
    </div>
  )
}
