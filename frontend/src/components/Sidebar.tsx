import { Link, NavLink } from 'react-router-dom'

import BearMark from './BearMark'
import Icon, { type IconName } from './Icon'

interface NavItem {
  to: string
  label: string
  icon: IconName
  /** Optional count shown as a badge, e.g. emails waiting for review. */
  count?: number
}

interface SidebarProps {
  items: NavItem[]
  onLogout?: () => void
}

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `group relative flex items-center gap-3 rounded-control px-3 py-2 text-sm transition-colors duration-150 ${
    isActive
      ? 'bg-birch/10 font-medium text-birch-50'
      : 'text-birch-300 hover:bg-birch/5 hover:text-birch-50'
  }`

/** Desktop: a fixed bark sidebar. Mobile: a bark top bar with a scrollable nav row. */
export default function Sidebar({ items, onLogout }: SidebarProps) {
  return (
    <>
      {/* Desktop */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col bg-bark px-4 py-6 lg:flex">
        <Link
          to="/"
          aria-label="JobBear home"
          className="mb-8 flex items-center gap-2.5 rounded-control px-2 font-display text-xl font-bold tracking-tight text-birch-50"
        >
          <span className="grid h-10 w-10 place-items-center rounded-full bg-birch">
            <BearMark size={30} />
          </span>
          <span aria-hidden>JobBear</span>
        </Link>

        <Link to="/applications/new" className="btn-honey mb-6 w-full">
          <Icon name="plus" size={16} />
          New application
        </Link>

        <nav aria-label="Main" className="flex-1">
          <ul className="space-y-1">
            {items.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} className={linkClass}>
                  {({ isActive }) => (
                    <>
                      <span
                        aria-hidden
                        className={`ease-arrive absolute -left-4 top-1.5 h-[calc(100%-12px)] w-1 rounded-r-full bg-honey transition-transform duration-200 ${
                          isActive ? 'scale-y-100' : 'scale-y-0'
                        }`}
                      />
                      <Icon name={item.icon} size={18} />
                      {item.label}
                      {item.count ? (
                        <span className="ml-auto rounded-full bg-honey px-2 py-0.5 text-xs font-semibold tabular-nums text-bark">
                          {item.count}
                          <span className="sr-only"> waiting</span>
                        </span>
                      ) : null}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-3 border-t border-birch/10 pt-4">
          <p className="px-3 text-xs leading-relaxed text-birch-300">
            Self-hosted. Your data and your AI keys stay on your server.
          </p>
          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              className="flex w-full items-center gap-3 rounded-control px-3 py-2 text-sm text-birch-300 transition-colors hover:bg-birch/5 hover:text-birch-50"
            >
              <Icon name="logout" size={18} />
              Log out
            </button>
          )}
        </div>
      </aside>

      {/* Mobile */}
      <header className="sticky top-0 z-30 bg-bark text-birch-50 lg:hidden">
        <div className="flex h-14 items-center gap-3 px-4">
          <Link to="/" aria-label="JobBear home" className="rounded-full bg-birch p-1">
            <BearMark size={26} />
          </Link>
          <Link to="/applications/new" className="btn-honey ml-auto px-3 py-1.5">
            <Icon name="plus" size={16} />
            New
          </Link>
          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              aria-label="Log out"
              className="rounded-control p-2 text-birch-300 hover:text-birch-50"
            >
              <Icon name="logout" size={18} />
            </button>
          )}
        </div>
        <nav aria-label="Main" className="overflow-x-auto px-2 pb-2">
          <ul className="flex gap-1">
            {items.map((item) => (
              <li key={item.to} className="shrink-0">
                <NavLink to={item.to} className={linkClass}>
                  <Icon name={item.icon} size={16} />
                  {item.label}
                  {item.count ? (
                    <span className="rounded-full bg-honey px-1.5 text-xs font-semibold text-bark">
                      {item.count}
                      <span className="sr-only"> waiting</span>
                    </span>
                  ) : null}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </header>
    </>
  )
}
