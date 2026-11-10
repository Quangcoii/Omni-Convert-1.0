'use client';
import { useMemo, useState } from 'react';
import CopyButton from '@/components/CopyButton';
import { htmlDecode, htmlEncode } from '@/lib/web-tools';
import { track } from '@/lib/analytics';
export default function HtmlEntities() {
  const [text, setText] = useState(''); const [mode, setMode] = useState<'encode' | 'decode'>('encode'); const [quotes, setQuotes] = useState(true); const [nonAscii, setNonAscii] = useState(false);
  const out = useMemo(() => (mode === 'encode' ? htmlEncode(text, { quotes, nonAscii }) : htmlDecode(text)), [text, mode, quotes, nonAscii]);
  return (<div><div className="row" role="radiogroup" aria-label="Mode">{(['encode', 'decode'] as const).map((m) => (<label key={m} className="check"><input type="radio" name="hemode" checked={mode === m} onChange={() => setMode(m)} />{m === 'encode' ? 'Encode' : 'Decode'}</label>))}
    {mode === 'encode' && <><label className="check"><input type="checkbox" checked={quotes} onChange={(e) => setQuotes(e.target.checked)} />Encode quotes</label><label className="check"><input type="checkbox" checked={nonAscii} onChange={(e) => setNonAscii(e.target.checked)} />Encode non-ASCII characters</label></>}</div>
    <label htmlFor="he-in" className="field-label">{mode === 'encode' ? 'Text or HTML' : 'Text with entities'}</label><textarea id="he-in" value={text} onChange={(e) => setText(e.target.value)} spellCheck={false} />
    <label htmlFor="he-out" className="field-label">Result</label><textarea id="he-out" value={out} readOnly spellCheck={false} /><div className="row"><CopyButton text={out} onCopied={() => track('tool_success', 'web-code', 'html-encode-decode')} /></div></div>);
}
