import type { Metadata } from 'next';
import ToolLayout from '@/components/ToolLayout';
import { getTool, toolHref } from '@/lib/tools';
import JsonFormatter from './JsonFormatter';
const tool = getTool('web-code', 'json-formatter')!;
export const metadata: Metadata = {
  title: 'JSON Formatter — Beautify and Minify JSON Online',
  description: 'Free JSON formatter and minifier. Pretty-print with 2 spaces, 4 spaces or tabs, see the exact error position, and download the result. Runs in your browser.',
  alternates: { canonical: toolHref(tool) },
};
export default function Page() {
  return (<ToolLayout tool={tool}
    howTo={['Paste your JSON.', 'Pick an indentation style or Minify.', 'Copy the result or download it as formatted.json.']}
    notes={['Formatting re-serialises parsed JSON: duplicate keys keep the last value and numbers beyond JavaScript precision (about 15-17 digits) may lose precision.', 'Comments and trailing commas are not valid JSON and will be reported as errors.', 'Very large documents depend on your device memory.']}
    faq={[{ q: 'Is my JSON uploaded?', a: 'No. Parsing and formatting happen locally in your browser.' }, { q: 'Does formatting change my data?', a: 'Formatting only changes whitespace, and key order is preserved. See the precision note above for very large numbers.' }]}><JsonFormatter /></ToolLayout>);
}
