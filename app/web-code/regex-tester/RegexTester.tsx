'use client';
import { useMemo, useState, type ReactNode } from 'react';
import { runRegex } from '@/lib/web-tools';
export default function RegexTester() {
  const [pattern, setPattern] = useState(''); const [flags, setFlags] = useState('g'); const [text, setText] = useState('');
  const r = useMemo(() => (pattern ? runRegex(pattern, flags, text) : null), [pattern, flags, text]);
  const highlighted = useMemo(() => { if (!r || !r.ok || !r.matches.length) return null; const parts: ReactNode[] = []; let pos = 0; r.matches.forEach((m, i) => { if (m.text === '') return; parts.push(text.slice(pos, m.index)); parts.push(<mark key={i}>{m.text}</mark>); pos = m.index + m.text.length; }); parts.push(text.slice(pos)); return parts; }, [r, text]);
  return (<div><div className="row"><label htmlFor="rx-p" className="field-label" style={{ margin: 0 }}>Pattern</label><input id="rx-p" type="text" value={pattern} onChange={(e) => setPattern(e.target.value)} placeholder="(\d+)-(?<word>[a-z]+)" spellCheck={false} style={{ minWidth: 260 }} /><label htmlFor="rx-f">Flags</label><input id="rx-f" type="text" value={flags} onChange={(e) => setFlags(e.target.value)} style={{ width: 80 }} spellCheck={false} /></div>
    <label htmlFor="rx-t" className="field-label">Test text</label><textarea id="rx-t" value={text} onChange={(e) => setText(e.target.value)} spellCheck={false} />
    {r && !r.ok && <p role="alert" className="errors">{r.message}</p>}
    {r && r.ok && (<><p className="msg" role="status">{r.matches.length} match{r.matches.length === 1 ? '' : 'es'}{r.truncated ? ' (showing the first 500)' : ''}.</p>
      {highlighted && <pre className="regex-hl" aria-label="Text with matches highlighted">{highlighted}</pre>}
      {r.matches.length > 0 && <div className="table-wrap"><table className="data-table"><thead><tr><th>#</th><th>Index</th><th>Match</th><th>Groups</th></tr></thead><tbody>{r.matches.map((m, i) => (<tr key={i}><td>{i + 1}</td><td>{m.index}</td><td><code>{m.text}</code></td><td>{m.groups.map((g, k) => <code key={k}>{g === undefined ? '∅' : g}</code>)}{m.named && Object.entries(m.named).map(([k, v]) => <code key={k}>{k}={v}</code>)}</td></tr>))}</tbody></table></div>}</>)}</div>);
}
