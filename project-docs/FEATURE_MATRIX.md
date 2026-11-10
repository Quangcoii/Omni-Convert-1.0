# FEATURE MATRIX
Statuses: PLANNED, IN_PROGRESS, IMPLEMENTED, TESTED, RELEASED, BLOCKED. Here **TESTED** means: unit tests pass (`npm test`) AND the UI was exercised in Chromium AND (for file tools) the downloaded output was checked by an independent program. **Nothing is RELEASED** (never deployed) and nothing was built with a real `next build` yet.

## Tools (31 implemented)
| Category | Tool | URL | Status | Evidence |
|---|---|---|---|---|
| Text | Word Counter | /text/word-counter/ | TESTED | unit + UI harness |
| Text | Character Counter | /text/character-counter/ | TESTED | unit + UI harness |
| Text | Case Converter | /text/case-converter/ | TESTED | unit + UI harness |
| Text | Text Cleaner | /text/text-cleaner/ | TESTED | unit + UI harness |
| Text | Text Diff | /text/text-diff/ | TESTED | unit + UI harness |
| Web & Code | JSON Formatter | /web-code/json-formatter/ | TESTED | unit + UI harness |
| Web & Code | JSON Validator | /web-code/json-validator/ | TESTED | unit + UI harness |
| Web & Code | Base64 Encoder/Decoder | /web-code/base64-encode-decode/ | TESTED | unit + UI harness |
| Web & Code | URL Encoder/Decoder | /web-code/url-encode-decode/ | TESTED | unit + UI harness |
| Image | PNG to JPG | /image/png-to-jpg/ | TESTED | unit (image-tools) + UI + output verified with Pillow |
| Image | JPG to PNG | /image/jpg-to-png/ | TESTED | unit + UI + Pillow |
| Image | WebP to JPG | /image/webp-to-jpg/ | TESTED | unit + UI + Pillow |
| Image | JPG to WebP | /image/jpg-to-webp/ | TESTED | unit + UI + Pillow (needs browser WebP encoder) |
| Image | Image Compressor | /image/image-compressor/ | TESTED | unit + UI + Pillow (size reduced) |
| Image | Image Resizer | /image/image-resizer/ | TESTED | unit + UI + Pillow (dimensions) |
| Office | Merge PDF | /office/merge-pdf/ | TESTED | unit + UI + pypdf |
| Office | Split PDF | /office/split-pdf/ | TESTED | unit + UI + pypdf |
| Office | Rotate PDF | /office/rotate-pdf/ | TESTED | unit + UI + pypdf |
| Office | JPG to PDF | /office/jpg-to-pdf/ | TESTED | UI + pypdf (pages, embedded images) |
| Office | CSV to JSON | /office/csv-to-json/ | TESTED | unit + UI + file output |
| Office | Remove Duplicate Rows | /office/remove-duplicate-rows/ | TESTED | unit + UI |
| Text | Slug Generator | /text/slug-generator/ | TESTED | unit + UI harness |
| Text | Lorem Ipsum Generator | /text/lorem-ipsum-generator/ | TESTED | unit + UI harness |
| Text | Find and Replace | /text/find-and-replace/ | TESTED | unit + UI harness |
| Text | Sort Lines | /text/sort-lines/ | TESTED | unit + UI harness |
| Web & Code | QR Code Generator | /web-code/qr-code-generator/ | TESTED | unit + UI + OpenCV decode (88/88 codes, PNG download decoded) |
| Web & Code | Color Converter | /web-code/color-converter/ | TESTED | unit + UI |
| Web & Code | Timestamp Converter | /web-code/timestamp-converter/ | TESTED | unit + UI |
| Web & Code | Hash Generator | /web-code/hash-generator/ | TESTED | unit (known vectors) + UI + Python hashlib |
| Web & Code | HTML Encoder/Decoder | /web-code/html-encode-decode/ | TESTED | unit + UI |
| Web & Code | Regex Tester | /web-code/regex-tester/ | TESTED | unit + UI |

## Site features
| Feature | Status | Notes |
|---|---|---|
| Design tokens, header (logo, search, categories), hero, category pages, /tools/, 404 | TESTED (UI harness) | not verified under a Next build |
| Global search | TESTED (unit + UI) | |
| Logo set, favicon, apple icon, manifest, OG image | IMPLEMENTED | SVG/PNG exported to public/brand + app/; emitted output not verified under Next |
| Mascots (4 characters x 4 states), icon tiles (20), upload card (4 states) | TESTED (UI harness) | hand-built SVG approximations of the owner's art (D-013) |
| Dropzone + file-engine (validation, limits, download) | TESTED (unit + UI) | used by image/PDF tools |
| Privacy / Terms / About | IMPLEMENTED | draft text, needs legal review |
| robots, sitemap, canonical, OG tags, BreadcrumbList JSON-LD, security headers | IMPLEMENTED | emitted files not verified (no Next build) |
| D1 aggregate analytics (/api/events, migration, client) | IMPLEMENTED | type-checked with a stub; never run on real D1; disabled by default |
| Ad slot | IMPLEMENTED | renders nothing unless enabled |
| /brand/ reference page (noindex) | TESTED (UI harness) | static previews only |

## Not built yet (PLANNED)
PDF to JPG, Compress PDF, Word/Excel/PowerPoint tools (XLSX needs a library), Markdown converter, HEIC to JPG (browsers cannot decode reliably), Image crop, favicon generator, SVG tools, GIF tools, image metadata viewer, XML formatter, CSS/JS/HTML minifiers, barcode generator, text diff by word, Web Worker infrastructure, ZIP download for multi-file results, i18n (JA/VI), consent banner, AdSense, admin view of D1 stats, CI + Playwright tests in the repo pipeline, PWA/service worker.
