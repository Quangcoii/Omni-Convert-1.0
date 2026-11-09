# BACKLOG
## Must verify first
- [ ] `npm install`, `npm run lint` (JSX never type-checked), `npm test`, `npm run build`; confirm pinned versions exist.
- [ ] Inspect `out/`: canonical, OG, JSON-LD, sitemap.xml, robots.txt, `_headers` copied, 404 page; `[category]` coexisting with `app/<category>/<tool>` routes.
- [ ] `wrangler pages dev out --d1=DB`: migration, POST /api/events 204/400/403, counts increment.
- [ ] sendBeacon sends an Origin header in target browsers (else /api/events returns 403).
- [ ] Next + `allowImportingTsExtensions` not needed (lib files import nothing); keep it that way or update tsconfig.
## Product gaps
- [ ] QR Generator (D-011). Image tools, PDF/Office tools, Web Workers (Phase 2/3).
- [ ] Official mascot assets; consider animation hooks.
- [ ] Decide secondary text color (D-009).
- [ ] i18n JA/VI (Phase 4); consent banner if required (D-006); AdSense (Phase 5).
- [ ] Legal review of Privacy/Terms; set NEXT_PUBLIC_CONTACT_EMAIL; replace placeholder SITE_URL.
- [ ] Group tools on the homepage by category when the catalog grows; popular-tools logic from D1 data.
## Quality
- [ ] Move the Playwright UI checks into the repo (against `next build` output) and add CI.
- [ ] Rate-limit rule for /api/events; restrict `tool` to real slugs; track tool_error; admin stats view (needs auth).
- [ ] Sentence counting is heuristic; JSON Formatter loses precision on huge numbers (documented on the page).
- [ ] Real screen-reader and cross-browser testing; Lighthouse.
