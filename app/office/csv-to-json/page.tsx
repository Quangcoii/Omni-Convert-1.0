import type { Metadata } from 'next';
import ToolLayout from '@/components/ToolLayout';
import { getTool, toolHref } from '@/lib/tools';
import CsvToJson from './CsvToJson';
const tool = getTool('office', 'csv-to-json')!;
export const metadata: Metadata = { title: "CSV to JSON Converter \u2014 Online, In Your Browser", description: "Convert CSV to JSON online. Auto-detects delimiters, handles quotes and multi-line fields. Nothing is uploaded.", alternates: { canonical: toolHref(tool) } };
export default function Page() {
  return (<ToolLayout tool={tool} noun="data"
    howTo={["Paste CSV or open a file.", "Choose header and type options.", "Copy or download the JSON."]}
    notes={["Supports quoted fields, escaped quotes, line breaks inside quotes and a UTF-8 BOM.", "Duplicate header names get a numeric suffix (name, name_2).", "With type conversion on, values like 007 stay text so IDs are not damaged.", "Files up to 10 MB."]}
    faq={[{"q": "Does it handle Excel files?", "a": "Not yet. Save the sheet as CSV (UTF-8) first."}]}><CsvToJson /></ToolLayout>);
}
