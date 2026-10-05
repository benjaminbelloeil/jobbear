import { useRef, type CSSProperties, type KeyboardEvent, type ReactNode } from 'react'

import Icon, { type IconName } from './Icon'

export interface TabItem<T extends string> {
  id: T
  label: string
  icon?: IconName
}

interface TabsProps<T extends string> {
  tabs: readonly TabItem<T>[]
  value: T
  onChange: (id: T) => void
  /** Names the tab list for screen readers, e.g. "Settings sections". */
  label: string
  className?: string
  style?: CSSProperties
}

/**
 * The underlined tab bar shared by the dashboard, profile and settings. Arrow keys, Home
 * and End move between tabs, as in any tab list; the honey underline slides to the
 * selected one. Scrolls sideways on narrow screens instead of wrapping.
 */
export default function Tabs<T extends string>({
  tabs,
  value,
  onChange,
  label,
  className = '',
  style,
}: TabsProps<T>) {
  const refs = useRef<(HTMLButtonElement | null)[]>([])

  const onKey = (event: KeyboardEvent, index: number) => {
    let next: number | null = null
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length
    if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length
    if (event.key === 'Home') next = 0
    if (event.key === 'End') next = tabs.length - 1
    if (next === null) return
    event.preventDefault()
    const tab = tabs[next]
    if (tab) onChange(tab.id)
    refs.current[next]?.focus()
  }

  return (
    <div
      role="tablist"
      aria-label={label}
      className={`no-scrollbar -mx-4 flex gap-1 overflow-x-auto border-b border-birch-300 px-4 sm:mx-0 sm:px-0 ${className}`}
      style={style}
    >
      {tabs.map((tab, index) => {
        const selected = value === tab.id
        return (
          <button
            key={tab.id}
            ref={(el) => {
              refs.current[index] = el
            }}
            type="button"
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={selected}
            aria-controls={`panel-${tab.id}`}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(tab.id)}
            onKeyDown={(event) => onKey(event, index)}
            className={`relative -mb-px inline-flex shrink-0 items-center gap-2 whitespace-nowrap px-4 py-3 text-sm font-semibold transition-colors duration-150 ${
              selected ? 'text-bark' : 'text-bark-500 hover:text-bark'
            }`}
          >
            {tab.icon && (
              <Icon
                name={tab.icon}
                size={16}
                className={`transition-colors duration-150 ${selected ? 'text-honey-600' : ''}`}
              />
            )}
            {tab.label}
            <span
              aria-hidden
              className={`ease-arrive absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-honey transition-transform duration-300 ${
                selected ? 'scale-x-100' : 'scale-x-0'
              }`}
            />
          </button>
        )
      })}
    </div>
  )
}

/** The content for the selected tab. Render it with `key={tab}` so each view fades in. */
export function TabPanel({
  id,
  className = '',
  children,
}: {
  id: string
  className?: string
  children: ReactNode
}) {
  return (
    <div
      role="tabpanel"
      id={`panel-${id}`}
      aria-labelledby={`tab-${id}`}
      className={`view-in ${className}`}
    >
      {children}
    </div>
  )
}
