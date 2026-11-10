'use client';
import { useMemo, useState } from 'react';
import FileTextInput from '@/components/FileTextInput';
import CopyButton from '@/components/CopyButton';
import { csvToJson, type Delimiter } from '@/lib/csv';
import { downloadBlob } from '@/lib/file-engine';
import { track } from '@/lib/analytics';
export default function CsvToJson() {
  const [text, setText] = useState(''); const [delim, setDelim] = useState<'auto' | Delimiter>('auto'); const [header, setHeader] = useState(true); const [infer, setInfer] = useState(false); const [indent, setIndent] = useState(2);
  const r = useMemo(() => { if (!text.trim()) return null; try { const x = csvToJson(text, { delimiter: delim === 'auto' ? undefined : delim, header, inferTypes: infer }); return { ok: true as const, out: JSON.stringify(x.json, null, indent || undefined), rows: x.rowCount, delimiter: x.delimiter }; } catch (e) { return { ok: false as const, message: e instanceof Error ? e.message : 'Could not read this CSV.' }; } }, [text, delim, header, infer, indent]);
  const out = r && r.ok ? r.out : '';
  return (<div><FileTextInput id="cj-in" label="Paste CSV or open a file" value={text} onChange={setText} accept=".csv,.tsv,.txt,text/csv" placeholder={'name,age\nAnn,31'} />
    <div className="options"><div className="row"><label htmlFor="cj-d">Delimiter</label><select id="cj-d" value={delim} onChange={(e) => setDelim(e.target.value as 'auto' | Delimiter)}><option value="auto">Auto-detect</option><option value=",">Comma</option><option value=";">Semicolon</option><option value={'\t'}>Tab</option><option value="|">Pipe</option></select>
      <label htmlFor="cj-i">JSON indent</label><select id="cj-i" value={indent} onChange={(e) => setIndent(Number(e.target.value))}><option value={2}>2 spaces</option><option value={4}>4 spaces</option><option value={0}>Minified</option></select></div>
      <label className="check"><input type="checkbox" checked={header} onChange={(e) => setHeader(e.target.checked)} />First row is a header</label>
      <label className="check"><input type="checkbox" checked={infer} onChange={(e) => setInfer(e.target.checked)} />Convert numbers and true/false (IDs like 007 stay text)</label></div>
    {r && !r.ok && <p role="alert" className="errors">{r.message}</p>}
    {r && r.ok && <p className="msg" role="status">{r.rows} row{r.rows === 1 ? '' : 's'} converted (delimiter: {r.delimiter === '\t' ? 'tab' : r.delimiter}).</p>}
    <label htmlFor="cj-out" className="field-label">JSON</label><textarea id="cj-out" value={out} readOnly spellCheck={false} />
    <div className="row"><CopyButton text={out} onCopied={() => track('tool_success', 'office', 'csv-to-json')} /><button type="button" className="btn" disabled={!out} onClick={() => { downloadBlob(new Blob([out], { type: 'application/json' }), 'data.json'); track('tool_success', 'office', 'csv-to-json'); }}>Download .json</button></div></div>);
}
