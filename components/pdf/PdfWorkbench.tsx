'use client';
import { useState, type ReactNode } from 'react';
import Dropzone from '../Dropzone';
import { downloadBlob, formatBytes } from '@/lib/file-engine';
import { baseName, sniffImageFormat, MAX_PIXELS } from '@/lib/image-tools';
import { getPageCount, imagesToPdf, mergePdfs, extractPages, parsePageRanges, rotatePages, type PageSize } from '@/lib/pdf-tools';
import { track } from '@/lib/analytics';
const PDF_RULES = { maxBytes: 50 * 1024 * 1024, extensions: ['pdf'] };
const msg = (e: unknown) => (e instanceof Error ? e.message : 'Something went wrong.');
const bytesOf = async (f: File) => new Uint8Array(await f.arrayBuffer());
const pdfBlob = (b: Uint8Array) => new Blob([b as BlobPart], { type: 'application/pdf' });
interface Entry { id: number; file: File; pages?: number; }
let nextId = 1;
function FileList({ entries, setEntries, showPages }: { entries: Entry[]; setEntries: (e: Entry[]) => void; showPages?: boolean }) {
  const move = (i: number, d: number) => { const a = [...entries]; const j = i + d; if (j < 0 || j >= a.length) return; [a[i], a[j]] = [a[j], a[i]]; setEntries(a); };
  return (<ol className="file-list">{entries.map((e, i) => (<li key={e.id} className="file-row"><span className="file-name">{e.file.name}</span><small>{formatBytes(e.file.size)}{showPages && e.pages ? ` · ${e.pages} page${e.pages === 1 ? '' : 's'}` : ''}</small>
    <span className="file-actions"><button type="button" className="btn small ghost" onClick={() => move(i, -1)} disabled={i === 0} aria-label={`Move ${e.file.name} up`}>↑</button><button type="button" className="btn small ghost" onClick={() => move(i, 1)} disabled={i === entries.length - 1} aria-label={`Move ${e.file.name} down`}>↓</button>
      <button type="button" className="btn small ghost" onClick={() => setEntries(entries.filter((x) => x.id !== e.id))} aria-label={`Remove ${e.file.name}`}>✕</button></span></li>))}</ol>);
}
function Feedback({ error, children }: { error: string; children?: ReactNode }) { return (<>{error && <p role="alert" className="errors">{error}</p>}<div aria-live="polite">{children}</div></>); }

export function MergePdf() {
  const [entries, setEntries] = useState<Entry[]>([]); const [error, setError] = useState(''); const [busy, setBusy] = useState(false); const [out, setOut] = useState<{ blob: Blob; pages: number } | null>(null);
  async function add(files: File[]) { setError(''); setOut(null); const added: Entry[] = [];
    for (const f of files) { try { added.push({ id: nextId++, file: f, pages: await getPageCount(await bytesOf(f), f.name) }); } catch (e) { setError(msg(e)); } }
    setEntries((cur) => [...cur, ...added]); }
  async function merge() { setBusy(true); setError(''); try { const bytes = await mergePdfs(await Promise.all(entries.map(async (e) => ({ name: e.file.name, bytes: await bytesOf(e.file) })))); setOut({ blob: pdfBlob(bytes), pages: entries.reduce((n, e) => n + (e.pages ?? 0), 0) }); track('tool_success', 'office', 'merge-pdf'); } catch (e) { setError(msg(e)); track('tool_error', 'office', 'merge-pdf'); } setBusy(false); }
  return (<div><Dropzone category="office" multiple rules={{ ...PDF_RULES, maxFiles: 50 }} onFiles={add} status={busy ? 'processing' : out ? 'completed' : 'idle'} progress={50} onDownload={() => out && downloadBlob(out.blob, 'merged.pdf')} downloadLabel="Download merged PDF" label="Drop your PDF files here" />
    {entries.length > 0 && <><h3 className="field-label">Files to merge (in this order)</h3><FileList entries={entries} setEntries={(e) => { setEntries(e); setOut(null); }} showPages />
      <div className="row"><button type="button" className="btn" disabled={entries.length < 2 || busy} onClick={merge}>Merge {entries.length} PDFs</button><button type="button" className="btn ghost" onClick={() => { setEntries([]); setOut(null); setError(''); }}>Start over</button></div></>}
    <Feedback error={error}>{out && <p className="msg">Merged PDF ready: {out.pages} pages, {formatBytes(out.blob.size)}.</p>}</Feedback></div>);
}
export function SplitPdf() {
  const [file, setFile] = useState<File | null>(null); const [pages, setPages] = useState(0); const [ranges, setRanges] = useState('1'); const [combine, setCombine] = useState(false); const [error, setError] = useState('');
  const [outs, setOuts] = useState<{ name: string; blob: Blob; pages: number }[]>([]); const [busy, setBusy] = useState(false);
  async function pick(files: File[]) { setError(''); setOuts([]); try { const n = await getPageCount(await bytesOf(files[0]), files[0].name); setFile(files[0]); setPages(n); setRanges(n > 1 ? `1-${n}` : '1'); } catch (e) { setError(msg(e)); setFile(null); } }
  async function run() { if (!file) return; setBusy(true); setError(''); setOuts([]); try { const bytes = await bytesOf(file); const groups = parsePageRanges(ranges, pages); const base = baseName(file.name); const list: typeof outs = [];
      const sets = combine ? [groups.flat()] : groups; for (const g of sets) { const label = combine ? 'selected-pages' : g.length === 1 ? `page-${g[0] + 1}` : `pages-${g[0] + 1}-${g[g.length - 1] + 1}`; list.push({ name: `${base}-${label}.pdf`, blob: pdfBlob(await extractPages(bytes, g, file.name)), pages: g.length }); }
      setOuts(list); track('tool_success', 'office', 'split-pdf'); } catch (e) { setError(msg(e)); track('tool_error', 'office', 'split-pdf'); } setBusy(false); }
  return (<div><Dropzone category="office" rules={PDF_RULES} onFiles={pick} status={busy ? 'processing' : 'idle'} progress={50} label="Drop a PDF file here" />
    {file && <div className="options"><p className="msg"><b>{file.name}</b> · {pages} page{pages === 1 ? '' : 's'} · {formatBytes(file.size)}</p>
      <div className="row"><label htmlFor="sp-r">Pages to extract</label><input id="sp-r" type="text" value={ranges} onChange={(e) => setRanges(e.target.value)} placeholder="1-3, 5, 8-" /></div>
      <label className="check"><input type="checkbox" checked={combine} onChange={(e) => setCombine(e.target.checked)} />Combine all ranges into one PDF</label>
      <div className="row"><button type="button" className="btn" onClick={run} disabled={busy}>Extract pages</button></div></div>}
    <Feedback error={error}>{outs.length > 0 && <ul className="result-list">{outs.map((o) => (<li key={o.name} className="result-row"><div className="result-meta"><b>{o.name}</b><span>{o.pages} page{o.pages === 1 ? '' : 's'} · {formatBytes(o.blob.size)}</span></div><button type="button" className="btn small" onClick={() => downloadBlob(o.blob, o.name)}>Download</button></li>))}</ul>}</Feedback></div>);
}
export function RotatePdf() {
  const [file, setFile] = useState<File | null>(null); const [pages, setPages] = useState(0); const [angle, setAngle] = useState<90 | 180 | 270>(90); const [scope, setScope] = useState<'all' | 'range'>('all'); const [ranges, setRanges] = useState('1');
  const [error, setError] = useState(''); const [out, setOut] = useState<Blob | null>(null); const [busy, setBusy] = useState(false);
  async function pick(files: File[]) { setError(''); setOut(null); try { setPages(await getPageCount(await bytesOf(files[0]), files[0].name)); setFile(files[0]); } catch (e) { setError(msg(e)); setFile(null); } }
  async function run() { if (!file) return; setBusy(true); setError(''); setOut(null); try { const idx = scope === 'all' ? null : [...new Set(parsePageRanges(ranges, pages).flat())]; setOut(pdfBlob(await rotatePages(await bytesOf(file), angle, idx, file.name))); track('tool_success', 'office', 'rotate-pdf'); } catch (e) { setError(msg(e)); track('tool_error', 'office', 'rotate-pdf'); } setBusy(false); }
  return (<div><Dropzone category="office" rules={PDF_RULES} onFiles={pick} status={busy ? 'processing' : out ? 'completed' : 'idle'} progress={50} onDownload={() => file && out && downloadBlob(out, `${baseName(file.name)}-rotated.pdf`)} downloadLabel="Download rotated PDF" label="Drop a PDF file here" />
    {file && <div className="options"><p className="msg"><b>{file.name}</b> · {pages} page{pages === 1 ? '' : 's'}</p>
      <div className="row"><label htmlFor="rp-a">Rotate</label><select id="rp-a" value={angle} onChange={(e) => { setAngle(Number(e.target.value) as 90 | 180 | 270); setOut(null); }}><option value={90}>90° clockwise</option><option value={180}>180°</option><option value={270}>90° counter-clockwise</option></select></div>
      <div className="row" role="radiogroup" aria-label="Pages">{(['all', 'range'] as const).map((s) => (<label key={s} className="check"><input type="radio" name="rpscope" checked={scope === s} onChange={() => { setScope(s); setOut(null); }} />{s === 'all' ? 'All pages' : 'Only these pages'}</label>))}
        {scope === 'range' && <><label htmlFor="rp-r" className="sr-only">Pages</label><input id="rp-r" type="text" value={ranges} onChange={(e) => setRanges(e.target.value)} placeholder="1-3, 5" /></>}</div>
      <div className="row"><button type="button" className="btn" onClick={run} disabled={busy}>Rotate PDF</button></div></div>}
    <Feedback error={error}>{out && <p className="msg">Rotated PDF ready ({formatBytes(out.size)}).</p>}</Feedback></div>);
}
const toPng = async (bytes: Uint8Array): Promise<Uint8Array> => { const bmp = await createImageBitmap(new Blob([bytes as BlobPart])); if (bmp.width * bmp.height > MAX_PIXELS) { bmp.close(); throw new Error('Image is too large.'); } const c = document.createElement('canvas'); c.width = bmp.width; c.height = bmp.height; c.getContext('2d')!.drawImage(bmp, 0, 0); bmp.close();
  const blob = await new Promise<Blob | null>((r) => c.toBlob(r, 'image/png')); c.width = c.height = 0; if (!blob) throw new Error('Could not convert the image.'); return new Uint8Array(await blob.arrayBuffer()); };
export function ImagesToPdf() {
  const [entries, setEntries] = useState<Entry[]>([]); const [size, setSize] = useState<PageSize>('a4'); const [margin, setMargin] = useState(24); const [error, setError] = useState(''); const [busy, setBusy] = useState(false); const [out, setOut] = useState<Blob | null>(null);
  async function add(files: File[]) { setError(''); setOut(null); const ok: Entry[] = []; for (const f of files) { const k = sniffImageFormat(await bytesOf(f)); if (k === 'jpeg' || k === 'png' || k === 'webp') ok.push({ id: nextId++, file: f }); else setError(`${f.name}: ${k === 'heic' ? 'HEIC photos are not supported; export as JPG first.' : 'not a JPG, PNG or WebP image.'}`); } setEntries((c) => [...c, ...ok]); }
  async function run() { setBusy(true); setError(''); setOut(null); try { const imgs: { bytes: Uint8Array; kind: 'jpeg' | 'png' }[] = [];
      for (const e of entries) { const b = await bytesOf(e.file); const k = sniffImageFormat(b); imgs.push(k === 'jpeg' ? { bytes: b, kind: 'jpeg' } : k === 'png' ? { bytes: b, kind: 'png' } : { bytes: await toPng(b), kind: 'png' }); }
      setOut(pdfBlob(await imagesToPdf(imgs, { pageSize: size, margin }))); track('tool_success', 'office', 'jpg-to-pdf'); } catch (e) { setError(msg(e)); track('tool_error', 'office', 'jpg-to-pdf'); } setBusy(false); }
  return (<div><Dropzone category="office" multiple rules={{ maxBytes: 30 * 1024 * 1024, maxFiles: 100, extensions: ['jpg', 'jpeg', 'png', 'webp'] }} onFiles={add} status={busy ? 'processing' : out ? 'completed' : 'idle'} progress={50} onDownload={() => out && downloadBlob(out, 'images.pdf')} downloadLabel="Download PDF" label="Drop your JPG, PNG or WebP images here" />
    {entries.length > 0 && <><div className="options"><div className="row"><label htmlFor="ip-s">Page size</label><select id="ip-s" value={size} onChange={(e) => { setSize(e.target.value as PageSize); setOut(null); }}><option value="a4">A4</option><option value="letter">US Letter</option><option value="fit">Same as the image</option></select>
      {size !== 'fit' && <><label htmlFor="ip-m">Margin (pt)</label><input id="ip-m" type="number" min={0} max={200} value={margin} onChange={(e) => { setMargin(Math.max(0, Number(e.target.value))); setOut(null); }} /></>}</div></div>
      <h3 className="field-label">Images (one per page, in this order)</h3><FileList entries={entries} setEntries={(e) => { setEntries(e); setOut(null); }} />
      <div className="row"><button type="button" className="btn" disabled={busy} onClick={run}>Create PDF ({entries.length} page{entries.length === 1 ? '' : 's'})</button><button type="button" className="btn ghost" onClick={() => { setEntries([]); setOut(null); setError(''); }}>Start over</button></div></>}
    <Feedback error={error}>{out && <p className="msg">PDF ready: {entries.length} page(s), {formatBytes(out.size)}.</p>}</Feedback></div>);
}
