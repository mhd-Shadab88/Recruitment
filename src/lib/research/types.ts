import type { ConfidenceLevel, SourceType } from '../../types'

/** What a SearchProvider returns before any normalization/scoring happens. */
export interface RawSearchResult {
  title: string
  url: string
  snippet: string
  /** Best-effort guess at source type from the provider; refined during normalization. */
  suggestedType?: SourceType
  /** True when this result is synthetic demo data rather than a real web result. */
  isDemo: boolean
}

/** A RawSearchResult after normalization, before identity scoring. */
export interface NormalizedCandidate {
  name: string
  url: string
  type: SourceType
  description: string
  isDemo: boolean
}

export interface IdentityScore {
  confidence: ConfidenceLevel
  rationale: string
  matchSignals: string[]
}

export interface ProfileSignals {
  name: string
  roleKeywords: string[]
  locationKeywords: string[]
}

/** Pluggable source of candidate sources. Swap DemoSearchProvider for a real
 * API-backed implementation (e.g. Bing/Google Custom Search/SerpAPI) by
 * implementing this interface — nothing else in the research engine needs
 * to change. */
export interface SearchProvider {
  readonly name: string
  readonly isLive: boolean
  search(query: string): Promise<RawSearchResult[]>
}

export interface ResearchRunResult {
  runAt: string
  provider: string
  queriesRun: string[]
  found: number
  accepted: number
  pendingReview: number
  rejected: number
  duplicates: number
}
