import { Link } from 'react-router-dom'

import Icon from '../components/Icon'
import PageHeader from '../components/PageHeader'
import Panel from '../components/Panel'
import { SOURCE_LABELS } from '../components/statusStyles'
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

      <form className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <Panel title="The job">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="company_id" className="label">
                Company
              </label>
              <div className="mt-1.5 flex flex-col gap-2 sm:flex-row">
                <select id="company_id" name="company_id" className="field" defaultValue="">
                  <option value="" disabled>
                    Choose a company
                  </option>
                </select>
                <button
                  type="button"
                  className="btn-ghost shrink-0 justify-start border border-birch-300 sm:justify-center"
                >
                  <Icon name="plus" size={16} />
                  Add a company
                </button>
              </div>
            </div>
            <label className="block sm:col-span-2">
              <span className="label">Position</span>
              <input
                name="position"
                required
                maxLength={300}
                placeholder="Backend Engineer Intern"
                className="field mt-1.5"
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="label">Job posting link</span>
              <input type="url" name="job_url" placeholder="https://" className="field mt-1.5" />
            </label>
            <label className="block">
              <span className="label">Location</span>
              <input name="location" placeholder="Zürich" className="field mt-1.5" />
            </label>
            <label className="flex items-center gap-2.5 self-end pb-2">
              <input type="checkbox" name="remote" className="h-4 w-4 accent-bark" />
              <span className="text-sm text-bark-700">Remote</span>
            </label>
            <label className="block sm:col-span-2">
              <span className="label">Notes</span>
              <textarea name="notes" rows={4} className="field mt-1.5 resize-y" />
            </label>
          </div>
        </Panel>

        <div className="space-y-6">
          <Panel title="How you applied">
            <div className="space-y-5">
              <label className="block">
                <span className="label">Source</span>
                <select name="source" defaultValue="ATS" className="field mt-1.5">
                  {APPLICATION_SOURCES.map((source) => (
                    <option key={source} value={source}>
                      {SOURCE_LABELS[source]}
                    </option>
                  ))}
                </select>
                <span className="mt-1.5 block text-xs text-bark-500">
                  Used to compare response rates between channels.
                </span>
              </label>
              <label className="block">
                <span className="label">Applied on</span>
                <input type="date" name="applied_at" required className="field mt-1.5" />
              </label>
            </div>
          </Panel>
          {/* TODO(me): submit error here: <p role="alert" className="text-sm text-berry">…</p> */}
          <div className="flex gap-2">
            <button type="submit" className="btn-honey flex-1">
              Save application
            </button>
            <Link to="/applications" className="btn-ghost">
              Cancel
            </Link>
          </div>
        </div>
      </form>
    </>
  )
}
