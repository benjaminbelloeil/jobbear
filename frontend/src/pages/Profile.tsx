import Icon from '../components/Icon'
import PageHeader from '../components/PageHeader'
import Panel from '../components/Panel'
import { SAMPLE_TOTAL, sampleMetrics, sampleProfile } from '../sample/data'

const longDate = new Intl.DateTimeFormat(undefined, { dateStyle: 'long', timeZone: 'UTC' })

const initials = (name: string) =>
  name
    .split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .slice(0, 2)

/** Removable chips for a list like target roles, with a field to add one more. */
function ChipList({
  label,
  items,
  placeholder,
}: {
  label: string
  items: string[]
  placeholder: string
}) {
  const id = `add-${label.toLowerCase().replace(/\W+/g, '-')}`
  return (
    <div>
      <p className="label">{label}</p>
      <ul className="mt-2 flex flex-wrap gap-2">
        {items.map((item) => (
          <li
            key={item}
            className="inline-flex items-center gap-1 rounded-full bg-birch-200/70 py-1 pl-3 pr-1 text-sm text-bark ring-1 ring-inset ring-birch-300"
          >
            {item}
            <button
              type="button"
              aria-label={`Remove ${item}`}
              className="grid h-6 w-6 place-items-center rounded-full text-bark-500 transition-colors hover:bg-birch-300/60 hover:text-bark"
            >
              <Icon name="x" size={13} />
            </button>
          </li>
        ))}
      </ul>
      <label htmlFor={id} className="sr-only">
        Add to {label.toLowerCase()}
      </label>
      <span className="field-group mt-3">
        <Icon name="plus" size={16} className="field-icon" />
        <input id={id} placeholder={placeholder} className="field" />
      </span>
    </div>
  )
}

export default function Profile() {
  // TODO(me): load and save the profile once users exist (v2). Target roles and skills will
  //   also feed the keyword match. Export = a JSON download of everything JobBear stores.
  const profile = sampleProfile
  const responseRate = sampleMetrics.find((m) => m.label === 'Response rate')?.value

  return (
    <>
      <PageHeader title="Profile" description="Who you are and what you're looking for." />

      <div className="grid gap-6 xl:grid-cols-12">
        <section
          aria-label="Your search"
          className="relative overflow-hidden rounded-panel bg-bark p-6 text-birch-50 shadow-[0_30px_60px_-40px_rgba(42,31,25,0.9)] sm:p-8 xl:col-span-12"
        >
          <div className="flex flex-wrap items-center gap-6">
            <span
              aria-hidden
              className="grid h-20 w-20 shrink-0 place-items-center rounded-full bg-honey font-display text-3xl font-extrabold text-bark"
            >
              {initials(profile.name)}
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-display text-3xl font-bold tracking-tight">{profile.name}</p>
              <p className="mt-1 text-birch-300">
                Looking for {profile.roles.slice(0, 2).join(' or ').toLowerCase()} roles, searching
                since {longDate.format(new Date(profile.searching_since))}.
              </p>
            </div>
            <dl className="flex gap-3">
              {[
                { label: 'Applications', value: String(SAMPLE_TOTAL) },
                { label: 'Response rate', value: String(responseRate ?? '–') },
              ].map((stat) => (
                <div key={stat.label} className="rounded-control bg-birch/10 px-4 py-3">
                  <dt className="text-xs text-birch-300">{stat.label}</dt>
                  <dd className="mt-1 font-display text-2xl font-bold tabular-nums text-honey">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <Panel
          title="What you're looking for"
          icon="briefcase"
          description="JobBear uses this to recognise recruiter emails and match postings."
          className="xl:col-span-7"
        >
          <div className="space-y-6">
            <ChipList label="Target roles" items={profile.roles} placeholder="Add a role" />
            <ChipList label="Locations" items={profile.locations} placeholder="Add a city" />
            <fieldset>
              <legend className="label">Work style</legend>
              <div className="mt-2 grid gap-2 sm:grid-cols-3">
                {['On site', 'Hybrid', 'Remote'].map((style) => (
                  <label key={style} className="choice py-3">
                    <input
                      type="checkbox"
                      name="work-style"
                      defaultChecked={profile.work_styles.includes(style)}
                      className="checkbox"
                    />
                    <span className="text-sm font-medium">{style}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          </div>
        </Panel>

        <Panel title="Account" icon="user" className="xl:col-span-5">
          <div className="space-y-5">
            <label className="block">
              <span className="label">Name</span>
              <input defaultValue={profile.name} className="field mt-1.5" />
            </label>
            <label className="block">
              <span className="label">Email</span>
              <span className="field-group mt-1.5">
                <Icon name="mail" size={17} className="field-icon" />
                <input type="email" defaultValue={profile.email} className="field" />
              </span>
            </label>
            <div className="flex flex-wrap gap-2">
              <button type="button" className="btn-primary">
                Save changes
              </button>
              <button type="button" className="btn-soft">
                <Icon name="key" size={15} />
                Change password
              </button>
            </div>
            <div className="border-t border-birch-200 pt-5">
              <p className="text-sm font-semibold text-bark-700">Your data</p>
              <p className="mt-1 text-sm text-bark-500">
                Download everything JobBear stores about your search, as one file.
              </p>
              <button type="button" className="btn-soft mt-3">
                <Icon name="file" size={15} />
                Export my data
              </button>
            </div>
          </div>
        </Panel>
      </div>
    </>
  )
}
