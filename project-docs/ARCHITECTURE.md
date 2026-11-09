# ARCHITECTURE
Stack: Next.js 15 (App Router) + React 19 + TypeScript (strict). Static export (`output: 'export'`, trailingSlash) for Cloudflare Pages. Styling: single global CSS file with design tokens (no CSS framework). Runtime dependencies: next, react, react-dom only.

## Layout
- `app/` routes: `/`, `/[category]/` (statically generated for 4 slugs), `/text/word-counter/`, not-found, robots, sitemap.
- `components/` shared UI. `lib/` data and pure processing logic (`categories.ts`, `tools.ts`, `text-stats.ts`).
- Rule: processing logic lives in `lib/` (pure, testable); UI in components; tool UIs in the tool's route folder.

## Adding a tool
1. Put processing in `lib/`. 2. Add route `app/<category>/<slug>/page.tsx` with unique metadata + canonical. 3. Add to `lib/tools.ts` only once functional. 4. Update docs.

## Processing strategy
Browser-only by default. Planned: Web Workers for heavy work, pdf-lib for PDF, Canvas for images (each justified in DECISIONS.md when added). No server processing exists.

## Ads / analytics / i18n
AdSlot renders nothing unless `NEXT_PUBLIC_ADS_ENABLED=true`. No analytics yet. i18n not yet implemented (plan: locale route segment or dictionary layer, decided in Phase 4).

## Env
`NEXT_PUBLIC_SITE_URL` (sitemap/robots/metadata base; defaults to placeholder https://example.com).
Deployment: not configured (UNKNOWN production target beyond Cloudflare Pages intent).

## Cloudflare & D1 (added 2026-11-09)
- Hosting: Cloudflare Pages serving the static export (`out/`). Server logic: Pages Functions in `functions/` (compiled by wrangler; separate `functions/tsconfig.json`, excluded from the root tsconfig).
- D1 binding `DB` (wrangler.toml). Schema in `migrations/` (apply with `npm run db:migrate:*`).
- Table `daily_events(day, category, tool, event, count)`: aggregate counters only. NO IPs, filenames, file contents or user ids.
- `POST /api/events`: same-origin check, 1 KB body cap, strict allowlist for event/category/slug, single UPSERT. Generic error responses; no payload logging.
- Client: `lib/analytics.ts` `track()` uses sendBeacon, off unless `NEXT_PUBLIC_ANALYTICS_ENABLED=true`, honours DNT and GPC. Events: tool_view (automatic via TrackView), tool_success (explicit user actions such as Copy), tool_error (reserved).
- Local dev: `npm run dev` for UI only (no /api); `npm run cf:dev` for Pages + local D1.
- Privacy statement: text tools run in the browser. If any future tool sends data to a Function/D1, it must be disclosed on that tool's page.
- Note: "No analytics yet" and "No server processing exists" statements earlier in this file are superseded: analytics counters exist; file/text processing remains client-side.

## Additions 2026-11-09 (pass 3)
- `lib/search.ts` (pure search), `components/Search.tsx` (header search).
- `lib/file-engine.ts`: `validateFiles` (empty, size, extension, MIME, max valid files), `formatBytes`, `downloadBlob` (revokes object URL). `components/Dropzone.tsx` uses it; shows `role="alert"` errors.
- `lib/web-tools.ts`: JSON parse/format/stats with its own strict error locator (browsers no longer give reliable error positions), Base64 (UTF-8, URL-safe), URL encode/decode.
- `components/Mascot.tsx` (4 temporary SVGs, decorative, `pointer-events: none`); replaces MascotPlaceholder.
- `lib/site.ts` (SITE_URL, CONTACT_EMAIL, static pages), `components/JsonLd.tsx` (BreadcrumbList).
- Accessibility rules in CSS: buttons use dark text (`--btn-text`) on brand colors; form labels use primary text (`.field-label`); category headings use primary text.
- Tests: `tests/*.test.mts` run with Node type-stripping (`npm test`).
