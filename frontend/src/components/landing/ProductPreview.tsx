import { useInView } from '../../hooks/useInView'
import {
  SAMPLE_GHOST_AFTER_DAYS,
  sampleFunnel,
  sampleGoingQuiet,
  sampleMetrics,
  sampleWeekly,
} from '../../sample/data'
import SourceFunnel from '../charts/SourceFunnel'
import WeeklyVolumeChart from '../charts/WeeklyVolumeChart'
import GoingQuietList from '../GoingQuietList'
import MetricStrip from '../MetricStrip'

/**
 * The real dashboard components inside an app frame, with sample data. Bars and meters wait
 * until the frame is on screen before they fill.
 */
export default function ProductPreview() {
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.25, once: true })

  return (
    <div
      ref={ref}
      className={`overflow-hidden rounded-[1.5rem] border border-birch/15 bg-birch shadow-[0_50px_100px_-50px_rgba(0,0,0,0.8)] ${
        inView ? '' : 'await-view'
      }`}
    >
      <div className="flex items-center gap-3 border-b border-birch-200 bg-birch-50 px-5 py-3">
        <span className="rounded-control bg-birch px-3 py-1 text-xs text-bark-500">
          localhost:5173/dashboard
        </span>
        <span className="ml-auto text-xs text-bark-500">Sample data</span>
      </div>
      {/* inert: decorative copy of the app; keeps its links out of the tab order and the a11y tree.
          React 18 has no `inert` prop type, so it goes in as a plain attribute. */}
      <div className="space-y-5 p-4 text-bark sm:p-6" {...({ inert: '' } as object)}>
        <MetricStrip metrics={sampleMetrics} />
        <div className="grid gap-5 xl:grid-cols-12">
          <section className="panel min-w-0 p-5 xl:col-span-7">
            <h3 className="mb-4 text-lg font-bold tracking-tight">Response rate by source</h3>
            <SourceFunnel rows={sampleFunnel} />
          </section>
          <section className="panel min-w-0 p-5 xl:col-span-5">
            <h3 className="mb-4 text-lg font-bold tracking-tight">Going quiet</h3>
            <GoingQuietList
              items={sampleGoingQuiet.slice(0, 3)}
              ghostAfterDays={SAMPLE_GHOST_AFTER_DAYS}
            />
          </section>
        </div>
        <section className="panel hidden min-w-0 p-5 md:block">
          <h3 className="mb-2 text-lg font-bold tracking-tight">Applications per week</h3>
          <WeeklyVolumeChart weeks={sampleWeekly.weeks} goal={sampleWeekly.goal} height={200} />
        </section>
      </div>
    </div>
  )
}
