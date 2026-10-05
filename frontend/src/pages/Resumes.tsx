import RateTable from '../components/charts/RateTable'
import Icon from '../components/Icon'
import PageHeader from '../components/PageHeader'
import Panel from '../components/Panel'
import { SAMPLE_MIN_SENDS_TO_COMPARE, sampleResumes } from '../sample/data'

const plainDate = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeZone: 'UTC' })
const percent = (rate: number) => `${Math.round(rate * 100)}%`

export default function Resumes() {
  // TODO(me): replace the sample list with a query for the user's resume versions and their
  //   per-version response and interview rates. "Upload a version" opens a file picker and
  //   uploads the PDF; "Download" fetches the stored file.
  const resumes = sampleResumes
  const comparable = resumes
    .filter((resume) => resume.applications >= SAMPLE_MIN_SENDS_TO_COMPARE)
    .sort((a, b) => b.response_rate - a.response_rate)
  const best = comparable[0]
  const runnerUp = comparable[1]

  return (
    <>
      <PageHeader
        title="Resumes"
        description="Every version you've sent, and which one gets replies."
        actions={
          <button type="button" className="btn-primary">
            <Icon name="plus" size={16} />
            Upload a version
          </button>
        }
      />

      <div className="grid gap-6 xl:grid-cols-12">
        <Panel
          title="Which resume works"
          description={`Versions sent fewer than ${SAMPLE_MIN_SENDS_TO_COMPARE} times are too new to judge.`}
          icon="chart"
          className="xl:col-span-8"
        >
          {best && runnerUp && (
            <p className="mb-6 max-w-2xl text-lg font-semibold leading-snug [text-wrap:balance]">
              {best.name} gets a reply {percent(best.response_rate)} of the time, against{' '}
              {percent(runnerUp.response_rate)} for {runnerUp.name}.
            </p>
          )}
          <RateTable
            labelHeader="Resume"
            ariaLabel="Response and interview rate by resume version"
            rows={resumes.map((resume) => ({
              ...resume,
              label: resume.name,
              hint:
                resume.applications < SAMPLE_MIN_SENDS_TO_COMPARE
                  ? 'Too few sends to compare yet'
                  : undefined,
            }))}
          />
        </Panel>

        <Panel
          title="Versions"
          description="Pick one when you log an application."
          icon="file"
          className="xl:col-span-4"
        >
          <ul className="-mx-2 space-y-1">
            {resumes.map((resume) => (
              <li
                key={resume.id}
                className="flex items-center gap-3 rounded-control px-2 py-2.5 transition-colors duration-150 hover:bg-white"
              >
                <span className="icon-tile">
                  <Icon name="file" size={17} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-medium">{resume.name}</span>
                  <span className="block truncate text-sm text-bark-500">{resume.file_name}</span>
                  <span className="block text-xs text-bark-500">
                    Updated {plainDate.format(new Date(resume.updated_at))}
                  </span>
                </span>
                <button
                  type="button"
                  aria-label={`Download ${resume.name}`}
                  className="grid h-9 w-9 place-items-center rounded-control text-bark-500 transition-colors hover:bg-birch-200/70 hover:text-bark"
                >
                  <Icon name="external" size={16} />
                </button>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </>
  )
}
