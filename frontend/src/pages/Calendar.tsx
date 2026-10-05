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
  const later = sorted.filter((item) => parse(item.at) >= weekEnd)
  // Group what's coming by the week it falls in, so "later" reads like the week view does.
  const laterWeeks: { start: Date; items: SampleAgendaItem[] }[] = []
  for (const item of later) {
    const start = mondayOf(parse(item.at))
    const group = laterWeeks.find((week) => sameDay(week.start, start))
    if (group) group.items.push(item)
    else laterWeeks.push({ start, items: [item] })
  }
  const thisMonday = mondayOf(today)
  const weeksFromNow = (start: Date) =>
    Math.round((start.getTime() - thisMonday.getTime()) / (7 * 24 * 60 * 60 * 1000))
  const weekName = (start: Date) => {
    const n = weeksFromNow(start)
    if (n === 1) return 'Next week'
    return `In ${n} weeks`
  }
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

      {laterWeeks.length > 0 && (
        <section aria-labelledby="later-title" className="mt-8">
          <h2 id="later-title" className="text-lg font-bold tracking-tight">
            Coming up later
          </h2>
          <p className="mt-0.5 text-sm text-bark-500">Everything after the week above, by week.</p>
          <div className="mt-4 space-y-6">
            {laterWeeks.map((week) => {
              const last = addDays(week.start, 6)
              return (
                <section
                  key={week.start.toISOString()}
                  aria-label={`${weekName(week.start)}, ${monthDay.format(week.start)} to ${monthDay.format(last)}`}
                  className="rounded-panel border border-birch-200 bg-birch-50"
                >
                  <header className="flex flex-wrap items-center justify-between gap-2 border-b border-birch-200 px-4 py-3 sm:px-5">
                    <p className="flex items-baseline gap-2">
                      <span className="font-semibold">{weekName(week.start)}</span>
                      <span className="text-sm tabular-nums text-bark-500">
                        {monthDay.format(week.start)} – {monthDay.format(last)}
                      </span>
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setWeekOffset(weeksFromNow(week.start))
                        document
                          .getElementById('week-title')
                          ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                      }}
                      className="group inline-flex items-center gap-1 rounded-control text-sm font-medium text-bark-500 transition-colors hover:text-bark"
                    >
                      Show this week
                      <Icon
                        name="arrowRight"
                        size={14}
                        className="ease-arrive transition-transform duration-200 group-hover:translate-x-0.5"
                      />
                    </button>
                  </header>
                  <ul className="divide-y divide-birch-200">
                    {week.items.map((item) => {
                      const date = parse(item.at)
                      const kind = KIND[item.kind]
                      return (
                        <li key={item.id}>
                          <Link
                            to={`/applications/${item.application_id}`}
                            className="group grid grid-cols-[3rem_minmax(0,1fr)] items-center gap-x-4 gap-y-1 px-4 py-3 transition-colors duration-150 hover:bg-white sm:grid-cols-[3rem_minmax(0,1fr)_8.5rem_6rem_1rem] sm:px-5"
                          >
                            <span className="row-span-2 text-center sm:row-span-1">
                              <span className="block text-xs font-semibold text-bark-500">
                                {weekdayShort.format(date)}
                              </span>
                              <span className="block font-display text-2xl font-bold tabular-nums leading-tight">
                                {date.getDate()}
                              </span>
                            </span>
                            <span className="min-w-0">
                              <span className="block font-semibold leading-snug sm:truncate">
                                {item.title}
                              </span>
                              <span className="block truncate text-sm text-bark-500">
                                {company(item)}
                              </span>
                            </span>
                            {/* Phones: kind and time share a line under the title. Wider
                                screens: each gets its own column. */}
                            <span className="col-start-2 flex items-center gap-3 sm:contents">
                              <span
                                className={`inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${kind.chip}`}
                              >
                                <Icon name={kind.icon} size={12} />
                                {kind.label}
                              </span>
                              <span className="text-sm tabular-nums text-bark-500 sm:text-right">
                                {whenLabel(item)}
                              </span>
                            </span>
                            <Icon
                              name="chevronRight"
                              size={16}
                              className="ease-arrive hidden text-bark-400 transition-transform duration-200 group-hover:translate-x-0.5 sm:block"
                            />
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                </section>
              )
            })}
          </div>
        </section>
      )}
    </>
  )
}
