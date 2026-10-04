import { Outlet, useNavigate } from 'react-router-dom'

import { tokenStorage } from '../api/client'
import Navbar from './Navbar'

export default function Layout() {
  const navigate = useNavigate()

  const handleLogout = () => {
    tokenStorage.clear()
    navigate('/login')
  }

  return (
    <div className="min-h-screen">
      <Navbar onLogout={handleLogout} />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}
