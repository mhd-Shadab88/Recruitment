import { describe, expect, it } from 'vitest'
import { computeProfileHealth } from './profileHealth'
import type { DataBundle, Source } from '../types'

const bundle: DataBundle = {
  profile: {
    name: 'Shadab',
    headline: 'Talent Acquisition Operations Lead',
    summary: '',
    location: 'India & APAC',
    focusAreas: [],
    professionalInterests: [],
    personalInterests: [],
    career: [{ id: 'c1', title: 'Role', period: 'Current', summary: '', claimIds: [] }],
    expertise: [{ id: 'e1', label: 'Area', description: '', claimIds: [] }],
    lastResearchDate: '2026-09-24',
  },
  sources: [],
  projects: [],
  skillCategories: [],
  claims: [],
}

function source(overrides: Partial<Source> = {}): Source {
  return {
    id: 's1',
    name: 'Example',
    url: 'https://example.com/a',
    type: 'self_reported',
    confidence: 'high',
    confidenceRationale: '',
    matchSignals: [],
    description: '',
    lastChecked: new Date().toISOString().slice(0, 10),
    status: 'accepted',
    ...overrides,
  }
}

describe('computeProfileHealth', () => {
  it('counts source coverage by status', () => {
    const sources = [
      source({ id: 'a', status: 'accepted' }),
      source({ id: 'b', status: 'pending_review' }),
      source({ id: 'c', status: 'rejected' }),
    ]
    const report = computeProfileHealth(bundle, sources)
    expect(report.sourceCoverage).toEqual({ accepted: 1, pendingReview: 1, rejected: 1, total: 3 })
  })

  it('flags duplicate URLs', () => {
    const sources = [
      source({ id: 'a', url: 'https://example.com/dup' }),
      source({ id: 'b', url: 'https://example.com/dup' }),
    ]
    const report = computeProfileHealth(bundle, sources)
    expect(report.duplicateSignals.length).toBe(1)
  })

  it('flags sources not checked in over 180 days as outdated', () => {
    const oldDate = new Date(Date.now() - 200 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
    const sources = [source({ id: 'a', lastChecked: oldDate })]
    const report = computeProfileHealth(bundle, sources)
    expect(report.outdatedSources).toHaveLength(1)
  })

  it('does not flag recently-checked sources as outdated', () => {
    const sources = [source({ id: 'a', lastChecked: new Date().toISOString().slice(0, 10) })]
    const report = computeProfileHealth(bundle, sources)
    expect(report.outdatedSources).toHaveLength(0)
  })

  it('reports missing professional link types', () => {
    const report = computeProfileHealth(bundle, [])
    expect(report.missingProfessionalLinks).toEqual(
      expect.arrayContaining(['LinkedIn', 'GitHub', 'Personal website']),
    )
  })

  it('does not flag a link type as missing once an accepted source of that type exists', () => {
    const sources = [source({ id: 'a', type: 'linkedin', status: 'accepted' })]
    const report = computeProfileHealth(bundle, sources)
    expect(report.missingProfessionalLinks).not.toContain('LinkedIn')
  })

  it('scores professional completeness out of 3 checkable facts', () => {
    const report = computeProfileHealth(bundle, [])
    expect(report.professionalCompleteness.of).toBe(3)
    expect(report.professionalCompleteness.hasCareerEntry).toBe(true)
    expect(report.professionalCompleteness.hasExpertise).toBe(true)
    expect(report.professionalCompleteness.hasExternalHighConfidenceSource).toBe(false)
  })
})
