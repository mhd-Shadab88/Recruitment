import type { DataBundle, Source } from '../types'

export interface GraphNode {
  id: string
  label: string
  kind: 'person' | 'source' | 'project' | 'skillCategory'
  x: number
  y: number
}

export interface GraphEdge {
  from: string
  to: string
}

export interface Graph {
  nodes: GraphNode[]
  edges: GraphEdge[]
}

/**
 * Builds a small Person -> Source / Project / Skill-category relationship
 * graph. Layout is a deterministic ring layout (no physics simulation
 * dependency needed) so it renders the same way every time.
 */
export function buildRelationshipGraph(bundle: DataBundle, sources: Source[]): Graph {
  const centerId = 'person'
  const nodes: GraphNode[] = [{ id: centerId, label: bundle.profile.name, kind: 'person', x: 0, y: 0 }]
  const edges: GraphEdge[] = []

  const visibleSources = sources.filter((s) => s.status !== 'rejected')
  const ring: Array<{ id: string; label: string; kind: GraphNode['kind'] }> = [
    ...visibleSources.map((s) => ({ id: `source-${s.id}`, label: s.name, kind: 'source' as const })),
    ...bundle.projects.map((p) => ({ id: `project-${p.id}`, label: p.name, kind: 'project' as const })),
    ...bundle.skillCategories.map((c) => ({ id: `skill-${c.id}`, label: c.name, kind: 'skillCategory' as const })),
  ]

  const radius = 230
  ring.forEach((item, i) => {
    const angle = (2 * Math.PI * i) / Math.max(ring.length, 1)
    nodes.push({
      id: item.id,
      label: item.label,
      kind: item.kind,
      x: radius * Math.cos(angle),
      y: radius * Math.sin(angle),
    })
    edges.push({ from: centerId, to: item.id })
  })

  return { nodes, edges }
}
