import { render, screen } from '@testing-library/react'

import { APPLICATION_STATUSES } from '../types'
import StatusBadge from './StatusBadge'

describe('StatusBadge', () => {
  it('renders a human-readable label', () => {
    render(<StatusBadge status="INTERVIEWING" />)
    expect(screen.getByText('Interviewing')).toBeInTheDocument()
  })

  it.each(APPLICATION_STATUSES)('renders a badge for %s', (status) => {
    const { container } = render(<StatusBadge status={status} />)
    expect(container.firstChild).toHaveClass('rounded-full')
  })
})
