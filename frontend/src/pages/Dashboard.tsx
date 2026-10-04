import { Link } from 'react-router-dom'

import SourceFunnel from '../components/charts/SourceFunnel'
import StatusBreakdown from '../components/charts/StatusBreakdown'
import WeeklyVolumeChart from '../components/charts/WeeklyVolumeChart'
import GoingQuietList from '../components/GoingQuietList'
import InsightList from '../components/InsightList'
import MetricStrip from '../components/MetricStrip'
import NeedsYouList from '../components/NeedsYouList'
import PageHeader from '../components/PageHeader'
import Panel from '../components/Panel'
import {
  SAMPLE_GHOST_AFTER_DAYS,
  sampleFunnel,
  sampleGoingQuiet,
  sampleInsights,
  sampleMetrics,
  sampleNeedsYou,
  sampleStatusCounts,
  sampleWeekly,
} from '../sample/data'

export default function Dashboard() {
  // TODO(me): replace every `sample*` import with real data:
  //   - GET /stats/summary → metrics (format rates as "42%") and by_status → StatusCount[]
  //   - GET /stats/weekly → <WeeklyVolumeChart weeks goal />
  //   - per-source endpoint (docs/replica/diff.md, item E) → <SourceFunnel rows />
  //   - needs-you + going-quiet lists from applications (next_action, last_activity_at)
  //   - insights: decide whether the backend writes these sentences or the frontend does
  //   Show <Skeleton /> blocks while loading.
  return (
    <>
      <PageHeader
        title="Dashboard"
        description="What needs you this week, and which applications are turning into replies."
      />

      <MetricStrip metrics={sampleMetrics} />

      <div className="mt-6 grid gap-6 xl:grid-cols-12">
        <Panel
          title="Needs you"
          description="Soonest first."
          className="xl:col-span-5"
          actions={
            <Link to="/applications" className="text-sm text-bark-500 hover:text-bark">
              All applications
            </Link>
          }
        >
          <NeedsYouList items={sampleNeedsYou} />
        </Panel>

        <Panel
          title="Applications per week"
          description={`Bars turn honey when you hit your goal of ${sampleWeekly.goal}.`}
          className="xl:col-span-7"
        >
          <WeeklyVolumeChart weeks={sampleWeekly.weeks} goal={sampleWeekly.goal} height={280} />
        </Panel>

        <section className="min-w-0 rounded-panel bg-bark p-6 text-birch-50 sm:p-7 xl:col-span-4">
          <h2 className="text-lg font-bold tracking-tight">What’s working</h2>
          <p className="mb-6 mt-0.5 text-sm text-birch-300">From your last 48 applications.</p>
          <InsightList insights={sampleInsights} />
        </section>

        <Panel
          title="Response rate by source"
          description="Which channel gets answers. Put your time where the replies are."
          className="xl:col-span-8"
        >
          <SourceFunnel rows={sampleFunnel} />
        </Panel>

        <Panel
          title="Going quiet"
          description={`No reply yet. JobBear marks an application ghosted after ${SAMPLE_GHOST_AFTER_DAYS} days.`}
          className="xl:col-span-7"
        >
          <GoingQuietList items={sampleGoingQuiet} ghostAfterDays={SAMPLE_GHOST_AFTER_DAYS} />
        </Panel>

        <Panel title="Where things stand" className="xl:col-span-5">
          <StatusBreakdown items={sampleStatusCounts} />
        </Panel>
      </div>
    </>
  )
}
