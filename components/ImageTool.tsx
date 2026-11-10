'use client';
import { useEffect, useRef, useState } from 'react';
import Dropzone from './Dropzone';
import { MAX_PIXELS, MIME, EXT, outputName, percentChange, resizeDimensions, sniffImageFormat, type OutFormat } from '@/lib/image-tools';
import { downloadBlob, formatBytes } from '@/lib/file-engine';
import { track } from '@/lib/analytics';
export interface ImageToolConfig {
  slug: string; /** Real formats this tool accepts (checked from file bytes, not the extension). */ inputKinds: OutFormat[]; extensions: string[];
  mode: 'convert' | 'compress' | 'resize'; output: OutFormat | 'same' | 'choose'; defaultQuality: number;
}
interface Item { name: string; outName: string; inSize: number; outSize: number; w: number; h: number; url: string; blob: Blob; }
const DEFAULT_RULES = { maxBytes: 30 * 1024 * 1024, maxFiles: 20 };
export default function ImageTool({ cfg }: { cfg: ImageToolConfig }) {
  const [quality, setQuality] = useState(cfg.defaultQuality);
  const [choice, setChoice] = useState<'same' | OutFormat>(cfg.mode === 'compress' ? 'same' : 'jpeg');
  const [rmode, setRmode] = useState<'percent' | 'pixels'>('percent');
  const [percent, setPercent] = useState(50); const [width, setWidth] = useState(''); const [height, setHeight] = useState(''); const [keep, setKeep] = useState(true);
  const [status, setStatus] = useState<'idle' | 'processing' | 'completed'>('idle'); const [progress, setProgress] = useState(0);
  const [items, setItems] = useState<Item[]>([]); const [errors, setErrors] = useState<string[]>([]);
  const filesRef = useRef<File[]>([]); const urlsRef = useRef<string[]>([]);
  const revoke = () => { urlsRef.current.forEach((u) => URL.revokeObjectURL(u)); urlsRef.current = []; };
  useEffect(() => revoke, []);
  const lossy = (f: OutFormat) => f === 'jpeg' || f === 'webp';
  async function run(files: File[]) {
    filesRef.current = files; revoke(); setItems([]); setErrors([]); setStatus('processing'); setProgress(0);
    const out: Item[] = []; const errs: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      try {
        const bytes = new Uint8Array(await f.arrayBuffer()); const kind = sniffImageFormat(bytes);
        if (kind === 'heic') throw new Error('HEIC/HEIF photos cannot be decoded in the browser. Export the photo as JPG from your phone or Photos app first.');
        if (!(cfg.inputKinds as string[]).includes(kind)) throw new Error(`This file is ${kind === 'unknown' ? 'not a supported image' : `a ${kind.toUpperCase()} image`}; this tool accepts ${cfg.inputKinds.map((k) => k.toUpperCase()).join(', ')}.`);
        const fmt: OutFormat = cfg.output === 'same' ? (kind as OutFormat) : cfg.output === 'choose' ? (choice === 'same' ? (kind as OutFormat) : choice) : cfg.output;
        const bmp = await createImageBitmap(new Blob([bytes as BlobPart]));
        if (bmp.width * bmp.height > MAX_PIXELS) { bmp.close(); throw new Error(`Image is larger than ${MAX_PIXELS / 1e6} megapixels.`); }
        let { w, h } = { w: bmp.width, h: bmp.height };
        if (cfg.mode === 'resize') ({ w, h } = resizeDimensions(w, h, rmode === 'percent' ? { mode: 'percent', percent } : { mode: 'pixels', width: width ? Number(width) : undefined, height: height ? Number(height) : undefined, keepAspect: keep }));
        if (w * h > MAX_PIXELS) { bmp.close(); throw new Error('The resized image would be too large for the browser.'); }
        const canvas = document.createElement('canvas'); canvas.width = w; canvas.height = h; const ctx = canvas.getContext('2d');
        if (!ctx) { bmp.close(); throw new Error('Canvas is not available in this browser.'); }
        if (fmt === 'jpeg') { ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, w, h); }
        ctx.imageSmoothingQuality = 'high'; ctx.drawImage(bmp, 0, 0, w, h); bmp.close();
        const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, MIME[fmt], lossy(fmt) ? quality : undefined)); canvas.width = canvas.height = 0;
        if (!blob) throw new Error('The browser could not create the output image.');
        if (blob.type !== MIME[fmt]) throw new Error(`Your browser cannot create ${fmt.toUpperCase()} files. Try another browser or output format.`);
        const url = URL.createObjectURL(blob); urlsRef.current.push(url);
        out.push({ name: f.name, outName: outputName(f.name, EXT[fmt], cfg.mode === 'convert' ? '' : cfg.mode === 'compress' ? '-compressed' : `-${w}x${h}`), inSize: f.size, outSize: blob.size, w, h, url, blob });
      } catch (e) { errs.push(`${f.name}: ${e instanceof Error ? e.message : 'could not be processed.'}`); }
      setProgress(((i + 1) / files.length) * 100);
    }
    setItems(out); setErrors(errs); setStatus(out.length ? 'completed' : 'idle');
    if (out.length) track('tool_success', 'image', cfg.slug); if (errs.length) track('tool_error', 'image', cfg.slug);
  }
  const downloadAll = () => items.forEach((it, i) => setTimeout(() => downloadBlob(it.blob, it.outName), i * 350));
  const reset = () => { revoke(); filesRef.current = []; setItems([]); setErrors([]); setStatus('idle'); setProgress(0); };
  const showQuality = cfg.output === 'choose' ? choice !== 'png' : cfg.output === 'same' || lossy(cfg.output as OutFormat);
  return (<div>
    <div className="options">
      {cfg.output === 'choose' && (<div className="row"><label htmlFor="it-fmt">Output format</label><select id="it-fmt" value={choice} onChange={(e) => setChoice(e.target.value as 'same' | OutFormat)}><option value="same">Keep original format</option><option value="jpeg">JPG (smallest for photos)</option><option value="webp">WebP (small, modern)</option></select></div>)}
      {showQuality && (<div className="row"><label htmlFor="it-q">Quality: <b>{Math.round(quality * 100)}%</b></label><input id="it-q" type="range" min={10} max={100} step={5} value={Math.round(quality * 100)} onChange={(e) => setQuality(Number(e.target.value) / 100)} /></div>)}
      {cfg.mode === 'resize' && (<fieldset className="plain"><legend className="field-label">Size</legend>
        <div className="row" role="radiogroup" aria-label="Resize by">{(['percent', 'pixels'] as const).map((m) => (<label key={m} className="check"><input type="radio" name="rmode" checked={rmode === m} onChange={() => setRmode(m)} />{m === 'percent' ? 'By percentage' : 'By pixels'}</label>))}</div>
        {rmode === 'percent' ? (<div className="row"><label htmlFor="it-pct">Scale (%)</label><input id="it-pct" type="number" min={1} max={500} value={percent} onChange={(e) => setPercent(Number(e.target.value))} /></div>)
          : (<div className="row"><label htmlFor="it-w">Width</label><input id="it-w" type="number" min={1} value={width} placeholder="auto" onChange={(e) => setWidth(e.target.value)} /><label htmlFor="it-h">Height</label><input id="it-h" type="number" min={1} value={height} placeholder="auto" onChange={(e) => setHeight(e.target.value)} /><label className="check"><input type="checkbox" checked={keep} onChange={(e) => setKeep(e.target.checked)} />Keep aspect ratio</label></div>)}</fieldset>)}
    </div>
    <Dropzone category="image" multiple rules={{ ...DEFAULT_RULES, extensions: cfg.extensions }} onFiles={run} status={status} progress={progress} onDownload={downloadAll} downloadLabel={items.length > 1 ? `Download all (${items.length})` : 'Download'} label={`Drop your ${cfg.extensions.filter((e) => e !== 'jpeg').map((e) => e.toUpperCase()).join(', ')} files here`} />
    <div role="status" aria-live="polite" className="sr-only">{status === 'completed' ? `${items.length} file(s) ready` : ''}</div>
    {errors.length > 0 && <ul role="alert" className="errors">{errors.map((e, i) => <li key={i}>{e}</li>)}</ul>}
    {items.length > 0 && (<div className="results"><ul className="result-list">{items.map((it) => { const ch = percentChange(it.inSize, it.outSize); return (
      <li key={it.outName + it.url} className="result-row"><img src={it.url} alt={`Preview of ${it.outName}`} width={56} height={56} /><div className="result-meta"><b>{it.outName}</b><span>{it.w}×{it.h}px · {formatBytes(it.inSize)} → {formatBytes(it.outSize)} <em className={ch > 0 ? 'bad' : 'good'}>({ch > 0 ? '+' : ''}{ch}%)</em></span></div>
        <button type="button" className="btn small" onClick={() => downloadBlob(it.blob, it.outName)}>Download</button></li>); })}</ul>
      <div className="row"><button type="button" className="btn" onClick={() => run(filesRef.current)}>Apply current settings again</button><button type="button" className="btn ghost" onClick={reset}>Start over</button></div></div>)}
  </div>);
}
