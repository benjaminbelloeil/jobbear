import PageHeader from '../components/PageHeader'

const METRICS = ['Total applications', 'Response rate', 'OA rate', 'Interview rate', 'Avg. days to reply']

export default function Dashboard() {
  // TODO(me): useQuery for GET /stats/summary and GET /stats/weekly, then feed Recharts:
  //           a BarChart of applications per week with a ReferenceLine at the goal, and a
  //           status breakdown (bar or pie) from by_status.
  return (
    <>
      <PageHeader title="Dashboard" description="Your pipeline at a glance." />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        {METRICS.map((metric) => (
          <div key={metric} className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{metric}</p>
            <p className="mt-2 text-2xl font-semibold tabular-nums text-slate-300">—</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <section className="rounded-xl border border-slate-200 bg-white p-6 lg:col-span-2">
          <h2 className="font-medium">Weekly volume vs. goal</h2>
          <div className="mt-4 grid h-64 place-items-center rounded-lg bg-slate-50 text-sm text-slate-400">
            Chart goes here
          </div>
        </section>
        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="font-medium">By status</h2>
          <div className="mt-4 grid h-64 place-items-center rounded-lg bg-slate-50 text-sm text-slate-400">
            Chart goes here
          </div>
        </section>
      </div>
    </>
  )
}
