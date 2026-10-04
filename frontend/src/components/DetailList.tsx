import type { ReactNode } from 'react'

export interface DetailItem {
  label: string
  value: ReactNode
}

interface DetailListProps {
  items: DetailItem[]
}

/** Two-column label/value list for a record's fields. Empty values show a dash. */
export default function DetailList({ items }: DetailListProps) {
  return (
    <dl className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
      {items.map((item) => (
        <div key={item.label}>
          <dt className="text-sm text-bark-500">{item.label}</dt>
          <dd className="mt-1 break-words">{item.value ?? '—'}</dd>
        </div>
      ))}
    </dl>
  )
}
