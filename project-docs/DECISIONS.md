# DECISIONS
## D-001 — Next.js + TypeScript, static export (2026-11-09)
Reason: matches preferred direction; SEO-friendly static pages; deployable to Cloudflare Pages with no server cost; privacy-first (no backend). Alternatives: Astro (less JS but weaker for React tool UIs), Vite SPA (poor SEO). Trade-off: no server routes; server-side tools would need a separate service (needs approval).
## D-002 — Plain CSS with tokens, no CSS framework (2026-11-09)
Reason: minimal dependencies, one shared design system.
## D-003 — Zero extra runtime dependencies at start (2026-11-09)
Reason: Word Counter needs none. Add libraries (e.g. pdf-lib) only with a written justification here.
## D-004 — Cloudflare Pages + Functions + D1 (2026-11-09)
Owner confirmed Cloudflare hosting and D1. D1 is used ONLY for aggregate counters (privacy-first); never for user files or text. Alternative considered: Workers Analytics Engine / third-party analytics. Chosen for owner preference and simple SQL reporting.
## D-005 — Dev dependencies wrangler and @cloudflare/workers-types (2026-11-09)
Needed to run/deploy Pages Functions and type D1. Versions pinned from memory; verify on install.
## D-006 — Cookieless counters without consent banner (2026-11-09)
Counters are anonymous and aggregate, honour DNT/GPC, and are disabled by default. Owner should confirm legal sufficiency per target region before enabling; a consent banner is in BACKLOG.
## D-007 — Unit tests via Node built-in type stripping (2026-11-09)
Zero test dependencies for pure `lib/` logic. Revisit (Vitest/Playwright) when UI and file tests are added.
## D-008 — Dark text on brand-colored buttons and chips (2026-11-09)
Measured contrast: white on brand colors 2.0-3.3:1 (fails WCAG AA). Dark text `#1B2521` gives 4.0+ on all four. Brand colors unchanged; only text color on them changed. `#1B2521` is a new neutral not in the brand list: owner may veto.
## D-009 — Secondary text color left unchanged pending approval (2026-11-09)
Brand secondary `#7C8582` is 3.63:1 on `#FAFAF7` (fails AA for normal text). Proposed `#5F6A66` (5.37:1). Not applied because brand colors need owner approval. Form labels already use primary text.
## D-010 — Own JSON error locator (2026-11-09)
Modern V8 `JSON.parse` messages often omit position. A small strict scanner in `lib/web-tools.ts` provides line/column; covered by tests. Alternative (a JSON library) rejected to avoid a dependency.
## D-011 — QR Generator deferred (2026-11-09)
Needs a QR encoding library (or a large hand-written encoder). Will be added with a justified dependency once install/build can be verified.
## D-012 — UI verified with a Next stand-in harness (2026-11-09)
No network meant no Next install. The harness is not part of the repo; results are recorded in UI_TEST_REPORT.md with its limits.
