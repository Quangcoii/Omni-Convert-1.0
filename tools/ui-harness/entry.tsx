import React from 'react';
import { createRoot } from 'react-dom/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Home from '@/app/page';
import CategoryPage from '@/app/[category]/page';
import NotFound from '@/app/not-found';
import T0 from '@/app/image/image-compressor/page';
import T1 from '@/app/image/image-resizer/page';
import T2 from '@/app/image/jpg-to-png/page';
import T3 from '@/app/image/jpg-to-webp/page';
import T4 from '@/app/image/png-to-jpg/page';
import T5 from '@/app/image/webp-to-jpg/page';
import T6 from '@/app/office/csv-to-json/page';
import T7 from '@/app/office/jpg-to-pdf/page';
import T8 from '@/app/office/merge-pdf/page';
import T9 from '@/app/office/remove-duplicate-rows/page';
import T10 from '@/app/office/rotate-pdf/page';
import T11 from '@/app/office/split-pdf/page';
import T12 from '@/app/text/case-converter/page';
import T13 from '@/app/text/character-counter/page';
import T14 from '@/app/text/find-and-replace/page';
import T15 from '@/app/text/lorem-ipsum-generator/page';
import T16 from '@/app/text/slug-generator/page';
import T17 from '@/app/text/sort-lines/page';
import T18 from '@/app/text/text-cleaner/page';
import T19 from '@/app/text/text-diff/page';
import T20 from '@/app/text/word-counter/page';
import T21 from '@/app/web-code/base64-encode-decode/page';
import T22 from '@/app/web-code/color-converter/page';
import T23 from '@/app/web-code/hash-generator/page';
import T24 from '@/app/web-code/html-encode-decode/page';
import T25 from '@/app/web-code/json-formatter/page';
import T26 from '@/app/web-code/json-validator/page';
import T27 from '@/app/web-code/qr-code-generator/page';
import T28 from '@/app/web-code/regex-tester/page';
import T29 from '@/app/web-code/timestamp-converter/page';
import T30 from '@/app/web-code/url-encode-decode/page';
import About from '@/app/about/page';
import Privacy from '@/app/privacy/page';
import Terms from '@/app/terms/page';
import Brand from '@/app/brand/page';
import ToolsAll from '@/app/tools/page';
const ROUTES: Record<string, React.ComponentType> = {
  '/image/image-compressor/': T0,
  '/image/image-resizer/': T1,
  '/image/jpg-to-png/': T2,
  '/image/jpg-to-webp/': T3,
  '/image/png-to-jpg/': T4,
  '/image/webp-to-jpg/': T5,
  '/office/csv-to-json/': T6,
  '/office/jpg-to-pdf/': T7,
  '/office/merge-pdf/': T8,
  '/office/remove-duplicate-rows/': T9,
  '/office/rotate-pdf/': T10,
  '/office/split-pdf/': T11,
  '/text/case-converter/': T12,
  '/text/character-counter/': T13,
  '/text/find-and-replace/': T14,
  '/text/lorem-ipsum-generator/': T15,
  '/text/slug-generator/': T16,
  '/text/sort-lines/': T17,
  '/text/text-cleaner/': T18,
  '/text/text-diff/': T19,
  '/text/word-counter/': T20,
  '/web-code/base64-encode-decode/': T21,
  '/web-code/color-converter/': T22,
  '/web-code/hash-generator/': T23,
  '/web-code/html-encode-decode/': T24,
  '/web-code/json-formatter/': T25,
  '/web-code/json-validator/': T26,
  '/web-code/qr-code-generator/': T27,
  '/web-code/regex-tester/': T28,
  '/web-code/timestamp-converter/': T29,
  '/web-code/url-encode-decode/': T30,
  '/about/': About,
  '/privacy/': Privacy,
  '/terms/': Terms,
  '/brand/': Brand,
  '/tools/': ToolsAll,
};
async function resolve(path: string): Promise<React.ReactElement> {
  if (path === '/') return <Home />;
  const m = path.match(/^\/([a-z-]+)\/$/);
  if (m && ['office', 'image', 'text', 'web-code'].includes(m[1])) { try { return await CategoryPage({ params: Promise.resolve({ category: m[1] }) }); } catch { return <NotFound />; } }
  const C = ROUTES[path]; return C ? <C /> : <NotFound />;
}
(async () => {
  const path = new URLSearchParams(location.search).get('r') ?? '/';
  const el = await resolve(path);
  createRoot(document.getElementById('root')!).render(<><a href="#main" className="skip">Skip to content</a><Header /><main id="main" className="container">{el}</main><Footer /></>);
  document.documentElement.setAttribute('data-ready', '1');
})();
