import type { Metadata } from 'next';
import ToolLayout from '@/components/ToolLayout';
import { getTool, toolHref } from '@/lib/tools';
import LoremGenerator from './LoremGenerator';
const tool = getTool('text', 'lorem-ipsum-generator')!;
export const metadata: Metadata = { title: "Lorem Ipsum Generator \u2014 Placeholder Text", description: "Generate lorem ipsum placeholder text by paragraphs, sentences or words. Runs in your browser.", alternates: { canonical: toolHref(tool) } };
export default function Page() {
  return (<ToolLayout tool={tool} noun="text"
    howTo={["Choose the amount and unit.", "Click Generate.", "Copy the text."]}
    notes={["Text is generated at random each time; it is meaningless placeholder text.", "Up to 1000 units per run."]}
    faq={[{"q": "Can I get the classic opening?", "a": "Yes. Tick the option to start with \"Lorem ipsum dolor sit amet\"."}]}><LoremGenerator /></ToolLayout>);
}
