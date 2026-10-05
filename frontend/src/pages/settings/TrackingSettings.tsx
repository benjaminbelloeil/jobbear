import Select from '../../components/form/Select'
import Slider from '../../components/form/Slider'
import ToggleRow from '../../components/form/ToggleRow'
import Panel from '../../components/Panel'
import { SOURCE_LABELS } from '../../components/statusStyles'
import { SAMPLE_GHOST_AFTER_DAYS, sampleResumes } from '../../sample/data'
import { APPLICATION_SOURCES } from '../../types'

const SYNC_OPTIONS = [
  { value: '15', label: 'Every 15 minutes' },
  { value: '30', label: 'Every 30 minutes' },
  { value: '60', label: 'Every hour' },
  { value: '180', label: 'Every 3 hours' },
]

const HIDE_OPTIONS = [
  { value: 'never', label: 'Never' },
  { value: '30', label: 'After 30 days' },
  { value: '90', label: 'After 90 days' },
]

// What moves an application out of "no reply yet". Shown as checkboxes, on by default
// except the automatic receipt, which isn't a person answering.
const REPLIES = [
  { id: 'rejection', label: 'Rejections', detail: 'A no is still an answer.', on: true },
  { id: 'assessment', label: 'Assessment invites', detail: 'An OA or take-home.', on: true },
  { id: 'recruiter', label: 'A recruiter writing first', detail: 'Before you applied.', on: true },
  {
    id: 'receipt',
    label: '“We got your application”',
    detail: 'Automatic receipts from hiring tools.',
    on: false,
  },
]

export default function TrackingSettings() {
  // TODO(me): ghosting, follow-up timing and the sync interval map to GHOSTED_AFTER_DAYS,
  //   FOLLOW_UP_AFTER_DAYS and GMAIL_SYNC_INTERVAL_MINUTES (in .env today, per user in v2).
  //   "Counts as a reply" decides which status changes reset the ghosting clock.
  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel
          title="Silence and follow-ups"
          icon="hourglass"
          description="When JobBear suggests a nudge, and when it gives up."
        >
          <div className="space-y-6">
            <Slider
              label="Suggest a follow-up after"
              name="follow_up_after"
              min={5}
              max={30}
              defaultValue={10}
              format={(value) => `${value} days`}
              hint="It shows up under “Needs you” on the dashboard."
            />
            <Slider
              label="Mark as ghosted after"
              name="ghost_after"
              min={7}
              max={60}
              defaultValue={SAMPLE_GHOST_AFTER_DAYS}
              format={(value) => `${value} days`}
              hint="Days with no reply before an application counts as ghosted. You can always undo it."
            />
            <div className="border-t border-birch-200 pt-4">
              <ToggleRow
                name="follow_up_contact_only"
                label="Only when there's a contact"
                description="Skip the suggestion for applications with no one to write to."
              />
            </div>
          </div>
        </Panel>

        <Panel
          title="What counts as a reply"
          icon="mail"
          description="These stop the ghosting clock and count toward your response rate."
        >
          <fieldset className="grid gap-2">
            <legend className="sr-only">Counts as a reply</legend>
            {REPLIES.map((reply) => (
              <label key={reply.id} className="choice items-center py-3">
                <input
                  type="checkbox"
                  name={`reply-${reply.id}`}
                  defaultChecked={reply.on}
                  className="checkbox mt-0"
                />
                <span>
                  <span className="block text-sm font-semibold">{reply.label}</span>
                  <span className="block text-sm text-bark-500">{reply.detail}</span>
                </span>
              </label>
            ))}
          </fieldset>
        </Panel>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel
          title="New applications start with"
          icon="plus"
          description="Prefilled on the New application form. You can still change them there."
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <Select
              label="Source"
              defaultValue="ATS"
              options={APPLICATION_SOURCES.map((source) => ({
                value: source,
                label: SOURCE_LABELS[source],
              }))}
            />
            <Select
              label="Resume sent"
              icon="file"
              defaultValue="1"
              options={sampleResumes.map((resume) => ({
                value: String(resume.id),
                label: resume.name,
              }))}
            />
          </div>
        </Panel>

        <Panel
          title="Housekeeping"
          icon="refresh"
          description="How often JobBear looks, and what it tidies away."
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <Select
              label="Check email"
              icon="refresh"
              defaultValue="60"
              options={SYNC_OPTIONS}
              hint="More often means faster updates and a few more AI calls."
            />
            <Select
              label="Hide closed applications"
              defaultValue="never"
              options={HIDE_OPTIONS}
              hint="Rejected and ghosted ones leave the list. Stats keep them."
            />
          </div>
        </Panel>
      </div>
    </div>
  )
}
