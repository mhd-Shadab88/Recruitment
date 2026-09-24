# Shadab — Personal Profile Intelligence Dashboard

A personal profile website built as an end-to-end Claude Code test project: a small "profile intelligence" dashboard that presents professional information transparently, with every claim tied to where it came from and how confident the system is that it's actually true.

> **Honesty note up front:** this build does not perform live web research on a real person. See [Privacy considerations](#privacy-considerations) and [PROJECT_DECISIONS.md](./PROJECT_DECISIONS.md#1-no-live-web-research-was-implemented--and-that-was-a-deliberate-call-not-a-fallback-of-convenience) for exactly why, and what "Run Research" on the Admin page actually does instead.

## 1. What the project does

- Presents a professional profile (role, focus areas, career, expertise, interests), projects, and skills — all sourced from information the profile owner provided directly.
- Models "online presence" as a set of **sources**, each carrying a confidence level (`high` / `medium` / `low` / `probably not me`), a plain-language rationale for that confidence, and a last-checked date.
- Ships a **research engine** (search → normalize → dedupe → identity-confidence scoring) as real, testable code, connected by default to a clearly-labeled demo search provider rather than to real people's data (see decision #1 below).
- Gives every displayed fact a **provenance trail** ("where did this come from") via a `claims` store shared across profile, projects, and skills.
- Includes an Admin page to run/inspect research, and a small local (non-AI-call) Q&A assistant that only answers from stored data.

## 2. Architecture

```
src/
  data/            Static JSON data layer (profile, sources, projects, skills, claims)
  types/            Shared TypeScript types for the whole data model
  lib/
    dataLoader.ts        Single entry point that loads + types the JSON data
    profileHealth.ts     Coverage/duplicate/outdated/completeness report (Admin)
    graph.ts              Builds the Person→Source/Project/Skill relationship graph
    exporters.ts           JSON / Markdown export helpers
    assistant.ts            Local rule-based Q&A over stored data
    research/
      types.ts                    Research-pipeline types
      normalize.ts                Raw result -> normalized candidate (+ URL validation)
      dedupe.ts                   URL-based deduplication
      identityConfidence.ts       Name/role/location signal scoring -> confidence level
      researchEngine.ts           Orchestrates the pipeline; provider selection
      searchProviders/
        DemoSearchProvider.ts     Ships by default; returns labeled synthetic data
  hooks/
    useResearchData.ts    Merges seeded sources with a localStorage research run
    useTheme.ts             Light/dark mode, respects system preference
  components/        UI, grouped by feature (common/, layout/, presence/, admin/, graph/)
  pages/             One component per route
```

Data flows one way: JSON files → `dataLoader` → hooks → pages/components. Nothing in `components/` or `pages/` imports a JSON file directly, so the data source (static JSON today) can be swapped for an API without touching the UI layer.

## 3. Technology stack

- **React 19 + TypeScript**, built with **Vite**
- **Tailwind CSS v4** (via `@tailwindcss/vite`) for styling; design tokens in `src/index.css`
- **React Router** for client-side routing
- **Vitest + React Testing Library** for tests
- No backend, no database, no component library, no chart library — see [PROJECT_DECISIONS.md](./PROJECT_DECISIONS.md) for why.

## 4. How to install it

```bash
npm install
```

## 5. How to run it

```bash
npm run dev       # start the dev server (http://localhost:5173)
npm run build     # type-check + production build to dist/
npm run preview   # preview the production build locally
npm run lint       # oxlint
npm test           # run the test suite once
npm run test:watch # run tests in watch mode
```

## 6. How the research engine works

1. **Search** — a `SearchProvider` (interface in `src/lib/research/types.ts`) returns raw results for a query. Only `DemoSearchProvider` is implemented; it returns a small, fixed set of synthetic example results, each tagged `isDemo: true`.
2. **Normalize** (`normalize.ts`) — drops results with an invalid/missing URL or empty title; infers a source type from the URL when the provider doesn't supply one.
3. **Deduplicate** (`dedupe.ts`) — collapses results whose URLs match once trailing slashes/query strings/protocol are normalized away.
4. **Identity confidence** (`identityConfidence.ts`) — scores each candidate against the profile's name, role/focus keywords, and location keywords (see next section).
5. **Store** — each candidate becomes a `Source` record with `status: 'pending_review'` (or `'rejected'` if scored `probably_not`), surfaced on the Admin page for a human decision.
6. **Display** — accepted/pending sources appear on the Online Presence page with their confidence badge, rationale, and match signals visible.

Run it from the **Admin** page ("Run Research" / "Refresh Sources"). It runs entirely client-side against the demo provider — nothing is sent over the network for this step.

## 7. How sources are evaluated

Every `Source` carries:

- `confidence`: `high` / `medium` / `low` / `probably_not`
- `confidenceRationale`: a plain-language sentence explaining the score
- `matchSignals`: the specific overlaps found (e.g. "Name matches," "Location overlap: India")
- `status`: `pending_review` / `accepted` / `rejected` — a human decision, separate from confidence (see [decision #9](./PROJECT_DECISIONS.md#9-confidence-levels-and-source-status-are-separate-axes))
- `lastChecked` and, where applicable, `isDemo`

Nothing is presented as confirmed unless a `claim` (with its own source, URL, and evidence) backs it — see the `ProvenanceList` component used throughout the Profile, Projects, and Skills pages.

## 8. How identity confidence works

`scoreIdentityConfidence()` in `src/lib/research/identityConfidence.ts`:

- If the profile's name doesn't appear in the candidate's title/description at all → **probably not me**.
- If only the name matches, with no corroborating role/focus or location signal → **low**.
- If the name matches **and** one other signal category (role/focus *or* location) also matches → **medium**.
- If the name matches **and both** role/focus **and** location signals match → **high**.

A shared first name is never, by itself, enough to reach `high` — see [decision #4](./PROJECT_DECISIONS.md#4-identity-confidence-is-deliberately-hard-to-earn). This function is pure and directly unit-tested (`identityConfidence.test.ts`).

## 9. How to add a new data source

**Manually (recommended for real, verified information):** add an entry to `src/data/sources.json` following the existing `Source` shape (see `src/types/index.ts`), and if it backs a specific profile/project/skill claim, add a corresponding entry to `src/data/claims.json` and reference its `id` from the relevant `claimIds` array.

**Via the research pipeline:** implement a new `SearchProvider`, register it in `providers` inside `src/lib/research/researchEngine.ts`, and set `VITE_SEARCH_PROVIDER` to its key (see next section). Everything downstream (normalize/dedupe/score/display) works unchanged.

## 10. How to configure APIs

Copy `.env.example` to `.env` and set `VITE_SEARCH_PROVIDER` (defaults to `demo`, the only provider implemented today).

**Do not** put a real search API key in a `VITE_`-prefixed variable — anything prefixed `VITE_` is bundled into client-visible JavaScript. A live search provider must be called from a backend/serverless function that holds the real key server-side; the frontend calls that function, not the third-party API directly.

## 11. Privacy considerations

- This build does not scrape, log into, or bypass authentication on any website.
- The demo search provider never returns data about a real person — its results are synthetic and labeled `isDemo: true` everywhere they're displayed.
- The seed profile data (name, role, interests, projects) was provided directly by the profile owner, not collected from the web.
- Research-run results only persist to the visiting browser's `localStorage` — nothing is sent to or stored on a server by this app.
- If a real search provider is added later: respect `robots.txt` and each site's terms of service, rate-limit requests, never attempt to access login-gated content, and keep the identity-confidence pipeline's conservative defaults (see decision #4) rather than loosening them to surface more results.

## 12. Known limitations

- **No live web research.** See the honesty note at the top and [PROJECT_DECISIONS.md #1](./PROJECT_DECISIONS.md#1-no-live-web-research-was-implemented--and-that-was-a-deliberate-call-not-a-fallback-of-convenience).
- **Research-run persistence is browser-local only** (`localStorage`), not shared across devices or visitors, and is lost if site data is cleared. A real deployment needs a backend to persist accepted/rejected sources for everyone.
- **The Q&A assistant is keyword-matching, not a language model.** It's grounded (never invents facts) but will miss questions that don't match its patterns — see `src/lib/assistant.ts`.
- **The relationship graph uses a fixed, deterministic layout**, not a physics simulation — fine for the current handful of nodes, would need a real layout algorithm (or a library) to scale to dozens of sources.
- **No automated end-to-end/browser test suite is checked in** — main flows were verified manually with Playwright during development (see the development log / this README's test section), but that script wasn't committed as a repeatable test.
- **Single-locale, no i18n.**

## 13. Future improvements

1. Implement a real `SearchProvider` (behind a backend proxy) and get explicit disambiguating input from the profile owner (full name, known LinkedIn/GitHub URLs) before searching, rather than name-only queries.
2. Move source persistence from `localStorage` to a small backend (even a Git-backed CMS or a serverless function + database) so research runs and admin decisions are shared and durable.
3. Add a proper end-to-end test suite (Playwright) covering navigation, the research-run flow, and the assistant, and wire it into CI.
4. Expand the identity-confidence scorer with more signal types (education, employer name matching, cross-source corroboration between two independently-discovered sources) rather than just role/location keyword overlap.
5. Turn the relationship graph into a force-directed layout once there are enough real sources for a fixed radial layout to feel cramped.

---

For the reasoning behind these choices, see [PROJECT_DECISIONS.md](./PROJECT_DECISIONS.md).
