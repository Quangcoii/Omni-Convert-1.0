const path = require('path'); const NPM = process.env.NPM_TOOLS || '/opt/npm-tools/node_modules'; const REPO = process.env.REPO || path.resolve(__dirname, '../..');
const { chromium } = require(NPM + '/playwright');
const fs = require('fs');
const URL = (r) => `file://${__dirname}/index.html?r=${encodeURIComponent(r)}`;
const results = []; const check = (name, ok, detail = '') => { results.push({ name, ok: !!ok, detail }); };
const ROUTES = JSON.parse(fs.readFileSync(__dirname + '/routes.json','utf8'));
(async () => {
  const browser = await chromium.launch();
  const mk = async (opts) => { const ctx = await browser.newContext({ permissions: ['clipboard-read', 'clipboard-write'], acceptDownloads: true, ...opts }); const page = await ctx.newPage(); page.errs = []; page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') page.errs.push(m.text()); }); page.on('pageerror', (e) => page.errs.push('pageerror: ' + e.message)); return page; };
  const open = async (page, r) => { await page.goto(URL(r)); await page.waitForSelector('html[data-ready="1"] main h1, html[data-ready="1"] .hero h1', { timeout: 8000 }); };
  const desk = await mk({ viewport: { width: 1280, height: 800 } });
  const mob = await mk({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });

  // ---- Per-route generic checks (desktop + mobile)
  for (const r of ROUTES) for (const [label, page] of [['desktop', desk], ['mobile', mob]]) {
    page.errs.length = 0; await open(page, r);
    const info = await page.evaluate(() => {
      const unl = [...document.querySelectorAll('input:not([type=hidden]),textarea,select')].filter((el) => { const id = el.id; return !(el.getAttribute('aria-label') || el.getAttribute('aria-labelledby') || (id && document.querySelector(`label[for="${CSS.escape(id)}"]`)) || el.closest('label')); }).length;
      const ld = [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => { try { JSON.parse(s.textContent); return true; } catch { return false; } });
      return { h1: document.querySelectorAll('h1').length, unl, ldOk: ld.every(Boolean), overflow: document.documentElement.scrollWidth > window.innerWidth + 1 };
    });
    check(`[${label}] ${r} one h1`, info.h1 === 1, `h1=${info.h1}`);
    check(`[${label}] ${r} labelled controls`, info.unl === 0, `unlabelled=${info.unl}`);
    check(`[${label}] ${r} valid JSON-LD`, info.ldOk);
    check(`[${label}] ${r} no horizontal overflow`, !info.overflow);
    check(`[${label}] ${r} no console errors`, page.errs.length === 0, page.errs.join(' | ').slice(0, 200));
  }

  // ---- Home / search
  await open(desk, '/'); await desk.screenshot({ path: __dirname + '/shots/01-home-desktop.png', fullPage: true });
  await open(mob, '/'); await mob.screenshot({ path: __dirname + '/shots/02-home-mobile.png', fullPage: true });
  await open(desk, '/'); await desk.fill('.header input[type=search]', 'json');
  check('search "json" returns 3 results', (await desk.locator('.header .search-results li').count()) === 3, `n=${await desk.locator('.header .search-results li').count()}`);
  await desk.screenshot({ path: __dirname + '/shots/03-search-dropdown.png', clip: { x: 0, y: 0, width: 1280, height: 420 } });
  await desk.fill('.header input[type=search]', 'zzzz'); check('search no match message', await desk.locator('.search-empty').isVisible());
  await desk.fill('.header input[type=search]', 'json'); await desk.keyboard.press('Escape'); check('Escape clears search', (await desk.inputValue('.header input[type=search]')) === '');
  await desk.fill('.header input[type=search]', 'json'); await desk.click('.header .search-results li a'); await desk.waitForSelector('html[data-ready="1"] main h1');
  check('search click navigates to JSON Formatter', (await desk.textContent('main h1')) === 'JSON Formatter');
  await open(desk, '/'); check('4 category chips + All tools link in header', (await desk.locator('.nav a').count()) === 5 && (await desk.locator('.nav a:not(.nav-plain)').count()) === 4);
  check('hero headline text', (await desk.innerText('.hero-copy h1')).replace(/\s+/g, ' ').trim() === 'Your Everyday Tools, All in One Place.');
  await desk.fill('.hero-copy input[type=search]', 'base64'); const [rq] = await Promise.all([desk.waitForRequest(/base64-encode-decode/), desk.press('.hero-copy input[type=search]', 'Enter')]);
  check('hero search + Enter navigates to the Base64 tool URL', rq.url().includes('/web-code/base64-encode-decode/'), rq.url());
  await open(desk, '/'); check('home category cards have 4 mascots + hero group 4 mascots', (await desk.locator('.cat-card svg').count()) === 4 && (await desk.locator('.mascot-group svg').count()) === 4);
  check('home shows 12 popular tool cards', (await desk.locator('section:has(h2:text("Popular tools")) .tool-card').count()) === 12);

  // ---- Category page
  await open(desk, '/web-code/'); check('web-code category lists 10 tools', (await desk.locator('.tool-card').count()) === 10);
  await desk.screenshot({ path: __dirname + '/shots/04-category-web-code.png' });
  await open(desk, '/office/'); check('office category lists 6 real tools', (await desk.locator('.tool-card').count()) === 6);

  // ---- Word counter
  await open(desk, '/text/word-counter/');
  const sample = 'Hello world. This is a test!\n\nNew paragraph';
  await desk.fill('#wc-input', sample);
  const stat = async (page, label) => page.evaluate((l) => { const s = [...document.querySelectorAll('.stat')].find((x) => x.querySelector('span').textContent === l); return s ? s.querySelector('b').textContent : null; }, label);
  check('word counter words=8', (await stat(desk, 'Words')) === '8'); check('word counter sentences=3', (await stat(desk, 'Sentences')) === '3');
  check('word counter paragraphs=2', (await stat(desk, 'Paragraphs')) === '2'); check('word counter characters', (await stat(desk, 'Characters')) === String([...sample].length));
  await desk.screenshot({ path: __dirname + '/shots/05-word-counter.png', fullPage: true });
  await desk.click('text=Clear'); check('clear resets', (await stat(desk, 'Words')) === '0');

  // ---- Character counter
  await open(desk, '/text/character-counter/'); await desk.fill('#cc-input', 'x'.repeat(300));
  check('char counter over limit by 20', (await stat(desk, 'Over limit')) === '-20');

  // ---- Case converter + copy
  await open(desk, '/text/case-converter/'); await desk.fill('#cv-in', 'hello big world'); await desk.selectOption('#cv-mode', 'camel');
  check('case converter camel', (await desk.inputValue('#cv-out')) === 'helloBigWorld');
  await desk.selectOption('#cv-mode', 'upper'); check('case converter upper', (await desk.inputValue('#cv-out')) === 'HELLO BIG WORLD');
  await desk.click('text=Copy result'); await desk.waitForSelector('text=Copied!');
  check('copy writes clipboard', (await desk.evaluate(() => navigator.clipboard.readText())) === 'HELLO BIG WORLD');

  // ---- Text cleaner
  await open(desk, '/text/text-cleaner/'); await desk.fill('#tc-in', '  a   b \n\n a   b \nc');
  check('cleaner default (trim+collapse)', (await desk.inputValue('#tc-out')) === 'a b\n\na b\nc');
  await desk.getByLabel('Remove blank lines').check(); await desk.getByLabel('Remove duplicate lines').check(); check('cleaner blank+dupes', (await desk.inputValue('#tc-out')) === 'a b\nc');

  // ---- Text diff
  await open(desk, '/text/text-diff/'); await desk.fill('#td-a', 'a\nb\nc'); await desk.fill('#td-b', 'a\nx\nc');
  check('diff summary', (await desk.textContent('[role=status]')).includes('1 line(s) added, 1 line(s) removed'));
  check('diff markup', (await desk.locator('.diff .add').count()) === 1 && (await desk.locator('.diff .del').count()) === 1);
  await desk.screenshot({ path: __dirname + '/shots/07-text-diff.png', fullPage: true });

  // ---- JSON formatter
  await open(desk, '/web-code/json-formatter/'); await desk.fill('#jf-in', '{\n  "name": "OMNI",\n  "tools": [1, 2,],\n}');
  const err = (await desk.textContent('.errors')) ?? ''; check('json formatter shows error with line/col', /line 3, column 18/.test(err), err);
  check('json formatter output empty on error', (await desk.inputValue('#jf-out')) === '');
  await desk.screenshot({ path: __dirname + '/shots/06-json-formatter-error.png', fullPage: true });
  await desk.fill('#jf-in', '{"a":[1,2],"b":{"c":null}}');
  check('json formatter pretty 2sp', (await desk.inputValue('#jf-out')) === JSON.stringify({ a: [1, 2], b: { c: null } }, null, 2));
  await desk.selectOption('#jf-fmt', '3'); check('json formatter minify', (await desk.inputValue('#jf-out')) === '{"a":[1,2],"b":{"c":null}}');
  await desk.selectOption('#jf-fmt', '2'); check('json formatter tab', (await desk.inputValue('#jf-out')).includes('\n\t"a"'));
  const [dl] = await Promise.all([desk.waitForEvent('download'), desk.click('text=Download .json')]);
  const dlPath = await dl.path(); check('json download filename', dl.suggestedFilename() === 'formatted.json'); check('json download content valid', (() => { try { JSON.parse(fs.readFileSync(dlPath, 'utf8')); return true; } catch { return false; } })());
  // mobile screenshot of this tool filled
  await open(mob, '/web-code/json-formatter/'); await mob.fill('#jf-in', '{"name":"OMNI CONVERT","tools":[1,2,3],"private":true}'); await mob.screenshot({ path: __dirname + '/shots/09-json-formatter-mobile.png', fullPage: true });

  // ---- JSON validator
  await open(desk, '/web-code/json-validator/'); await desk.fill('#jv-in', '{"a":[1,"x",null,true],"b":{"c":2}}');
  check('json validator valid badge', await desk.locator('.badge.valid').isVisible()); check('json validator depth=2', (await stat(desk, 'Max depth')) === '2'); check('json validator keys=3', (await stat(desk, 'Keys')) === '3');
  await desk.fill('#jv-in', "{'a':1}"); check('json validator invalid badge + location', (await desk.textContent('[role=status]')).includes('line 1, column 2'));

  // ---- Base64
  await open(desk, '/web-code/base64-encode-decode/'); const txt = 'Xin chào 🌏 日本語'; await desk.fill('#b64-in', txt);
  const enc = Buffer.from(txt).toString('base64'); check('base64 encode utf-8', (await desk.inputValue('#b64-out')) === enc);
  await desk.getByLabel('URL-safe').check(); check('base64 url-safe has no +/=', !/[+/=]/.test(await desk.inputValue('#b64-out')));
  await desk.getByLabel('Decode').check(); await desk.fill('#b64-in', enc); check('base64 decode roundtrip', (await desk.inputValue('#b64-out')) === txt);
  await desk.fill('#b64-in', '@@@'); check('base64 invalid shows alert', await desk.locator('[role=alert]').isVisible());

  // ---- URL tool
  await open(desk, '/web-code/url-encode-decode/'); await desk.fill('#url-in', 'a b&c=d');
  check('url encode component', (await desk.inputValue('#url-out')) === 'a%20b%26c%3Dd');
  await desk.selectOption('#url-mode', 'full'); check('url encode full keeps &=', (await desk.inputValue('#url-out')) === 'a%20b&c=d');
  await desk.getByLabel('Decode').check(); await desk.fill('#url-in', '100%'); check('url decode malformed alert', await desk.locator('[role=alert]').isVisible());

  // ---- Upload card on a real tool
  await open(desk, '/image/png-to-jpg/'); check('upload card mascot ignores pointer events', (await desk.evaluate(() => getComputedStyle(document.querySelector('.upload-mascot svg')).pointerEvents)) === 'none');
  const [fc] = await Promise.all([desk.waitForEvent('filechooser'), desk.click('button:has-text("Select files")')]); check('Select files opens the file chooser', !!fc);
  const dt = await desk.evaluateHandle(() => { const d = new DataTransfer(); d.items.add(new File([new Uint8Array(10)], 'x.exe')); return d; }); await desk.dispatchEvent('.upload-card', 'drop', { dataTransfer: dt });
  check('drag-and-drop validates files', /Unsupported type/.test(await desk.locator('.errors').innerText()));
  // ---- Brand page
  await open(desk, '/brand/');
  check('brand: 16 mascots, 20 icons, 8 swatches', (await desk.locator('.brand-cell svg').count()) === 16 && (await desk.locator('.icon-cell svg').count()) === 20 && (await desk.locator('.swatch').count()) === 8);
  check('brand: processing card shows 68% progressbar', (await desk.getAttribute('.upload-card.processing [role=progressbar]', 'aria-valuenow')) === '68');
  check('brand: completed card has Download button', await desk.locator('.upload-card.completed .btn-download').isVisible());
  check('brand: dragging card present', (await desk.locator('.upload-card.dragging').count()) === 1);
  check('brand page is noindex-only content (no nav link)', (await desk.locator('a[href*="brand"]').count()) === 0);
  await desk.screenshot({ path: __dirname + '/shots/11-brand-sheet.png', fullPage: true });
  await desk.locator('.upload-grid').screenshot({ path: __dirname + '/shots/12-upload-states.png' });
  await open(desk, '/tools/'); check('all-tools lists 31 tool cards', (await desk.locator('.tool-card').count()) === 31);
  await desk.screenshot({ path: __dirname + '/shots/13-all-tools.png', fullPage: true });
  // ---- Other screenshots
  await open(desk, '/privacy/'); await desk.screenshot({ path: __dirname + '/shots/10-privacy.png' });
  await open(desk, '/nope/'); check('404 page content', (await desk.textContent('main')).includes('Page not found'));

  await browser.close();
  const pass = results.filter((r) => r.ok).length;
  fs.writeFileSync(__dirname + '/results.json', JSON.stringify(results, null, 1));
  console.log(`PASS ${pass}/${results.length}`);
  results.filter((r) => !r.ok).forEach((r) => console.log('FAIL:', r.name, '|', r.detail));
})().catch((e) => { console.error('RUNNER ERROR', e); process.exit(1); });
