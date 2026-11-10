import assert from 'node:assert/strict';
import fs from 'node:fs';
import { sniffImageFormat, resizeDimensions, outputName, percentChange, baseName } from '../lib/image-tools.ts';
import { parseCsv, toCsv, csvToJson, removeDuplicateRows, detectDelimiter } from '../lib/csv.ts';
import { slugify, generateLorem, findReplace, sortLines } from '../lib/text-tools.ts';
import { parseColor, formatColor, describeTimestamp, hashText, hashBytes, htmlEncode, htmlDecode, runRegex } from '../lib/web-tools.ts';
import { makeQr, qrToSvg, qrMaxBytes } from '../lib/qr.ts';
import { parsePageRanges, mergePdfs, extractPages, rotatePages, imagesToPdf, getPageCount } from '../lib/pdf-tools.ts';
import { PDFDocument } from 'pdf-lib';

// ---- image tools
assert.equal(sniffImageFormat(Uint8Array.from([0xff, 0xd8, 0xff, 0xe0])), 'jpeg');
assert.equal(sniffImageFormat(Uint8Array.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])), 'png');
assert.equal(sniffImageFormat(new TextEncoder().encode('RIFF\0\0\0\0WEBPVP8 ')), 'webp');
assert.equal(sniffImageFormat(new TextEncoder().encode('GIF89a....')), 'gif');
assert.equal(sniffImageFormat(Uint8Array.from([0, 0, 0, 24, ...new TextEncoder().encode('ftypheic')])), 'heic');
assert.equal(sniffImageFormat(Uint8Array.from([1, 2, 3])), 'unknown');
assert.deepEqual(resizeDimensions(1000, 500, { mode: 'percent', percent: 50 }), { w: 500, h: 250 });
assert.deepEqual(resizeDimensions(1000, 500, { mode: 'pixels', width: 200, keepAspect: true }), { w: 200, h: 100 });
assert.deepEqual(resizeDimensions(1000, 500, { mode: 'pixels', height: 100, keepAspect: true }), { w: 200, h: 100 });
assert.deepEqual(resizeDimensions(1000, 500, { mode: 'pixels', width: 300, height: 300, keepAspect: true }), { w: 300, h: 150 });
assert.deepEqual(resizeDimensions(1000, 500, { mode: 'pixels', width: 300, height: 300, keepAspect: false }), { w: 300, h: 300 });
assert.throws(() => resizeDimensions(10, 10, { mode: 'pixels', keepAspect: true })); assert.throws(() => resizeDimensions(10, 10, { mode: 'percent', percent: 0 }));
assert.equal(outputName('photo.final.PNG', 'jpg'), 'photo.final.jpg'); assert.equal(outputName('a', 'webp', '-small'), 'a-small.webp'); assert.equal(baseName('.hidden'), '.hidden');
assert.equal(percentChange(200, 100), -50);
// ---- csv
assert.deepEqual(parseCsv('a,b\n1,"x,y"\n"q""r","l1\nl2"\n'), [['a', 'b'], ['1', 'x,y'], ['q"r', 'l1\nl2']]);
assert.deepEqual(parseCsv('\uFEFFa;b\r\n1;2\r\n'), [['a', 'b'], ['1', '2']]); assert.equal(detectDelimiter('a\tb\tc'), '\t'); assert.equal(detectDelimiter('"a,b";c'), ';');
assert.throws(() => parseCsv('a,"b'));
assert.equal(toCsv([['a', 'b,c'], ['q"r', 'x\ny']]), 'a,"b,c"\n"q""r","x\ny"');
assert.deepEqual(csvToJson('id,name,id\n1,Ann,x\n2,Bob,y', { header: true, inferTypes: false }).json, [{ id: '1', name: 'Ann', id_2: 'x' }, { id: '2', name: 'Bob', id_2: 'y' }]);
assert.deepEqual(csvToJson('n,ok,z\n007,true,3.5\n-2,false,', { header: true, inferTypes: true }).json, [{ n: '007', ok: true, z: 3.5 }, { n: -2, ok: false, z: '' }]);
assert.deepEqual(csvToJson('1,2\n3,4', { header: false, inferTypes: true }).json, [[1, 2], [3, 4]]);
const dd = removeDuplicateRows([['h1', 'h2'], ['a', '1'], ['A ', '1'], ['b', '2'], ['a', '1']], { header: true, caseSensitive: false, trimCells: true });
assert.deepEqual(dd.rows, [['h1', 'h2'], ['a', '1'], ['b', '2']]); assert.equal(dd.removed, 2);
assert.equal(removeDuplicateRows([['a', '1'], ['a', '2']], { header: false, caseSensitive: true, trimCells: false, columns: [0] }).rows.length, 1);
// ---- text
assert.equal(slugify('Xin chào, Thế giới! Đẹp quá'), 'xin-chao-the-gioi-dep-qua'); assert.equal(slugify('  Hello__World  ', { separator: '_', lowercase: false }), 'Hello_World');
assert.equal(slugify('abcdef ghij', { separator: '-', lowercase: true, maxLength: 7 }), 'abcdef');
assert.equal(generateLorem('words', 3, { startWithLorem: true, seed: 1 }), 'lorem ipsum dolor'); assert.equal(generateLorem('words', 7, { startWithLorem: false, seed: 5 }).split(' ').length, 7);
assert.equal(generateLorem('paragraphs', 3, { startWithLorem: true, seed: 9 }).split('\n\n').length, 3); assert.ok(generateLorem('sentences', 2, { startWithLorem: true, seed: 2 }).startsWith('Lorem ipsum dolor sit amet'));
assert.equal(generateLorem('words', 20, { startWithLorem: false, seed: 3 }), generateLorem('words', 20, { startWithLorem: false, seed: 3 }));
const fr = findReplace('Cat cat concat', 'cat', 'dog', { regex: false, caseSensitive: false, wholeWord: true }); assert.ok(fr.ok && fr.output === 'dog dog concat' && fr.count === 2);
const fr2 = findReplace('a1 b22', '(\\w)(\\d+)', '$2$1', { regex: true, caseSensitive: true, wholeWord: false }); assert.ok(fr2.ok && fr2.output === '1a 22b');
assert.equal(findReplace('x', '(', 'y', { regex: true, caseSensitive: true, wholeWord: false }).ok, false); assert.equal(findReplace('x', '', 'y', { regex: false, caseSensitive: true, wholeWord: false }).ok, false);
const fr3 = findReplace('a.b a.b', 'a.b', '$&!', { regex: false, caseSensitive: true, wholeWord: false }); assert.ok(fr3.ok && fr3.output === '$&! $&!');
const so = { order: 'asc' as const, natural: false, caseSensitive: false, removeDuplicates: false, trim: false, removeEmpty: false };
assert.equal(sortLines('b\nA\nc', so), 'A\nb\nc'); assert.equal(sortLines('b\nA\nc', { ...so, order: 'desc' }), 'c\nb\nA'); assert.equal(sortLines('a10\na2\na1', { ...so, natural: true }), 'a1\na2\na10');
assert.equal(sortLines('ccc\na\nbb', { ...so, order: 'length-asc' }), 'a\nbb\nccc'); assert.equal(sortLines('1\n2\n3', { ...so, order: 'reverse' }), '3\n2\n1'); assert.equal(sortLines('a\nA\n\nb', { ...so, removeDuplicates: true, removeEmpty: true }), 'a\nb');
// ---- color
assert.deepEqual(parseColor('#f80'), { r: 255, g: 136, b: 0, a: 1 }); assert.deepEqual(parseColor('RGB(10, 20, 30)'), { r: 10, g: 20, b: 30, a: 1 }); assert.deepEqual(parseColor('hsl(120, 100%, 50%)'), { r: 0, g: 255, b: 0, a: 1 });
assert.deepEqual(parseColor('#00000080'), { r: 0, g: 0, b: 0, a: 0.502 }); assert.equal(parseColor('rgb(300,0,0)'), null); assert.equal(parseColor('nope'), null); assert.deepEqual(parseColor('navy'), { r: 0, g: 0, b: 128, a: 1 });
const fc = formatColor({ r: 69, g: 168, b: 120, a: 1 }); assert.equal(fc.hex, '#45a878'); assert.equal(fc.hsl, 'hsl(151, 42%, 46%)'); assert.equal(fc.hsv, 'hsv(151, 59%, 66%)');
assert.equal(formatColor({ r: 255, g: 255, b: 255, a: 1 }).contrastOnWhite, 1); assert.equal(formatColor({ r: 0, g: 0, b: 0, a: 1 }).contrastOnWhite, 21);
// ---- timestamp
const NOW = Date.UTC(2026, 10, 9, 12, 0, 0); const ts = describeTimestamp('1700000000', NOW);
assert.ok(ts.ok && ts.iso === '2023-11-14T22:13:20.000Z' && ts.interpretedAs === 'seconds' && ts.unixMs === 1700000000000);
const tm = describeTimestamp('1700000000000', NOW); assert.ok(tm.ok && tm.interpretedAs === 'milliseconds' && tm.unixSeconds === 1700000000);
const td = describeTimestamp('2026-11-09T11:00:00Z', NOW); assert.ok(td.ok && td.relative === '1 hour ago' && td.interpretedAs === 'date');
assert.equal(describeTimestamp('banana').ok, false); assert.equal(describeTimestamp('').ok, false); const fut = describeTimestamp('2026-11-11T12:00:00Z', NOW); assert.ok(fut.ok && fut.relative === 'in 2 days');
// ---- hash (known vectors)
assert.equal(await hashText('SHA-256', 'abc'), 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad'); assert.equal(await hashText('SHA-1', 'abc'), 'a9993e364706816aba3e25717850c26c9cd0d89d');
assert.equal(await hashText('SHA-256', ''), 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'); assert.equal((await hashBytes('SHA-512', new Uint8Array())).length, 128);
// ---- html
assert.equal(htmlEncode('<a href="x">&\'</a>'), '&lt;a href=&quot;x&quot;&gt;&amp;&#39;&lt;/a&gt;'); assert.equal(htmlEncode('é<', { quotes: false, nonAscii: true }), '&#233;&lt;');
assert.equal(htmlDecode('&lt;p&gt;Tom &amp; Jerry&#39;s &#x41; &copy; &bogus; &#0;'), "<p>Tom & Jerry's A © &bogus; &#0;"); assert.equal(htmlDecode(htmlEncode('<&>"\'')), '<&>"\'');
// ---- regex
const rx = runRegex('(\\d+)-(?<w>[a-z]+)', 'i', 'a 12-ab 7-Cd'); assert.ok(rx.ok && rx.matches.length === 2 && rx.matches[0].groups[0] === '12' && rx.matches[1].named?.w === 'Cd' && rx.matches[1].index === 8);
assert.equal(runRegex('(', '', 'x').ok, false); assert.equal(runRegex('a', 'gg', 'x').ok, false); assert.equal(runRegex('', '', 'x').ok, false);
const zl = runRegex('x*', '', 'ab'); assert.ok(zl.ok && zl.matches.length === 3); const big = runRegex('a', '', 'a'.repeat(900), 500); assert.ok(big.ok && big.truncated && big.matches.length === 500);
// ---- qr structure
const q1 = makeQr('HELLO', 'M'); assert.equal(q1.version, 1); assert.equal(q1.size, 21); assert.ok(qrToSvg(q1).startsWith('<svg')); assert.equal(q1.modules[7][8] ?? true, q1.modules[7][8]);
assert.ok(makeQr('x'.repeat(100), 'L').version > makeQr('x', 'L').version); assert.throws(() => makeQr('x'.repeat(qrMaxBytes('H') + 1), 'H')); assert.ok(makeQr('x'.repeat(qrMaxBytes('L')), 'L').version === 10);
// finder pattern + dark module invariants
const m = q1.modules; assert.ok(m[0][0] && m[0][6] && m[6][0] && !m[1][1] && m[2][2] && m[q1.size - 8][8]);
// ---- pdf (verified independently with pypdf in the dev check)
const mk = async (n: number) => { const d = await PDFDocument.create(); for (let i = 0; i < n; i++) d.addPage([200 + i, 300]); return d.save(); };
assert.deepEqual(parsePageRanges('1-3, 5, 7-', 8), [[0, 1, 2], [4], [6, 7]]); assert.deepEqual(parsePageRanges('-2', 5), [[0, 1]]);
for (const bad of ['', '0', '9', '3-1', 'a', '1--2']) assert.throws(() => parsePageRanges(bad, 8), bad);
const a = await mk(3), b = await mk(2);
const merged = await mergePdfs([{ name: 'a.pdf', bytes: a }, { name: 'b.pdf', bytes: b }]); assert.equal(await getPageCount(merged), 5);
const ex = await extractPages(merged, [4, 0]); assert.equal(await getPageCount(ex), 2); const exDoc = await PDFDocument.load(ex); assert.equal(exDoc.getPage(0).getWidth(), 201); assert.equal(exDoc.getPage(1).getWidth(), 200);
const rot = await rotatePages(a, 90, [1]); const rd = await PDFDocument.load(rot); assert.deepEqual(rd.getPages().map((p) => p.getRotation().angle), [0, 90, 0]);
const rot2 = await rotatePages(rot, 270, null); assert.deepEqual((await PDFDocument.load(rot2)).getPages().map((p) => p.getRotation().angle), [270, 0, 270]);
await assert.rejects(() => mergePdfs([{ name: 'junk.pdf', bytes: new Uint8Array([1, 2, 3]) }]), /junk\.pdf is not a valid PDF/);
fs.mkdirSync('/tmp/pdfout', { recursive: true }); fs.writeFileSync('/tmp/pdfout/merged.pdf', merged); fs.writeFileSync('/tmp/pdfout/extract.pdf', ex); fs.writeFileSync('/tmp/pdfout/rot.pdf', rot);
console.log('NEW TOOLS PASS');
