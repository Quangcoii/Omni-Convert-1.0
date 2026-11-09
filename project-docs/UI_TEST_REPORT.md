# UI TEST REPORT (2026-11-09)
Result: **224/224 automated checks passed** (Chromium via Playwright).

## IMPORTANT: what this is and is not
The authoring environment had no network, so Next.js could not be installed. The checks ran the project's REAL React components (pages, components, lib, globals.css) bundled with esbuild, with tiny stubs replacing `next/link` and `next/navigation`. This verifies component behavior, interaction, layout and accessibility basics. It does NOT verify: Next.js routing/static export, metadata tags, sitemap/robots output, `_headers`, Pages Functions, D1, or Lighthouse. Those remain NOT VERIFIED (see BACKLOG).

## Checks (all passed)
- Every route (home, 4 categories, 9 tools, about, privacy, terms, 404) at desktop 1280px and mobile 390px: exactly one H1, all form controls labelled, valid JSON-LD, no horizontal overflow, no console errors/warnings.
- Search: results, no-match message, Escape clears, click navigates.
- Tools: Word/Character counters, Case Converter (+ clipboard copy), Text Cleaner, Text Diff, JSON Formatter (error line/column, indent modes, minify, real file download), JSON Validator, Base64 (UTF-8, URL-safe, decode, invalid), URL encoder/decoder.
- Dropzone (harness route): valid file accepted, invalid type and oversize rejected with messages, drag-and-drop works, button opens file chooser, mascot has pointer-events none.

## Known gaps in this test
No real screen reader test; contrast measured by calculation not tooling; only Chromium; only the Text and Web & Code tools exist.
