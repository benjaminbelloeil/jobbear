import { useEffect, useRef, useState } from 'react'

interface InViewOptions {
  /** Margin around the viewport, e.g. '-40% 0px -40% 0px' for "near the middle". */
  rootMargin?: string
  threshold?: number
  /** Stop observing after the first time it comes into view. */
  once?: boolean
}

/**
 * True while the element is in view. Without IntersectionObserver it reports `true`, so
 * nothing stays hidden or paused when the API is missing.
 */
export function useInView<T extends Element>({
  rootMargin = '0px',
  threshold = 0.2,
  once = false,
}: InViewOptions = {}) {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(() => typeof IntersectionObserver === 'undefined')

  useEffect(() => {
    const node = ref.current
    if (!node || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return
        setInView(entry.isIntersecting)
        if (entry.isIntersecting && once) observer.disconnect()
      },
      { rootMargin, threshold },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [rootMargin, threshold, once])

  return [ref, inView] as const
}
