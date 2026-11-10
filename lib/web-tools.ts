export type JsonResult = { ok: true; value: unknown } | { ok: false; message: string; line?: number; column?: number };
/** Strict RFC 8259 scanner used only to locate the first syntax error (browsers no longer report positions reliably). */
function findJsonError(s: string): { pos: number; message: string } | null {
  let i = 0;
  const fail = (message: string): never => { throw { pos: i, message }; };
  const tok = () => (i >= s.length ? 'end of input' : `'${s[i]}'`);
  const ws = () => { while (i < s.length && ' \t\n\r'.includes(s[i])) i++; };
  const str = () => {
    i++;
    while (i < s.length) {
      const c = s[i];
      if (c === '"') { i++; return; }
      if (c === '\\') {
        i++; const e = s[i];
        if (e !== undefined && '"\\/bfnrt'.includes(e)) i++;
        else if (e === 'u' && /^[0-9a-fA-F]{4}$/.test(s.slice(i + 1, i + 5))) i += 5;
        else fail('Invalid escape sequence in string');
        continue;
      }
      if (c < ' ') fail('Unescaped control character in string');
      i++;
    }
    fail('Unterminated string');
  };
  const num = /-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?/y;
  const value = (): void => {
    ws();
    const c = s[i];
    if (c === '{') {
      i++; ws(); if (s[i] === '}') { i++; return; }
      for (;;) {
        ws(); if (s[i] !== '"') fail(`Expected a double-quoted property name but found ${tok()}`);
        str(); ws(); if (s[i] !== ':') fail(`Expected ':' but found ${tok()}`);
        i++; value(); ws();
        if (s[i] === ',') { i++; continue; }
        if (s[i] === '}') { i++; return; }
        fail(`Expected ',' or '}' but found ${tok()}`);
      }
    }
    if (c === '[') {
      i++; ws(); if (s[i] === ']') { i++; return; }
      for (;;) {
        value(); ws();
        if (s[i] === ',') { i++; continue; }
        if (s[i] === ']') { i++; return; }
        fail(`Expected ',' or ']' but found ${tok()}`);
      }
    }
    if (c === '"') return str();
    for (const lit of ['true', 'false', 'null']) if (s.startsWith(lit, i)) { i += lit.length; return; }
    num.lastIndex = i; const m = num.exec(s);
    if (!m) fail(`Unexpected ${tok()}`);
    i += m![0].length;
  };
  try { value(); ws(); if (i < s.length) fail(`Unexpected ${tok()} after the end of the JSON value`); return null; }
  catch (e) { return e && typeof e === 'object' && 'pos' in e ? (e as { pos: number; message: string }) : { pos: 0, message: 'Invalid JSON' }; }
}
export function parseJson(text: string): JsonResult {
  if (!text.trim()) return { ok: false, message: 'Input is empty.' };
  try { return { ok: true, value: JSON.parse(text) }; }
  catch (e) {
    const loc = findJsonError(text);
    if (!loc) return { ok: false, message: e instanceof Error ? e.message : 'Invalid JSON' };
    const before = text.slice(0, loc.pos);
    return { ok: false, message: loc.message, line: before.split('\n').length, column: loc.pos - before.lastIndexOf('\n') };
  }
}
export type JsonIndent = 2 | 4 | 'tab' | 'min';
export function formatJson(text: string, indent: JsonIndent): { ok: true; output: string } | Extract<JsonResult, { ok: false }> {
  const r = parseJson(text);
  if (!r.ok) return r;
  return { ok: true, output: indent === 'min' ? JSON.stringify(r.value) : JSON.stringify(r.value, null, indent === 'tab' ? '\t' : indent) };
}
export interface JsonStats { rootType: string; depth: number; objects: number; arrays: number; keys: number; strings: number; numbers: number; booleans: number; nulls: number; }
export function jsonStats(value: unknown): JsonStats {
  const s: JsonStats = { rootType: value === null ? 'null' : Array.isArray(value) ? 'array' : typeof value, depth: 0, objects: 0, arrays: 0, keys: 0, strings: 0, numbers: 0, booleans: 0, nulls: 0 };
  const walk = (x: unknown, d: number): void => {
    if (x === null) s.nulls++;
    else if (Array.isArray(x)) { s.arrays++; s.depth = Math.max(s.depth, d); x.forEach((i) => walk(i, d + 1)); }
    else if (typeof x === 'object') { const e = Object.entries(x as object); s.objects++; s.keys += e.length; s.depth = Math.max(s.depth, d); e.forEach(([, v]) => walk(v, d + 1)); }
    else if (typeof x === 'string') s.strings++;
    else if (typeof x === 'number') s.numbers++;
    else if (typeof x === 'boolean') s.booleans++;
  };
  walk(value, 1);
  return s;
}
export type TextResult = { ok: true; output: string } | { ok: false; message: string };
export function base64Encode(text: string, urlSafe = false): string {
  const bytes = new TextEncoder().encode(text); let bin = '';
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  const out = btoa(bin);
  return urlSafe ? out.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '') : out;
}
export function base64Decode(input: string): TextResult {
  let s = input.trim().replace(/\s+/g, '').replace(/-/g, '+').replace(/_/g, '/');
  if (!s) return { ok: false, message: 'Input is empty.' };
  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(s)) return { ok: false, message: 'Contains characters that are not valid Base64.' };
  s = s.replace(/=+$/, '');
  if (s.length % 4 === 1) return { ok: false, message: 'Invalid Base64 length.' };
  s += '='.repeat((4 - (s.length % 4)) % 4);
  try {
    const bin = atob(s);
    return { ok: true, output: new TextDecoder('utf-8', { fatal: true }).decode(Uint8Array.from(bin, (c) => c.charCodeAt(0))) };
  } catch { return { ok: false, message: 'Decoded bytes are not valid UTF-8 text (it may be binary data).' }; }
}
export type UrlMode = 'component' | 'full';
export function urlEncode(text: string, mode: UrlMode): TextResult {
  try { return { ok: true, output: mode === 'component' ? encodeURIComponent(text) : encodeURI(text) }; }
  catch { return { ok: false, message: 'Text contains an unpaired surrogate and cannot be encoded.' }; }
}
export function urlDecode(text: string, mode: UrlMode): TextResult {
  try { return { ok: true, output: mode === 'component' ? decodeURIComponent(text) : decodeURI(text) }; }
  catch { return { ok: false, message: 'Malformed percent-encoding (for example a lone % sign).' }; }
}

// ---- Color
export interface Rgba { r: number; g: number; b: number; a: number; }
const NAMED: Record<string, string> = { black: '#000000', white: '#ffffff', red: '#ff0000', green: '#008000', blue: '#0000ff', yellow: '#ffff00', orange: '#ffa500', purple: '#800080', pink: '#ffc0cb', gray: '#808080', grey: '#808080', cyan: '#00ffff', magenta: '#ff00ff', teal: '#008080', navy: '#000080', brown: '#a52a2a' };
export function parseColor(input: string): Rgba | null {
  let s = input.trim().toLowerCase(); if (NAMED[s]) s = NAMED[s];
  let m = s.match(/^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/);
  if (m) { let h = m[1]; if (h.length <= 4) h = h.split('').map((c) => c + c).join(''); return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16), a: h.length === 8 ? Math.round((parseInt(h.slice(6, 8), 16) / 255) * 1000) / 1000 : 1 }; }
  m = s.match(/^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)(?:\s*[,/]\s*([\d.]+%?))?\s*\)$/);
  if (m) { const [r, g, b] = [m[1], m[2], m[3]].map(Number); if ([r, g, b].some((v) => v > 255)) return null; const a = m[4] ? (m[4].endsWith('%') ? parseFloat(m[4]) / 100 : parseFloat(m[4])) : 1; return a > 1 ? null : { r: Math.round(r), g: Math.round(g), b: Math.round(b), a }; }
  m = s.match(/^hsla?\(\s*([\d.]+)(?:deg)?[\s,]+([\d.]+)%[\s,]+([\d.]+)%(?:\s*[,/]\s*([\d.]+%?))?\s*\)$/);
  if (m) { const h = Number(m[1]) % 360, sat = Number(m[2]) / 100, l = Number(m[3]) / 100; if (sat > 1 || l > 1) return null; const k = (n: number) => (n + h / 30) % 12; const f = (n: number) => l - sat * Math.min(l, 1 - l) * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1)); const a = m[4] ? (m[4].endsWith('%') ? parseFloat(m[4]) / 100 : parseFloat(m[4])) : 1; return { r: Math.round(f(0) * 255), g: Math.round(f(8) * 255), b: Math.round(f(4) * 255), a }; }
  return null;
}
export function formatColor(c: Rgba) {
  const hex = (n: number) => n.toString(16).padStart(2, '0'); const r = c.r / 255, g = c.g / 255, b = c.b / 255; const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
  let h = 0; if (d) h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4; h = Math.round(((h * 60) + 360) % 360);
  const l = (max + min) / 2; const sl = d ? d / (1 - Math.abs(2 * l - 1)) : 0; const sv = max ? d / max : 0; const A = c.a < 1;
  const lin = (v: number) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4); const lum = 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
  const ratio = (l2: number) => Math.round(((Math.max(lum, l2) + 0.05) / (Math.min(lum, l2) + 0.05)) * 100) / 100;
  return {
    hex: `#${hex(c.r)}${hex(c.g)}${hex(c.b)}${A ? hex(Math.round(c.a * 255)) : ''}`,
    rgb: A ? `rgba(${c.r}, ${c.g}, ${c.b}, ${c.a})` : `rgb(${c.r}, ${c.g}, ${c.b})`,
    hsl: A ? `hsla(${h}, ${Math.round(sl * 100)}%, ${Math.round(l * 100)}%, ${c.a})` : `hsl(${h}, ${Math.round(sl * 100)}%, ${Math.round(l * 100)}%)`,
    hsv: `hsv(${h}, ${Math.round(sv * 100)}%, ${Math.round(max * 100)}%)`, contrastOnWhite: ratio(1), contrastOnBlack: ratio(0),
  };
}
// ---- Timestamp
export type TimestampInfo = { ok: true; unixSeconds: number; unixMs: number; iso: string; utc: string; local: string; timeZone: string; relative: string; interpretedAs: 'seconds' | 'milliseconds' | 'date' } | { ok: false; message: string };
export function describeTimestamp(input: string, now = Date.now()): TimestampInfo {
  const s = input.trim(); if (!s) return { ok: false, message: 'Enter a Unix timestamp or a date.' };
  let ms: number; let kind: 'seconds' | 'milliseconds' | 'date';
  if (/^-?\d+(\.\d+)?$/.test(s)) { const n = Number(s); if (Math.abs(n) >= 1e11) { ms = n; kind = 'milliseconds'; } else { ms = n * 1000; kind = 'seconds'; } }
  else { ms = Date.parse(s); kind = 'date'; if (Number.isNaN(ms)) return { ok: false, message: 'Could not read that date. Try an ISO date such as 2026-11-09T10:30:00Z.' }; }
  const d = new Date(ms); if (Number.isNaN(d.getTime())) return { ok: false, message: 'That value is outside the supported date range.' };
  const diff = Math.round((ms - now) / 1000); const abs = Math.abs(diff); const units: [number, string][] = [[31536000, 'year'], [2592000, 'month'], [86400, 'day'], [3600, 'hour'], [60, 'minute'], [1, 'second']];
  const [sz, nm] = units.find(([u]) => abs >= u) ?? [1, 'second']; const q = Math.floor(abs / sz); const rel = abs < 1 ? 'now' : diff > 0 ? `in ${q} ${nm}${q === 1 ? '' : 's'}` : `${q} ${nm}${q === 1 ? '' : 's'} ago`;
  return { ok: true, unixSeconds: Math.floor(ms / 1000), unixMs: ms, iso: d.toISOString(), utc: d.toUTCString(), local: d.toString(), timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, relative: rel, interpretedAs: kind };
}
// ---- Hash
export type HashAlgorithm = 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512';
export const HASH_ALGORITHMS: HashAlgorithm[] = ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'];
export async function hashBytes(alg: HashAlgorithm, bytes: Uint8Array): Promise<string> {
  const d = await crypto.subtle.digest(alg, bytes as BufferSource); return [...new Uint8Array(d)].map((b) => b.toString(16).padStart(2, '0')).join('');
}
export const hashText = (alg: HashAlgorithm, text: string) => hashBytes(alg, new TextEncoder().encode(text));
// ---- HTML entities
const ENT: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: '\u00a0', copy: '\u00a9', reg: '\u00ae', trade: '\u2122', hellip: '\u2026', mdash: '\u2014', ndash: '\u2013', euro: '\u20ac', laquo: '\u00ab', raquo: '\u00bb' };
export function htmlEncode(text: string, o: { quotes: boolean; nonAscii: boolean } = { quotes: true, nonAscii: false }): string {
  let t = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); if (o.quotes) t = t.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  if (o.nonAscii) t = [...t].map((c) => (c.codePointAt(0)! > 127 ? `&#${c.codePointAt(0)};` : c)).join(''); return t;
}
export function htmlDecode(text: string): string {
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e: string) => { if (e[0] === '#') { const n = e[1].toLowerCase() === 'x' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10); return n > 0 && n <= 0x10ffff ? String.fromCodePoint(n) : m; } return ENT[e.toLowerCase()] ?? m; });
}
// ---- Regex tester
export interface RegexMatch { index: number; text: string; groups: (string | undefined)[]; named: Record<string, string> | null; }
export type RegexResult = { ok: true; matches: RegexMatch[]; truncated: boolean } | { ok: false; message: string };
export function runRegex(pattern: string, flags: string, text: string, limit = 500): RegexResult {
  if (!pattern) return { ok: false, message: 'Enter a pattern.' };
  if (!/^[dgimsuvy]*$/.test(flags) || new Set(flags).size !== flags.length) return { ok: false, message: 'Flags may contain each of d g i m s u y once.' };
  let re: RegExp; try { re = new RegExp(pattern, flags.includes('g') ? flags : flags + 'g'); } catch (e) { return { ok: false, message: e instanceof Error ? e.message : 'Invalid pattern' }; }
  const matches: RegexMatch[] = []; let truncated = false;
  for (const m of text.matchAll(re)) { if (matches.length >= limit) { truncated = true; break; } matches.push({ index: m.index ?? 0, text: m[0], groups: m.slice(1), named: m.groups ? { ...m.groups } : null }); }
  return { ok: true, matches, truncated };
}
