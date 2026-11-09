export interface SearchItem { name: string; description: string; category: string; href: string; }
/** Case-insensitive AND-search over name, description and category; name matches rank first. */
export function searchItems(query: string, items: SearchItem[], limit = 8): SearchItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const terms = q.split(/\s+/);
  const scored: { item: SearchItem; score: number }[] = [];
  for (const item of items) {
    const name = item.name.toLowerCase();
    const hay = `${name} ${item.description.toLowerCase()} ${item.category.toLowerCase()}`;
    if (!terms.every((t) => hay.includes(t))) continue;
    scored.push({ item, score: name.startsWith(q) ? 3 : name.includes(q) ? 2 : 1 });
  }
  return scored.sort((a, b) => b.score - a.score || a.item.name.localeCompare(b.item.name)).slice(0, limit).map((s) => s.item);
}
