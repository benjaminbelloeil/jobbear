import { useId } from 'react'

export type BearMood = 'idle' | 'reading' | 'sleeping' | 'waving'

interface BearCharacterProps {
  mood?: BearMood
  /** Rendered width in px; height follows the 200×220 artboard. */
  size?: number
  /** Pause the looping motion (blink, breathing, Z's) while off screen. */
  paused?: boolean
  className?: string
  title?: string
  /** Trace a birch rim around the bear so it reads on a bark background. */
  outlined?: boolean
}

/**
 * The JobBear mascot, drawn in the same geometry as BearMark: bark fur, honey ears and
 * muzzle. Motion lives in index.css (.bear-*). With reduced motion it stands still.
 */
export default function BearCharacter({
  mood = 'idle',
  size = 200,
  paused = false,
  className = '',
  title,
  outlined = false,
}: BearCharacterProps) {
  const asleep = mood === 'sleeping'
  const rimId = useId()
  return (
    <svg
      viewBox="0 0 200 220"
      width={size}
      height={(size * 220) / 200}
      className={`bear bear-${mood} ${paused ? 'bear-paused' : ''} overflow-visible ${className}`}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {outlined && (
        <defs>
          {/* Grow the silhouette by a few units, paint it birch, and lay the bear on top */}
          <filter id={rimId} x="-15%" y="-15%" width="130%" height="130%">
            <feMorphology in="SourceAlpha" operator="dilate" radius="5" result="grown" />
            <feFlood className="bear-rim" />
            <feComposite in2="grown" operator="in" result="rim" />
            <feMerge>
              <feMergeNode in="rim" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      )}
      <g filter={outlined ? `url(#${rimId})` : undefined}>
        {/* Body: breathes */}
        <g className="bear-body">
          <ellipse cx="100" cy="178" rx="60" ry="46" className="fill-bark" />
          <ellipse cx="100" cy="186" rx="34" ry="28" className="fill-bark-700" />
          {/* Arms are capsules hinged at the shoulder. Reading holds the envelope instead. */}
          {mood !== 'reading' && (
            <g className="stroke-bark" strokeWidth="26" strokeLinecap="round">
              <path d="M60 152L48 190" />
              <path d="M140 152L152 190" className="bear-arm" />
            </g>
          )}
        </g>

        {/* Head */}
        <g className="bear-head">
          <g className="bear-ear-left">
            <circle cx="58" cy="44" r="22" className="fill-bark" />
            <circle cx="58" cy="44" r="10" className="fill-honey" />
          </g>
          <g className="bear-ear-right">
            <circle cx="142" cy="44" r="22" className="fill-bark" />
            <circle cx="142" cy="44" r="10" className="fill-honey" />
          </g>
          <circle cx="100" cy="84" r="54" className="fill-bark" />
          <ellipse cx="100" cy="106" rx="26" ry="20" className="fill-honey" />
          <ellipse cx="100" cy="97" rx="8.5" ry="6" className="fill-bark" />
          <path
            d="M100 102v4M91 107q9 8 18 0"
            className="stroke-bark"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />

          {asleep ? (
            <g className="stroke-birch" strokeWidth="4" strokeLinecap="round" fill="none">
              <path d="M70 78q8 6 16 0" />
              <path d="M114 78q8 6 16 0" />
            </g>
          ) : (
            // Solid dot eyes, as in BearMark: calm and friendly (pupils in a ring read as a stare).
            // The blink animates `transform`, so the reading glance lives on a wrapper.
            <g transform={mood === 'reading' ? 'translate(0 2)' : undefined}>
              <g className="bear-eyes">
                <ellipse cx="78" cy="77" rx="5.5" ry="6.5" className="fill-birch-50" />
                <ellipse cx="122" cy="77" rx="5.5" ry="6.5" className="fill-birch-50" />
              </g>
            </g>
          )}
        </g>

        {/* Reading: an envelope held in both paws */}
        {mood === 'reading' && (
          <g className="bear-envelope">
            <rect x="66" y="150" width="68" height="46" rx="6" className="fill-birch-50" />
            <path
              d="M68 153l32 22 32-22"
              className="stroke-birch-300"
              strokeWidth="3"
              fill="none"
              strokeLinejoin="round"
            />
            <circle cx="100" cy="176" r="6" className="fill-honey" />
            <ellipse cx="64" cy="178" rx="12" ry="14" className="fill-bark" />
            <ellipse cx="136" cy="178" rx="12" ry="14" className="fill-bark" />
          </g>
        )}

        {/* Sleeping: Z's drift up */}
        {asleep && (
          <g className="fill-honey font-display" fontWeight="800">
            <text x="150" y="40" fontSize="22" className="bear-z" style={{ animationDelay: '0s' }}>
              z
            </text>
            <text x="164" y="22" fontSize="16" className="bear-z" style={{ animationDelay: '1s' }}>
              z
            </text>
            <text x="176" y="8" fontSize="12" className="bear-z" style={{ animationDelay: '2s' }}>
              z
            </text>
          </g>
        )}
      </g>
    </svg>
  )
}
