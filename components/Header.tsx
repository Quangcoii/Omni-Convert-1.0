import Link from 'next/link';
import { CATEGORIES } from '@/lib/categories';
import Search from './Search';
export default function Header() {
  return (
    <header className="header"><div className="container">
      <Link href="/" className="logo">OMNI CONVERT</Link>
      <Search />
      <nav className="nav" aria-label="Categories">
        {CATEGORIES.map((c) => (
          <Link key={c.slug} href={`/${c.slug}/`} style={{ ['--chip' as string]: c.color, ['--chip-bg' as string]: c.bg }}>{c.name}</Link>
        ))}
      </nav>
    </div></header>
  );
}
