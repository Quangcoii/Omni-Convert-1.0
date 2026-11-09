import type { CategorySlug } from './categories';
/** Only tools with REAL functionality may be listed here (Master Directive §1). */
export interface Tool { slug: string; category: CategorySlug; name: string; description: string; }
export const TOOLS: Tool[] = [
  { slug: 'word-counter', category: 'text', name: 'Word Counter', description: 'Count words, characters, sentences and paragraphs instantly in your browser.' },
  { slug: 'character-counter', category: 'text', name: 'Character Counter', description: 'Count characters with and without spaces and check them against a limit.' },
  { slug: 'case-converter', category: 'text', name: 'Case Converter', description: 'Convert text to UPPER, lower, Title, Sentence, camelCase, snake_case or kebab-case.' },
  { slug: 'text-cleaner', category: 'text', name: 'Text Cleaner', description: 'Trim lines, collapse spaces, remove blank and duplicate lines.' },
  { slug: 'text-diff', category: 'text', name: 'Text Diff', description: 'Compare two texts line by line and see what was added or removed.' },
  { slug: 'json-formatter', category: 'web-code', name: 'JSON Formatter', description: 'Format, beautify or minify JSON and download the result.' },
  { slug: 'json-validator', category: 'web-code', name: 'JSON Validator', description: 'Check if JSON is valid, find the error position and see its structure.' },
  { slug: 'base64-encode-decode', category: 'web-code', name: 'Base64 Encoder/Decoder', description: 'Encode text to Base64 or decode Base64 back to text (UTF-8, URL-safe option).' },
  { slug: 'url-encode-decode', category: 'web-code', name: 'URL Encoder/Decoder', description: 'Percent-encode or decode URLs and query-string values.' },
];
export const toolHref = (t: Tool) => `/${t.category}/${t.slug}/`;
export const toolsByCategory = (c: CategorySlug) => TOOLS.filter((t) => t.category === c);
export const getTool = (category: CategorySlug, slug: string) => TOOLS.find((t) => t.category === category && t.slug === slug);
