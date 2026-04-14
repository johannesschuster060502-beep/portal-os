import { useState, useEffect, memo } from 'react'

interface FaviconProps {
  url?: string
  favicon?: string
  size?: number
  className?: string
}

function FaviconInner({ url, favicon, size = 14, className = '' }: FaviconProps): JSX.Element {
  const [src, setSrc] = useState<string | null>(favicon || null)
  const [failed, setFailed] = useState(false)

  const domain = getDomain(url)
  const letter = domain ? domain[0].toUpperCase() : '?'
  const letterColor = getLetterColor(domain || '')

  useEffect(() => {
    if (favicon) {
      setSrc(favicon)
      setFailed(false)
      return
    }
    if (!domain) return

    // Try SQLite cache first
    window.portalOS.db.getCachedFavicon(domain).then((cached) => {
      if (cached) {
        setSrc(cached)
      } else {
        // Fallback to Google S2
        setSrc(`https://www.google.com/s2/favicons?domain=${domain}&sz=32`)
      }
    })
  }, [favicon, domain])

  function handleError(): void {
    setFailed(true)
  }

  // Show first-letter fallback
  if (failed || !src) {
    return (
      <div
        className={`flex items-center justify-center rounded-sm shrink-0 ${className}`}
        style={{
          width: size,
          height: size,
          background: letterColor,
          fontSize: size * 0.55,
          fontWeight: 600,
          color: '#fff',
          lineHeight: 1
        }}
      >
        {letter}
      </div>
    )
  }

  return (
    <img
      src={src}
      alt=""
      className={`rounded-sm shrink-0 ${className}`}
      style={{ width: size, height: size }}
      onError={handleError}
      loading="lazy"
    />
  )
}

// Memoize to prevent unnecessary re-renders in lists
const Favicon = memo(FaviconInner)
export default Favicon

function getDomain(url?: string): string | null {
  if (!url) return null
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return null
  }
}

function getLetterColor(domain: string): string {
  // Deterministic color from domain hash
  let hash = 0
  for (let i = 0; i < domain.length; i++) {
    hash = domain.charCodeAt(i) + ((hash << 5) - hash)
  }
  const hue = Math.abs(hash) % 360
  return `hsl(${hue}, 25%, 18%)`
}
