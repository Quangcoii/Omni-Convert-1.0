export type CategorySlug = 'office' | 'image' | 'text' | 'web-code';
export interface Category { slug: CategorySlug; name: string; color: string; bg: string; description: string; }
export const CATEGORIES: Category[] = [
  { slug: 'office', name: 'Office', color: '#45A878', bg: '#E5F4EA', description: 'PDF, Word, Excel, PowerPoint and CSV utilities.' },
  { slug: 'image', name: 'Image', color: '#548FDC', bg: '#E7F0FC', description: 'Convert, compress and resize images.' },
  { slug: 'text', name: 'Text', color: '#E47791', bg: '#FCEAF0', description: 'Count, clean and transform text.' },
  { slug: 'web-code', name: 'Web & Code', color: '#E9AA4D', bg: '#FFF3DF', description: 'Developer and web utilities.' },
];
export const getCategory = (slug: string) => CATEGORIES.find((c) => c.slug === slug);
