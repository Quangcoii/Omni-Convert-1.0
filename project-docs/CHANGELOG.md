# CHANGELOG
## 2026-11-09
- Initial repository foundation: governance docs, CLAUDE.md, Next.js scaffold, shared layout, homepage, category pages, Word Counter, robots, sitemap, 404. Not yet built or tested.
- Cloudflare setup: wrangler.toml, D1 migration, /api/events Function, _headers, analytics client, TrackView.
- New tools: Character Counter, Case Converter, Text Cleaner, Text Diff. Word Counter moved to shared ToolLayout.
- Added tests/text-tools.test.mts (passes) and scripts/gen-inventory.py.
- Pass 3: global search; 4 mascot SVGs; Dropzone validation + lib/file-engine; Web & Code tools (JSON Formatter, JSON Validator, Base64, URL); Privacy/Terms/About; BreadcrumbList JSON-LD, OG tags, favicon, skip link; accessibility contrast fixes; UI_TEST_REPORT.md; 2 test files.
- Fixed: JSON error position missing in modern browsers (own locator); file-engine maxFiles now counts valid files only.
