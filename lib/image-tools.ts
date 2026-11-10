export type OutFormat = 'jpeg' | 'png' | 'webp';
export const MIME: Record<OutFormat, string> = { jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp' };
export const EXT: Record<OutFormat, string> = { jpeg: 'jpg', png: 'png', webp: 'webp' };
/** Browsers refuse or run out of memory on huge canvases; keep a conservative ceiling. */
export const MAX_PIXELS = 50_000_000;
export type SniffedFormat = OutFormat | 'gif' | 'heic' | 'unknown';
/** Detects the real image type from magic bytes (never trust the file extension). */
export function sniffImageFormat(b: Uint8Array): SniffedFormat {
  const s = (i: number, str: string) => str.split('').every((c, k) => b[i + k] === c.charCodeAt(0));
  if (b.length >= 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return 'jpeg';
  if (b.length >= 8 && b[0] === 0x89 && s(1, 'PNG') && b[4] === 0x0d && b[5] === 0x0a) return 'png';
  if (b.length >= 12 && s(0, 'RIFF') && s(8, 'WEBP')) return 'webp';
  if (b.length >= 6 && (s(0, 'GIF87a') || s(0, 'GIF89a'))) return 'gif';
  if (b.length >= 12 && s(4, 'ftyp') && ['heic', 'heix', 'mif1', 'msf1', 'hevc'].some((x) => s(8, x))) return 'heic';
  return 'unknown';
}
export const baseName = (name: string) => { const i = name.lastIndexOf('.'); return i > 0 ? name.slice(0, i) : name; };
export const outputName = (name: string, ext: string, suffix = '') => `${baseName(name)}${suffix}.${ext}`;
export type ResizeOptions = { mode: 'percent'; percent: number } | { mode: 'pixels'; width?: number; height?: number; keepAspect: boolean };
export function resizeDimensions(w: number, h: number, o: ResizeOptions): { w: number; h: number } {
  const clamp = (n: number) => Math.max(1, Math.round(n));
  if (o.mode === 'percent') { if (!(o.percent > 0)) throw new Error('Enter a percentage greater than 0.'); return { w: clamp((w * o.percent) / 100), h: clamp((h * o.percent) / 100) }; }
  const { width, height } = o;
  if (!width && !height) throw new Error('Enter a width, a height, or both.');
  if ((width !== undefined && width <= 0) || (height !== undefined && height <= 0)) throw new Error('Width and height must be greater than 0.');
  if (!o.keepAspect) return { w: clamp(width ?? w), h: clamp(height ?? h) };
  if (width && height) { const s = Math.min(width / w, height / h); return { w: clamp(w * s), h: clamp(h * s) }; }
  if (width) return { w: clamp(width), h: clamp((h * width) / w) };
  return { w: clamp((w * height!) / h), h: clamp(height!) };
}
export const percentChange = (before: number, after: number) => (before === 0 ? 0 : Math.round(((after - before) / before) * 100));
