import type { DataBundle, Source } from '../types'

export function exportAsJson(bundle: DataBundle, allSources: Source[]): string {
  return JSON.stringify({ ...bundle, sources: allSources }, null, 2)
}

export function exportAsMarkdown(bundle: DataBundle, allSources: Source[]): string {
  const { profile, projects, skillCategories } = bundle
  const lines: string[] = []

  lines.push(`# ${profile.name}`)
  lines.push('')
  lines.push(`**${profile.headline}**`)
  lines.push('')
  lines.push(profile.summary)
  lines.push('')

  lines.push('## Focus areas')
  profile.focusAreas.forEach((a) => lines.push(`- ${a}`))
  lines.push('')

  lines.push('## Career')
  profile.career.forEach((c) => {
    lines.push(`### ${c.title} (${c.period})`)
    lines.push(c.summary)
    lines.push('')
  })

  lines.push('## Projects')
  projects.forEach((p) => {
    lines.push(`### ${p.name} — ${p.tagline}`)
    lines.push(p.description)
    lines.push(`Focus: ${p.focus.join(', ')}`)
    lines.push('')
  })

  lines.push('## Skills')
  skillCategories.forEach((cat) => {
    lines.push(`### ${cat.name}`)
    cat.skills.forEach((s) => lines.push(`- ${s.name}`))
    lines.push('')
  })

  lines.push('## Online presence sources')
  const visible = allSources.filter((s) => s.status !== 'rejected')
  if (visible.length === 0) {
    lines.push('_No sources discovered yet._')
  } else {
    visible.forEach((s) => {
      lines.push(`- **${s.name}** (${s.confidence.replace('_', ' ')}) — ${s.url || 'no URL'}`)
    })
  }
  lines.push('')

  return lines.join('\n')
}

export function downloadTextFile(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
