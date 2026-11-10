'use client';
import { useMemo, useState } from 'react';
import FileTextInput from '@/components/FileTextInput';
import CopyButton from '@/components/CopyButton';
import { detectDelimiter, parseCsv, removeDuplicateRows, toCsv } from '@/lib/csv';
import { downloadBlob } from '@/lib/file-engine';
import { track } from '@/lib/analytics';
export default function RemoveDuplicateRows() {
  const [text, setText] = useState(''); const [header, setHeader] = useState(true); const [cs, setCs] = useState(false); const [trim, setTrim] = useState(true); const [cols, setCols] = useState('');
  const r = useMemo(() => { if (!text.trim()) return null; try { const d = detectDelimiter(text); const rows = parseCsv(text, d);
    const columns = cols.trim() ? cols.split(',').map((c) => parseInt(c.trim(), 10) - 1) : undefined; if (columns && columns.some((c) => !(c >= 0))) return { ok: false as const, message: 'Columns must be numbers such as 1, 3.' };
    const x = removeDuplicateRows(rows, { header, caseSensitive: cs, trimCells: trim, columns }); return { ok: true as const, out: toCsv(x.rows, d), removed: x.removed, kept: x.rows.length - (header ? 1 : 0) }; } catch (e) { return { ok: false as const, message: e instanceof Error ? e.message : 'Could not read this CSV.' }; } }, [text, header, cs, trim, cols]);
  const out = r && r.ok ? r.out : '';
  return (<div><FileTextInput id="rd-in" label="Paste CSV or open a file" value={text} onChange={setText} accept=".csv,.tsv,.txt,text/csv" placeholder={'name,city\nAnn,Hue\nAnn,Hue'} />
    <div className="options"><label className="check"><input type="checkbox" checked={header} onChange={(e) => setHeader(e.target.checked)} />First row is a header (always kept)</label>
      <label className="check"><input type="checkbox" checked={cs} onChange={(e) => setCs(e.target.checked)} />Case-sensitive comparison</label>
      <label className="check"><input type="checkbox" checked={trim} onChange={(e) => setTrim(e.target.checked)} />Ignore spaces around values</label>
      <div className="row"><label htmlFor="rd-c">Compare only columns (optional)</label><input id="rd-c" type="text" value={cols} placeholder="e.g. 1, 3" onChange={(e) => setCols(e.target.value)} /></div></div>
    {r && !r.ok && <p role="alert" className="errors">{r.message}</p>}
    {r && r.ok && <p className="msg" role="status">{r.removed} duplicate row{r.removed === 1 ? '' : 's'} removed, {r.kept} kept.</p>}
    <label htmlFor="rd-out" className="field-label">Result (CSV)</label><textarea id="rd-out" value={out} readOnly spellCheck={false} />
    <div className="row"><CopyButton text={out} onCopied={() => track('tool_success', 'office', 'remove-duplicate-rows')} /><button type="button" className="btn" disabled={!out} onClick={() => { downloadBlob(new Blob([out], { type: 'text/csv' }), 'deduplicated.csv'); track('tool_success', 'office', 'remove-duplicate-rows'); }}>Download .csv</button></div></div>);
}
