import Breadcrumbs from './Breadcrumbs';
import ToolCard from './ToolCard';
import TrackView from './TrackView';
import { getCategory } from '@/lib/categories';
import { Tool, toolsByCategory } from '@/lib/tools';
interface Props { tool: Tool; howTo: string[]; notes: string[]; faq: { q: string; a: string }[]; children: React.ReactNode; }
/** Standard tool page structure (Master Directive §10). */
export default function ToolLayout({ tool, howTo, notes, faq, children }: Props) {
  const cat = getCategory(tool.category)!;
  const related = toolsByCategory(tool.category).filter((t) => t.slug !== tool.slug);
  return (<>
    <TrackView category={tool.category} tool={tool.slug} />
    <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: cat.name, href: `/${cat.slug}/` }, { label: tool.name }]} />
    <h1 className="title">{tool.name}</h1>
    <p className="lead">{tool.description} Your text stays in your browser and is never uploaded.</p>
    <div style={{ ['--c' as string]: cat.color, ['--cbg' as string]: cat.bg }}>{children}</div>
    <section className="section"><h2>How to use</h2><ol>{howTo.map((s) => <li key={s}>{s}</li>)}</ol></section>
    <section className="section"><h2>Notes and limitations</h2><ul>{notes.map((s) => <li key={s}>{s}</li>)}</ul></section>
    <section className="section"><h2>FAQ</h2>{faq.map((f) => <div key={f.q}><h3>{f.q}</h3><p>{f.a}</p></div>)}</section>
    {related.length > 0 && <section className="section"><h2>Related tools</h2><div className="grid">{related.map((t) => <ToolCard key={t.slug} tool={t} />)}</div></section>}
  </>);
}
