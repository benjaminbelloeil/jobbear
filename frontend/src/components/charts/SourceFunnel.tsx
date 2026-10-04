import type { ApplicationSource } from '../../types'
import { SOURCE_LABELS } from '../statusStyles'

// TODO(me): keep this shape in sync with whatever the per-source stats endpoint returns.
export interface SourceFunnelRow {
  source: ApplicationSource
  applications: number
  /** 0–1 */
  response_rate: number
  /** 0–1 */
  interview_rate: number
}

interface SourceFunnelProps {
  rows: SourceFunnelRow[]
}

const percent = (rate: number) => `${Math.round(rate * 100)}%`

/**
 * Compares channels side by side: how many applications went out through each source,
 * and how often they turned into a response and an interview.
 */
export default function SourceFunnel({ rows }: SourceFunnelProps) {
  return (
    <div className="overflow-x-auto">
      <table
        aria-label="Response and interview rate by source"
        className="w-full min-w-[34rem] text-sm"
      >
        <thead>
          <tr className="text-left text-bark-500">
            <th scope="col" className="pb-3 font-medium">
              Source
            </th>
            <th scope="col" className="pb-3 text-right font-medium">
              Sent
            </th>
            <th scope="col" className="w-[38%] pb-3 pl-6 font-medium">
              Got a response
            </th>
            <th scope="col" className="w-[24%] pb-3 pl-6 font-medium">
              Reached interview
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-birch-200">
          {rows.map((row) => (
            <tr key={row.source}>
              <th scope="row" className="py-3 text-left font-medium">
                {SOURCE_LABELS[row.source]}
              </th>
              <td className="py-3 text-right tabular-nums text-bark-500">{row.applications}</td>
              <td className="py-3 pl-6">
                <RateBar rate={row.response_rate} tone="bg-bark" />
              </td>
              <td className="py-3 pl-6">
                <RateBar rate={row.interview_rate} tone="bg-honey" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function RateBar({ rate, tone }: { rate: number; tone: string }) {
  return (
    <span className="flex items-center gap-3">
      <span className="h-2.5 flex-1 overflow-hidden rounded-full bg-birch-200">
        <span
          className={`fill-in block h-full rounded-full ${tone}`}
          style={{ width: percent(rate) }}
        />
      </span>
      <span className="w-10 text-right font-medium tabular-nums">{percent(rate)}</span>
    </span>
  )
}
