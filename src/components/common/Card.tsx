import type { HTMLAttributes, ReactNode } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  className?: string
}

export function Card({ children, className = '', ...rest }: CardProps) {
  return (
    <div
      className={`rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm ${className}`}
      {...rest}
    >
      {children}
    </div>
  )
}
