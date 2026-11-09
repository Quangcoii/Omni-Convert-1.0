import type { Metadata } from 'next';
import ToolLayout from '@/components/ToolLayout';
import { getTool, toolHref } from '@/lib/tools';
import UrlTool from './UrlTool';
const tool = getTool('web-code', 'url-encode-decode')!;
export const metadata: Metadata = {
  title: 'URL Encoder/Decoder — Percent-Encode and Decode URLs',
  description: 'Free URL encoder and decoder. Percent-encode query values or whole URLs, and decode them back. Runs in your browser.',
  alternates: { canonical: toolHref(tool) },
};
export default function Page() {
  return (<ToolLayout tool={tool}
    howTo={['Choose Encode or Decode.', 'Choose Component for a query value, or Full URL to keep the URL structure.', 'Paste your text and copy the result.']}
    notes={['Component mode (encodeURIComponent) also encodes characters such as / ? & = and is right for parameter values.', 'Full URL mode (encodeURI) keeps those characters so a complete URL stays usable.', 'Decoding fails on malformed sequences such as a lone % sign.']}
    faq={[{ q: 'Which mode should I use?', a: 'Use Component for a single value inside a query string, and Full URL when encoding an entire address.' }]}><UrlTool /></ToolLayout>);
}
