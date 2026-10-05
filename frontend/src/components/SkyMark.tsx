import { useId } from 'react'

import type { SkyPhase } from './skyPhase'

const LABELS: Record<SkyPhase, string> = {
  sunrise: 'Sunrise',
  day: 'Sun',
  sunset: 'Sunset',
  night: 'Moon',
}

// Rays on the upper half only, for a sun sitting on the horizon (angles in degrees).
const HALF_RAYS = [180, 225, 270, 315, 360]
const FULL_RAYS = [0, 45, 90, 135, 180, 225, 270, 315]

function ray(cx: number, cy: number, angle: number, from: number, to: number) {
  const r = (angle * Math.PI) / 180
  return {
    x1: cx + Math.cos(r) * from,
    y1: cy + Math.sin(r) * from,
    x2: cx + Math.cos(r) * to,
    y2: cy + Math.sin(r) * to,
  }
}

/** A four-point star centred on (x, y). */
const star = (x: number, y: number, s: number) =>
  `M${x} ${y - s}L${x + s * 0.3} ${y - s * 0.3}L${x + s} ${y}L${x + s * 0.3} ${y + s * 0.3}` +
  `L${x} ${y + s}L${x - s * 0.3} ${y + s * 0.3}L${x - s} ${y}L${x - s * 0.3} ${y - s * 0.3}Z`

const STARS = [
  { x: 37, y: 10, s: 3.2, delay: '0s' },
  { x: 42, y: 21, s: 2.2, delay: '0.9s' },
  { x: 9, y: 9, s: 2.4, delay: '1.7s' },
]

/**
 * A small drawn sky beside the greeting: the sun rising, the sun up, the sun setting, or
 * the moon with a few stars. Each arrives with one short motion (rise, set, fade in), then
 * keeps a slow idle loop. Reduced motion shows the still final frame (see .sky in index.css).
 */
export default function SkyMark({
  phase,
  size = 44,
  className = '',
}: {
  phase: SkyPhase
  size?: number
  className?: string
}) {
  const clip = useId()
  const setting = phase === 'sunset'
  const sunColor = setting ? '#C98A0E' : '#E9A825'

  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      role="img"
      aria-label={LABELS[phase]}
      className={`sky sky-${phase} shrink-0 overflow-visible ${className}`}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {phase === 'day' && (
        <g className="sky-body">
          <g className="sky-rays" stroke={sunColor} strokeWidth={2.5}>
            {FULL_RAYS.map((a) => (
              <line key={a} {...ray(24, 24, a, 13, 18.5)} />
            ))}
          </g>
          <circle cx={24} cy={24} r={8.5} fill={sunColor} />
          <circle cx={21.5} cy={21.5} r={2.5} fill="#FDF5E2" opacity={0.55} />
        </g>
      )}

      {(phase === 'sunrise' || phase === 'sunset') && (
        <>
          <defs>
            <clipPath id={clip}>
              <rect x={-4} y={-4} width={56} height={37} />
            </clipPath>
          </defs>
          <g clipPath={`url(#${clip})`}>
            <g className="sky-body">
              <g className="sky-rays" stroke={sunColor} strokeWidth={2.5}>
                {HALF_RAYS.map((a) => (
                  <line key={a} {...ray(24, 33, a, 14, 19.5)} />
                ))}
              </g>
              <circle cx={24} cy={33} r={10} fill={sunColor} />
            </g>
          </g>
          {/* The horizon, and an arrow saying which way the sun is going. */}
          <line x1={5} y1={33} x2={43} y2={33} stroke="#2A1F19" strokeWidth={2.5} />
          <path
            className="sky-arrow"
            d={setting ? 'M20 38.5l4 4 4-4' : 'M20 42.5l4-4 4 4'}
            stroke="#76695F"
            strokeWidth={2.25}
          />
        </>
      )}

      {phase === 'night' && (
        <g className="sky-body">
          <path
            className="sky-moon"
            d="M28 9a14 14 0 1 0 11.5 22A11.5 11.5 0 0 1 28 9Z"
            fill="#2A1F19"
          />
          {STARS.map((s) => (
            <path
              key={`${s.x}-${s.y}`}
              className="sky-star"
              style={{ animationDelay: s.delay }}
              d={star(s.x, s.y, s.s)}
              fill="#E9A825"
            />
          ))}
        </g>
      )}
    </svg>
  )
}
