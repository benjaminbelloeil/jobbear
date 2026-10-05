import Icon from './Icon'
import ProviderLogo from './ProviderLogo'
import type { SampleProvider } from '../sample/data'

interface ProviderKeyRowProps {
  provider: SampleProvider
}

/**
 * One AI provider that isn't in use: its mark and status, and an "Add key" disclosure that
 * opens the key field in place. A saved key is never shown again, only its last four.
 */
export default function ProviderKeyRow({ provider }: ProviderKeyRowProps) {
  const fieldId = `key-${provider.id}`
  const local = provider.keyLabel === null
  return (
    <details className="group py-4 first:pt-0 last:pb-0">
      <summary className="flex cursor-pointer list-none items-center gap-3 rounded-control [&::-webkit-details-marker]:hidden">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-control bg-white text-bark ring-1 ring-inset ring-birch-300">
          <ProviderLogo id={provider.id} size={22} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block">
            <span className="font-medium">{provider.name}</span>{' '}
            <span className="text-bark-500">{provider.product}</span>
          </span>
          <span className="block text-sm text-bark-500">
            {provider.connected && provider.lastFour
              ? `Key saved, ends in ${provider.lastFour}`
              : local
                ? 'Free, runs on your machine'
                : 'No key yet'}
          </span>
        </span>
        <span className="btn-soft pointer-events-none">
          {local ? 'Set up' : provider.connected ? 'Replace key' : 'Add key'}
          <Icon
            name="chevronDown"
            size={15}
            className="transition-transform duration-200 group-open:rotate-180"
          />
        </span>
      </summary>

      <div className="mt-4 flex flex-col gap-2 pl-14 sm:flex-row sm:items-center">
        <label htmlFor={fieldId} className="sr-only">
          {provider.name} {provider.keyLabel ?? 'server address'}
        </label>
        <span className="field-group min-w-0 flex-1">
          <Icon name={local ? 'link' : 'key'} size={17} className="field-icon" />
          <input
            id={fieldId}
            type={local ? 'url' : 'password'}
            autoComplete="off"
            spellCheck={false}
            placeholder={provider.keyPlaceholder}
            className="field font-mono text-[0.8125rem]"
          />
        </span>
        {/* TODO(me): save sends the key to the backend once; test runs one tiny classification. */}
        <div className="flex shrink-0 items-center gap-2">
          <button type="button" className="btn-primary">
            Save
          </button>
          <button type="button" className="btn-ghost">
            Test
          </button>
        </div>
      </div>
    </details>
  )
}
