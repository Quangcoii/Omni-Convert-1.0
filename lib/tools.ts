import type { CategorySlug } from './categories';
import type { IconName } from '@/components/Icons';
/** Only tools with REAL functionality may be listed here (Master Directive §1). */
export interface Tool { slug: string; icon: IconName; category: CategorySlug; name: string; description: string; }
export const TOOLS: Tool[] = [
  { slug: 'word-counter', icon: 'text', category: 'text', name: 'Word Counter', description: 'Count words, characters, sentences and paragraphs instantly in your browser.' },
  { slug: 'character-counter', icon: 'aa', category: 'text', name: 'Character Counter', description: 'Count characters with and without spaces and check them against a limit.' },
  { slug: 'case-converter', icon: 'aa', category: 'text', name: 'Case Converter', description: 'Convert text to UPPER, lower, Title, Sentence, camelCase, snake_case or kebab-case.' },
  { slug: 'text-cleaner', icon: 'text', category: 'text', name: 'Text Cleaner', description: 'Trim lines, collapse spaces, remove blank and duplicate lines.' },
  { slug: 'text-diff', icon: 'diff', category: 'text', name: 'Text Diff', description: 'Compare two texts line by line and see what was added or removed.' },
  { slug: 'json-formatter', icon: 'json', category: 'web-code', name: 'JSON Formatter', description: 'Format, beautify or minify JSON and download the result.' },
  { slug: 'json-validator', icon: 'json', category: 'web-code', name: 'JSON Validator', description: 'Check if JSON is valid, find the error position and see its structure.' },
  { slug: 'base64-encode-decode', icon: 'base64', category: 'web-code', name: 'Base64 Encoder/Decoder', description: 'Encode text to Base64 or decode Base64 back to text (UTF-8, URL-safe option).' },
  { slug: 'url-encode-decode', icon: 'link', category: 'web-code', name: 'URL Encoder/Decoder', description: 'Percent-encode or decode URLs and query-string values.' },
  { slug: "png-to-jpg", icon: "image", category: "image", name: "PNG to JPG", description: "Convert PNG images to JPG with adjustable quality. Transparent areas become white." },
  { slug: "jpg-to-png", icon: "image", category: "image", name: "JPG to PNG", description: "Convert JPG images to lossless PNG files." },
  { slug: "webp-to-jpg", icon: "image", category: "image", name: "WebP to JPG", description: "Convert WebP images to widely supported JPG files." },
  { slug: "jpg-to-webp", icon: "image", category: "image", name: "JPG to WebP", description: "Convert JPG or PNG images to smaller WebP files." },
  { slug: "image-compressor", icon: "image", category: "image", name: "Image Compressor", description: "Reduce image file size with adjustable quality; keep the format or switch to JPG or WebP." },
  { slug: "image-resizer", icon: "image", category: "image", name: "Image Resizer", description: "Resize images by percentage or exact pixel size, keeping the aspect ratio if you like." },
  { slug: "merge-pdf", icon: "pdf", category: "office", name: "Merge PDF", description: "Combine several PDF files into one, in the order you choose." },
  { slug: "split-pdf", icon: "pdf", category: "office", name: "Split PDF", description: "Extract pages or page ranges from a PDF into new files." },
  { slug: "rotate-pdf", icon: "pdf", category: "office", name: "Rotate PDF", description: "Rotate all or selected pages of a PDF by 90, 180 or 270 degrees." },
  { slug: "jpg-to-pdf", icon: "pdf", category: "office", name: "JPG to PDF", description: "Turn JPG, PNG or WebP images into a PDF, one image per page." },
  { slug: "csv-to-json", icon: "excel", category: "office", name: "CSV to JSON", description: "Convert CSV data to JSON with delimiter detection and optional type conversion." },
  { slug: "remove-duplicate-rows", icon: "excel", category: "office", name: "Remove Duplicate Rows", description: "Remove duplicate rows from CSV data, optionally comparing only some columns." },
  { slug: "slug-generator", icon: "text", category: "text", name: "Slug Generator", description: "Turn titles into clean URL slugs; handles accents including Vietnamese." },
  { slug: "lorem-ipsum-generator", icon: "text", category: "text", name: "Lorem Ipsum Generator", description: "Generate placeholder text as paragraphs, sentences or words." },
  { slug: "find-and-replace", icon: "diff", category: "text", name: "Find and Replace", description: "Find and replace text with optional case, whole-word and regular-expression matching." },
  { slug: "sort-lines", icon: "text", category: "text", name: "Sort Lines", description: "Sort lines alphabetically, by length or in reverse; remove duplicates and empty lines." },
  { slug: "qr-code-generator", icon: "qr", category: "web-code", name: "QR Code Generator", description: "Create QR codes for text or URLs and download them as PNG or SVG." },
  { slug: "color-converter", icon: "color", category: "web-code", name: "Color Converter", description: "Convert colours between HEX, RGB, HSL and HSV and check contrast." },
  { slug: "timestamp-converter", icon: "clock", category: "web-code", name: "Timestamp Converter", description: "Convert Unix timestamps to dates and dates to Unix timestamps." },
  { slug: "hash-generator", icon: "hash", category: "web-code", name: "Hash Generator", description: "Calculate SHA-1, SHA-256, SHA-384 and SHA-512 hashes of text or files." },
  { slug: "html-encode-decode", icon: "code", category: "web-code", name: "HTML Encoder/Decoder", description: "Escape or unescape HTML entities such as &amp;, &lt; and &#39;." },
  { slug: "regex-tester", icon: "regex", category: "web-code", name: "Regex Tester", description: "Test JavaScript regular expressions with live match highlighting and groups." },
];
export const toolHref = (t: Tool) => `/${t.category}/${t.slug}/`;
export const toolsByCategory = (c: CategorySlug) => TOOLS.filter((t) => t.category === c);
export const getTool = (category: CategorySlug, slug: string) => TOOLS.find((t) => t.category === category && t.slug === slug);

const POPULAR = ['png-to-jpg', 'image-compressor', 'merge-pdf', 'jpg-to-pdf', 'qr-code-generator', 'json-formatter', 'image-resizer', 'split-pdf', 'csv-to-json', 'word-counter', 'case-converter', 'hash-generator'];
export const popularTools = (): Tool[] => POPULAR.map((s) => TOOLS.find((t) => t.slug === s)!).filter(Boolean);
