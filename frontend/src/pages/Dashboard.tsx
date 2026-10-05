import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'

import BearCharacter from '../components/BearCharacter'
import SourceFunnel from '../components/charts/SourceFunnel'
import StatusBreakdown from '../components/charts/StatusBreakdown'
import WeeklyVolumeChart from '../components/charts/WeeklyVolumeChart'
import GoingQuietList from '../components/GoingQuietList'
import Icon from '../components/Icon'
import InsightList from '../components/InsightList'
import MetricStrip from '../components/MetricStrip'
import NeedsYouList from '../components/NeedsYouList'
import Panel from '../components/Panel'
import {
  SAMPLE_GHOST_AFTER_DAYS,
  sampleEmails,
  sampleFunnel,
  sampleGoingQuiet,
  sampleInsights,
  sampleMetrics,
  sampleNeedsYou,
  sampleStatusCounts,
  sampleWeekly,
} from '../sample/data'

/** Arrival order for the dashboard's one entrance (see .dash-in in index.css). */
const order = (i: number) => ({ '--i': i }) as CSSProperties

const today = new Intl.DateTimeFormat(undefined, {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
})

function greeting(hour: number) {
  if (hour < 5) return 'Up late'
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

export default function Dashboard() {
  // TODO(me): replace every `sample*` import with real data:
  //   - GET /stats/summary → metrics (format rates as "42%") and by_status → StatusCount[]
  //   - GET /stats/weekly → <WeeklyVolumeChart weeks goal />
  //   - per-source endpoint (docs/replica/diff.md, item E) → <SourceFunnel rows />
  //   - needs-you + going-quiet lists from applications (next_action, last_activity_at)
  //   - insights: decide whether the backend writes these sentences or the frontend does
  //   - the inbox count in the header: same review-queue query as the sidebar badge
  //   Show <Skeleton /> blocks while loading.
  const now = new Date()
  const waiting = sampleEmails.length

  return (
    <>
      <header className="dash-in mb-6 flex flex-wrap items-end justify-between gap-x-6 gap-y-4 lg:mb-8">
        <div className="flex min-w-0 items-end gap-4">
          <BearCharacter mood="waving" size={64} className="-mb-1 hidden shrink-0 sm:block" />
          <div className="min-w-0">
            <h1 className="text-balance text-3xl font-extrabold tracking-tight sm:text-4xl">
              {greeting(now.getHours())}
            </h1>
            {/* Two different kinds of line: the date is quiet metadata, the to-do count is
                an action that jumps to the "Needs you" panel. */}
            <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-2">
              <span className="inline-flex items-center gap-1.5 text-sm text-bark-500">
                <Icon name="calendar" size={15} />
                <time dateTime={now.toISOString().slice(0, 10)}>{today.format(now)}</time>
              </span>
              <a
                href="#needs-you"
                className="group inline-flex items-center gap-2 rounded-full bg-honey-50 py-1 pl-2.5 pr-3 text-sm font-semibold text-honey-800 ring-1 ring-inset ring-honey/50 transition-colors duration-150 hover:bg-honey/25"
              >
                <span aria-hidden className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-honey opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-honey-600" />
                </span>
                {sampleNeedsYou.length} things need you this week
                <Icon
                  name="arrowRight"
                  size={14}
                  className="ease-arrive transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </a>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link to="/inbox" className="btn-soft">
            <Icon name="inbox" size={16} />
            Review inbox
            {waiting > 0 && (
              <span className="rounded-full bg-honey px-1.5 text-xs font-semibold tabular-nums text-bark">
                {waiting}
                <span className="sr-only"> waiting</span>
              </span>
            )}
          </Link>
          <Link to="/applications/new" className="btn-primary hidden sm:inline-flex">
            <Icon name="plus" size={16} />
            New application
          </Link>
        </div>
      </header>

      <div className="dash-in" style={order(1)}>
        <MetricStrip metrics={sampleMetrics} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-12">
        <Panel
          id="needs-you"
          title="Needs you"
          description="Soonest first."
          icon="clock"
          iconTone="honey"
          className="dash-in panel-hover xl:col-span-5"
          style={order(2)}
          actions={
            <Link
              to="/applications"
              className="group inline-flex items-center gap-1 rounded-control text-sm font-medium text-bark-500 transition-colors hover:text-bark"
            >
              All applications
              <Icon
                name="arrowRight"
                size={14}
                className="ease-arrive transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </Link>
          }
        >
          <NeedsYouList items={sampleNeedsYou} />
        </Panel>

        <Panel
          title="Applications per week"
          description={`Bars turn honey when you hit your goal of ${sampleWeekly.goal}.`}
          icon="chart"
          className="dash-in panel-hover xl:col-span-7"
          style={order(3)}
        >
          <WeeklyVolumeChart weeks={sampleWeekly.weeks} goal={sampleWeekly.goal} height={260} />
        </Panel>

        <section
          className="dash-in relative min-w-0 overflow-hidden rounded-panel bg-bark p-6 text-birch-50 sm:p-7 xl:col-span-4"
          style={order(4)}
        >
          <div aria-hidden className="demo-dots pointer-events-none absolute inset-0" />
          <BearCharacter
            mood="reading"
            size={76}
            outlined
            className="pointer-events-none absolute -right-1 -top-1"
          />
          <div className="relative">
            <h2 className="pr-16 text-lg font-bold tracking-tight">What’s working</h2>
            <p className="mb-6 mt-0.5 pr-16 text-sm text-birch-300">
              From your last 48 applications.
            </p>
            <InsightList insights={sampleInsights} />
          </div>
        </section>

        <Panel
          title="Response rate by source"
          description="Which channel gets answers. Put your time where the replies are."
          icon="funnel"
          iconTone="lake"
          className="dash-in panel-hover xl:col-span-8"
          style={order(5)}
        >
          <SourceFunnel rows={sampleFunnel} />
        </Panel>

        <Panel
          title="Going quiet"
          description={`No reply yet. JobBear marks an application ghosted after ${SAMPLE_GHOST_AFTER_DAYS} days.`}
          icon="hourglass"
          iconTone="berry"
          className="dash-in panel-hover xl:col-span-7"
          style={order(6)}
        >
          <GoingQuietList items={sampleGoingQuiet} ghostAfterDays={SAMPLE_GHOST_AFTER_DAYS} />
        </Panel>

        <Panel
          title="Where things stand"
          description="Every application, by its current status."
          icon="pie"
          iconTone="pine"
          className="dash-in panel-hover xl:col-span-5"
          style={order(7)}
        >
          <StatusBreakdown items={sampleStatusCounts} />
        </Panel>
      </div>
    </>
  )
}
