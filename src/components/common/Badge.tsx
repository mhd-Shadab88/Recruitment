import type { ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode
  className?: string
}

export function Badge({ children, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border border-[var(--color-border)] bg-[var(--color-accent-soft)] px-3 py-1 text-xs font-medium text-[var(--color-ink-soft)] ${className}`}
    >
      {children}
    </span>
  )
}
