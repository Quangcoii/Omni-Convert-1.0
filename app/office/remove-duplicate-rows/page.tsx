import type { Metadata } from 'next';
import ToolLayout from '@/components/ToolLayout';
import { getTool, toolHref } from '@/lib/tools';
import RemoveDuplicateRows from './RemoveDuplicateRows';
const tool = getTool('office', 'remove-duplicate-rows')!;
export const metadata: Metadata = { title: "Remove Duplicate Rows From CSV \u2014 Online Tool", description: "Remove duplicate rows from CSV data in your browser. Ignore case and spaces, or compare chosen columns.", alternates: { canonical: toolHref(tool) } };
export default function Page() {
  return (<ToolLayout tool={tool} noun="data"
    howTo={["Paste CSV or open a file.", "Choose how rows are compared.", "Copy or download the cleaned CSV."]}
    notes={["The first occurrence of each row is kept and the original order is preserved.", "The delimiter is detected automatically and kept in the output.", "Files up to 10 MB."]}
    faq={[{"q": "Can I compare only one column?", "a": "Yes. Enter the column numbers, for example 1 or 1, 3."}]}><RemoveDuplicateRows /></ToolLayout>);
}
