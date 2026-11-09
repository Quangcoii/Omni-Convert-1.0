export interface TextStats { words: number; characters: number; charactersNoSpaces: number; sentences: number; paragraphs: number; readingMinutes: number; }
export function computeTextStats(text: string): TextStats {
  const trimmed = text.trim();
  const words = trimmed ? trimmed.split(/\s+/).length : 0;
  const sentences = trimmed ? (trimmed.match(/[^.!?]+[.!?]+(\s|$)|[^.!?]+$/g) ?? []).filter((s) => s.trim()).length : 0;
  const paragraphs = trimmed ? trimmed.split(/\n\s*\n/).filter((p) => p.trim()).length : 0;
  return { words, characters: [...text].length, charactersNoSpaces: [...text.replace(/\s/g, '')].length, sentences, paragraphs, readingMinutes: Math.ceil(words / 200) };
}
