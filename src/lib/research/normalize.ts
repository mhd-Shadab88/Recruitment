import type { SourceType } from '../../types'
import type { NormalizedCandidate, RawSearchResult } from './types'

const DOMAIN_TYPE_HINTS: Array<{ match: RegExp; type: SourceType }> = [
  { match: /linkedin\.com/i, type: 'linkedin' },
  { match: /github\.com/i, type: 'github' },
  { match: /medium\.com|substack\.com/i, type: 'article' },
]

/** Best-effort source type inference from a URL, used when a provider
 * doesn't already suggest one. */
export function inferTypeFromUrl(url: string, fallback: SourceType = 'other'): SourceType {
  const hit = DOMAIN_TYPE_HINTS.find((h) => h.match.test(url))
  return hit ? hit.type : fallback
}

export function isValidUrl(url: string): boolean {
  if (!url) return false
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'https:' || parsed.protocol === 'http:'
  } catch {
    return false
  }
}

/** Turns a raw, provider-specific result into the shape the rest of the
 * pipeline works with. Drops results with an invalid/missing URL rather
 * than silently keeping malformed data. */
export function normalizeResult(raw: RawSearchResult): NormalizedCandidate | null {
  if (!isValidUrl(raw.url)) return null
  const title = raw.title?.trim()
  if (!title) return null

  return {
    name: title,
    url: raw.url.trim(),
    type: raw.suggestedType ?? inferTypeFromUrl(raw.url),
    description: (raw.snippet ?? '').trim(),
    isDemo: raw.isDemo,
  }
}

export function normalizeResults(raw: RawSearchResult[]): NormalizedCandidate[] {
  return raw.map(normalizeResult).filter((c): c is NormalizedCandidate => c !== null)
}
