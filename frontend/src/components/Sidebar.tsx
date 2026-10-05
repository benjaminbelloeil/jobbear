import { useLayoutEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'

import BearMark from './BearMark'
import Icon, { type IconName } from './Icon'

interface NavItem {
  to: string
  label: string
  icon: IconName
  /** Optional count shown as a badge, e.g. emails waiting for review. */
  count?: number
  /** On phones, show this as an icon in the top bar instead of a bottom tab. */
  mobileTopBar?: boolean
}

interface SidebarProps {
  items: NavItem[]
  onLogout?: () => void
  /** This week's applications against the weekly goal, shown at the foot of the sidebar. */
  weekly?: { done: number; goal: number }
}

/** The brand lock-up. Inside the app it always leads to the dashboard, never the website. */
function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link
      to="/dashboard"
      aria-label="JobBear dashboard"
      className="group flex items-center gap-2.5 rounded-control font-display font-bold tracking-tight text-birch-50"
    >
      <span
        className={`ease-arrive grid place-items-center rounded-full bg-birch transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105 ${
          compact ? 'h-9 w-9' : 'h-10 w-10'
        }`}
      >
        <BearMark size={compact ? 26 : 30} />
      </span>
      <span aria-hidden className={compact ? 'text-lg' : 'text-xl'}>
        JobBear
      </span>
      <span
        aria-hidden
        className="rounded-full border border-honey/40 px-1.5 py-px font-sans text-[0.625rem] font-semibold uppercase tracking-wider text-honey"
      >
        App
      </span>
    </Link>
  )
}

function CountBadge({ count, className = '' }: { count: number; className?: string }) {
  return (
    <span
      className={`rounded-full bg-honey px-1.5 text-[0.6875rem] font-bold tabular-nums leading-[1.125rem] text-bark ${className}`}
    >
      {count}
      <span className="sr-only"> waiting</span>
    </span>
  )
}

const footerLink =
  'group flex w-full items-center gap-3 rounded-control px-2 py-1.5 text-sm text-birch-300 transition-colors hover:bg-birch/5 hover:text-birch-50'
const topBarButton =
  'grid h-10 w-10 place-items-center rounded-control text-birch-300 transition-colors hover:bg-birch/5 hover:text-birch-50'

/**
 * Desktop: a fixed bark sidebar with a highlight that glides to the current page.
 * Mobile: a slim top bar and a bottom tab bar with the "New" action raised in the middle.
 */
export default function Sidebar({ items, onLogout, weekly }: SidebarProps) {
  const { pathname } = useLocation()
  const listRef = useRef<HTMLUListElement>(null)
  const [pill, setPill] = useState<{ top: number; height: number } | null>(null)
  const [glide, setGlide] = useState(false)

  // Measure the active link so the highlight can slide to it rather than jump.
  useLayoutEffect(() => {
    const measure = () => {
      const active = listRef.current?.querySelector<HTMLElement>('a[aria-current="page"]')
      setPill(active ? { top: active.offsetTop, height: active.offsetHeight } : null)
    }
    measure()
    // Turn the transition on only after the first placement, so it doesn't slide in from 0.
    const frame = requestAnimationFrame(() => setGlide(true))
    window.addEventListener('resize', measure)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', measure)
    }
  }, [pathname])

  const progress = weekly ? Math.min(1, weekly.done / Math.max(1, weekly.goal)) : 0
  const remaining = weekly ? Math.max(0, weekly.goal - weekly.done) : 0
  // Mobile tab bar: two tabs, the raised "New" button, then the rest. Rarely used pages
  // (settings) sit in the top bar instead, so the tab bar keeps four thumb-sized tabs.
  const tabs = items.filter((item) => !item.mobileTopBar)
  const topBarItems = items.filter((item) => item.mobileTopBar)
  const leading = tabs.slice(0, 2)
  const trailing = tabs.slice(2)

  return (
    <>
      {/* Desktop */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col overflow-y-auto bg-bark px-3 py-6 lg:flex">
        {/* A low honey glow behind the brand, like light through the trees. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-[radial-gradient(120%_80%_at_0%_0%,rgb(233_168_37/0.12),transparent_70%)]"
        />

        <div className="relative px-2">
          <Brand />
        </div>

        <Link to="/applications/new" className="btn-honey relative mt-7 w-full py-2.5">
          <Icon name="plus" size={16} />
          New application
        </Link>

        <nav aria-label="Main" className="relative mt-7 flex-1">
          <p className="mb-2 px-3 text-[0.6875rem] font-semibold uppercase tracking-wider text-birch-300/70">
            Workspace
          </p>
          <div className="relative">
            {pill && (
              <div
                aria-hidden
                className={`pointer-events-none absolute inset-x-0 top-0 rounded-control bg-birch/10 ${
                  glide ? 'ease-arrive transition-[transform,height] duration-300' : ''
                }`}
                style={{ transform: `translateY(${pill.top}px)`, height: pill.height }}
              >
                <span className="absolute -left-3 bottom-2 top-2 w-1 rounded-r-full bg-honey" />
              </div>
            )}
            <ul ref={listRef} className="relative space-y-0.5">
              {items.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `group flex items-center gap-3 rounded-control px-2 py-1.5 text-sm transition-colors duration-150 ${
                        isActive
                          ? 'font-semibold text-birch-50'
                          : 'text-birch-300 hover:bg-birch/5 hover:text-birch-50'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <span
                          className={`ease-arrive grid h-8 w-8 place-items-center rounded-lg transition duration-200 ${
                            isActive
                              ? 'bg-honey text-bark shadow-[0_4px_12px_-4px_rgb(233_168_37/0.6)]'
                              : 'bg-birch/5 group-hover:-translate-y-px group-hover:bg-birch/10'
                          }`}
                        >
                          <Icon name={item.icon} size={17} />
                        </span>
                        {item.label}
                        {item.count ? <CountBadge count={item.count} className="ml-auto" /> : null}
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {weekly && (
          <section
            aria-label="Weekly goal"
            className="relative mt-6 rounded-panel bg-birch/[0.06] p-4 ring-1 ring-inset ring-birch/10"
          >
            <div className="flex items-baseline justify-between">
              <p className="text-xs font-medium text-birch-300">This week</p>
              <p className="font-display text-lg font-bold tabular-nums text-birch-50">
                {weekly.done}
                <span className="text-sm font-medium text-birch-300"> / {weekly.goal}</span>
              </p>
            </div>
            <div
              role="meter"
              aria-label="Applications this week"
              aria-valuemin={0}
              aria-valuemax={weekly.goal}
              aria-valuenow={weekly.done}
              className="mt-2 h-2 overflow-hidden rounded-full bg-birch/10"
            >
              <div
                className="fill-in h-full rounded-full bg-gradient-to-r from-honey-600 to-honey"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-birch-300">
              {remaining === 0 ? (
                <span className="font-semibold text-honey">Goal hit. Nice work.</span>
              ) : (
                <>
                  <span className="font-semibold text-birch-50">{remaining} more</span> to hit your
                  goal
                </>
              )}
            </p>
          </section>
        )}

        <div className="relative mt-4 space-y-0.5 border-t border-birch/10 pt-4">
          <Link to="/" className={footerLink}>
            <span className="grid h-8 w-8 place-items-center">
              <Icon name="globe" size={17} />
            </span>
            JobBear website
            <Icon
              name="external"
              size={14}
              className="ml-auto opacity-0 transition-opacity group-hover:opacity-100"
            />
          </Link>
          {onLogout && (
            <button type="button" onClick={onLogout} className={footerLink}>
              <span className="grid h-8 w-8 place-items-center">
                <Icon name="logout" size={17} />
              </span>
              Log out
            </button>
          )}
        </div>
      </aside>

      {/* Mobile: top bar */}
      <header className="sticky top-0 z-30 border-b border-birch/10 bg-bark/95 text-birch-50 backdrop-blur-md lg:hidden">
        <div className="flex h-14 items-center gap-1 px-4">
          <Brand compact />
          {topBarItems.map((item, index) => (
            <NavLink
              key={item.to}
              to={item.to}
              aria-label={item.label}
              className={({ isActive }) =>
                [
                  index === 0 && 'ml-auto',
                  isActive ? topBarButton.replace('text-birch-300', 'text-honey') : topBarButton,
                ]
                  .filter(Boolean)
                  .join(' ')
              }
            >
              <Icon name={item.icon} size={19} />
            </NavLink>
          ))}
          <Link
            to="/"
            aria-label="JobBear website"
            className={[topBarItems.length === 0 && 'ml-auto', topBarButton]
              .filter(Boolean)
              .join(' ')}
          >
            <Icon name="globe" size={19} />
          </Link>
          {onLogout && (
            <button type="button" onClick={onLogout} aria-label="Log out" className={topBarButton}>
              <Icon name="logout" size={19} />
            </button>
          )}
        </div>
      </header>

      {/* Mobile: bottom tab bar, thumb-reachable, with "New" raised in the middle. */}
      <nav
        aria-label="Main"
        className="fixed inset-x-0 bottom-0 z-30 border-t border-birch/10 bg-bark/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden"
      >
        <ul className="mx-auto grid max-w-md grid-cols-5 items-end px-2">
          {leading.map((item) => (
            <TabItem key={item.to} item={item} />
          ))}
          <li className="flex justify-center">
            <Link
              to="/applications/new"
              aria-label="New application"
              className="ease-arrive -mt-5 mb-2 grid h-14 w-14 place-items-center rounded-full bg-honey text-bark ring-4 ring-bark transition-transform duration-200 active:scale-95"
              style={{ boxShadow: '0 10px 24px -8px rgb(233 168 37 / 0.7)' }}
            >
              <Icon name="plus" size={24} />
            </Link>
          </li>
          {trailing.map((item) => (
            <TabItem key={item.to} item={item} />
          ))}
        </ul>
      </nav>
    </>
  )
}

function TabItem({ item }: { item: NavItem }) {
  return (
    <li>
      <NavLink
        to={item.to}
        className={({ isActive }) =>
          `relative flex flex-col items-center gap-1 pb-2.5 pt-3 text-[0.6875rem] font-medium transition-colors ${
            isActive ? 'text-honey' : 'text-birch-300 hover:text-birch-50'
          }`
        }
      >
        {({ isActive }) => (
          <>
            <span
              aria-hidden
              className={`ease-arrive absolute top-0 h-0.5 w-6 rounded-b-full bg-honey transition-transform duration-300 ${
                isActive ? 'scale-x-100' : 'scale-x-0'
              }`}
            />
            <span className="relative">
              <Icon name={item.icon} size={21} />
              {item.count ? (
                <CountBadge count={item.count} className="absolute -right-2.5 -top-1.5" />
              ) : null}
            </span>
            {item.label}
          </>
        )}
      </NavLink>
    </li>
  )
}
