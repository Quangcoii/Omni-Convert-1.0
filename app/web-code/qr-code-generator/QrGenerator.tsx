'use client';
import { useMemo, useState } from 'react';
import { makeQr, qrToSvg, qrMaxBytes, type Ecc } from '@/lib/qr';
import { downloadBlob } from '@/lib/file-engine';
import { formatColor, parseColor } from '@/lib/web-tools';
import { track } from '@/lib/analytics';
const HEX = /^#[0-9a-f]{6}$/i;
export default function QrGenerator() {
  const [text, setText] = useState(''); const [ecc, setEcc] = useState<Ecc>('M'); const [fg, setFg] = useState('#000000'); const [bg, setBg] = useState('#ffffff'); const [px, setPx] = useState(512);
  const r = useMemo(() => { if (!text) return null; try { const qr = makeQr(text, ecc); const f = HEX.test(fg) ? fg : '#000000', b = HEX.test(bg) ? bg : '#ffffff'; return { ok: true as const, qr, svg: qrToSvg(qr, { fg: f, bg: b }), f, b }; } catch (e) { return { ok: false as const, message: e instanceof Error ? e.message : 'Could not create the QR code.' }; } }, [text, ecc, fg, bg]);
  const contrast = useMemo(() => { const a = parseColor(fg), b = parseColor(bg); if (!a || !b) return 21; const lum = (c: NonNullable<ReturnType<typeof parseColor>>) => formatColor(c).contrastOnBlack * 0.05 - 0.05; const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); }, [fg, bg]);
  function png() { if (!r || !r.ok) return; const m = 4, dim = r.qr.size + m * 2, cell = Math.max(1, Math.floor(px / dim)), size = cell * dim; const c = document.createElement('canvas'); c.width = c.height = size; const x = c.getContext('2d')!; x.fillStyle = r.b; x.fillRect(0, 0, size, size); x.fillStyle = r.f;
    r.qr.modules.forEach((row, y) => row.forEach((on, xx) => { if (on) x.fillRect((xx + m) * cell, (y + m) * cell, cell, cell); })); c.toBlob((b) => { if (b) { downloadBlob(b, 'qr-code.png'); track('tool_success', 'web-code', 'qr-code-generator'); } c.width = c.height = 0; }, 'image/png'); }
  const svg = () => { if (r && r.ok) { downloadBlob(new Blob([r.svg], { type: 'image/svg+xml' }), 'qr-code.svg'); track('tool_success', 'web-code', 'qr-code-generator'); } };
  return (<div><label htmlFor="qr-in" className="field-label">Text or URL</label><textarea id="qr-in" value={text} onChange={(e) => setText(e.target.value)} placeholder="https://example.com" style={{ minHeight: 110 }} />
    <div className="options"><div className="row"><label htmlFor="qr-e">Error correction</label><select id="qr-e" value={ecc} onChange={(e) => setEcc(e.target.value as Ecc)}><option value="L">Low (L) — most data</option><option value="M">Medium (M)</option><option value="Q">Quartile (Q)</option><option value="H">High (H) — most robust</option></select>
      <label htmlFor="qr-fg">Colour</label><input id="qr-fg" type="color" value={fg} onChange={(e) => setFg(e.target.value)} /><label htmlFor="qr-bg">Background</label><input id="qr-bg" type="color" value={bg} onChange={(e) => setBg(e.target.value)} />
      <label htmlFor="qr-px">PNG size</label><select id="qr-px" value={px} onChange={(e) => setPx(Number(e.target.value))}><option value={256}>256 px</option><option value={512}>512 px</option><option value={1024}>1024 px</option><option value={2048}>2048 px</option></select></div>
      <p className="msg">Up to about {qrMaxBytes(ecc)} bytes at this level (UTF-8: accented letters and emoji use 2–4 bytes).</p></div>
    {contrast < 4 && <p className="msg" role="status">Low contrast between colour and background — dark on light scans best.</p>}
    {r && !r.ok && <p role="alert" className="errors">{r.message}</p>}
    {r && r.ok && (<div className="qr-out"><div className="qr-preview" role="img" aria-label={`QR code, version ${r.qr.version}`} dangerouslySetInnerHTML={{ __html: r.svg }} /><div><p className="msg">Version {r.qr.version} · {r.qr.size}×{r.qr.size} modules</p><div className="row"><button type="button" className="btn" onClick={png}>Download PNG</button><button type="button" className="btn" onClick={svg}>Download SVG</button></div></div></div>)}</div>);
}
