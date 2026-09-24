import type { Source } from '../../types'
import { Card } from '../common/Card'
import { ConfidenceBadge } from '../common/ConfidenceBadge'
import { Badge } from '../common/Badge'

const TYPE_LABELS: Record<Source['type'], string> = {
  self_reported: 'Self-reported',
  linkedin: 'LinkedIn',
  github: 'GitHub',
  personal_website: 'Personal website',
  article: 'Article',
  publication: 'Publication',
  presentation: 'Presentation',
  social_profile: 'Social profile',
  project_page: 'Project page',
  mention: 'Mention',
  other: 'Other',
}

interface SourceCardProps {
  source: Source
}

export function SourceCard({ source }: SourceCardProps) {
  return (
    <Card data-testid="source-card">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-medium text-[var(--color-ink)]">{source.name}</h3>
          {source.url ? (
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="mt-0.5 block truncate text-xs text-[var(--color-accent)] underline underline-offset-2"
            >
              {source.url}
            </a>
          ) : (
            <p className="mt-0.5 text-xs italic text-[var(--color-muted)]">No URL — source could not be verified.</p>
          )}
        </div>
        <ConfidenceBadge level={source.confidence} />
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <Badge>{TYPE_LABELS[source.type]}</Badge>
        {source.isDemo && (
          <Badge className="border-[var(--color-gold)] text-[var(--color-gold)]">Demo data — not real</Badge>
        )}
        <Badge>Last checked {source.lastChecked}</Badge>
      </div>

      {source.description && <p className="mt-3 text-sm">{source.description}</p>}

      {source.matchSignals.length > 0 && (
        <div className="mt-3 border-t border-[var(--color-border)] pt-3">
          <p className="text-xs font-medium text-[var(--color-ink-soft)]">Why this was matched</p>
          <ul className="mt-1 list-inside list-disc text-xs text-[var(--color-muted)]">
            {source.matchSignals.map((signal) => (
              <li key={signal}>{signal}</li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-[var(--color-muted)]">{source.confidenceRationale}</p>
        </div>
      )}
    </Card>
  )
}
