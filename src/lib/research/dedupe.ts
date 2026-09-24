import type { NormalizedCandidate } from './types'

function normalizeUrlForCompare(url: string): string {
  try {
    const parsed = new URL(url)
    return `${parsed.hostname}${parsed.pathname}`.replace(/\/+$/, '').toLowerCase()
  } catch {
    return url.toLowerCase()
  }
}

export interface DedupeResult {
  unique: NormalizedCandidate[]
  duplicateCount: number
}

/** Deduplicates candidates by normalized URL (same host + path, ignoring
 * protocol/trailing slash/query string). Keeps the first occurrence. */
export function dedupeCandidates(candidates: NormalizedCandidate[]): DedupeResult {
  const seen = new Set<string>()
  const unique: NormalizedCandidate[] = []
  let duplicateCount = 0

  for (const candidate of candidates) {
    const key = normalizeUrlForCompare(candidate.url)
    if (seen.has(key)) {
      duplicateCount += 1
      continue
    }
    seen.add(key)
    unique.push(candidate)
  }

  return { unique, duplicateCount }
}
