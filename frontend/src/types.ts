// Mirrors backend/app/models/enums.py and app/schemas. Keep them in sync.

export const APPLICATION_STATUSES = [
  'APPLIED',
  'OA',
  'INTERVIEWING',
  'OFFER',
  'ACCEPTED',
  'REJECTED',
  'GHOSTED',
  'WITHDRAWN',
] as const
export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number]

export type NextAction =
  'FOLLOW_UP' | 'WAITING' | 'PREPARE_OA' | 'PREPARE_INTERVIEW' | 'SEND_EMAIL' | 'DECIDE' | 'NONE'

export const APPLICATION_SOURCES = ['ATS', 'REFERRAL', 'LINKEDIN', 'COMPANY_SITE', 'OTHER'] as const
export type ApplicationSource = (typeof APPLICATION_SOURCES)[number]

export type EmailClassification =
  'REJECTION' | 'OA_INVITE' | 'INTERVIEW_INVITE' | 'OFFER' | 'CONFIRMATION' | 'OTHER'

export type EventSource = 'MANUAL' | 'EMAIL' | 'SYSTEM'

export interface Company {
  id: number
  name: string
  domain: string | null
  website: string | null
  location: string | null
  created_at: string
}

export interface Application {
  id: number
  company_id: number
  company: Company | null
  position: string
  job_url: string | null
  source: ApplicationSource
  location: string | null
  remote: boolean
  status: ApplicationStatus
  next_action: NextAction
  /** Plain date, "YYYY-MM-DD" (Python `date`). */
  applied_at: string
  last_activity_at: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface ApplicationPage {
  items: Application[]
  total: number
  page: number
  page_size: number
}

export interface StatusEvent {
  id: number
  application_id: number
  from_status: ApplicationStatus | null
  to_status: ApplicationStatus
  source: EventSource
  occurred_at: string
  note: string | null
}

export interface StatsSummary {
  total: number
  by_status: Partial<Record<ApplicationStatus, number>>
  response_rate: number
  oa_rate: number
  interview_rate: number
  avg_days_to_first_response: number | null
}

export interface WeeklyStats {
  weeks: { week_start: string; applications: number; goal: number }[]
  goal: number
}

export interface TokenResponse {
  access_token: string
  token_type: string
}

export interface Email {
  id: number
  application_id: number | null
  gmail_message_id: string
  sender: string
  subject: string
  snippet: string | null
  received_at: string
  classification: EmailClassification | null
  confidence: number | null
  processed_at: string | null
}

export interface EmailSyncResult {
  fetched: number
  matched: number
  unmatched: number
  status_updates: number
}

export type ApplicationSort = '-applied_at' | 'applied_at' | '-last_activity_at' | 'company'
