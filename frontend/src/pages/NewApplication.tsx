import { Link } from 'react-router-dom'

import DatePicker from '../components/form/DatePicker'
import Select from '../components/form/Select'
import Icon from '../components/Icon'
import PageHeader from '../components/PageHeader'
import Panel from '../components/Panel'
import { SOURCE_LABELS } from '../components/statusStyles'
import { sampleResumes } from '../sample/data'
import { APPLICATION_SOURCES } from '../types'

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
          description="It starts as Applied. Status changes after this are logged automatically."
        />
      </div>

      <form className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <Panel title="The job" icon="briefcase" description="What you applied to.">
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className="label">
                Job posting link <span className="font-normal text-bark-500">(optional)</span>
              </span>
              <span className="field-group mt-1.5">
                <Icon name="link" size={17} className="field-icon" />
                <input type="url" name="job_url" placeholder="https://" className="field" />
              </span>
            </label>
            <label className="block sm:col-span-2">
              <span className="label">
                Job description <span className="font-normal text-bark-500">(optional)</span>
              </span>
              {/* TODO(me): once job_url points at Greenhouse, Lever or Ashby, offer to fill this
                in from their public job APIs; other sites keep the paste. */}
              <textarea
                name="job_description"
                rows={5}
                placeholder="Paste the full posting: what you'd do and what they're looking for."
                className="field mt-1.5 resize-y"
              />
              <span className="hint mt-1.5 block">
                Postings often come down before they reply. Saved here, you keep it, and JobBear can
                check it against your resume.
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
              <span className="label">
                Location <span className="font-normal text-bark-500">(optional)</span>
              </span>
              <span className="field-group mt-1.5">
                <Icon name="pin" size={17} className="field-icon" />
                <input name="location" placeholder="Zürich" className="field" />
              </span>
            </label>
            <label className="flex min-h-[2.75rem] cursor-pointer items-center justify-between gap-3 self-end rounded-control border border-birch-300 bg-birch px-3.5 transition-colors hover:border-bark-400 has-[:checked]:border-honey-600 has-[:checked]:bg-honey-50/60">
              <span className="text-sm font-semibold text-bark-700">Remote</span>
              <input type="checkbox" name="remote" className="switch" />
            </label>
            <label className="block sm:col-span-2">
              <span className="label">
                Notes <span className="font-normal text-bark-500">(optional)</span>
              </span>
              <textarea
                name="notes"
                rows={4}
                placeholder="Who referred you, what the team works on, what to ask."
                className="field mt-1.5 resize-y"
              />
            </label>
          </div>
        </Panel>

        {/* Stays in view on wide screens, so saving never needs a scroll back. */}
        <div className="space-y-6 lg:sticky lg:top-6">
          <Panel
            title="How you applied"
            icon="send"
            description="Feeds your response rates by channel."
          >
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
                hint="So you can see which resume gets replies."
                options={sampleResumes.map((resume) => ({
                  value: String(resume.id),
                  label: resume.name,
                }))}
              />
            </div>
          </Panel>
          {/* TODO(me): submit error here: <p role="alert" className="text-sm text-berry">…</p> */}
          <div className="space-y-2">
            <button type="submit" className="btn-honey w-full py-3 text-base">
              <Icon name="check" size={18} />
              Save application
            </button>
            <Link to="/applications" className="btn-ghost w-full">
              Cancel
            </Link>
          </div>
        </div>
      </form>
    </>
  )
}
