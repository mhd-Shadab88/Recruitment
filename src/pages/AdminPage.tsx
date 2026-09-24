import { useState } from 'react'
import { useResearchData } from '../hooks/useResearchData'
import { computeProfileHealth } from '../lib/profileHealth'
import { Section } from '../components/common/Section'
import { Card } from '../components/common/Card'
import { Badge } from '../components/common/Badge'
import { ConfidenceBadge } from '../components/common/ConfidenceBadge'
import { EmptyState } from '../components/common/EmptyState'
import { ProfileHealthPanel } from '../components/admin/ProfileHealthPanel'

export function AdminPage() {
  const { bundle, allSources, runSources, lastRun, isRunning, error, runNow, setSourceStatus, resetRunSources } =
    useResearchData()
  const [reviewOnly, setReviewOnly] = useState(false)
  const healthReport = computeProfileHealth(bundle, allSources)

  const accepted = allSources.filter((s) => s.status === 'accepted').length
  const pendingReview = allSources.filter((s) => s.status === 'pending_review').length
  const rejected = allSources.filter((s) => s.status === 'rejected').length

  const reviewList = allSources.filter(
    (s) => s.status === 'pending_review' && (s.confidence === 'medium' || s.confidence === 'low'),
  )
  const displayList = reviewOnly ? reviewList : allSources

  return (
    <div>
      <Section
        eyebrow="Admin"
        title="Research status"
        description="This page is a demo/service abstraction: it does not perform live web searches. It runs the same research pipeline (search → normalize → dedupe → identity scoring) against a demo search provider that returns clearly-labeled synthetic data, so the pipeline's behaviour can be inspected honestly. See PROJECT_DECISIONS.md for why no live provider is wired in by default."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <p className="text-xs text-[var(--color-muted)]">Sources discovered</p>
            <p className="mt-1 text-2xl font-semibold text-[var(--color-ink)]">{allSources.length}</p>
          </Card>
          <Card>
            <p className="text-xs text-[var(--color-muted)]">Accepted</p>
            <p className="mt-1 text-2xl font-semibold text-[var(--color-ink)]">{accepted}</p>
          </Card>
          <Card>
            <p className="text-xs text-[var(--color-muted)]">Pending review</p>
            <p className="mt-1 text-2xl font-semibold text-[var(--color-ink)]">{pendingReview}</p>
          </Card>
          <Card>
            <p className="text-xs text-[var(--color-muted)]">Rejected</p>
            <p className="mt-1 text-2xl font-semibold text-[var(--color-ink)]">{rejected}</p>
          </Card>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={runNow}
            disabled={isRunning}
            className="rounded-md bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
          >
            {isRunning ? 'Running research…' : 'Run Research'}
          </button>
          <button
            type="button"
            onClick={runNow}
            disabled={isRunning}
            className="rounded-md border border-[var(--color-border)] px-4 py-2 text-sm font-medium text-[var(--color-ink-soft)] disabled:opacity-60"
          >
            Refresh Sources
          </button>
          <button
            type="button"
            onClick={() => setReviewOnly((v) => !v)}
            className="rounded-md border border-[var(--color-border)] px-4 py-2 text-sm font-medium text-[var(--color-ink-soft)]"
          >
            {reviewOnly ? 'Show all sources' : `Review Uncertain Matches (${reviewList.length})`}
          </button>
          {runSources.length > 0 && (
            <button
              type="button"
              onClick={resetRunSources}
              className="rounded-md border border-[var(--color-border)] px-4 py-2 text-sm font-medium text-[var(--color-ink-soft)]"
            >
              Clear research run
            </button>
          )}
        </div>

        {error && <p className="mt-3 text-sm text-[var(--color-confidence-low)]">{error}</p>}

        {lastRun && (
          <Card className="mt-6">
            <h3 className="text-sm font-semibold text-[var(--color-ink)]">Last scan</h3>
            <dl className="mt-3 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
              <div>
                <dt className="text-xs text-[var(--color-muted)]">Provider</dt>
                <dd>{lastRun.provider} (demo)</dd>
              </div>
              <div>
                <dt className="text-xs text-[var(--color-muted)]">Run at</dt>
                <dd>{new Date(lastRun.runAt).toLocaleString()}</dd>
              </div>
              <div>
                <dt className="text-xs text-[var(--color-muted)]">Results found</dt>
                <dd>{lastRun.found}</dd>
              </div>
              <div>
                <dt className="text-xs text-[var(--color-muted)]">Duplicates removed</dt>
                <dd>{lastRun.duplicates}</dd>
              </div>
              <div>
                <dt className="text-xs text-[var(--color-muted)]">Auto-rejected</dt>
                <dd>{lastRun.rejected}</dd>
              </div>
              <div>
                <dt className="text-xs text-[var(--color-muted)]">Needs review</dt>
                <dd>{lastRun.pendingReview}</dd>
              </div>
            </dl>
          </Card>
        )}
      </Section>

      <Section
        title={reviewOnly ? 'Uncertain matches' : 'All sources'}
        className="border-t border-[var(--color-border)]"
      >
        {displayList.length === 0 ? (
          <EmptyState
            title={reviewOnly ? 'Nothing needs review' : 'No sources yet'}
            description={reviewOnly ? 'No medium/low confidence sources are pending review.' : 'Run research to populate this list.'}
          />
        ) : (
          <div className="space-y-3">
            {displayList.map((source) => (
              <Card key={source.id} className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium text-[var(--color-ink)]">{source.name}</p>
                    <ConfidenceBadge level={source.confidence} />
                    {source.isDemo && <Badge className="border-[var(--color-gold)] text-[var(--color-gold)]">Demo</Badge>}
                  </div>
                  <p className="mt-1 truncate text-xs text-[var(--color-muted)]">{source.confidenceRationale}</p>
                </div>
                {source.id.startsWith('source-run-') && (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setSourceStatus(source.id, 'accepted')}
                      disabled={source.status === 'accepted'}
                      className="rounded-md border border-[var(--color-border)] px-3 py-1.5 text-xs font-medium disabled:opacity-40"
                    >
                      Accept
                    </button>
                    <button
                      type="button"
                      onClick={() => setSourceStatus(source.id, 'rejected')}
                      disabled={source.status === 'rejected'}
                      className="rounded-md border border-[var(--color-border)] px-3 py-1.5 text-xs font-medium disabled:opacity-40"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </Section>

      <Section
        title="Profile health"
        description="A transparent, methodology-visible view of coverage and gaps — not a subjective personal score."
        className="border-t border-[var(--color-border)]"
      >
        <ProfileHealthPanel report={healthReport} />
      </Section>
    </div>
  )
}
