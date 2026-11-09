'use client';
import { useMemo, useState } from 'react';
import { base64Decode, base64Encode, type TextResult } from '@/lib/web-tools';
import { track } from '@/lib/analytics';
import CopyButton from '@/components/CopyButton';
export default function Base64Tool() {
  const [text, setText] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [urlSafe, setUrlSafe] = useState(false);
  const r: TextResult | null = useMemo(() => {
    if (!text) return null;
    return mode === 'encode' ? { ok: true, output: base64Encode(text, urlSafe) } : base64Decode(text);
  }, [text, mode, urlSafe]);
  const out = r && r.ok ? r.output : '';
  return (<div>
    <div className="row" role="radiogroup" aria-label="Mode">
      {(['encode', 'decode'] as const).map((m) => (<label key={m} className="check"><input type="radio" name="b64mode" checked={mode === m} onChange={() => setMode(m)} />{m === 'encode' ? 'Encode' : 'Decode'}</label>))}
      {mode === 'encode' && <label className="check"><input type="checkbox" checked={urlSafe} onChange={(e) => setUrlSafe(e.target.checked)} />URL-safe</label>}
    </div>
    <label htmlFor="b64-in" className="field-label">{mode === 'encode' ? 'Text to encode' : 'Base64 to decode'}</label>
    <textarea id="b64-in" value={text} spellCheck={false} onChange={(e) => setText(e.target.value)} />
    {r && !r.ok && <p role="alert" className="errors">{r.message}</p>}
    <label htmlFor="b64-out" className="field-label">Result</label>
    <textarea id="b64-out" value={out} readOnly spellCheck={false} />
    <div className="row"><CopyButton text={out} onCopied={() => track('tool_success', 'web-code', 'base64-encode-decode')} /></div>
  </div>);
}
