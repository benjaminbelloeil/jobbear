// Authored stroke icons, one weight (1.75) on a 20px grid. Add paths here as needed.
const PATHS = {
  chevronLeft: 'M12.5 4.5 7 10l5.5 5.5',
  chevronRight: 'M7.5 4.5 13 10l-5.5 5.5',
  arrowRight: 'M4 10h12m-4.5-4.5L16 10l-4.5 4.5',
  plus: 'M10 4v12M4 10h12',
  refresh: 'M16 10a6 6 0 1 1-1.76-4.24M16 4v3.5h-3.5',
  mail: 'M3 5.5h14v9H3zM3.5 6l6.5 5 6.5-5',
  link: 'M8.5 11.5a3 3 0 0 0 4.24 0l2.5-2.5a3 3 0 0 0-4.24-4.24l-.75.75M11.5 8.5a3 3 0 0 0-4.24 0l-2.5 2.5a3 3 0 0 0 4.24 4.24l.75-.75',
  check: 'M4.5 10.5 8 14l7.5-8',
  x: 'M5.5 5.5l9 9m0-9-9 9',
  external: 'M11 4h5v5M16 4l-7 7M14 11.5V16H4V6h4.5',
  dashboard: 'M3.5 3.5h5.5v7H3.5zM11 3.5h5.5v4H11zM11 9.5h5.5v7H11zM3.5 12.5h5.5v4H3.5z',
  list: 'M7 5.5h9.5M7 10h9.5M7 14.5h9.5M3.5 5.5h.01M3.5 10h.01M3.5 14.5h.01',
  board: 'M3.5 3.5h3.5v13H3.5zM8.25 3.5h3.5v9h-3.5zM13 3.5h3.5v6H13z',
  inbox: 'M3 11.5h4l1.25 2.5h3.5L13 11.5h4M3 11.5 5 4.5h10l2 7v4H3z',
  settings:
    'M10 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM10 2.5v2M10 15.5v2M2.5 10h2M15.5 10h2M4.7 4.7l1.4 1.4M13.9 13.9l1.4 1.4M4.7 15.3l1.4-1.4M13.9 6.1l1.4-1.4',
  key: 'M12.5 7.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM11.6 9.6 17 15m-2.5-2.5L13 14m3-3-1.5 1.5',
  clock: 'M10 17a7 7 0 1 0 0-14 7 7 0 0 0 0 14ZM10 6.5V10l2.5 1.5',
  github:
    'M7.5 16.5c-3 1-3-1.5-4.5-2m9 3.5v-2.6a2.3 2.3 0 0 0-.6-1.7c2.1-.2 4.1-1 4.1-4.5a3.5 3.5 0 0 0-1-2.4 3.2 3.2 0 0 0 0-2.4s-.8-.2-2.5 1a8.7 8.7 0 0 0-4.6 0C5.7 4.2 4.9 4.4 4.9 4.4a3.2 3.2 0 0 0 0 2.4 3.5 3.5 0 0 0-1 2.4c0 3.5 2 4.3 4.1 4.5a2.3 2.3 0 0 0-.6 1.7V18',
  shield: 'M10 2.5 4 5v4.5c0 3.6 2.5 6.6 6 8 3.5-1.4 6-4.4 6-8V5z',
  logout: 'M8 4H4.5v12H8m3.5-9.5L15 10l-3.5 3.5M15 10H7.5',
} as const

export type IconName = keyof typeof PATHS

interface IconProps {
  name: IconName
  size?: number
  className?: string
  /** Pass a label only when the icon stands alone without visible text. */
  label?: string
}

export default function Icon({ name, size = 18, className = '', label }: IconProps) {
  return (
    <svg
      viewBox="0 0 20 20"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`shrink-0 ${className}`}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <path d={PATHS[name]} />
    </svg>
  )
}
