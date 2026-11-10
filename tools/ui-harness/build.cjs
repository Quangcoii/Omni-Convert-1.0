const path = require('path'); const NPM = process.env.NPM_TOOLS || '/opt/npm-tools/node_modules'; const REPO = process.env.REPO || path.resolve(__dirname, '../..');
const esbuild = require(NPM + '/esbuild'); const fs = require('fs');

const plugin = { name: 'alias', setup(b) {
  b.onResolve({ filter: /^@\// }, (a) => { const base = path.join(REPO, a.path.slice(2)); for (const ext of ['', '.ts', '.tsx', '/index.ts', '/index.tsx']) if (fs.existsSync(base + ext) && fs.statSync(base + ext).isFile()) return { path: base + ext }; return { errors: [{ text: 'unresolved ' + a.path }] }; });
  b.onResolve({ filter: /^next\/link$/ }, () => ({ path: path.join(__dirname, 'stubs/link.tsx') }));
  b.onResolve({ filter: /^next\/navigation$/ }, () => ({ path: path.join(__dirname, 'stubs/navigation.ts') }));
} };
esbuild.build({ entryPoints: ['entry.tsx'], bundle: true, outfile: 'bundle.js', jsx: 'automatic', nodePaths: [NPM], plugins: [plugin], loader: { '.svg': 'text' },
  define: { 'process.env.NODE_ENV': '"production"', 'process.env.NEXT_PUBLIC_SITE_URL': '"https://example.com"', 'process.env.NEXT_PUBLIC_CONTACT_EMAIL': '""', 'process.env.NEXT_PUBLIC_ANALYTICS_ENABLED': '"false"', 'process.env.NEXT_PUBLIC_ADS_ENABLED': '"false"' },
  logLevel: 'info' }).then(() => {
  const css = fs.readFileSync(path.join(REPO, 'app/globals.css'), 'utf8');
  fs.writeFileSync('index.html', `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>preview</title><style>${css}</style></head><body><div id="root"></div><script src="bundle.js"></script></body></html>`);
  console.log('built');
}).catch((e) => { console.error(e.message); process.exit(1); });
