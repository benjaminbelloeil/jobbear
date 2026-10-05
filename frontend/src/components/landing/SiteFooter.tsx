import { Link } from 'react-router-dom'

import BearMark from '../BearMark'
import type { NavLink } from './SiteHeader'

/** Landing footer: the brand, the page's sections, and the project's own documents. */
export default function SiteFooter({ links, repoUrl }: { links: NavLink[]; repoUrl: string }) {
  const project: [label: string, href: string][] = [
    ['Source on GitHub', repoUrl],
    ['License (AGPL-3.0)', `${repoUrl}/blob/main/LICENSE`],
    ['Contributing', `${repoUrl}/blob/main/CONTRIBUTING.md`],
    ['Security', `${repoUrl}/blob/main/SECURITY.md`],
  ]

  return (
    <footer className="bg-bark text-birch-300">
      <div className="mx-auto grid max-w-[90rem] gap-12 px-5 py-16 sm:px-8 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_minmax(0,1fr)] lg:px-12">
        <div>
          <Link
            to="/"
            className="inline-flex items-center gap-2.5 rounded-control font-display text-2xl font-bold text-birch-50"
          >
            <span className="grid h-11 w-11 place-items-center rounded-full bg-birch">
              <BearMark size={32} />
            </span>
            JobBear
          </Link>
          <p className="mt-4 max-w-sm leading-relaxed">
            An open-source job application tracker that reads your recruiter email, so you know
            which applications actually work.
          </p>
        </div>

        <nav aria-label="Page sections">
          <h2 className="font-display text-sm font-bold text-birch-50">On this page</h2>
          <ul className="mt-4 space-y-3">
            {links.map(({ id, label }) => (
              <li key={id}>
                <a href={`#${id}`} className="hover:text-birch-50">
                  {label}
                </a>
              </li>
            ))}
            <li>
              <Link to="/login" className="hover:text-birch-50">
                Open the app
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label="Project">
          <h2 className="font-display text-sm font-bold text-birch-50">Project</h2>
          <ul className="mt-4 space-y-3">
            {project.map(([label, href]) => (
              <li key={label}>
                <a href={href} className="hover:text-birch-50">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-t border-birch/10">
        <div className="mx-auto flex max-w-[90rem] items-center gap-3 px-5 py-6 text-sm sm:px-8 lg:px-12">
          <BearMark size={24} mood="asleep" />
          <p>Free to self-host, licensed under AGPL-3.0.</p>
        </div>
      </div>
    </footer>
  )
}
