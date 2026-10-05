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
  /** On desktop, list this at the foot of the sidebar (e.g. settings), not in the main nav. */
  footer?: boolean
}

export interface WeeklyGoal {
  id: string
  label: string
  done: number
  target: number
}

interface SidebarProps {
  items: NavItem[]
  onLogout?: () => void
  /** This week's goals, shown at the foot of the sidebar. */
  goals?: WeeklyGoal[]
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
  'group flex w-full items-center gap-3 rounded-control px-3 py-2.5 text-sm text-birch-300 transition-colors hover:bg-birch/5 hover:text-birch-50'
const topBarButton =
  'grid h-10 w-10 place-items-center rounded-control text-birch-300 transition-colors hover:bg-birch/5 hover:text-birch-50'

/**
 * Desktop: a fixed bark sidebar with a highlight that glides to the current page.
 * Mobile: a slim top bar and a bottom tab bar with the "New" action raised in the middle.
 */
export default function Sidebar({ items, onLogout, goals = [] }: SidebarProps) {
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

  const goalsMet = goals.filter((goal) => goal.done >= goal.target).length
  // Mobile tab bar: two tabs, the raised "New" button, then the rest. Rarely used pages
  // (settings) sit in the top bar instead, so the tab bar keeps four thumb-sized tabs.
  const mainItems = items.filter((item) => !item.footer)
  const footerItems = items.filter((item) => item.footer)
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
              {mainItems.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `group flex items-center gap-3 rounded-control px-3 py-2.5 text-sm transition-colors duration-150 ${
                        isActive
                          ? 'font-semibold text-birch-50'
                          : 'text-birch-300 hover:bg-birch/5 hover:text-birch-50'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <Icon
                          name={item.icon}
                          size={18}
                          className={`transition-colors duration-150 ${isActive ? 'text-honey' : ''}`}
                        />
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

        {goals.length > 0 && <GoalsCard goals={goals} goalsMet={goalsMet} />}

        <div className="relative mt-4 space-y-0.5 border-t border-birch/10 pt-4">
          {footerItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `${footerLink} ${isActive ? 'bg-birch/10 font-semibold text-birch-50' : ''}`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon name={item.icon} size={18} className={isActive ? 'text-honey' : ''} />
                  {item.label}
                </>
              )}
            </NavLink>
          ))}
          {onLogout && (
            <button type="button" onClick={onLogout} className={footerLink}>
              <Icon name="logout" size={18} />
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

const GOALS_OPEN_KEY = 'jobbear.sidebar-goals-open'

/**
 * This week's goals. Folded by default to one line and a strip of mini bars (one per goal)
 * so it doesn't crowd the nav; open it to see each goal. The choice is remembered per
 * browser.
 */
function GoalsCard({ goals, goalsMet }: { goals: WeeklyGoal[]; goalsMet: number }) {
  const [open, setOpen] = useState(() => {
    try {
      return localStorage.getItem(GOALS_OPEN_KEY) === '1'
    } catch {
      return false
    }
  })
  const toggle = () => {
    setOpen((was) => {
      try {
        localStorage.setItem(GOALS_OPEN_KEY, was ? '0' : '1')
      } catch {
        // Storage blocked (private window): the card still opens, it just won't remember.
      }
      return !was
    })
  }

  // Both parts stay mounted and slide on grid rows (0fr ↔ 1fr), so opening and closing
  // animate the real height instead of snapping. The folded strip and the full list
  // cross-fade over the same 450 ms.
  const fold =
    'grid transition-[grid-template-rows] duration-[450ms] ease-arrive motion-reduce:transition-none'
  const fade =
    'ease-arrive transition-[opacity,transform] duration-[450ms] motion-reduce:transition-none'

  return (
    <section
      aria-labelledby="goals-title"
      className="relative mt-6 overflow-hidden rounded-panel bg-birch/[0.06] ring-1 ring-inset ring-birch/10 transition-colors duration-200 hover:ring-birch/20"
    >
      <h2 id="goals-title">
        <button
          type="button"
          onClick={toggle}
          aria-expanded={open}
          aria-controls="goals-body"
          className="group flex w-full items-center gap-3 rounded-panel p-3 text-left"
        >
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[0.7rem] bg-honey/15 text-honey ring-1 ring-inset ring-honey/25">
            <Icon name="target" size={17} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-semibold text-birch-50">This week</span>
            <span className="block text-xs tabular-nums text-birch-300">
              <span className="font-semibold text-honey">{goalsMet}</span> of {goals.length} goals
              met
            </span>
          </span>
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-birch/10 text-birch-300 transition-colors duration-150 group-hover:bg-birch/15 group-hover:text-birch-50">
            <Icon
              name="chevronDown"
              size={14}
              className={`ease-arrive transition-transform duration-[450ms] motion-reduce:transition-none ${
                open ? 'rotate-180' : ''
              }`}
            />
          </span>
        </button>
      </h2>

      {/* Folded: one bar per goal, so progress still reads at a glance. */}
      <div aria-hidden className={`${fold} ${open ? 'grid-rows-[0fr]' : 'grid-rows-[1fr]'}`}>
        <div className="min-h-0 overflow-hidden">
          <div
            className={`flex gap-1.5 px-3 pb-3.5 ${fade} ${
              open ? '-translate-y-1 opacity-0' : 'translate-y-0 opacity-100'
            }`}
          >
            {goals.map((goal) => {
              const share = Math.min(1, goal.done / goal.target)
              return (
                <span key={goal.id} className="h-2 flex-1 overflow-hidden rounded-full bg-birch/10">
                  <span
                    className="block h-full rounded-full bg-honey transition-[width] duration-500"
                    style={{ width: `${share * 100}%` }}
                  />
                </span>
              )
            })}
          </div>
        </div>
      </div>

      <div
        id="goals-body"
        inert={!open}
        className={`${fold} ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="mx-3 border-t border-birch/10 pb-3.5 pt-3">
            <ul className="space-y-3">
              {goals.map((goal, i) => (
                <li
                  key={goal.id}
                  className={`${fade} ${open ? 'translate-y-0 opacity-100' : '-translate-y-1.5 opacity-0'}`}
                  // Rows arrive one after another on open; on close they leave together.
                  style={{ transitionDelay: open ? `${80 + i * 60}ms` : '0ms' }}
                >
                  <GoalRow goal={goal} />
                </li>
              ))}
            </ul>
            <Link
              to="/settings?tab=goals"
              className={`group mt-3.5 inline-flex items-center gap-1 rounded-control text-xs font-medium text-birch-300 hover:text-birch-50 ${fade} ${
                open ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ transitionDelay: open ? `${80 + goals.length * 60}ms` : '0ms' }}
            >
              Edit goals
              <Icon
                name="arrowRight"
                size={12}
                className="ease-arrive transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

/**
 * One goal: its name, how far along it is, and a row of segments, one per unit up to 12
 * (a bar beyond that). Segments make "4 of 8" countable at a glance.
 */
function GoalRow({ goal }: { goal: WeeklyGoal }) {
  const met = goal.done >= goal.target
  const segmented = goal.target <= 12
  const left = Math.max(0, goal.target - goal.done)
  return (
    <div>
      <div className="flex items-center justify-between gap-2 text-xs">
        <span className={`flex items-center gap-1.5 ${met ? 'text-birch-50' : 'text-birch-300'}`}>
          {met && <Icon name="check" size={13} className="text-honey" />}
          {goal.label}
        </span>
        <span className="font-semibold tabular-nums text-birch-50">
          {goal.done}
          <span className="font-normal text-birch-300">/{goal.target}</span>
        </span>
      </div>
      <div
        role="meter"
        aria-label={`${goal.label} this week`}
        aria-valuemin={0}
        aria-valuemax={goal.target}
        aria-valuenow={Math.min(goal.done, goal.target)}
        aria-valuetext={
          met
            ? `${goal.done} of ${goal.target}, goal met`
            : `${goal.done} of ${goal.target}, ${left} to go`
        }
        className="mt-1.5 flex h-1.5 gap-[3px]"
      >
        {segmented ? (
          Array.from({ length: goal.target }, (_, i) => (
            <span
              key={i}
              className={`h-full flex-1 rounded-full ${i < goal.done ? 'bg-honey' : 'bg-birch/10'}`}
            />
          ))
        ) : (
          <span className="h-full flex-1 overflow-hidden rounded-full bg-birch/10">
            <span
              className="fill-in block h-full rounded-full bg-honey"
              style={{ width: `${Math.min(1, goal.done / goal.target) * 100}%` }}
            />
          </span>
        )}
      </div>
    </div>
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
