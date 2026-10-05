import { useSyncExternalStore } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

function subscribe(onChange: () => void) {
  if (typeof window.matchMedia !== 'function') return () => {}
  const query = window.matchMedia(QUERY)
  query.addEventListener('change', onChange)
  return () => query.removeEventListener('change', onChange)
}

const getSnapshot = () =>
  typeof window.matchMedia === 'function' && window.matchMedia(QUERY).matches

/**
 * True when the visitor asked the OS for less motion. Subscribes to the media query with
 * useSyncExternalStore, so it updates live and never sets state inside an effect.
 */
export function usePrefersReducedMotion() {
  return useSyncExternalStore(subscribe, getSnapshot, () => false)
}
