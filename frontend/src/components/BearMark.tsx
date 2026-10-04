interface BearMarkProps {
  /** Rendered size in px. */
  size?: number
  /** `asleep` closes the eyes; used for empty and quiet states. */
  mood?: 'awake' | 'asleep'
  className?: string
  title?: string
}

/** The JobBear mark: a geometric bear head in bark with honey ears and muzzle. */
export default function BearMark({
  size = 32,
  mood = 'awake',
  className = '',
  title,
}: BearMarkProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={className}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
    >
      {title && <title>{title}</title>}
      <circle cx="15" cy="16" r="11" className="fill-bark" />
      <circle cx="49" cy="16" r="11" className="fill-bark" />
      <circle cx="15" cy="16" r="5" className="fill-honey" />
      <circle cx="49" cy="16" r="5" className="fill-honey" />
      <circle cx="32" cy="36" r="24" className="fill-bark" />
      <ellipse cx="32" cy="45" rx="11" ry="8.5" className="fill-honey" />
      <ellipse cx="32" cy="40.5" rx="4.2" ry="3" className="fill-bark" />
      {mood === 'awake' ? (
        <>
          <circle cx="23" cy="31" r="2.6" className="fill-birch" />
          <circle cx="41" cy="31" r="2.6" className="fill-birch" />
        </>
      ) : (
        <g className="stroke-birch" strokeWidth="2.4" strokeLinecap="round" fill="none">
          <path d="M19.5 31.5q3.5 2.6 7 0" />
          <path d="M37.5 31.5q3.5 2.6 7 0" />
        </g>
      )}
    </svg>
  )
}
