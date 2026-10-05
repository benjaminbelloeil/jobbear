import { useId, useState, type InputHTMLAttributes } from 'react'

interface SliderProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'min' | 'max' | 'defaultValue'
> {
  label: string
  min: number
  max: number
  defaultValue: number
  /** How the current value is shown beside the label, e.g. (v) => `${v}%`. */
  format?: (value: number) => string
  hint?: string
}

/**
 * A native range input in JobBear clothes: the track fills honey up to the thumb and the
 * value beside the label follows it. Extra props (name, onChange, value) pass through.
 */
export default function Slider({
  label,
  min,
  max,
  defaultValue,
  format = String,
  hint,
  onChange,
  ...rest
}: SliderProps) {
  const id = useId()
  // Display only: what the thumb shows while you drag. Form state stays with the caller.
  const [shown, setShown] = useState(Number(rest.value ?? defaultValue))
  const fill = ((shown - min) / (max - min)) * 100

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <label htmlFor={id} className="label">
          {label}
        </label>
        <output
          htmlFor={id}
          className="rounded-full bg-honey-50 px-2 py-0.5 text-sm font-semibold tabular-nums text-honey-800 ring-1 ring-inset ring-honey/40"
        >
          {format(shown)}
        </output>
      </div>
      <input
        {...rest}
        id={id}
        type="range"
        min={min}
        max={max}
        defaultValue={rest.value === undefined ? defaultValue : undefined}
        onChange={(event) => {
          setShown(Number(event.target.value))
          onChange?.(event)
        }}
        className="range mt-3.5"
        style={{ '--fill': `${fill}%` } as React.CSSProperties}
      />
      {hint && <span className="hint">{hint}</span>}
    </div>
  )
}
