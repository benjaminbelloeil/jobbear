import type { ReactNode } from 'react'

import type { Email } from '../types'
import Icon from './Icon'
import { CLASSIFICATION_LABELS } from './statusStyles'

interface EmailReviewCardProps {
  email: Email
  /** Controls for this email, e.g. an application picker and a dismiss button. */
  actions?: ReactNode
}

const received = new Intl.DateTimeFormat(undefined, {
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
})

/**
 * One recruiter email waiting for a decision: what it says, what the classifier thinks
 * it is, and how sure it was. Shows the model's guess; never acts on it.
 */
export default function EmailReviewCard({ email, actions }: EmailReviewCardProps) {
  const confidence = email.confidence === null ? null : Math.round(email.confidence * 100)

  return (
    <article className="grid gap-5 px-5 py-5 sm:grid-cols-[1fr_13rem] sm:px-6">
      <div className="min-w-0">
        <p className="flex items-center gap-2 truncate text-sm text-bark-500">
          <Icon name="mail" size={16} />
          <span className="truncate">{email.sender}</span>
          <span aria-hidden>/</span>
          <time dateTime={email.received_at} className="whitespace-nowrap">
            {received.format(new Date(email.received_at))}
          </time>
        </p>
        <h2 className="mt-1.5 text-lg font-semibold leading-snug tracking-tight">
          {email.subject}
        </h2>
        {email.snippet && (
          <p className="mt-1.5 line-clamp-2 max-w-prose text-sm text-bark-700">{email.snippet}</p>
        )}
        {actions && <div className="mt-4 flex flex-wrap items-center gap-2">{actions}</div>}
      </div>

      <dl className="self-start rounded-control bg-birch px-4 py-3 text-sm">
        <dt className="text-bark-500">Looks like</dt>
        <dd className="mt-0.5 font-medium">
          {email.classification ? CLASSIFICATION_LABELS[email.classification] : 'Not classified'}
        </dd>
        <dt className="mt-3 text-bark-500">Model confidence</dt>
        <dd className="mt-1.5 flex items-center gap-2.5">
          <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-birch-300">
            <span
              className="fill-in block h-full rounded-full bg-bark"
              style={{ width: `${confidence ?? 0}%` }}
            />
          </span>
          <span className="w-9 text-right font-medium tabular-nums">
            {confidence === null ? '—' : `${confidence}%`}
          </span>
        </dd>
      </dl>
    </article>
  )
}
