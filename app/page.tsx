import Link from 'next/link';
import { CATEGORIES } from '@/lib/categories';
import { TOOLS, popularTools } from '@/lib/tools';
import ToolCard from '@/components/ToolCard';
import Mascot from '@/components/Mascot';
import MascotGroup from '@/components/MascotGroup';
import Search from '@/components/Search';
const WHY = [
  { t: 'Private by design', d: 'Text and code tools run in your browser. Nothing you type is uploaded.' },
  { t: 'Free, no sign-up', d: 'Open a tool and use it. No account, no subscription.' },
  { t: 'Works on any device', d: 'Responsive pages that are comfortable on phones, tablets and desktops.' },
];
export default function Home() {
  return (<>
    <section className="hero-split">
      <div className="hero-copy">
        <h1>Your Everyday Tools,<br /><span className="grad-text">All in One Place.</span></h1>
        <p>Convert files, optimize images, clean text, and simplify your workflow.</p>
        <Search variant="hero" placeholder="What do you want to convert or do?" />
      </div>
      <MascotGroup />
    </section>
    <section className="grid cat-grid" aria-label="Categories">
      {CATEGORIES.map((c) => (<Link key={c.slug} href={`/${c.slug}/`} className="card cat-card" style={{ ['--c' as string]: c.color, ['--cbg' as string]: c.bg }}>
        <div className="cat-card-art"><Mascot category={c.slug} state="idle" size={150} showProp={false} /></div><h2>{c.name}</h2><p>{c.description}</p></Link>))}
    </section>
    <section className="section"><h2>Popular tools</h2><div className="grid">{popularTools().map((t) => <ToolCard key={t.category + t.slug} tool={t} />)}</div><p style={{ marginTop: 16 }}><Link href="/tools/" className="btn ghost">View all {TOOLS.length} tools</Link></p></section>
    <section className="section"><div className="grid">{WHY.map((w) => (<div key={w.t} className="card"><h3>{w.t}</h3><p>{w.d}</p></div>))}</div></section>
  </>);
}
