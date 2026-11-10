import type { Metadata } from 'next';
import ToolLayout from '@/components/ToolLayout';
import { getTool, toolHref } from '@/lib/tools';
import FindReplace from './FindReplace';
const tool = getTool('text', 'find-and-replace')!;
export const metadata: Metadata = { title: "Find and Replace Text Online", description: "Find and replace text online with match case, whole word and regex support. Runs in your browser.", alternates: { canonical: toolHref(tool) } };
export default function Page() {
  return (<ToolLayout tool={tool} noun="text"
    howTo={["Paste your text.", "Enter what to find and what to replace it with.", "Copy the result."]}
    notes={["In regex mode you can use $1, $2 and $& in the replacement; in normal mode the replacement is literal.", "Whole-word matching treats letters, digits and underscores as word characters.", "A very complex regex on a very large text may be slow on your device."]}
    faq={[{"q": "How do I use capture groups?", "a": "Tick Regular expression, put groups in parentheses, and refer to them as $1, $2 in the replacement."}]}><FindReplace /></ToolLayout>);
}
