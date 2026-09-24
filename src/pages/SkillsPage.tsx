import { useResearchData } from '../hooks/useResearchData'
import { Section } from '../components/common/Section'
import { Card } from '../components/common/Card'
import { Badge } from '../components/common/Badge'

export function SkillsPage() {
  const { bundle } = useResearchData()
  const { skillCategories } = bundle

  return (
    <Section
      eyebrow="Skills"
      title="Skills"
      description="Grouped by category. These reflect the profile owner's self-reported focus areas and interests — not skills independently confirmed by a public source. See each skill category for provenance."
    >
      <div className="grid gap-6 sm:grid-cols-2">
        {skillCategories.map((category) => (
          <Card key={category.id}>
            <h3 className="font-medium text-[var(--color-ink)]">{category.name}</h3>
            <p className="mt-1 text-sm text-[var(--color-muted)]">{category.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {category.skills.map((skill) => (
                <Badge key={skill.id}>{skill.name}</Badge>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </Section>
  )
}
