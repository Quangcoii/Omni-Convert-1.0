'use client';
import { useMemo, useState } from 'react';
import { formatJson, type JsonIndent } from '@/lib/web-tools';
import { downloadBlob } from '@/lib/file-engine';
import { track } from '@/lib/analytics';
import CopyButton from '@/components/CopyButton';
const OPTIONS: [string, JsonIndent][] = [['2 spaces', 2], ['4 spaces', 4], ['Tab', 'tab'], ['Minify', 'min']];
export default function JsonFormatter() {
  const [text, setText] = useState('');
  const [idx, setIdx] = useState(0);
  const r = useMemo(() => (text.trim() ? formatJson(text, OPTIONS[idx][1]) : null), [text, idx]);
  const out = r && r.ok ? r.output : '';
  return (<div>
    <label htmlFor="jf-in" className="field-label">Paste JSON</label>
    <textarea id="jf-in" value={text} spellCheck={false} onChange={(e) => setText(e.target.value)} placeholder='{"name":"OMNI CONVERT","tools":[1,2,3]}' />
    <div className="row"><label htmlFor="jf-fmt">Output</label>
      <select id="jf-fmt" value={idx} onChange={(e) => setIdx(Number(e.target.value))}>{OPTIONS.map(([l], i) => <option key={l} value={i}>{l}</option>)}</select></div>
    {r && !r.ok && <p role="alert" className="errors">Invalid JSON: {r.message}{r.line ? ` (line ${r.line}, column ${r.column})` : ''}</p>}
    <label htmlFor="jf-out" className="field-label">Result</label>
    <textarea id="jf-out" value={out} readOnly spellCheck={false} />
    <div className="row"><CopyButton text={out} onCopied={() => track('tool_success', 'web-code', 'json-formatter')} />
      <button type="button" className="btn" disabled={!out} onClick={() => { downloadBlob(new Blob([out], { type: 'application/json' }), 'formatted.json'); track('tool_success', 'web-code', 'json-formatter'); }}>Download .json</button></div>
  </div>);
}
