import type { ConfidenceLevel } from '../../types'

const LABELS: Record<ConfidenceLevel, string> = {
  high: 'High confidence',
  medium: 'Medium confidence',
  low: 'Low confidence',
  probably_not: 'Probably not me',
}

const COLOR_VAR: Record<ConfidenceLevel, string> = {
  high: 'var(--color-confidence-high)',
  medium: 'var(--color-confidence-medium)',
  low: 'var(--color-confidence-low)',
  probably_not: 'var(--color-confidence-none)',
}

interface ConfidenceBadgeProps {
  level: ConfidenceLevel
  className?: string
}

export function ConfidenceBadge({ level, className = '' }: ConfidenceBadgeProps) {
  const color = COLOR_VAR[level]
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${className}`}
      style={{ color, borderColor: color, backgroundColor: 'color-mix(in srgb, ' + color + ' 12%, transparent)' }}
      data-testid="confidence-badge"
      data-level={level}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} aria-hidden="true" />
      {LABELS[level]}
    </span>
  )
}
