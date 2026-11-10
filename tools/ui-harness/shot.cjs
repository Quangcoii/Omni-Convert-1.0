const path = require('path'); const NPM = process.env.NPM_TOOLS || '/opt/npm-tools/node_modules'; const REPO = process.env.REPO || path.resolve(__dirname, '../..');
const { chromium } = require(NPM + '/playwright');
(async()=>{const [,, route, out, w='1000', h='800', full='0', scale='1']=process.argv;
const b=await chromium.launch();const p=await b.newPage({viewport:{width:+w,height:+h},deviceScaleFactor:+scale});
const errs=[];p.on('console',m=>{if(['error','warning'].includes(m.type()))errs.push(m.text())});p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://${__dirname}/index.html?r='+encodeURIComponent(route));await p.waitForSelector('html[data-ready="1"]',{state:'attached'});
await p.screenshot({path:out,fullPage:full==='1'});console.log('errors:',errs.length?errs.join('|'):'none');await b.close();})();
