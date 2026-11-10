import { WORDMARK_DOTS, WORDMARK_HEIGHT, WORDMARK_PATHS, WORDMARK_STROKE, WORDMARK_WIDTH } from './wordmark-data';
export const INK = '#2D3A3B';

const rad = (d: number) => (d * Math.PI) / 180;
const pt = (cx: number, cy: number, r: number, a: number) => `${(cx + r * Math.cos(rad(a))).toFixed(2)} ${(cy + r * Math.sin(rad(a))).toFixed(2)}`;
/** Annular sector (ribbon segment) between radii r..R from angle a1 to a2 (degrees, clockwise, 0 = 3 o'clock). */
function sector(cx: number, cy: number, R: number, r: number, a1: number, a2: number) {
  const large = Math.abs(a2 - a1) > 180 ? 1 : 0;
  return `M${pt(cx, cy, R, a1)}A${R} ${R} 0 ${large} 1 ${pt(cx, cy, R, a2)}L${pt(cx, cy, r, a2)}A${r} ${r} 0 ${large} 0 ${pt(cx, cy, r, a1)}Z`;
}
const LC = { x: 78, y: 72 }, RC = { x: 162, y: 72 }, RO = 56, RI = 25;
const RINGS: { id: string; c: { x: number; y: number }; a1: number; a2: number; stops: [string, string, string] }[] = [
  { id: 'g', c: LC, a1: 180, a2: 318, stops: ['#46AE81', '#7ED7AD', '#BDF5DC'] },
  { id: 'b', c: LC, a1: 38, a2: 180, stops: ['#4A8BDF', '#79B5F5', '#AAD6FF'] },
  { id: 'p', c: RC, a1: 222, a2: 360, stops: ['#E0608B', '#F78FAF', '#FFD2DE'] },
  { id: 'o', c: RC, a1: 0, a2: 142, stops: ['#FF9248', '#FFC067', '#FFE898'] },
];
/** Infinity mark: two ribbon rings (green/blue left, pink/orange right) joined by colour-blending tails. Gradient ids are fixed (identical defs when repeated). */
export function MarkArt() {
  return (
    <>
      <defs>
        {RINGS.map((g) => (
          <radialGradient key={g.id} id={`oc-r-${g.id}`} cx={g.c.x} cy={g.c.y} r={RO} gradientUnits="userSpaceOnUse">
            <stop offset={RI / RO} stopColor={g.stops[0]} /><stop offset="0.7" stopColor={g.stops[1]} /><stop offset="1" stopColor={g.stops[2]} />
          </radialGradient>
        ))}
        <linearGradient id="oc-t1" x1="96" y1="48" x2="138" y2="66" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#5DBF97" /><stop offset=".5" stopColor="#A9C9E8" /><stop offset="1" stopColor="#F27DA3" /></linearGradient>
        <linearGradient id="oc-t2" x1="98" y1="98" x2="144" y2="90" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#6FA9F2" /><stop offset=".5" stopColor="#E9B6A0" /><stop offset="1" stopColor="#FF9A4F" /></linearGradient>
        <filter id="oc-blur" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="4" /></filter>
      </defs>
      <ellipse cx="120" cy="130" rx="86" ry="6" fill="#8FA2C4" opacity=".3" filter="url(#oc-blur)" />
      {RINGS.slice(0, 2).map((g) => <path key={g.id} d={sector(g.c.x, g.c.y, RO, RI, g.a1, g.a2)} fill={`url(#oc-r-${g.id})`} />)}
      {RINGS.slice(2).map((g) => <path key={g.id} d={sector(g.c.x, g.c.y, RO, RI, g.a1, g.a2)} fill={`url(#oc-r-${g.id})`} stroke="#fff" strokeWidth="2" strokeLinejoin="round" />)}
      {/* tails crossing the centre */}
      <path d="M118 36C128 44 136 56 140 68C124 66 108 62 98 56C106 52 112 44 118 36Z" fill="url(#oc-t1)" stroke="#fff" strokeWidth="2" strokeLinejoin="round" />
      <path d="M121 108C113 102 104 94 97 86C112 88 130 92 143 88C138 98 130 104 121 108Z" fill="url(#oc-t2)" stroke="#fff" strokeWidth="2" strokeLinejoin="round" />
    </>
  );
}
export function LogoMark({ size = 48, title }: { size?: number; title?: string }) {
  return (<svg viewBox="0 0 240 140" width={size} height={(size * 140) / 240} role={title ? 'img' : undefined} aria-label={title} aria-hidden={title ? undefined : true} focusable="false"><MarkArt /></svg>);
}

export function WordmarkArt({ color = INK }: { color?: string }) {
  return (<g fill="none" stroke={color} strokeWidth={WORDMARK_STROKE} strokeLinecap="round" strokeLinejoin="round">
    {WORDMARK_PATHS.map((d, i) => <path key={i} d={d} />)}
    {WORDMARK_DOTS.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="6.5" fill={color} stroke="none" />)}</g>);
}
/** Monoline rounded wordmark "Omni Convert" drawn from strokes (no font needed). */
export function Wordmark({ height = 28, color = INK }: { height?: number; color?: string }) {
  return (<svg viewBox={`0 -2 ${WORDMARK_WIDTH} ${WORDMARK_HEIGHT}`} width={(height * WORDMARK_WIDTH) / WORDMARK_HEIGHT} height={height} aria-hidden="true" focusable="false"><WordmarkArt color={color} /></svg>);
}
/** Standalone lockups for export (stacked / horizontal), light or dark background. */
export function LogoLockup({ layout, dark = false }: { layout: 'stacked' | 'horizontal'; dark?: boolean }) {
  const ink = dark ? '#FFFFFF' : INK;
  if (layout === 'stacked') return (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 330" role="img" aria-label="OMNI CONVERT"><svg x="170" y="0" width="360" height="210" viewBox="0 0 240 140"><MarkArt /></svg><svg x="0" y="226" width="700" height="92" viewBox={`0 -2 ${WORDMARK_WIDTH} ${WORDMARK_HEIGHT}`} preserveAspectRatio="xMidYMid meet"><WordmarkArt color={ink} /></svg></svg>);
  return (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 820 140" role="img" aria-label="OMNI CONVERT"><svg x="0" y="0" width="240" height="140" viewBox="0 0 240 140"><MarkArt /></svg><svg x="262" y="30" width="548" height="80" viewBox={`0 -2 ${WORDMARK_WIDTH} ${WORDMARK_HEIGHT}`} preserveAspectRatio="xMinYMid meet"><WordmarkArt color={ink} /></svg></svg>);
}
/** Horizontal lockup used in the header. Accessible name comes from the surrounding link. */
export function Logo({ markSize = 44, textHeight = 26 }: { markSize?: number; textHeight?: number }) {
  return (<span className="logo-lockup"><LogoMark size={markSize} /><Wordmark height={textHeight} /></span>);
}
