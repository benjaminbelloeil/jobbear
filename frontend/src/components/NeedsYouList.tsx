import { Link } from 'react-router-dom'

import Icon, { type IconName } from './Icon'

export interface NeedsYouItem {
  id: number
  applicationId: number
  action: string
  who: string
  what: string
  when: string
  tone: 'honey' | 'pine' | 'heather' | 'bark'
}

// Each tone is a kind of task, shown by its icon: honey = a scheduled interview,
// heather = an assessment, pine = a decision, bark = a nudge you send.
const TONE_ICON: Record<NeedsYouItem['tone'], IconName> = {
  honey: 'calendar',
  heather: 'code',
  pine: 'flag',
  bark: 'send',
}

function Row({ item, index }: { item: NeedsYouItem; index: number }) {
  const today = isToday(item)
  const pill = today ? 'bg-honey text-bark' : 'bg-birch-200/70 text-bark-700'
  return (
    <li style={{ '--i': index } as React.CSSProperties}>
      <Link
        to={`/applications/${item.applicationId}`}
        className={`group flex items-center gap-3.5 rounded-control px-2 py-2.5 transition-colors duration-150 ${
          today ? 'hover:bg-honey-50' : 'hover:bg-white'
        }`}
      >
        <span
          className={`icon-tile ease-arrive transition-transform duration-200 group-hover:scale-105 ${
            today ? 'bg-honey text-bark ring-honey-600/40' : ''
          }`}
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
}

const isToday = (item: NeedsYouItem) => item.when.toLowerCase() === 'today'

/**
 * The short list of things to do next. Anything due today sits on top in its own honey
 * block, so the most urgent task is the first thing you see; the rest follow, soonest first.
 */
export default function NeedsYouList({ items }: { items: NeedsYouItem[] }) {
  const today = items.filter(isToday)
  const later = items.filter((item) => !isToday(item))

  return (
    <div className="space-y-4">
      {today.length > 0 && (
        <section
          aria-labelledby="needs-today"
          className="rounded-control bg-honey-50/70 p-2 ring-1 ring-inset ring-honey/40"
        >
          <h3
            id="needs-today"
            className="flex items-center gap-2 px-2 pb-1 pt-1 text-xs font-semibold text-honey-800"
          >
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-honey-600" />
            Today
          </h3>
          <ol className="list-in space-y-1">
            {today.map((item, index) => (
              <Row key={item.id} item={item} index={index} />
            ))}
          </ol>
        </section>
      )}
      {later.length > 0 && (
        <section aria-labelledby="needs-later">
          <h3 id="needs-later" className="px-0 text-xs font-semibold text-bark-500">
            Later this week
          </h3>
          <ol className="list-in -mx-2 mt-1 space-y-1">
            {later.map((item, index) => (
              <Row key={item.id} item={item} index={today.length + index} />
            ))}
          </ol>
        </section>
      )}
    </div>
  )
}
