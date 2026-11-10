/** Self-contained QR Code generator (byte mode, versions 1-10, ECC L/M/Q/H). Verified by decoding with OpenCV (see tests/verify). */
export type Ecc = 'L' | 'M' | 'Q' | 'H';
export interface QrCode { version: number; size: number; modules: boolean[][]; ecc: Ecc; mask: number; }
const ECC_INDEX: Record<Ecc, number> = { L: 0, M: 1, Q: 2, H: 3 };
const FORMAT_BITS: Record<Ecc, number> = { L: 1, M: 0, Q: 3, H: 2 };
// per version 1..10, per level [L,M,Q,H]: [ecCodewordsPerBlock, group1Blocks, group1DataCw, group2Blocks, group2DataCw]
const TABLE: number[][][] = [
  [[7, 1, 19, 0, 0], [10, 1, 16, 0, 0], [13, 1, 13, 0, 0], [17, 1, 9, 0, 0]],
  [[10, 1, 34, 0, 0], [16, 1, 28, 0, 0], [22, 1, 22, 0, 0], [28, 1, 16, 0, 0]],
  [[15, 1, 55, 0, 0], [26, 1, 44, 0, 0], [18, 2, 17, 0, 0], [22, 2, 13, 0, 0]],
  [[20, 1, 80, 0, 0], [18, 2, 32, 0, 0], [26, 2, 24, 0, 0], [16, 4, 9, 0, 0]],
  [[26, 1, 108, 0, 0], [24, 2, 43, 0, 0], [18, 2, 15, 2, 16], [22, 2, 11, 2, 12]],
  [[18, 2, 68, 0, 0], [16, 4, 27, 0, 0], [24, 4, 19, 0, 0], [28, 4, 15, 0, 0]],
  [[20, 2, 78, 0, 0], [18, 4, 31, 0, 0], [18, 2, 14, 4, 15], [26, 4, 13, 1, 14]],
  [[24, 2, 97, 0, 0], [22, 2, 38, 2, 39], [22, 4, 18, 2, 19], [26, 4, 14, 2, 15]],
  [[30, 2, 116, 0, 0], [22, 3, 36, 2, 37], [20, 4, 16, 4, 17], [24, 4, 12, 4, 13]],
  [[18, 2, 68, 2, 69], [26, 4, 43, 1, 44], [24, 6, 19, 2, 20], [28, 6, 15, 2, 16]],
];
const ALIGN: number[][] = [[], [6, 18], [6, 22], [6, 26], [6, 30], [6, 34], [6, 22, 38], [6, 24, 42], [6, 26, 46], [6, 28, 50]];
export const QR_MAX_VERSION = TABLE.length;
const dataCapacity = (v: number, e: Ecc) => { const t = TABLE[v - 1][ECC_INDEX[e]]; return t[1] * t[2] + t[3] * t[4]; };
/** Maximum UTF-8 bytes that fit at the given level (version 10). */
export const qrMaxBytes = (e: Ecc) => dataCapacity(QR_MAX_VERSION, e) - 3;

const EXP = new Uint8Array(512), LOG = new Uint8Array(256);
(() => { let x = 1; for (let i = 0; i < 255; i++) { EXP[i] = x; LOG[x] = i; x <<= 1; if (x & 0x100) x ^= 0x11d; } for (let i = 255; i < 512; i++) EXP[i] = EXP[i - 255]; })();
const mul = (a: number, b: number) => (a === 0 || b === 0 ? 0 : EXP[LOG[a] + LOG[b]]);
function rsDivisor(degree: number): number[] {
  const r = new Array<number>(degree).fill(0); r[degree - 1] = 1; let root = 1;
  for (let i = 0; i < degree; i++) { for (let j = 0; j < degree; j++) { r[j] = mul(r[j], root); if (j + 1 < degree) r[j] ^= r[j + 1]; } root = mul(root, 2); }
  return r;
}
function rsRemainder(data: number[], divisor: number[]): number[] {
  const res = new Array<number>(divisor.length).fill(0);
  for (const b of data) { const f = b ^ res.shift()!; res.push(0); divisor.forEach((c, i) => { res[i] ^= mul(c, f); }); }
  return res;
}
const bit = (x: number, i: number) => ((x >>> i) & 1) !== 0;

export function makeQr(text: string, ecc: Ecc = 'M', opts: { forceMask?: number } = {}): QrCode {
  const bytes = new TextEncoder().encode(text);
  let version = 0;
  for (let v = 1; v <= QR_MAX_VERSION; v++) if (4 + (v <= 9 ? 8 : 16) + 8 * bytes.length <= 8 * dataCapacity(v, ecc)) { version = v; break; }
  if (!version) throw new Error(`Text is too long for this generator (limit about ${qrMaxBytes(ecc)} bytes at level ${ecc}). Shorten the text or lower the error correction level.`);
  const [ecLen, b1, d1, b2, d2] = TABLE[version - 1][ECC_INDEX[ecc]];
  const bits: number[] = [];
  const push = (val: number, n: number) => { for (let i = n - 1; i >= 0; i--) bits.push((val >>> i) & 1); };
  push(0b0100, 4); push(bytes.length, version <= 9 ? 8 : 16); bytes.forEach((b) => push(b, 8));
  const capBits = 8 * dataCapacity(version, ecc);
  push(0, Math.min(4, capBits - bits.length)); while (bits.length % 8) bits.push(0);
  const cw: number[] = []; for (let i = 0; i < bits.length; i += 8) cw.push(parseInt(bits.slice(i, i + 8).join(''), 2));
  for (let pad = 0xec; cw.length < capBits / 8; pad ^= 0xec ^ 0x11) cw.push(pad);
  const blocks: number[][] = []; let pos = 0;
  for (let i = 0; i < b1 + b2; i++) { const n = i < b1 ? d1 : d2; blocks.push(cw.slice(pos, pos + n)); pos += n; }
  const div = rsDivisor(ecLen); const ecs = blocks.map((b) => rsRemainder(b, div));
  const all: number[] = []; const maxD = Math.max(d1, d2);
  for (let i = 0; i < maxD; i++) blocks.forEach((b) => { if (i < b.length) all.push(b[i]); });
  for (let i = 0; i < ecLen; i++) ecs.forEach((e) => all.push(e[i]));

  const size = 17 + 4 * version;
  const modules = Array.from({ length: size }, () => new Array<boolean>(size).fill(false));
  const fn = Array.from({ length: size }, () => new Array<boolean>(size).fill(false));
  const setFn = (x: number, y: number, dark: boolean) => { modules[y][x] = dark; fn[y][x] = true; };
  for (let i = 0; i < size; i++) { setFn(6, i, i % 2 === 0); setFn(i, 6, i % 2 === 0); }
  const finder = (cx: number, cy: number) => { for (let dy = -4; dy <= 4; dy++) for (let dx = -4; dx <= 4; dx++) { const x = cx + dx, y = cy + dy; if (x >= 0 && x < size && y >= 0 && y < size) { const d = Math.max(Math.abs(dx), Math.abs(dy)); setFn(x, y, d !== 2 && d !== 4); } } };
  finder(3, 3); finder(size - 4, 3); finder(3, size - 4);
  const ap = ALIGN[version - 1], n = ap.length;
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { if ((i === 0 && j === 0) || (i === 0 && j === n - 1) || (i === n - 1 && j === 0)) continue; for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) setFn(ap[i] + dx, ap[j] + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1); }
  const drawFormat = (mask: number) => {
    const data = (FORMAT_BITS[ecc] << 3) | mask; let rem = data;
    for (let i = 0; i < 10; i++) rem = (rem << 1) ^ ((rem >>> 9) * 0x537);
    const bits15 = ((data << 10) | rem) ^ 0x5412;
    for (let i = 0; i <= 5; i++) setFn(8, i, bit(bits15, i)); setFn(8, 7, bit(bits15, 6)); setFn(8, 8, bit(bits15, 7)); setFn(7, 8, bit(bits15, 8));
    for (let i = 9; i < 15; i++) setFn(14 - i, 8, bit(bits15, i));
    for (let i = 0; i < 8; i++) setFn(size - 1 - i, 8, bit(bits15, i));
    for (let i = 8; i < 15; i++) setFn(8, size - 15 + i, bit(bits15, i));
    setFn(8, size - 8, true);
  };
  drawFormat(0);
  if (version >= 7) { let rem = version; for (let i = 0; i < 12; i++) rem = (rem << 1) ^ ((rem >>> 11) * 0x1f25); const vb = (version << 12) | rem; for (let i = 0; i < 18; i++) { const a = size - 11 + (i % 3), b = Math.floor(i / 3); setFn(a, b, bit(vb, i)); setFn(b, a, bit(vb, i)); } }
  let idx = 0; const total = all.length * 8;
  for (let right = size - 1; right >= 1; right -= 2) { if (right === 6) right = 5; for (let vert = 0; vert < size; vert++) for (let j = 0; j < 2; j++) { const x = right - j; const y = ((right + 1) & 2) === 0 ? size - 1 - vert : vert; if (!fn[y][x] && idx < total) { modules[y][x] = bit(all[idx >>> 3], 7 - (idx & 7)); idx++; } } }
  const MASKS: ((x: number, y: number) => boolean)[] = [(x, y) => (x + y) % 2 === 0, (_x, y) => y % 2 === 0, (x) => x % 3 === 0, (x, y) => (x + y) % 3 === 0, (x, y) => (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0, (x, y) => ((x * y) % 2) + ((x * y) % 3) === 0, (x, y) => (((x * y) % 2) + ((x * y) % 3)) % 2 === 0, (x, y) => (((x + y) % 2) + ((x * y) % 3)) % 2 === 0];
  const applyMask = (m: number) => { for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) if (!fn[y][x] && MASKS[m](x, y)) modules[y][x] = !modules[y][x]; };
  let best = 0, bestScore = Infinity;
  for (let m = 0; m < 8; m++) { applyMask(m); drawFormat(m); const s = penalty(modules, size); if (s < bestScore) { bestScore = s; best = m; } applyMask(m); }
  if (opts.forceMask !== undefined) best = opts.forceMask;
  applyMask(best); drawFormat(best);
  return { version, size, modules, ecc, mask: best };
}
function penalty(m: boolean[][], size: number): number {
  let score = 0;
  const lines: boolean[][] = [];
  for (let i = 0; i < size; i++) { lines.push(m[i]); lines.push(m.map((r) => r[i])); }
  const A = [1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0], B = [0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1];
  for (const line of lines) {
    let run = 1;
    for (let i = 1; i <= size; i++) { if (i < size && line[i] === line[i - 1]) run++; else { if (run >= 5) score += 3 + run - 5; run = 1; } }
    for (let i = 0; i + 11 <= size; i++) { let a = true, b = true; for (let k = 0; k < 11; k++) { const v = line[i + k] ? 1 : 0; if (v !== A[k]) a = false; if (v !== B[k]) b = false; } if (a || b) score += 40; }
  }
  let dark = 0;
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) { if (m[y][x]) dark++; if (x < size - 1 && y < size - 1 && m[y][x] === m[y][x + 1] && m[y][x] === m[y + 1][x] && m[y][x] === m[y + 1][x + 1]) score += 3; }
  return score + 10 * Math.floor(Math.abs((dark * 100) / (size * size) - 50) / 5);
}
/** SVG string for a QR code (crisp, scalable). `margin` is the quiet zone in modules (spec: 4). */
export function qrToSvg(qr: QrCode, opts: { margin?: number; fg?: string; bg?: string } = {}): string {
  const { margin = 4, fg = '#000000', bg = '#ffffff' } = opts; const dim = qr.size + margin * 2; let d = '';
  for (let y = 0; y < qr.size; y++) { let x = 0; while (x < qr.size) { if (!qr.modules[y][x]) { x++; continue; } let w = 1; while (x + w < qr.size && qr.modules[y][x + w]) w++; d += `M${x + margin} ${y + margin}h${w}v1h-${w}z`; x += w; } }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${dim} ${dim}" shape-rendering="crispEdges"><rect width="${dim}" height="${dim}" fill="${bg}"/><path d="${d}" fill="${fg}"/></svg>`;
}
