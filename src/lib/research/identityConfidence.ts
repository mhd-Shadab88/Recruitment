import type { NormalizedCandidate, IdentityScore, ProfileSignals } from './types'

function includesWord(haystack: string, needle: string): boolean {
  return haystack.toLowerCase().includes(needle.toLowerCase())
}

/**
 * Scores how likely a candidate source is to belong to the seed profile.
 *
 * This is deliberately conservative: a shared first name alone is never
 * enough for anything above "low", because "Shadab" is a common name and
 * assuming every match is the same person is exactly the mistake this
 * dashboard is built to avoid (see PROJECT_DECISIONS.md).
 */
export function scoreIdentityConfidence(
  candidate: NormalizedCandidate,
  profile: ProfileSignals,
): IdentityScore {
  const text = `${candidate.name} ${candidate.description}`
  const matchSignals: string[] = []

  const nameMatches = includesWord(text, profile.name)
  if (nameMatches) matchSignals.push(`Name "${profile.name}" appears in title/snippet`)

  const matchedRoleKeywords = profile.roleKeywords.filter((kw) => includesWord(text, kw))
  if (matchedRoleKeywords.length > 0) {
    matchSignals.push(`Role/focus keyword overlap: ${matchedRoleKeywords.join(', ')}`)
  }

  const matchedLocationKeywords = profile.locationKeywords.filter((kw) => includesWord(text, kw))
  if (matchedLocationKeywords.length > 0) {
    matchSignals.push(`Location overlap: ${matchedLocationKeywords.join(', ')}`)
  }

  const otherSignalCategories = (matchedRoleKeywords.length > 0 ? 1 : 0) +
    (matchedLocationKeywords.length > 0 ? 1 : 0)

  if (!nameMatches) {
    return {
      confidence: 'probably_not',
      rationale: `The profile name "${profile.name}" was not found in this source's title or description, so it cannot be linked to this profile.`,
      matchSignals,
    }
  }

  if (otherSignalCategories >= 2) {
    return {
      confidence: 'high',
      rationale:
        'Name matches and at least two independent signal categories (role/focus and location) overlap with the seed profile.',
      matchSignals,
    }
  }

  if (otherSignalCategories === 1) {
    return {
      confidence: 'medium',
      rationale:
        'Name matches and one additional signal category overlaps with the seed profile, but there is not yet independent corroboration.',
      matchSignals,
    }
  }

  return {
    confidence: 'low',
    rationale:
      'Only the name matches; no professional or location signals corroborate this being the same person. Requires manual review before being treated as verified.',
    matchSignals,
  }
}
