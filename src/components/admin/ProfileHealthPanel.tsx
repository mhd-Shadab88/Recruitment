import type { ProfileHealthReport } from '../../lib/profileHealth'
import { Card } from '../common/Card'

interface ProfileHealthPanelProps {
  report: ProfileHealthReport
}

export function ProfileHealthPanel({ report }: ProfileHealthPanelProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Card>
        <h3 className="text-sm font-semibold text-[var(--color-ink)]">Source coverage</h3>
        <p className="mt-2 text-sm">
          {report.sourceCoverage.accepted} accepted · {report.sourceCoverage.pendingReview} pending review ·{' '}
          {report.sourceCoverage.rejected} rejected (of {report.sourceCoverage.total} total)
        </p>
      </Card>

      <Card>
        <h3 className="text-sm font-semibold text-[var(--color-ink)]">Professional completeness</h3>
        <p className="mt-2 text-sm">
          {report.professionalCompleteness.score} / {report.professionalCompleteness.of} checks passed
        </p>
        <ul className="mt-2 list-inside list-disc text-xs text-[var(--color-muted)]">
          <li>Career entry present: {report.professionalCompleteness.hasCareerEntry ? 'yes' : 'no'}</li>
          <li>Expertise areas present: {report.professionalCompleteness.hasExpertise ? 'yes' : 'no'}</li>
          <li>
            External high-confidence source accepted:{' '}
            {report.professionalCompleteness.hasExternalHighConfidenceSource ? 'yes' : 'no'}
          </li>
        </ul>
        <p className="mt-2 text-xs italic text-[var(--color-muted)]">
          Methodology: a simple count of three checkable facts, not a subjective score.
        </p>
      </Card>

      <Card>
        <h3 className="text-sm font-semibold text-[var(--color-ink)]">Duplicate information</h3>
        {report.duplicateSignals.length === 0 ? (
          <p className="mt-2 text-sm text-[var(--color-muted)]">None detected.</p>
        ) : (
          <ul className="mt-2 list-inside list-disc text-xs">
            {report.duplicateSignals.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        )}
      </Card>

      <Card>
        <h3 className="text-sm font-semibold text-[var(--color-ink)]">Outdated information</h3>
        {report.outdatedSources.length === 0 ? (
          <p className="mt-2 text-sm text-[var(--color-muted)]">Nothing older than 180 days since last check.</p>
        ) : (
          <ul className="mt-2 list-inside list-disc text-xs">
            {report.outdatedSources.map((s) => (
              <li key={s.id}>
                {s.name} — last checked {s.lastChecked}
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card className="sm:col-span-2">
        <h3 className="text-sm font-semibold text-[var(--color-ink)]">Missing professional links</h3>
        {report.missingProfessionalLinks.length === 0 ? (
          <p className="mt-2 text-sm text-[var(--color-muted)]">All expected link types are represented.</p>
        ) : (
          <p className="mt-2 text-sm">{report.missingProfessionalLinks.join(', ')} not yet linked.</p>
        )}
      </Card>
    </div>
  )
}
