import { describe, expect, it } from 'vitest'
import { runResearch } from './researchEngine'
import type { Profile } from '../../types'

const profile: Profile = {
  name: 'Shadab',
  headline: 'Talent Acquisition Operations Lead',
  summary: '',
  location: 'India & APAC',
  focusAreas: ['TA Transformation', 'Automation'],
  professionalInterests: [],
  personalInterests: [],
  career: [],
  expertise: [],
  lastResearchDate: '2026-09-24',
}

describe('runResearch (demo provider)', () => {
  it('produces sources that are all flagged as demo data', async () => {
    const { sources } = await runResearch(profile)
    expect(sources.length).toBeGreaterThan(0)
    expect(sources.every((s) => s.isDemo)).toBe(true)
  })

  it('deduplicates the intentionally-duplicated demo result', async () => {
    const { result } = await runResearch(profile)
    expect(result.duplicates).toBeGreaterThan(0)
  })

  it('auto-rejects sources scored "probably_not"', async () => {
    const { sources } = await runResearch(profile)
    const probablyNot = sources.filter((s) => s.confidence === 'probably_not')
    expect(probablyNot.length).toBeGreaterThan(0)
    expect(probablyNot.every((s) => s.status === 'rejected')).toBe(true)
  })

  it('marks everything else as pending review rather than auto-accepting', async () => {
    const { sources } = await runResearch(profile)
    const nonRejected = sources.filter((s) => s.confidence !== 'probably_not')
    expect(nonRejected.every((s) => s.status === 'pending_review')).toBe(true)
  })

  it('reports a run summary consistent with the returned sources', async () => {
    const { result, sources } = await runResearch(profile)
    expect(result.rejected).toBe(sources.filter((s) => s.status === 'rejected').length)
    expect(result.pendingReview).toBe(sources.filter((s) => s.status === 'pending_review').length)
  })
})
