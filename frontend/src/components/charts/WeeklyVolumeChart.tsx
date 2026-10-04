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
  return (
    <div
      style={{ height }}
      className="chart-rise -ml-3"
      role="img"
      aria-label={`Applications per week for the last ${weeks.length} weeks, against a weekly goal of ${goal}.`}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={weeks} margin={{ top: 16, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid vertical={false} stroke="#E4E5DD" />
          <XAxis
            dataKey="week_start"
            tickFormatter={(value: string) => shortDate.format(new Date(value))}
            tickLine={false}
            axisLine={false}
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
            cursor={{ fill: '#E4E5DD', opacity: 0.5 }}
            labelFormatter={(value: string) => `Week of ${shortDate.format(new Date(value))}`}
            formatter={(value: number) => [value, 'Applications']}
            contentStyle={{
              borderRadius: 10,
              border: '1px solid #D3D4C9',
              background: '#FAFAF7',
              fontSize: 13,
            }}
          />
          <ReferenceLine
            y={goal}
            stroke="#C98A0E"
            strokeDasharray="5 4"
            strokeWidth={2}
            label={{
              value: `Goal ${goal}`,
              position: 'insideTopRight',
              fill: '#7A5208',
              fontSize: 12,
            }}
          />
          <Bar
            dataKey="applications"
            radius={[6, 6, 0, 0]}
            maxBarSize={44}
            isAnimationActive={false}
          >
            {weeks.map((week) => (
              <Cell
                key={week.week_start}
                fill={week.applications >= goal ? '#E9A825' : '#4A3A30'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
