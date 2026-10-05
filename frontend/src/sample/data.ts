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

/** This week's goals, shown in the sidebar and set in Settings → Goals. */
export interface SampleGoal {
  id: string
  label: string
  done: number
  target: number
}

// TODO(me): applications and follow-ups can be counted from status_events for the current
//   week; referral asks are ticked off by hand (or dropped) once goals are stored per user.
export const sampleGoals: SampleGoal[] = [
  { id: 'applications', label: 'Applications', done: 4, target: 8 },
  { id: 'follow-ups', label: 'Follow-ups', done: 2, target: 3 },
  { id: 'referrals', label: 'Referral asks', done: 2, target: 2 },
]

/** Goals met (true) or missed (false) in each of the last four weeks, oldest first. */
export const sampleGoalHistory: { weeks: string[]; met: Record<string, boolean[]> } = {
  weeks: ['2026-09-07', '2026-09-14', '2026-09-21', '2026-09-28'],
  met: {
    applications: [true, false, true, false],
    'follow-ups': [true, true, false, true],
    referrals: [false, true, true, true],
  },
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
    id: 4,
    applicationId: 6,
    action: 'Follow up',
    who: 'Tidepool',
    what: 'No reply in 17 days',
    when: 'Today',
    tone: 'bark',
  },
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

// --- Resume versions, saved postings and keyword match (v2, see CLAUDE.md "Business model"
// and the README roadmap). These shapes are proposals for the screens only: when you build
// the backend, design the real schemas yourself and mirror them in types.ts.

export interface SampleResume {
  id: number
  name: string
  file_name: string
  updated_at: string
  applications: number
  /** 0–1 */
  response_rate: number
  /** 0–1 */
  interview_rate: number
}

// prettier-ignore
export const sampleResumes: SampleResume[] = [
  { id: 1, name: 'Backend v3', file_name: 'backend-v3.pdf', updated_at: '2026-09-10', applications: 21, response_rate: 0.38, interview_rate: 0.14 },
  { id: 2, name: 'Backend v2', file_name: 'backend-v2.pdf', updated_at: '2026-08-14', applications: 14, response_rate: 0.21, interview_rate: 0.07 },
  { id: 3, name: 'Full-stack', file_name: 'fullstack.pdf', updated_at: '2026-08-20', applications: 9, response_rate: 0.22, interview_rate: 0.11 },
  { id: 4, name: 'Data and ML', file_name: 'data-ml.pdf', updated_at: '2026-09-01', applications: 4, response_rate: 0.25, interview_rate: 0 },
]

/** Fewer sends than this and a rate says more about luck than about the resume. */
export const SAMPLE_MIN_SENDS_TO_COMPARE = 5

/** Which resume went out with each sample application, by application id. */
// prettier-ignore
export const sampleResumeByApplication: Record<number, number> = {
  1: 1, 2: 1, 3: 2, 4: 3, 5: 1, 6: 2, 7: 1, 8: 4, 9: 1, 10: 3, 11: 1, 12: 4,
}

/** The posting text saved with an application, by application id. */
export const samplePostings: Record<number, { saved_at: string; text: string }> = {
  1: {
    saved_at: '2026-09-12',
    text: `Northwind Labs builds the payments API behind 2,000 online shops. As a Backend Engineer Intern you'll join the payments team for six months and ship to production from week two.

What you'll do
- Build and maintain REST APIs in Python (FastAPI)
- Design PostgreSQL schemas and write the migrations
- Write tests with pytest and keep CI/CD green
- Help move our event pipeline to Kafka

What we're looking for
- Python and SQL you can show us (projects count)
- Some experience with Docker
- Curiosity about Kubernetes and distributed systems
- Clear written communication in English`,
  },
}

export interface SampleKeywordMatch {
  resume_id: number
  matched: string[]
  missing: string[]
}

/** Skills from the saved posting found (or not) in the resume that was sent, by application id. */
export const sampleKeywordMatch: Record<number, SampleKeywordMatch> = {
  1: {
    resume_id: 1,
    matched: ['Python', 'FastAPI', 'REST APIs', 'PostgreSQL', 'SQL', 'pytest', 'CI/CD', 'Docker'],
    missing: ['Kafka', 'Kubernetes'],
  },
}

export interface SampleEmailLink {
  id: number
  /** What the link is for, so the UI can pick an icon and a label. */
  kind: 'ASSESSMENT' | 'SCHEDULING' | 'POSTING' | 'OTHER'
  label: string
  url: string
  from: string
  found_at: string
}

/** Links pulled from recruiter emails during sync, newest first, by application id. */
export const sampleEmailLinks: Record<number, SampleEmailLink[]> = {
  1: [
    {
      id: 3,
      kind: 'SCHEDULING',
      label: 'Book your technical screen',
      url: 'https://cal.example/northwind/tech-screen',
      from: 'talent@northwind.example',
      found_at: '2026-09-30T14:20:00Z',
    },
    {
      id: 2,
      kind: 'OTHER',
      label: 'How we interview',
      url: 'https://northwind.example/careers/interview-guide',
      from: 'talent@northwind.example',
      found_at: '2026-09-30T14:20:00Z',
    },
    {
      id: 1,
      kind: 'ASSESSMENT',
      label: 'Online assessment',
      url: 'https://assess.codeforge.example/northwind/7f3k',
      from: 'talent@northwind.example',
      found_at: '2026-09-20T11:05:00Z',
    },
  ],
}

/** "Today" for the sample calendar, so the agenda groups the same way on every visit. */
export const SAMPLE_TODAY = '2026-10-05'

export interface SampleAgendaItem {
  id: number
  application_id: number
  kind: 'INTERVIEW' | 'ASSESSMENT' | 'FOLLOW_UP' | 'DECISION'
  title: string
  /** Local date and time, "YYYY-MM-DDTHH:mm"; no time means it's due that day. */
  at: string
  minutes?: number
}

/** Interviews, assessment deadlines, decisions and follow-ups, from emails and next steps. */
// prettier-ignore
export const sampleAgenda: SampleAgendaItem[] = [
  { id: 1, application_id: 6, kind: 'FOLLOW_UP', title: 'Follow up: no reply in 17 days', at: '2026-10-05' },
  { id: 2, application_id: 1, kind: 'INTERVIEW', title: 'Technical screen', at: '2026-10-06T14:00', minutes: 45 },
  { id: 3, application_id: 2, kind: 'ASSESSMENT', title: 'Online assessment due', at: '2026-10-07T23:59', minutes: 90 },
  { id: 4, application_id: 5, kind: 'DECISION', title: 'Offer expires', at: '2026-10-09' },
  { id: 5, application_id: 8, kind: 'INTERVIEW', title: 'Call with the data platform lead', at: '2026-10-12T10:00', minutes: 30 },
  { id: 6, application_id: 9, kind: 'FOLLOW_UP', title: 'Follow up: three weeks quiet', at: '2026-10-15' },
  { id: 7, application_id: 11, kind: 'FOLLOW_UP', title: 'Follow up: two weeks quiet', at: '2026-10-21' },
]

/** The signed-in person and what they are looking for (Profile page). Fictional. */
export const sampleProfile = {
  name: 'Sam Keller',
  email: 'sam@example.com',
  searching_since: '2026-07-27',
  roles: ['Backend Engineer', 'Platform Engineer', 'Python Developer'],
  locations: ['Zürich', 'Basel', 'Remote'],
  work_styles: ['Hybrid', 'Remote'],
}

/** Settings → AI model: this month's reading, so a BYOK user can see what it costs. */
export const sampleAiUsage = {
  emails_read: 182,
  acted_alone: 141,
  sent_to_inbox: 41,
  cost_usd: 0.42,
  cap_usd: 5,
}

/** Settings → Email: the inbox connection. Times are local. */
export const sampleSync = {
  account: 'you@gmail.com',
  last_checked: '2026-10-05T14:02',
  next_in_minutes: 38,
  checked_today: 64,
  matched_today: 5,
}

export const sampleIgnoredSenders = ['alerts@jobboard.example', 'newsletter@careers.example']

/** Settings → Privacy: the last few emails the model read, and what it decided. */
// prettier-ignore
export const sampleAiLog = [
  { id: 1, at: '2026-10-05T14:02', sender: 'northwind.example', found: 'Interview date', confidence: 0.96, acted: true },
  { id: 2, at: '2026-10-05T11:40', sender: 'halcyon.example', found: 'Assessment invite', confidence: 0.91, acted: true },
  { id: 3, at: '2026-10-04T18:15', sender: 'lumen.example', found: 'Maybe a rejection', confidence: 0.62, acted: false },
  { id: 4, at: '2026-10-04T09:03', sender: 'jobboard.example', found: 'Not about an application', confidence: 0.88, acted: true },
  { id: 5, at: '2026-10-03T16:47', sender: 'fernhill.example', found: 'Offer', confidence: 0.94, acted: true },
]

/** Settings → Privacy: what JobBear keeps, by kind. */
export const sampleStorage = [
  { label: 'Applications and their history', count: '48 applications', size: '96 KB' },
  { label: 'Email snippets', count: '112 emails', size: '340 KB' },
  { label: 'Saved job postings', count: '31 postings', size: '210 KB' },
  { label: 'Resume files', count: '4 PDFs', size: '1.2 MB' },
]
