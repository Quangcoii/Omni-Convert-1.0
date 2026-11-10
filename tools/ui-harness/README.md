# UI harness (dev tool, not shipped to users)
Runs the project's REAL React components in Chromium without Next.js (esbuild bundle + tiny stubs for next/link and next/navigation). Useful when Next cannot be installed. It does NOT test Next routing, metadata, sitemap, Functions or D1; use a real `next build` for those.

Requirements: Node with `esbuild`, `playwright` (+ Chromium) and `react`/`react-dom` resolvable from `NPM_TOOLS` (default /opt/npm-tools/node_modules). Env: `REPO` (default ../..), `PLAYWRIGHT_BROWSERS_PATH`. Python: `pip install pillow reportlab pypdf opencv-python`.

```
cd tools/ui-harness
python3 ../../tests/fixtures/make_fixtures.py          # sample files in /tmp/fx
node build.cjs                                         # bundle (regenerate entry.tsx/routes.json when tools are added, see below)
PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers node run.cjs   # all routes desktop+mobile + interactions  (472 checks on 2026-11-10)
PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers node run2.cjs  # functional tests with real files          (49 checks)
python3 ../../tests/fixtures/verify_outputs.py         # independent checks of downloaded files      (18 checks)
```
Screenshots go to `shots/`. When you add a tool page, add it to `entry.tsx` (import + ROUTES entry) and to `routes.json`, then rebuild.
`exportbuild.cjs` + `exporter.tsx` + `raster.cjs` regenerate the brand SVG/PNG files in public/brand and the OG image from the components.
