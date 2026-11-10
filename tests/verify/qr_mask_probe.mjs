import { makeQr, qrToSvg } from '../../lib/qr.ts'; import sharp from 'sharp'; import fs from 'node:fs';
const meta = JSON.parse(fs.readFileSync('/tmp/qr/meta.json')).find((m) => m.i === 34); fs.mkdirSync('/tmp/qrm', { recursive: true }); const out = [];
console.log('text:', JSON.stringify(meta.text));
for (let m = 0; m < 8; m++) { const qr = makeQr(meta.text, meta.ecc, { forceMask: m }); await sharp(Buffer.from(qrToSvg(qr)), { density: 600 }).resize((qr.size + 8) * 8, null, { kernel: 'nearest' }).png().toFile(`/tmp/qrm/${m}.png`); out.push({ i: m, ecc: meta.ecc, text: meta.text, version: qr.version }); }
fs.writeFileSync('/tmp/qrm/meta.json', JSON.stringify(out));
