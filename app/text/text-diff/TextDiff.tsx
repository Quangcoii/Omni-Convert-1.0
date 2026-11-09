'use client';
import { useMemo, useState } from 'react';
import { diffLines } from '@/lib/text-tools';
export default function TextDiff() {
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const result = useMemo(() => (a || b ? diffLines(a, b) : []), [a, b]);
  const added = result?.filter((l) => l.type === 'add').length ?? 0;
  const removed = result?.filter((l) => l.type === 'del').length ?? 0;
  return (<div>
    <div className="grid">
      <div><label htmlFor="td-a" className="field-label">Original text</label><textarea id="td-a" value={a} onChange={(e) => setA(e.target.value)} /></div>
      <div><label htmlFor="td-b" className="field-label">Changed text</label><textarea id="td-b" value={b} onChange={(e) => setB(e.target.value)} /></div>
    </div>
    <div role="status" aria-live="polite" className="msg" style={{ margin: '12px 0' }}>
      {result === null ? 'Texts are too large to compare in the browser. Try shorter texts.' : result.length ? `${added} line(s) added, ${removed} line(s) removed.` : 'Enter text in both boxes to compare.'}</div>
    {result && result.length > 0 && (<div className="diff" aria-label="Differences">{result.map((l, i) => (<div key={i} className={l.type === 'same' ? '' : l.type}>{l.type === 'add' ? '+ ' : l.type === 'del' ? '- ' : '  '}{l.text}</div>))}</div>)}
  </div>);
}
