import Select from '../components/form/Select'
import Slider from '../components/form/Slider'
import Icon from '../components/Icon'
import PageHeader from '../components/PageHeader'
import Panel from '../components/Panel'
import ProviderKeyRow from '../components/ProviderKeyRow'
import ProviderLogo from '../components/ProviderLogo'
import { SAMPLE_GHOST_AFTER_DAYS, sampleProviders, sampleWeekly } from '../sample/data'

const SYNC_OPTIONS = [
  { value: '15', label: 'Every 15 minutes' },
  { value: '30', label: 'Every 30 minutes' },
  { value: '60', label: 'Every hour' },
  { value: '180', label: 'Every 3 hours' },
]

export default function Settings() {
  // TODO(me): every control here is uncontrolled sample UI. Wire it once the backend has
  //   the settings endpoints proposed in docs/replica/open-source-byok.md (keys are
  //   encrypted server-side and never returned to the browser, only `last_four`).
  //   Tracking maps to GHOSTED_AFTER_DAYS, WEEKLY_GOAL and GMAIL_SYNC_INTERVAL_MINUTES,
  //   which live in .env today; per-user settings come with multi-user (v2).
  const active = sampleProviders.find((provider) => provider.connected)
  const others = sampleProviders.filter((provider) => provider.id !== active?.id)
  const connected = sampleProviders.filter((provider) => provider.connected)

  return (
    <>
      <PageHeader
        title="Settings"
        description="Your AI, your inbox, and how JobBear keeps score."
      />

      <div>
        <div className="min-w-0 space-y-6">
          {/* AI model */}
          <section id="ai" aria-labelledby="ai-title" className="scroll-mt-24 space-y-6">
            <h2 id="ai-title" className="sr-only">
              AI model
            </h2>
            <div className="grid gap-6 lg:grid-cols-2">
              {active && (
                <div className="flex flex-col rounded-panel bg-bark p-6 text-birch-50 shadow-[0_30px_60px_-40px_rgba(42,31,25,0.9)]">
                  <div className="flex items-start justify-between gap-3">
                    <span className="grid h-14 w-14 place-items-center rounded-panel bg-birch text-bark">
                      <ProviderLogo id={active.id} size={30} />
                    </span>
                    <span className="rounded-full bg-honey px-2.5 py-1 text-xs font-bold text-bark">
                      In use
                    </span>
                  </div>
                  <p className="mt-5 font-display text-2xl font-bold tracking-tight">
                    {active.product}
                  </p>
                  <p className="text-sm text-birch-300">by {active.name}</p>
                  <p className="mt-4 flex items-center gap-2 text-sm text-birch-300">
                    <Icon name="key" size={16} className="text-honey" />
                    Key saved, ends in{' '}
                    <span className="font-mono text-birch-50">{active.lastFour}</span>
                  </p>
                  <div className="mt-auto flex flex-wrap gap-2 pt-6">
                    <button type="button" className="btn-honey">
                      Replace key
                    </button>
                    <button type="button" className="btn-outline-light">
                      Test it
                    </button>
                  </div>
                </div>
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

            <Panel
              title="Other providers"
              icon="key"
              description="Add a key to switch. Any one is enough; a local model costs nothing."
            >
              <div className="divide-y divide-birch-200">
                {others.map((provider) => (
                  <ProviderKeyRow key={provider.id} provider={provider} />
                ))}
              </div>
            </Panel>
          </section>

          {/* Email */}
          <Panel
            id="email"
            title="Email"
            icon="mail"
            description="Where JobBear reads recruiter emails from. Choose one."
          >
            <fieldset className="grid gap-3 md:grid-cols-2">
              <legend className="sr-only">Email source</legend>
              <label className="choice">
                <input type="radio" name="email-source" defaultChecked className="radio" />
                <span>
                  <span className="flex items-center gap-2 font-medium">
                    <Icon name="mail" size={16} />
                    Gmail
                  </span>
                  <span className="mt-1 block text-sm text-bark-500">
                    Connected as you@gmail.com. Read-only: JobBear never sends or deletes.
                  </span>
                </span>
              </label>
              <label className="choice">
                <input type="radio" name="email-source" className="radio" />
                <span>
                  <span className="flex items-center gap-2 font-medium">
                    <Icon name="send" size={16} />
                    Forwarding address
                  </span>
                  <span className="mt-1 block text-sm text-bark-500">
                    Forward recruiter mail to your JobBear address with a filter. Works with any
                    provider.
                  </span>
                </span>
              </label>
            </fieldset>
          </Panel>

          {/* Tracking */}
          <Panel
            id="tracking"
            title="Tracking"
            icon="chart"
            description="How JobBear keeps score of your search."
          >
            <div className="grid gap-6 md:grid-cols-2">
              <Slider
                label="Mark as ghosted after"
                min={7}
                max={60}
                defaultValue={SAMPLE_GHOST_AFTER_DAYS}
                format={(value) => `${value} days`}
                hint="Days with no reply before an application counts as ghosted. You can always undo it."
              />
              <Slider
                label="Weekly goal"
                min={1}
                max={40}
                defaultValue={sampleWeekly.goal}
                format={(value) => `${value} a week`}
                hint="Applications a week. Bars on the dashboard turn honey when you hit it."
              />
              <Select
                label="Check email"
                icon="refresh"
                defaultValue="60"
                options={SYNC_OPTIONS}
                hint="More often means faster updates and a few more AI calls."
              />
            </div>
          </Panel>

          {/* Privacy */}
          <section
            id="privacy"
            aria-labelledby="privacy-title"
            className="scroll-mt-24 rounded-panel bg-bark p-6 text-birch-50 sm:p-8"
          >
            <h2
              id="privacy-title"
              className="flex items-center gap-2 text-lg font-bold tracking-tight"
            >
              <Icon name="shield" size={20} className="text-honey" />
              What leaves your server
            </h2>
            <ul className="mt-4 grid gap-4 text-sm leading-relaxed text-birch-300 md:grid-cols-3">
              <li>Only an email’s sender, subject and first few lines go to the model you pick.</li>
              <li>Keys are encrypted at rest and never sent back to the browser.</li>
              <li>No JobBear account, no tracking. It’s open source, so you can check.</li>
            </ul>
          </section>
        </div>
      </div>
    </>
  )
}
