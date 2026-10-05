import { useEffect, useState } from 'react'

import { useInView } from '../../hooks/useInView'
import BearCharacter from '../BearCharacter'

/** Asleep until it scrolls into view, then wakes and waves. Loops pause off screen. */
export default function WakeUpBear({ size = 220 }: { size?: number }) {
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.6 })
  const [awake, setAwake] = useState(false)

  useEffect(() => {
    if (!inView || awake) return
    const timer = window.setTimeout(() => setAwake(true), 500)
    return () => window.clearTimeout(timer)
  }, [inView, awake])

  return (
    <div ref={ref} className="inline-block">
      <BearCharacter
        mood={awake ? 'waving' : 'sleeping'}
        size={size}
        paused={!inView}
        title={awake ? 'The JobBear bear waving hello' : 'The JobBear bear, asleep'}
      />
    </div>
  )
}
