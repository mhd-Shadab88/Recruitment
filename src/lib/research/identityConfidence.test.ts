import { describe, expect, it } from 'vitest'
import { scoreIdentityConfidence } from './identityConfidence'
import type { NormalizedCandidate, ProfileSignals } from './types'

const profileSignals: ProfileSignals = {
  name: 'Shadab',
  roleKeywords: ['Talent Acquisition Operations Lead', 'TA Transformation', 'Automation'],
  locationKeywords: ['India', 'APAC'],
}

function candidate(overrides: Partial<NormalizedCandidate> = {}): NormalizedCandidate {
  return {
    name: 'Some profile',
    url: 'https://example.com',
    type: 'other',
    description: '',
    isDemo: true,
    ...overrides,
  }
}

describe('scoreIdentityConfidence', () => {
  it('classifies as "probably_not" when the name does not appear at all', () => {
    const result = scoreIdentityConfidence(
      candidate({ name: 'Someone Else', description: 'Unrelated profile' }),
      profileSignals,
    )
    expect(result.confidence).toBe('probably_not')
  })

  it('classifies as "low" when only the name matches', () => {
    const result = scoreIdentityConfidence(
      candidate({ name: 'Shadab', description: 'A generic social profile with no other detail' }),
      profileSignals,
    )
    expect(result.confidence).toBe('low')
  })

  it('classifies as "medium" when name plus one signal category match', () => {
    const result = scoreIdentityConfidence(
      candidate({ name: 'Shadab', description: 'Works on Automation projects' }),
      profileSignals,
    )
    expect(result.confidence).toBe('medium')
  })

  it('classifies as "high" when name plus role and location signals match', () => {
    const result = scoreIdentityConfidence(
      candidate({
        name: 'Shadab',
        description: 'Talent Acquisition Operations Lead based in India',
      }),
      profileSignals,
    )
    expect(result.confidence).toBe('high')
    expect(result.matchSignals.length).toBeGreaterThanOrEqual(3)
  })

  it('is case-insensitive when matching', () => {
    const result = scoreIdentityConfidence(
      candidate({ name: 'SHADAB', description: 'talent acquisition operations lead, india' }),
      profileSignals,
    )
    expect(result.confidence).toBe('high')
  })

  it('never returns high confidence from a name match alone, even with a common name', () => {
    const result = scoreIdentityConfidence(
      candidate({ name: 'Shadab', description: 'Completely unrelated content about cricket' }),
      profileSignals,
    )
    expect(result.confidence).not.toBe('high')
  })
})
