import { buildPost, slugify } from './content.js'

const files = import.meta.glob('../posts/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

export const posts = Object.entries(files)
  .map(([path, raw]) => buildPost(path.split('/').pop().replace(/\.md$/, ''), raw))
  .filter((p) => !p.draft)
  .sort((a, b) => (a.date < b.date ? 1 : -1))

export const categories = [...new Set(posts.map((p) => p.category))]
  .sort()
  .map((name) => ({ name, slug: slugify(name) }))

export const getPost = (slug) => posts.find((p) => p.slug === slug)

export const formatDate = (iso) =>
  new Date(iso + 'T00:00:00').toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  })

// "/images/x.jpg" -> works under any GitHub Pages base path
export const asset = (src) =>
  src && src.startsWith('/') ? import.meta.env.BASE_URL + src.slice(1) : src
