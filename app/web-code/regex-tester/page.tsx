import type { Metadata } from 'next';
import ToolLayout from '@/components/ToolLayout';
import { getTool, toolHref } from '@/lib/tools';
import RegexTester from './RegexTester';
const tool = getTool('web-code', 'regex-tester')!;
export const metadata: Metadata = { title: "Regex Tester \u2014 Test JavaScript Regular Expressions", description: "Test JavaScript regular expressions online: live highlighting, capture groups, named groups and flags.", alternates: { canonical: toolHref(tool) } };
export default function Page() {
  return (<ToolLayout tool={tool} noun="text"
    howTo={["Enter a pattern and flags.", "Paste test text.", "See highlighted matches and groups."]}
    notes={["Uses the JavaScript (ECMAScript) regex engine of your browser; other languages differ in details.", "The g flag is always applied so all matches are listed (first 500 shown).", "A pattern with catastrophic backtracking can freeze the tab; reload the page if that happens."]}
    faq={[{"q": "Which flags are supported?", "a": "d, g, i, m, s, u, v and y, each at most once."}]}><RegexTester /></ToolLayout>);
}
