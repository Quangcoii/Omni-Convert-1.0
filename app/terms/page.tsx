import type { Metadata } from 'next';
import Breadcrumbs from '@/components/Breadcrumbs';
export const metadata: Metadata = { title: 'Terms of Use', description: 'Terms of use for OMNI CONVERT.', alternates: { canonical: '/terms/' } };
export default function Page() {
  return (<div className="prose"><Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Terms of Use' }]} />
    <h1 className="title">Terms of Use</h1><p className="msg">Last updated: 9 November 2026</p>
    <h2>Use of the tools</h2><p>You may use the tools for lawful purposes. Do not use the site to process content you have no right to use, or to attempt to disrupt or abuse the service.</p>
    <h2>No warranty</h2><p>The tools are provided &quot;as is&quot; without warranties of any kind. Results can contain errors or limitations described on each tool&apos;s page; check important results before relying on them and keep backups of your originals.</p>
    <h2>Limitation of liability</h2><p>To the extent permitted by law, we are not liable for losses arising from the use of the tools or the inability to use them.</p>
    <h2>Changes</h2><p>We may change the tools or these terms. Continued use means you accept the updated terms.</p>
  </div>);
}
