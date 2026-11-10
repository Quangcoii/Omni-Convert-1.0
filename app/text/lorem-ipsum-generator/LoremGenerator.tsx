'use client';
import { useState } from 'react';
import CopyButton from '@/components/CopyButton';
import { generateLorem, type LoremUnit } from '@/lib/text-tools';
import { track } from '@/lib/analytics';
export default function LoremGenerator() {
  const [unit, setUnit] = useState<LoremUnit>('paragraphs'); const [count, setCount] = useState(3); const [start, setStart] = useState(true); const [out, setOut] = useState('');
  const gen = () => { setOut(generateLorem(unit, count, { startWithLorem: start })); track('tool_success', 'text', 'lorem-ipsum-generator'); };
  return (<div><div className="options"><div className="row"><label htmlFor="li-c">Amount</label><input id="li-c" type="number" min={1} max={1000} value={count} onChange={(e) => setCount(Math.max(1, Math.min(1000, Number(e.target.value) || 1)))} />
    <label htmlFor="li-u" className="sr-only">Unit</label><select id="li-u" value={unit} onChange={(e) => setUnit(e.target.value as LoremUnit)}><option value="paragraphs">paragraphs</option><option value="sentences">sentences</option><option value="words">words</option></select></div>
    <label className="check"><input type="checkbox" checked={start} onChange={(e) => setStart(e.target.checked)} />Start with “Lorem ipsum dolor sit amet”</label></div>
    <div className="row"><button type="button" className="btn" onClick={gen}>Generate</button></div>
    <label htmlFor="li-out" className="field-label">Placeholder text</label><textarea id="li-out" value={out} readOnly /><div className="row"><CopyButton text={out} /></div></div>);
}
