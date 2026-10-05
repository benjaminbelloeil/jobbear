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
          {/* Grow the silhouette by ~5 units, paint it birch, and lay the bear on top.
              Growing = blur the shape's alpha, then cut it off at a low threshold. Unlike
              feMorphology (a square brush, which gave the ears boxy corners) this grows
              evenly in every direction, so round shapes keep a round rim.
              The region is fixed in artboard units with room on every side, so the waving
              arm and the ears never reach its edge. */}
          <filter id={rimId} filterUnits="userSpaceOnUse" x="-60" y="-60" width="320" height="340">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="soft" />
            <feComponentTransfer in="soft" result="grown">
              <feFuncA type="linear" slope="30" intercept="-0.9" />
            </feComponentTransfer>
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
          {/* Arms hang down the bear's sides and follow the curve of its body. Every point
              stays inside the body's outline (checked against the ellipse at each height),
              so nothing pokes out of the silhouette. A faint lighter edge on the inner side
              gives each arm its shape; honey toe pads mark the paws. The right arm hinges at
              its shoulder to wave. Reading holds the envelope instead. */}
          {mood !== 'reading' && (
            <g fill="none" strokeLinecap="round">
              <Arm d="M66 156Q53 176 67 199" x={67} nudge={-1} />
              {/* The waving arm: curved at rest, straight while it's raised. Both share the
                  shoulder hinge; index.css cross-fades them in step with the wave. */}
              <g className="bear-arm">
                <g className="bear-arm-rest">
                  <Arm d="M134 156Q147 176 133 199" x={133} nudge={1} />
                </g>
                <g className="bear-arm-raised">
                  <Arm d="M134 156L134 199" x={134} nudge={0} />
                </g>
              </g>
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

/** One arm: a soft lighter edge, the bark limb, and honey toe pads at the paw end. */
function Arm({ d, x, nudge }: { d: string; x: number; nudge: number }) {
  return (
    <>
      <path d={d} className="stroke-bark-700" strokeWidth="25" opacity="0.55" />
      <path d={d} className="stroke-bark" strokeWidth="23" transform={`translate(${nudge} 0)`} />
      {[-5.5, 0, 5.5].map((dx) => (
        <ellipse
          key={dx}
          cx={x + dx}
          cy={dx === 0 ? 204 : 202.5}
          rx="2.6"
          ry="2.2"
          className="fill-honey/80"
        />
      ))}
    </>
  )
}
