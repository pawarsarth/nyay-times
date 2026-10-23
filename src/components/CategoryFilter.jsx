import { Link } from 'react-router-dom'

export default function CategoryFilter({ categories, active }) {
  const items = [{ name: 'All', slug: '' }, ...categories]
  return (
    <nav aria-label="Categories" className="flex flex-wrap gap-2">
      {items.map((c) => {
        const on = (active || '') === c.slug
        return (
          <Link
            key={c.slug || 'all'}
            to={c.slug ? `/category/${c.slug}` : '/'}
            aria-current={on ? 'page' : undefined}
            className={
              'px-3 py-1 text-sm rounded-sm border transition-colors ' +
              (on ? 'bg-ink text-paper border-ink' : 'border-rule text-mute hover:border-ink hover:text-ink')
            }
          >
            {c.name}
          </Link>
        )
      })}
    </nav>
  )
}
