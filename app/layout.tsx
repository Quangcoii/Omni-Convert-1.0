import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { SITE_URL } from '@/lib/site';
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: 'OMNI CONVERT — Your Everyday Tools, All in One Place', template: '%s | OMNI CONVERT' },
  description: 'Free online tools for office files, images, text and code. Processed in your browser.',
  manifest: '/manifest.webmanifest',
  openGraph: { type: 'website', siteName: 'OMNI CONVERT', title: 'OMNI CONVERT — Your Everyday Tools, All in One Place', description: 'Free online tools for office files, images, text and code.', images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'OMNI CONVERT' }] },
  twitter: { card: 'summary_large_image', images: ['/og-image.png'] },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="en"><body><a href="#main" className="skip">Skip to content</a><Header /><main id="main" className="container">{children}</main><Footer /></body></html>);
}
