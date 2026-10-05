import { Link } from 'react-router-dom'

import Icon, { type IconName } from './Icon'
import { TONE_TILE } from './statusStyles'

export interface NeedsYouItem {
  id: number
  applicationId: number
  action: string
  who: string
  what: string
  when: string
  tone: 'honey' | 'pine' | 'heather' | 'bark'
}

// Each tone is a kind of task: honey = a scheduled interview, heather = an assessment,
// pine = a decision, bark = a nudge you send.
const TONE_ICON: Record<NeedsYouItem['tone'], IconName> = {
  honey: 'calendar',
  heather: 'code',
  pine: 'flag',
  bark: 'send',
}

/** The short list of things to do next, soonest first. Each row opens its application. */
export default function NeedsYouList({ items }: { items: NeedsYouItem[] }) {
  return (
    <ol className="list-in -mx-2 space-y-1">
      {items.map((item, index) => {
        const today = item.when.toLowerCase() === 'today'
        const pill = today ? 'bg-honey text-bark' : 'bg-birch-200/70 text-bark-700'
        return (
          <li key={item.id} style={{ '--i': index } as React.CSSProperties}>
            <Link
              to={`/applications/${item.applicationId}`}
              className="group flex items-center gap-3.5 rounded-control px-2 py-2.5 transition-colors duration-150 hover:bg-white"
            >
              <span
                className={`icon-tile ease-arrive transition-transform duration-200 group-hover:scale-105 ${TONE_TILE[item.tone]}`}
              >
                <Icon name={TONE_ICON[item.tone]} size={17} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-medium">{item.action}</span>
                <span className="block truncate text-sm text-bark-500">
                  {item.who}, {item.what.charAt(0).toLowerCase() + item.what.slice(1)}
                </span>
                {/* Small screens: the date sits under the text instead of beside it. */}
                <span
                  className={`mt-1.5 inline-block rounded-full px-2 py-0.5 text-xs font-medium tabular-nums sm:hidden ${pill}`}
                >
                  {item.when}
                </span>
              </span>
              <span
                className={`hidden whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium tabular-nums sm:inline-block ${pill}`}
              >
                {item.when}
              </span>
              <Icon
                name="chevronRight"
                size={16}
                className="ease-arrive text-bark-400 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-bark"
              />
            </Link>
          </li>
        )
      })}
    </ol>
  )
}
