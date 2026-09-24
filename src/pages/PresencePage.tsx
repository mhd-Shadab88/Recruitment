import { useResearchData } from '../hooks/useResearchData'
import { buildRelationshipGraph } from '../lib/graph'
import { Section } from '../components/common/Section'
import { EmptyState } from '../components/common/EmptyState'
import { SourceCard } from '../components/presence/SourceCard'
import { SourceGraph } from '../components/graph/SourceGraph'

export function PresencePage() {
  const { bundle, allSources } = useResearchData()
  const visible = allSources.filter((s) => s.status !== 'rejected')
  const rejected = allSources.filter((s) => s.status === 'rejected')
  const graph = buildRelationshipGraph(bundle, allSources)

  return (
    <div>
      <Section
        eyebrow="Online presence"
        title="Discovered sources"
        description="Every source shown here carries its confidence level, why it was matched, and when it was last checked. Nothing is presented as confirmed unless a claim behind it says so."
      >
        {visible.length === 0 ? (
          <EmptyState
            title="No sources yet"
            description="No sources have been discovered or added. Run research from the Admin page to populate this list."
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {visible.map((source) => (
              <SourceCard key={source.id} source={source} />
            ))}
          </div>
        )}
      </Section>

      {rejected.length > 0 && (
        <Section
          title="Rejected / probably-not-me sources"
          description="Kept visible for transparency about what the research pipeline considered and ruled out."
          className="border-t border-[var(--color-border)]"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            {rejected.map((source) => (
              <SourceCard key={source.id} source={source} />
            ))}
          </div>
        </Section>
      )}

      <Section
        title="Relationship graph"
        description="Person → discovered sources → projects → skill categories."
        className="border-t border-[var(--color-border)]"
      >
        <SourceGraph graph={graph} />
      </Section>
    </div>
  )
}
