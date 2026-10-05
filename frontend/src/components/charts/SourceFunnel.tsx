import type { ApplicationSource } from '../../types'
import { SOURCE_LABELS } from '../statusStyles'
import RateTable from './RateTable'

// TODO(me): keep this shape in sync with whatever the per-source stats endpoint returns.
export interface SourceFunnelRow {
  source: ApplicationSource
  applications: number
  /** 0–1 */
  response_rate: number
  /** 0–1 */
  interview_rate: number
}

/**
 * Compares channels side by side: how many applications went out through each source,
 * and how often they turned into a response and an interview.
 */
export default function SourceFunnel({ rows }: { rows: SourceFunnelRow[] }) {
  return (
    <RateTable
      labelHeader="Source"
      ariaLabel="Response and interview rate by source"
      rows={rows.map((row) => ({ ...row, id: row.source, label: SOURCE_LABELS[row.source] }))}
    />
  )
}
