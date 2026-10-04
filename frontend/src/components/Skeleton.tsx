interface SkeletonProps {
  className?: string
}

/** Loading placeholder block. Size it with className (h-*, w-*). */
export default function Skeleton({ className = '' }: SkeletonProps) {
  return <div aria-hidden className={`animate-pulse rounded-control bg-birch-200 ${className}`} />
}
