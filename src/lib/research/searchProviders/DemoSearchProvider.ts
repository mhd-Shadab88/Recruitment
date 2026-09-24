import type { RawSearchResult, SearchProvider } from '../types'

/**
 * Demo/mock search provider.
 *
 * This project has no live web-search API wired in (no key configured, and
 * more importantly: "Shadab" alone is not enough to safely disambiguate a
 * real person online — see PROJECT_DECISIONS.md). Rather than fabricate
 * results about real people, this provider returns a small set of clearly
 * synthetic, fictional candidate sources so the identity-confidence and
 * dedupe pipeline can be exercised end-to-end.
 *
 * Every result is tagged isDemo: true and the UI must surface that plainly.
 * To go live: implement SearchProvider against a real API (Bing Web Search,
 * Google Programmable Search, SerpAPI, …) and swap it in via
 * VITE_SEARCH_PROVIDER — see researchEngine.ts.
 */
export class DemoSearchProvider implements SearchProvider {
  readonly name = 'demo'
  readonly isLive = false

  async search(query: string): Promise<RawSearchResult[]> {
    // Simulate network latency so the Admin UI's loading state is real.
    await new Promise((resolve) => setTimeout(resolve, 600))

    const canned: RawSearchResult[] = [
      {
        title: 'Shadab — Talent Acquisition Operations Lead (example profile)',
        url: 'https://example.com/demo/linkedin-profile',
        snippet:
          'Demo record only. Illustrates what a strong identity match might look like: matching name, role, and India & APAC region.',
        suggestedType: 'linkedin',
        isDemo: true,
      },
      {
        title: 'Shadab R. — Software Developer, Berlin (example profile)',
        url: 'https://example.com/demo/unrelated-profile',
        snippet:
          'Demo record only. Illustrates a same-first-name, different-person case: different role, different region, no overlap with the seed profile.',
        suggestedType: 'social_profile',
        isDemo: true,
      },
      {
        title: 'HR & Automation Weekly — guest mention (example article)',
        url: 'https://example.com/demo/article-mention',
        snippet:
          'Demo record only. Illustrates a partial match: mentions "TA automation" and "India" but does not name a specific person, so identity cannot be confirmed.',
        suggestedType: 'article',
        isDemo: true,
      },
      {
        title: 'Shadab — GitHub (example profile)',
        url: 'https://example.com/demo/linkedin-profile',
        snippet:
          'Demo record only. Duplicate of the first result under a different label, to exercise the deduplication step.',
        suggestedType: 'github',
        isDemo: true,
      },
    ]

    // A real provider would use `query`; the demo provider ignores it and
    // always returns the same illustrative set.
    void query
    return canned
  }
}
