// Dev check: emits QR PNGs (via sharp) for many strings; decode them with tests/verify/qr_decode.py (OpenCV).
import { makeQr, qrToSvg } from '../../lib/qr.ts';
import sharp from 'sharp';
import fs from 'node:fs';
const out = process.argv[2] ?? '/tmp/qr'; fs.mkdirSync(out, { recursive: true });
const cases = []; const rnd = (n, seed) => { let s = seed; return Array.from({ length: n }, () => { s = (s * 1103515245 + 12345) & 0x7fffffff; return String.fromCharCode(33 + (s % 90)); }).join(''); };
for (const ecc of ['L', 'M', 'Q', 'H']) for (const n of [1, 5, 11, 17, 25, 40, 60, 80, 100, 119]) cases.push({ ecc, text: rnd(n, n * 7 + ecc.charCodeAt(0)) });
for (const ecc of ['L', 'M']) cases.push({ ecc, text: rnd(150, 99) });
cases.push({ ecc: 'L', text: rnd(265, 5) }, { ecc: 'M', text: rnd(205, 6) });
cases.push({ ecc: 'M', text: 'https://example.com/Omni?x=1&y=2' }, { ecc: 'Q', text: 'Xin chào 🌏 日本語' }, { ecc: 'H', text: 'WIFI:T:WPA;S:Home;P:secret;;' });
const meta = [];
for (let i = 0; i < cases.length; i++) { const c = cases[i]; const qr = makeQr(c.text, c.ecc); const svg = qrToSvg(qr, { margin: 4 }); await sharp(Buffer.from(svg), { density: 600 }).resize((qr.size + 8) * 8, null, { kernel: 'nearest' }).png().toFile(`${out}/${i}.png`); meta.push({ i, ecc: c.ecc, text: c.text, version: qr.version }); }
fs.writeFileSync(`${out}/meta.json`, JSON.stringify(meta));
console.log('emitted', cases.length);
