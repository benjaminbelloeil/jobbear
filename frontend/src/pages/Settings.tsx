import Select from '../components/form/Select'
import Slider from '../components/form/Slider'
import Icon from '../components/Icon'
import PageHeader from '../components/PageHeader'
import Panel from '../components/Panel'
import ProviderKeyRow from '../components/ProviderKeyRow'
import { sampleProviders } from '../sample/data'

export default function Settings() {
  // TODO(me): every control here is uncontrolled sample UI. Wire it once the backend has
  //   the settings endpoints proposed in docs/replica/open-source-byok.md (keys are
  //   encrypted server-side and never returned to the browser, only `last_four`).
  const connected = sampleProviders.filter((provider) => provider.connected)

  return (
    <>
      <PageHeader
        title="Settings"
        description="Use your own API key, or a free local model. JobBear never charges for model usage."
      />

      <div className="grid gap-6 xl:grid-cols-12">
        <div className="space-y-6 xl:col-span-8">
          <Panel
            title="AI providers"
            description="JobBear uses AI for one job: reading recruiter emails and saying what they are. Any one of these is enough."
          >
            <div className="divide-y divide-birch-200">
              {sampleProviders.map((provider) => (
                <ProviderKeyRow key={provider.id} provider={provider} />
              ))}
            </div>
          </Panel>

          <Panel title="Email" description="Where JobBear reads recruiter emails from. Choose one.">
            <fieldset className="grid gap-3 md:grid-cols-2">
              <legend className="sr-only">Email source</legend>
              <label className="choice">
                <input type="radio" name="email-source" defaultChecked className="radio" />
                <span>
                  <span className="block font-medium">Gmail</span>
                  <span className="mt-0.5 block text-sm text-bark-500">
                    Connected as you@gmail.com. Read-only access; JobBear never sends or deletes.
                  </span>
                </span>
              </label>
              <label className="choice">
                <input type="radio" name="email-source" className="radio" />
                <span>
                  <span className="block font-medium">Forwarding address</span>
                  <span className="mt-0.5 block text-sm text-bark-500">
                    Forward recruiter mail to your JobBear address with a filter. Works with any
                    provider.
                  </span>
                </span>
              </label>
            </fieldset>
          </Panel>
        </div>

        <div className="space-y-6 xl:col-span-4">
          <Panel title="Email reading" description="Which model reads, and when it may act alone.">
            <div className="space-y-5">
              <Select
                label="Model"
                icon="sparkle"
                defaultValue="anthropic"
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

          <section className="rounded-panel bg-bark p-6 text-birch-50">
            <h2 className="flex items-center gap-2 text-lg font-bold tracking-tight">
              <Icon name="shield" size={20} className="text-honey" />
              What leaves your server
            </h2>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-birch-300">
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
