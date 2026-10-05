import { useState } from 'react'
import { Link } from 'react-router-dom'

import RateTable from '../components/charts/RateTable'
import Icon from '../components/Icon'
import PageHeader from '../components/PageHeader'
import Panel from '../components/Panel'
import StatusBadge from '../components/StatusBadge'
import {
  SAMPLE_MIN_SENDS_TO_COMPARE,
  sampleApplications,
  sampleResumeByApplication,
  sampleResumes,
  type SampleResume,
} from '../sample/data'

const plainDate = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeZone: 'UTC' })
const percent = (rate: number) => `${Math.round(rate * 100)}%`

/** A tiny drawn page: a name line, then text lines of different lengths. */
function PageThumb({ dark }: { dark: boolean }) {
  const ink = dark ? 'bg-birch/25' : 'bg-bark/15'
  return (
    <span
      aria-hidden
      className={`block h-20 w-16 shrink-0 rounded-md p-2 shadow-[0_8px_16px_-10px_rgba(42,31,25,0.6)] ${
        dark ? 'bg-bark-700' : 'bg-white ring-1 ring-birch-300'
      }`}
    >
      <span className={`block h-1.5 w-8 rounded-full ${dark ? 'bg-honey' : 'bg-bark/40'}`} />
      {[10, 12, 8, 11, 6, 12, 9].map((w, i) => (
        <span
          key={i}
          className={`mt-1 block h-1 rounded-full ${ink}`}
          style={{ width: `${w * 4}px` }}
        />
      ))}
    </span>
  )
}

function VersionCard({
  resume,
  best,
  selected,
  onSelect,
}: {
  resume: SampleResume
  best: boolean
  selected: boolean
  onSelect: () => void
}) {
  const tooFew = resume.applications < SAMPLE_MIN_SENDS_TO_COMPARE
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`ease-arrive group relative flex w-full flex-col rounded-panel p-5 text-left transition duration-200 hover:-translate-y-0.5 motion-reduce:transform-none ${
        best
          ? 'bg-bark text-birch-50 shadow-[0_24px_48px_-30px_rgba(42,31,25,0.9)]'
          : 'border border-birch-200 bg-birch-50 hover:border-birch-300'
      } ${selected ? 'ring-2 ring-honey ring-offset-2 ring-offset-birch' : ''}`}
    >
      <span className="flex items-start justify-between gap-3">
        <PageThumb dark={best} />
        {best && (
          <span className="rounded-full bg-honey px-2.5 py-1 text-xs font-bold text-bark">
            Most replies
          </span>
        )}
      </span>
      <span className="mt-4 block font-display text-lg font-bold tracking-tight">
        {resume.name}
      </span>
      <span className={`block truncate text-sm ${best ? 'text-birch-300' : 'text-bark-500'}`}>
        {resume.file_name}
      </span>
      <span className="mt-4 flex items-baseline gap-2">
        <span
          className={`font-display text-3xl font-extrabold tabular-nums tracking-tight ${best ? 'text-honey' : ''}`}
        >
          {percent(resume.response_rate)}
        </span>
        <span className={`text-sm ${best ? 'text-birch-300' : 'text-bark-500'}`}>
          replies, {resume.applications} sent
        </span>
      </span>
      {tooFew && (
        <span className={`mt-1 text-xs ${best ? 'text-birch-300' : 'text-bark-500'}`}>
          Too few sends to compare yet
        </span>
      )}
    </button>
  )
}

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

  const [selectedId, setSelectedId] = useState(best?.id ?? resumes[0]?.id)
  const selected = resumes.find((resume) => resume.id === selectedId) ?? resumes[0]

  const totalSent = resumes.reduce((sum, r) => sum + r.applications, 0)
  const average =
    totalSent === 0
      ? 0
      : resumes.reduce((sum, r) => sum + r.response_rate * r.applications, 0) / totalSent
  const sentWith = sampleApplications.filter(
    (app) => sampleResumeByApplication[app.id] === selected?.id,
  )

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

      {best && runnerUp && (
        <p className="mb-6 max-w-3xl font-display text-2xl font-bold leading-snug tracking-tight [text-wrap:balance] sm:text-3xl">
          {best.name} gets a reply{' '}
          <span className="rounded-md bg-honey/25 px-1.5">{percent(best.response_rate)}</span> of
          the time, against {percent(runnerUp.response_rate)} for {runnerUp.name}.
        </p>
      )}

      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Resume versions">
        {resumes.map((resume) => (
          <li key={resume.id}>
            <VersionCard
              resume={resume}
              best={resume.id === best?.id}
              selected={resume.id === selected?.id}
              onSelect={() => setSelectedId(resume.id)}
            />
          </li>
        ))}
      </ul>

      {selected && (
        <div className="mt-6 grid gap-6 xl:grid-cols-12">
          <Panel
            title={selected.name}
            icon="file"
            description={`${selected.file_name}, updated ${plainDate.format(new Date(selected.updated_at))}`}
            className="xl:col-span-5"
            actions={
              <button type="button" className="btn-soft">
                <Icon name="external" size={15} />
                Download
              </button>
            }
          >
            <dl className="grid grid-cols-3 gap-3">
              {[
                { label: 'Sent', value: String(selected.applications) },
                { label: 'Replies', value: percent(selected.response_rate) },
                { label: 'Interviews', value: percent(selected.interview_rate) },
              ].map((stat) => (
                <div key={stat.label} className="rounded-control bg-birch px-3 py-3">
                  <dt className="text-xs text-bark-500">{stat.label}</dt>
                  <dd className="mt-1 font-display text-2xl font-bold tabular-nums">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-sm text-bark-700">
              <span className="font-semibold">
                {Math.abs(Math.round((selected.response_rate - average) * 100))} points{' '}
                {selected.response_rate >= average ? 'above' : 'below'}
              </span>{' '}
              your average reply rate of {percent(average)}.
            </p>
          </Panel>

          <Panel
            title="Sent with"
            icon="send"
            description="Applications that went out with this version."
            className="xl:col-span-7"
          >
            {sentWith.length > 0 ? (
              <ul className="-mx-2 divide-y divide-birch-200/80">
                {sentWith.map((app) => (
                  <li key={app.id}>
                    <Link
                      to={`/applications/${app.id}`}
                      className="flex items-center gap-3 rounded-control px-2 py-2.5 transition-colors duration-150 hover:bg-white"
                    >
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-medium">{app.position}</span>
                        <span className="block truncate text-sm text-bark-500">
                          {app.company?.name}
                        </span>
                      </span>
                      <StatusBadge status={app.status} />
                      <Icon name="chevronRight" size={16} className="text-bark-500" />
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-bark-500">No applications use this version yet.</p>
            )}
          </Panel>
        </div>
      )}

      <Panel
        title="Side by side"
        icon="chart"
        description={`Versions sent fewer than ${SAMPLE_MIN_SENDS_TO_COMPARE} times are too new to judge.`}
        className="mt-6"
      >
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
    </>
  )
}
