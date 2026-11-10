# AI HANDOFF
Start with `project-docs/NEXT_CHAT_PROMPT.md` and `CLAUDE.md`. Stack: Next.js static export on Cloudflare Pages; Pages Functions in `functions/`; D1 (`DB`) for aggregate analytics only; everything else runs in the browser.
State (2026-11-10): 31 tools implemented and TESTED in a Next-less harness (see PROJECT_STATUS.md section 2). NEVER built with real Next, never run on D1, never deployed.
FIRST ACTIONS: `npm install && npm run lint && npm test && npm run build`; inspect `out/`; fix; record real results in PROJECT_STATUS/BACKLOG. Then `npm run db:migrate:local && npm run cf:dev`.
Adding a tool: logic in `lib/` + test in `tests/`; client component + `app/<category>/<slug>/page.tsx` with `ToolLayout`; register in `lib/tools.ts`; add to `tools/ui-harness/entry.tsx` + `routes.json`; rebuild and run the harness; `python3 scripts/gen-inventory.py`; update docs.
Gotchas: `/bin/sh` here has no brace expansion; Next static export has no API routes (use `functions/`); brand colours are fixed (text colours on them: D-008/D-009/D-015); `node_modules` may be a symlink in the authoring sandbox (excluded from the zip); lib files must stay import-light so Node can run them with type stripping.
Honesty rules: never report an unrun test as passed; HEIC and some PDF features are genuinely unsupported and documented on the pages.
