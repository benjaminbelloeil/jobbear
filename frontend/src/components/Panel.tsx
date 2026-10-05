import type { CSSProperties, ReactNode } from 'react'

import Icon, { type IconName } from './Icon'
import { type PanelTone, TONE_TILE } from './statusStyles'

interface PanelProps {
  title?: string
  description?: ReactNode
  actions?: ReactNode
  /** Optional icon on a tinted tile beside the title. */
  icon?: IconName
  iconTone?: PanelTone
  id?: string
  className?: string
  style?: CSSProperties
  children: ReactNode
}

/** A titled surface for grouping a chart, list, or form on a page. */
export default function Panel({
  title,
  description,
  actions,
  icon,
  iconTone = 'bark',
  id,
  className = '',
  style,
  children,
}: PanelProps) {
  return (
    <section id={id} className={`panel min-w-0 scroll-mt-24 p-5 sm:p-6 ${className}`} style={style}>
      {(title || actions) && (
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            {icon && (
              <span className={`icon-tile ${TONE_TILE[iconTone]}`}>
                <Icon name={icon} size={18} />
              </span>
            )}
            <div className="min-w-0">
              {title && <h2 className="text-lg font-bold tracking-tight">{title}</h2>}
              {description && <p className="mt-0.5 text-sm text-bark-500">{description}</p>}
            </div>
          </div>
          {actions}
        </div>
      )}
      {children}
    </section>
  )
}
