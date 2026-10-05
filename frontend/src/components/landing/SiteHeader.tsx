import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import BearMark from '../BearMark'
import Icon from '../Icon'

export interface NavLink {
  id: string
  label: string
}

/** Which section is under the middle of the viewport, for the nav highlight. */
function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string | null>(null)
  const key = ids.join(',')

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id
          if (entry.isIntersecting) setActive(id)
          else setActive((current) => (current === id ? null : current))
        }
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
    )
    for (const id of key.split(',')) {
      const node = document.getElementById(id)
      if (node) observer.observe(node)
    }
    return () => observer.disconnect()
  }, [key])

  return active
}

/**
 * Landing header: logo left, section tabs centred in a pill (the current section is
 * highlighted), GitHub and the app on the right. On small screens the tabs move into a
 * menu. Links are plain #anchors; `scroll-behavior: smooth` makes them glide.
 */
export default function SiteHeader({ links, repoUrl }: { links: NavLink[]; repoUrl: string }) {
  const active = useActiveSection(links.map((link) => link.id))
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  // Escape closes the mobile menu.
  useEffect(() => {
    if (!menuOpen) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-40 bg-bark text-birch-50 transition-shadow duration-300 ${
        scrolled ? 'shadow-[0_12px_30px_-18px_rgba(0,0,0,0.9)]' : ''
      }`}
    >
      <nav
        aria-label="Site"
        className="mx-auto grid h-[4.5rem] max-w-[90rem] grid-cols-[1fr_auto] items-center gap-4 px-5 sm:px-8 md:grid-cols-[1fr_auto_1fr] lg:px-12"
      >
        <Link
          to="/"
          className="flex items-center gap-2.5 justify-self-start rounded-control font-display text-xl font-bold"
        >
          <span className="grid h-10 w-10 place-items-center rounded-full bg-birch">
            <BearMark size={30} />
          </span>
          JobBear
        </Link>

        <ul className="hidden items-center gap-1 rounded-full bg-birch/[0.06] p-1.5 ring-1 ring-birch/10 md:flex">
          {links.map(({ id, label }) => {
            const on = active === id
            return (
              <li key={id}>
                <a
                  href={`#${id}`}
                  aria-current={on ? 'location' : undefined}
                  className={`block rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                    on
                      ? 'bg-birch text-bark'
                      : 'text-birch-300 hover:bg-birch/10 hover:text-birch-50'
                  }`}
                >
                  {label}
                </a>
              </li>
            )
          })}
        </ul>

        <div className="flex items-center gap-2 justify-self-end">
          <a
            href={repoUrl}
            className="hidden items-center gap-2 rounded-control px-3 py-2 text-sm font-medium text-birch-300 hover:text-birch-50 lg:inline-flex"
          >
            <Icon name="github" size={18} />
            GitHub
          </a>
          <Link to="/login" className="btn-honey btn-lift px-5 py-2.5 font-semibold">
            Open the app
          </Link>
          <button
            type="button"
            className="grid h-11 w-11 place-items-center rounded-control text-birch-50 ring-1 ring-birch/15 hover:bg-birch/10 md:hidden"
            aria-expanded={menuOpen}
            aria-controls="site-menu"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <Icon name={menuOpen ? 'x' : 'list'} size={20} />
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div id="site-menu" className="border-t border-birch/10 px-5 pb-6 pt-2 sm:px-8 md:hidden">
          <ul className="divide-y divide-birch/10">
            {links.map(({ id, label }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-between py-4 font-display text-xl font-semibold"
                >
                  {label}
                  <Icon name="arrowRight" size={18} className="text-honey" />
                </a>
              </li>
            ))}
            <li>
              <a
                href={repoUrl}
                className="flex items-center gap-2 py-4 font-display text-xl font-semibold"
              >
                <Icon name="github" size={20} />
                GitHub
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}
