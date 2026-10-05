import { useEffect, useLayoutEffect, useRef, type TextareaHTMLAttributes } from 'react'

interface AutoTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Height before anything is typed. It grows from here, so nobody has to drag a corner. */
  minRows?: number
}

/** A textarea that grows with its content instead of scrolling inside a fixed box. */
export default function AutoTextarea({
  minRows = 3,
  className = '',
  onInput,
  ...props
}: AutoTextareaProps) {
  const ref = useRef<HTMLTextAreaElement>(null)

  const fit = () => {
    const el = ref.current
    if (!el) return
    el.style.height = 'auto'
    // + the 1px top and bottom borders, which scrollHeight leaves out.
    el.style.height = `${el.scrollHeight + 2}px`
  }

  // Fit on mount (default text) and whenever a controlled value changes from outside.
  useLayoutEffect(fit, [props.value, props.defaultValue])

  // A narrower window wraps the text onto more lines, so refit when it resizes.
  useEffect(() => {
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [])

  return (
    <textarea
      ref={ref}
      rows={minRows}
      onInput={(event) => {
        fit()
        onInput?.(event)
      }}
      className={`resize-none overflow-hidden ${className}`}
      {...props}
    />
  )
}
