import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { LogoMark, Wordmark, LogoLockup, MarkArt } from '@/components/brand/Logo';
import Mascot from '@/components/Mascot';
import { IconTile, ICON_NAMES } from '@/components/Icons';
import { CATEGORIES } from '@/lib/categories';
const NS = 'xmlns="http://www.w3.org/2000/svg"';
const x = (el: React.ReactElement) => renderToStaticMarkup(el).replace('<svg ', `<svg ${NS} `);
const out: Record<string, string> = {};
out['logo/logo-mark.svg'] = x(<LogoMark size={240} title="OMNI CONVERT" />);
out['logo/wordmark.svg'] = x(<Wordmark height={84} />).replace('aria-hidden="true"', 'role="img" aria-label="Omni Convert"');
out['logo/wordmark-white.svg'] = x(<Wordmark height={84} color="#FFFFFF" />).replace('aria-hidden="true"', 'role="img" aria-label="Omni Convert"');
for (const l of ['stacked', 'horizontal'] as const) { out[`logo/logo-${l}.svg`] = renderToStaticMarkup(<LogoLockup layout={l} />); out[`logo/logo-${l}-on-dark.svg`] = renderToStaticMarkup(<LogoLockup layout={l} dark />); }
const NAMES: Record<string, string> = { office: 'panda', image: 'shark', text: 'cat', 'web-code': 'bug' };
for (const c of CATEGORIES) for (const s of ['idle', 'dragging', 'processing', 'completed'] as const)
  out[`mascots/${NAMES[c.slug]}-${s}.svg`] = x(<Mascot category={c.slug} state={s} size={440} />).replace('viewBox="0 0 220 150"', 'viewBox="-6 -6 232 162"').replace(/ style="[^"]*"/, '').replace('width="440" height="300"', 'width="464" height="324"');
for (const n of [...ICON_NAMES, 'aa', 'link', 'diff', 'base64', 'color', 'clock', 'hash', 'regex'] as const) out[`stickers/${n}.svg`] = x(<IconTile name={n} size={256} title={n} />);
// favicon / app icon: white rounded square with the mark centred
const icon = (bg: boolean) => `<svg ${NS} viewBox="0 0 240 240" width="240" height="240"><title>OMNI CONVERT</title>${bg ? '<rect x="4" y="4" width="232" height="232" rx="56" fill="#FFFFFF" stroke="#EAECE8" stroke-width="3"/>' : ''}<g transform="translate(14 56) scale(.9)">${renderToStaticMarkup(<MarkArt />)}</g></svg>`;
out['icon.svg'] = icon(true);
console.log(JSON.stringify(out));
