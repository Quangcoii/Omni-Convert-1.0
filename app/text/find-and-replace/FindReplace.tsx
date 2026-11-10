'use client';
import { useMemo, useState } from 'react';
import CopyButton from '@/components/CopyButton';
import { findReplace } from '@/lib/text-tools';
import { track } from '@/lib/analytics';
export default function FindReplace() {
  const [text, setText] = useState(''); const [find, setFind] = useState(''); const [rep, setRep] = useState(''); const [regex, setRegex] = useState(false); const [cs, setCs] = useState(false); const [ww, setWw] = useState(false);
  const r = useMemo(() => (find ? findReplace(text, find, rep, { regex, caseSensitive: cs, wholeWord: ww }) : null), [text, find, rep, regex, cs, ww]);
  const out = r && r.ok ? r.output : text;
  return (<div><label htmlFor="fr-in" className="field-label">Your text</label><textarea id="fr-in" value={text} onChange={(e) => setText(e.target.value)} />
    <div className="options"><div className="row"><label htmlFor="fr-f">Find</label><input id="fr-f" type="text" value={find} onChange={(e) => setFind(e.target.value)} /><label htmlFor="fr-r">Replace with</label><input id="fr-r" type="text" value={rep} onChange={(e) => setRep(e.target.value)} /></div>
      <label className="check"><input type="checkbox" checked={cs} onChange={(e) => setCs(e.target.checked)} />Match case</label><label className="check"><input type="checkbox" checked={ww} onChange={(e) => setWw(e.target.checked)} />Whole words only</label>
      <label className="check"><input type="checkbox" checked={regex} onChange={(e) => setRegex(e.target.checked)} />Regular expression (use $1, $2 in the replacement)</label></div>
    {r && !r.ok && <p role="alert" className="errors">{r.message}</p>}{r && r.ok && <p className="msg" role="status">{r.count} replacement{r.count === 1 ? '' : 's'} made.</p>}
    <label htmlFor="fr-out" className="field-label">Result</label><textarea id="fr-out" value={out} readOnly /><div className="row"><CopyButton text={out} onCopied={() => track('tool_success', 'text', 'find-and-replace')} /></div></div>);
}
