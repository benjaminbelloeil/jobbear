// SAMPLE DATA: fictional companies and numbers so every screen can be designed and demoed
// before the API works. Real pages import from here only until their TODO(me) queries
// replace it. Delete an export once nothing imports it.
import type { SourceFunnelRow } from '../components/charts/SourceFunnel'
import type { StatusCount } from '../components/charts/StatusBreakdown'
import type { Metric } from '../components/MetricStrip'
import type { Application, ApplicationStatus, Email, StatusEvent, WeeklyStats } from '../types'

export const sampleMetrics: Metric[] = [
  { label: 'Response rate', value: '31%', hint: '15 of 48 heard back' },
  { label: 'Applications', value: 48, hint: '+4 this week' },
  { label: 'Reached an OA', value: '19%', hint: '9 of 48' },
  { label: 'Reached interview', value: '10%', hint: '5 of 48' },
  { label: 'Days to first reply', value: '6.5', hint: 'median 5' },
]

export const sampleWeekly: WeeklyStats = {
  goal: 8,
  weeks: [
    { week_start: '2026-07-27', applications: 3, goal: 8 },
    { week_start: '2026-08-03', applications: 6, goal: 8 },
    { week_start: '2026-08-10', applications: 2, goal: 8 },
    { week_start: '2026-08-17', applications: 5, goal: 8 },
    { week_start: '2026-08-24', applications: 9, goal: 8 },
    { week_start: '2026-08-31', applications: 7, goal: 8 },
    { week_start: '2026-09-07', applications: 11, goal: 8 },
    { week_start: '2026-09-14', applications: 4, goal: 8 },
    { week_start: '2026-09-21', applications: 8, goal: 8 },
    { week_start: '2026-09-28', applications: 4, goal: 8 },
  ],
}

export const sampleStatusCounts: StatusCount[] = [
  { status: 'APPLIED', count: 21 },
  { status: 'OA', count: 6 },
  { status: 'INTERVIEWING', count: 4 },
  { status: 'OFFER', count: 1 },
  { status: 'REJECTED', count: 9 },
  { status: 'GHOSTED', count: 7 },
]

export const sampleFunnel: SourceFunnelRow[] = [
  { source: 'REFERRAL', applications: 6, response_rate: 0.67, interview_rate: 0.33 },
  { source: 'COMPANY_SITE', applications: 12, response_rate: 0.33, interview_rate: 0.08 },
  { source: 'LINKEDIN', applications: 19, response_rate: 0.21, interview_rate: 0.05 },
  { source: 'ATS', applications: 11, response_rate: 0.18, interview_rate: 0.09 },
]

/** Plain-language findings. In the real app these would come from the stats service. */
export const sampleInsights = [
  {
    id: 'referrals',
    headline: 'Referrals get a reply 3× as often as LinkedIn.',
    detail: '4 of 6 referrals heard back, against 4 of 19 LinkedIn applications.',
  },
  {
    id: 'volume',
    headline: 'Your best weeks were also your highest-volume weeks.',
    detail: 'The 3 weeks you hit your goal produced 9 of your 15 replies.',
  },
  {
    id: 'speed',
    headline: 'Replies arrive within 8 days, or usually not at all.',
    detail: '13 of 15 replies came in the first 8 days after applying.',
  },
]

const company = (id: number, name: string, domain: string) => ({
  id,
  name,
  domain,
  website: `https://${domain}`,
  location: null,
  created_at: '2026-07-20T00:00:00Z',
})

type Row = [
  id: number,
  company: string,
  domain: string,
  position: string,
  source: Application['source'],
  status: ApplicationStatus,
  next: Application['next_action'],
  applied: string,
  lastActivity: string | null,
  location: string | null,
  remote: boolean,
]

// prettier-ignore
const ROWS: Row[] = [
  [1, 'Northwind Labs', 'northwind.example', 'Backend Engineer Intern', 'REFERRAL', 'INTERVIEWING', 'PREPARE_INTERVIEW', '2026-09-12', '2026-09-30T14:20:00Z', 'Zürich', false],
  [2, 'Halcyon Data', 'halcyon.example', 'Software Engineer, New Grad', 'LINKEDIN', 'OA', 'PREPARE_OA', '2026-09-18', '2026-10-02T08:12:00Z', null, true],
  [3, 'Quarry & Co', 'quarry.example', 'Platform Engineer', 'ATS', 'GHOSTED', 'NONE', '2026-08-20', null, 'Berlin', false],
  [4, 'Brightline', 'brightline.example', 'Full-stack Developer', 'COMPANY_SITE', 'REJECTED', 'NONE', '2026-09-02', '2026-09-15T08:00:00Z', 'Remote', true],
  [5, 'Fernhill Robotics', 'fernhill.example', 'Software Engineer Intern', 'REFERRAL', 'OFFER', 'DECIDE', '2026-08-28', '2026-10-01T16:45:00Z', 'Lausanne', false],
  [6, 'Tidepool', 'tidepool.example', 'Junior Backend Developer', 'LINKEDIN', 'APPLIED', 'FOLLOW_UP', '2026-09-17', null, 'Remote', true],
  [7, 'Cobalt Health', 'cobalt.example', 'Python Developer', 'ATS', 'APPLIED', 'WAITING', '2026-09-25', null, 'Basel', false],
  [8, 'Meridian Maps', 'meridian.example', 'Data Engineer Intern', 'COMPANY_SITE', 'INTERVIEWING', 'PREPARE_INTERVIEW', '2026-09-09', '2026-10-03T10:00:00Z', 'Geneva', false],
  [9, 'Lumen Ledger', 'lumen.example', 'API Engineer', 'LINKEDIN', 'APPLIED', 'FOLLOW_UP', '2026-09-15', null, 'Remote', true],
  [10, 'Saffron Studio', 'saffron.example', 'Frontend Developer', 'ATS', 'REJECTED', 'NONE', '2026-09-05', '2026-09-19T09:30:00Z', 'Lyon', false],
  [11, 'Granite Cloud', 'granite.example', 'Site Reliability Intern', 'COMPANY_SITE', 'APPLIED', 'WAITING', '2026-09-29', null, 'Zürich', false],
  [12, 'Orchard AI', 'orchard.example', 'ML Platform Engineer', 'LINKEDIN', 'WITHDRAWN', 'NONE', '2026-08-30', '2026-09-08T12:00:00Z', 'Remote', true],
]

export const sampleApplications: Application[] = ROWS.map(
  ([id, name, domain, position, source, status, next, applied, last, location, remote]) => ({
    id,
    company_id: id,
    company: company(id, name, domain),
    position,
    job_url: `https://${domain}/careers/${id}`,
    source,
    location,
    remote,
    status,
    next_action: next,
    applied_at: applied,
    last_activity_at: last,
    notes:
      id === 1
        ? 'Referred by Lea (met at the HackZurich booth). Team works on the payments API; ask about their on-call rotation.'
        : null,
    created_at: `${applied}T09:00:00Z`,
    updated_at: last ?? `${applied}T09:00:00Z`,
  }),
)

export const SAMPLE_TOTAL = 48

/** Applications grouped for the board view. Grouping real data is your TODO(me). */
export const sampleBoard: { status: ApplicationStatus; applications: Application[] }[] = (
  ['APPLIED', 'OA', 'INTERVIEWING', 'OFFER', 'REJECTED', 'GHOSTED'] as ApplicationStatus[]
).map((status) => ({
  status,
  applications: sampleApplications.filter((app) => app.status === status),
}))

export type NeedsYouTone = 'honey' | 'pine' | 'heather' | 'bark'

/** What to do next, soonest first. The real list would come from next_action + dates. */
export const sampleNeedsYou: {
  id: number
  applicationId: number
  action: string
  who: string
  what: string
  when: string
  tone: NeedsYouTone
}[] = [
  {
    id: 1,
    applicationId: 1,
    action: 'Prepare for interview',
    who: 'Northwind Labs',
    what: 'Technical screen, 45 min',
    when: 'Tue 6 Oct, 14:00',
    tone: 'honey',
  },
  {
    id: 2,
    applicationId: 2,
    action: 'Finish online assessment',
    who: 'Halcyon Data',
    what: '90-minute coding test',
    when: 'Due Wed 7 Oct',
    tone: 'heather',
  },
  {
    id: 3,
    applicationId: 5,
    action: 'Decide on offer',
    who: 'Fernhill Robotics',
    what: 'Offer expires in 5 days',
    when: 'Fri 9 Oct',
    tone: 'pine',
  },
  {
    id: 4,
    applicationId: 6,
    action: 'Follow up',
    who: 'Tidepool',
    what: 'No reply in 17 days',
    when: 'Today',
    tone: 'bark',
  },
]

/** Applications still in APPLIED with no reply, and how long they've been quiet. */
export const sampleGoingQuiet = [
  { applicationId: 9, company: 'Lumen Ledger', position: 'API Engineer', daysQuiet: 19 },
  { applicationId: 6, company: 'Tidepool', position: 'Junior Backend Developer', daysQuiet: 17 },
  { applicationId: 7, company: 'Cobalt Health', position: 'Python Developer', daysQuiet: 9 },
  {
    applicationId: 11,
    company: 'Granite Cloud',
    position: 'Site Reliability Intern',
    daysQuiet: 5,
  },
]

export const SAMPLE_GHOST_AFTER_DAYS = 21

export const sampleEvents: StatusEvent[] = [
  {
    id: 1,
    application_id: 1,
    from_status: null,
    to_status: 'APPLIED',
    source: 'MANUAL',
    occurred_at: '2026-09-12T09:00:00Z',
    note: 'Applied through Lea’s referral link.',
  },
  {
    id: 2,
    application_id: 1,
    from_status: 'APPLIED',
    to_status: 'OA',
    source: 'EMAIL',
    occurred_at: '2026-09-20T11:05:00Z',
    note: 'Assessment invite from talent@northwind.example.',
  },
  {
    id: 3,
    application_id: 1,
    from_status: 'OA',
    to_status: 'INTERVIEWING',
    source: 'EMAIL',
    occurred_at: '2026-09-30T14:20:00Z',
    note: 'Recruiter invited you to a 45-minute technical screen.',
  },
]

export const sampleEmails: Email[] = [
  {
    id: 13,
    application_id: null,
    gmail_message_id: 'sample-3',
    sender: 'careers@meridian.example',
    subject: 'Meridian Maps: scheduling your interview',
    snippet:
      'Hi! The team enjoyed your application. Could you share a few time slots next week for a 30-minute call with our data platform lead?',
    received_at: '2026-10-03T10:00:00Z',
    classification: 'INTERVIEW_INVITE',
    confidence: 0.58,
    processed_at: '2026-10-03T10:02:00Z',
  },
  {
    id: 11,
    application_id: null,
    gmail_message_id: 'sample-1',
    sender: 'talent@halcyon.example',
    subject: 'Next steps for your Software Engineer application',
    snippet:
      'Thanks for applying. We would like to invite you to complete a 90-minute coding assessment on our platform within the next five days.',
    received_at: '2026-10-02T08:12:00Z',
    classification: 'OA_INVITE',
    confidence: 0.64,
    processed_at: '2026-10-02T08:15:00Z',
  },
  {
    id: 12,
    application_id: null,
    gmail_message_id: 'sample-2',
    sender: 'no-reply@greenhouse-mail.example',
    subject: 'An update on your application',
    snippet:
      'We appreciate your interest. After careful review we have decided to move forward with other candidates whose experience more closely matches.',
    received_at: '2026-10-01T17:40:00Z',
    classification: 'REJECTION',
    confidence: 0.72,
    processed_at: '2026-10-01T17:45:00Z',
  },
]

export interface SampleProvider {
  id: string
  name: string
  product: string
  keyPlaceholder: string
  /** null = no key needed (local models). */
  keyLabel: string | null
  connected: boolean
  lastFour: string | null
}

/** AI providers for the bring-your-own-key settings screen. */
export const sampleProviders: SampleProvider[] = [
  {
    id: 'anthropic',
    name: 'Anthropic',
    product: 'Claude',
    keyPlaceholder: 'sk-ant-…',
    keyLabel: 'API key',
    connected: true,
    lastFour: 'q7Xa',
  },
  {
    id: 'openai',
    name: 'OpenAI',
    product: 'GPT models',
    keyPlaceholder: 'sk-…',
    keyLabel: 'API key',
    connected: false,
    lastFour: null,
  },
  {
    id: 'google',
    name: 'Google',
    product: 'Gemini',
    keyPlaceholder: 'AIza…',
    keyLabel: 'API key',
    connected: false,
    lastFour: null,
  },
  {
    id: 'xai',
    name: 'xAI',
    product: 'Grok',
    keyPlaceholder: 'xai-…',
    keyLabel: 'API key',
    connected: false,
    lastFour: null,
  },
  {
    id: 'ollama',
    name: 'Ollama',
    product: 'Local models on your machine',
    keyPlaceholder: 'http://localhost:11434',
    keyLabel: null,
    connected: false,
    lastFour: null,
  },
]
