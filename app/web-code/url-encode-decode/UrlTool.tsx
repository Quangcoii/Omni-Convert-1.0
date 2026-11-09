'use client';
import { useMemo, useState } from 'react';
import { urlDecode, urlEncode, type TextResult, type UrlMode } from '@/lib/web-tools';
import { track } from '@/lib/analytics';
import CopyButton from '@/components/CopyButton';
export default function UrlTool() {
  const [text, setText] = useState('');
  const [action, setAction] = useState<'encode' | 'decode'>('encode');
  const [mode, setMode] = useState<UrlMode>('component');
  const r: TextResult | null = useMemo(() => (text ? (action === 'encode' ? urlEncode(text, mode) : urlDecode(text, mode)) : null), [text, action, mode]);
  const out = r && r.ok ? r.output : '';
  return (<div>
    <div className="row" role="radiogroup" aria-label="Action">
      {(['encode', 'decode'] as const).map((m) => (<label key={m} className="check"><input type="radio" name="urlaction" checked={action === m} onChange={() => setAction(m)} />{m === 'encode' ? 'Encode' : 'Decode'}</label>))}
      <label htmlFor="url-mode">Scope</label>
      <select id="url-mode" value={mode} onChange={(e) => setMode(e.target.value as UrlMode)}>
        <option value="component">Component (query values)</option><option value="full">Full URL</option></select>
    </div>
    <label htmlFor="url-in" className="field-label">{action === 'encode' ? 'Text or URL to encode' : 'Encoded text to decode'}</label>
    <textarea id="url-in" value={text} spellCheck={false} onChange={(e) => setText(e.target.value)} />
    {r && !r.ok && <p role="alert" className="errors">{r.message}</p>}
    <label htmlFor="url-out" className="field-label">Result</label>
    <textarea id="url-out" value={out} readOnly spellCheck={false} />
    <div className="row"><CopyButton text={out} onCopied={() => track('tool_success', 'web-code', 'url-encode-decode')} /></div>
  </div>);
}
