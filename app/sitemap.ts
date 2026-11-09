import type { MetadataRoute } from 'next';
import { CATEGORIES } from '@/lib/categories';
import { TOOLS, toolHref } from '@/lib/tools';
import { SITE_URL, STATIC_PAGES } from '@/lib/site';
export const dynamic = 'force-static';
export default function sitemap(): MetadataRoute.Sitemap {
  return [`/`, ...CATEGORIES.map((c) => `/${c.slug}/`), ...TOOLS.map(toolHref), ...STATIC_PAGES.map((p) => p.path)].map((p) => ({ url: SITE_URL + p }));
}
