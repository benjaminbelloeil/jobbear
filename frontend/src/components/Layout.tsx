import { Outlet, useLocation, useNavigate } from 'react-router-dom'

import { tokenStorage } from '../api/client'
import { sampleEmails } from '../sample/data'
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

  return (
    <div className="min-h-screen">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-control focus:bg-honey focus:px-4 focus:py-2 focus:text-bark"
      >
        Skip to content
      </a>
      <Sidebar items={items} onLogout={handleLogout} />
      <main id="main" className="lg:pl-60">
        {/* Keyed by route so each view arrives with a short fade (continuity, not choreography). */}
        <div key={location.pathname} className="view-in px-4 pb-16 pt-6 sm:px-8 lg:px-10 lg:pt-10">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
