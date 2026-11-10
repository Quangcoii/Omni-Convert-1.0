import type { Metadata } from 'next';
import ToolLayout from '@/components/ToolLayout';
import { getTool, toolHref } from '@/lib/tools';
import SortLines from './SortLines';
const tool = getTool('text', 'sort-lines')!;
export const metadata: Metadata = { title: "Sort Lines Alphabetically \u2014 Online Line Sorter", description: "Sort text lines A-Z, Z-A, by length or reverse, with natural number order and duplicate removal.", alternates: { canonical: toolHref(tool) } };
export default function Page() {
  return (<ToolLayout tool={tool} noun="text"
    howTo={["Paste your lines.", "Choose the order and options.", "Copy the result."]}
    notes={["Natural order sorts file2 before file10.", "Sorting uses your browser language rules for letters."]}
    faq={[{"q": "Can I remove duplicates while sorting?", "a": "Yes. Tick Remove duplicate lines."}]}><SortLines /></ToolLayout>);
}
