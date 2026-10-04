import Icon from './Icon'

interface PaginationProps {
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
}

/** "Showing 26–50 of 112" with previous/next. The caller owns the page number. */
export default function Pagination({ page, pageSize, total, onPageChange }: PaginationProps) {
  const pages = Math.max(1, Math.ceil(total / pageSize))
  const first = total === 0 ? 0 : (page - 1) * pageSize + 1
  const last = Math.min(page * pageSize, total)

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-between gap-4 border-t border-birch-200 px-4 py-3 text-sm"
    >
      <p className="tabular-nums text-bark-500">
        Showing {first}–{last} of {total}
      </p>
      <div className="flex items-center gap-1">
        <button
          type="button"
          className="btn-ghost px-2.5"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          <Icon name="chevronLeft" size={16} />
          Previous
        </button>
        <button
          type="button"
          className="btn-ghost px-2.5"
          disabled={page >= pages}
          onClick={() => onPageChange(page + 1)}
        >
          Next
          <Icon name="chevronRight" size={16} />
        </button>
      </div>
    </nav>
  )
}
