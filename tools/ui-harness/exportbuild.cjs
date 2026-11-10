const path = require('path'); const NPM = process.env.NPM_TOOLS || '/opt/npm-tools/node_modules'; const REPO = process.env.REPO || path.resolve(__dirname, '../..');
const esbuild = require(NPM + '/esbuild'); const fs = require('fs'); 
const plugin = { name: 'alias', setup(b) {
  b.onResolve({ filter: /^@\// }, (a) => { const base = path.join(REPO, a.path.slice(2)); for (const ext of ['', '.ts', '.tsx']) if (fs.existsSync(base + ext) && fs.statSync(base + ext).isFile()) return { path: base + ext }; return { errors: [{ text: 'unresolved ' + a.path }] }; }); } };
esbuild.build({ entryPoints: ['exporter.tsx'], bundle: true, outfile: 'exporter.cjs', platform: 'node', format: 'cjs', jsx: 'automatic', nodePaths: [NPM], plugins: [plugin], logLevel: 'error', define: { 'process.env.NEXT_PUBLIC_SITE_URL': '"https://example.com"' } }).then(() => console.log('ok'));
