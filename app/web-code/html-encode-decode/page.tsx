import type { Metadata } from 'next';
import ToolLayout from '@/components/ToolLayout';
import { getTool, toolHref } from '@/lib/tools';
import HtmlEntities from './HtmlEntities';
const tool = getTool('web-code', 'html-encode-decode')!;
export const metadata: Metadata = { title: "HTML Encoder / Decoder \u2014 Escape and Unescape Entities", description: "Encode special characters as HTML entities or decode entities back to text. Runs in your browser.", alternates: { canonical: toolHref(tool) } };
export default function Page() {
  return (<ToolLayout tool={tool} noun="text"
    howTo={["Choose Encode or Decode.", "Paste your text.", "Copy the result."]}
    notes={["Decoding supports numeric entities and common named ones (amp, lt, gt, quot, apos, nbsp, copy, reg, trade, hellip, mdash, ndash, euro, laquo, raquo); other names are left unchanged.", "Encoding is for showing text safely; it is not a full security sanitiser."]}
    faq={[{"q": "Which characters are encoded?", "a": "& < > always; quotes optionally; non-ASCII characters optionally as numeric entities."}]}><HtmlEntities /></ToolLayout>);
}
