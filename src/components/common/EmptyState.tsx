interface EmptyStateProps {
  title: string
  description?: string
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div
      className="rounded-xl border border-dashed border-[var(--color-border)] px-6 py-12 text-center"
      data-testid="empty-state"
    >
      <p className="font-medium text-[var(--color-ink)]">{title}</p>
      {description && <p className="mt-2 text-sm text-[var(--color-muted)]">{description}</p>}
    </div>
  )
}
