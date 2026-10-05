import { useEffect, useState, type ReactNode } from 'react'

interface CountUpProps {
  /** A pre-formatted value such as 48, "31%" or "6.5". Anything else renders as-is. */
  value: ReactNode
  duration?: number
  delay?: number
}

// Leading number, then any suffix ("%", " days").
const NUMBER = /^(\d+(?:\.\d+)?)(.*)$/

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Counts a headline number up from zero when it first appears. Purely presentational:
 * it animates whatever string it is given and lands on exactly that string.
 */
export default function CountUp({ value, duration = 900, delay = 0 }: CountUpProps) {
  const match =
    typeof value === 'string' || typeof value === 'number' ? NUMBER.exec(String(value)) : null
  const target = match ? Number(match[1]) : 0
  const decimals = match?.[1]?.split('.')[1]?.length ?? 0
  const suffix = match?.[2] ?? ''
  const [shown, setShown] = useState(() => (match && !prefersReducedMotion() ? 0 : target))

  const key = String(value)
  useEffect(() => {
    if (!match || prefersReducedMotion()) {
      setShown(target)
      return
    }
    let frame = 0
    let start = 0
    const tick = (now: number) => {
      if (!start) start = now + delay
      const t = Math.min(1, Math.max(0, (now - start) / duration))
      // Exponential ease-out: quick at first, settling onto the real number.
      setShown(t === 1 ? target : target * (1 - 2 ** (-10 * t)))
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    // Browsers throttle animation frames in background tabs; always land on the real value.
    const settle = window.setTimeout(() => setShown(target), delay + duration + 100)
    return () => {
      cancelAnimationFrame(frame)
      window.clearTimeout(settle)
    }
    // `match` and `target` are derived from `value`, so its string form is the real dependency.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, duration, delay])

  if (!match) return <>{value}</>
  return (
    <>
      <span aria-hidden>
        {shown.toFixed(decimals)}
        {suffix}
      </span>
      <span className="sr-only">{String(value)}</span>
    </>
  )
}
