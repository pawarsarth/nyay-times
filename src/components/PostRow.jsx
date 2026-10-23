import { Link } from 'react-router-dom'
import { formatDate, asset } from '../lib/posts.js'

export default function PostRow({ post }) {
  return (
    <article className="py-6 border-b border-rule grid sm:grid-cols-[8rem_1fr_auto] gap-x-6 gap-y-2">
      <div className="text-sm text-mute">
        <time dateTime={post.date}>{formatDate(post.date)}</time>
        <p className="text-signal font-medium">{post.category}</p>
      </div>
      <div>
        <h3 className="font-display text-2xl font-semibold leading-tight">
          <Link to={`/post/${post.slug}`} className="hover:underline underline-offset-4">
            {post.title}
          </Link>
        </h3>
        <p className="mt-2 text-mute">{post.summary}</p>
      </div>
      {post.image && (
        <img
          src={asset(post.image)}
          alt={post.imageAlt || post.title}
          className="hidden sm:block w-28 h-20 object-cover rounded-sm"
          loading="lazy"
          width="112"
          height="80"
        />
      )}
    </article>
  )
}
