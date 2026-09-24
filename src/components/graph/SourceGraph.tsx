import type { Graph } from '../../lib/graph'

const KIND_COLOR: Record<Graph['nodes'][number]['kind'], string> = {
  person: 'var(--color-accent)',
  source: 'var(--color-confidence-high)',
  project: 'var(--color-gold)',
  skillCategory: 'var(--color-muted)',
}

interface SourceGraphProps {
  graph: Graph
}

/** A small deterministic SVG relationship graph: Person -> Source/Project/Skill. */
export function SourceGraph({ graph }: SourceGraphProps) {
  const size = 720
  const center = size / 2

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label="Relationship graph from profile to sources, projects and skills"
      className="mx-auto w-full max-w-xl"
    >
      {graph.edges.map((edge) => {
        const from = graph.nodes.find((n) => n.id === edge.from)
        const to = graph.nodes.find((n) => n.id === edge.to)
        if (!from || !to) return null
        return (
          <line
            key={`${edge.from}-${edge.to}`}
            x1={center + from.x}
            y1={center + from.y}
            x2={center + to.x}
            y2={center + to.y}
            stroke="var(--color-border)"
            strokeWidth={1}
          />
        )
      })}
      {graph.nodes.map((node) => {
        const isPerson = node.kind === 'person'
        const textAnchor = isPerson ? 'middle' : node.x > 4 ? 'start' : node.x < -4 ? 'end' : 'middle'
        const labelOffset = isPerson ? 0 : node.x > 4 ? 10 : node.x < -4 ? -10 : 0
        const labelY = isPerson ? -16 : node.y >= 0 ? 20 : -12

        return (
          <g key={node.id} transform={`translate(${center + node.x}, ${center + node.y})`}>
            <circle r={isPerson ? 10 : 6} fill={KIND_COLOR[node.kind]} />
            <text x={labelOffset} y={labelY} textAnchor={textAnchor} fontSize={10} fill="var(--color-ink-soft)">
              {node.label.length > 18 ? `${node.label.slice(0, 17)}…` : node.label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
