'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 h-14 transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(5,5,5,0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border-dim)' : '1px solid transparent'
      }}
    >
      <Link href="/" className="flex items-center gap-2.5 no-underline">
        <span className="text-base opacity-60" style={{ fontFamily: 'var(--font-mono)' }}>
          ⬡
        </span>
        <span
          className="text-xs tracking-[0.14em] opacity-50"
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          PORTAL OS
        </span>
      </Link>

      <div className="flex items-center gap-6">
        <Link
          href="/#features"
          className="text-xs tracking-wider no-underline transition-opacity hover:opacity-70"
          style={{ color: 'var(--text-tertiary)' }}
        >
          Features
        </Link>
        <Link
          href="/download"
          className="text-xs tracking-wider no-underline transition-opacity hover:opacity-70"
          style={{ color: 'var(--text-tertiary)' }}
        >
          Download
        </Link>
        <Link
          href="/changelog"
          className="text-xs tracking-wider no-underline transition-opacity hover:opacity-70"
          style={{ color: 'var(--text-tertiary)' }}
        >
          Changelog
        </Link>
        <a
          href="https://github.com/johannesschuster060502-beep/portal-os-releases"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs tracking-wider no-underline transition-opacity hover:opacity-70"
          style={{ color: 'var(--text-tertiary)' }}
        >
          GitHub
        </a>
      </div>
    </nav>
  )
}
