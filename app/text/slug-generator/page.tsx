import type { Metadata } from 'next';
import ToolLayout from '@/components/ToolLayout';
import { getTool, toolHref } from '@/lib/tools';
import SlugGenerator from './SlugGenerator';
const tool = getTool('text', 'slug-generator')!;
export const metadata: Metadata = { title: "Slug Generator \u2014 Create URL Slugs From Text", description: "Create clean URL slugs from titles online. Removes accents (including Vietnamese), lowercases, runs in your browser.", alternates: { canonical: toolHref(tool) } };
export default function Page() {
  return (<ToolLayout tool={tool} noun="text"
    howTo={["Type or paste titles, one per line.", "Choose separator and length.", "Copy the slugs."]}
    notes={["Accents are removed (\u00e9\u2192e, \u0111\u2192d). Characters outside A-Z and 0-9 are treated as separators.", "Non-Latin scripts such as Japanese are dropped, so such titles may produce an empty slug."]}
    faq={[{"q": "Hyphen or underscore?", "a": "Hyphens are the usual choice for URLs and are treated as word separators by search engines."}]}><SlugGenerator /></ToolLayout>);
}
