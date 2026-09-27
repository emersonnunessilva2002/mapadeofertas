import fs from 'fs';
import path from 'path';

const SITE_URL = 'https://mapadepromos.space';

const postsDir = path.join(process.cwd(), 'src', 'content', 'posts');
const publicDir = path.join(process.cwd(), 'public');

fs.mkdirSync(publicDir, { recursive: true });

// Remove sitemaps individuais antigos
const oldFiles = fs.readdirSync(publicDir).filter((file) =>
  file.startsWith('sitemap-post-') ||
  file.startsWith('sitemap-categoria-') ||
  file === 'sitemap-index.xml'
);

for (const file of oldFiles) {
  fs.unlinkSync(path.join(publicDir, file));
}

// Escape básico para XML
function escapeXml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Cria um sitemap com uma única URL
function createSitemap(filename, url) {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${escapeXml(url)}</loc>
  </url>
</urlset>`;

  fs.writeFileSync(
    path.join(publicDir, filename),
    xml,
    'utf8'
  );

  return filename;
}

const sitemapFiles = [];

/*
|--------------------------------------------------------------------------
| POSTS
|--------------------------------------------------------------------------
*/

if (fs.existsSync(postsDir)) {
  const postFiles = fs
    .readdirSync(postsDir)
    .filter((file) => file.endsWith('.md'));

  for (const file of postFiles) {
    const slug = file.replace(/\.md$/, '');

    const url = `${SITE_URL}/posts/${slug}/`;

    const filename = `sitemap-post-${slug}.xml`;

    createSitemap(filename, url);

    sitemapFiles.push(filename);
  }
}

/*
|--------------------------------------------------------------------------
| CATEGORIAS
|--------------------------------------------------------------------------
|
| Coloque aqui as categorias existentes no seu site.
|
*/

const categories = [
  'fones',
  'notebooks',
  'smartphones',
];

for (const category of categories) {
  const url = `${SITE_URL}/categoria/${category}/`;

  const filename = `sitemap-categoria-${category}.xml`;

  createSitemap(filename, url);

  sitemapFiles.push(filename);
}

/*
|--------------------------------------------------------------------------
| SITEMAP INDEX
|--------------------------------------------------------------------------
*/

const sitemapIndexEntries = sitemapFiles
  .map(
    (file) => `  <sitemap>
    <loc>${SITE_URL}/${file}</loc>
  </sitemap>`
  )
  .join('\n');

const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapIndexEntries}
</sitemapindex>`;

fs.writeFileSync(
  path.join(publicDir, 'sitemap-index.xml'),
  sitemapIndex,
  'utf8'
);

console.log(`\n✓ ${sitemapFiles.length} sitemaps individuais gerados.`);
console.log('✓ sitemap-index.xml gerado.\n');