import { Link } from 'react-router-dom'
import { useResearchData } from '../hooks/useResearchData'
import { Card } from '../components/common/Card'
import { Badge } from '../components/common/Badge'

export function HomePage() {
  const { bundle, allSources, lastRun } = useResearchData()
  const { profile } = bundle

  const highConfidenceCount = allSources.filter(
    (s) => s.confidence === 'high' && s.status !== 'rejected',
  ).length
  const totalDiscovered = allSources.filter((s) => s.status !== 'rejected').length
  const lastResearchDate = lastRun ? lastRun.runAt.slice(0, 10) : profile.lastResearchDate

  return (
    <div>
      <section className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-20 md:grid-cols-[1.3fr_1fr] md:items-center">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-gold)]">
              Personal profile intelligence
            </p>
            <h1 className="text-4xl font-semibold text-[var(--color-ink)] sm:text-5xl">{profile.name}</h1>
            <p className="mt-3 text-lg text-[var(--color-ink-soft)]">{profile.headline}</p>
            <p className="mt-5 max-w-xl text-[15px] leading-relaxed">{profile.summary}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {profile.focusAreas.slice(0, 6).map((area) => (
                <Badge key={area}>{area}</Badge>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/profile"
                className="rounded-md bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-white"
              >
                View professional profile
              </Link>
              <Link
                to="/presence"
                className="rounded-md border border-[var(--color-border)] px-4 py-2 text-sm font-medium text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]"
              >
                See online presence
              </Link>
            </div>
          </div>

          <Card>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--color-muted)]">
              Online presence overview
            </h2>
            <dl className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <dt className="text-xs text-[var(--color-muted)]">Sources discovered</dt>
                <dd className="text-2xl font-semibold text-[var(--color-ink)]">{totalDiscovered}</dd>
              </div>
              <div>
                <dt className="text-xs text-[var(--color-muted)]">High-confidence sources</dt>
                <dd className="text-2xl font-semibold text-[var(--color-ink)]">{highConfidenceCount}</dd>
              </div>
              <div className="col-span-2">
                <dt className="text-xs text-[var(--color-muted)]">Last research date</dt>
                <dd className="text-sm font-medium text-[var(--color-ink)]">{lastResearchDate}</dd>
              </div>
            </dl>
            <p className="mt-4 text-xs text-[var(--color-muted)]">
              These numbers reflect the demo research pipeline described on the{' '}
              <Link to="/admin" className="underline underline-offset-2">
                Admin
              </Link>{' '}
              page — see it for what&apos;s real vs. illustrative.
            </p>
          </Card>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-16">
        <h2 className="text-2xl font-semibold text-[var(--color-ink)]">Key areas of expertise</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {profile.expertise.map((area) => (
            <Card key={area.id}>
              <h3 className="font-medium text-[var(--color-ink)]">{area.label}</h3>
              <p className="mt-2 text-sm">{area.description}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
