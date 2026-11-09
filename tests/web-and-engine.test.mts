import assert from 'node:assert/strict';
import { parseJson, formatJson, jsonStats, base64Encode, base64Decode, urlEncode, urlDecode } from '../lib/web-tools.ts';
import { searchItems } from '../lib/search.ts';
import { validateFiles, formatBytes, getExtension } from '../lib/file-engine.ts';
// JSON
const bad = parseJson('{\n  "a": 1,\n  "b": }');
assert.equal(bad.ok, false); if (!bad.ok) { assert.equal(bad.line, 3); assert.ok(bad.column! >= 1); }
assert.equal(parseJson('').ok, false);
const loc = (x: string) => { const r = parseJson(x); return r.ok ? null : [r.line, r.column]; };
assert.deepEqual(loc('{"a":1,}'), [1, 8]);
assert.deepEqual(loc("{'a':1}"), [1, 2]);
assert.deepEqual(loc('[1,2'), [1, 5]);
assert.deepEqual(loc('{"a":"x'), [1, 8]);
assert.deepEqual(loc('{"a":1} x'), [1, 9]);
assert.deepEqual(loc('{"a":01}'), [1, 7]);
assert.deepEqual(loc('{"a":1,\n"b":tru}'), [2, 5]);
for (const ok of ['{}', '[]', '0', '-1.5e+3', '"\\u00e9"', 'null', '{"a":[true,false,null,{"b":"c"}]}']) assert.equal(parseJson(ok).ok, true, ok);
const f = formatJson('{"a":[1,2]}', 2); assert.ok(f.ok && f.output === '{\n  "a": [\n    1,\n    2\n  ]\n}');
const m = formatJson('{ "a" : 1 }', 'min'); assert.ok(m.ok && m.output === '{"a":1}');
const t = formatJson('{"a":1}', 'tab'); assert.ok(t.ok && t.output === '{\n\t"a": 1\n}');
const st = jsonStats({ a: [1, 'x', null, true], b: { c: 2 } });
assert.deepEqual([st.rootType, st.depth, st.objects, st.arrays, st.keys, st.strings, st.numbers, st.booleans, st.nulls], ['object', 2, 2, 1, 3, 1, 2, 1, 1]);
assert.equal(jsonStats(5).depth, 0);
// Base64
for (const s of ['hello', 'Xin chào 🌏 日本語', 'a', 'ab', 'abc', '?>?>?>']) {
  assert.equal(base64Encode(s), Buffer.from(s).toString('base64'));
  for (const u of [false, true]) { const d = base64Decode(base64Encode(s, u)); assert.ok(d.ok && d.output === s, `roundtrip ${s} ${u}`); }
}
assert.equal(base64Decode('!!!').ok, false);
assert.equal(base64Decode('A').ok, false);
assert.equal(base64Decode('/w==').ok, false); // 0xFF is not valid UTF-8
assert.equal(base64Decode('   ').ok, false);
// URL
const e = urlEncode('a b&c=d/é', 'component'); assert.ok(e.ok && e.output === 'a%20b%26c%3Dd%2F%C3%A9');
const e2 = urlEncode('https://x.com/a b?q=1', 'full'); assert.ok(e2.ok && e2.output === 'https://x.com/a%20b?q=1');
const d1 = urlDecode('a%20b%26c', 'component'); assert.ok(d1.ok && d1.output === 'a b&c');
assert.equal(urlDecode('100%', 'component').ok, false);
assert.equal(urlEncode('\uD800', 'component').ok, false);
// Search
const items = [{ name: 'Word Counter', description: 'Count words', category: 'Text', href: '/a' }, { name: 'JSON Formatter', description: 'Format JSON', category: 'Web & Code', href: '/b' }, { name: 'Case Converter', description: 'Convert case of words', category: 'Text', href: '/c' }];
assert.deepEqual(searchItems('word', items).map((i) => i.href), ['/a', '/c']);
assert.deepEqual(searchItems('web code', items).map((i) => i.href), ['/b']);
assert.deepEqual(searchItems('JSON', items).map((i) => i.href), ['/b']);
assert.deepEqual(searchItems('  ', items), []);
assert.deepEqual(searchItems('text', items).map((i) => i.href), ['/c', '/a']);
// File engine
const mk = (name: string, size: number, type = '') => new File([new Uint8Array(size)], name, { type });
const v = validateFiles([mk('a.PDF', 10), mk('b.txt', 10), mk('c.pdf', 0), mk('d.pdf', 5000), mk('e.pdf', 10)], { maxBytes: 1000, extensions: ['pdf'], maxFiles: 2 });
assert.deepEqual(v.accepted.map((x) => x.name), ['a.PDF', 'e.pdf']);
assert.deepEqual(v.errors.map((x) => x.code), ['type_not_allowed', 'empty', 'too_large']);
assert.equal(validateFiles([mk('1.pdf', 5), mk('2.pdf', 5), mk('3.pdf', 5)], { maxBytes: 1000, maxFiles: 2 }).errors[0].code, 'too_many');
assert.equal(validateFiles([mk('x.pdf', 5000)], { maxBytes: 1000 }).errors[0].code, 'too_large');
assert.equal(validateFiles([mk('x.png', 5, 'text/plain')], { maxBytes: 1000, mimeTypes: ['image/png'] }).errors[0].code, 'type_not_allowed');
assert.equal(formatBytes(512), '512 B'); assert.equal(formatBytes(1536), '1.5 KB'); assert.equal(formatBytes(5 * 1024 * 1024), '5 MB');
assert.equal(getExtension('a.tar.GZ'), 'gz'); assert.equal(getExtension('.env'), ''); assert.equal(getExtension('noext'), '');
console.log('WEB+ENGINE PASS');
