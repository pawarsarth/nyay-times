import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getPost, formatDate, asset } from '../lib/posts.js'
import { postMeta, slugify } from '../lib/content.js'
import { site } from '../site.js'
import useSeo from '../hooks/useSeo.js'
import ArticleBody from '../components/ArticleBody.jsx'
import NotFound from './NotFound.jsx'

export default function Article() {
  const { slug } = useParams()
  const post = getPost(slug)

  useSeo(post ? postMeta(site, post) : { title: `Not found – ${site.title}`, noindex: true })
  useEffect(() => { window.scrollTo(0, 0) }, [slug])

  if (!post) return <NotFound />

  return (
    <article>
      <Link to="/" className="text-sm text-mute hover:text-ink">← All articles</Link>
      <header className="mt-6 max-w-3xl">
        <p className="text-sm font-semibold">
          <Link to={`/category/${slugify(post.category)}`} className="text-signal hover:underline">
            {post.category}
          </Link>
        </p>
        <h1 className="mt-2 font-display text-4xl sm:text-6xl font-bold leading-[1.05] tracking-tight">
          {post.title}
        </h1>
        {post.summary && <p className="mt-4 font-display text-xl sm:text-2xl text-mute leading-snug">{post.summary}</p>}
        <p className="mt-4 text-sm text-mute">
          {post.author && <>{post.author} · </>}
          <time dateTime={post.date}>{formatDate(post.date)}</time> · {post.minutes} min read
        </p>
      </header>

      {post.image && (
        <img
          src={asset(post.image)}
          alt={post.imageAlt || post.title}
          fetchpriority="high"
          className="mt-8 w-full max-h-[28rem] object-cover rounded-sm"
        />
      )}

      <div className="mt-8">
        <ArticleBody content={post.content} />
      </div>

      {post.tags.length > 0 && (
        <p className="mt-10 pt-4 border-t border-rule text-sm text-mute">
          Tagged: {post.tags.join(', ')}
        </p>
      )}
    </article>
  )
}
