import type { Metadata } from 'next';
import ToolLayout from '@/components/ToolLayout';
import { getTool, toolHref } from '@/lib/tools';
import CaseConverter from './CaseConverter';
const tool = getTool('text', 'case-converter')!;
export const metadata: Metadata = {
  title: 'Case Converter — UPPER, lower, Title, camelCase, snake_case',
  description: 'Free online case converter. Change text to uppercase, lowercase, title case, sentence case, camelCase, snake_case or kebab-case.',
  alternates: { canonical: toolHref(tool) },
};
export default function Page() {
  return (<ToolLayout tool={tool}
    howTo={['Paste your text.', 'Choose a case style.', 'Copy the result.']}
    notes={['Title Case capitalises every word; it does not apply style-guide exceptions like "of" or "the".', 'camelCase, snake_case and kebab-case keep only letters and numbers and drop punctuation.']}
    faq={[{ q: 'Does it work with non-English letters?', a: 'Yes for scripts that have letter case (e.g. Latin, Cyrillic, Greek). Scripts without case, such as Japanese, are left unchanged.' }]}><CaseConverter /></ToolLayout>);
}
