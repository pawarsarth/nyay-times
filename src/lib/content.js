// Pure JS, no Vite-only APIs, so the prerender script can import it too.

export function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  if (!match) return { data: {}, content: raw }
  const data = {}
  for (const line of match[1].split(/\r?\n/)) {
    const i = line.indexOf(':')
    if (i === -1) continue
    const key = line.slice(0, i).trim()
    let value = line.slice(i + 1).trim()
    if (value.startsWith('[') && value.endsWith(']')) {
      value = value.slice(1, -1).split(',').map((s) => s.trim().replace(/^["']|["']$/g, '')).filter(Boolean)
    } else if (value === 'true' || value === 'false') {
      value = value === 'true'
    } else {
      value = value.replace(/^["']|["']$/g, '')
    }
    data[key] = value
  }
  return { data, content: match[2] }
}

export const slugify = (s) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

export const truncate = (s = '', n = 160) =>
  s.length <= n ? s : s.slice(0, n - 1).replace(/\s+\S*$/, '') + '…'

export function buildPost(slug, raw) {
  const { data, content } = parseFrontmatter(raw)
  const words = content.trim().split(/\s+/).length
  return {
    slug,
    title: data.title || slug,
    date: data.date || '1970-01-01',
    updated: data.updated || null,
    category: data.category || 'General',
    summary: data.summary || '',
    description: data.description || data.summary || '',
    image: data.image || null,
    imageAlt: data.imageAlt || '',
    author: data.author || null,
    tags: data.tags || [],
    draft: data.draft === true,
    minutes: Math.max(1, Math.round(words / 220)),
    content,
  }
}

// ---- URLs ----
export const siteBase = (site) => site.url.replace(/\/+$/, '')
export const absUrl = (site, p = '') =>
  /^https?:\/\//.test(p) ? p : siteBase(site) + '/' + p.replace(/^\//, '')

// ---- Meta for each page type (used by both useSeo() and the prerender script) ----
export const homeMeta = (site) => ({
  title: `${site.title} – ${site.tagline}`,
  description: truncate(site.description),
  path: '',
  image: site.defaultImage || null,
  type: 'website',
})

export const categoryMeta = (site, name, slug) => ({
  title: `${name} news – ${site.title}`,
  description: truncate(`Latest ${name} articles and reporting from ${site.title}.`),
  path: `category/${slug}/`,
  image: site.defaultImage || null,
  type: 'website',
})

export const postMeta = (site, post) => ({
  title: `${post.title} – ${site.title}`,
  description: truncate(post.description),
  path: `post/${post.slug}/`,
  image: post.image || site.defaultImage || null,
  type: 'article',
})
