import type { CSSProperties } from 'react'

import BearMark from './BearMark'

/**
 * Shown while a page's code loads: the bear bobs over three honey dots. Full screen by
 * default; `inline` fills the content area inside the app shell instead.
 */
export default function PageLoader({ inline = false }: { inline?: boolean }) {
  return (
    <div
      className={`grid place-items-center ${inline ? 'min-h-[60vh]' : 'min-h-screen bg-birch'}`}
      role="status"
    >
      <div className="flex flex-col items-center gap-5">
        <span className="loader-bob grid h-20 w-20 place-items-center rounded-full bg-birch-50 shadow-[0_18px_36px_-18px_rgba(42,31,25,0.45)] ring-1 ring-birch-200">
          <BearMark size={52} />
        </span>
        <span aria-hidden className="flex gap-1.5">
          {[0, 150, 300].map((ms) => (
            <span
              key={ms}
              className="loader-dot h-2 w-2 rounded-full bg-honey"
              style={{ '--d': `${ms}ms` } as CSSProperties}
            />
          ))}
        </span>
        <span className="sr-only">Loading JobBear…</span>
      </div>
    </div>
  )
}
