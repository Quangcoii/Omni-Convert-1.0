export type Delimiter = ',' | ';' | '\t' | '|';
export const DELIMITERS: Delimiter[] = [',', ';', '\t', '|'];
/** Picks the delimiter that appears most in the first line (outside quotes). */
export function detectDelimiter(text: string): Delimiter {
  const first = text.replace(/^\uFEFF/, '').split(/\r?\n/)[0] ?? ''; let inQ = false; const counts = new Map<string, number>();
  for (const ch of first) { if (ch === '"') inQ = !inQ; else if (!inQ && (DELIMITERS as string[]).includes(ch)) counts.set(ch, (counts.get(ch) ?? 0) + 1); }
  let best: Delimiter = ','; let n = 0; for (const d of DELIMITERS) if ((counts.get(d) ?? 0) > n) { n = counts.get(d)!; best = d; } return best;
}
/** RFC 4180-style parser: quotes, escaped quotes, CRLF/LF, newlines inside quotes, UTF-8 BOM. Throws on an unterminated quote. */
export function parseCsv(text: string, delimiter: Delimiter = detectDelimiter(text)): string[][] {
  const s = text.replace(/^\uFEFF/, ''); const rows: string[][] = []; let row: string[] = []; let cell = ''; let inQ = false; let i = 0;
  while (i < s.length) {
    const c = s[i];
    if (inQ) { if (c === '"') { if (s[i + 1] === '"') { cell += '"'; i += 2; continue; } inQ = false; i++; continue; } cell += c; i++; continue; }
    if (c === '"' && cell === '') { inQ = true; i++; continue; }
    if (c === delimiter) { row.push(cell); cell = ''; i++; continue; }
    if (c === '\r' || c === '\n') { row.push(cell); rows.push(row); row = []; cell = ''; if (c === '\r' && s[i + 1] === '\n') i++; i++; continue; }
    cell += c; i++;
  }
  if (inQ) throw new Error('A quoted field is not closed (missing closing ").');
  if (cell !== '' || row.length) { row.push(cell); rows.push(row); }
  return rows.filter((r) => !(r.length === 1 && r[0] === ''));
}
export function toCsv(rows: string[][], delimiter: Delimiter = ','): string {
  const q = (v: string) => (v.includes(delimiter) || /["\r\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);
  return rows.map((r) => r.map(q).join(delimiter)).join('\n');
}
const infer = (v: string): string | number | boolean => {
  if (/^-?(0|[1-9]\d*)(\.\d+)?$/.test(v) && Number.isSafeInteger(Number(v)) || /^-?(0|[1-9]\d*)\.\d+$/.test(v)) return Number(v);
  if (v === 'true') return true; if (v === 'false') return false; return v;
};
export interface CsvToJsonResult { json: unknown; delimiter: Delimiter; rowCount: number; }
export function csvToJson(text: string, o: { delimiter?: Delimiter; header: boolean; inferTypes: boolean }): CsvToJsonResult {
  const delimiter = o.delimiter ?? detectDelimiter(text); const rows = parseCsv(text, delimiter);
  if (!rows.length) throw new Error('No data found.');
  const conv = (v: string) => (o.inferTypes ? infer(v) : v);
  if (!o.header) return { json: rows.map((r) => r.map(conv)), delimiter, rowCount: rows.length };
  const seen = new Map<string, number>();
  const headers = rows[0].map((h, i) => { const base = h.trim() || `column_${i + 1}`; const n = (seen.get(base) ?? 0) + 1; seen.set(base, n); return n === 1 ? base : `${base}_${n}`; });
  const objs = rows.slice(1).map((r) => Object.fromEntries(headers.map((h, i) => [h, conv(r[i] ?? '')])));
  return { json: objs, delimiter, rowCount: objs.length };
}
export function removeDuplicateRows(rows: string[][], o: { header: boolean; caseSensitive: boolean; trimCells: boolean; columns?: number[] }): { rows: string[][]; removed: number } {
  const head = o.header ? rows.slice(0, 1) : []; const body = o.header ? rows.slice(1) : rows; const seen = new Set<string>(); const kept: string[][] = [];
  for (const r of body) {
    let cells = o.columns?.length ? o.columns.map((c) => r[c] ?? '') : r;
    cells = cells.map((v) => { let x = o.trimCells ? v.trim() : v; if (!o.caseSensitive) x = x.toLowerCase(); return x; });
    const key = JSON.stringify(cells); if (seen.has(key)) continue; seen.add(key); kept.push(r);
  }
  return { rows: [...head, ...kept], removed: body.length - kept.length };
}
