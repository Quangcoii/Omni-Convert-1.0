import type { CategorySlug } from '@/lib/categories';
/** TEMPORARY simple 2D line-art mascots (Panda/Shark/Cat/Bug). Not the official art. Decorative only (aria-hidden, no pointer events). */
export default function Mascot({ category, color, bg, size = 96 }: { category: CategorySlug; color: string; bg: string; size?: number }) {
  const W = '#fff';
  const art = {
    office: (<><circle cx="28" cy="28" r="9" fill={color} /><circle cx="68" cy="28" r="9" fill={color} /><circle cx="48" cy="52" r="28" fill={W} />
      <ellipse cx="37" cy="48" rx="6" ry="8" fill={color} transform="rotate(20 37 48)" /><ellipse cx="59" cy="48" rx="6" ry="8" fill={color} transform="rotate(-20 59 48)" />
      <circle cx="37" cy="49" r="1.8" fill={W} stroke="none" /><circle cx="59" cy="49" r="1.8" fill={W} stroke="none" /><ellipse cx="48" cy="60" rx="4" ry="3" fill={color} /><path d="M42 67q6 5 12 0" /></>),
    image: (<><path d="M44 38L54 16L63 42" fill={bg} /><path d="M10 54C24 30 60 28 80 48L90 36V66L80 56C60 76 24 74 10 54Z" fill={bg} />
      <circle cx="27" cy="50" r="2.2" fill={color} stroke="none" /><path d="M12 59Q22 63 33 59" /><path d="M40 48q3 6 0 12M47 47q3 6 0 12" /></>),
    text: (<><path d="M24 46L26 18L44 32Z" fill={bg} /><path d="M72 46L70 18L52 32Z" fill={bg} /><circle cx="48" cy="55" r="26" fill={W} />
      <circle cx="38" cy="52" r="2.4" fill={color} stroke="none" /><circle cx="58" cy="52" r="2.4" fill={color} stroke="none" /><path d="M45 59h6l-3 3.5z" fill={color} />
      <path d="M48 63q-3 5-8 3M48 63q3 5 8 3" /><path d="M22 56h11M23 63l10-3M74 56H63M73 63l-10-3" /></>),
    'web-code': (<><path d="M30 46L16 38M28 58H12M30 70L16 78M66 46L80 38M68 58H84M66 70L80 78M42 20L36 11M54 20L60 11" /><ellipse cx="48" cy="58" rx="20" ry="24" fill={W} />
      <circle cx="48" cy="31" r="11" fill={W} /><path d="M48 42V82" /><circle cx="38" cy="56" r="3" fill={color} /><circle cx="58" cy="56" r="3" fill={color} /><circle cx="39" cy="70" r="2.6" fill={color} /><circle cx="57" cy="70" r="2.6" fill={color} />
      <circle cx="44" cy="31" r="1.8" fill={color} stroke="none" /><circle cx="52" cy="31" r="1.8" fill={color} stroke="none" /></>),
  }[category];
  return (<svg viewBox="0 0 96 96" width={size} height={size} aria-hidden="true" focusable="false" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ pointerEvents: 'none', flexShrink: 0 }}>{art}</svg>);
}
