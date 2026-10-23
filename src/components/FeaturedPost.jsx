import { Link } from 'react-router-dom'
import { formatDate, asset } from '../lib/posts.js'

export default function FeaturedPost({ post }) {
  return (
    <article className="grid md:grid-cols-5 gap-6 pb-8 border-b border-rule">
      <div className="md:col-span-3 order-2 md:order-1">
        <p className="text-sm font-semibold text-signal">{post.category}</p>
        <h2 className="mt-2 font-display text-4xl sm:text-5xl font-bold leading-[1.05] tracking-tight">
          <Link to={`/post/${post.slug}`} className="hover:underline decoration-2 underline-offset-4">
            {post.title}
          </Link>
        </h2>
        <p className="mt-4 font-display text-xl text-mute leading-snug">{post.summary}</p>
        <p className="mt-4 text-sm text-mute">
          <time dateTime={post.date}>{formatDate(post.date)}</time> · {post.minutes} min read
          {post.author && <> · {post.author}</>}
        </p>
      </div>
      {post.image && (
        <Link to={`/post/${post.slug}`} className="md:col-span-2 order-1 md:order-2">
          <img
            src={asset(post.image)}
            alt={post.imageAlt || post.title}
            fetchpriority="high"
            className="w-full h-full max-h-80 object-cover rounded-sm"
          />
        </Link>
      )}
    </article>
  )
}
