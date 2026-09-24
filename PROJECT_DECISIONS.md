# Project decisions

This is a working log of the architectural calls made while building this project, and why — written so a future reader (including a future Claude Code session) doesn't have to reverse-engineer the reasoning.

## 1. No live web research was implemented — and that was a deliberate call, not a fallback of convenience

The brief asks for a system that finds real public sources (LinkedIn, GitHub, articles, etc.) belonging to "Shadab." Two independent facts made building that unsafe to do honestly in this session:

1. **No live search API is wired into this environment.** There is no search/browse tool available to this build pipeline, and no API key was supplied.
2. **Even with one, "Shadab" alone is not enough to safely identify a specific real person.** No surname, employer, city, or existing profile URL was given. Searching the open web for "Shadab" and presenting whatever comes back as "probably you" is exactly the failure mode the brief's own Section 3 (Identity-Matching) and Section 14 (Critical Rule — never fabricate) warn against. Guessing wrong would misattribute a real, unconnected person's information to this profile.

**Decision:** build the full research pipeline as real, working code — `SearchProvider` interface → normalize → dedupe → identity-confidence scoring → structured `Source` records — and ship it wired to a `DemoSearchProvider` that returns a small set of clearly-labeled *synthetic* example sources (`isDemo: true` on every field, on every card, everywhere in the UI). This exercises and demonstrates the entire pipeline (including how it distinguishes a strong match from a same-name mismatch) without fabricating claims about a real person. See `src/lib/research/searchProviders/DemoSearchProvider.ts`.

**To go live:** implement `SearchProvider` against a real API (Bing Web Search, Google Programmable Search, SerpAPI, …), register it in `src/lib/research/researchEngine.ts`, and set `VITE_SEARCH_PROVIDER`. Nothing else in the pipeline or UI needs to change — that's the point of the interface boundary. Before doing that, get a disambiguating identifier from the profile owner (full name, known LinkedIn URL, employer) rather than searching on first name alone.

## 2. Data layer is static JSON, not a database

`src/data/*.json` (profile, sources, projects, skills, claims) is the source of truth, loaded through one module (`dataLoader.ts`). For a personal site with no user accounts and no write-heavy workload, a database would be unjustified complexity. The trade-off: the Admin page's "Run Research" / accept / reject actions only persist to the browser's `localStorage`, not back to these files. That's an explicit, documented limitation (see README → Known limitations), not an oversight. A real deployment that wants research runs to persist for all visitors would need a backend (even a small serverless function backed by a database or a Git-backed CMS) to write back to the data layer.

## 3. Claims/provenance are a separate, centrally-referenced store

Initially each JSON file embedded its own `claims` array. That produced ID collisions and no single place to check "does this claimId actually resolve to something." It was consolidated into one `claims.json`, referenced by ID from `profile.json`, `projects.json`, and `skills.json`. `dataLoader.test.ts` asserts every referenced `claimId` resolves — a broken reference now fails the test suite instead of silently rendering "Not verified." for the wrong reason.

## 4. Identity confidence is deliberately hard to earn

`identityConfidence.ts` requires a name match **plus at least two independent signal categories** (role/focus keywords, location) before returning `high`. A name match alone caps out at `low`. This is intentional: "Shadab" is a common name, and the brief is explicit that assuming every same-named result is the same person is the mistake to avoid. The scoring function is pure and unit-tested against exactly this case (`identityConfidence.test.ts` → "never returns high confidence from a name match alone, even with a common name").

## 5. New sources default to "pending review," never auto-accepted

Even a `high`-confidence demo result from a research run starts as `pending_review`; only `probably_not` is auto-rejected. Acceptance is a human action on the Admin page. Confidence scoring informs a reviewer's decision — it doesn't make the decision.

## 6. Research-run persistence is localStorage, explicitly labeled as a demo limitation

`useResearchData.ts` merges the seeded `sources.json` with anything saved from a research run in `localStorage`. This is single-browser, single-device, and wiped by clearing site data. It was chosen over inventing a fake backend because pretending to have server-side persistence would be its own kind of dishonesty about what this build actually does. See README → Known limitations for the real fix.

## 7. The "AI Research Assistant" (Stretch Goal 4) is rule-based, not an LLM call

`src/lib/assistant.ts` answers by keyword-matching the question against the same stored `profile`/`sources`/`projects`/`skills` data everything else on the site uses — it never calls an external model. The UI says this explicitly ("Keyword-based, not an external AI call"). Wiring a real LLM in would mean shipping a provider API key, which conflicts with "never hardcode API keys" unless it goes through a backend proxy — out of scope for a static site with no backend (see decision #2). If a backend is added later, this is the natural place to swap in a real, still-grounded (RAG-style, cite-your-sources) assistant.

## 8. Tailwind v4 via `@tailwindcss/vite`, not a `tailwind.config.js` + PostCSS setup

Tailwind v4's Vite plugin removes the need for a separate PostCSS config and a JS config file; theme tokens live in `src/index.css` under `@theme` and a `.dark` class toggle. Fewer config files, same capability, and it's the currently-recommended integration path for Vite projects.

## 9. Confidence levels and source status are separate axes

`confidence` (`high` / `medium` / `low` / `probably_not`) answers "how sure are we this is the same person." `status` (`accepted` / `pending_review` / `rejected`) answers "what has a human decided to do with this source." Conflating them would make it impossible to represent "we're fairly confident, but no one has reviewed it yet," which is the most common real state for anything not self-reported.

## 10. No component library / no chart library

Everything is hand-built with Tailwind utility classes and a handful of shared primitives (`Card`, `Badge`, `ConfidenceBadge`, `Section`, `EmptyState`, `ProvenanceList`). The relationship graph (Stretch Goal 1) is a deterministic inline SVG, not a force-directed graph library — a personal profile with a handful of sources doesn't need physics simulation, and a static layout renders identically every time, which matters for testability and for the "no unnecessary animation" design direction in the brief.
