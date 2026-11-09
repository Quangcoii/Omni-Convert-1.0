'use client';
import { useMemo, useState } from 'react';
import { computeTextStats } from '@/lib/text-stats';
export default function WordCounter() {
  const [text, setText] = useState('');
  const s = useMemo(() => computeTextStats(text), [text]);
  const items: [string, number][] = [['Words', s.words], ['Characters', s.characters], ['No spaces', s.charactersNoSpaces], ['Sentences', s.sentences], ['Paragraphs', s.paragraphs], ['Min. read', s.readingMinutes]];
  return (<div style={{ ['--c' as string]: '#E47791', ['--cbg' as string]: '#FCEAF0' }}>
    <label htmlFor="wc-input" className="field-label">Type or paste your text below</label>
    <textarea id="wc-input" value={text} onChange={(e) => setText(e.target.value)} placeholder="Start typing…" />
    <div className="stats" role="status" aria-live="polite">{items.map(([l, v]) => (<div className="stat" key={l}><b>{v}</b><span>{l}</span></div>))}</div>
    <button type="button" className="btn" onClick={() => setText('')} disabled={!text}>Clear</button>
  </div>);
}
