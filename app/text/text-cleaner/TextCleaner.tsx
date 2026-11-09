'use client';
import { useMemo, useState } from 'react';
import { CleanOptions, cleanText } from '@/lib/text-tools';
import { track } from '@/lib/analytics';
import CopyButton from '@/components/CopyButton';
const LABELS: [keyof CleanOptions, string][] = [['trimLines', 'Trim each line'], ['collapseSpaces', 'Collapse repeated spaces'], ['removeBlankLines', 'Remove blank lines'], ['removeDuplicateLines', 'Remove duplicate lines']];
export default function TextCleaner() {
  const [text, setText] = useState('');
  const [opts, setOpts] = useState<CleanOptions>({ trimLines: true, collapseSpaces: true, removeBlankLines: false, removeDuplicateLines: false });
  const out = useMemo(() => cleanText(text, opts), [text, opts]);
  return (<div>
    <label htmlFor="tc-in" className="field-label">Your text</label>
    <textarea id="tc-in" value={text} onChange={(e) => setText(e.target.value)} />
    <fieldset style={{ border: 0, padding: 0, margin: '12px 0' }}><legend className="field-label">Options</legend>
      {LABELS.map(([k, l]) => (<label key={k} className="check"><input type="checkbox" checked={opts[k]} onChange={(e) => setOpts({ ...opts, [k]: e.target.checked })} />{l}</label>))}</fieldset>
    <label htmlFor="tc-out" className="field-label">Result</label>
    <textarea id="tc-out" value={out} readOnly />
    <div className="row"><CopyButton text={out} onCopied={() => track('tool_success', 'text', 'text-cleaner')} /></div>
  </div>);
}
