import type { Metadata } from 'next';
import { Logo, LogoMark, Wordmark } from '@/components/brand/Logo';
import Mascot, { type MascotState } from '@/components/Mascot';
import { UploadCardView } from '@/components/Dropzone';
import { ICON_NAMES, IconTile, type IconName } from '@/components/Icons';
import { CATEGORIES } from '@/lib/categories';
export const metadata: Metadata = { title: 'Brand', description: 'Internal brand reference.', robots: { index: false, follow: false } };
const STATES: MascotState[] = ['idle', 'dragging', 'processing', 'completed'];
const EXTRA: IconName[] = ['aa', 'link', 'diff', 'base64', 'color', 'clock', 'hash', 'regex'];
/** Internal, noindex brand reference. Static previews only: nothing here simulates processing. */
export default function Page() {
  return (<div>
    <h1 className="title">Brand preview</h1><p className="lead">Internal reference for logo, mascots, icons, colours and upload states. Not linked from navigation and excluded from the sitemap.</p>
    <section className="section"><h2>Logo</h2><div className="brand-logos"><div className="brand-box"><LogoMark size={280} title="OMNI CONVERT logo mark" /><Wordmark height={64} /></div><div className="brand-box"><Logo markSize={72} textHeight={40} /></div></div></section>
    <section className="section"><h2>Palette</h2><div className="swatches">{[['Office', '#45A878'], ['Image', '#548FDC'], ['Text', '#E47791'], ['Web & Code', '#E9AA4D'], ['Primary text', '#28332F'], ['Secondary text', '#7C8582'], ['Background', '#FAFAF7'], ['Border', '#EAECE8']].map(([n, c]) => (<div key={n} className="swatch"><span style={{ background: c }} /><b>{n}</b><small>{c}</small></div>))}</div></section>
    <section className="section"><h2>Upload states</h2><div className="upload-grid">
      <UploadCardView category="office" state="idle" /><UploadCardView category="office" state="dragging" label="Release to upload" />
      <UploadCardView category="image" state="processing" progress={68} /><UploadCardView category="text" state="completed" /></div></section>
    <section className="section"><h2>Mascots</h2><div className="brand-grid">{STATES.map((s) => CATEGORIES.map((c) => (<div key={s + c.slug} className="brand-cell" style={{ background: c.bg }}><span className="msg">{c.name} · {s}</span><Mascot category={c.slug} state={s} size={200} /></div>)))}</div></section>
    <section className="section"><h2>Icon set</h2><div className="icon-grid">{[...ICON_NAMES, ...EXTRA].map((n) => (<div key={n} className="icon-cell"><IconTile name={n} size={64} /><small>{n}</small></div>))}</div></section>
  </div>);
}
