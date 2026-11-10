/** PDF operations powered by pdf-lib (loaded on demand so non-PDF pages ship no PDF code). Everything runs in the browser. */
async function lib() { return import('pdf-lib'); }
export class PdfError extends Error {}
async function load(bytes: Uint8Array, name = 'file') {
  const { PDFDocument } = await lib();
  try { return await PDFDocument.load(bytes); }
  catch (e) {
    const m = e instanceof Error ? e.message : '';
    if (/encrypt/i.test(m)) throw new PdfError(`${name} is password-protected. Remove the password first.`);
    throw new PdfError(`${name} is not a valid PDF or is damaged.`);
  }
}
export async function getPageCount(bytes: Uint8Array, name?: string): Promise<number> { return (await load(bytes, name)).getPageCount(); }
/** Parses "1-3, 5, 8-" into zero-based page index groups. One group per comma-separated part. */
export function parsePageRanges(input: string, total: number): number[][] {
  const parts = input.split(',').map((s) => s.trim()).filter(Boolean);
  if (!parts.length) throw new PdfError('Enter page numbers, for example 1-3, 5.');
  return parts.map((p) => {
    const m = p.match(/^(\d+)?\s*(-)?\s*(\d+)?$/);
    if (!m || (!m[1] && !m[3])) throw new PdfError(`"${p}" is not a valid page or range.`);
    const a = m[1] ? parseInt(m[1], 10) : 1; const b = m[2] ? (m[3] ? parseInt(m[3], 10) : total) : a;
    if (a < 1 || b < 1 || a > total || b > total) throw new PdfError(`"${p}" is outside the document (1-${total}).`);
    if (a > b) throw new PdfError(`"${p}": the first page must not be after the last page.`);
    return Array.from({ length: b - a + 1 }, (_, i) => a - 1 + i);
  });
}
export async function mergePdfs(files: { name: string; bytes: Uint8Array }[]): Promise<Uint8Array> {
  const { PDFDocument } = await lib(); const out = await PDFDocument.create();
  for (const f of files) { const src = await load(f.bytes, f.name); const pages = await out.copyPages(src, src.getPageIndices()); pages.forEach((p) => out.addPage(p)); }
  return out.save();
}
export async function extractPages(bytes: Uint8Array, indices: number[], name?: string): Promise<Uint8Array> {
  const { PDFDocument } = await lib(); const src = await load(bytes, name); const out = await PDFDocument.create();
  (await out.copyPages(src, indices)).forEach((p) => out.addPage(p)); return out.save();
}
/** Rotates by a multiple of 90 degrees (added to any existing rotation). `indices` null = all pages. */
export async function rotatePages(bytes: Uint8Array, angle: 90 | 180 | 270, indices: number[] | null, name?: string): Promise<Uint8Array> {
  const { degrees } = await lib(); const doc = await load(bytes, name); const pages = doc.getPages();
  (indices ?? pages.map((_, i) => i)).forEach((i) => { const p = pages[i]; p.setRotation(degrees((((p.getRotation().angle + angle) % 360) + 360) % 360)); });
  return doc.save();
}
export type PageSize = 'fit' | 'a4' | 'letter';
const SIZES = { a4: [595.28, 841.89], letter: [612, 792] } as const;
/** Builds a PDF with one image per page. JPEG and PNG bytes are embedded as-is (no re-encoding). */
export async function imagesToPdf(images: { bytes: Uint8Array; kind: 'jpeg' | 'png' }[], opts: { pageSize: PageSize; margin: number }): Promise<Uint8Array> {
  const { PDFDocument } = await lib(); const doc = await PDFDocument.create();
  for (const im of images) {
    const img = im.kind === 'jpeg' ? await doc.embedJpg(im.bytes) : await doc.embedPng(im.bytes);
    if (opts.pageSize === 'fit') { const page = doc.addPage([img.width, img.height]); page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height }); continue; }
    const landscape = img.width > img.height; const [pw, ph] = landscape ? [SIZES[opts.pageSize][1], SIZES[opts.pageSize][0]] : SIZES[opts.pageSize];
    const page = doc.addPage([pw, ph]); const s = Math.min((pw - 2 * opts.margin) / img.width, (ph - 2 * opts.margin) / img.height, 1 * 10);
    const w = img.width * s, h = img.height * s; page.drawImage(img, { x: (pw - w) / 2, y: (ph - h) / 2, width: w, height: h });
  }
  return doc.save();
}
