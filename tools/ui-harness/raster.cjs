const path = require('path'); const NPM = process.env.NPM_TOOLS || '/opt/npm-tools/node_modules'; const REPO = process.env.REPO || path.resolve(__dirname, '../..');
const { chromium } = require(NPM + '/playwright'); const fs = require('fs');
const R = REPO + '/public/brand';
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);
(async () => {
  const b = await chromium.launch(); const page = await b.newPage({ deviceScaleFactor: 1 });
  const render = async (svg, w, h, out, bg) => { await page.setViewportSize({ width: w, height: h }); await page.setContent(`<html><body style="margin:0;background:${bg || 'transparent'}"><div style="width:${w}px;height:${h}px;display:flex;align-items:center;justify-content:center">${svg.replace(/<svg /, `<svg style="width:100%;height:100%" `)}</div></body></html>`); await page.screenshot({ path: out, omitBackground: !bg }); };
  const dims = (svg) => { const m = svg.match(/viewBox="([-\d.]+) ([-\d.]+) ([\d.]+) ([\d.]+)"/); return [parseFloat(m[3]), parseFloat(m[4])]; };
  for (const f of walk(R).filter((p) => p.endsWith('.svg'))) {
    const svg = fs.readFileSync(f, 'utf8'); const [vw, vh] = dims(svg); const rel = path.relative(R, f);
    const w = rel.startsWith('mascots') ? 560 : rel.startsWith('stickers') ? 256 : rel.includes('stacked') ? 1400 : rel.includes('horizontal') ? 1640 : rel.includes('wordmark') ? 1280 : 600;
    const h = Math.round(w * vh / vw); const dark = rel.includes('on-dark') || rel.includes('white');
    await render(svg, w, h, f.replace(/\.svg$/, '.png'), dark ? '#28332F' : null);
  }
  // app icons
  const icon = fs.readFileSync(REPO + '/app/icon.svg', 'utf8');
  for (const s of [512, 192, 48, 32, 16]) await render(icon, s, s, `/tmp/icon-${s}.png`, null);
  const mark = fs.readFileSync(R + '/logo/logo-mark.svg', 'utf8'); const inner = mark.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
  const apple = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240"><rect width="240" height="240" fill="#fff"/><g transform="translate(18 62) scale(.85)">${inner}</g></svg>`;
  await render(apple, 180, 180, '/tmp/apple-icon.png', '#fff');
  // OG image 1200x630
  const hz = fs.readFileSync(R + '/logo/logo-horizontal.svg', 'utf8').replace('<svg ', '<svg style="width:470px;height:auto" ');
  const mascots = ['panda', 'shark', 'cat', 'bug'].map((n, i) => fs.readFileSync(`${R}/mascots/${n}-idle.svg`, 'utf8').replace('<svg ', `<svg style="width:270px;height:auto;margin-left:${i ? -64 : 0}px;position:relative;z-index:${i % 2 ? 3 : 2}" `)).join('');
  const og = `<html><body style="margin:0;width:1200px;height:630px;background:#FAFAF7;font-family:Inter,system-ui,sans-serif;position:relative;overflow:hidden">
   <div style="position:absolute;left:70px;top:56px">${hz}</div>
   <h1 style="position:absolute;left:70px;top:210px;margin:0;font-size:68px;line-height:1.08;font-weight:800;color:#28332F;letter-spacing:-1.5px">Your Everyday Tools,<br><span style="background:linear-gradient(90deg,#2F9566,#3A78CB 36%,#D2557B 68%,#C27A0A);-webkit-background-clip:text;color:transparent">All in One Place.</span></h1>
   <p style="position:absolute;left:70px;top:372px;margin:0;font-size:27px;color:#28332F;width:900px;line-height:1.3">Free tools for office files, images, text and code.</p>
   <div style="position:absolute;left:60px;right:60px;bottom:-40px;height:210px;border-radius:50%;background:radial-gradient(circle at 15% 40%,#DDF3E6 0,transparent 55%),radial-gradient(circle at 40% 50%,#DDEBFF 0,transparent 55%),radial-gradient(circle at 65% 50%,#FFE3EC 0,transparent 55%),radial-gradient(circle at 90% 40%,#FFEBCB 0,transparent 55%)"></div>
   <div style="position:absolute;left:0;right:0;bottom:6px;display:flex;justify-content:center;align-items:flex-end;padding-left:20px">${mascots}</div></body></html>`;
  await page.setViewportSize({ width: 1200, height: 630 }); await page.setContent(og); await page.screenshot({ path: '/tmp/og-image.png' });
  await b.close(); console.log('rastered');
})();
