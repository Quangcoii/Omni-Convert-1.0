import Link from 'next/link';
import { STATIC_PAGES } from '@/lib/site';
export default function Footer() {
  return (<footer className="footer"><div className="container">
    <div className="footer-links">{STATIC_PAGES.map((p) => <Link key={p.path} href={p.path}>{p.title}</Link>)}</div>
    <div>© OMNI CONVERT — Your Everyday Tools, All in One Place.</div></div></footer>);
}
