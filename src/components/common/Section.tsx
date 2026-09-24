import type { ReactNode } from 'react'

interface SectionProps {
  id?: string
  eyebrow?: string
  title: string
  description?: string
  children: ReactNode
  className?: string
}

export function Section({ id, eyebrow, title, description, children, className = '' }: SectionProps) {
  return (
    <section id={id} className={`mx-auto w-full max-w-6xl px-6 py-16 ${className}`}>
      <div className="mb-10 max-w-2xl">
        {eyebrow && (
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-gold)]">
            {eyebrow}
          </p>
        )}
        <h2 className="text-2xl font-semibold text-[var(--color-ink)] sm:text-3xl">{title}</h2>
        {description && <p className="mt-3 text-[15px] leading-relaxed">{description}</p>}
      </div>
      {children}
    </section>
  )
}
