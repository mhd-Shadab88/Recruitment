import { describe, expect, it } from 'vitest'
import { loadDataBundle, getClaimsByIds } from './dataLoader'

describe('loadDataBundle', () => {
  const bundle = loadDataBundle()

  it('parses profile.json into a well-formed Profile', () => {
    expect(bundle.profile.name).toBe('Shadab')
    expect(bundle.profile.headline.length).toBeGreaterThan(0)
    expect(Array.isArray(bundle.profile.focusAreas)).toBe(true)
  })

  it('parses claims.json with every claim having required provenance fields', () => {
    expect(bundle.claims.length).toBeGreaterThan(0)
    for (const claim of bundle.claims) {
      expect(claim.id).toBeTruthy()
      expect(claim.source).toBeTruthy()
      expect(['high', 'medium', 'low', 'probably_not']).toContain(claim.confidence)
      expect(claim.last_verified).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    }
  })

  it('every claimId referenced by profile/project/skill entries resolves to a real claim', () => {
    const claimIds = new Set(bundle.claims.map((c) => c.id))
    const referenced = [
      ...bundle.profile.career.flatMap((c) => c.claimIds),
      ...bundle.profile.expertise.flatMap((e) => e.claimIds),
      ...bundle.projects.flatMap((p) => p.claimIds),
      ...bundle.skillCategories.flatMap((cat) => cat.skills.flatMap((s) => s.claimIds)),
    ]
    for (const id of referenced) {
      expect(claimIds.has(id)).toBe(true)
    }
  })

  it('parses sources.json with a status on every source', () => {
    for (const source of bundle.sources) {
      expect(['accepted', 'pending_review', 'rejected']).toContain(source.status)
    }
  })
})

describe('getClaimsByIds', () => {
  const claims = [
    { id: 'a', claim: 'A', source: 's', url: null, confidence: 'high' as const, last_verified: '2026-01-01', evidence: '' },
    { id: 'b', claim: 'B', source: 's', url: null, confidence: 'high' as const, last_verified: '2026-01-01', evidence: '' },
  ]

  it('returns claims in the order requested', () => {
    expect(getClaimsByIds(claims, ['b', 'a']).map((c) => c.id)).toEqual(['b', 'a'])
  })

  it('silently drops ids that do not resolve to a claim', () => {
    expect(getClaimsByIds(claims, ['a', 'missing'])).toHaveLength(1)
  })

  it('returns an empty array for an empty id list', () => {
    expect(getClaimsByIds(claims, [])).toEqual([])
  })
})
