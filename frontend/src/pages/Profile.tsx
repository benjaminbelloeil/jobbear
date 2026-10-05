import { useState } from 'react'

import BearCharacter from '../components/BearCharacter'
import Icon, { type IconName } from '../components/Icon'
import PageHeader from '../components/PageHeader'
import Panel from '../components/Panel'
import Tabs, { TabPanel, type TabItem } from '../components/Tabs'
import { SAMPLE_TODAY, SAMPLE_TOTAL, sampleMetrics, sampleProfile } from '../sample/data'

const longDate = new Intl.DateTimeFormat(undefined, { dateStyle: 'long', timeZone: 'UTC' })

const initials = (name: string) =>
  name
    .split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .slice(0, 2)

const TABS = [
  { id: 'search', label: 'Your search', icon: 'briefcase' },
  { id: 'account', label: 'Account', icon: 'user' },
  { id: 'data', label: 'Your data', icon: 'shield' },
] as const satisfies readonly TabItem<string>[]
type TabId = (typeof TABS)[number]['id']

const WORK_STYLES: { label: string; icon: IconName; detail: string }[] = [
  { label: 'On site', icon: 'building', detail: 'At the office every day' },
  { label: 'Hybrid', icon: 'calendar', detail: 'A few days in, the rest at home' },
  { label: 'Remote', icon: 'globe', detail: 'From anywhere' },
]

/** Removable chips for a list like target roles, with a field to add one more. */
function ChipList({
  label,
  icon,
  items,
  placeholder,
}: {
  label: string
  icon: IconName
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
            className="inline-flex items-center gap-1.5 rounded-full bg-white py-1 pl-3 pr-1 text-sm font-medium text-bark ring-1 ring-inset ring-birch-300"
          >
            <Icon name={icon} size={14} className="text-bark-500" />
            {item}
            <button
              type="button"
              aria-label={`Remove ${item}`}
              className="grid h-6 w-6 place-items-center rounded-full text-bark-500 transition-colors hover:bg-birch-200 hover:text-bark"
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
  const [tab, setTab] = useState<TabId>('search')
  const responseRate = sampleMetrics.find((m) => m.label === 'Response rate')?.value
  const interviews = sampleMetrics.find((m) => m.label === 'Reached interview')?.hint
  const daysSearching = Math.round(
    (Date.parse(SAMPLE_TODAY) - Date.parse(profile.searching_since)) / (24 * 60 * 60 * 1000),
  )

  const stats = [
    { label: 'Applications', value: String(SAMPLE_TOTAL) },
    { label: 'Response rate', value: String(responseRate ?? '–') },
    { label: 'Interviews', value: typeof interviews === 'string' ? interviews.split(' ')[0] : '–' },
    { label: 'Days searching', value: String(daysSearching) },
  ]

  return (
    <>
      <PageHeader title="Profile" description="Who you are and what you're looking for." />

      <section
        aria-label="Your search at a glance"
        className="relative overflow-hidden rounded-panel bg-bark text-birch-50"
      >
        <BearCharacter
          mood="reading"
          size={120}
          outlined
          className="pointer-events-none absolute -bottom-3 right-4 hidden md:block"
        />
        <div className="relative flex flex-wrap items-center gap-5 p-6 sm:p-8 md:pr-40">
          <span
            aria-hidden
            className="grid h-20 w-20 shrink-0 place-items-center rounded-full bg-honey font-display text-3xl font-extrabold text-bark ring-4 ring-birch/10"
          >
            {initials(profile.name)}
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              {profile.name}
            </p>
            <p className="mt-1 text-birch-300">
              Searching since {longDate.format(new Date(profile.searching_since))}
            </p>
            <ul className="mt-3 flex flex-wrap gap-2" aria-label="Target roles">
              {profile.roles.map((role) => (
                <li
                  key={role}
                  className="rounded-full px-3 py-1 text-sm font-medium text-honey ring-1 ring-inset ring-honey/40"
                >
                  {role}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <dl className="relative grid grid-cols-2 border-t border-birch/10 sm:grid-cols-4 md:mr-40">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`px-6 py-4 sm:px-8 ${i % 2 === 1 ? 'border-l border-birch/10' : ''} ${
                i >= 2 ? 'border-t border-birch/10 sm:border-t-0' : ''
              } ${i === 2 ? 'sm:border-l' : ''}`}
            >
              <dt className="text-xs text-birch-300">{stat.label}</dt>
              <dd className="mt-1 font-display text-2xl font-bold tabular-nums text-honey">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <Tabs tabs={TABS} value={tab} onChange={setTab} label="Profile sections" className="mt-8" />

      <TabPanel key={tab} id={tab} className="mt-6">
        {tab === 'search' && (
          <div className="grid gap-6 xl:grid-cols-12">
            <Panel
              title="What you're looking for"
              icon="briefcase"
              description="JobBear uses this to recognise recruiter emails and match postings."
              className="xl:col-span-7"
            >
              <div className="space-y-6">
                <ChipList
                  label="Target roles"
                  icon="briefcase"
                  items={profile.roles}
                  placeholder="Add a role"
                />
                <ChipList
                  label="Locations"
                  icon="pin"
                  items={profile.locations}
                  placeholder="Add a city"
                />
              </div>
            </Panel>

            <Panel
              title="Work style"
              icon="building"
              description="Pick every one you'd take."
              className="xl:col-span-5"
            >
              <fieldset>
                <legend className="sr-only">Work style</legend>
                <div className="grid gap-2">
                  {WORK_STYLES.map((style) => (
                    <label key={style.label} className="choice items-center py-3">
                      <span className="icon-tile">
                        <Icon name={style.icon} size={18} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold">{style.label}</span>
                        <span className="block text-sm text-bark-500">{style.detail}</span>
                      </span>
                      <input
                        type="checkbox"
                        name="work-style"
                        defaultChecked={profile.work_styles.includes(style.label)}
                        className="checkbox"
                      />
                    </label>
                  ))}
                </div>
              </fieldset>
            </Panel>
          </div>
        )}

        {tab === 'account' && (
          <div className="grid gap-6 xl:grid-cols-2">
            <Panel title="Account" icon="user" description="How JobBear addresses you.">
              <div className="space-y-5">
                <label className="block">
                  <span className="label">Name</span>
                  <span className="field-group mt-1.5">
                    <Icon name="user" size={17} className="field-icon" />
                    <input defaultValue={profile.name} className="field" />
                  </span>
                </label>
                <label className="block">
                  <span className="label">Email</span>
                  <span className="field-group mt-1.5">
                    <Icon name="mail" size={17} className="field-icon" />
                    <input type="email" defaultValue={profile.email} className="field" />
                  </span>
                </label>
                <button type="button" className="btn-primary">
                  Save changes
                </button>
              </div>
            </Panel>

            <Panel title="Password" icon="key" description="Use one you don't use anywhere else.">
              <div className="space-y-5">
                <label className="block">
                  <span className="label">Current password</span>
                  <input type="password" autoComplete="current-password" className="field mt-1.5" />
                </label>
                <label className="block">
                  <span className="label">New password</span>
                  <input type="password" autoComplete="new-password" className="field mt-1.5" />
                  <span className="hint mt-1.5 block">At least 12 characters.</span>
                </label>
                <button type="button" className="btn-soft">
                  <Icon name="key" size={15} />
                  Change password
                </button>
              </div>
            </Panel>
          </div>
        )}

        {tab === 'data' && (
          <div className="grid gap-6 xl:grid-cols-2">
            <Panel
              title="Export"
              icon="download"
              description="Everything JobBear stores about your search, as one file."
            >
              <p className="text-sm leading-relaxed text-bark-700">
                Applications, their history, notes, saved postings and resume versions. Yours to
                keep or take somewhere else.
              </p>
              <button type="button" className="btn-soft mt-5">
                <Icon name="download" size={15} />
                Export my data
              </button>
            </Panel>

            <Panel
              title="Delete everything"
              icon="x"
              description="Removes your account and every application. This can't be undone."
            >
              <p className="text-sm leading-relaxed text-bark-700">
                Export first if you might want any of it back. Your inbox is disconnected and saved
                keys are erased.
              </p>
              <button
                type="button"
                className="btn mt-5 border border-berry/40 text-berry hover:bg-berry-50"
              >
                Delete my account
              </button>
            </Panel>
          </div>
        )}
      </TabPanel>
    </>
  )
}
