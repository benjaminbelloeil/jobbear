import { NavLink } from 'react-router-dom'

const LINKS = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/applications', label: 'Applications' },
]

interface NavbarProps {
  onLogout?: () => void
}

export default function Navbar({ onLogout }: NavbarProps) {
  return (
    <header className="border-b border-slate-200 bg-white">
      <nav className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-4">
        <NavLink to="/dashboard" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-slate-900 text-sm text-white">
            J
          </span>
          JobBear
        </NavLink>

        <ul className="flex items-center gap-1 text-sm">
          {LINKS.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  `rounded-md px-3 py-1.5 transition-colors ${
                    isActive
                      ? 'bg-slate-100 font-medium text-slate-900'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {onLogout && (
          <button
            type="button"
            onClick={onLogout}
            className="ml-auto rounded-md px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          >
            Log out
          </button>
        )}
      </nav>
    </header>
  )
}
