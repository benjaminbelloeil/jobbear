import { Link } from 'react-router-dom'

import Select from '../../components/form/Select'
import Slider from '../../components/form/Slider'
import ToggleRow from '../../components/form/ToggleRow'
import Icon from '../../components/Icon'
import Panel from '../../components/Panel'
import { sampleAiLog, sampleStorage } from '../../sample/data'

const when = new Intl.DateTimeFormat(undefined, {
  weekday: 'short',
  hour: 'numeric',
  minute: '2-digit',
})

/** "2026-10-05T14:02" as a local time, without time zone surprises. */
function localTime(at: string) {
  const [date = '', time = '00:00'] = at.split('T')
  const [y = 1970, m = 1, d = 1] = date.split('-').map(Number)
  const [hh = 0, mm = 0] = time.split(':').map(Number)
  return new Date(y, m - 1, d, hh, mm)
}

const KEEP_OPTIONS = [
  { value: '30', label: '30 days' },
  { value: '90', label: '90 days' },
  { value: 'search', label: 'Until my search ends' },
  { value: 'forever', label: 'Until I delete them' },
]

export default function PrivacySettings() {
  // TODO(me): redaction runs before the prompt is built (integrations/), the body-length
  //   setting caps what's sent, and the log is the last rows of a classification audit
  //   table (sender domain, label, confidence, whether it acted). Never log the body.
  return (
    <div className="space-y-6">
      <section
        aria-labelledby="privacy-title"
        className="rounded-panel bg-bark p-6 text-birch-50 sm:p-8"
      >
        <h2 id="privacy-title" className="flex items-center gap-2 text-lg font-bold tracking-tight">
          <Icon name="shield" size={20} className="text-honey" />
          What leaves your server
        </h2>
        <ul className="mt-4 grid gap-4 text-sm leading-relaxed text-birch-300 md:grid-cols-3">
          <li>Only an email’s sender, subject and first few lines go to the model you pick.</li>
          <li>Keys are encrypted at rest and never sent back to the browser.</li>
          <li>No JobBear account, no tracking. It’s open source, so you can check.</li>
        </ul>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel
          title="Before an email goes to the model"
          icon="sparkle"
          description="Take out what it doesn't need to know."
        >
          <div className="divide-y divide-birch-200">
            <ToggleRow name="redact_phone" label="Remove phone numbers" defaultChecked />
            <ToggleRow name="redact_address" label="Remove street addresses" defaultChecked />
            <ToggleRow
              name="redact_signature"
              label="Remove signatures"
              description="Names, titles and links at the end of an email."
              defaultChecked
            />
          </div>
          <div className="mt-5 border-t border-birch-200 pt-5">
            <Slider
              label="Lines of the email it reads"
              name="body_lines"
              min={3}
              max={30}
              defaultValue={8}
              format={(value) => `${value} lines`}
              hint="Fewer lines share less. Too few and dates further down get missed."
            />
          </div>
        </Panel>

        <Panel title="What JobBear keeps" icon="file" description="Stored on your server only.">
          <ul className="divide-y divide-birch-200">
            {sampleStorage.map((item) => (
              <li
                key={item.label}
                className="flex items-baseline justify-between gap-4 py-3 first:pt-0"
              >
                <span className="min-w-0">
                  <span className="block text-sm font-semibold">{item.label}</span>
                  <span className="block text-sm text-bark-500">{item.count}</span>
                </span>
                <span className="shrink-0 text-sm tabular-nums text-bark-500">{item.size}</span>
              </li>
            ))}
          </ul>
          <div className="mt-5 grid gap-4 border-t border-birch-200 pt-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
            <Select label="Keep email snippets for" defaultValue="90" options={KEEP_OPTIONS} />
            <Link to="/profile" className="btn-soft">
              <Icon name="download" size={15} />
              Export it all
            </Link>
          </div>
        </Panel>
      </div>

      <Panel
        title="Recent AI reads"
        icon="list"
        description="The last emails the model looked at, and what it decided. The email itself isn't logged."
      >
        <div className="-mx-5 overflow-x-auto sm:-mx-6">
          <table className="w-full min-w-[36rem] text-sm">
            <thead>
              <tr className="border-b border-birch-200 text-left text-xs text-bark-500">
                <th scope="col" className="px-5 pb-3 font-medium sm:px-6">
                  When
                </th>
                <th scope="col" className="pb-3 font-medium">
                  From
                </th>
                <th scope="col" className="pb-3 font-medium">
                  Found
                </th>
                <th scope="col" className="pb-3 text-right font-medium">
                  Sure
                </th>
                <th scope="col" className="px-5 pb-3 text-right font-medium sm:px-6">
                  Then
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-birch-200">
              {sampleAiLog.map((row) => (
                <tr key={row.id}>
                  <td className="whitespace-nowrap px-5 py-3 tabular-nums text-bark-500 sm:px-6">
                    {when.format(localTime(row.at))}
                  </td>
                  <td className="py-3">{row.sender}</td>
                  <td className="py-3 font-medium">{row.found}</td>
                  <td className="py-3 text-right tabular-nums">
                    {Math.round(row.confidence * 100)}%
                  </td>
                  <td className="px-5 py-3 text-right sm:px-6">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        row.acted
                          ? 'bg-pine-50 text-pine-700'
                          : 'bg-honey-50 text-honey-800 ring-1 ring-inset ring-honey/40'
                      }`}
                    >
                      {row.acted ? 'Handled' : 'Sent to Inbox'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  )
}
