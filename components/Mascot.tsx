import type { CategorySlug } from '@/lib/categories';
export type MascotState = 'idle' | 'dragging' | 'processing' | 'completed';
const DARK = '#2D3236', BROWN = '#8C6F66', PINK = '#F8B6C4';

/** Eyes for every state. `patch` = panda (dark patches with white highlights). */
function Eyes({ state, lx, rx, y, patch }: { state: MascotState; lx: number; rx: number; y: number; patch?: boolean }) {
  const c = patch ? '#fff' : DARK;
  const p = { fill: 'none', stroke: c, strokeWidth: 3.2, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;
  if (state === 'dragging') return (<g {...p}><path d={`M${lx - 5} ${y - 6}L${lx + 4} ${y}L${lx - 5} ${y + 6}`} /><path d={`M${rx + 5} ${y - 6}L${rx - 4} ${y}L${rx + 5} ${y + 6}`} /></g>);
  if (state === 'processing') return (<g {...p}><path d={`M${lx - 6} ${y - 2}Q${lx} ${y + 6} ${lx + 6} ${y - 2}`} /><path d={`M${rx - 6} ${y - 2}Q${rx} ${y + 6} ${rx + 6} ${y - 2}`} /></g>);
  if (state === 'completed') return (<g {...p}><path d={`M${lx - 6} ${y + 3}Q${lx} ${y - 6} ${lx + 6} ${y + 3}`} /><path d={`M${rx - 6} ${y + 3}Q${rx} ${y - 6} ${rx + 6} ${y + 3}`} /></g>);
  return patch ? (<g fill="#fff"><circle cx={lx + 2} cy={y - 5} r="4" /><circle cx={lx - 2} cy={y + 4} r="1.7" /><circle cx={rx - 2} cy={y - 5} r="4" /><circle cx={rx + 2} cy={y + 4} r="1.7" /></g>)
    : (<g><circle cx={lx} cy={y} r="5.8" fill={DARK} /><circle cx={rx} cy={y} r="5.8" fill={DARK} /><circle cx={lx + 1.8} cy={y - 2} r="1.8" fill="#fff" /><circle cx={rx + 1.8} cy={y - 2} r="1.8" fill="#fff" /></g>);
}
function OpenMouth({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (<g transform={`translate(${x} ${y}) scale(${s})`}><path d="M-11 0Q0 22 11 0Z" fill="#5A2230" stroke="#5A2230" strokeWidth="2" strokeLinejoin="round" /><ellipse cx="0" cy="11" rx="6.5" ry="4" fill="#F58BA0" /></g>);
}
const Cheeks = ({ lx, rx, y }: { lx: number; rx: number; y: number }) => (<g fill={PINK} opacity=".75"><ellipse cx={lx} cy={y} rx="9" ry="5.5" /><ellipse cx={rx} cy={y} rx="9" ry="5.5" /></g>);
const Paw = ({ x, y, fill, stroke, toes }: { x: number; y: number; fill: string; stroke: string; toes?: string }) => (<g><ellipse cx={x} cy={y} rx="17" ry="12" fill={fill} stroke={stroke} strokeWidth="2.2" />{toes && <path d={`M${x - 6} ${y - 2}v6M${x} ${y - 3}v7M${x + 6} ${y - 2}v6`} stroke={toes} strokeWidth="1.8" strokeLinecap="round" fill="none" />}</g>);
const Star = ({ x, y, r = 7, fill = '#FFD36B' }: { x: number; y: number; r?: number; fill?: string }) => (<path d={`M${x} ${y - r}Q${x} ${y} ${x + r} ${y}Q${x} ${y} ${x} ${y + r}Q${x} ${y} ${x - r} ${y}Q${x} ${y} ${x} ${y - r}Z`} fill={fill} />);

function Prop({ category, state }: { category: CategorySlug; state: MascotState }) {
  const t = state === 'dragging' ? 'rotate(12 180 56)' : undefined;
  const label = { fontFamily: 'Inter, system-ui, sans-serif', fontWeight: 800, textAnchor: 'middle' as const, fill: '#fff' };
  if (category === 'office') return (<g transform={t}><rect x="160" y="30" width="38" height="44" rx="8" fill="url(#mc-xl)" /><path d="M186 30h4a8 8 0 0 1 8 8v4h-12z" fill="#fff" opacity=".35" /><rect x="152" y="40" width="22" height="24" rx="5" fill="#2E9E6A" /><text x="163" y="58" fontSize="17" {...label}>X</text><path d="M180 52h14M180 59h14M180 66h14" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" opacity=".85" /></g>);
  if (category === 'image') return (<g transform={t}><rect x="156" y="32" width="46" height="40" rx="8" fill="#fff" stroke="#A9CDF6" strokeWidth="2.5" /><path d="M160 66l12-14 9 9 7-7 12 12z" fill="#5FA3EE" /><circle cx="188" cy="44" r="5" fill="#7ED0B0" /></g>);
  if (category === 'text') return (<g transform={t}><rect x="158" y="30" width="42" height="46" rx="9" fill="url(#mc-aa)" /><text x="179" y="61" fontSize="23" {...label}>Aa</text></g>);
  return (<g transform={t}><rect x="156" y="34" width="48" height="38" rx="9" fill="url(#mc-code)" /><text x="180" y="60" fontSize="19" {...label}>{'</>'}</text></g>);
}

/** Decorative mascots (panda=Office, shark=Image, cat=Text, bee-bug=Web & Code) in four states. SVG recreation of the approved reference art; aria-hidden, never intercepts pointer events. */
export default function Mascot({ category, state = 'idle', size = 220, showProp = true }: { category: CategorySlug; state?: MascotState; size?: number; showProp?: boolean }) {
  const open = state !== 'idle';
  const accent = { office: '#45A878', image: '#548FDC', text: '#E47791', 'web-code': '#E9AA4D' }[category];
  let body: React.ReactNode;
  if (category === 'office') body = (<>
    <circle cx="66" cy="40" r="17" fill={DARK} /><circle cx="154" cy="40" r="17" fill={DARK} />
    <ellipse cx="110" cy="80" rx="56" ry="46" fill="url(#mc-panda)" stroke="#3B4045" strokeWidth="2.4" />
    <ellipse cx="86" cy="78" rx="12" ry="15" fill={DARK} transform="rotate(18 86 78)" /><ellipse cx="134" cy="78" rx="12" ry="15" fill={DARK} transform="rotate(-18 134 78)" />
    <Eyes state={state} lx={86} rx={134} y={78} patch /><ellipse cx="110" cy="92" rx="6.5" ry="4.6" fill={DARK} />
    {open ? <OpenMouth x={110} y={97} s={0.8} /> : <path d="M110 96v3M102 100Q106 105 110 99Q114 105 118 100" fill="none" stroke={DARK} strokeWidth="2.2" strokeLinecap="round" />}
    <Cheeks lx={72} rx={148} y={94} /><Paw x={68} y={130} fill={DARK} stroke={DARK} toes="#fff" /><Paw x={152} y={130} fill={DARK} stroke={DARK} toes="#fff" /></>);
  else if (category === 'image') body = (<>
    <path d="M56 86C40 82 30 70 34 60C46 64 56 70 62 78Z" fill="#4F86D9" />
    <path d="M92 44C90 26 76 16 64 14C68 26 68 38 72 48Z" fill="#4F86D9" />
    <path d="M48 134C44 76 74 38 112 38C150 38 176 74 172 134Z" fill="url(#mc-shark)" stroke="#3F78CC" strokeWidth="2.2" />
    <path d="M64 134C62 102 82 88 112 88C142 88 160 102 158 134Z" fill="#fff" opacity=".96" />
    <Eyes state={state} lx={92} rx={130} y={78} />
    <path d="M90 98Q112 92 134 98Q112 124 90 98Z" fill="#5A2230" stroke="#5A2230" strokeWidth="2" strokeLinejoin="round" /><ellipse cx="112" cy="112" rx="10" ry="5.5" fill="#F58BA0" />
    <Cheeks lx={76} rx={148} y={100} /><Paw x={68} y={132} fill="#5B97E8" stroke="#3F78CC" /><Paw x={156} y={132} fill="#5B97E8" stroke="#3F78CC" /></>);
  else if (category === 'text') body = (<>
    <path d="M62 60L56 24Q58 18 66 22L92 40Z" fill="url(#mc-cat)" stroke={BROWN} strokeWidth="2" strokeLinejoin="round" /><path d="M66 48L64 31L82 43Z" fill="#F7B6C6" />
    <path d="M158 60L164 24Q162 18 154 22L128 40Z" fill="url(#mc-cat)" stroke={BROWN} strokeWidth="2" strokeLinejoin="round" /><path d="M154 48L156 31L138 43Z" fill="#F7B6C6" />
    <ellipse cx="110" cy="82" rx="55" ry="43" fill="url(#mc-cat)" stroke={BROWN} strokeWidth="2" />
    <ellipse cx="84" cy="56" rx="18" ry="9" fill="#F9D9C3" opacity=".85" /><ellipse cx="144" cy="60" rx="10" ry="6" fill="#F9D9C3" opacity=".7" />
    <Eyes state={state} lx={88} rx={132} y={82} /><path d="M106 91h8l-4 5z" fill="#F29BB0" />
    {open ? <OpenMouth x={110} y={96} s={0.7} /> : <path d="M110 96Q104 103 97 98M110 96Q116 103 123 98" fill="none" stroke={BROWN} strokeWidth="2" strokeLinecap="round" />}
    <path d="M60 88H42M60 95L44 101M160 88H178M160 95L176 101" stroke={BROWN} strokeWidth="1.8" strokeLinecap="round" /><Cheeks lx={72} rx={148} y={98} />
    <Paw x={68} y={130} fill="#FFF6EE" stroke={BROWN} toes={BROWN} /><Paw x={152} y={130} fill="#FFF6EE" stroke={BROWN} toes={BROWN} /></>);
  else body = (<>
    <defs><clipPath id="mc-bugclip"><circle cx="110" cy="84" r="52" /></clipPath></defs>
    <path d="M92 40Q84 24 72 16M128 40Q136 24 150 18" stroke={DARK} strokeWidth="3.6" strokeLinecap="round" fill="none" /><circle cx="71" cy="14" r="6.5" fill="#F6A63A" stroke={DARK} strokeWidth="2" /><circle cx="151" cy="16" r="6.5" fill="#F6A63A" stroke={DARK} strokeWidth="2" />
    <circle cx="110" cy="84" r="52" fill="url(#mc-bug)" stroke="#3A2E2E" strokeWidth="2.4" />
    <g clipPath="url(#mc-bugclip)"><path d="M54 62Q110 22 166 62" stroke={DARK} strokeWidth="11" fill="none" /><path d="M48 80Q110 46 172 80" stroke={DARK} strokeWidth="6" fill="none" opacity=".0" /></g>
    <ellipse cx="110" cy="94" rx="38" ry="31" fill="#FFF4E4" />
    <Eyes state={state} lx={92} rx={128} y={88} /><Cheeks lx={80} rx={140} y={102} />
    {open ? <OpenMouth x={110} y={100} s={0.65} /> : <path d="M104 101Q110 107 116 101" fill="none" stroke={DARK} strokeWidth="2.2" strokeLinecap="round" />}
    <Paw x={70} y={132} fill="#F6A63A" stroke="#3A2E2E" toes={DARK} /><Paw x={150} y={132} fill="#F6A63A" stroke="#3A2E2E" toes={DARK} /></>);
  return (
    <svg viewBox="0 0 220 150" width={size} height={(size * 150) / 220} aria-hidden="true" focusable="false" style={{ pointerEvents: 'none', overflow: 'visible' }}>
      <defs>
        <radialGradient id="mc-panda" cx=".5" cy=".35" r=".75"><stop offset="0" stopColor="#fff" /><stop offset="1" stopColor="#EDF0F2" /></radialGradient>
        <linearGradient id="mc-shark" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#9CC6F8" /><stop offset="1" stopColor="#5F9CEB" /></linearGradient>
        <radialGradient id="mc-cat" cx=".5" cy=".3" r=".8"><stop offset="0" stopColor="#FFFFFF" /><stop offset="1" stopColor="#FCEBE2" /></radialGradient>
        <linearGradient id="mc-bug" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FBBE5E" /><stop offset="1" stopColor="#F29A2C" /></linearGradient>
        <linearGradient id="mc-xl" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#5FD39F" /><stop offset="1" stopColor="#35A874" /></linearGradient>
        <linearGradient id="mc-aa" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#FFA3BA" /><stop offset="1" stopColor="#EE6F90" /></linearGradient>
        <linearGradient id="mc-code" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#FFC76B" /><stop offset="1" stopColor="#F5A02F" /></linearGradient>
      </defs>
      {state === 'dragging' && <g stroke={accent} strokeWidth="4" strokeLinecap="round" fill="none"><path d="M30 38l12 6M24 54l14 2M170 14l-6 12" /></g>}
      {state === 'processing' && <g fill="#8EC3FF"><circle cx="42" cy="34" r="6" /><circle cx="26" cy="62" r="4" /><circle cx="186" cy="30" r="5" /><circle cx="198" cy="58" r="3.5" /><circle cx="178" cy="14" r="3" /></g>}
      {state === 'completed' && (<g><Star x={34} y={40} r={8} /><Star x={22} y={72} r={6} /><Star x={190} y={28} r={9} /><Star x={204} y={60} r={5} /><circle cx="196" cy="86" r="14" fill="#46C08A" /><path d="M189 86l5 5 9-10" stroke="#fff" strokeWidth="3.4" fill="none" strokeLinecap="round" strokeLinejoin="round" /></g>)}
      {state === 'idle' && <g stroke={accent} strokeWidth="4" strokeLinecap="round" opacity=".8"><path d="M30 44l8 6" /></g>}
      {body}
      {showProp && (state === 'idle' || state === 'dragging') && <Prop category={category} state={state} />}
    </svg>
  );
}
