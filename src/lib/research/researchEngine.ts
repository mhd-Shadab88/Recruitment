import type { Profile, Source } from '../../types'
import { DemoSearchProvider } from './searchProviders/DemoSearchProvider'
import { normalizeResults } from './normalize'
import { dedupeCandidates } from './dedupe'
import { scoreIdentityConfidence } from './identityConfidence'
import type { ProfileSignals, ResearchRunResult, SearchProvider } from './types'

/**
 * Provider selection, driven by VITE_SEARCH_PROVIDER (see .env.example).
 * Only "demo" is implemented today. To add a real provider: implement
 * SearchProvider against it (e.g. src/lib/research/searchProviders/
 * BingSearchProvider.ts), register it in `providers` below, and set
 * VITE_SEARCH_PROVIDER=bing.
 *
 * Never read a real API key with a VITE_ prefix — VITE_ vars are bundled
 * into client-visible JS. A live provider must call a backend/serverless
 * proxy that holds the real key server-side, not the third-party API
 * directly from the browser.
 */
const providers: Record<string, () => SearchProvider> = {
  demo: () => new DemoSearchProvider(),
}

function getSearchProvider(): SearchProvider {
  const requested = import.meta.env.VITE_SEARCH_PROVIDER || 'demo'
  const factory = providers[requested]
  if (!factory) {
    console.warn(
      `VITE_SEARCH_PROVIDER="${requested}" has no implementation registered; falling back to the demo provider.`,
    )
    return providers.demo()
  }
  return factory()
}

function buildProfileSignals(profile: Profile): ProfileSignals {
  return {
    name: profile.name,
    roleKeywords: [profile.headline, ...profile.focusAreas],
    locationKeywords: profile.location.split(/[&,]/).map((s) => s.trim()).filter(Boolean),
  }
}

function buildQueries(profile: Profile): string[] {
  return [
    `"${profile.name}" ${profile.headline}`,
    `"${profile.name}" talent acquisition`,
  ]
}

let sourceCounter = 0
function nextSourceId(): string {
  sourceCounter += 1
  return `source-run-${Date.now()}-${sourceCounter}`
}

export interface RunResearchOutput {
  result: ResearchRunResult
  sources: Source[]
}

/**
 * Runs the full research pipeline: search -> normalize -> dedupe -> score
 * identity confidence -> build Source records. Does not touch existing
 * sources or persist anything — that's the caller's job (see
 * useResearchData), so this stays a pure, testable function.
 */
export async function runResearch(profile: Profile): Promise<RunResearchOutput> {
  const provider = getSearchProvider()
  const signals = buildProfileSignals(profile)
  const queries = buildQueries(profile)

  const rawResultBatches = await Promise.all(queries.map((q) => provider.search(q)))
  const rawResults = rawResultBatches.flat()

  const normalized = normalizeResults(rawResults)
  const { unique, duplicateCount } = dedupeCandidates(normalized)

  const now = new Date().toISOString().slice(0, 10)
  const sources: Source[] = unique.map((candidate) => {
    const score = scoreIdentityConfidence(candidate, signals)
    const status: Source['status'] = score.confidence === 'probably_not' ? 'rejected' : 'pending_review'

    return {
      id: nextSourceId(),
      name: candidate.name,
      url: candidate.url,
      type: candidate.type,
      confidence: score.confidence,
      confidenceRationale: score.rationale,
      matchSignals: score.matchSignals,
      description: candidate.description,
      lastChecked: now,
      isDemo: candidate.isDemo,
      status,
    }
  })

  const result: ResearchRunResult = {
    runAt: new Date().toISOString(),
    provider: provider.name,
    queriesRun: queries,
    found: rawResults.length,
    accepted: sources.filter((s) => s.status === 'accepted').length,
    pendingReview: sources.filter((s) => s.status === 'pending_review').length,
    rejected: sources.filter((s) => s.status === 'rejected').length,
    duplicates: duplicateCount,
  }

  return { result, sources }
}
