'use client';
import { useEffect, useRef, useState } from 'react';
import CopyButton from '@/components/CopyButton';
import { HASH_ALGORITHMS, hashBytes, type HashAlgorithm } from '@/lib/web-tools';
import { formatBytes } from '@/lib/file-engine';
import { track } from '@/lib/analytics';
const MAX = 100 * 1024 * 1024;
export default function HashGenerator() {
  const [text, setText] = useState(''); const [file, setFile] = useState<File | null>(null); const [hashes, setHashes] = useState<Record<string, string>>({}); const [error, setError] = useState(''); const input = useRef<HTMLInputElement>(null);
  useEffect(() => { let alive = true; (async () => { try { if (!file && !text) { setHashes({}); return; } const bytes = file ? new Uint8Array(await file.arrayBuffer()) : new TextEncoder().encode(text); const res: Record<string, string> = {}; for (const a of HASH_ALGORITHMS) res[a] = await hashBytes(a as HashAlgorithm, bytes); if (alive) { setHashes(res); setError(''); } } catch { if (alive) setError('Could not calculate the hash. Your browser may block the crypto API on non-HTTPS pages.'); } })(); return () => { alive = false; }; }, [text, file]);
  function pick(f?: File) { if (!f) return; if (f.size > MAX) { setError(`${f.name} is larger than ${MAX / 1048576} MB.`); return; } setError(''); setFile(f); }
  return (<div><label htmlFor="hg-in" className="field-label">Text</label><textarea id="hg-in" value={text} onChange={(e) => { setText(e.target.value); setFile(null); }} placeholder="Type text, or hash a file below" style={{ minHeight: 110 }} spellCheck={false} />
    <div className="row"><button type="button" className="btn ghost" onClick={() => input.current?.click()}>Hash a file…</button><input ref={input} type="file" hidden onChange={(e) => { pick(e.target.files?.[0]); e.target.value = ''; }} aria-label="Choose a file to hash" />
      {file && <span className="msg">{file.name} · {formatBytes(file.size)} <button type="button" className="btn small ghost" onClick={() => setFile(null)}>Clear</button></span>}</div>
    {error && <p role="alert" className="errors">{error}</p>}
    {Object.keys(hashes).length > 0 && <ul className="result-list">{HASH_ALGORITHMS.map((a) => (<li key={a} className="result-row"><div className="result-meta"><b>{a}</b><code className="wrap">{hashes[a]}</code></div><CopyButton text={hashes[a] ?? ''} label="Copy" onCopied={() => track('tool_success', 'web-code', 'hash-generator')} /></li>))}</ul>}</div>);
}
