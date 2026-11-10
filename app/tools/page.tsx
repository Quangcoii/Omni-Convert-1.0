import type { Metadata } from 'next';
import Breadcrumbs from '@/components/Breadcrumbs';
import ToolCard from '@/components/ToolCard';
import { CATEGORIES } from '@/lib/categories';
import { toolsByCategory } from '@/lib/tools';
export const metadata: Metadata = { title: 'All Tools', description: 'Every OMNI CONVERT tool in one list: office, image, text and web & code utilities.', alternates: { canonical: '/tools/' } };
export default function Page() {
  return (<><Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'All tools' }]} /><h1 className="title">All tools</h1>
    {CATEGORIES.map((c) => { const tools = toolsByCategory(c.slug); return (<section key={c.slug} className="section"><h2><a href={`/${c.slug}/`}>{c.name}</a></h2>{tools.length ? <div className="grid">{tools.map((t) => <ToolCard key={t.slug} tool={t} />)}</div> : <p className="msg">Coming soon.</p>}</section>); })}</>);
}
