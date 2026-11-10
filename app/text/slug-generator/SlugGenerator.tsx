'use client';
import { useMemo, useState } from 'react';
import CopyButton from '@/components/CopyButton';
import { slugify } from '@/lib/text-tools';
import { track } from '@/lib/analytics';
export default function SlugGenerator() {
  const [text, setText] = useState(''); const [sep, setSep] = useState<'-' | '_'>('-'); const [lower, setLower] = useState(true); const [max, setMax] = useState(0);
  const out = useMemo(() => text.split('\n').map((l) => (l.trim() ? slugify(l, { separator: sep, lowercase: lower, maxLength: max || undefined }) : '')).join('\n'), [text, sep, lower, max]);
  return (<div><label htmlFor="sg-in" className="field-label">Titles or text (one per line)</label><textarea id="sg-in" value={text} onChange={(e) => setText(e.target.value)} placeholder="Xin chào, thế giới!" />
    <div className="options"><div className="row"><label htmlFor="sg-s">Separator</label><select id="sg-s" value={sep} onChange={(e) => setSep(e.target.value as '-' | '_')}><option value="-">Hyphen (-)</option><option value="_">Underscore (_)</option></select>
      <label htmlFor="sg-m">Max length (0 = none)</label><input id="sg-m" type="number" min={0} max={200} value={max} onChange={(e) => setMax(Math.max(0, Number(e.target.value) || 0))} /></div>
      <label className="check"><input type="checkbox" checked={lower} onChange={(e) => setLower(e.target.checked)} />Lowercase</label></div>
    <label htmlFor="sg-out" className="field-label">Slug</label><textarea id="sg-out" value={out} readOnly /><div className="row"><CopyButton text={out} onCopied={() => track('tool_success', 'text', 'slug-generator')} /></div></div>);
}
