import type { Metadata } from 'next';
import ToolLayout from '@/components/ToolLayout';
import { getTool, toolHref } from '@/lib/tools';
import JsonValidator from './JsonValidator';
const tool = getTool('web-code', 'json-validator')!;
export const metadata: Metadata = {
  title: 'JSON Validator — Check JSON Syntax and Find Errors',
  description: 'Free JSON validator. Check whether JSON is valid, locate the error line and column, and see a structure summary (depth, keys, types). Runs in your browser.',
  alternates: { canonical: toolHref(tool) },
};
export default function Page() {
  return (<ToolLayout tool={tool}
    howTo={['Paste your JSON.', 'See instantly whether it is valid.', 'If invalid, use the reported line and column to find the problem.']}
    notes={['Validates JSON syntax only, not against a JSON Schema.', 'Error positions come from your browser\'s JSON parser, so wording can differ between browsers.', 'Single quotes, comments and trailing commas are invalid JSON.']}
    faq={[{ q: 'What does the structure summary show?', a: 'The root type, maximum nesting depth, and counts of objects, arrays, keys and value types.' }]}><JsonValidator /></ToolLayout>);
}
