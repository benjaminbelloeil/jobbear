import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react'

import Icon, { type IconName } from '../Icon'

export interface SelectOption {
  value: string
  label: string
  /** Optional second line under the label. */
  hint?: string
  /** Optional colour dot (any CSS colour), e.g. a status hex. */
  dot?: string
}

interface SelectProps {
  options: SelectOption[]
  /** Controlled value. Leave undefined and use defaultValue for an uncontrolled select. */
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  /** Submitted with the form through a hidden input, like a native select. */
  name?: string
  id?: string
  label: string
  /** Keep the label for screen readers only. */
  hideLabel?: boolean
  hint?: string
  placeholder?: string
  icon?: IconName
  /** Shown inside the menu when there are no options. */
  emptyText?: string
  className?: string
}

/**
 * JobBear's dropdown: a select-only combobox (WAI-ARIA APG pattern). Focus stays on the
 * button; arrows move through the menu, Enter or Space picks, Escape closes, and typing a
 * letter jumps to the first option that starts with it.
 */
export default function Select({
  options,
  value,
  defaultValue = '',
  onChange,
  name,
  id,
  label,
  hideLabel = false,
  hint,
  placeholder = 'Choose…',
  icon,
  emptyText = 'Nothing to choose yet',
  className = '',
}: SelectProps) {
  const autoId = useId()
  const buttonId = id ?? `${autoId}-button`
  const labelId = `${autoId}-label`
  const listId = `${autoId}-list`
  const optionId = (index: number) => `${autoId}-option-${index}`

  const [inner, setInner] = useState(defaultValue)
  const current = value ?? inner
  const selectedIndex = options.findIndex((option) => option.value === current)
  const selected = options[selectedIndex]

  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const listRef = useRef<HTMLUListElement>(null)

  const openAt = (index: number) => {
    setActive(Math.max(0, Math.min(options.length - 1, index)))
    setOpen(true)
  }

  const choose = (index: number) => {
    const option = options[index]
    if (!option) return
    if (value === undefined) setInner(option.value)
    onChange?.(option.value)
    setOpen(false)
  }

  // Keep the highlighted option visible while arrowing through a long list.
  useEffect(() => {
    if (!open) return
    listRef.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: 'nearest' })
  }, [active, open])

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const last = options.length - 1
    const { key } = event

    // Type-ahead: jump to the next option starting with the typed letter.
    if (key.length === 1 && /\S/.test(key) && !event.metaKey && !event.ctrlKey) {
      const from = open ? active : selectedIndex
      const ordered = [...options.slice(from + 1), ...options.slice(0, from + 1)]
      const hit = ordered.find((option) => option.label.toLowerCase().startsWith(key.toLowerCase()))
      if (hit) {
        const index = options.indexOf(hit)
        if (open) setActive(index)
        else choose(index)
      }
      return
    }

    if (!open) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(key)) {
        event.preventDefault()
        openAt(selectedIndex >= 0 ? selectedIndex : 0)
      } else if (key === 'Home' || key === 'End') {
        event.preventDefault()
        openAt(key === 'Home' ? 0 : last)
      }
      return
    }

    switch (key) {
      case 'ArrowDown':
        event.preventDefault()
        setActive((index) => Math.min(last, index + 1))
        break
      case 'ArrowUp':
        event.preventDefault()
        if (event.altKey) choose(active)
        else setActive((index) => Math.max(0, index - 1))
        break
      case 'Home':
      case 'PageUp':
        event.preventDefault()
        setActive(0)
        break
      case 'End':
      case 'PageDown':
        event.preventDefault()
        setActive(last)
        break
      case 'Enter':
      case ' ':
        event.preventDefault()
        choose(active)
        break
      case 'Tab':
        choose(active)
        break
      case 'Escape':
        event.preventDefault()
        setOpen(false)
        break
    }
  }

  return (
    <div className={`relative ${className}`}>
      <span id={labelId} className={hideLabel ? 'sr-only' : 'label'}>
        {label}
      </span>
      <button
        id={buttonId}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-labelledby={`${labelId} ${buttonId}`}
        aria-activedescendant={open && options.length ? optionId(active) : undefined}
        onClick={() => (open ? setOpen(false) : openAt(selectedIndex >= 0 ? selectedIndex : 0))}
        onKeyDown={onKeyDown}
        onBlur={() => setOpen(false)}
        className={`field relative flex items-center gap-2.5 pr-10 text-left ${
          hideLabel ? '' : 'mt-1.5'
        } ${icon ? 'pl-10' : ''}`}
      >
        {icon && (
          <Icon
            name={icon}
            size={17}
            className={`absolute left-3.5 transition-colors ${open ? 'text-honey-800' : 'text-bark-400'}`}
          />
        )}
        {selected?.dot && (
          <span
            aria-hidden
            className="h-2.5 w-2.5 shrink-0 rounded-full"
            style={{ backgroundColor: selected.dot }}
          />
        )}
        <span className={`min-w-0 flex-1 truncate ${selected ? '' : 'text-bark-500'}`}>
          {selected?.label ?? placeholder}
        </span>
        <Icon
          name="chevronDown"
          size={16}
          className={`ease-arrive absolute right-3.5 text-bark-500 transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      {open && (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          aria-labelledby={labelId}
          tabIndex={-1}
          className="popover inset-x-0 max-h-72 overflow-y-auto overscroll-contain"
        >
          {options.length === 0 && (
            <li role="presentation" className="px-3 py-6 text-center text-sm text-bark-500">
              {emptyText}
            </li>
          )}
          {options.map((option, index) => {
            const isSelected = index === selectedIndex
            return (
              <li
                key={option.value}
                id={optionId(index)}
                role="option"
                data-index={index}
                aria-selected={isSelected}
                data-active={index === active}
                // Keep focus on the button so the menu doesn't close before the click lands.
                onMouseDown={(event) => event.preventDefault()}
                onMouseEnter={() => setActive(index)}
                onClick={() => choose(index)}
                className="option"
              >
                {option.dot && (
                  <span
                    aria-hidden
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: option.dot }}
                  />
                )}
                <span className="min-w-0 flex-1">
                  <span className="block truncate">{option.label}</span>
                  {option.hint && (
                    <span className="block truncate text-xs font-normal text-bark-500">
                      {option.hint}
                    </span>
                  )}
                </span>
                <Icon
                  name="check"
                  size={16}
                  className={`text-honey-800 transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0'}`}
                />
              </li>
            )
          })}
        </ul>
      )}

      {name && <input type="hidden" name={name} value={current} />}
      {hint && <span className="hint">{hint}</span>}
    </div>
  )
}
