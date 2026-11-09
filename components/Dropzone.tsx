'use client';
import { useRef, useState } from 'react';
import Mascot from './Mascot';
import { getCategory, type CategorySlug } from '@/lib/categories';
import { FileRules, FileValidationError, validateFiles } from '@/lib/file-engine';
interface Props { category: CategorySlug; rules: FileRules; multiple?: boolean; onFiles: (files: File[]) => void; label?: string; }
/** Real HTML drop surface with validation. The mascot is decorative and never intercepts events. Not yet used by a released tool. */
export default function Dropzone({ category, rules, multiple, onFiles, label = 'Drop files here' }: Props) {
  const cat = getCategory(category)!;
  const input = useRef<HTMLInputElement>(null);
  const [active, setActive] = useState(false);
  const [errors, setErrors] = useState<FileValidationError[]>([]);
  function handle(list: FileList | null) {
    const { accepted, errors: errs } = validateFiles(Array.from(list ?? []), { ...rules, maxFiles: multiple ? rules.maxFiles : 1 });
    setErrors(errs);
    if (accepted.length) onFiles(accepted);
  }
  return (<div>
    <div className={`dropzone${active ? ' active' : ''}`} style={{ ['--c' as string]: cat.color, ['--cbg' as string]: cat.bg }}
      onDragOver={(e) => { e.preventDefault(); setActive(true); }} onDragLeave={() => setActive(false)}
      onDrop={(e) => { e.preventDefault(); setActive(false); handle(e.dataTransfer.files); }}>
      <Mascot category={category} color={cat.color} bg={cat.bg} />
      <p>{label}</p>
      <button type="button" className="btn" onClick={() => input.current?.click()}>Select files</button>
      <input ref={input} type="file" hidden multiple={multiple} accept={rules.extensions?.map((e) => '.' + e).join(',')}
        onChange={(e) => { handle(e.target.files); e.target.value = ''; }} />
    </div>
    {errors.length > 0 && (<ul role="alert" className="errors">{errors.map((er, i) => <li key={i}><b>{er.file}</b>: {er.message}</li>)}</ul>)}
  </div>);
}
