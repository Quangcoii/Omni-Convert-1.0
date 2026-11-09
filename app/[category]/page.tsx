import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { CATEGORIES, getCategory } from '@/lib/categories';
import { toolsByCategory } from '@/lib/tools';
import ToolCard from '@/components/ToolCard';
import Breadcrumbs from '@/components/Breadcrumbs';
import Mascot from '@/components/Mascot';
export const dynamicParams = false;
export function generateStaticParams() { return CATEGORIES.map((c) => ({ category: c.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const c = getCategory((await params).category);
  return c ? { title: `${c.name} Tools`, description: c.description, alternates: { canonical: `/${c.slug}/` } } : {};
}
export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const c = getCategory((await params).category);
  if (!c) notFound();
  const tools = toolsByCategory(c.slug);
  return (<>
    <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: c.name }]} />
    <div className="cat-hero" style={{ background: c.bg }}><Mascot category={c.slug} color={c.color} bg={c.bg} size={88} />
      <div><h1 className="title">{c.name} Tools</h1><p className="lead" style={{ margin: 0 }}>{c.description}</p></div></div>
    {tools.length ? <div className="grid">{tools.map((t) => <ToolCard key={t.slug} tool={t} />)}</div> : <p>Tools for this category are coming soon.</p>}
  </>);
}
