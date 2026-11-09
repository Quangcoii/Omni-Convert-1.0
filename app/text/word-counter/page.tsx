import type { Metadata } from 'next';
import ToolLayout from '@/components/ToolLayout';
import { getTool, toolHref } from '@/lib/tools';
import WordCounter from './WordCounter';
const tool = getTool('text', 'word-counter')!;
export const metadata: Metadata = {
  title: 'Word Counter — Count Words & Characters Online',
  description: 'Free word counter. Count words, characters, sentences and paragraphs as you type. Runs entirely in your browser.',
  alternates: { canonical: toolHref(tool) },
};
export default function Page() {
  return (<ToolLayout tool={tool}
    howTo={['Type or paste text into the box.', 'Read the live counts below it.', 'Press Clear to start over.']}
    notes={['Words are separated by whitespace; hyphenated words count as one.', 'Sentences are detected by . ! ? and may be inaccurate with abbreviations.', 'Reading time assumes 200 words per minute.']}
    faq={[{ q: 'Is my text uploaded?', a: 'No. All counting happens locally in your browser.' }]}><WordCounter /></ToolLayout>);
}
