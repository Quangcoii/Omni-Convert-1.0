'use client';
import { useId, useMemo, useState } from 'react';
import Link from 'next/link';
import { TOOLS, toolHref } from '@/lib/tools';
import { getCategory } from '@/lib/categories';
import { searchItems } from '@/lib/search';
import { ArrowRightIcon, SearchIcon } from './Icons';
const ITEMS = TOOLS.map((t) => ({ name: t.name, description: t.description, category: getCategory(t.category)!.name, href: toolHref(t) }));
export default function Search({ variant = 'compact', placeholder = 'Search tools…' }: { variant?: 'compact' | 'hero'; placeholder?: string }) {
  const [q, setQ] = useState('');
  const id = useId();
  const results = useMemo(() => searchItems(q, ITEMS), [q]);
  const go = () => { if (results[0]) window.location.assign(results[0].href); };
  return (<div className={`search ${variant}`} role="search">
    <label htmlFor={id} className="sr-only">Search tools</label>
    {variant === 'hero' && <span className="search-lead"><SearchIcon /></span>}
    <input id={id} type="search" value={q} placeholder={placeholder} autoComplete="off" aria-controls={`${id}-list`}
      onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => { if (e.key === 'Escape') setQ(''); if (e.key === 'Enter') go(); }} />
    {variant === 'hero' && <button type="button" className="search-go" aria-label="Open the first matching tool" onClick={go} disabled={!results.length}><ArrowRightIcon /></button>}
    {q.trim() !== '' && (<ul id={`${id}-list`} className="search-results">
      {results.length ? results.map((r) => (<li key={r.href}><Link href={r.href} onClick={() => setQ('')}><b>{r.name}</b><span>{r.category}</span></Link></li>)) : <li className="search-empty">No tools found</li>}
    </ul>)}
  </div>);
}
