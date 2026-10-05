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
      className={`ease-arrive group relative flex h-full w-full flex-col rounded-panel p-5 text-left transition duration-200 hover:-translate-y-0.5 motion-reduce:transform-none ${
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

/**
 * The road from sending to an interview for one version: three bars on one scale, so the
 * drop-off reads at a glance. A tick on the replies bar marks your average across versions.
 */
function Funnel({ resume, average }: { resume: SampleResume; average: number }) {
  // TODO(me): use the counts the API returns instead of rate × sent.
  const sent = resume.applications
  const replies = Math.round(resume.response_rate * sent)
  const interviews = Math.round(resume.interview_rate * sent)
  const steps = [
    { label: 'Sent', count: sent, share: 1, bar: 'bg-bark', note: 'applications sent with it' },
    {
      label: 'Replies',
      count: replies,
      share: resume.response_rate,
      bar: 'bg-honey',
      note: `${percent(resume.response_rate)} got a reply`,
    },
    {
      label: 'Interviews',
      count: interviews,
      share: resume.interview_rate,
      bar: 'bg-pine',
      note: `${percent(resume.interview_rate)} reached an interview`,
    },
  ]
  const diff = Math.round((resume.response_rate - average) * 100)

  return (
    <div>
      <ol className="space-y-4">
        {steps.map((step) => (
          <li
            key={step.label}
            className="grid grid-cols-[5.5rem_minmax(0,1fr)] items-center gap-x-4"
          >
            <span>
              <span className="block font-display text-2xl font-bold tabular-nums leading-none">
                {step.count}
              </span>
              <span className="mt-1 block text-xs font-medium text-bark-500">{step.label}</span>
            </span>
            <span className="block">
              <span className="relative block h-3 rounded-full bg-birch-200">
                <span
                  className={`fill-in absolute inset-y-0 left-0 rounded-full ${step.bar}`}
                  style={{ width: `${Math.max(step.share * 100, step.count > 0 ? 2 : 0)}%` }}
                />
                {step.label === 'Replies' && (
                  <span
                    aria-hidden
                    className="absolute -inset-y-1 w-0.5 rounded-full bg-bark"
                    style={{ left: `${average * 100}%` }}
                  />
                )}
              </span>
              <span className="mt-1.5 block text-sm text-bark-500">{step.note}</span>
            </span>
          </li>
        ))}
      </ol>
      <p className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-bark-700">
        <span aria-hidden className="inline-block h-3.5 w-0.5 rounded-full bg-bark" />
        Your average reply rate is {percent(average)}.
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
            diff >= 0 ? 'bg-pine-50 text-pine-700' : 'bg-berry-50 text-berry'
          }`}
        >
          {diff >= 0 ? `${diff} points above` : `${Math.abs(diff)} points below`}
        </span>
      </p>
    </div>
  )
}

const companyInitial = (name = '') => name.trim().charAt(0).toUpperCase() || '?'

/** One version, up close: how it does, the applications it went out with, and editing. */
function VersionDetail({
  resume,
  average,
  sentWith,
}: {
  resume: SampleResume
  average: number
  sentWith: typeof sampleApplications
}) {
  const [editing, setEditing] = useState(false)
  const tooFew = resume.applications < SAMPLE_MIN_SENDS_TO_COMPARE

  return (
    <section aria-labelledby="version-title" className="panel mt-6 min-w-0 overflow-hidden">
      <header className="flex flex-wrap items-start justify-between gap-4 p-5 sm:p-6">
        <div className="flex min-w-0 items-start gap-4">
          <PageThumb dark={false} />
          <div className="min-w-0">
            <h2 id="version-title" className="font-display text-2xl font-bold tracking-tight">
              {resume.name}
            </h2>
            <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-sm text-bark-500">
              <span className="inline-flex items-center gap-1.5">
                <Icon name="file" size={14} />
                {resume.file_name}
              </span>
              <span aria-hidden>·</span>
              <span>Updated {plainDate.format(new Date(resume.updated_at))}</span>
            </p>
            {tooFew && (
              <p className="mt-2 text-sm text-bark-500">
                Sent fewer than {SAMPLE_MIN_SENDS_TO_COMPARE} times, so these numbers are early.
              </p>
            )}
          </div>
        </div>
        {!editing && (
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => setEditing(true)} className="btn-soft">
              <Icon name="pencil" size={15} />
              Edit
            </button>
            <button type="button" className="btn-soft">
              <Icon name="download" size={15} />
              Download
            </button>
          </div>
        )}
      </header>

      {editing && (
        // TODO(me): controlled fields; "Save" PATCHes the name and uploads the new PDF if one
        //   was chosen (keep the old file until the upload succeeds). Delete asks first, and
        //   applications that used this version keep their record of it.
        <form
          aria-label={`Edit ${resume.name}`}
          className="view-in border-y border-birch-200 bg-birch px-5 py-5 sm:px-6"
          onSubmit={(event) => {
            event.preventDefault()
            setEditing(false)
          }}
        >
          <div className="grid gap-5 md:grid-cols-2">
            <label className="block">
              <span className="label">Version name</span>
              <span className="field-group mt-1.5">
                <Icon name="note" size={17} className="field-icon" />
                <input
                  name="name"
                  defaultValue={resume.name}
                  required
                  maxLength={80}
                  className="field bg-birch-50"
                />
              </span>
              <span className="hint mt-1.5 block">How it shows up across JobBear.</span>
            </label>
            <div>
              <span className="label" id="replace-label">
                The PDF
              </span>
              <label className="mt-1.5 flex min-h-[2.75rem] cursor-pointer items-center gap-3 rounded-control border border-dashed border-bark-400 bg-birch-50 px-3.5 py-2.5 transition-colors hover:border-bark hover:bg-white has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-bark">
                <Icon name="upload" size={17} className="text-bark-500" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">
                    Replace {resume.file_name}
                  </span>
                  <span className="block text-xs text-bark-500">PDF, up to 5 MB</span>
                </span>
                <input
                  type="file"
                  name="file"
                  accept="application/pdf"
                  aria-labelledby="replace-label"
                  className="sr-only"
                />
              </label>
              <span className="hint mt-1.5 block">
                Uploaded the wrong file or fixed a typo? Swap it here.
              </span>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <button type="submit" className="btn-primary">
              <Icon name="check" size={15} />
              Save changes
            </button>
            <button type="button" onClick={() => setEditing(false)} className="btn-ghost">
              Cancel
            </button>
            <button
              type="button"
              className="btn-ghost ml-auto text-berry hover:bg-berry-50 hover:text-berry"
            >
              Delete version
            </button>
          </div>
        </form>
      )}

      <div className="grid gap-px bg-birch-200 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
        <div className="bg-birch-50 p-5 sm:p-6">
          <h3 className="font-semibold">How {resume.name} is doing</h3>
          <p className="mt-0.5 text-sm text-bark-500">
            Of the applications you sent with it, how many got a reply and how many reached an
            interview.
          </p>
          <div className="mt-5">
            <Funnel resume={resume} average={average} />
          </div>
        </div>

        {/* Wide screens: this column takes the height of the one beside it and its list
            scrolls inside, so a long list never stretches the row and leaves a gap. */}
        <div className="flex flex-col bg-birch-50 p-5 sm:p-6">
          <h3 className="flex items-baseline justify-between gap-2 font-semibold">
            Jobs you used it for
            <span className="text-sm font-normal tabular-nums text-bark-500">
              {sentWith.length} {sentWith.length === 1 ? 'job' : 'jobs'}
            </span>
          </h3>
          <p className="mt-0.5 text-sm text-bark-500">
            Every application where you sent this version. Open one to see where it stands.
          </p>
          {sentWith.length > 0 ? (
            <div className="relative mt-3 flex-1 lg:min-h-[14rem]">
              <ul
                tabIndex={0}
                aria-label={`Applications sent with ${resume.name}`}
                className="scroll-fade -mx-2 divide-y divide-birch-200 overflow-y-auto rounded-control pb-6 max-lg:max-h-80 lg:absolute lg:inset-0 lg:mx-0"
              >
                {sentWith.map((app) => (
                  <li key={app.id}>
                    <Link
                      to={`/applications/${app.id}`}
                      className="group flex items-center gap-3 rounded-control px-2 py-2.5 transition-colors duration-150 hover:bg-white"
                    >
                      <span
                        aria-hidden
                        className="grid h-9 w-9 shrink-0 place-items-center rounded-control bg-bark font-display text-sm font-bold text-birch-50"
                      >
                        {companyInitial(app.company?.name)}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-medium">{app.position}</span>
                        <span className="block truncate text-sm text-bark-500">
                          {app.company?.name} · {plainDate.format(new Date(app.applied_at))}
                        </span>
                      </span>
                      <StatusBadge status={app.status} />
                      <Icon
                        name="chevronRight"
                        size={16}
                        className="ease-arrive text-bark-400 transition-transform duration-200 group-hover:translate-x-0.5"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="mt-3 rounded-control border border-dashed border-birch-300 px-4 py-6 text-center text-sm text-bark-500">
              No applications use this version yet. Pick it under “Resume sent” when you log one.
            </p>
          )}
        </div>
      </div>
    </section>
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
          <li key={resume.id} className="h-full">
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
        <VersionDetail key={selected.id} resume={selected} average={average} sentWith={sentWith} />
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
