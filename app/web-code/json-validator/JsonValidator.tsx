'use client';
import { useMemo, useState } from 'react';
import { jsonStats, parseJson } from '@/lib/web-tools';
export default function JsonValidator() {
  const [text, setText] = useState('');
  const r = useMemo(() => (text.trim() ? parseJson(text) : null), [text]);
  const st = r && r.ok ? jsonStats(r.value) : null;
  return (<div>
    <label htmlFor="jv-in" className="field-label">Paste JSON to validate</label>
    <textarea id="jv-in" value={text} spellCheck={false} onChange={(e) => setText(e.target.value)} />
    <div role="status" aria-live="polite" style={{ margin: '14px 0' }}>
      {!r && <span className="msg">Paste JSON above to check it.</span>}
      {r && r.ok && <span className="badge valid">✓ Valid JSON</span>}
      {r && !r.ok && (<><span className="badge invalid">✗ Invalid JSON</span><p className="errors" style={{ marginTop: 10 }}>{r.message}{r.line ? ` — line ${r.line}, column ${r.column}` : ''}</p></>)}
    </div>
    {st && (<div className="stats">{([['Root type', st.rootType], ['Max depth', st.depth], ['Objects', st.objects], ['Arrays', st.arrays], ['Keys', st.keys], ['Strings', st.strings], ['Numbers', st.numbers], ['Booleans', st.booleans], ['Nulls', st.nulls]] as [string, string | number][]).map(([l, v]) => (<div className="stat" key={l}><b>{v}</b><span>{l}</span></div>))}</div>)}
  </div>);
}
