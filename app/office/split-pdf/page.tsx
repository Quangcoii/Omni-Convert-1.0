import type { Metadata } from 'next';
import ToolLayout from '@/components/ToolLayout';
import { getTool, toolHref } from '@/lib/tools';
import { SplitPdf } from '@/components/pdf/PdfWorkbench';
const tool = getTool('office', 'split-pdf')!;
export const metadata: Metadata = { title: "Split PDF \u2014 Extract Pages From a PDF Online", description: "Extract pages or ranges from a PDF in your browser. One file per range or combined. No upload.", alternates: { canonical: toolHref(tool) } };
export default function Page() {
  return (<ToolLayout tool={tool} noun="files"
    howTo={["Drop a PDF.", "Enter pages such as 1-3, 5, 8-.", "Download each extracted file."]}
    notes={["Ranges are separated by commas; \"8-\" means page 8 to the end.", "Each range becomes its own PDF unless you choose to combine them.", "Everything runs in your browser. Files up to 50 MB.", "Password-protected or damaged PDFs are rejected with a message."]}
    faq={[{"q": "Can I extract one page?", "a": "Yes. Enter a single number such as 4."}]}><SplitPdf /></ToolLayout>);
}
