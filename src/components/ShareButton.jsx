
import { useState } from 'react'

export default function ShareButton({
  url = window.location.href,
  title = 'Check out this article!',
  description = '',
}) {
  const [copied, setCopied] = useState(false)

  const shareUrl = encodeURIComponent(url)
  const shareText = encodeURIComponent(`${title}\n${description}`)

  const shareOptions = [
    {
      name: 'WhatsApp',
      url: `https://wa.me/?text=${shareText}%20${shareUrl}`,
    },
    {
      name: 'Facebook',
      url: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
    },
    {
      name: 'X',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${shareUrl}`,
    },
    {
      name: 'LinkedIn',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`,
    },
    {
      name: 'Telegram',
      url: `https://t.me/share/url?url=${shareUrl}&text=${shareText}`,
    },
  ]

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url,
        })
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Sharing failed:', error)
        }
      }
    } else {
      await copyLink()
    }
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      window.prompt('Copy this link:', url)
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        onClick={handleShare}
        className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
      >
        ↗ Share
      </button>

      {shareOptions.map((option) => (
        <a
          key={option.name}
          href={option.url}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-2 rounded-lg border border-gray-300 text-sm hover:bg-gray-100 transition"
        >
          {option.name}
        </a>
      ))}

      <button
        onClick={copyLink}
        className="px-3 py-2 rounded-lg border border-gray-300 text-sm hover:bg-gray-100 transition"
      >
        {copied ? '✓ Copied!' : 'Copy Link'}
      </button>
    </div>
  )
}
