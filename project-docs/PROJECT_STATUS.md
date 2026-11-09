# PROJECT STATUS
Date: 2026-11-09
Phase: 0 complete. Phase 1 mostly implemented (search, mascots, legal pages added). Phase 2 foundation started (file-engine). Phase 3: Text group (5/5) and Web & Code group (4/5, QR pending).
Deployment target: Cloudflare Pages + Functions + D1.

## Verified with real runs
- `npm test`: 2 files PASS (text tools, web tools, search, file-engine, JSON error locator).
- Type-check (tsc strict) of lib/, tests/ and functions/api/events.ts with a minimal D1 stub: clean. JSX/Next files NOT type-checked (@types/react and next unavailable offline).
- UI: 224/224 automated Chromium checks on the real components (see UI_TEST_REPORT.md). This used a Next.js stand-in, so it is not a Next build.

## NOT VERIFIED
`npm install`, `next build`, static export output (metadata, sitemap.xml, robots.txt, canonical tags), `wrangler pages dev`, D1 migration, /api/events end-to-end, `_headers`, Lighthouse, real-device and cross-browser tests. Pinned versions (next, react, wrangler, workers-types) were chosen from memory.

## Gap analysis vs Master Directive (what was missing -> status)
| Gap | Status |
|---|---|
| Global tool search | DONE (Search + lib/search) |
| 4 mascots | DONE as temporary line-art; official art still needed |
| Dropzone with validation, file limits, download helper | DONE (lib/file-engine); not used by a released tool yet |
| Privacy / Terms / About pages (needed before AdSense) | DONE as drafts; legal review needed |
| Breadcrumb structured data, OG tags, favicon, skip link | DONE |
| Web & Code tools (JSON x2, Base64, URL) | DONE; QR Generator NOT done (needs a library decision) |
| Accessibility contrast of brand colors | PARTLY fixed (buttons, chips, headings); secondary text color still 3.6:1, needs owner decision (BACKLOG) |
| Image and Office tools, Web Workers, PDF libs | NOT started (Phase 2/3) |
| i18n (JA, VI) | NOT started (Phase 4) |
| Consent banner, AdSense | NOT started (Phase 5) |
| Admin view of D1 stats | NOT started (needs auth design) |
| Deploy config in repo (CI), Playwright tests in repo | NOT started |

## Owner actions required
1. `npx wrangler d1 create omni-convert-db`, paste id in wrangler.toml, run db:migrate scripts.
2. Pages project: build `npm run build`, output `out`, bind D1 as `DB`, set NEXT_PUBLIC_SITE_URL (and NEXT_PUBLIC_CONTACT_EMAIL, NEXT_PUBLIC_ANALYTICS_ENABLED when ready).
3. Add a Cloudflare rate-limit rule for /api/events.
4. Have the Privacy Policy and Terms reviewed before launch.
