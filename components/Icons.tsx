import type { ReactNode } from 'react';

export type IconName = 'pdf' | 'word' | 'excel' | 'ppt' | 'image' | 'video' | 'text' | 'json' | 'code' | 'qr' | 'download' | 'upload' | 'aa' | 'link' | 'diff' | 'base64' | 'color' | 'clock' | 'hash' | 'regex';

export const ICON_NAMES: IconName[] = ['pdf', 'word', 'excel', 'ppt', 'image', 'video', 'text', 'json', 'code', 'qr', 'download', 'upload'];

const F = { fontFamily: 'Inter, system-ui, sans-serif', fontWeight: 800, textAnchor: 'middle' as const };

const S = (c: string, w = 4.5) => ({
  fill: 'none',
  stroke: c,
  strokeWidth: w,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const
});

const doc = (n: string, a: string, b: string, label: string, fs: number): ReactNode => (<g>
  <defs><linearGradient id={`ic-${n}-d`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={a} /><stop offset="1" stopColor={b} /></linearGradient></defs>
  <path d="M20 12h16l10 10v27a4 4 0 0 1-4 4H20a4 4 0 0 1-4-4V16a4 4 0 0 1 4-4z" fill={`url(#ic-${n}-d)`} />
  <path d="M36 12v7a3 3 0 0 0 3 3h7z" fill="#fff" opacity=".4" />
  <text x="31" y={44 + (fs > 14 ? 1 : 0)} fontSize={fs} fill="#fff" {...F}>{label}</text>
</g>);

const GLYPHS: Record<IconName, { bg: [string, string]; g: () => ReactNode }> = {
  pdf: { bg: ['#FFF3F4', '#FFE1E5'], g: () => doc('pdf', '#FF8A93', '#EF4F63', 'PDF', 10) },
  word: { bg: ['#F1F7FF', '#DDEBFF'], g: () => doc('word', '#6FB1FF', '#3B7DE6', 'W', 20) },
  excel: { bg: ['#F0FBF5', '#D9F4E6'], g: () => doc('excel', '#5FD39F', '#2FA672', 'X', 20) },
  ppt: { bg: ['#FFF7EC', '#FFE9CF'], g: () => doc('ppt', '#FFB766', '#F58A2B', 'P', 20) },
  image: { bg: ['#F1F8FF', '#DCEBFF'], g: () => (<g><rect x="14" y="16" width="36" height="32" rx="6" fill="#fff" stroke="#5FA3EE" strokeWidth="2.6" /><path d="M17 45l10-12 8 8 6-6 8 9z" fill="#5FA3EE" /><circle cx="42" cy="26" r="3.6" fill="#7ED0B0" /></g>) },
  video: { bg: ['#F6F2FF', '#E7DEFF'], g: () => (<g><rect x="13" y="18" width="38" height="28" rx="9" fill="#8B6CF0" /><path d="M28 26l12 6-12 6z" fill="#fff" /></g>) },
  text: { bg: ['#FFF3F6', '#FFE0E8'], g: () => (<g><path d="M18 20h28M32 20v26" {...S('#EE6F90', 6)} /><path d="M25 47h14" {...S('#EE6F90', 4)} /></g>) },
  json: { bg: ['#F3F5FF', '#E1E6FF'], g: () => (<g><path d="M27 17c-5 0-6 3-6 7v3c0 3-2 4-5 5 3 1 5 2 5 5v3c0 4 1 7 6 7" {...S('#5B7CF0')} /><path d="M37 17c5 0 6 3 6 7v3c0 3 2 4 5 5-3 1-5 2-5 5v3c0 4-1 7-6 7" {...S('#5B7CF0')} /></g>) },
  code: { bg: ['#FFF3F6', '#FFE0E8'], g: () => (<g><path d="M24 22L14 32l10 10M40 22l10 10-10 10M35 18l-6 28" {...S('#F0577A')} /></g>) },
  qr: { bg: ['#F3F5FF', '#E1E6FF'], g: () => (<g><rect x="14" y="14" width="15" height="15" rx="3.5" {...S('#4E5BD8', 4)} /><rect x="35" y="14" width="15" height="15" rx="3.5" {...S('#4E5BD8', 4)} /><rect x="14" y="35" width="15" height="15" rx="3.5" {...S('#4E5BD8', 4)} /><g fill="#4E5BD8"><rect x="19" y="19" width="5" height="5" rx="1" /><rect x="40" y="19" width="5" height="5" rx="1" /><rect x="19" y="40" width="5" height="5" rx="1" /><rect x="36" y="36" width="5" height="5" rx="1" /><rect x="45" y="36" width="5" height="5" rx="1" /><rect x="36" y="45" width="5" height="5" rx="1" /><rect x="45" y="45" width="5" height="5" rx="1" /></g></g>) },
  download: { bg: ['#F1F8FF', '#DCEBFF'], g: () => (<g><path d="M32 15v24M22 30l10 10 10-10M16 48h32" {...S('#4D8EE0', 5.5)} /></g>) },
  upload: { bg: ['#F6F2FF', '#E7DEFF'], g: () => (<g><path d="M22 44a8 8 0 0 1-1-16 11 11 0 0 1 21-2 9 9 0 0 1 1 18M32 50V33M26 39l6-6 6 6" {...S('#8B6CF0')} /></g>) },
  aa: { bg: ['#FFF3F6', '#FFE0E8'], g: () => <text x="32" y="42" fontSize="24" fill="#EE6F90" {...F}>Aa</text> },
  link: { bg: ['#F0FBF5', '#D9F4E6'], g: () => (<g><path d="M27 37l10-10M24 30l-3 3a7 7 0 0 0 10 10l3-3M40 34l3-3a7 7 0 0 0-10-10l-3 3" {...S('#3FA58A')} /></g>) },

  // FIX: Đưa fill="#fff" xuống sau {...S(...)} để tránh khai báo fill hai lần.
  diff: { bg: ['#F0FBF5', '#D9F4E6'], g: () => (<g><rect x="14" y="14" width="24" height="30" rx="5" {...S('#45A878', 3.6)} /><rect x="26" y="22" width="24" height="30" rx="5" {...S('#E47791', 3.6)} fill="#fff" /></g>) },

  color: { bg: ['#FFF7EC', '#FFE9CF'], g: () => (<g><circle cx="26" cy="26" r="11" fill="#F0577A" opacity=".9" /><circle cx="38" cy="26" r="11" fill="#4D8EE0" opacity=".85" /><circle cx="32" cy="38" r="11" fill="#FFC067" opacity=".9" /></g>) },
  clock: { bg: ['#F1F8FF', '#DCEBFF'], g: () => (<g><circle cx="32" cy="32" r="17" {...S('#4D8EE0', 4.5)} /><path d="M32 22v10l7 4" {...S('#4D8EE0', 4.5)} /></g>) },
  hash: { bg: ['#F6F2FF', '#E7DEFF'], g: () => <text x="32" y="43" fontSize="32" fill="#8B6CF0" {...F}>#</text> },
  regex: { bg: ['#F0FBF5', '#D9F4E6'], g: () => <text x="32" y="42" fontSize="22" fill="#2FA672" {...F}>.*</text> },
  base64: { bg: ['#F3F5FF', '#E1E6FF'], g: () => <text x="32" y="41" fontSize="23" fill="#5B7CF0" {...F}>64</text> },
};

/** Rounded sticker-style tile icon (matches the approved icon set). Decorative by default. */
export function IconTile({ name, size = 56, title }: { name: IconName; size?: number; title?: string }) {
  const { bg, g } = GLYPHS[name];

  return (<svg viewBox="0 0 64 64" width={size} height={size} role={title ? 'img' : undefined} aria-label={title} aria-hidden={title ? undefined : true} focusable="false">
    <defs>
      <linearGradient id={`ic-${name}-bg`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={bg[0]} />
        <stop offset="1" stopColor={bg[1]} />
      </linearGradient>
      <filter id="ic-ds" x="-20%" y="-20%" width="140%" height="150%">
        <feDropShadow dx="0" dy="2.5" stdDeviation="2.5" floodColor="#28332F" floodOpacity=".14" />
      </filter>
    </defs>
    <rect x="4" y="3" width="56" height="56" rx="17" fill={`url(#ic-${name}-bg)`} stroke="#fff" strokeWidth="1.6" filter="url(#ic-ds)" />
    {g()}
  </svg>);
}

export function CloudUploadIcon({ size = 56, color = 'currentColor' }: { size?: number; color?: string }) {
  return (<svg viewBox="0 0 64 64" width={size} height={size} aria-hidden="true" focusable="false" {...S(color, 3.6)}>
    <path d="M20 46a11 11 0 0 1-2-21.8 15 15 0 0 1 29 2.6A9.5 9.5 0 0 1 46 46" />
    <path d="M32 52V32M24 39l8-8 8 8" />
  </svg>);
}

export function SearchIcon({ size = 20 }: { size?: number }) {
  return (<svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" focusable="false" {...S('currentColor', 2.2)}>
    <circle cx="11" cy="11" r="7" />
    <path d="M20 20l-3.5-3.5" />
  </svg>);
}

export function ArrowRightIcon({ size = 20 }: { size?: number }) {
  return (<svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" focusable="false" {...S('currentColor', 2.2)}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>);
}

export function DownloadGlyph({ size = 20 }: { size?: number }) {
  return (<svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" focusable="false" {...S('currentColor', 2.4)}>
    <path d="M12 4v11M7 11l5 5 5-5M5 20h14" />
  </svg>);
}
