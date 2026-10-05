import Icon from './Icon'
import type { SampleProvider } from '../sample/data'

interface ProviderKeyRowProps {
  provider: SampleProvider
}

/**
 * One AI provider: whether a key is saved, and a field to add or replace it.
 * A saved key is never shown again, only its last four characters.
 */
export default function ProviderKeyRow({ provider }: ProviderKeyRowProps) {
  const fieldId = `key-${provider.id}`
  return (
    <div className="grid gap-4 py-5 first:pt-0 last:pb-0 lg:grid-cols-[13rem_minmax(0,1fr)] lg:items-center">
      <div className="flex items-center gap-3">
        <span
          aria-hidden
          className="grid h-10 w-10 shrink-0 place-items-center rounded-control bg-birch font-display text-lg font-bold text-bark"
        >
          {provider.name.charAt(0)}
        </span>
        <div className="min-w-0">
          <p>
            <span className="font-medium">{provider.name}</span>{' '}
            <span className="text-bark-500">{provider.product}</span>
          </p>
          <p className="flex items-center gap-1.5 text-sm">
            <span
              aria-hidden
              className={`h-2 w-2 rounded-full ${provider.connected ? 'bg-pine' : 'bg-birch-300'}`}
            />
            <span className={provider.connected ? 'text-pine' : 'text-bark-500'}>
              {provider.connected ? 'Connected' : 'Not set'}
            </span>
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <label htmlFor={fieldId} className="sr-only">
          {provider.name} {provider.keyLabel ?? 'server address'}
        </label>
        <span className="field-group min-w-0 flex-1">
          <Icon name={provider.keyLabel ? 'key' : 'link'} size={17} className="field-icon" />
          <input
            id={fieldId}
            type={provider.keyLabel ? 'password' : 'url'}
            autoComplete="off"
            spellCheck={false}
            placeholder={
              provider.connected && provider.lastFour
                ? `Saved, ends in ${provider.lastFour}`
                : provider.keyPlaceholder
            }
            className="field font-mono text-[0.8125rem]"
          />
        </span>
        <div className="flex shrink-0 items-center gap-2">
          <button type="button" className="btn-primary">
            {provider.connected ? 'Replace' : 'Save'}
          </button>
          <button type="button" className="btn-ghost">
            Test
          </button>
        </div>
      </div>
    </div>
  )
}
