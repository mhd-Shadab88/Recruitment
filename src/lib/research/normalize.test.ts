import { describe, expect, it } from 'vitest'
import { inferTypeFromUrl, isValidUrl, normalizeResult, normalizeResults } from './normalize'
import type { RawSearchResult } from './types'

describe('isValidUrl', () => {
  it('accepts https URLs', () => {
    expect(isValidUrl('https://example.com/profile')).toBe(true)
  })

  it('rejects empty strings', () => {
    expect(isValidUrl('')).toBe(false)
  })

  it('rejects malformed URLs', () => {
    expect(isValidUrl('not a url')).toBe(false)
  })

  it('rejects non-http(s) protocols', () => {
    expect(isValidUrl('javascript:alert(1)')).toBe(false)
  })
})

describe('inferTypeFromUrl', () => {
  it('detects LinkedIn URLs', () => {
    expect(inferTypeFromUrl('https://www.linkedin.com/in/someone')).toBe('linkedin')
  })

  it('detects GitHub URLs', () => {
    expect(inferTypeFromUrl('https://github.com/someone')).toBe('github')
  })

  it('falls back to "other" for unknown domains', () => {
    expect(inferTypeFromUrl('https://random-blog.example')).toBe('other')
  })
})

describe('normalizeResult', () => {
  const base: RawSearchResult = {
    title: 'Example profile',
    url: 'https://example.com/profile',
    snippet: 'A snippet',
    isDemo: true,
  }

  it('normalizes a valid raw result', () => {
    const result = normalizeResult(base)
    expect(result).toEqual({
      name: 'Example profile',
      url: 'https://example.com/profile',
      type: 'other',
      description: 'A snippet',
      isDemo: true,
    })
  })

  it('drops results with an invalid URL', () => {
    expect(normalizeResult({ ...base, url: 'not-a-url' })).toBeNull()
  })

  it('drops results with an empty title', () => {
    expect(normalizeResult({ ...base, title: '   ' })).toBeNull()
  })

  it('uses the provider-suggested type when present', () => {
    const result = normalizeResult({ ...base, suggestedType: 'linkedin' })
    expect(result?.type).toBe('linkedin')
  })
})

describe('normalizeResults', () => {
  it('filters out invalid entries while keeping valid ones', () => {
    const raw: RawSearchResult[] = [
      { title: 'Valid', url: 'https://example.com/a', snippet: '', isDemo: true },
      { title: 'Invalid', url: 'nope', snippet: '', isDemo: true },
    ]
    expect(normalizeResults(raw)).toHaveLength(1)
  })
})
