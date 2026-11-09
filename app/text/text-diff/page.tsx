import type { Metadata } from 'next';
import ToolLayout from '@/components/ToolLayout';
import { getTool, toolHref } from '@/lib/tools';
import TextDiff from './TextDiff';
const tool = getTool('text', 'text-diff')!;
export const metadata: Metadata = {
  title: 'Text Diff — Compare Two Texts Online',
  description: 'Free text diff tool. Compare two texts line by line and highlight added and removed lines. Runs in your browser.',
  alternates: { canonical: toolHref(tool) },
};
export default function Page() {
  return (<ToolLayout tool={tool}
    howTo={['Paste the original text on the left.', 'Paste the changed text on the right.', 'Review added (+) and removed (-) lines.']}
    notes={['Comparison is line by line, not word by word.', 'Very large inputs are refused (product of line counts above 4,000,000) to protect browser memory.', 'Whitespace differences count as changes.']}
    faq={[{ q: 'Is my text sent anywhere?', a: 'No. The comparison runs locally in your browser.' }]}><TextDiff /></ToolLayout>);
}
