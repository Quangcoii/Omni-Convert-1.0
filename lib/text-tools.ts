export type CaseMode = 'upper' | 'lower' | 'title' | 'sentence' | 'camel' | 'snake' | 'kebab';
const wordsOf = (s: string) => s.match(/[\p{L}\p{N}]+/gu) ?? [];
const cap = (w: string) => w.charAt(0).toUpperCase() + w.slice(1);
export function convertCase(text: string, mode: CaseMode): string {
  switch (mode) {
    case 'upper': return text.toUpperCase();
    case 'lower': return text.toLowerCase();
    case 'title': return text.toLowerCase().replace(/(^|[\s\-_(])(\p{L})/gu, (_m, a: string, b: string) => a + b.toUpperCase());
    case 'sentence': return text.toLowerCase().replace(/(^\s*|[.!?]\s+)(\p{L})/gu, (_m, a: string, b: string) => a + b.toUpperCase());
    case 'camel': return wordsOf(text.toLowerCase()).map((w, i) => (i ? cap(w) : w)).join('');
    case 'snake': return wordsOf(text.toLowerCase()).join('_');
    case 'kebab': return wordsOf(text.toLowerCase()).join('-');
  }
}
export interface CleanOptions { trimLines: boolean; collapseSpaces: boolean; removeBlankLines: boolean; removeDuplicateLines: boolean; }
export function cleanText(text: string, o: CleanOptions): string {
  let lines = text.replace(/\r\n?/g, '\n').split('\n');
  if (o.collapseSpaces) lines = lines.map((l) => l.replace(/[ \t\u00A0]+/g, ' '));
  if (o.trimLines) lines = lines.map((l) => l.trim());
  if (o.removeBlankLines) lines = lines.filter((l) => l.trim() !== '');
  if (o.removeDuplicateLines) { const seen = new Set<string>(); lines = lines.filter((l) => (seen.has(l) ? false : (seen.add(l), true))); }
  return lines.join('\n');
}
export interface DiffLine { type: 'same' | 'add' | 'del'; text: string; }
export const DIFF_MAX_CELLS = 4_000_000;
/** Line-based LCS diff. Returns null when inputs are too large for the in-browser limit. */
export function diffLines(a: string, b: string): DiffLine[] | null {
  const x = a.replace(/\r\n?/g, '\n').split('\n'), y = b.replace(/\r\n?/g, '\n').split('\n');
  const n = x.length, m = y.length;
  if (n * m > DIFF_MAX_CELLS) return null;
  const w = m + 1, dp = new Uint16Array((n + 1) * w);
  for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--)
    dp[i * w + j] = x[i] === y[j] ? dp[(i + 1) * w + j + 1] + 1 : Math.max(dp[(i + 1) * w + j], dp[i * w + j + 1]);
  const out: DiffLine[] = []; let i = 0, j = 0;
  while (i < n && j < m) {
    if (x[i] === y[j]) { out.push({ type: 'same', text: x[i] }); i++; j++; }
    else if (dp[(i + 1) * w + j] >= dp[i * w + j + 1]) out.push({ type: 'del', text: x[i++] });
    else out.push({ type: 'add', text: y[j++] });
  }
  while (i < n) out.push({ type: 'del', text: x[i++] });
  while (j < m) out.push({ type: 'add', text: y[j++] });
  return out;
}

export function slugify(text: string, o: { separator: '-' | '_'; lowercase: boolean; maxLength?: number } = { separator: '-', lowercase: true }): string {
  let t = text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D');
  t = t.replace(/[^A-Za-z0-9]+/g, o.separator).replace(new RegExp(`^\\${o.separator}+|\\${o.separator}+$`, 'g'), '');
  if (o.lowercase) t = t.toLowerCase();
  if (o.maxLength && t.length > o.maxLength) t = t.slice(0, o.maxLength).replace(new RegExp(`\\${o.separator}+$`), '');
  return t;
}
const LOREM = 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure in reprehenderit voluptate velit esse cillum fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum'.split(' ');
const rng = (seed: number) => () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
export type LoremUnit = 'paragraphs' | 'sentences' | 'words';
/** Placeholder text. `seed` makes output reproducible (tests); omit for random. */
export function generateLorem(unit: LoremUnit, count: number, o: { startWithLorem: boolean; seed?: number } = { startWithLorem: true }): string {
  const rand = rng(o.seed ?? Math.floor(Math.random() * 2 ** 31)); const n = Math.max(1, Math.min(1000, Math.floor(count)));
  const word = () => LOREM[Math.floor(rand() * LOREM.length)];
  const sentence = (first: boolean) => { const len = 8 + Math.floor(rand() * 9); const w: string[] = first ? ['lorem', 'ipsum', 'dolor', 'sit', 'amet'] : []; while (w.length < len) w.push(word()); if (len > 8) w[Math.floor(len / 2)] += ','; const t = w.join(' '); return t[0].toUpperCase() + t.slice(1) + '.'; };
  if (unit === 'words') { const w: string[] = o.startWithLorem ? ['lorem', 'ipsum', 'dolor', 'sit', 'amet'].slice(0, n) : []; while (w.length < n) w.push(word()); return w.join(' '); }
  if (unit === 'sentences') return Array.from({ length: n }, (_, i) => sentence(o.startWithLorem && i === 0)).join(' ');
  return Array.from({ length: n }, (_, p) => Array.from({ length: 4 + Math.floor(rand() * 3) }, (_, i) => sentence(o.startWithLorem && p === 0 && i === 0)).join(' ')).join('\n\n');
}
export type FindResult = { ok: true; output: string; count: number } | { ok: false; message: string };
export function findReplace(text: string, find: string, replacement: string, o: { regex: boolean; caseSensitive: boolean; wholeWord: boolean }): FindResult {
  if (!find) return { ok: false, message: 'Enter the text to find.' };
  const esc = (x: string) => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  let src = o.regex ? find : esc(find); if (o.wholeWord) src = `(?<![\\p{L}\\p{N}_])(?:${src})(?![\\p{L}\\p{N}_])`;
  let re: RegExp; try { re = new RegExp(src, `g${o.caseSensitive ? '' : 'i'}u`); } catch (e) { return { ok: false, message: `Invalid pattern: ${e instanceof Error ? e.message : 'error'}` }; }
  const count = [...text.matchAll(re)].length;
  const output = o.regex ? text.replace(re, replacement) : text.replace(re, () => replacement);
  return { ok: true, output, count };
}
export type SortOrder = 'asc' | 'desc' | 'length-asc' | 'length-desc' | 'reverse';
export function sortLines(text: string, o: { order: SortOrder; natural: boolean; caseSensitive: boolean; removeDuplicates: boolean; trim: boolean; removeEmpty: boolean }): string {
  let lines = text.replace(/\r\n?/g, '\n').split('\n'); if (o.trim) lines = lines.map((l) => l.trim()); if (o.removeEmpty) lines = lines.filter((l) => l.trim() !== '');
  if (o.removeDuplicates) { const seen = new Set<string>(); lines = lines.filter((l) => { const k = o.caseSensitive ? l : l.toLowerCase(); if (seen.has(k)) return false; seen.add(k); return true; }); }
  const cmp = (a: string, b: string) => a.localeCompare(b, undefined, { numeric: o.natural, sensitivity: o.caseSensitive ? 'variant' : 'base' });
  switch (o.order) { case 'asc': lines.sort(cmp); break; case 'desc': lines.sort((a, b) => cmp(b, a)); break; case 'length-asc': lines.sort((a, b) => a.length - b.length || cmp(a, b)); break; case 'length-desc': lines.sort((a, b) => b.length - a.length || cmp(a, b)); break; case 'reverse': lines.reverse(); break; }
  return lines.join('\n');
}
