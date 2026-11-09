'use client';
import { useMemo, useState } from 'react';
import { computeTextStats } from '@/lib/text-stats';
export default function CharacterCounter() {
  const [text, setText] = useState('');
  const [limit, setLimit] = useState(280);
  const s = useMemo(() => computeTextStats(text), [text]);
  const remaining = limit > 0 ? limit - s.characters : null;
  return (<div>
    <label htmlFor="cc-input" className="field-label">Type or paste your text below</label>
    <textarea id="cc-input" value={text} onChange={(e) => setText(e.target.value)} />
    <div className="row"><label htmlFor="cc-limit">Character limit (0 = none)</label>
      <input id="cc-limit" type="number" min={0} max={1000000} value={limit} onChange={(e) => setLimit(Math.max(0, Number(e.target.value) || 0))} /></div>
    <div className="stats" role="status" aria-live="polite">
      <div className="stat"><b>{s.characters}</b><span>Characters</span></div>
      <div className="stat"><b>{s.charactersNoSpaces}</b><span>No spaces</span></div>
      <div className="stat"><b>{s.words}</b><span>Words</span></div>
      {remaining !== null && <div className="stat"><b style={{ color: remaining < 0 ? '#C0392B' : undefined }}>{remaining}</b><span>{remaining < 0 ? 'Over limit' : 'Remaining'}</span></div>}
    </div></div>);
}
