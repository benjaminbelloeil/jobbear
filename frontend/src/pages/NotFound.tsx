import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

import BearCharacter from '../components/BearCharacter'
import Icon from '../components/Icon'

/** Any URL that doesn't match a route. The bear is asleep: nothing to find here. */
export default function NotFound() {
  const { pathname } = useLocation()

  useEffect(() => {
    document.title = 'Page not found · JobBear'
    return () => {
      document.title = 'JobBear'
    }
  }, [])

  return (
    <main className="grid min-h-screen place-items-center bg-bark px-5 py-16 text-birch-50">
      <div className="flex max-w-xl flex-col items-center text-center">
        <div className="grid aspect-square w-44 place-items-center rounded-full bg-birch sm:w-52">
          <BearCharacter mood="sleeping" size={130} title="The JobBear bear, asleep" />
        </div>
        <h1 className="mt-8 text-4xl font-extrabold leading-[1.04] tracking-[-0.03em] [text-wrap:balance] sm:text-6xl">
          This page wandered off.
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-birch-300">
          Error 404: nothing lives at{' '}
          <code className="break-all rounded bg-black/25 px-1.5 py-0.5 font-mono text-base text-birch-50">
            {pathname}
          </code>
          . The link may be old, or the address has a typo.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link to="/" className="btn-honey btn-lg btn-lift">
            <Icon name="chevronLeft" size={18} />
            Back to the home page
          </Link>
          <Link to="/dashboard" className="btn-outline-light btn-lg">
            Open the app
          </Link>
        </div>
      </div>
    </main>
  )
}
