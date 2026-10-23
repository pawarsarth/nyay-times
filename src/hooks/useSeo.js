import { useEffect } from 'react'
import { site } from '../site.js'
import { absUrl } from '../lib/content.js'

function upsert(selector, create, attrs) {
  let el = document.head.querySelector(selector)
  if (!el) {
    el = document.createElement(create)
    document.head.appendChild(el)
  }
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v))
}

export default function useSeo({ title, description, path = '', image, type = 'website', noindex = false }) {
  useEffect(() => {
    const url = absUrl(site, path)
    document.title = title
    upsert('meta[name="description"]', 'meta', { name: 'description', content: description || '' })
    upsert('link[rel="canonical"]', 'link', { rel: 'canonical', href: url })
    upsert('meta[name="robots"]', 'meta', { name: 'robots', content: noindex ? 'noindex,follow' : 'index,follow,max-image-preview:large' })
    upsert('meta[property="og:title"]', 'meta', { property: 'og:title', content: title })
    upsert('meta[property="og:description"]', 'meta', { property: 'og:description', content: description || '' })
    upsert('meta[property="og:url"]', 'meta', { property: 'og:url', content: url })
    upsert('meta[property="og:type"]', 'meta', { property: 'og:type', content: type })
    if (image) upsert('meta[property="og:image"]', 'meta', { property: 'og:image', content: absUrl(site, image) })
  }, [title, description, path, image, type, noindex])
}
