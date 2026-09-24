import { useResearchData } from '../hooks/useResearchData'
import { getClaimsByIds } from '../lib/dataLoader'
import { Section } from '../components/common/Section'
import { Card } from '../components/common/Card'
import { Badge } from '../components/common/Badge'
import { ProvenanceList } from '../components/common/ProvenanceList'

const STATUS_LABELS: Record<string, string> = {
  active: 'Active',
  ongoing: 'Ongoing',
  concept: 'Concept',
}

export function ProjectsPage() {
  const { bundle } = useResearchData()
  const { projects, claims } = bundle

  return (
    <Section
      eyebrow="Projects"
      title="Projects"
      description="Projects the profile owner reported working on, with focus areas and provenance."
    >
      <div className="grid gap-6 md:grid-cols-3">
        {projects.map((project) => (
          <Card key={project.id} className="flex flex-col">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-medium text-[var(--color-ink)]">{project.name}</h3>
              <Badge>{STATUS_LABELS[project.status]}</Badge>
            </div>
            <p className="mt-1 text-sm font-medium text-[var(--color-gold)]">{project.tagline}</p>
            <p className="mt-3 text-sm">{project.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {project.focus.map((f) => (
                <Badge key={f}>{f}</Badge>
              ))}
            </div>
            <div className="mt-auto">
              <ProvenanceList claims={getClaimsByIds(claims, project.claimIds)} />
            </div>
          </Card>
        ))}
      </div>
    </Section>
  )
}
