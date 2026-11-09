/** Phase 2 foundation: client-side file validation and download helpers. Files never leave the browser here. */
export interface FileRules { maxBytes: number; extensions?: string[]; mimeTypes?: string[]; maxFiles?: number; }
export interface FileValidationError { file: string; code: 'too_large' | 'empty' | 'type_not_allowed' | 'too_many'; message: string; }
export function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  const units = ['KB', 'MB', 'GB']; let v = n / 1024, i = 0;
  while (v >= 1024 && i < units.length - 1) { v /= 1024; i++; }
  return `${v >= 10 ? Math.round(v) : Math.round(v * 10) / 10} ${units[i]}`;
}
export const getExtension = (name: string): string => { const i = name.lastIndexOf('.'); return i > 0 ? name.slice(i + 1).toLowerCase() : ''; };
export function validateFiles(files: File[], rules: FileRules): { accepted: File[]; errors: FileValidationError[] } {
  const accepted: File[] = [], errors: FileValidationError[] = [];
  for (const f of files) {
    const err = (code: FileValidationError['code'], message: string) => errors.push({ file: f.name, code, message });
    if (f.size === 0) { err('empty', 'The file is empty.'); continue; }
    if (f.size > rules.maxBytes) { err('too_large', `File is ${formatBytes(f.size)}; the limit is ${formatBytes(rules.maxBytes)}.`); continue; }
    if (rules.extensions && !rules.extensions.includes(getExtension(f.name))) { err('type_not_allowed', `Unsupported type. Allowed: ${rules.extensions.map((e) => '.' + e).join(', ')}.`); continue; }
    if (rules.mimeTypes && f.type && !rules.mimeTypes.includes(f.type)) { err('type_not_allowed', `Unsupported file type (${f.type}).`); continue; }
    if (rules.maxFiles !== undefined && accepted.length >= rules.maxFiles) { err('too_many', `Only ${rules.maxFiles} file(s) allowed.`); continue; }
    accepted.push(f);
  }
  return { accepted, errors };
}
/** Triggers a download and releases the object URL afterwards. */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
