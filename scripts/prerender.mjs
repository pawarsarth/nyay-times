// Runs after `vite build`. Writes real HTML for every page so search engines
// (and social previews) see the content without running JavaScript.
import fs from 'node:fs'
import path from 'node:path'
import { marked } from 'marked'
import { buildPost, slugify, absUrl, homeMeta, categoryMeta, postMeta } from '../src/lib/content.js'

const site = JSON.parse(fs.readFileSync('src/site.json', 'utf8'))
const { origin, pathname } = new URL(site.url)
const base = pathname.replace(/\/?$/, '/')
const dist = 'dist'

const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const jsonLd = (o) => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, '\\u003c')}</script>`
const fmt = (iso) => new Date(iso + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
const fixAssets = (src) => (src && src.startsWith('/') && !src.startsWith('//') ? base + src.slice(1) : src)

// ---- load posts ----
const dir = 'src/posts'
const posts = fs.readdirSync(dir)
  .filter((f) => f.endsWith('.md'))
  .map((f) => buildPost(f.replace(/\.md$/, ''), fs.readFileSync(path.join(dir, f), 'utf8')))
  .filter((p) => !p.draft)
  .sort((a, b) => (a.date < b.date ? 1 : -1))
const categories = [...new Set(posts.map((p) => p.category))].sort().map((name) => ({ name, slug: slugify(name) }))

// ---- template ----
const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8')

function head(meta, { noindex = false, extra = '' } = {}) {
  const url = absUrl(site, meta.path)
  const img = meta.image ? absUrl(site, meta.image) : null
  return [
    `<title>${esc(meta.title)}</title>`,
    `<meta name="description" content="${esc(meta.description)}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta name="robots" content="${noindex ? 'noindex,follow' : 'index,follow,max-image-preview:large'}" />`,
    `<link rel="alternate" type="application/rss+xml" title="${esc(site.title)}" href="${absUrl(site, 'feed.xml')}" />`,
    `<meta property="og:site_name" content="${esc(site.title)}" />`,
    `<meta property="og:locale" content="${site.locale || 'en_US'}" />`,
    `<meta property="og:type" content="${meta.type}" />`,
    `<meta property="og:title" content="${esc(meta.title)}" />`,
    `<meta property="og:description" content="${esc(meta.description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    img ? `<meta property="og:image" content="${esc(img)}" />` : '',
    `<meta name="twitter:card" content="${img ? 'summary_large_image' : 'summary'}" />`,
    site.twitter ? `<meta name="twitter:site" content="@${site.twitter.replace(/^@/, '')}" />` : '',
    extra,
  ].filter(Boolean).join('\n    ')
}

function render(meta, body, opts) {
  return template
    .replace('<html lang="en">', `<html lang="${site.language || 'en'}">`)
    .replace('<!--seo-->', head(meta, opts))
    .replace('<div id="root"></div>', `<div id="root">${body}</div>`)
}

function write(urlPath, html) {
  const file = urlPath ? path.join(dist, urlPath, 'index.html') : path.join(dist, 'index.html')
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, html)
}

const wrap = (inner) =>
  `<main class="max-w-5xl mx-auto px-5 sm:px-8 py-8">${inner}</main>`

const postList = (list) =>
  `<ul>${list.map((p) => `<li><h2><a href="${base}post/${p.slug}/">${esc(p.title)}</a></h2><p>${esc(p.summary)}</p></li>`).join('')}</ul>`

const catNav = `<nav aria-label="Categories"><a href="${base}">All</a> ${categories
  .map((c) => `<a href="${base}category/${c.slug}/">${esc(c.name)}</a>`).join(' ')}</nav>`

// ---- home ----
{
  const m = homeMeta(site)
  const ld = jsonLd({
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebSite', name: site.title, url: absUrl(site, ''), description: site.description, inLanguage: site.language || 'en' },
      { '@type': 'NewsMediaOrganization', name: site.title, url: absUrl(site, ''), ...(site.defaultImage ? { logo: absUrl(site, site.defaultImage) } : {}) },
    ],
  })
  write('', render(m, wrap(`<h1 class="sr-only">${esc(m.title)}</h1>${catNav}${postList(posts)}`), { extra: ld }))
}

// ---- categories ----
for (const c of categories) {
  const m = categoryMeta(site, c.name, c.slug)
  const list = posts.filter((p) => p.category === c.name)
  const ld = jsonLd({
    '@context': 'https://schema.org', '@type': 'CollectionPage', name: m.title, url: absUrl(site, m.path), description: m.description,
  })
  write(m.path, render(m, wrap(`<h1 class="font-display text-4xl font-bold mb-6">${esc(c.name)}</h1>${catNav}${postList(list)}`), { extra: ld }))
}

// ---- articles ----
for (const p of posts) {
  const m = postMeta(site, p)
  const url = absUrl(site, m.path)
  const html = marked.parse(p.content, { gfm: true })
    .replace(/src="(\/[^"/][^"]*)"/g, (_, s) => `src="${fixAssets(s)}"`)
    .replace(/<img /g, '<img loading="lazy" ')
  const cat = categories.find((c) => c.name === p.category)
  const ld = jsonLd([
    {
      '@context': 'https://schema.org',
      '@type': 'NewsArticle',
      headline: p.title.slice(0, 110),
      description: m.description,
      datePublished: p.date,
      dateModified: p.updated || p.date,
      articleSection: p.category,
      ...(p.tags.length ? { keywords: p.tags.join(', ') } : {}),
      ...(m.image ? { image: [absUrl(site, m.image)] } : {}),
      author: p.author ? { '@type': 'Person', name: p.author } : { '@type': 'Organization', name: site.title },
      publisher: { '@type': 'Organization', name: site.title, ...(site.defaultImage ? { logo: { '@type': 'ImageObject', url: absUrl(site, site.defaultImage) } } : {}) },
      mainEntityOfPage: { '@type': 'WebPage', '@id': url },
      inLanguage: site.language || 'en',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: absUrl(site, '') },
        { '@type': 'ListItem', position: 2, name: p.category, item: absUrl(site, `category/${cat.slug}/`) },
        { '@type': 'ListItem', position: 3, name: p.title, item: url },
      ],
    },
  ])
  const body = wrap(`<article>
    <a href="${base}">← All articles</a>
    <header>
      <p><a href="${base}category/${cat.slug}/">${esc(p.category)}</a></p>
      <h1 class="font-display text-4xl sm:text-6xl font-bold">${esc(p.title)}</h1>
      <p>${esc(p.summary)}</p>
      <p>${p.author ? esc(p.author) + ' · ' : ''}<time datetime="${p.date}">${fmt(p.date)}</time> · ${p.minutes} min read</p>
    </header>
    ${p.image ? `<img src="${fixAssets(p.image)}" alt="${esc(p.imageAlt || p.title)}" />` : ''}
    <div class="prose prose-news">${html}</div>
  </article>`)
  write(m.path, render(m, body, { extra: ld }))
}

// ---- 404 (GitHub Pages serves this for unknown URLs; React shows NotFound) ----
fs.writeFileSync(
  path.join(dist, '404.html'),
  render({ title: `Page not found – ${site.title}`, description: '', path: '', type: 'website' }, '', { noindex: true })
)

// ---- sitemap.xml ----
const urls = [
  { loc: absUrl(site, ''), lastmod: posts[0]?.updated || posts[0]?.date },
  ...categories.map((c) => ({ loc: absUrl(site, `category/${c.slug}/`), lastmod: posts.find((p) => p.category === c.name)?.date })),
  ...posts.map((p) => ({ loc: absUrl(site, `post/${p.slug}/`), lastmod: p.updated || p.date })),
]
fs.writeFileSync(
  path.join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls.map((u) => `  <url><loc>${esc(u.loc)}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}</url>`).join('\n') +
    `\n</urlset>\n`
)

// ---- robots.txt (only honoured by crawlers at a domain root) ----
fs.writeFileSync(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${absUrl(site, 'sitemap.xml')}\n`)

// ---- RSS ----
fs.writeFileSync(
  path.join(dist, 'feed.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel>
  <title>${esc(site.title)}</title>
  <link>${absUrl(site, '')}</link>
  <description>${esc(site.description)}</description>
  <language>${site.language || 'en'}</language>
  <atom:link href="${absUrl(site, 'feed.xml')}" rel="self" type="application/rss+xml" />
${posts.slice(0, 30).map((p) => `  <item>
    <title>${esc(p.title)}</title>
    <link>${absUrl(site, `post/${p.slug}/`)}</link>
    <guid isPermaLink="true">${absUrl(site, `post/${p.slug}/`)}</guid>
    <pubDate>${new Date(p.date + 'T00:00:00Z').toUTCString()}</pubDate>
    <category>${esc(p.category)}</category>
    <description>${esc(p.summary)}</description>
  </item>`).join('\n')}
</channel></rss>\n`
)

console.log(`Prerendered ${posts.length} articles, ${categories.length} categories → ${dist}/ (+ sitemap, robots, feed, 404)`)
