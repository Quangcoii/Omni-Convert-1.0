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
