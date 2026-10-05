import { Link } from 'react-router-dom'

import BearMark from '../components/BearMark'
import AutoTextarea from '../components/form/AutoTextarea'
import DatePicker from '../components/form/DatePicker'
import Select from '../components/form/Select'
import Icon, { type IconName } from '../components/Icon'
import PageHeader from '../components/PageHeader'
import Panel from '../components/Panel'
import { SOURCE_LABELS } from '../components/statusStyles'
import { SAMPLE_GHOST_AFTER_DAYS, sampleResumes } from '../sample/data'
import { APPLICATION_SOURCES } from '../types'

// What happens to an application after it's saved, in order. Shown beside the form so the
// user knows they won't have to keep it up to date by hand.
const NEXT_STEPS: { icon: IconName; title: string; detail: string }[] = [
  {
    icon: 'check',
    title: 'Saved as Applied',
    detail: 'With today’s date, unless you pick another.',
  },
  {
    icon: 'mail',
    title: 'JobBear watches your inbox',
    detail: 'Replies, assessment invites and interview dates update it on their own.',
  },
  {
    icon: 'hourglass',
    title: 'Silence gets noticed',
    detail: `No reply after ${SAMPLE_GHOST_AFTER_DAYS} days and it’s marked ghosted. You can undo it.`,
  },
]

const optional = <span className="font-normal text-bark-500">(optional)</span>

export default function NewApplication() {
  // TODO(me): controlled form state; load companies (GET /companies) into the select;
  //           "Add a company" creates one (POST /companies) and selects it;
  //           submit with useMutation → POST /applications, invalidate the list,
  //           then navigate to /applications/:id. Show field errors from the 422 body.
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
          title="New application"
          description="Log it once. JobBear keeps it up to date from your email after that."
        />
      </div>

      <form className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-6">
          <Panel title="The role" icon="briefcase" description="What you applied to.">
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <span className="label">Job posting link {optional}</span>
                <span className="field-group mt-1.5">
                  <Icon name="link" size={17} className="field-icon" />
                  <input type="url" name="job_url" placeholder="https://" className="field" />
                </span>
              </label>
              <div className="flex flex-col gap-2 sm:col-span-2 sm:flex-row sm:items-end">
                <Select
                  id="company_id"
                  name="company_id"
                  label="Company"
                  icon="building"
                  placeholder="Choose a company"
                  emptyText="No companies yet. Add one to get started."
                  options={[]}
                  className="flex-1"
                />
                <button type="button" className="btn-soft min-h-[2.75rem] shrink-0">
                  <Icon name="plus" size={16} />
                  Add a company
                </button>
              </div>
              <label className="block sm:col-span-2">
                <span className="label">Position</span>
                <span className="field-group mt-1.5">
                  <Icon name="briefcase" size={17} className="field-icon" />
                  <input
                    name="position"
                    required
                    maxLength={300}
                    placeholder="Backend Engineer Intern"
                    className="field"
                  />
                </span>
              </label>
              <label className="block">
                <span className="label">Location {optional}</span>
                <span className="field-group mt-1.5">
                  <Icon name="pin" size={17} className="field-icon" />
                  <input name="location" placeholder="Zürich" className="field" />
                </span>
              </label>
              <label className="flex min-h-[2.75rem] cursor-pointer items-center justify-between gap-3 self-end rounded-control border border-birch-300 bg-birch px-3.5 transition-colors hover:border-bark-400 has-[:checked]:border-honey-600 has-[:checked]:bg-honey-50/60">
                <span className="text-sm font-semibold text-bark-700">Remote</span>
                <input type="checkbox" name="remote" className="switch" />
              </label>
            </div>
          </Panel>

          <Panel
            title="The posting"
            icon="file"
            description="Postings often come down before they reply. Keep a copy here."
          >
            <label className="block">
              <span className="label">Job description {optional}</span>
              {/* TODO(me): once job_url points at Greenhouse, Lever or Ashby, offer to fill this
                in from their public job APIs; other sites keep the paste. */}
              <AutoTextarea
                name="job_description"
                minRows={6}
                placeholder="Paste the full posting: what you'd do and what they're looking for."
                className="field mt-1.5 leading-relaxed"
              />
              <span className="hint mt-1.5 block">
                JobBear checks it against the resume you sent and shows what matches.
              </span>
            </label>
          </Panel>

          <Panel title="Notes" icon="note" description="Only you see these.">
            <label className="block">
              <span className="sr-only">Notes</span>
              <AutoTextarea
                name="notes"
                minRows={3}
                placeholder="Who referred you, what the team works on, what to ask."
                className="field leading-relaxed"
              />
            </label>
          </Panel>
        </div>

        {/* Wide screens: one column that stays in view and fills the screen's height, so the
          save button is always there and the space beside the form isn't left empty. */}
        <div className="flex flex-col gap-6 lg:sticky lg:top-6 lg:h-[calc(100dvh-3rem)]">
          <Panel title="How you applied" icon="send" description="Feeds your stats by channel.">
            <div className="space-y-5">
              <Select
                name="source"
                label="Source"
                defaultValue="ATS"
                options={APPLICATION_SOURCES.map((source) => ({
                  value: source,
                  label: SOURCE_LABELS[source],
                }))}
              />
              <DatePicker name="applied_at" label="Applied on" required />
              {/* TODO(me): options from the user's resume versions; "None" stays allowed. */}
              <Select
                name="resume_id"
                label="Resume sent"
                icon="file"
                placeholder="Choose a version"
                options={sampleResumes.map((resume) => ({
                  value: String(resume.id),
                  label: resume.name,
                }))}
              />
            </div>
          </Panel>

          <section
            aria-labelledby="next-title"
            className="flex min-h-0 flex-1 flex-col rounded-panel bg-bark p-6 text-birch-50 shadow-[0_30px_60px_-40px_rgba(42,31,25,0.9)]"
          >
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-birch">
                <BearMark size={32} />
              </span>
              <h2 id="next-title" className="text-lg font-bold tracking-tight">
                What happens next
              </h2>
            </div>
            <ol className="mt-5 min-h-0 flex-1 space-y-4 overflow-y-auto">
              {NEXT_STEPS.map((step) => (
                <li key={step.title} className="flex gap-3">
                  <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-honey/15 text-honey ring-1 ring-inset ring-honey/30">
                    <Icon name={step.icon} size={15} />
                  </span>
                  <span>
                    <span className="block font-semibold">{step.title}</span>
                    <span className="mt-0.5 block text-sm leading-relaxed text-birch-300">
                      {step.detail}
                    </span>
                  </span>
                </li>
              ))}
            </ol>
            {/* TODO(me): submit error here: <p role="alert" className="text-sm text-honey">…</p> */}
            <div className="mt-6 space-y-2">
              <button type="submit" className="btn-honey w-full py-3 text-base">
                <Icon name="check" size={18} />
                Save application
              </button>
              <Link
                to="/applications"
                className="btn w-full text-birch-300 hover:bg-birch/10 hover:text-birch-50"
              >
                Cancel
              </Link>
            </div>
          </section>
        </div>
      </form>
    </>
  )
}
