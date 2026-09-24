import { useResearchData } from '../hooks/useResearchData'
import { getClaimsByIds } from '../lib/dataLoader'
import { exportAsJson, exportAsMarkdown, downloadTextFile } from '../lib/exporters'
import { Section } from '../components/common/Section'
import { Card } from '../components/common/Card'
import { Badge } from '../components/common/Badge'
import { ProvenanceList } from '../components/common/ProvenanceList'

export function ProfilePage() {
  const { bundle, allSources } = useResearchData()
  const { profile, claims } = bundle

  return (
    <div>
      <Section
        eyebrow="Professional profile"
        title="Career"
        description="A timeline built only from information provided directly by the profile owner, with provenance shown for every entry."
      >
        <ol className="space-y-6 border-l border-[var(--color-border)] pl-6">
          {profile.career.map((entry) => (
            <li key={entry.id} className="relative">
              <span className="absolute -left-[27px] top-1.5 h-2.5 w-2.5 rounded-full bg-[var(--color-accent)]" />
              <Card>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-medium text-[var(--color-ink)]">{entry.title}</h3>
                  <span className="text-xs text-[var(--color-muted)]">{entry.period}</span>
                </div>
                <p className="mt-2 text-sm">{entry.summary}</p>
                <ProvenanceList claims={getClaimsByIds(claims, entry.claimIds)} />
              </Card>
            </li>
          ))}
        </ol>
      </Section>

      <Section
        title="Expertise"
        description="Areas of applied focus, as described by the profile owner."
        className="border-t border-[var(--color-border)]"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {profile.expertise.map((area) => (
            <Card key={area.id}>
              <h3 className="font-medium text-[var(--color-ink)]">{area.label}</h3>
              <p className="mt-2 text-sm">{area.description}</p>
              <ProvenanceList claims={getClaimsByIds(claims, area.claimIds)} />
            </Card>
          ))}
        </div>
      </Section>

      <Section
        title="Professional interests"
        className="border-t border-[var(--color-border)]"
      >
        <div className="flex flex-wrap gap-2">
          {profile.professionalInterests.map((interest) => (
            <Badge key={interest}>{interest}</Badge>
          ))}
        </div>
      </Section>

      <Section
        title="Personal interests"
        description="Included for a fuller picture — these are not professional claims."
        className="border-t border-[var(--color-border)]"
      >
        <div className="flex flex-wrap gap-2">
          {profile.personalInterests.map((interest) => (
            <Badge key={interest}>{interest}</Badge>
          ))}
        </div>
      </Section>

      <Section
        title="Export profile"
        description="Export what's currently stored — the same data shown across this site, nothing more."
        className="border-t border-[var(--color-border)] no-print"
      >
        <Card className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => downloadTextFile('shadab-profile.json', exportAsJson(bundle, allSources), 'application/json')}
            className="rounded-md border border-[var(--color-border)] px-4 py-2 text-sm font-medium text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]"
          >
            Export as JSON
          </button>
          <button
            type="button"
            onClick={() =>
              downloadTextFile('shadab-profile.md', exportAsMarkdown(bundle, allSources), 'text/markdown')
            }
            className="rounded-md border border-[var(--color-border)] px-4 py-2 text-sm font-medium text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]"
          >
            Export as Markdown
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-md border border-[var(--color-border)] px-4 py-2 text-sm font-medium text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]"
          >
            Print / save as PDF
          </button>
        </Card>
      </Section>
    </div>
  )
}
