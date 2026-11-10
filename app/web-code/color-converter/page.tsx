import type { Metadata } from 'next';
import ToolLayout from '@/components/ToolLayout';
import { getTool, toolHref } from '@/lib/tools';
import ColorConverter from './ColorConverter';
const tool = getTool('web-code', 'color-converter')!;
export const metadata: Metadata = { title: "Color Converter \u2014 HEX, RGB, HSL, HSV", description: "Convert colours between HEX, RGB, HSL and HSV, with a colour picker and WCAG contrast ratios.", alternates: { canonical: toolHref(tool) } };
export default function Page() {
  return (<ToolLayout tool={tool} noun="text"
    howTo={["Type a colour or use the picker.", "Read the converted values.", "Copy the format you need."]}
    notes={["Accepts #rgb, #rrggbb, #rrggbbaa, rgb(), rgba(), hsl(), hsla() and a few basic colour names.", "Values are rounded to whole numbers, so converting back and forth can differ by 1."]}
    faq={[{"q": "What contrast do I need?", "a": "WCAG AA asks for at least 4.5:1 for normal text and 3:1 for large text."}]}><ColorConverter /></ToolLayout>);
}
