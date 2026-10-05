import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import DetailList from '../components/DetailList'
import EmailLinks from '../components/EmailLinks'
import EmptyState from '../components/EmptyState'
import AutoTextarea from '../components/form/AutoTextarea'
import DatePicker from '../components/form/DatePicker'
import HistoryBand from '../components/HistoryBand'
import Icon from '../components/Icon'
import KeywordMatch from '../components/KeywordMatch'
import PageHeader from '../components/PageHeader'
import Select from '../components/form/Select'
import Panel from '../components/Panel'
import StatusBadge from '../components/StatusBadge'
import { NEXT_ACTION_LABELS, SOURCE_LABELS, STATUS_META } from '../components/statusStyles'
import {
  sampleApplications,
  sampleEmailLinks,
  sampleEvents,
  sampleKeywordMatch,
  samplePostings,
  sampleResumeByApplication,
  sampleResumes,
} from '../sample/data'
import { APPLICATION_SOURCES, APPLICATION_STATUSES } from '../types'

const plainDate = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeZone: 'UTC' })
const localDate = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' })

export default function ApplicationDetail() {
  const { id } = useParams()
  const [editing, setEditing] = useState(false)

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
  // TODO(me): the saved posting, the resume that was sent and its keyword match come from the
  //   API once those models exist. Only sample application 1 has a posting and a match.
  const posting = samplePostings[app.id]
  const resume = sampleResumes.find((r) => r.id === sampleResumeByApplication[app.id])
  const match = sampleKeywordMatch[app.id]
  // TODO(me): links come from the email sync (see docs/replica/resumes-and-fit.md, "Links").
  const links = sampleEmailLinks[app.id] ?? []

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
          actions={
            <div className="flex items-center gap-3">
              <StatusBadge status={app.status} className="px-3 py-1 text-sm" />
              {!editing && (
                <button type="button" onClick={() => setEditing(true)} className="btn-soft">
                  <Icon name="pencil" size={15} />
                  Edit details
                </button>
              )}
            </div>
          }
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-12">
        <div className="flex flex-col gap-6 xl:col-span-8">
          {editing ? (
            // TODO(me): controlled fields; Save → PATCH /applications/:id, then refresh the
            //   query and close. Editing details fixes a typo or a wrong date: it doesn't
            //   change the status, so it writes no status_events row. Show 422 field errors.
            <Panel
              title="Edit details"
              description="Fix anything that came in wrong. The status and its history stay as they are."
              className="view-in ring-2 ring-honey/40"
            >
              <form
                onSubmit={(event) => {
                  event.preventDefault()
                  setEditing(false)
                }}
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="block sm:col-span-2">
                    <span className="label">Position</span>
                    <span className="field-group mt-1.5">
                      <Icon name="briefcase" size={17} className="field-icon" />
                      <input
                        name="position"
                        required
                        maxLength={300}
                        defaultValue={app.position}
                        className="field"
                      />
                    </span>
                  </label>
                  <label className="block">
                    <span className="label">Company</span>
                    <span className="field-group mt-1.5">
                      <Icon name="building" size={17} className="field-icon" />
                      <input name="company" defaultValue={app.company?.name} className="field" />
                    </span>
                  </label>
                  <DatePicker
                    name="applied_at"
                    label="Applied on"
                    required
                    defaultValue={app.applied_at.slice(0, 10)}
                  />
                  <label className="block">
                    <span className="label">Location</span>
                    <span className="field-group mt-1.5">
                      <Icon name="pin" size={17} className="field-icon" />
                      <input name="location" defaultValue={app.location ?? ''} className="field" />
                    </span>
                  </label>
                  <label className="flex min-h-[2.75rem] cursor-pointer items-center justify-between gap-3 self-end rounded-control border border-birch-300 bg-birch px-3.5 transition-colors hover:border-bark-400 has-[:checked]:border-honey-600 has-[:checked]:bg-honey-50/60">
                    <span className="text-sm font-semibold text-bark-700">Remote</span>
                    <input
                      type="checkbox"
                      name="remote"
                      defaultChecked={app.remote}
                      className="switch"
                    />
                  </label>
                  <Select
                    name="source"
                    label="Source"
                    defaultValue={app.source}
                    options={APPLICATION_SOURCES.map((source) => ({
                      value: source,
                      label: SOURCE_LABELS[source],
                    }))}
                  />
                  <Select
                    name="resume_id"
                    label="Resume sent"
                    icon="file"
                    placeholder="Not recorded"
                    defaultValue={resume ? String(resume.id) : undefined}
                    options={sampleResumes.map((r) => ({ value: String(r.id), label: r.name }))}
                  />
                  <label className="block sm:col-span-2">
                    <span className="label">Job posting link</span>
                    <span className="field-group mt-1.5">
                      <Icon name="link" size={17} className="field-icon" />
                      <input
                        type="url"
                        name="job_url"
                        defaultValue={app.job_url ?? ''}
                        placeholder="https://"
                        className="field"
                      />
                    </span>
                  </label>
                </div>
                <div className="mt-6 flex flex-wrap gap-2 border-t border-birch-200 pt-5">
                  <button type="submit" className="btn-primary">
                    <Icon name="check" size={15} />
                    Save changes
                  </button>
                  <button type="button" onClick={() => setEditing(false)} className="btn-ghost">
                    Cancel
                  </button>
                </div>
              </form>
            </Panel>
          ) : (
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
                  { label: 'Resume sent', value: resume?.name ?? 'Not recorded' },
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
          )}

          <Panel
            title="The posting"
            description={
              posting
                ? `Saved ${plainDate.format(new Date(posting.saved_at))}, so you keep it after the listing comes down.`
                : 'Not saved for this application.'
            }
          >
            {posting ? (
              <div
                tabIndex={0}
                aria-label="Saved job posting"
                className="max-h-80 overflow-y-auto whitespace-pre-line rounded-control border border-birch-200 bg-birch px-4 py-3.5 text-sm leading-relaxed text-bark-700"
              >
                {posting.text}
              </div>
            ) : (
              <EmptyState compact title="No posting saved">
                Paste the job description when you log an application to keep it here.
              </EmptyState>
            )}
          </Panel>

          <Panel title="Notes" description="Only you see these." className="flex-1">
            <label className="block">
              <span className="sr-only">Notes</span>
              {/* TODO(me): controlled value + save with PATCH (on blur or a Save button). */}
              <AutoTextarea
                minRows={4}
                defaultValue={app.notes ?? ''}
                placeholder="Who you spoke to, what to prepare, what they asked."
                className="field leading-relaxed"
              />
            </label>
          </Panel>
        </div>

        <div className="flex flex-col gap-6 xl:col-span-4">
          <Panel title="Change status" description="Each change is added to the history.">
            {/* TODO(me): list only the transitions status_rules allows; submit the change. */}
            <div className="space-y-3">
              <Select
                label="New status"
                defaultValue={app.status}
                options={APPLICATION_STATUSES.map((status) => ({
                  value: status,
                  label: STATUS_META[status].label,
                  dot: STATUS_META[status].hex,
                }))}
              />
              <label className="block">
                <span className="label">Note (optional)</span>
                <span className="field-group mt-1.5">
                  <Icon name="note" size={17} className="field-icon" />
                  <input className="field" placeholder="e.g. Phone screen went well" />
                </span>
              </label>
              <button type="button" className="btn-primary w-full">
                Save status
              </button>
            </div>
          </Panel>

          <Panel
            title="Links from your emails"
            description="Assessments, booking pages and guides."
          >
            {links.length > 0 ? (
              <EmailLinks links={links} />
            ) : (
              <EmptyState compact title="No links yet">
                Links in recruiter emails, like an assessment or a booking page, appear here.
              </EmptyState>
            )}
          </Panel>

          <Panel
            title="Keyword match"
            description="How much of the posting your resume covers."
            className="flex-1"
          >
            {match ? (
              <KeywordMatch
                matched={match.matched}
                missing={match.missing}
                resumeName={
                  sampleResumes.find((r) => r.id === match.resume_id)?.name ?? 'your resume'
                }
              />
            ) : (
              <EmptyState compact title="Nothing to compare yet">
                Save the posting and the resume you sent to see what matches.
              </EmptyState>
            )}
          </Panel>
        </div>
      </div>

      <div className="mt-6">
        <HistoryBand
          events={events}
          upNext={app.next_action === 'NONE' ? undefined : NEXT_ACTION_LABELS[app.next_action]}
        />
      </div>
    </>
  )
}
