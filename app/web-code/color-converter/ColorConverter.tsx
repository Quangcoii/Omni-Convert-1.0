'use client';
import { useMemo, useState } from 'react';
import CopyButton from '@/components/CopyButton';
import { formatColor, parseColor } from '@/lib/web-tools';
import { track } from '@/lib/analytics';
export default function ColorConverter() {
  const [text, setText] = useState('#45A878'); const c = useMemo(() => parseColor(text), [text]); const f = c ? formatColor(c) : null;
  const rows: [string, string][] = f ? [['HEX', f.hex], ['RGB', f.rgb], ['HSL', f.hsl], ['HSV', f.hsv]] : [];
  return (<div><div className="row"><label htmlFor="cc2-in" className="field-label" style={{ margin: 0 }}>Colour</label><input id="cc2-in" type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="#45A878, rgb(69 168 120), hsl(151, 42%, 46%)" style={{ minWidth: 260 }} spellCheck={false} />
    <label htmlFor="cc2-p" className="sr-only">Pick a colour</label><input id="cc2-p" type="color" value={f ? f.hex.slice(0, 7) : '#000000'} onChange={(e) => setText(e.target.value)} /></div>
    {!c && text.trim() && <p role="alert" className="errors">Not a recognised colour. Use HEX (#rgb, #rrggbb), rgb(), hsl() or a basic colour name.</p>}
    {f && c && (<><div className="swatch-big" style={{ background: f.rgb }} role="img" aria-label={`Preview of ${f.hex}`} />
      <ul className="result-list">{rows.map(([k, v]) => (<li key={k} className="result-row"><div className="result-meta"><b>{k}</b><code>{v}</code></div><CopyButton text={v} label="Copy" onCopied={() => track('tool_success', 'web-code', 'color-converter')} /></li>))}</ul>
      <p className="msg">Contrast ratio: {f.contrastOnWhite}:1 on white · {f.contrastOnBlack}:1 on black (WCAG AA text needs 4.5:1).</p></>)}</div>);
}
