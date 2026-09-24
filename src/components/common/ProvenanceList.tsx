import type { Claim } from '../../types'
import { ConfidenceBadge } from './ConfidenceBadge'

interface ProvenanceListProps {
  claims: Claim[]
}

/** Renders "where did this information come from" for a set of claims. */
export function ProvenanceList({ claims }: ProvenanceListProps) {
  if (claims.length === 0) {
    return <p className="text-xs italic text-[var(--color-muted)]">Not verified.</p>
  }

  return (
    <ul className="mt-3 space-y-2 border-t border-[var(--color-border)] pt-3">
      {claims.map((claim) => (
        <li key={claim.id} className="text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-medium text-[var(--color-ink-soft)]">{claim.source}</span>
            <ConfidenceBadge level={claim.confidence} />
            <span className="text-[var(--color-muted)]">verified {claim.last_verified}</span>
          </div>
          <p className="mt-1 text-[var(--color-muted)]">{claim.evidence}</p>
          {claim.url && (
            <a
              href={claim.url}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="text-[var(--color-accent)] underline underline-offset-2"
            >
              {claim.url}
            </a>
          )}
        </li>
      ))}
    </ul>
  )
}
