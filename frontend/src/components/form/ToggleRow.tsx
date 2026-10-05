import type { ReactNode } from 'react'

interface ToggleRowProps {
  label: string
  description?: ReactNode
  name?: string
  defaultChecked?: boolean
}

/**
 * A setting that is on or off: the label and a line on what it does, with the switch on
 * the right. The whole row is the label, so clicking anywhere on it flips the switch.
 */
export default function ToggleRow({ label, description, name, defaultChecked }: ToggleRowProps) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-4 py-3.5 first:pt-0 last:pb-0">
      <span className="min-w-0">
        <span className="block text-sm font-semibold">{label}</span>
        {description && (
          <span className="mt-0.5 block text-sm leading-relaxed text-bark-500">{description}</span>
        )}
      </span>
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="switch mt-0.5"
      />
    </label>
  )
}
