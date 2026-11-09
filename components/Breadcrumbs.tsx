import Link from 'next/link';
import JsonLd from './JsonLd';
import { SITE_URL } from '@/lib/site';
export default function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  const ld = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.label, ...(it.href ? { item: SITE_URL + it.href } : {}) })) };
  return (<><JsonLd data={ld} /><nav className="crumbs" aria-label="Breadcrumb">{items.map((it, i) => (
    <span key={i}>{it.href ? <Link href={it.href}>{it.label}</Link> : <span aria-current="page">{it.label}</span>}{i < items.length - 1 ? ' / ' : ''}</span>))}</nav></>);
}
