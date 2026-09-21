/**
 * Build-time SEO. Reads the same config the app uses and bakes the head tags,
 * JSON-LD, robots.txt and sitemap.xml into the static output, so crawlers and
 * link previews get the real title/description without running JavaScript.
 *
 * Runs automatically via the `prebuild` npm lifecycle script.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as esbuild from 'esbuild';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

/* Bundle the TypeScript config + meta builder so this script consumes exactly
   the same source the app does — one config, one set of meta tags. */
const bundled = await esbuild.build({
  stdin: {
    contents: `export { config } from './src/config';\nexport { buildMeta } from './src/lib/meta';`,
    resolveDir: root,
    loader: 'ts',
  },
  bundle: true,
  write: false,
  format: 'esm',
  platform: 'node',
  target: 'node20',
});

const module = await import(
  `data:text/javascript;base64,${Buffer.from(bundled.outputFiles[0].text).toString('base64')}`
);
const meta = module.buildMeta(module.config);

const escape = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const tags = [
  `<title>${escape(meta.title)}</title>`,
  `<meta name="description" content="${escape(meta.description)}" />`,
  `<meta property="og:type" content="website" />`,
  `<meta property="og:title" content="${escape(meta.title)}" />`,
  `<meta property="og:description" content="${escape(meta.description)}" />`,
  `<meta property="og:locale" content="${escape(meta.locale)}" />`,
  meta.canonical ? `<meta property="og:url" content="${escape(meta.canonical)}" />` : '',
  meta.canonical ? `<link rel="canonical" href="${escape(meta.canonical)}" />` : '',
  meta.ogImage ? `<meta property="og:image" content="${escape(meta.ogImage)}" />` : '',
  `<meta name="twitter:card" content="${meta.ogImage ? 'summary_large_image' : 'summary'}" />`,
  `<meta name="twitter:title" content="${escape(meta.title)}" />`,
  `<meta name="twitter:description" content="${escape(meta.description)}" />`,
  meta.ogImage ? `<meta name="twitter:image" content="${escape(meta.ogImage)}" />` : '',
  `<script type="application/ld+json">${JSON.stringify(meta.jsonLd)}</script>`,
]
  .filter(Boolean)
  .map((tag) => `    ${tag}`)
  .join('\n');

const htmlPath = resolve(root, 'index.html');
const html = readFileSync(htmlPath, 'utf8');
const updated = html.replace(
  /<!-- seo:start -->[\s\S]*?<!-- seo:end -->/,
  `<!-- seo:start -->\n${tags}\n    <!-- seo:end -->`,
);
writeFileSync(htmlPath, updated);

const site = meta.canonical;
writeFileSync(
  resolve(root, 'public/robots.txt'),
  ['User-agent: *', 'Allow: /', site ? `Sitemap: ${site}/sitemap.xml` : '', ''].filter(Boolean).join('\n'),
);

if (site) {
  const today = new Date().toISOString().slice(0, 10);
  writeFileSync(
    resolve(root, 'public/sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${escape(site)}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`,
  );
}

console.log(`✓ SEO written — "${meta.title}"${site ? ` · ${site}` : ' · no siteUrl set, sitemap skipped'}`);
