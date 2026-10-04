import { Link } from 'react-router-dom'

import Icon from './Icon'

export interface NeedsYouItem {
  id: number
  applicationId: number
  action: string
  who: string
  what: string
  when: string
  tone: 'honey' | 'pine' | 'heather' | 'bark'
}

const TONE: Record<NeedsYouItem['tone'], string> = {
  honey: 'bg-honey',
  pine: 'bg-pine',
  heather: 'bg-heather',
  bark: 'bg-bark',
}

/** The short list of things to do next, soonest first. Each row opens its application. */
export default function NeedsYouList({ items }: { items: NeedsYouItem[] }) {
  return (
    <ol className="list-in -mx-2">
      {items.map((item, index) => (
        <li key={item.id} style={{ '--i': index } as React.CSSProperties}>
          <Link
            to={`/applications/${item.applicationId}`}
            className="group grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-1 rounded-control px-2 py-3 transition-colors duration-150 hover:bg-birch sm:grid-cols-[auto_1fr_auto]"
          >
            <span
              aria-hidden
              className={`row-span-2 h-full min-h-9 w-1.5 self-stretch rounded-full sm:row-span-1 sm:h-9 sm:self-center ${TONE[item.tone]}`}
            />
            <span className="min-w-0">
              <span className="block font-medium">{item.action}</span>
              <span className="block truncate text-sm text-bark-500">
                {item.who}, {item.what.charAt(0).toLowerCase() + item.what.slice(1)}
              </span>
            </span>
            <span className="flex items-center gap-2 whitespace-nowrap text-sm tabular-nums text-bark-700 sm:justify-end">
              {item.when}
              <Icon
                name="chevronRight"
                size={16}
                className="text-bark-500 transition-transform duration-150 group-hover:translate-x-0.5"
              />
            </span>
          </Link>
        </li>
      ))}
    </ol>
  )
}
