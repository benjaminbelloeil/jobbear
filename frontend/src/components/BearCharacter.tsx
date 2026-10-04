export type BearMood = 'idle' | 'reading' | 'sleeping' | 'waving'

interface BearCharacterProps {
  mood?: BearMood
  /** Rendered width in px; height follows the 200×220 artboard. */
  size?: number
  /** Pause the looping motion (blink, breathing, Z's) while off screen. */
  paused?: boolean
  className?: string
  title?: string
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
}: BearCharacterProps) {
  const asleep = mood === 'sleeping'
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
      {/* Body: breathes */}
      <g className="bear-body">
        <ellipse cx="100" cy="178" rx="60" ry="46" className="fill-bark" />
        <ellipse cx="100" cy="186" rx="34" ry="28" className="fill-bark-700" />
        {/* Left paw */}
        <ellipse cx="52" cy="186" rx="15" ry="19" className="fill-bark" />
        {/* Right arm: waves */}
        <g className="bear-arm">
          <ellipse cx="148" cy="186" rx="15" ry="19" className="fill-bark" />
          <ellipse cx="148" cy="194" rx="7" ry="6" className="fill-honey" />
        </g>
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
        <ellipse cx="100" cy="96" rx="9" ry="6.5" className="fill-bark" />
        <path
          d="M100 103v5m-7 3q7 5 14 0"
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
          <g className="bear-eyes">
            <circle cx="78" cy="76" r="6.5" className="fill-birch" />
            <circle cx="122" cy="76" r="6.5" className="fill-birch" />
            <g className="bear-pupils">
              <circle cx="79" cy="77" r="3" className="fill-bark" />
              <circle cx="123" cy="77" r="3" className="fill-bark" />
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
          <ellipse cx="62" cy="176" rx="12" ry="14" className="fill-bark" />
          <ellipse cx="138" cy="176" rx="12" ry="14" className="fill-bark" />
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
    </svg>
  )
}
