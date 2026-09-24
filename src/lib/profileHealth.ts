import type { DataBundle, Source } from '../types'

export interface ProfileHealthReport {
  sourceCoverage: {
    accepted: number
    pendingReview: number
    rejected: number
    total: number
  }
  duplicateSignals: string[]
  outdatedSources: Source[]
  missingProfessionalLinks: string[]
  professionalCompleteness: {
    hasCareerEntry: boolean
    hasExpertise: boolean
    hasExternalHighConfidenceSource: boolean
    score: number
    of: number
  }
}

const EXPECTED_LINK_TYPES: Array<{ type: Source['type']; label: string }> = [
  { type: 'linkedin', label: 'LinkedIn' },
  { type: 'github', label: 'GitHub' },
  { type: 'personal_website', label: 'Personal website' },
]

const OUTDATED_THRESHOLD_DAYS = 180

/**
 * Computes a transparent, methodology-visible health report — deliberately
 * not a single subjective "score". Every number here traces back to
 * something you can see in the Online Presence / Admin pages.
 */
export function computeProfileHealth(bundle: DataBundle, allSources: Source[]): ProfileHealthReport {
  const accepted = allSources.filter((s) => s.status === 'accepted').length
  const pendingReview = allSources.filter((s) => s.status === 'pending_review').length
  const rejected = allSources.filter((s) => s.status === 'rejected').length

  const urlCounts = new Map<string, number>()
  for (const s of allSources) {
    if (!s.url) continue
    urlCounts.set(s.url, (urlCounts.get(s.url) ?? 0) + 1)
  }
  const duplicateSignals = [...urlCounts.entries()]
    .filter(([, count]) => count > 1)
    .map(([url, count]) => `${url} appears ${count} times`)

  const now = Date.now()
  const outdatedSources = allSources.filter((s) => {
    if (s.status === 'rejected') return false
    const checked = new Date(s.lastChecked).getTime()
    if (Number.isNaN(checked)) return false
    const ageDays = (now - checked) / (1000 * 60 * 60 * 24)
    return ageDays > OUTDATED_THRESHOLD_DAYS
  })

  const presentTypes = new Set(allSources.filter((s) => s.status !== 'rejected').map((s) => s.type))
  const missingProfessionalLinks = EXPECTED_LINK_TYPES.filter((t) => !presentTypes.has(t.type)).map(
    (t) => t.label,
  )

  const hasCareerEntry = bundle.profile.career.length > 0
  const hasExpertise = bundle.profile.expertise.length > 0
  const hasExternalHighConfidenceSource = allSources.some(
    (s) => s.confidence === 'high' && s.type !== 'self_reported' && s.status === 'accepted',
  )
  const completenessChecks = [hasCareerEntry, hasExpertise, hasExternalHighConfidenceSource]

  return {
    sourceCoverage: { accepted, pendingReview, rejected, total: allSources.length },
    duplicateSignals,
    outdatedSources,
    missingProfessionalLinks,
    professionalCompleteness: {
      hasCareerEntry,
      hasExpertise,
      hasExternalHighConfidenceSource,
      score: completenessChecks.filter(Boolean).length,
      of: completenessChecks.length,
    },
  }
}
