import type { Metadata } from 'next';
import Breadcrumbs from '@/components/Breadcrumbs';
import { CONTACT_EMAIL } from '@/lib/site';
export const metadata: Metadata = { title: 'About', description: 'About OMNI CONVERT: free everyday online tools that run in your browser.', alternates: { canonical: '/about/' } };
export default function Page() {
  return (<div className="prose"><Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'About' }]} />
    <h1 className="title">About OMNI CONVERT</h1>
    <p>OMNI CONVERT is a collection of free online tools for office files, images, text and code. Our goal is simple: tools that do what they say, are easy to use, and respect your privacy.</p>
    <h2>How it works</h2>
    <p>Where technically possible, tools run directly in your browser, so the text or files you work with are not uploaded. If a tool ever needs to send data to a server, that tool will say so clearly on its page.</p>
    <h2>Free to use</h2>
    <p>Tools are free and need no account. The site may show advertising in the future to cover running costs; advertising will never be required to use a tool.</p>
    {CONTACT_EMAIL && (<><h2>Contact</h2><p>Questions or feedback: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></p></>)}
  </div>);
}
