import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { asset } from '../lib/posts.js'

export default function ArticleBody({ content }) {
  return (
    <div className="prose prose-news">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          img: ({ src, alt }) => <img src={asset(src)} alt={alt || ''} loading="lazy" />,
          a: ({ href, children }) => (
            <a href={href} target={href?.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
