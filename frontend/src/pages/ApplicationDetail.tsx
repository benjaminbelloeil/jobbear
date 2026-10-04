import { Link, useParams } from 'react-router-dom'

import EmptyState from '../components/EmptyState'
import PageHeader from '../components/PageHeader'

export default function ApplicationDetail() {
  const { id } = useParams()

  // TODO(me): useQuery for GET /applications/:id and GET /applications/:id/events;
  //           status change control (POST /applications/:id/status); edit notes (PATCH).
  return (
    <>
      <Link to="/applications" className="text-sm text-slate-500 hover:text-slate-900">
        ← Back to applications
      </Link>
      <div className="mt-3">
        <PageHeader title={`Application #${id}`} description="Company · Position" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="rounded-xl border border-slate-200 bg-white p-6 lg:col-span-2">
          <h2 className="mb-4 font-medium">Details</h2>
          {/* TODO(me): details list + notes editor */}
          <EmptyState title="Details will appear here" />
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="mb-4 font-medium">Status history</h2>
          {/* TODO(me): timeline of status_events (from → to, source, date, note) */}
          <EmptyState title="No events yet" />
        </section>
      </div>
    </>
  )
}
