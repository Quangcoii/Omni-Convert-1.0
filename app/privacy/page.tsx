import type { Metadata } from 'next';
import Breadcrumbs from '@/components/Breadcrumbs';
export const metadata: Metadata = { title: 'Privacy Policy', description: 'How OMNI CONVERT handles your data: browser-side processing and anonymous aggregate usage counts.', alternates: { canonical: '/privacy/' } };
export default function Page() {
  return (<div className="prose"><Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Privacy Policy' }]} />
    <h1 className="title">Privacy Policy</h1><p className="msg">Last updated: 9 November 2026</p>
    <h2>Your content</h2>
    <p>Tools that are described as running in your browser process your text and files on your own device. That content is not uploaded to our servers and is not stored by us. If a tool ever requires server-side processing, it will say so on that tool&apos;s page before you use it.</p>
    <h2>Usage statistics</h2>
    <p>When enabled, we count anonymous, aggregate events such as &quot;a tool page was viewed&quot; per day. These counts contain no IP address, no file names, no file or text contents and no user identifier, and we do not use cookies for them. We respect the Do Not Track and Global Privacy Control browser signals by not sending these counts.</p>
    <h2>Hosting</h2>
    <p>The site is served through Cloudflare. Like any web host, Cloudflare processes technical request data (such as IP address) to deliver the site and protect it from abuse, under its own privacy policy.</p>
    <h2>Advertising</h2>
    <p>The site does not currently show advertising. If we add advertising (for example Google AdSense), this policy will be updated before launch to describe the cookies and partners involved and how to manage your consent.</p>
    <h2>Accounts</h2><p>No registration is required and we do not collect personal information to provide the tools.</p>
  </div>);
}
