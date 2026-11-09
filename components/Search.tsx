'use client';
import { useId, useMemo, useState } from 'react';
import Link from 'next/link';
import { TOOLS, toolHref } from '@/lib/tools';
import { getCategory } from '@/lib/categories';
import { searchItems } from '@/lib/search';
const ITEMS = TOOLS.map((t) => ({ name: t.name, description: t.description, category: getCategory(t.category)!.name, href: toolHref(t) }));
export default function Search() {
  const [q, setQ] = useState('');
  const id = useId();
  const results = useMemo(() => searchItems(q, ITEMS), [q]);
  return (<div className="search" role="search">
    <label htmlFor={id} className="sr-only">Search tools</label>
    <input id={id} type="search" value={q} placeholder="Search tools…" autoComplete="off" aria-controls={`${id}-list`}
      onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => { if (e.key === 'Escape') setQ(''); }} />
    {q.trim() !== '' && (<ul id={`${id}-list`} className="search-results">
      {results.length ? results.map((r) => (<li key={r.href}><Link href={r.href} onClick={() => setQ('')}><b>{r.name}</b><span>{r.category}</span></Link></li>)) : <li className="search-empty">No tools found</li>}
    </ul>)}
  </div>);
}
