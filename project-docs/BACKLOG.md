# BACKLOG
## Must verify first (nothing below has been run with real Next/Cloudflare)
- [ ] `npm install`, `npm run lint` (JSX never type-checked), `npm test`, `npm run build`; confirm version pins.
- [ ] Inspect `out/`: canonical, OG, JSON-LD, sitemap.xml (36+ URLs), robots.txt, favicon/manifest/OG files, `_headers`, 404; static `app/<category>/<tool>` routes next to `app/[category]`.
- [ ] pdf-lib dynamic import works in the Next/webpack build and is code-split.
- [ ] `wrangler pages dev out --d1=DB`: migration, POST /api/events 204/400/403, counters increment; sendBeacon sends Origin.
- [ ] Cross-browser: Safari (WebP encoding, createImageBitmap, clipboard), Firefox, real phones; Lighthouse; screen reader pass.
## Product
- [ ] PDF to JPG (pdfjs-dist), Compress PDF (honest about limits), Markdown converter, image crop, favicon generator, SVG tools, GIF tools, XML formatter, CSS/JS/HTML minifiers, barcode generator, XLSX tools (library needed).
- [ ] Web Workers for large files; ZIP download for batches (jszip); stricter memory/time limits.
- [ ] i18n JA/VI; consent banner if required; AdSense slots; popular tools from D1 data; admin stats view (needs auth + approval).
- [ ] Official mascot/logo vectors if available; decide D-009 (secondary text colour) and D-015 (gradient headline).
- [ ] Legal review of Privacy/Terms; set NEXT_PUBLIC_CONTACT_EMAIL and real SITE_URL.
## Quality / tech debt
- [ ] Put the UI harness into CI against the real build; Playwright tests in repo pipeline.
- [ ] Rate-limit rule for /api/events; restrict `tool` slugs server-side; track tool_error with reasons (no filenames).
- [ ] Sentence counting heuristic; JSON number precision; Merge PDF drops bookmarks; Image tools drop EXIF/ICC.
- [ ] Repeatable `npm run brand:export` script (currently tools/ui-harness/exportbuild.cjs + raster.cjs).
- [ ] Header has no EN language selector until i18n exists.
