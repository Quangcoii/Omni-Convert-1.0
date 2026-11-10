import type { Metadata } from 'next';
import ToolLayout from '@/components/ToolLayout';
import { getTool, toolHref } from '@/lib/tools';
import { MergePdf } from '@/components/pdf/PdfWorkbench';
const tool = getTool('office', 'merge-pdf')!;
export const metadata: Metadata = { title: "Merge PDF \u2014 Combine PDF Files Online, No Upload", description: "Merge multiple PDF files into one document in your browser. Reorder files, no upload, no sign-up.", alternates: { canonical: toolHref(tool) } };
export default function Page() {
  return (<ToolLayout tool={tool} noun="files"
    howTo={["Drop two or more PDF files.", "Reorder them with the arrow buttons.", "Click Merge and download the result."]}
    notes={["Bookmarks and some interactive form features of the original files are not carried into the merged PDF.", "Everything runs in your browser. Files up to 50 MB.", "Password-protected or damaged PDFs are rejected with a message."]}
    faq={[{"q": "Is there a page limit?", "a": "No fixed limit; very large files depend on your device memory."}]}><MergePdf /></ToolLayout>);
}
