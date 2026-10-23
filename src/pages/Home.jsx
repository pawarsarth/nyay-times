import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { posts, categories } from '../lib/posts.js'
import { homeMeta, categoryMeta } from '../lib/content.js'
import { site } from '../site.js'
import useSeo from '../hooks/useSeo.js'
import FeaturedPost from '../components/FeaturedPost.jsx'
import PostRow from '../components/PostRow.jsx'
import CategoryFilter from '../components/CategoryFilter.jsx'
import SearchBar from '../components/SearchBar.jsx'
import NotFound from './NotFound.jsx'

export default function Home() {
  const { cat } = useParams()
  const category = cat ? categories.find((c) => c.slug === cat) : null
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return posts.filter(
      (p) =>
        (!category || p.category === category.name) &&
        (!q || (p.title + ' ' + p.summary + ' ' + p.tags.join(' ')).toLowerCase().includes(q))
    )
  }, [category, query])

  useSeo(category ? categoryMeta(site, category.name, category.slug) : homeMeta(site))

  if (cat && !category) return <NotFound />

  const isFiltering = category || query.trim()
  const [lead, ...rest] = filtered

  return (
    <div>
      <h1 className={category ? 'font-display text-4xl font-bold mb-6' : 'sr-only'}>
        {category ? category.name : `${site.title} – ${site.tagline}`}
      </h1>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">
        <CategoryFilter categories={categories} active={category?.slug} />
        <SearchBar value={query} onChange={setQuery} />
      </div>

      {filtered.length === 0 ? (
        <p className="py-16 text-mute">No articles match. Try a different word or category.</p>
      ) : isFiltering ? (
        filtered.map((p) => <PostRow key={p.slug} post={p} />)
      ) : (
        <>
          <FeaturedPost post={lead} />
          {rest.map((p) => <PostRow key={p.slug} post={p} />)}
        </>
      )}
    </div>
  )
}
