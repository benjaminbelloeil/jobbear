import Icon, { type IconName } from './Icon'
import type { SampleEmailLink } from '../sample/data'

const KIND_ICON: Record<SampleEmailLink['kind'], IconName> = {
  ASSESSMENT: 'code',
  SCHEDULING: 'calendar',
  POSTING: 'briefcase',
  OTHER: 'link',
}

const shortDate = new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' })

/** Links come from email bodies, so only plain web links are ever made clickable. */
const isWebLink = (url: string) => {
  try {
    return ['http:', 'https:'].includes(new URL(url).protocol)
  } catch {
    return false
  }
}

const host = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

/** Links found in recruiter emails (assessments, booking pages, guides), newest first. */
export default function EmailLinks({ links }: { links: SampleEmailLink[] }) {
  return (
    <ul className="-mx-2 space-y-1">
      {links
        .filter((link) => isWebLink(link.url))
        .map((link) => (
          <li key={link.id}>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 rounded-control px-2 py-2.5 transition-colors duration-150 hover:bg-white"
            >
              <span className="icon-tile">
                <Icon name={KIND_ICON[link.kind]} size={17} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-medium">{link.label}</span>
                <span className="block truncate text-sm text-bark-500">
                  {host(link.url)}, {shortDate.format(new Date(link.found_at))}
                </span>
              </span>
              <Icon
                name="external"
                size={15}
                className="text-bark-500 transition-colors group-hover:text-bark"
              />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </li>
        ))}
    </ul>
  )
}
