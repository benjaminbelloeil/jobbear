import { Suspense } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

import { tokenStorage } from '../api/client'
import { sampleEmails, sampleWeekly } from '../sample/data'
import PageLoader from './PageLoader'
import Sidebar from './Sidebar'

export default function Layout() {
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    tokenStorage.clear()
    // TODO(me): also clear cached queries (queryClient.clear()) so the next login starts fresh.
    navigate('/login')
  }

  // TODO(me): replace the sample count with the length of your review-queue query.
  const items = [
    { to: '/dashboard', label: 'Dashboard', icon: 'dashboard' as const },
    { to: '/applications', label: 'Applications', icon: 'list' as const },
    { to: '/inbox', label: 'Inbox', icon: 'inbox' as const, count: sampleEmails.length },
    { to: '/settings', label: 'Settings', icon: 'settings' as const },
  ]

  // TODO(me): this week's count from GET /stats/weekly (the last week) and the user's goal.
  const thisWeek = sampleWeekly.weeks[sampleWeekly.weeks.length - 1]
  const weekly = { done: thisWeek?.applications ?? 0, goal: sampleWeekly.goal }

  return (
    <div className="min-h-screen">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-control focus:bg-honey focus:px-4 focus:py-2 focus:text-bark"
      >
        Skip to content
      </a>
      <Sidebar items={items} onLogout={handleLogout} weekly={weekly} />
      <main id="main" className="lg:pl-60">
        {/* Keyed by route so each view arrives with a short fade (continuity, not choreography). */}
        <div
          key={location.pathname}
          className="view-in px-4 pb-32 pt-6 sm:px-8 lg:px-10 lg:pb-16 lg:pt-10"
        >
          {/* Page code loads here, so the sidebar stays put while it does. */}
          <Suspense fallback={<PageLoader inline />}>
            <Outlet />
          </Suspense>
        </div>
      </main>
    </div>
  )
}
