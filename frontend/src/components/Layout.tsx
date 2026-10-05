import { Suspense } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

import { tokenStorage } from '../api/client'
import { sampleEmails, sampleGoals } from '../sample/data'
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
    { to: '/calendar', label: 'Calendar', icon: 'calendar' as const, mobileTopBar: true },
    { to: '/resumes', label: 'Resumes', icon: 'file' as const },
    { to: '/inbox', label: 'Inbox', icon: 'inbox' as const, count: sampleEmails.length },
    {
      to: '/profile',
      label: 'Profile',
      icon: 'user' as const,
      mobileTopBar: true,
      footer: true,
    },
    {
      to: '/settings',
      label: 'Settings',
      icon: 'settings' as const,
      mobileTopBar: true,
      footer: true,
    },
  ]

  // TODO(me): this week's progress per goal; applications come from GET /stats/weekly.
  const goals = sampleGoals

  return (
    <div className="min-h-screen">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-control focus:bg-honey focus:px-4 focus:py-2 focus:text-bark"
      >
        Skip to content
      </a>
      <Sidebar items={items} onLogout={handleLogout} goals={goals} />
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
