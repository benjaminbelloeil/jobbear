import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react'

import Icon from '../Icon'

interface DatePickerProps {
  /** Controlled value as "YYYY-MM-DD" (what a native date input submits). */
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  name?: string
  id?: string
  label: string
  hint?: string
  placeholder?: string
  /** Hide the Clear button when a date is required. */
  required?: boolean
  className?: string
}

const pad = (n: number) => String(n).padStart(2, '0')
const toKey = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
const fromKey = (key: string) => {
  const [y, m, d] = key.split('-').map(Number)
  return y && m && d ? new Date(y, m - 1, d) : null
}
const addDays = (d: Date, days: number) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate() + days)
const addMonths = (d: Date, months: number) => {
  // Clamp to the target month's last day (31 Jan + 1 month = 28/29 Feb, not 3 Mar).
  const last = new Date(d.getFullYear(), d.getMonth() + months + 1, 0).getDate()
  return new Date(d.getFullYear(), d.getMonth() + months, Math.min(d.getDate(), last))
}
const sameDay = (a: Date | null, b: Date | null) => !!a && !!b && toKey(a) === toKey(b)

const longDate = new Intl.DateTimeFormat(undefined, {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})
const fullDate = new Intl.DateTimeFormat(undefined, { dateStyle: 'full' })
const monthTitle = new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric' })
const narrowDay = new Intl.DateTimeFormat(undefined, { weekday: 'narrow' })
const longDay = new Intl.DateTimeFormat(undefined, { weekday: 'long' })
// 1 Jan 2024 was a Monday: the week starts on Monday.
const WEEKDAYS = Array.from({ length: 7 }, (_, i) => {
  const day = new Date(2024, 0, 1 + i)
  return { short: narrowDay.format(day), long: longDay.format(day) }
})

const navButton =
  'grid h-8 w-8 place-items-center rounded-lg text-bark-500 transition-colors hover:bg-birch hover:text-bark'

/**
 * A calendar popover in place of the browser's date picker. Keyboard: arrows move by day
 * and week, Page Up/Down by month (with Shift, by year), Home/End to the week's edges,
 * Enter picks, Escape closes.
 */
export default function DatePicker({
  value,
  defaultValue = '',
  onChange,
  name,
  id,
  label,
  hint,
  placeholder = 'Pick a date',
  required = false,
  className = '',
}: DatePickerProps) {
  const autoId = useId()
  const buttonId = id ?? `${autoId}-button`
  const labelId = `${autoId}-label`
  const dialogId = `${autoId}-dialog`

  const [inner, setInner] = useState(defaultValue)
  const current = value ?? inner
  const selected = fromKey(current)
  const today = new Date()

  const [open, setOpen] = useState(false)
  const [focusDay, setFocusDay] = useState<Date>(selected ?? today)
  const rootRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  const commit = (key: string) => {
    if (value === undefined) setInner(key)
    onChange?.(key)
  }

  const close = (refocus = true) => {
    setOpen(false)
    if (refocus) triggerRef.current?.focus()
  }

  const pick = (day: Date) => {
    commit(toKey(day))
    close()
  }

  // Move real focus to the roving day whenever it changes while open.
  useEffect(() => {
    if (!open) return
    gridRef.current?.querySelector<HTMLButtonElement>(`[data-key="${toKey(focusDay)}"]`)?.focus()
  }, [open, focusDay])

  // Close when clicking anywhere outside the picker.
  useEffect(() => {
    if (!open) return
    const onPointer = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onPointer)
    return () => document.removeEventListener('mousedown', onPointer)
  }, [open])

  const month = new Date(focusDay.getFullYear(), focusDay.getMonth(), 1)
  const lead = (month.getDay() + 6) % 7
  const days = Array.from({ length: 42 }, (_, i) => addDays(month, i - lead))

  const onGridKey = (event: KeyboardEvent<HTMLDivElement>) => {
    const weekday = (focusDay.getDay() + 6) % 7
    const moves: Record<string, () => Date> = {
      ArrowLeft: () => addDays(focusDay, -1),
      ArrowRight: () => addDays(focusDay, 1),
      ArrowUp: () => addDays(focusDay, -7),
      ArrowDown: () => addDays(focusDay, 7),
      Home: () => addDays(focusDay, -weekday),
      End: () => addDays(focusDay, 6 - weekday),
      PageUp: () => addMonths(focusDay, event.shiftKey ? -12 : -1),
      PageDown: () => addMonths(focusDay, event.shiftKey ? 12 : 1),
    }
    const move = moves[event.key]
    if (move) {
      event.preventDefault()
      setFocusDay(move())
    } else if (event.key === 'Escape') {
      event.preventDefault()
      close()
    }
  }

  return (
    <div
      ref={rootRef}
      className={`relative ${className}`}
      onBlur={(event) => {
        // Tabbing out of the whole picker closes it.
        if (open && !rootRef.current?.contains(event.relatedTarget as Node)) setOpen(false)
      }}
    >
      <span id={labelId} className="label">
        {label}
      </span>
      <button
        ref={triggerRef}
        id={buttonId}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={dialogId}
        aria-labelledby={`${labelId} ${buttonId}`}
        onClick={() => {
          if (open) return close(false)
          setFocusDay(selected ?? today)
          setOpen(true)
        }}
        className="field relative mt-1.5 flex items-center gap-2.5 pl-10 text-left"
      >
        <Icon
          name="calendar"
          size={17}
          className={`absolute left-3.5 transition-colors ${open ? 'text-honey-800' : 'text-bark-400'}`}
        />
        <span className={`min-w-0 flex-1 truncate ${selected ? '' : 'text-bark-500'}`}>
          {selected ? longDate.format(selected) : placeholder}
        </span>
      </button>

      {open && (
        <div
          id={dialogId}
          role="dialog"
          aria-label={`Choose ${label.toLowerCase()}`}
          className="popover left-0 w-[19.5rem] max-w-[calc(100vw-2rem)] p-3"
        >
          <div className="mb-2 flex items-center justify-between">
            <button
              type="button"
              aria-label="Previous month"
              onClick={() => setFocusDay(addMonths(focusDay, -1))}
              className={navButton}
            >
              <Icon name="chevronLeft" size={16} />
            </button>
            <p aria-live="polite" className="font-display text-sm font-bold tracking-tight">
              {monthTitle.format(month)}
            </p>
            <button
              type="button"
              aria-label="Next month"
              onClick={() => setFocusDay(addMonths(focusDay, 1))}
              className={navButton}
            >
              <Icon name="chevronRight" size={16} />
            </button>
          </div>

          <div
            ref={gridRef}
            role="grid"
            aria-label={monthTitle.format(month)}
            onKeyDown={onGridKey}
          >
            <div role="row" className="grid grid-cols-7">
              {WEEKDAYS.map((day) => (
                <span
                  key={day.long}
                  role="columnheader"
                  aria-label={day.long}
                  className="grid h-8 place-items-center text-xs font-medium text-bark-500"
                >
                  {day.short}
                </span>
              ))}
            </div>
            {Array.from({ length: 6 }, (_, week) => (
              <div key={week} role="row" className="grid grid-cols-7 gap-y-0.5">
                {days.slice(week * 7, week * 7 + 7).map((day) => {
                  const key = toKey(day)
                  const inMonth = day.getMonth() === month.getMonth()
                  const isSelected = sameDay(day, selected)
                  const isToday = sameDay(day, today)
                  const tone = isSelected
                    ? 'bg-bark font-semibold text-birch-50 hover:bg-bark-700'
                    : `${inMonth ? 'text-bark' : 'text-bark-400'} hover:bg-birch`
                  return (
                    <span key={key} role="gridcell" aria-selected={isSelected}>
                      <button
                        type="button"
                        data-key={key}
                        tabIndex={sameDay(day, focusDay) ? 0 : -1}
                        aria-label={fullDate.format(day)}
                        aria-current={isToday ? 'date' : undefined}
                        onClick={() => pick(day)}
                        className={`relative mx-auto grid h-9 w-9 place-items-center rounded-lg text-sm tabular-nums transition-colors duration-100 focus-visible:outline-offset-0 ${tone} ${
                          isToday && !isSelected ? 'font-semibold ring-1 ring-inset ring-honey' : ''
                        }`}
                      >
                        {day.getDate()}
                        {isToday && (
                          <span
                            aria-hidden
                            className="absolute bottom-1 h-1 w-1 rounded-full bg-honey"
                          />
                        )}
                      </button>
                    </span>
                  )
                })}
              </div>
            ))}
          </div>

          <div className="mt-2 flex items-center justify-between border-t border-birch-200 pt-2">
            <button
              type="button"
              onClick={() => pick(today)}
              className="rounded-lg px-2.5 py-1.5 text-sm font-semibold text-honey-800 transition-colors hover:bg-honey-50"
            >
              Today
            </button>
            {!required && current && (
              <button
                type="button"
                onClick={() => {
                  commit('')
                  close()
                }}
                className="rounded-lg px-2.5 py-1.5 text-sm text-bark-500 transition-colors hover:bg-birch hover:text-bark"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      )}

      {name && <input type="hidden" name={name} value={current} />}
      {hint && <span className="hint">{hint}</span>}
    </div>
  )
}
