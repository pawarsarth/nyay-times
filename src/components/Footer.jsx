import { site } from '../site.js'

export default function Footer() {
  return (
    <footer className="border-t border-rule mt-12">
      <div className="max-w-5xl mx-auto px-5 sm:px-8 py-6 text-sm text-mute">
        <p>{site.tagline}</p>
        <p className="mt-1">© {new Date().getFullYear()} {site.title}</p>
      </div>
    </footer>
  )
}
