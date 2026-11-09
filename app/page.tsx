import Link from 'next/link';
import { CATEGORIES } from '@/lib/categories';
import { TOOLS } from '@/lib/tools';
import ToolCard from '@/components/ToolCard';
import Mascot from '@/components/Mascot';
const WHY = [
  { t: 'Private by design', d: 'Text and code tools run in your browser. Nothing you type is uploaded.' },
  { t: 'Free, no sign-up', d: 'Open a tool and use it. No account, no subscription.' },
  { t: 'Works on any device', d: 'Responsive pages that are comfortable on phones, tablets and desktops.' },
];
export default function Home() {
  return (<>
    <section className="hero"><h1>Your Everyday Tools, All in One Place.</h1><p>Free tools for office files, images, text and code.</p></section>
    <section className="grid" aria-label="Categories">
      {CATEGORIES.map((c) => (<Link key={c.slug} href={`/${c.slug}/`} className="card cat-card" style={{ ['--c' as string]: c.color, background: c.bg }}>
        <div className="cat-row"><Mascot category={c.slug} color={c.color} bg={c.bg} size={64} /><div><h2>{c.name}</h2><p>{c.description}</p></div></div></Link>))}
    </section>
    <section className="section"><h2>Available tools</h2><div className="grid">{TOOLS.map((t) => <ToolCard key={t.category + t.slug} tool={t} />)}</div></section>
    <section className="section"><div className="grid">{WHY.map((w) => (<div key={w.t} className="card"><h3>{w.t}</h3><p>{w.d}</p></div>))}</div></section>
  </>);
}
