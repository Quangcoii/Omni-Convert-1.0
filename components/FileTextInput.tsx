'use client';
import { useRef, useState } from 'react';
/** Textarea with an "Open file" button that reads a text file locally (never uploaded). */
export default function FileTextInput({ id, label, value, onChange, accept, maxBytes = 10 * 1024 * 1024, placeholder }: { id: string; label: string; value: string; onChange: (v: string) => void; accept: string; maxBytes?: number; placeholder?: string }) {
  const ref = useRef<HTMLInputElement>(null); const [err, setErr] = useState('');
  async function read(f?: File) { if (!f) return; if (f.size > maxBytes) { setErr(`${f.name} is larger than ${Math.round(maxBytes / 1048576)} MB.`); return; } setErr(''); try { onChange(await f.text()); } catch { setErr('Could not read that file.'); } }
  return (<div><label htmlFor={id} className="field-label">{label}</label><textarea id={id} value={value} spellCheck={false} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
    <div className="row"><button type="button" className="btn ghost small" onClick={() => ref.current?.click()}>Open a file…</button><input ref={ref} type="file" hidden accept={accept} onChange={(e) => { read(e.target.files?.[0]); e.target.value = ''; }} aria-label="Open a text file" /></div>
    {err && <p role="alert" className="errors">{err}</p>}</div>);
}
