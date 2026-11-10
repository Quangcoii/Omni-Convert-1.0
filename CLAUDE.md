# CLAUDE.md — OMNI CONVERT

Before ANY change, read in order: `project-docs/PROJECT_MASTER.md`, `PROJECT_STATUS.md`, `ARCHITECTURE.md`, `FEATURE_MATRIX.md`, relevant parts of `FILE_INVENTORY.md` and `DECISIONS.md`, then `AI_HANDOFF.md`. Then inspect the real code you will touch.

## Absolute rules
1. Inspect before modifying. 2. Never invent status; verify in code. 3. No unauthorized rewrites/framework swaps. 4. Minimal change. 5. Search for existing components/utilities before creating new ones. 6. Document every meaningful change. 7. Run checks (tsc, lint, build, tests) and report REAL results. 8. No silent failures / empty catch / fake success. 9. No fake data, fake downloads or simulated conversions. 10. Keep brand consistency (colors in globals.css / lib/categories.ts). 11. Protect user files: process locally by default; never claim "never leaves device" if a tool uploads. 12. Never commit secrets. 13. Add dependencies only with a written reason in DECISIONS.md. 14. Understand critical files before editing. 15. Be honest about limitations and untested work.

## Statuses (exact)
PLANNED, IN_PROGRESS, IMPLEMENTED (code exists, not fully verified), TESTED, RELEASED, BLOCKED.

## After every task
Update PROJECT_STATUS, FEATURE_MATRIX, FILE_INVENTORY (if files changed), CHANGELOG, BACKLOG (if issues), AI_HANDOFF.

## Ask the user first before
Destructive ops, major architecture changes, removing features, production infrastructure, recurring costs, sending user files to external servers.

## Resuming work
Read `project-docs/NEXT_CHAT_PROMPT.md`, `PROJECT_STATUS.md` (done / verified / to do) and `AI_HANDOFF.md` first. Regression harness: `tools/ui-harness/README.md`. Tests: `npm test`.
