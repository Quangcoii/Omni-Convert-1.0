import type { Metadata } from 'next';
import ToolLayout from '@/components/ToolLayout';
import { getTool, toolHref } from '@/lib/tools';
import { RotatePdf } from '@/components/pdf/PdfWorkbench';
const tool = getTool('office', 'rotate-pdf')!;
export const metadata: Metadata = { title: "Rotate PDF \u2014 Rotate PDF Pages Online", description: "Rotate PDF pages 90, 180 or 270 degrees in your browser. All pages or only some. No upload.", alternates: { canonical: toolHref(tool) } };
export default function Page() {
  return (<ToolLayout tool={tool} noun="files"
    howTo={["Drop a PDF.", "Choose the rotation and which pages.", "Download the rotated PDF."]}
    notes={["Rotation is added to any rotation the page already has.", "Everything runs in your browser. Files up to 50 MB.", "Password-protected or damaged PDFs are rejected with a message."]}
    faq={[{"q": "Does it change the content?", "a": "No. It only sets the page rotation; text and images are untouched."}]}><RotatePdf /></ToolLayout>);
}
