# AI HANDOFF
Read CLAUDE.md first. Stack: Next.js static export on Cloudflare Pages; Pages Functions in `functions/`; D1 binding `DB` for aggregate analytics only.
State: 9 tools (5 Text, 4 Web & Code), search, mascots (temporary), Dropzone + file-engine (no file tool yet), legal pages, D1 analytics. Logic unit-tested (`npm test`); UI checked with a Next stand-in (UI_TEST_REPORT.md). NEVER built with Next, never run on D1.
FIRST ACTIONS: `npm install && npm run lint && npm test && npm run build`; inspect `out/`; then `npm run db:migrate:local && npm run cf:dev`. Record real results in PROJECT_STATUS/BACKLOG and fix what breaks.
New tool pattern: pure logic in `lib/*.ts` + test in `tests/`; client component + `page.tsx` using `<ToolLayout>` in `app/<category>/<slug>/`; register in `lib/tools.ts` (functional tools only); `python3 scripts/gen-inventory.py`; update docs.
Next: verification -> QR Generator -> Phase 2 (Web Workers, download manager) -> image tools -> PDF tools.
Gotchas: `/bin/sh` has no brace expansion; no Next API routes under static export (use `functions/`); brand colors are fixed, but text colors on them follow D-008/D-009.
