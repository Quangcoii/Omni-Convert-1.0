'use client';
import { useMemo, useState } from 'react';
import CopyButton from '@/components/CopyButton';
import { sortLines, type SortOrder } from '@/lib/text-tools';
import { track } from '@/lib/analytics';
export default function SortLines() {
  const [text, setText] = useState(''); const [order, setOrder] = useState<SortOrder>('asc'); const [natural, setNatural] = useState(true); const [cs, setCs] = useState(false); const [dups, setDups] = useState(false); const [trim, setTrim] = useState(false); const [empty, setEmpty] = useState(false);
  const out = useMemo(() => (text ? sortLines(text, { order, natural, caseSensitive: cs, removeDuplicates: dups, trim, removeEmpty: empty }) : ''), [text, order, natural, cs, dups, trim, empty]);
  return (<div><label htmlFor="sl-in" className="field-label">Lines to sort</label><textarea id="sl-in" value={text} onChange={(e) => setText(e.target.value)} />
    <div className="options"><div className="row"><label htmlFor="sl-o">Order</label><select id="sl-o" value={order} onChange={(e) => setOrder(e.target.value as SortOrder)}><option value="asc">A → Z</option><option value="desc">Z → A</option><option value="length-asc">Shortest first</option><option value="length-desc">Longest first</option><option value="reverse">Reverse current order</option></select></div>
      <label className="check"><input type="checkbox" checked={natural} onChange={(e) => setNatural(e.target.checked)} />Natural number order (file2 before file10)</label><label className="check"><input type="checkbox" checked={cs} onChange={(e) => setCs(e.target.checked)} />Case-sensitive</label>
      <label className="check"><input type="checkbox" checked={dups} onChange={(e) => setDups(e.target.checked)} />Remove duplicate lines</label><label className="check"><input type="checkbox" checked={trim} onChange={(e) => setTrim(e.target.checked)} />Trim each line</label><label className="check"><input type="checkbox" checked={empty} onChange={(e) => setEmpty(e.target.checked)} />Remove empty lines</label></div>
    <label htmlFor="sl-out" className="field-label">Result</label><textarea id="sl-out" value={out} readOnly /><div className="row"><CopyButton text={out} onCopied={() => track('tool_success', 'text', 'sort-lines')} /></div></div>);
}
