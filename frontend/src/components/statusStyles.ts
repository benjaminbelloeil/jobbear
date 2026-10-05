import type {
  ApplicationSource,
  ApplicationStatus,
  EmailClassification,
  EventSource,
  NextAction,
} from '../types'

// Presentation metadata for enums: human labels, badge classes, and a hex for charts.
// Colours follow the theme: honey = in motion, pine = good news, berry = no, ash = silence.

export const STATUS_META: Record<
  ApplicationStatus,
  { label: string; badge: string; dot: string; hex: string }
> = {
  APPLIED: {
    label: 'Applied',
    badge: 'bg-lake-50 text-lake ring-lake/25',
    dot: 'bg-lake',
    hex: '#3F6E8C',
  },
  OA: {
    label: 'OA',
    badge: 'bg-heather-50 text-heather ring-heather/25',
    dot: 'bg-heather',
    hex: '#6D5A9E',
  },
  INTERVIEWING: {
    label: 'Interviewing',
    badge: 'bg-honey-50 text-honey-800 ring-honey/40',
    dot: 'bg-honey',
    hex: '#E9A825',
  },
  OFFER: {
    label: 'Offer',
    badge: 'bg-pine-50 text-pine ring-pine/25',
    dot: 'bg-pine',
    hex: '#2E5E4E',
  },
  ACCEPTED: {
    label: 'Accepted',
    badge: 'bg-pine text-birch-50 ring-pine-700',
    dot: 'bg-pine-700',
    hex: '#214539',
  },
  REJECTED: {
    label: 'Rejected',
    badge: 'bg-berry-50 text-berry ring-berry/25',
    dot: 'bg-berry',
    hex: '#B23A55',
  },
  GHOSTED: {
    label: 'Ghosted',
    badge: 'bg-ash-50 text-bark-500 ring-ash/30',
    dot: 'bg-ash',
    hex: '#8A8A84',
  },
  WITHDRAWN: {
    label: 'Withdrawn',
    badge: 'bg-transparent text-bark-500 ring-birch-300',
    dot: 'bg-ash/60',
    hex: '#B5B6AA',
  },
}

export const SOURCE_LABELS: Record<ApplicationSource, string> = {
  ATS: 'Job board / ATS',
  REFERRAL: 'Referral',
  LINKEDIN: 'LinkedIn',
  COMPANY_SITE: 'Company site',
  OTHER: 'Other',
}

export const NEXT_ACTION_LABELS: Record<NextAction, string> = {
  FOLLOW_UP: 'Follow up',
  WAITING: 'Waiting',
  PREPARE_OA: 'Prepare for OA',
  PREPARE_INTERVIEW: 'Prepare for interview',
  SEND_EMAIL: 'Send email',
  DECIDE: 'Decide',
  NONE: '—',
}

export const EVENT_SOURCE_LABELS: Record<EventSource, string> = {
  MANUAL: 'You',
  EMAIL: 'From email',
  SYSTEM: 'Automatic',
}

export const CLASSIFICATION_LABELS: Record<EmailClassification, string> = {
  REJECTION: 'Rejection',
  OA_INVITE: 'Online assessment',
  INTERVIEW_INVITE: 'Interview invite',
  OFFER: 'Offer',
  CONFIRMATION: 'Application received',
  OTHER: 'Other',
}

export type PanelTone = 'honey' | 'pine' | 'lake' | 'heather' | 'berry' | 'bark'

/** Tinted tile behind a panel or row icon. Shared so tones mean the same thing everywhere. */
export const TONE_TILE: Record<PanelTone, string> = {
  honey: 'bg-honey-50 text-honey-800 ring-1 ring-inset ring-honey/30',
  pine: 'bg-pine-50 text-pine ring-1 ring-inset ring-pine/20',
  lake: 'bg-lake-50 text-lake ring-1 ring-inset ring-lake/20',
  heather: 'bg-heather-50 text-heather ring-1 ring-inset ring-heather/20',
  berry: 'bg-berry-50 text-berry ring-1 ring-inset ring-berry/20',
  bark: 'bg-birch-200/70 text-bark ring-1 ring-inset ring-birch-300',
}
