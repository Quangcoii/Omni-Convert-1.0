import { makeQr, qrToSvg } from '../../lib/qr.ts';
import sharp from 'sharp'; import fs from 'node:fs';
fs.mkdirSync('/tmp/qr4', { recursive: true }); const meta = []; let i = 0;
for (const [ecc, lens] of [['H', [21, 22, 23, 24, 25, 26, 27, 28, 30, 33]], ['Q', [30, 34, 38, 42, 46, 50, 54, 58]], ['M', [60, 70, 80, 90, 100, 110, 120]], ['L', [100, 120, 140, 160, 180, 200, 220, 240]]])
  for (const n of lens) { const text = Array.from({ length: n }, (_, k) => String.fromCharCode(65 + ((k * 7 + n) % 26))).join(''); const qr = makeQr(text, ecc);
    await sharp(Buffer.from(qrToSvg(qr)), { density: 600 }).resize((qr.size + 8) * 8, null, { kernel: 'nearest' }).png().toFile(`/tmp/qr4/${i}.png`); meta.push({ i, ecc, text, version: qr.version }); i++; }
fs.writeFileSync('/tmp/qr4/meta.json', JSON.stringify(meta)); console.log(i);
