# FEATURE MATRIX
Statuses: PLANNED, IN_PROGRESS, IMPLEMENTED, TESTED, RELEASED, BLOCKED. "TESTED" here means the documented tests (npm test and/or UI_TEST_REPORT.md) pass; nothing is RELEASED (never deployed).

| Feature | Status | Evidence / notes |
|---|---|---|
| Design tokens, header, footer, homepage, category pages, 404 | TESTED (UI harness) | not verified under Next build |
| Global tool search | TESTED (unit + UI harness) | |
| Mascots (4, temporary art) | IMPLEMENTED | visually reviewed; not official |
| ToolLayout (breadcrumb + JSON-LD, how-to, notes, FAQ, related) | TESTED (UI harness) | |
| Privacy, Terms, About pages | IMPLEMENTED | draft content; needs legal review |
| robots, sitemap, canonical, OG, favicon, _headers | IMPLEMENTED | emitted output not verified (no Next build) |
| File engine (validate, limits, formatBytes, downloadBlob) | TESTED (unit) | downloadBlob exercised via JSON download in UI harness |
| Dropzone | TESTED (UI harness) | not used by a released tool yet |
| D1 analytics (/api/events, migration, client) | IMPLEMENTED | type-checked with stub; never run on D1 |
| Ad slot (disabled) | IMPLEMENTED | |
| Word Counter, Character Counter | TESTED (unit + UI) | |
| Case Converter, Text Cleaner, Text Diff | TESTED (unit + UI) | |
| JSON Formatter (incl. download) | TESTED (unit + UI) | custom error locator |
| JSON Validator | TESTED (unit + UI) | syntax only, no schema |
| Base64 Encoder/Decoder | TESTED (unit + UI) | text only |
| URL Encoder/Decoder | TESTED (unit + UI) | |
| QR Generator | PLANNED | needs a library; not started |
| Image tools / PDF & Office tools | PLANNED | |
| Web Workers infrastructure | PLANNED | |
| i18n JA/VI, consent banner, AdSense | PLANNED | |
| Playwright tests in repo, CI | PLANNED | |
| Admin dashboard for D1 stats | PLANNED | needs auth + approval |
