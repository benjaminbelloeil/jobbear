import { useState } from 'react'
import { Link } from 'react-router-dom'

import ApplicationRow from '../components/ApplicationRow'
import Icon from '../components/Icon'
import Select from '../components/form/Select'
import PageHeader from '../components/PageHeader'
import Pagination from '../components/Pagination'
import PipelineBoard from '../components/PipelineBoard'
import StatusFilterChips from '../components/StatusFilterChips'
import { SAMPLE_TOTAL, sampleApplications, sampleBoard } from '../sample/data'

const COLUMNS = ['Company', 'Position', 'Status', 'Next step', 'Applied', 'Last activity']

type View = 'table' | 'board'

export default function Applications() {
  // View choice is purely visual, so it lives here.
  const [view, setView] = useState<View>('table')

  // TODO(me): replace sample data with useQuery for GET /applications. Filters (status,
  //           company_id, date range), sort and page belong in URL search params; pass
  //           them to the query and to <StatusFilterChips selected onToggle /> and
  //           <Pagination page onPageChange />. Group the board's columns yourself.
  return (
    <>
      <PageHeader
        title="Applications"
        description={`${SAMPLE_TOTAL} applications, newest first.`}
        actions={
          <>
            <div
              role="group"
              aria-label="View"
              className="flex rounded-control border border-birch-300 bg-birch-50 p-0.5"
            >
              {(['table', 'board'] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  aria-pressed={view === option}
                  onClick={() => setView(option)}
                  className={`flex items-center gap-1.5 rounded-[0.5rem] px-3 py-1.5 text-sm transition-colors duration-150 ${
                    view === option ? 'bg-bark text-birch-50' : 'text-bark-700 hover:text-bark'
                  }`}
                >
                  <Icon name={option === 'table' ? 'list' : 'board'} size={16} />
                  {option === 'table' ? 'Table' : 'Board'}
                </button>
              ))}
            </div>
            <Link to="/applications/new" className="btn-honey">
              <Icon name="plus" size={16} />
              New application
            </Link>
          </>
        }
      />

      {view === 'board' ? (
        <PipelineBoard columns={sampleBoard} />
      ) : (
        <>
          <div className="mb-5 flex flex-col gap-3 2xl:flex-row 2xl:items-center 2xl:justify-between">
            <StatusFilterChips selected={[]} onToggle={() => {}} />
            {/* TODO(me): fill options from GET /companies and filter the list by it. */}
            <Select
              label="Company"
              hideLabel
              icon="building"
              defaultValue=""
              options={[{ value: '', label: 'All companies' }]}
              className="sm:max-w-xs 2xl:w-72"
            />
          </div>

          <div className="panel overflow-hidden">
            <div className="overflow-x-auto">
              <table aria-label="Applications" className="min-w-full text-sm">
                <thead className="border-b border-birch-200 bg-birch">
                  <tr>
                    {COLUMNS.map((column) => (
                      <th
                        key={column}
                        scope="col"
                        className="whitespace-nowrap px-4 py-3 text-left font-medium text-bark-500"
                      >
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-birch-200">
                  {sampleApplications.map((app) => (
                    <ApplicationRow key={app.id} application={app} />
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination page={1} pageSize={12} total={SAMPLE_TOTAL} onPageChange={() => {}} />
          </div>
        </>
      )}
    </>
  )
}
