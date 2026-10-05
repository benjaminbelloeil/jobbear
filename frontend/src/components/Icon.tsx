// Authored stroke icons, one weight (1.75) on a 20px grid. Add paths here as needed.
const PATHS = {
  chevronLeft: 'M12.5 4.5 7 10l5.5 5.5',
  chevronRight: 'M7.5 4.5 13 10l-5.5 5.5',
  chevronDown: 'M5 7.5 10 13l5-5.5',
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
  briefcase: 'M3.5 7h13v9.5h-13zM7.5 7V4.5h5V7M3.5 11.5h13',
  pin: 'M10 17.5s5.5-4.9 5.5-9a5.5 5.5 0 0 0-11 0c0 4.1 5.5 9 5.5 9ZM10 10.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z',
  building: 'M4.5 17V3.5h7.5V17M12 8h3.5V17M3 17h14M7 6.5h2.5M7 9.5h2.5M7 12.5h2.5',
  note: 'M5 3.5h10v13H5zM7.5 7h5M7.5 10h5M7.5 13h3',
  file: 'M5.5 2.5h6l3.5 3.5v11.5h-9.5zM11.5 2.5V6H15M8 10h5M8 13h5',
  calendar: 'M4 5.5h12v11H4zM4 9h12M7.5 3.5v3M12.5 3.5v3',
  code: 'M7.5 6 3.5 10l4 4M12.5 6l4 4-4 4',
  flag: 'M5 17V3.5M5 4h9.5l-2 3.25 2 3.25H5',
  send: 'M16.5 3.5 8.75 11.25M16.5 3.5l-4.75 13-3-5.25-5.25-3z',
  sparkle: 'M10 2.5l1.6 5.9 5.9 1.6-5.9 1.6L10 17.5l-1.6-5.9L2.5 10l5.9-1.6z',
  chart: 'M3.5 16.5h13M6 13.5v-4M10 13.5v-8M14 13.5v-6',
  funnel: 'M3.5 4h13l-5 6v5.5l-3 1.5V10z',
  hourglass: 'M5.5 3h9M5.5 17h9M6.5 3c0 4 7 4 7 7s-7 3-7 7M13.5 3c0 4-7 4-7 7s7 3 7 7',
  pie: 'M10 3a7 7 0 1 0 7 7h-7zM12.5 2.75a6 6 0 0 1 4.75 4.75H12.5z',
  globe:
    'M10 17a7 7 0 1 0 0-14 7 7 0 0 0 0 14ZM3 10h14M10 3c2 2.2 2.8 4.6 2.8 7S12 14.8 10 17c-2-2.2-2.8-4.6-2.8-7S8 5.2 10 3Z',
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
