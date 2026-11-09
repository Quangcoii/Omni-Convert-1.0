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
