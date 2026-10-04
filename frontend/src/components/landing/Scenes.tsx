import type { CSSProperties, ReactNode } from 'react'

import BearCharacter from '../BearCharacter'
import Icon from '../Icon'

// Four small illustrations of how JobBear works, built from real UI pieces.
// They render their final state; the parent adds `.play` to replay the motion.

const d = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties

function Badge({ tone, children }: { tone: 'lake' | 'honey' | 'berry'; children: ReactNode }) {
  const tones = {
    lake: 'bg-lake-50 text-lake ring-lake/25',
    honey: 'bg-honey-50 text-honey-800 ring-honey/40',
    berry: 'bg-berry-50 text-berry ring-berry/25',
  }
  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${tones[tone]}`}
    >
      {children}
    </span>
  )
}

const card =
  'rounded-control border border-birch-200 bg-white shadow-[0_10px_30px_-18px_rgba(42,31,25,0.45)]'

/** 1. Applications land in the tracker. */
export function TrackScene() {
  const rows = [
    ['Northwind Labs', 'Backend Engineer Intern', 'Referral'],
    ['Halcyon Data', 'Software Engineer, New Grad', 'LinkedIn'],
    ['Tidepool', 'Junior Backend Developer', 'Company site'],
  ]
  return (
    <div className="flex h-full flex-col justify-center gap-3">
      <div data-a="pop" style={d(0)} className="self-start">
        <span className="btn-honey pointer-events-none">
          <Icon name="plus" size={16} />
          New application
        </span>
      </div>
      <div className={`${card} divide-y divide-birch-200 overflow-hidden`}>
        {rows.map(([company, role, source], i) => (
          <div
            key={company}
            data-a="drop"
            style={d(350 + i * 180)}
            className="grid grid-cols-[1fr_auto] items-center gap-3 px-4 py-3"
          >
            <span className="min-w-0">
              <span className="block truncate font-medium">{company}</span>
              <span className="block truncate text-sm text-bark-500">
                {role}, via {source}
              </span>
            </span>
            <Badge tone="lake">Applied</Badge>
          </div>
        ))}
      </div>
      <p data-a="in" style={d(1050)} className="text-sm text-bark-500">
        Or import everything from a Notion export in one go.
      </p>
    </div>
  )
}

/** 2. Recruiter emails travel to the bear. */
export function InboxScene() {
  const emails = [
    'Next steps for your application',
    'Scheduling your interview',
    'An update on your application',
  ]
  return (
    <div className="grid h-full grid-cols-[minmax(0,1fr)_3rem_auto] items-center gap-3 sm:gap-4">
      <div className="space-y-2.5">
        {emails.map((subject, i) => (
          <div
            key={subject}
            data-a="travel"
            style={d(i * 220)}
            className={`${card} flex items-center gap-2.5 px-3.5 py-3 text-sm`}
          >
            <Icon name="mail" size={16} className="text-bark-500" />
            <span className="truncate">{subject}</span>
          </div>
        ))}
      </div>
      <span aria-hidden className="relative h-[3px] w-full">
        <span data-a="draw" style={d(700)} className="absolute inset-0 rounded-full bg-honey" />
      </span>
      <div data-a="pop" style={d(950)} className="flex flex-col items-center text-center">
        <BearCharacter mood="reading" size={112} />
        <span className="mt-1 text-sm font-medium">3 emails read</span>
        <span className="text-xs text-bark-500">read-only access</span>
      </div>
    </div>
  )
}

/** 3. Sure answers update the status; unsure ones wait for you. */
export function SortScene() {
  return (
    <div className="flex h-full flex-col justify-center gap-4">
      <div className={`${card} p-4`}>
        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="font-medium">“Scheduling your interview”</span>
          <span className="tabular-nums text-bark-500">96% sure</span>
        </div>
        <span className="mt-2 block h-1.5 overflow-hidden rounded-full bg-birch-200">
          <span
            data-a="fill"
            style={d(150)}
            className="block h-full w-[96%] rounded-full bg-bark"
          />
        </span>
        <div
          data-a="in"
          style={d(1000)}
          className="mt-3 flex flex-wrap items-center gap-2 text-sm text-bark-700"
        >
          <Icon name="check" size={16} className="text-pine" />
          Meridian Maps moved to
          <span className="relative inline-grid">
            <span data-a="out" style={d(1150)} className="col-start-1 row-start-1 opacity-0">
              <Badge tone="lake">Applied</Badge>
            </span>
            <span data-a="in" style={d(1200)} className="col-start-1 row-start-1">
              <Badge tone="honey">Interviewing</Badge>
            </span>
          </span>
          automatically
        </div>
      </div>

      <div className={`${card} p-4`}>
        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="font-medium">“Quick question about your availability”</span>
          <span className="tabular-nums text-bark-500">61% sure</span>
        </div>
        <span className="mt-2 block h-1.5 overflow-hidden rounded-full bg-birch-200">
          <span
            data-a="fill"
            style={d(450)}
            className="block h-full w-[61%] rounded-full bg-honey"
          />
        </span>
        <div
          data-a="in"
          style={d(1450)}
          className="mt-3 flex items-center gap-2 text-sm text-bark-700"
        >
          <Icon name="inbox" size={16} className="text-honey-800" />
          Not sure enough, so it waits in your Inbox for a yes or no.
        </div>
      </div>
    </div>
  )
}

/** 4. The numbers tell you where to spend your time. */
export function InsightScene() {
  const rows: [string, number][] = [
    ['Referral', 67],
    ['Company site', 33],
    ['LinkedIn', 21],
    ['Job board', 18],
  ]
  return (
    <div className="flex h-full flex-col justify-center gap-4">
      <div className={`${card} p-4`}>
        <p className="mb-3 text-sm text-bark-500">Got a response, by source</p>
        <ul className="space-y-2.5">
          {rows.map(([source, rate], i) => (
            <li
              key={source}
              className="grid grid-cols-[6.5rem_1fr_2.5rem] items-center gap-3 text-sm"
            >
              <span>{source}</span>
              <span className="h-2.5 overflow-hidden rounded-full bg-birch-200">
                <span
                  data-a="fill"
                  style={{ ...d(i * 150), width: `${rate}%` }}
                  className={`block h-full rounded-full ${i === 0 ? 'bg-honey' : 'bg-bark'}`}
                />
              </span>
              <span className="text-right font-medium tabular-nums">{rate}%</span>
            </li>
          ))}
        </ul>
      </div>
      <div data-a="pop" style={d(1000)} className="rounded-control bg-bark p-4 text-birch-50">
        <p className="font-display text-lg font-semibold leading-snug">
          Referrals get a reply 3× as often as LinkedIn.
        </p>
        <p className="mt-1 text-sm text-birch-300">So this week: ask for two more referrals.</p>
      </div>
    </div>
  )
}
