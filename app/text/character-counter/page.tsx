import type { Metadata } from 'next';
import ToolLayout from '@/components/ToolLayout';
import { getTool, toolHref } from '@/lib/tools';
import CharacterCounter from './CharacterCounter';
const tool = getTool('text', 'character-counter')!;
export const metadata: Metadata = {
  title: 'Character Counter — Count Characters With or Without Spaces',
  description: 'Free character counter with optional limit (e.g. 280 for social posts). Counts with and without spaces in your browser.',
  alternates: { canonical: toolHref(tool) },
};
export default function Page() {
  return (<ToolLayout tool={tool}
    howTo={['Type or paste your text.', 'Optionally set a character limit.', 'Watch the live counts and remaining characters.']}
    notes={['Characters are counted as Unicode code points, so an emoji counts as one.', 'Some platforms count characters differently (e.g. links); check the platform rules.']}
    faq={[{ q: 'Do line breaks count as characters?', a: 'Yes in the main count; the "No spaces" count excludes all whitespace including line breaks.' }]}><CharacterCounter /></ToolLayout>);
}
