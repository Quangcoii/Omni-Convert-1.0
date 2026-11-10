import type { Metadata } from 'next';
import ToolLayout from '@/components/ToolLayout';
import { getTool, toolHref } from '@/lib/tools';
import { ImagesToPdf } from '@/components/pdf/PdfWorkbench';
const tool = getTool('office', 'jpg-to-pdf')!;
export const metadata: Metadata = { title: "JPG to PDF \u2014 Convert Images to PDF Online", description: "Convert JPG, PNG or WebP images to a PDF in your browser. Choose page size and order. No upload.", alternates: { canonical: toolHref(tool) } };
export default function Page() {
  return (<ToolLayout tool={tool} noun="files"
    howTo={["Drop your images.", "Choose page size and arrange the order.", "Create and download the PDF."]}
    notes={["JPG and PNG are embedded without re-encoding; WebP is converted to PNG first.", "HEIC photos are not supported; export them as JPG first.", "Up to 100 images of 30 MB each."]}
    faq={[{"q": "Is image quality reduced?", "a": "No. JPG and PNG data is embedded as it is, so quality is unchanged."}]}><ImagesToPdf /></ToolLayout>);
}
