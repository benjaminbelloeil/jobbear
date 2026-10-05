import Select from '../../components/form/Select'
import Slider from '../../components/form/Slider'
import ToggleRow from '../../components/form/ToggleRow'
import Icon from '../../components/Icon'
import Panel from '../../components/Panel'
import ProviderKeyRow from '../../components/ProviderKeyRow'
import ProviderLogo from '../../components/ProviderLogo'
import { sampleAiUsage, sampleProviders } from '../../sample/data'

const dollars = (n: number) => `$${n.toFixed(2)}`

export default function AiSettings() {
  // TODO(me): provider keys, model choice, confidence threshold, spend cap and the
  //   allowed actions come from the settings endpoints; usage from a monthly count of
  //   classification calls (tokens × the provider's price).
  const active = sampleProviders.find((provider) => provider.connected)
  const others = sampleProviders.filter((provider) => provider.id !== active?.id)
  const connected = sampleProviders.filter((provider) => provider.connected)
  const usage = sampleAiUsage
  const spent = Math.min(1, usage.cost_usd / usage.cap_usd)

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        {active && (
          <section
            aria-label="Model in use"
            className="flex flex-col rounded-panel bg-bark p-6 text-birch-50"
          >
            <div className="flex items-start justify-between gap-3">
              <span className="grid h-14 w-14 place-items-center rounded-panel bg-birch text-bark">
                <ProviderLogo id={active.id} size={30} />
              </span>
              <span className="rounded-full bg-honey px-2.5 py-1 text-xs font-bold text-bark">
                In use
              </span>
            </div>
            <p className="mt-5 font-display text-2xl font-bold tracking-tight">{active.product}</p>
            <p className="text-sm text-birch-300">by {active.name}</p>
            <p className="mt-4 flex items-center gap-2 text-sm text-birch-300">
              <Icon name="key" size={16} className="text-honey" />
              Key saved, ends in <span className="font-mono text-birch-50">{active.lastFour}</span>
            </p>
            <div className="mt-auto flex flex-wrap gap-2 pt-6">
              <button type="button" className="btn-honey">
                Replace key
              </button>
              <button type="button" className="btn-outline-light">
                Test it
              </button>
            </div>
          </section>
        )}

        <Panel
          title="How emails are read"
          icon="sparkle"
          description="Which model reads, and when it may act alone."
        >
          <div className="space-y-5">
            <Select
              label="Model"
              icon="sparkle"
              defaultValue={active?.id}
              options={connected.map((provider) => ({
                value: provider.id,
                label: `${provider.name} ${provider.product}`,
              }))}
            />
            <Slider
              label="Act on its own above"
              min={50}
              max={99}
              defaultValue={80}
              format={(value) => `${value}%`}
              hint="Below this confidence, emails wait in your Inbox. Higher means fewer surprises and more to review."
            />
          </div>
        </Panel>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel
          title="This month"
          icon="chart"
          description="What the model read for you, and what it cost on your key."
        >
          <dl className="grid grid-cols-3 gap-px overflow-hidden rounded-control bg-birch-200">
            {[
              { label: 'Emails read', value: usage.emails_read },
              { label: 'Handled alone', value: usage.acted_alone },
              { label: 'Sent to Inbox', value: usage.sent_to_inbox },
            ].map((stat) => (
              <div key={stat.label} className="bg-birch px-3 py-3 sm:px-4">
                <dt className="text-xs text-bark-500">{stat.label}</dt>
                <dd className="mt-1 font-display text-2xl font-bold tabular-nums">{stat.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-6">
            <div className="flex items-baseline justify-between gap-3 text-sm">
              <span className="font-semibold text-bark-700">Spent so far</span>
              <span className="tabular-nums text-bark-500">
                <span className="font-semibold text-bark">{dollars(usage.cost_usd)}</span> of{' '}
                {dollars(usage.cap_usd)}
              </span>
            </div>
            <div
              role="meter"
              aria-label="Spent this month"
              aria-valuemin={0}
              aria-valuemax={usage.cap_usd}
              aria-valuenow={usage.cost_usd}
              className="mt-2 h-2.5 overflow-hidden rounded-full bg-birch-200"
            >
              <div
                className="fill-in h-full rounded-full bg-honey"
                style={{ width: `${Math.max(spent * 100, 2)}%` }}
              />
            </div>
          </div>

          <div className="mt-6 border-t border-birch-200 pt-5">
            <Slider
              label="Monthly spend cap"
              name="spend_cap"
              min={1}
              max={50}
              defaultValue={usage.cap_usd}
              format={(value) => `$${value}`}
              hint="When it's reached, new emails wait in your Inbox until next month. A local model has no cap."
            />
          </div>
        </Panel>

        <Panel
          title="What it may do"
          icon="check"
          description="Turn off anything you'd rather do by hand."
        >
          <div className="divide-y divide-birch-200">
            <ToggleRow
              name="ai_status"
              label="Update statuses"
              description="Move an application to OA, Interviewing, Offer or Rejected when an email says so."
              defaultChecked
            />
            <ToggleRow
              name="ai_dates"
              label="Find dates"
              description="Put interviews and assessment deadlines on your calendar."
              defaultChecked
            />
            <ToggleRow
              name="ai_links"
              label="Keep links"
              description="Save assessment, booking and prep links on the application."
              defaultChecked
            />
            <ToggleRow
              name="ai_summary"
              label="Summarise each email"
              description="One line on what the email says, shown in the history."
            />
          </div>
        </Panel>
      </div>

      <Panel
        title="Other providers"
        icon="swap"
        description="Add a key to switch. Any one is enough; a local model costs nothing."
      >
        <div className="divide-y divide-birch-200">
          {others.map((provider) => (
            <ProviderKeyRow key={provider.id} provider={provider} />
          ))}
        </div>
      </Panel>
    </div>
  )
}
