# CHANGELOG
## 2026-11-09
- Initial repository foundation: governance docs, CLAUDE.md, Next.js scaffold, shared layout, homepage, category pages, Word Counter, robots, sitemap, 404. Not yet built or tested.
- Cloudflare setup: wrangler.toml, D1 migration, /api/events Function, _headers, analytics client, TrackView.
- New tools: Character Counter, Case Converter, Text Cleaner, Text Diff. Word Counter moved to shared ToolLayout.
- Added tests/text-tools.test.mts (passes) and scripts/gen-inventory.py.
- Pass 3: global search; 4 mascot SVGs; Dropzone validation + lib/file-engine; Web & Code tools (JSON Formatter, JSON Validator, Base64, URL); Privacy/Terms/About; BreadcrumbList JSON-LD, OG tags, favicon, skip link; accessibility contrast fixes; UI_TEST_REPORT.md; 2 test files.
- Fixed: JSON error position missing in modern browsers (own locator); file-engine maxFiles now counts valid files only.
- Brand pass: logo (mark, wordmark, lockups), favicon/app icons/OG image/manifest, 16 mascot SVG states, 16 icon tiles, upload-card states, new hero/header/cards, /tools/ and /brand/ pages. Exports in public/brand/ (SVG+PNG).

## 2026-11-10 (tools pass)
- Added 22 tools: Image (PNG to JPG, JPG to PNG, WebP to JPG, JPG to WebP, Image Compressor, Image Resizer), Office (Merge PDF, Split PDF, Rotate PDF, JPG to PDF, CSV to JSON, Remove Duplicate Rows), Text (Slug Generator, Lorem Ipsum, Find and Replace, Sort Lines), Web & Code (QR Code Generator, Color Converter, Timestamp Converter, Hash Generator, HTML Encoder/Decoder, Regex Tester). Total 31.
- New libs: lib/qr.ts (own encoder), lib/pdf-tools.ts, lib/csv.ts, lib/image-tools.ts; extended text-tools and web-tools.
- New components: ImageTool, pdf/PdfWorkbench, FileTextInput; CopyButton label prop; Dropzone gets an accessible file-input label; ToolLayout noun/grammar.
- Homepage shows 12 popular tools + link to /tools/; 4 icons added (color, clock, hash, regex) and sticker set re-exported (20).
- Dependency added: pdf-lib 1.17.1 (loaded on demand).
- Tests: tests/new-tools.test.mts, tests/verify (QR), tests/fixtures; UI harness moved to tools/ui-harness.
- Fixed during testing: Dropzone file input unlabeled; search expectation (3 JSON tools); grammar in tool intro.
