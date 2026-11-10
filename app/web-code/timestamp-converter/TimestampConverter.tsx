'use client';
import { useMemo, useState } from 'react';
import CopyButton from '@/components/CopyButton';
import { describeTimestamp } from '@/lib/web-tools';
import { track } from '@/lib/analytics';
export default function TimestampConverter() {
  const [text, setText] = useState(''); const [now, setNow] = useState(() => Date.now()); const r = useMemo(() => (text.trim() ? describeTimestamp(text, now) : null), [text, now]);
  const rows: [string, string][] = r && r.ok ? [['Unix (seconds)', String(r.unixSeconds)], ['Unix (milliseconds)', String(r.unixMs)], ['ISO 8601 (UTC)', r.iso], ['UTC', r.utc], [`Local (${r.timeZone})`, r.local], ['Relative', r.relative]] : [];
  return (<div><div className="row"><label htmlFor="ts-in" className="field-label" style={{ margin: 0 }}>Timestamp or date</label><input id="ts-in" type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="1700000000 or 2026-11-09T10:30:00Z" style={{ minWidth: 280 }} spellCheck={false} />
    <button type="button" className="btn small" onClick={() => { const n = Date.now(); setNow(n); setText(String(Math.floor(n / 1000))); }}>Use current time</button></div>
    {r && !r.ok && <p role="alert" className="errors">{r.message}</p>}
    {r && r.ok && (<><p className="msg" role="status">Read as {r.interpretedAs === 'date' ? 'a date' : r.interpretedAs}.</p><ul className="result-list">{rows.map(([k, v]) => (<li key={k} className="result-row"><div className="result-meta"><b>{k}</b><code>{v}</code></div><CopyButton text={v} label="Copy" onCopied={() => track('tool_success', 'web-code', 'timestamp-converter')} /></li>))}</ul></>)}</div>);
}
