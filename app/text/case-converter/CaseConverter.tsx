'use client';
import { useMemo, useState } from 'react';
import { CaseMode, convertCase } from '@/lib/text-tools';
import { track } from '@/lib/analytics';
import CopyButton from '@/components/CopyButton';
const MODES: [CaseMode, string][] = [['upper', 'UPPER CASE'], ['lower', 'lower case'], ['title', 'Title Case'], ['sentence', 'Sentence case'], ['camel', 'camelCase'], ['snake', 'snake_case'], ['kebab', 'kebab-case']];
export default function CaseConverter() {
  const [text, setText] = useState('');
  const [mode, setMode] = useState<CaseMode>('title');
  const out = useMemo(() => convertCase(text, mode), [text, mode]);
  return (<div>
    <label htmlFor="cv-in" className="field-label">Your text</label>
    <textarea id="cv-in" value={text} onChange={(e) => setText(e.target.value)} />
    <div className="row"><label htmlFor="cv-mode">Convert to</label>
      <select id="cv-mode" value={mode} onChange={(e) => setMode(e.target.value as CaseMode)}>{MODES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></div>
    <label htmlFor="cv-out" className="field-label">Result</label>
    <textarea id="cv-out" value={out} readOnly />
    <div className="row"><CopyButton text={out} onCopied={() => track('tool_success', 'text', 'case-converter')} /></div>
  </div>);
}
