import type { Metadata } from 'next';
import ToolLayout from '@/components/ToolLayout';
import { getTool, toolHref } from '@/lib/tools';
import HashGenerator from './HashGenerator';
const tool = getTool('web-code', 'hash-generator')!;
export const metadata: Metadata = { title: "Hash Generator \u2014 SHA-256, SHA-512 of Text or Files", description: "Generate SHA-1, SHA-256, SHA-384 and SHA-512 hashes of text or files in your browser. Nothing is uploaded.", alternates: { canonical: toolHref(tool) } };
export default function Page() {
  return (<ToolLayout tool={tool} noun="data"
    howTo={["Type text or choose a file.", "All four hashes appear instantly.", "Copy the one you need."]}
    notes={["MD5 is not offered because browsers do not include it, and it is not secure.", "Files up to 100 MB; the whole file is read into memory.", "A hash is not encryption; do not use plain SHA hashes to store passwords."]}
    faq={[{"q": "Is my file uploaded?", "a": "No. Hashing uses your browser built-in crypto and the file never leaves your device."}]}><HashGenerator /></ToolLayout>);
}
