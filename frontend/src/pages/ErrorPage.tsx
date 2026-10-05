import { useEffect } from 'react'

import BearCharacter from '../components/BearCharacter'
import Icon from '../components/Icon'

/**
 * Shown by ErrorBoundary when a page crashes while rendering. Plain links rather than
 * router links, so it still works if the router itself is what broke.
 */
export default function ErrorPage({ error }: { error?: unknown }) {
  // Details only in development: production users shouldn't see internals.
  const message = import.meta.env.DEV && error instanceof Error ? error.message : undefined

  useEffect(() => {
    document.title = 'Something went wrong · JobBear'
  }, [])

  return (
    <main className="grid min-h-screen place-items-center bg-bark px-5 py-16 text-birch-50">
      <div className="flex max-w-xl flex-col items-center text-center">
        <div className="grid aspect-square w-44 place-items-center rounded-full bg-birch sm:w-52">
          <BearCharacter mood="idle" size={130} title="The JobBear bear" />
        </div>
        <h1 className="mt-8 text-4xl font-extrabold leading-[1.04] tracking-[-0.03em] [text-wrap:balance] sm:text-6xl">
          This page tripped over.
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-birch-300">
          It hit an error it couldn’t recover from. Your data is safe; reloading usually fixes it.
          If it keeps happening, please open an issue on GitHub.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="btn-honey btn-lg btn-lift"
          >
            <Icon name="refresh" size={18} />
            Reload the page
          </button>
          <a href="/" className="btn-outline-light btn-lg">
            Back to the home page
          </a>
        </div>
        {message && (
          <details className="mt-8 w-full rounded-control border border-birch/15 bg-black/20 p-4 text-left text-sm text-birch-300">
            <summary className="cursor-pointer font-medium text-birch-50">Error details</summary>
            <pre className="mt-3 whitespace-pre-wrap break-words font-mono text-xs">{message}</pre>
          </details>
        )}
      </div>
    </main>
  )
}
