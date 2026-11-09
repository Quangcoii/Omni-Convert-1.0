import type { Metadata } from 'next';
import ToolLayout from '@/components/ToolLayout';
import { getTool, toolHref } from '@/lib/tools';
import TextCleaner from './TextCleaner';
const tool = getTool('text', 'text-cleaner')!;
export const metadata: Metadata = {
  title: 'Text Cleaner — Remove Extra Spaces, Blank & Duplicate Lines',
  description: 'Clean pasted text online: trim lines, collapse extra spaces, remove empty lines and duplicate lines. Runs in your browser.',
  alternates: { canonical: toolHref(tool) },
};
export default function Page() {
  return (<ToolLayout tool={tool}
    howTo={['Paste your text.', 'Tick the cleanup options you want.', 'Copy the cleaned result.']}
    notes={['Line breaks are normalised to \\n.', 'Duplicate detection is exact and case-sensitive; the first occurrence is kept.']}
    faq={[{ q: 'Does it change the words in my text?', a: 'No. It only changes spacing and removes whole lines you choose to remove.' }]}><TextCleaner /></ToolLayout>);
}
