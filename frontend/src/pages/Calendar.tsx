import { useState } from 'react'
import { Link } from 'react-router-dom'

import Icon, { type IconName } from '../components/Icon'
import PageHeader from '../components/PageHeader'
import {
  SAMPLE_TODAY,
  sampleAgenda,
  sampleApplications,
  type SampleAgendaItem,
} from '../sample/data'

// Each kind of event has its own look, so a week reads at a glance: interviews in honey,
// deadlines in bark, decisions as a honey outline, follow-ups dashed (they're optional).
const KIND: Record<SampleAgendaItem['kind'], { icon: IconName; label: string; chip: string }> = {
  INTERVIEW: { icon: 'calendar', label: 'Interview', chip: 'bg-honey text-bark' },
  ASSESSMENT: { icon: 'code', label: 'Assessment', chip: 'bg-bark text-birch-50' },
  DECISION: {
    icon: 'flag',
    label: 'Decision',
    chip: 'bg-honey-50 text-honey-800 ring-1 ring-inset ring-honey/50',
  },
  FOLLOW_UP: {
    icon: 'send',
    label: 'Follow-up',
    chip: 'border border-dashed border-bark-400 bg-white text-bark-700',
  },
}

/** "2026-10-06T14:00" or "2026-10-06" as a local date, without time zone surprises. */
function parse(at: string) {
  const [date = '', time = '00:00'] = at.split('T')
  const [y = 1970, m = 1, d = 1] = date.split('-').map(Number)
  const [hh = 0, mm = 0] = time.split(':').map(Number)
  return new Date(y, m - 1, d, hh, mm)
}

const addDays = (date: Date, days: number) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate() + days)
const sameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString()
const mondayOf = (date: Date) => addDays(date, -((date.getDay() + 6) % 7))

const weekdayShort = new Intl.DateTimeFormat(undefined, { weekday: 'short' })
const timeOfDay = new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' })
const monthDay = new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' })
const fullDay = new Intl.DateTimeFormat(undefined, {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
})

/** "14:00", "By midnight" (deadlines) or "Any time" (no time given). */
function whenLabel(item: SampleAgendaItem) {
  if (!item.at.includes('T')) return 'Any time'
  if (item.at.endsWith('23:59')) return 'By midnight'
  return timeOfDay.format(parse(item.at))
}

const company = (item: SampleAgendaItem) =>
  sampleApplications.find((app) => app.id === item.application_id)?.company?.name ?? ''

function EventChip({ item }: { item: SampleAgendaItem }) {
  const kind = KIND[item.kind]
  return (
    <Link
      to={`/applications/${item.application_id}`}
      className={`ease-arrive block rounded-control px-2.5 py-2 text-left transition duration-200 hover:-translate-y-0.5 motion-reduce:transform-none ${kind.chip}`}
    >
      <span className="flex items-center gap-1.5 text-xs font-semibold tabular-nums opacity-80">
        <Icon name={kind.icon} size={12} />
        {whenLabel(item)}
      </span>
      <span className="mt-0.5 block text-sm font-semibold leading-snug">{item.title}</span>
      <span className="block truncate text-xs opacity-80">{company(item)}</span>
    </Link>
  )
}

export default function Calendar() {
  // TODO(me): replace the sample agenda with interviews and deadlines found in emails, plus
  //   each application's next step. "Add to my calendar" can serve an .ics feed later (v2).
  const today = parse(SAMPLE_TODAY)
  const [weekOffset, setWeekOffset] = useState(0)
  const weekStart = addDays(mondayOf(today), weekOffset * 7)
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))
  const weekEnd = addDays(weekStart, 7)

  const sorted = [...sampleAgenda].sort((a, b) => parse(a.at).getTime() - parse(b.at).getTime())
  const later = sorted.filter((item) => parse(item.at) >= weekEnd).slice(0, 4)
  const lastDay = days[6] ?? weekStart
  const range = `${monthDay.format(weekStart)} – ${monthDay.format(lastDay)}, ${lastDay.getFullYear()}`

  return (
    <>
      <PageHeader
        title="Calendar"
        description="Interviews, assessment deadlines and follow-ups, found in your email."
      />

      <section
        aria-labelledby="week-title"
        className="rounded-panel border border-birch-200 bg-birch-50 p-4 sm:p-6"
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 id="week-title" className="font-display text-2xl font-bold tracking-tight">
            {range}
          </h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setWeekOffset(0)}
              disabled={weekOffset === 0}
              className="btn-soft"
            >
              This week
            </button>
            <button
              type="button"
              onClick={() => setWeekOffset((w) => w - 1)}
              aria-label="Previous week"
              className="btn-soft px-2.5"
            >
              <Icon name="chevronLeft" size={16} />
            </button>
            <button
              type="button"
              onClick={() => setWeekOffset((w) => w + 1)}
              aria-label="Next week"
              className="btn-soft px-2.5"
            >
              <Icon name="chevronRight" size={16} />
            </button>
          </div>
        </div>

        <ul
          className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-bark-500"
          aria-label="Legend"
        >
          {Object.values(KIND).map((kind) => (
            <li key={kind.label} className="flex items-center gap-1.5">
              <span aria-hidden className={`h-3 w-3 rounded-[4px] ${kind.chip}`} />
              {kind.label}
            </li>
          ))}
        </ul>

        {/* The week: seven equal columns on wide screens, one day per row on phones. */}
        <ol className="mt-5 grid gap-2 md:grid-cols-7">
          {days.map((day) => {
            const isToday = sameDay(day, today)
            const past = day < today && !isToday
            const items = sorted.filter((item) => sameDay(parse(item.at), day))
            return (
              <li
                key={day.toISOString()}
                aria-label={fullDay.format(day)}
                className={`flex flex-col rounded-control p-2.5 md:min-h-64 ${
                  isToday ? 'bg-white ring-2 ring-honey' : 'bg-birch'
                } ${past ? 'opacity-60' : ''}`}
              >
                <p className="flex items-baseline gap-2 md:flex-col md:gap-0">
                  <span
                    className={`text-xs font-semibold ${isToday ? 'text-honey-800' : 'text-bark-500'}`}
                  >
                    {isToday ? 'Today' : weekdayShort.format(day)}
                  </span>
                  <span className="font-display text-2xl font-bold tabular-nums">
                    {day.getDate()}
                  </span>
                </p>
                <div className="mt-2 space-y-1.5">
                  {items.map((item) => (
                    <EventChip key={item.id} item={item} />
                  ))}
                </div>
              </li>
            )
          })}
        </ol>
      </section>

      {later.length > 0 && (
        <section aria-labelledby="later-title" className="mt-8">
          <h2 id="later-title" className="text-lg font-bold tracking-tight">
            After this week
          </h2>
          <ul className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {later.map((item) => {
              const date = parse(item.at)
              const kind = KIND[item.kind]
              return (
                <li key={item.id} className="h-full">
                  <Link
                    to={`/applications/${item.application_id}`}
                    className="ease-arrive flex h-full items-start gap-4 rounded-panel border border-birch-200 bg-birch-50 p-4 transition duration-200 hover:-translate-y-0.5 hover:border-birch-300 motion-reduce:transform-none"
                  >
                    <span className="w-11 shrink-0 rounded-control bg-bark py-1.5 text-center text-birch-50">
                      <span className="block text-[0.6875rem] font-semibold text-honey">
                        {weekdayShort.format(date)}
                      </span>
                      <span className="block font-display text-xl font-bold tabular-nums leading-tight">
                        {date.getDate()}
                      </span>
                    </span>
                    <span className="min-w-0">
                      <span className="block font-semibold leading-snug">{item.title}</span>
                      <span className="block truncate text-sm text-bark-500">{company(item)}</span>
                      <span className="mt-1 flex items-center gap-1.5 text-xs text-bark-500">
                        <Icon name={kind.icon} size={12} />
                        {kind.label}, {whenLabel(item)}
                      </span>
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </section>
      )}
    </>
  )
}
