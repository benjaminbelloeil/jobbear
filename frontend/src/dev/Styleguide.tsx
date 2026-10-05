import { useState } from 'react'

import ApplicationRow from '../components/ApplicationRow'
import BearMark from '../components/BearMark'
import SourceFunnel from '../components/charts/SourceFunnel'
import StatusBreakdown from '../components/charts/StatusBreakdown'
import WeeklyVolumeChart from '../components/charts/WeeklyVolumeChart'
import DetailList from '../components/DetailList'
import EmailReviewCard from '../components/EmailReviewCard'
import EmptyState from '../components/EmptyState'
import Icon from '../components/Icon'
import MetricStrip from '../components/MetricStrip'
import PageHeader from '../components/PageHeader'
import Pagination from '../components/Pagination'
import Panel from '../components/Panel'
import Skeleton from '../components/Skeleton'
import SkyMark from '../components/SkyMark'
import StatusBadge from '../components/StatusBadge'
import StatusFilterChips from '../components/StatusFilterChips'
import StatusTimeline from '../components/StatusTimeline'
import { SOURCE_LABELS } from '../components/statusStyles'
import { APPLICATION_STATUSES, type ApplicationStatus } from '../types'
import {
  sampleApplications,
  sampleEmails,
  sampleEvents,
  sampleFunnel,
  sampleMetrics,
  sampleStatusCounts,
  sampleWeekly,
} from '../sample/data'

/** Dev-only page: every presentational component rendered with fake data. */
export default function Styleguide() {
  // Local demo state only, so the chips can be clicked here.
  const [selected, setSelected] = useState<ApplicationStatus[]>(['INTERVIEWING'])
  const [page, setPage] = useState(1)
  const sample = sampleApplications[0]!

  return (
    <>
      <PageHeader
        title="Styleguide"
        description="Every JobBear component with sample data. Only available in development."
      />

      <div className="space-y-6">
        <MetricStrip metrics={sampleMetrics} />

        <div className="grid gap-6 lg:grid-cols-3">
          <Panel title="Applications per week" className="lg:col-span-2">
            <WeeklyVolumeChart weeks={sampleWeekly.weeks} goal={sampleWeekly.goal} />
          </Panel>
          <Panel title="Where things stand">
            <StatusBreakdown items={sampleStatusCounts} />
          </Panel>
        </div>

        <Panel title="Response rate by source">
          <SourceFunnel rows={sampleFunnel} />
        </Panel>

        <Panel title="Filters and table">
          <StatusFilterChips
            selected={selected}
            onToggle={(status) =>
              setSelected((current) =>
                current.includes(status)
                  ? current.filter((s) => s !== status)
                  : [...current, status],
              )
            }
          />
          <div className="-mx-5 mt-5 overflow-x-auto border-t border-birch-200 sm:-mx-6">
            <table className="min-w-full text-sm">
              <tbody className="divide-y divide-birch-200">
                {sampleApplications.map((app) => (
                  <ApplicationRow key={app.id} application={app} />
                ))}
              </tbody>
            </table>
          </div>
          <div className="-mx-5 -mb-5 sm:-mx-6 sm:-mb-6">
            <Pagination page={page} pageSize={25} total={112} onPageChange={setPage} />
          </div>
        </Panel>

        <Panel title="Inbox review" className="p-0 sm:p-0">
          <div className="divide-y divide-birch-200">
            {sampleEmails.map((email) => (
              <EmailReviewCard
                key={email.id}
                email={email}
                actions={
                  <>
                    <button type="button" className="btn-primary">
                      <Icon name="link" size={16} />
                      Link to application
                    </button>
                    <button type="button" className="btn-ghost">
                      Dismiss
                    </button>
                  </>
                }
              />
            ))}
          </div>
        </Panel>

        <Panel title="Details">
          <DetailList
            items={[
              { label: 'Company', value: sample.company?.name },
              { label: 'Source', value: SOURCE_LABELS[sample.source] },
              { label: 'Location', value: sample.location },
              { label: 'Applied on', value: 'Sep 12, 2026' },
            ]}
          />
        </Panel>

        <Panel title="Greeting sky">
          <div className="flex flex-wrap items-end gap-8">
            {(['sunrise', 'day', 'sunset', 'night'] as const).map((phase) => (
              <figure key={phase} className="text-center">
                <SkyMark phase={phase} size={56} />
                <figcaption className="mt-2 text-xs text-bark-500">{phase}</figcaption>
              </figure>
            ))}
          </div>
        </Panel>

        <div className="grid gap-6 lg:grid-cols-3">
          <Panel title="Status history">
            <StatusTimeline events={sampleEvents} />
          </Panel>
          <Panel title="Badges and buttons" className="lg:col-span-2">
            <div className="flex flex-wrap gap-2">
              {APPLICATION_STATUSES.map((status) => (
                <StatusBadge key={status} status={status} />
              ))}
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <button type="button" className="btn-honey">
                New application
              </button>
              <button type="button" className="btn-primary">
                Save changes
              </button>
              <button type="button" className="btn-ghost">
                Cancel
              </button>
            </div>
            <div className="mt-5 flex items-center gap-4">
              <BearMark size={48} />
              <BearMark size={48} mood="asleep" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          </Panel>
        </div>

        <EmptyState
          title="No applications yet"
          action={
            <button type="button" className="btn-primary">
              Add your first application
            </button>
          }
        >
          Add one here, or import your Notion export with the CLI script.
        </EmptyState>
      </div>
    </>
  )
}
