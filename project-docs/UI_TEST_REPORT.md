# UI TEST REPORT (2026-11-09)
Result (2026-11-10): **472/472** general UI checks, **49/49** functional checks on real files, **18/18** independent output checks (Chromium via Playwright).

## IMPORTANT: what this is and is not
The authoring environment had no network, so Next.js could not be installed. The checks ran the project's REAL React components (pages, components, lib, globals.css) bundled with esbuild, with tiny stubs replacing `next/link` and `next/navigation`. This verifies component behavior, interaction, layout and accessibility basics. It does NOT verify: Next.js routing/static export, metadata tags, sitemap/robots output, `_headers`, Pages Functions, D1, or Lighthouse. Those remain NOT VERIFIED (see BACKLOG).

## Checks (all passed)
- Every route (home, 4 categories, 9 tools, about, privacy, terms, 404) at desktop 1280px and mobile 390px: exactly one H1, all form controls labelled, valid JSON-LD, no horizontal overflow, no console errors/warnings.
- Search: results, no-match message, Escape clears, click navigates.
- Tools: Word/Character counters, Case Converter (+ clipboard copy), Text Cleaner, Text Diff, JSON Formatter (error line/column, indent modes, minify, real file download), JSON Validator, Base64 (UTF-8, URL-safe, decode, invalid), URL encoder/decoder.
- Dropzone (harness route): valid file accepted, invalid type and oversize rejected with messages, drag-and-drop works, button opens file chooser, mascot has pointer-events none.

## Added in the brand pass
Hero + header logo, 16 mascot states, 16 icon tiles, upload-card states (idle/dragging/processing/completed as static previews on /brand/), /tools/ page, hero search navigation. Hero search navigation is verified by the outgoing request URL (the harness runs on file://).

## Known gaps in this test
No real screen reader test; contrast measured by calculation not tooling; only Chromium; only the Text and Web & Code tools exist.

## 2026-11-10 additions
Functional suite (run2.cjs) with real PNG/JPG/WebP/PDF/CSV files covers all 22 new tools, including rejected inputs (fake image, HEIC, wrong extension, 31 MB file, invalid/unreadable PDF, out-of-range pages, too-long QR text). Downloads were verified by Pillow, pypdf, OpenCV and hashlib (tests/fixtures/verify_outputs.py). Harness now lives in tools/ui-harness.
