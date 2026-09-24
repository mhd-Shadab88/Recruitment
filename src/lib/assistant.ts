import type { DataBundle, Source } from '../types'

export interface AssistantAnswer {
  text: string
  citedSourceIds?: string[]
}

/**
 * A local, rule-based (no external AI call) question answerer. It only
 * ever composes an answer from `bundle`/`sources` — it never invents
 * facts. This is intentionally simple pattern matching, not a language
 * model, and the UI must say so.
 */
export function answerQuestion(question: string, bundle: DataBundle, sources: Source[]): AssistantAnswer {
  const q = question.toLowerCase()
  const visible = sources.filter((s) => s.status !== 'rejected')

  if (/(background|professional background|about (you|shadab|him|her|them))/.test(q)) {
    return {
      text: `${bundle.profile.name} is a ${bundle.profile.headline}, focused on ${bundle.profile.focusAreas
        .slice(0, 4)
        .join(', ')}. ${bundle.profile.summary}`,
    }
  }

  if (/which (public )?sources?.*(belong|mine|me)|public sources/.test(q)) {
    const high = visible.filter((s) => s.confidence === 'high')
    if (high.length === 0) {
      return {
        text: 'No sources are currently at high confidence. Check the Online Presence page for medium/low confidence candidates that still need review — "Possible identity match — requires review."',
      }
    }
    return {
      text: `High-confidence sources: ${high.map((s) => s.name).join(', ')}.`,
      citedSourceIds: high.map((s) => s.id),
    }
  }

  if (/uncertain|not sure|unclear|unverified/.test(q)) {
    const uncertain = visible.filter((s) => s.confidence === 'medium' || s.confidence === 'low')
    if (uncertain.length === 0) {
      return { text: 'Nothing is currently marked medium or low confidence.' }
    }
    return {
      text: `These sources are uncertain and need review: ${uncertain
        .map((s) => `${s.name} (${s.confidence})`)
        .join(', ')}.`,
      citedSourceIds: uncertain.map((s) => s.id),
    }
  }

  if (/outdated|old|stale/.test(q)) {
    return {
      text: 'Outdated-source detection is on the Admin page under Profile Health — it flags anything not re-checked in the last 180 days.',
    }
  }

  if (/timeline|career|history/.test(q)) {
    const entries = bundle.profile.career.map((c) => `${c.title} (${c.period})`).join('; ')
    return { text: `Professional timeline: ${entries || 'Not verified.'}` }
  }

  if (/project/.test(q)) {
    return {
      text: `Projects: ${bundle.projects.map((p) => `${p.name} — ${p.tagline}`).join('; ')}.`,
    }
  }

  if (/skill/.test(q)) {
    return {
      text: `Skill categories: ${bundle.skillCategories.map((c) => c.name).join(', ')}. See the Skills page for individual skills and their provenance.`,
    }
  }

  return {
    text: "I can only answer from the profile, sources, projects, and skills stored in this app — I don't have information beyond that. Try asking about background, sources, uncertain information, outdated information, or the professional timeline.",
  }
}
