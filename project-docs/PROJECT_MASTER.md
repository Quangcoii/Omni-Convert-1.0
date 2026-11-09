# PROJECT MASTER — OMNI CONVERT
Slogan: "Your Everyday Tools, All in One Place." International free online file-conversion and productivity platform. Revenue: advertising (Google AdSense when eligible); optional premium later. No mandatory registration. English first; architecture must allow Japanese and Vietnamese later without duplicating the app.

## Categories (exactly four)
| Category | Slug | Primary | Background |
|---|---|---|---|
| Office | /office/ | #45A878 | #E5F4EA |
| Image | /image/ | #548FDC | #E7F0FC |
| Text | /text/ | #E47791 | #FCEAF0 |
| Web & Code | /web-code/ | #E9AA4D | #FFF3DF |

Global: background #FAFAF7, text #28332F, secondary #7C8582, border #EAECE8. One shared design system. Style: modern SaaS, minimal pastel, friendly.

## Mascots
Office=Panda, Image=Shark, Text=Cat, Web&Code=Bug. Minimal 2D line-art, rounded strokes, flat pastel, no 3D. Decorative only, inside the dropzone; must never block selection/drag-drop. Official assets not yet supplied (placeholder in use).

## Principles
- Privacy-first: process in-browser by default; disclose any server processing; no persistent storage of files; no file content/filenames in analytics.
- Conversion integrity: never fake a conversion; validate input; real output; document limitations (Fully / Partially / Unsupported / Requires server).
- Performance: minimal JS on non-tool pages, code splitting, Workers for heavy work.
- Security: validate inputs, no eval, no secrets in client, rate-limit any server endpoint.
- SEO: unique URL/title/description/H1/content per tool, canonical, sitemap from real pages. Example URLs: /office/merge-pdf/, /image/heic-to-jpg/, /text/word-counter/, /web-code/json-formatter/.
- Monetization: defined ad slots, disabled until approval; never over upload controls or download buttons. No paid infrastructure without approval.
- Analytics: privacy-conscious, consent-aware, aggregate only.

## Every tool page must have
Breadcrumb, title, short explanation, upload/input area, controls, result area, download action, supported formats & limitations, usage instructions, FAQs, related tools.

## Long-term tool catalog (NOT a requirement to build all at once)
Office: Merge/Split/Compress/Rotate PDF, PDF<->JPG, extract pages, CSV/Excel/JSON, dedupe rows. Image: JPG/PNG/WebP/HEIC conversions, compress, resize, crop, SVG, GIF, favicon. Text: counters, case converter, cleaner, diff, find/replace, lorem ipsum, markdown, slug. Web & Code: JSON/XML formatters, encoders, minifiers, regex tester, QR/barcode, color/timestamp/hash.
Phase 3 first release (20): Merge PDF, Split PDF, Compress PDF, JPG to PDF, PDF to JPG; JPG to PNG, PNG to JPG, WebP to JPG, Image Compressor, Image Resizer; Word Counter, Character Counter, Case Converter, Text Cleaner, Text Diff; JSON Formatter, JSON Validator, Base64, URL Encoder/Decoder, QR Generator. Do them in groups; test each before the next. Never create empty placeholder tools.

## Phases
0 Audit/Foundation · 1 Brand & site foundation · 2 File-processing engine · 3 First tool release · 4 SEO & i18n · 5 Monetization · 6 Expansion.
