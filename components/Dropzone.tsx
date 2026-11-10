'use client';
import { useRef, useState, type HTMLAttributes } from 'react';
import Mascot from './Mascot';
import { CloudUploadIcon, DownloadGlyph } from './Icons';
import { getCategory, type CategorySlug } from '@/lib/categories';
import { FileRules, FileValidationError, validateFiles } from '@/lib/file-engine';
export type UploadState = 'idle' | 'dragging' | 'processing' | 'completed';
/** Presentational upload card (mascot peeking over a dashed box). Used by Dropzone and by the brand preview page. */
export function UploadCardView({ category, state, label = 'Drop your files here', progress = 0, onSelect, onDownload, downloadLabel = 'Download', dropProps }: {
  category: CategorySlug; state: UploadState; label?: string; progress?: number; onSelect?: () => void; onDownload?: () => void; downloadLabel?: string; dropProps?: HTMLAttributes<HTMLDivElement>;
}) {
  const cat = getCategory(category)!;
  return (<div className={`upload-card ${state}`} style={{ ['--c' as string]: cat.color, ['--cbg' as string]: cat.bg }} data-state={state} {...dropProps}>
    <div className="upload-mascot"><Mascot category={category} state={state} size={230} /></div>
    <div className="upload-box">
      {state === 'processing' ? (<div className="progress-wrap"><div className="progress" role="progressbar" aria-label="Processing" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)}><span style={{ width: `${Math.min(100, Math.max(0, progress))}%` }} /></div><b>{Math.round(progress)}%</b></div>)
        : state === 'completed' ? (<button type="button" className="btn-download" onClick={onDownload}><DownloadGlyph />{downloadLabel}</button>)
        : (<><span className="upload-icon"><CloudUploadIcon size={48} color={cat.color} /></span><p>{label}</p><button type="button" className="btn" onClick={onSelect}>Select files</button></>)}
    </div>
  </div>);
}
interface Props {
  category: CategorySlug; rules: FileRules; multiple?: boolean; onFiles: (files: File[]) => void; label?: string;
  /** Driven by the tool: 'processing' shows `progress` (0-100); 'completed' shows a Download button that calls `onDownload`. */
  status?: 'idle' | 'processing' | 'completed'; progress?: number; onDownload?: () => void; downloadLabel?: string;
}
/** Real HTML upload surface with local validation (lib/file-engine). Mascot is decorative. Not yet used by a released tool. */
export default function Dropzone({ category, rules, multiple, onFiles, label, status = 'idle', progress = 0, onDownload, downloadLabel }: Props) {
  const input = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [errors, setErrors] = useState<FileValidationError[]>([]);
  const state: UploadState = status === 'idle' ? (dragging ? 'dragging' : 'idle') : status;
  function handle(list: FileList | null) {
    const { accepted, errors: errs } = validateFiles(Array.from(list ?? []), { ...rules, maxFiles: multiple ? rules.maxFiles : 1 });
    setErrors(errs);
    if (accepted.length) onFiles(accepted);
  }
  return (<div>
    <UploadCardView category={category} state={state} label={label} progress={progress} downloadLabel={downloadLabel} onDownload={onDownload} onSelect={() => input.current?.click()}
      dropProps={{ onDragOver: (e) => { if (status !== 'idle') return; e.preventDefault(); setDragging(true); }, onDragLeave: () => setDragging(false), onDrop: (e) => { if (status !== 'idle') return; e.preventDefault(); setDragging(false); handle(e.dataTransfer.files); } }} />
    <input ref={input} type="file" hidden aria-label="Choose files" multiple={multiple} accept={rules.extensions?.map((e) => '.' + e).join(',')} onChange={(e) => { handle(e.target.files); e.target.value = ''; }} />
    {errors.length > 0 && (<ul role="alert" className="errors">{errors.map((er, i) => <li key={i}><b>{er.file}</b>: {er.message}</li>)}</ul>)}
  </div>);
}
