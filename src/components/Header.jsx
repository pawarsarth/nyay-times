import { Link } from 'react-router-dom'
import { site } from '../site.js'

export default function Header() {
  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
  return (
    <header className="border-b-2 border-ink">
      <div className="max-w-5xl mx-auto px-5 sm:px-8 pt-6 pb-4 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-1">
        <Link to="/" className="font-display text-4xl sm:text-5xl font-bold tracking-tight leading-none">
          {site.title}
        </Link>
        <p className="text-sm text-mute">{today}</p>
      </div>
    </header>
  )
}
