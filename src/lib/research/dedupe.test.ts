import { describe, expect, it } from 'vitest'
import { dedupeCandidates } from './dedupe'
import type { NormalizedCandidate } from './types'

function candidate(overrides: Partial<NormalizedCandidate> = {}): NormalizedCandidate {
  return {
    name: 'Example',
    url: 'https://example.com/profile',
    type: 'other',
    description: '',
    isDemo: true,
    ...overrides,
  }
}

describe('dedupeCandidates', () => {
  it('returns all candidates unchanged when URLs are unique', () => {
    const input = [candidate({ url: 'https://a.example.com' }), candidate({ url: 'https://b.example.com' })]
    const { unique, duplicateCount } = dedupeCandidates(input)
    expect(unique).toHaveLength(2)
    expect(duplicateCount).toBe(0)
  })

  it('collapses exact duplicate URLs and keeps the first', () => {
    const input = [
      candidate({ name: 'First', url: 'https://example.com/profile' }),
      candidate({ name: 'Second', url: 'https://example.com/profile' }),
    ]
    const { unique, duplicateCount } = dedupeCandidates(input)
    expect(unique).toHaveLength(1)
    expect(unique[0].name).toBe('First')
    expect(duplicateCount).toBe(1)
  })

  it('treats trailing slashes and query strings as the same URL', () => {
    const input = [
      candidate({ url: 'https://example.com/profile' }),
      candidate({ url: 'https://example.com/profile/' }),
      candidate({ url: 'https://example.com/profile?utm_source=x' }),
    ]
    const { unique, duplicateCount } = dedupeCandidates(input)
    expect(unique).toHaveLength(1)
    expect(duplicateCount).toBe(2)
  })

  it('handles an empty list', () => {
    const { unique, duplicateCount } = dedupeCandidates([])
    expect(unique).toHaveLength(0)
    expect(duplicateCount).toBe(0)
  })
})
