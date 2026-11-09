'use client';
import { useState } from 'react';
export default function CopyButton({ text, onCopied }: { text: string; onCopied?: () => void }) {
  const [state, setState] = useState<'idle' | 'ok' | 'error'>('idle');
  async function copy() {
    try { await navigator.clipboard.writeText(text); setState('ok'); onCopied?.(); }
    catch { setState('error'); }
    setTimeout(() => setState('idle'), 2000);
  }
  return (<button type="button" className="btn" onClick={copy} disabled={!text} aria-live="polite">
    {state === 'ok' ? 'Copied!' : state === 'error' ? 'Copy failed' : 'Copy result'}</button>);
}
