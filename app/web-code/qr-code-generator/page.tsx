import type { Metadata } from 'next';
import ToolLayout from '@/components/ToolLayout';
import { getTool, toolHref } from '@/lib/tools';
import QrGenerator from './QrGenerator';
const tool = getTool('web-code', 'qr-code-generator')!;
export const metadata: Metadata = { title: "QR Code Generator \u2014 Free PNG and SVG, No Sign-Up", description: "Create QR codes for URLs or text and download PNG or SVG. Generated in your browser; nothing is uploaded.", alternates: { canonical: toolHref(tool) } };
export default function Page() {
  return (<ToolLayout tool={tool} noun="text"
    howTo={["Enter text or a URL.", "Choose error correction and colours.", "Download the PNG or SVG."]}
    notes={["Holds up to about 271 bytes at the lowest error-correction level (QR versions 1-10).", "Dark code on a light background scans most reliably.", "Test every code with a real phone before printing."]}
    faq={[{"q": "Do QR codes expire?", "a": "No. The code simply contains your text. A URL stops working only if the website does."}, {"q": "Which error correction level?", "a": "Medium suits most uses. Choose High if the code may get dirty or have a logo placed over it."}]}><QrGenerator /></ToolLayout>);
}
