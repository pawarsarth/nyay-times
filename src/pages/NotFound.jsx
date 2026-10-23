import { Link } from 'react-router-dom'
import { site } from '../site.js'
import useSeo from '../hooks/useSeo.js'

export default function NotFound() {
  useSeo({ title: `Page not found – ${site.title}`, noindex: true })
  return (
    <div className="py-16">
      <h1 className="font-display text-4xl font-bold">Page not found</h1>
      <p className="mt-3 text-mute">The link may be old or the article was removed.</p>
      <Link to="/" className="mt-6 inline-block text-signal underline underline-offset-4">Back to all articles</Link>
    </div>
  )
}
