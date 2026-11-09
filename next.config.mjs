/** Static export: deployable to Cloudflare Pages. See project-docs/DECISIONS.md D-001. */
const nextConfig = { output: 'export', trailingSlash: true, images: { unoptimized: true } };
export default nextConfig;
