import type { Metadata } from 'next';
import ToolLayout from '@/components/ToolLayout';
import { getTool, toolHref } from '@/lib/tools';
import TimestampConverter from './TimestampConverter';
const tool = getTool('web-code', 'timestamp-converter')!;
export const metadata: Metadata = { title: "Unix Timestamp Converter \u2014 Epoch to Date and Back", description: "Convert Unix timestamps (seconds or milliseconds) and dates to ISO, UTC and local time. Runs in your browser.", alternates: { canonical: toolHref(tool) } };
export default function Page() {
  return (<ToolLayout tool={tool} noun="text"
    howTo={["Enter a Unix timestamp or a date.", "Read all formats.", "Copy what you need."]}
    notes={["Numbers of 12 or more digits are read as milliseconds, shorter numbers as seconds.", "Dates without a time zone are interpreted in your local time zone.", "Local time uses your device time zone."]}
    faq={[{"q": "What is a Unix timestamp?", "a": "The number of seconds since 1 January 1970 00:00:00 UTC."}]}><TimestampConverter /></ToolLayout>);
}
