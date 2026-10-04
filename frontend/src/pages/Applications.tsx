import EmptyState from '../components/EmptyState'
import PageHeader from '../components/PageHeader'

const COLUMNS = ['Company', 'Position', 'Status', 'Next action', 'Applied', 'Last activity']

export default function Applications() {
  // TODO(me): useQuery for GET /applications with filters (status, company, date range),
  //           sort and pagination held in URL search params; a "New application" form
  //           (useMutation + invalidateQueries); rows link to /applications/:id.
  return (
    <>
      <PageHeader
        title="Applications"
        description="Every job you've applied to, newest first."
        actions={
          <button
            type="button"
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            New application
          </button>
        }
      />

      {/* TODO(me): filter bar (status multi-select, company, date range) */}
      <div className="mb-4 h-10 rounded-lg border border-dashed border-slate-300 bg-white" />

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              {COLUMNS.map((column) => (
                <th
                  key={column}
                  scope="col"
                  className="px-4 py-3 text-left font-medium text-slate-500"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {/* TODO(me): render rows; use <StatusBadge status={app.status} /> */}
          </tbody>
        </table>
        <div className="p-4">
          <EmptyState title="No applications yet">
            Add one, or import your Notion export with the CLI script.
          </EmptyState>
        </div>
      </div>
    </>
  )
}
