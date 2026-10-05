import { useId } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipProps,
} from 'recharts'

import type { WeeklyStats } from '../../types'

interface WeeklyVolumeChartProps {
  weeks: WeeklyStats['weeks']
  goal: number
  height?: number
}

// week_start is a plain date ("2026-09-14"); format in UTC so it doesn't shift a day.
const shortDate = new Intl.DateTimeFormat(undefined, {
  month: 'short',
  day: 'numeric',
  timeZone: 'UTC',
})

/** Applications per week as bars, with the weekly goal as a dashed honey line. */
export default function WeeklyVolumeChart({ weeks, goal, height = 260 }: WeeklyVolumeChartProps) {
  // Gradient ids must be unique: the landing preview and the dashboard can both mount one.
  const id = useId().replace(/:/g, '')
  return (
    <div>
      <div
        style={{ height }}
        className="chart-rise chart-focus -ml-3"
        role="img"
        aria-label={`Applications per week for the last ${weeks.length} weeks, against a weekly goal of ${goal}.`}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={weeks} margin={{ top: 20, right: 8, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id={`${id}-honey`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F2BC4B" />
                <stop offset="100%" stopColor="#D9951A" />
              </linearGradient>
              <linearGradient id={`${id}-bark`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#5A4739" />
                <stop offset="100%" stopColor="#3A2C23" />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="#E4E5DD" strokeDasharray="2 4" />
            <XAxis
              dataKey="week_start"
              tickFormatter={(value: string) => shortDate.format(new Date(value))}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fill: '#76695F', fontSize: 12 }}
            />
            <YAxis
              allowDecimals={false}
              tickLine={false}
              axisLine={false}
              width={36}
              tick={{ fill: '#76695F', fontSize: 12 }}
            />
            <Tooltip
              cursor={{ fill: '#E4E5DD', opacity: 0.45 }}
              content={<WeekTooltip goal={goal} />}
              animationDuration={150}
            />
            <ReferenceLine
              y={goal}
              stroke="#C98A0E"
              strokeDasharray="6 5"
              strokeWidth={2}
              label={<GoalLabel goal={goal} />}
            />
            <Bar
              dataKey="applications"
              radius={[8, 8, 3, 3]}
              maxBarSize={44}
              isAnimationActive={false}
            >
              {weeks.map((week) => (
                <Cell
                  key={week.week_start}
                  fill={week.applications >= goal ? `url(#${id}-honey)` : `url(#${id}-bark)`}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* The chart is one image to screen readers; this list carries its values. */}
      <ul className="sr-only">
        {weeks.map((week) => (
          <li key={week.week_start}>
            Week of {shortDate.format(new Date(week.week_start))}: {week.applications}
          </li>
        ))}
      </ul>

      <div
        aria-hidden
        className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-bark-500"
      >
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-[3px] bg-honey" />
          Hit the goal
        </span>
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-[3px] bg-bark-700" />
          Below the goal
        </span>
        <span className="flex items-center gap-2">
          <span className="w-4 border-t-2 border-dashed border-honey-600" />
          Weekly goal
        </span>
      </div>
    </div>
  )
}

type WeekTooltipProps = TooltipProps<number, string> & { goal: number }

/** A dark bark card, so the hovered number reads at a glance over the light chart. */
function WeekTooltip({ active, payload, label, goal }: WeekTooltipProps) {
  if (!active || !payload?.length) return null
  const count = Number(payload[0]?.value ?? 0)
  const hit = count >= goal
  return (
    <div className="rounded-xl bg-bark px-3.5 py-2.5 text-birch-50 shadow-[0_12px_28px_-12px_rgb(42_31_25/0.7)]">
      <p className="text-xs text-birch-300">Week of {shortDate.format(new Date(String(label)))}</p>
      <p className="mt-0.5 font-display text-2xl font-bold tabular-nums leading-tight">
        {count}
        <span className="ml-1.5 font-sans text-sm font-medium text-birch-300">
          application{count === 1 ? '' : 's'}
        </span>
      </p>
      <p className={`mt-1 text-xs font-medium ${hit ? 'text-honey' : 'text-birch-300'}`}>
        {hit ? 'Goal hit' : `${goal - count} short of the goal`}
      </p>
    </div>
  )
}

interface GoalLabelProps {
  goal: number
  viewBox?: { x: number; y: number; width: number }
}

/** The goal value as a small honey pill sitting on the dashed line, at the right edge. */
function GoalLabel({ goal, viewBox }: GoalLabelProps) {
  if (!viewBox) return null
  const width = 58
  const x = viewBox.x + viewBox.width - width
  return (
    <g transform={`translate(${x}, ${viewBox.y - 11})`}>
      <rect width={width} height={22} rx={11} fill="#FDF5E2" stroke="#E9A825" />
      <text x={width / 2} y={15} textAnchor="middle" fontSize={12} fontWeight={600} fill="#7A5208">
        Goal {goal}
      </text>
    </g>
  )
}
