import type { ComponentType } from 'react'
import { useSearchParams } from 'react-router-dom'

import PageHeader from '../components/PageHeader'
import Tabs, { TabPanel, type TabItem } from '../components/Tabs'
import AiSettings from './settings/AiSettings'
import EmailSettings from './settings/EmailSettings'
import GoalSettings from './settings/GoalSettings'
import PrivacySettings from './settings/PrivacySettings'
import TrackingSettings from './settings/TrackingSettings'

// One section at a time instead of one long page. The tab lives in the URL (?tab=goals) so
// the sidebar's "Edit goals" link lands on the right one. Each tab is its own file in
// pages/settings/.
const TABS = [
  { id: 'ai', label: 'AI model', icon: 'sparkle' },
  { id: 'email', label: 'Email', icon: 'mail' },
  { id: 'goals', label: 'Goals', icon: 'target' },
  { id: 'tracking', label: 'Tracking', icon: 'chart' },
  { id: 'privacy', label: 'Privacy', icon: 'shield' },
] as const satisfies readonly TabItem<string>[]
type TabId = (typeof TABS)[number]['id']
const isTab = (value: string | null): value is TabId => TABS.some((tab) => tab.id === value)

const VIEWS: Record<TabId, ComponentType> = {
  ai: AiSettings,
  email: EmailSettings,
  goals: GoalSettings,
  tracking: TrackingSettings,
  privacy: PrivacySettings,
}

export default function Settings() {
  // TODO(me): every control in the tabs is uncontrolled sample UI. Wire it once the backend
  //   has the settings endpoints proposed in docs/replica/open-source-byok.md (keys are
  //   encrypted server-side and never returned to the browser, only `last_four`).
  const [params, setParams] = useSearchParams()
  const requested = params.get('tab')
  const tab: TabId = isTab(requested) ? requested : 'ai'
  const setTab = (id: TabId) => setParams({ tab: id }, { replace: true })
  const View = VIEWS[tab]

  return (
    <>
      <PageHeader
        title="Settings"
        description="Your AI, your inbox, and how JobBear keeps score."
      />

      <Tabs tabs={TABS} value={tab} onChange={setTab} label="Settings sections" />

      <TabPanel key={tab} id={tab} className="mt-6">
        <View />
      </TabPanel>
    </>
  )
}
