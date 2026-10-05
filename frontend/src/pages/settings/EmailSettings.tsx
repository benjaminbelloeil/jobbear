import DatePicker from '../../components/form/DatePicker'
import ToggleRow from '../../components/form/ToggleRow'
import Icon from '../../components/Icon'
import Panel from '../../components/Panel'
import { sampleIgnoredSenders, sampleSync } from '../../sample/data'

const clock = new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' })

/** "2026-10-05T14:02" as a local time, without time zone surprises. */
function localTime(at: string) {
  const [date = '', time = '00:00'] = at.split('T')
  const [y = 1970, m = 1, d = 1] = date.split('-').map(Number)
  const [hh = 0, mm = 0] = time.split(':').map(Number)
  return new Date(y, m - 1, d, hh, mm)
}

export default function EmailSettings() {
  // TODO(me): connection state and counts from the Gmail sync job's last run; "Check now"
  //   triggers a sync; the filters and ignored senders narrow the Gmail search query.
  const sync = sampleSync

  return (
    <div className="space-y-6">
      <section
        aria-labelledby="connection-title"
        className="rounded-panel bg-bark p-6 text-birch-50 sm:p-7"
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="grid h-12 w-12 place-items-center rounded-panel bg-birch text-bark">
              <Icon name="mail" size={22} />
            </span>
            <div>
              <h2 id="connection-title" className="flex items-center gap-2 font-semibold">
                Gmail
                <span className="inline-flex items-center gap-1.5 rounded-full bg-pine-50 px-2 py-0.5 text-xs font-semibold text-pine-700">
                  <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-pine" />
                  Connected
                </span>
              </h2>
              <p className="mt-0.5 text-sm text-birch-300">
                {sync.account}. Read-only: JobBear never sends or deletes.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn-honey">
              <Icon name="refresh" size={15} />
              Check now
            </button>
            <button type="button" className="btn-outline-light">
              Disconnect
            </button>
          </div>
        </div>
        <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-control bg-birch/10 sm:grid-cols-4">
          {[
            { label: 'Last checked', value: clock.format(localTime(sync.last_checked)) },
            { label: 'Next check', value: `in ${sync.next_in_minutes} min` },
            { label: 'Read today', value: String(sync.checked_today) },
            { label: 'About your search', value: String(sync.matched_today) },
          ].map((stat) => (
            <div key={stat.label} className="bg-bark px-4 py-3">
              <dt className="text-xs text-birch-300">{stat.label}</dt>
              <dd className="mt-1 font-display text-xl font-bold tabular-nums text-honey">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <Panel
        title="Where emails come from"
        icon="inbox"
        description="Choose one. You can switch at any time."
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
                JobBear reads your inbox directly. The quickest to set up.
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

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel
          title="Which emails to read"
          icon="funnel"
          description="Fewer emails read means fewer AI calls and less to review."
        >
          <div className="divide-y divide-birch-200">
            <ToggleRow
              name="only_recruiters"
              label="Only recruiters and hiring tools"
              description="Companies you applied to, plus Greenhouse, Lever, Ashby and Workday."
              defaultChecked
            />
            <ToggleRow
              name="skip_alerts"
              label="Skip job alerts and newsletters"
              description="Digests from job boards are about new jobs, not yours."
              defaultChecked
            />
            <ToggleRow
              name="read_promotions"
              label="Look in Promotions too"
              description="Some hiring tools land there. Turn on if replies seem to go missing."
            />
          </div>
          <div className="mt-5 border-t border-birch-200 pt-5">
            <DatePicker
              name="read_from"
              label="Read emails from"
              defaultValue="2026-07-27"
              hint="Older emails are left alone. Set it to when your search started."
            />
          </div>
        </Panel>

        <Panel
          title="Never read from"
          icon="x"
          description="Senders JobBear skips, even if they look like a recruiter."
        >
          <ul className="space-y-2">
            {sampleIgnoredSenders.map((sender) => (
              <li
                key={sender}
                className="flex items-center justify-between gap-3 rounded-control border border-birch-200 bg-white py-1.5 pl-3.5 pr-1.5 text-sm"
              >
                <span className="truncate">{sender}</span>
                <button
                  type="button"
                  aria-label={`Stop skipping ${sender}`}
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-control text-bark-500 transition-colors hover:bg-birch-200 hover:text-bark"
                >
                  <Icon name="x" size={14} />
                </button>
              </li>
            ))}
          </ul>
          <label htmlFor="add-ignored" className="sr-only">
            Add a sender to skip
          </label>
          <span className="field-group mt-3">
            <Icon name="plus" size={16} className="field-icon" />
            <input
              id="add-ignored"
              placeholder="name@company.com or a whole domain"
              className="field"
            />
          </span>
          <p className="hint">
            Marking an email “Not about a job” in your Inbox offers to add its sender here.
          </p>
        </Panel>
      </div>
    </div>
  )
}
