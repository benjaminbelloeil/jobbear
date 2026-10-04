import { Link, useParams } from 'react-router-dom'

import DetailList from '../components/DetailList'
import EmptyState from '../components/EmptyState'
import Icon from '../components/Icon'
import PageHeader from '../components/PageHeader'
import Panel from '../components/Panel'
import StatusBadge from '../components/StatusBadge'
import { NEXT_ACTION_LABELS, SOURCE_LABELS, STATUS_META } from '../components/statusStyles'
import StatusTimeline from '../components/StatusTimeline'
import { sampleApplications, sampleEvents } from '../sample/data'
import { APPLICATION_STATUSES } from '../types'

const plainDate = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeZone: 'UTC' })
const localDate = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' })

export default function ApplicationDetail() {
  const { id } = useParams()

  // TODO(me): replace the sample lookup with useQuery for GET /applications/:id and
  //   GET /applications/:id/events. Status change → POST /applications/:id/status (show the
  //   422 message when a transition isn't allowed); notes → PATCH. Only sample application 1
  //   has history in the sample data.
  const app = sampleApplications.find((a) => a.id === Number(id))
  if (!app) {
    return (
      <EmptyState
        title="This application doesn't exist"
        action={
          <Link to="/applications" className="btn-primary">
            Back to applications
          </Link>
        }
      >
        It may have been deleted, or the link is wrong.
      </EmptyState>
    )
  }
  const events = sampleEvents.filter((event) => event.application_id === app.id)

  return (
    <>
      <Link
        to="/applications"
        className="inline-flex items-center gap-1 rounded-control text-sm text-bark-500 hover:text-bark"
      >
        <Icon name="chevronLeft" size={16} />
        All applications
      </Link>
      <div className="mt-3">
        <PageHeader
          title={app.position}
          description={app.company?.name}
          actions={<StatusBadge status={app.status} className="px-3 py-1 text-sm" />}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-12">
        <div className="space-y-6 xl:col-span-8">
          <Panel
            title="Details"
            actions={
              app.job_url && (
                <a
                  href={app.job_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-bark-500 hover:text-bark"
                >
                  Job posting
                  <Icon name="external" size={14} />
                </a>
              )
            }
          >
            <DetailList
              items={[
                { label: 'Company', value: app.company?.name },
                { label: 'Source', value: SOURCE_LABELS[app.source] },
                {
                  label: 'Location',
                  value: [app.location, app.remote ? 'Remote' : null].filter(Boolean).join(', '),
                },
                { label: 'Next step', value: NEXT_ACTION_LABELS[app.next_action] },
                { label: 'Applied on', value: plainDate.format(new Date(app.applied_at)) },
                {
                  label: 'Last activity',
                  value: app.last_activity_at
                    ? localDate.format(new Date(app.last_activity_at))
                    : 'No reply yet',
                },
              ]}
            />
          </Panel>

          <Panel title="Notes" description="Only you see these.">
            <label className="block">
              <span className="sr-only">Notes</span>
              {/* TODO(me): controlled value + save with PATCH (on blur or a Save button). */}
              <textarea
                rows={5}
                defaultValue={app.notes ?? ''}
                placeholder="Who you spoke to, what to prepare, what they asked."
                className="field resize-y leading-relaxed"
              />
            </label>
          </Panel>
        </div>

        <div className="space-y-6 xl:col-span-4">
          <Panel title="Change status" description="Each change is added to the history.">
            {/* TODO(me): list only the transitions status_rules allows; submit the change. */}
            <div className="space-y-3">
              <label className="block">
                <span className="label">New status</span>
                <select className="field mt-1.5" defaultValue={app.status}>
                  {APPLICATION_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {STATUS_META[status].label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="label">Note (optional)</span>
                <input className="field mt-1.5" placeholder="e.g. Phone screen went well" />
              </label>
              <button type="button" className="btn-primary w-full">
                Save status
              </button>
            </div>
          </Panel>

          <Panel title="History" description="Every change, and what caused it.">
            {events.length > 0 ? (
              <StatusTimeline events={events} />
            ) : (
              <EmptyState compact title="No changes yet" />
            )}
          </Panel>
        </div>
      </div>
    </>
  )
}
