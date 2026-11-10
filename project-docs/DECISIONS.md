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
## D-013 — Brand art supplied by owner supersedes the line-art mascot brief (2026-11-09)
Owner supplied reference images (logo, 4 mascots x 4 states, icon set, hero). Mascots are now soft-shaded 2D characters (panda, shark, cat, bee-like bug), not strictly line-art. They are hand-built SVG approximations, NOT traced originals; the logo ribbon shading is simplified. Official raster/vector originals from the designer should replace them when available.
## D-014 — Wordmark drawn from strokes (2026-11-09)
No matching rounded font was available offline; letters are monoline stroke paths (components/brand/wordmark-data.ts) so no font dependency. Revisit with the real brand font if one exists.
## D-015 — Gradient headline uses deeper stops (2026-11-09)
Brand colours as text on #FAFAF7 are 1.9-2.7:1; the hero gradient text uses deeper shades for readability.
## D-016 — Image tools use the browser canvas, no library (2026-11-10)
createImageBitmap + canvas.toBlob handle JPG/PNG/WebP. Output type is checked (a browser that cannot encode WebP returns PNG; we show an error instead of mislabelling). HEIC is unsupported (no reliable browser decoder). Metadata is stripped.
## D-017 — pdf-lib for PDF tools, loaded dynamically (2026-11-10)
Version 1.17.1 (verified installed). Dynamic import keeps non-PDF pages free of PDF code. Limits: merge does not carry bookmarks/some forms; Compress PDF and PDF to JPG deferred (pdf-lib cannot recompress; rendering needs pdfjs-dist).
## D-018 — QR encoder written in-house (2026-11-10)
Byte mode, versions 1-10 (max about 271 bytes at level L). Avoids a dependency we could not install offline. Verified by decoding 88 codes with OpenCV. Revisit with a library if larger payloads or Kanji/numeric modes are needed.
## D-019 — MD5 not offered (2026-11-10)
Not in Web Crypto and insecure; SHA-1/256/384/512 only.
## D-020 — Multi-file results are individual downloads (2026-11-10)
No ZIP yet (would need jszip). "Download all" triggers sequential downloads; browsers may prompt.
## D-021 — Tests: Node type-stripping + external verification (2026-11-10)
Unit tests need no dependencies except `pdf-lib` (symlink or install node_modules). Output files are verified by Pillow/pypdf/OpenCV/hashlib, which are NOT project dependencies.
