import Link from 'next/link';
import { CATEGORIES } from '@/lib/categories';
import Search from './Search';
import { Logo } from './brand/Logo';
export default function Header() {
  return (
    <header className="header"><div className="container">
      <Link href="/" className="logo" aria-label="OMNI CONVERT home"><Logo markSize={46} textHeight={24} /></Link>
      <Search />
      <nav className="nav" aria-label="Categories">
        <Link href="/tools/" className="nav-plain">All tools</Link>
        {CATEGORIES.map((c) => (
          <Link key={c.slug} href={`/${c.slug}/`} style={{ ['--chip' as string]: c.color, ['--chip-bg' as string]: c.bg }}>{c.name}</Link>
        ))}
      </nav>
    </div></header>
  );
}
