'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { href: '/#features', label: 'Features' },
    { href: '/download', label: 'Download' },
    { href: '/changelog', label: 'Changelog' }
  ]

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(5,5,5,0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
        padding: 'clamp(14px, 1.2vw, 20px) clamp(20px, 3vw, 48px)'
      }}
    >
      <Link href="/" className="flex items-center gap-2.5 no-underline shrink-0">
        <span
          className="opacity-70"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'clamp(15px, 1.1vw, 18px)'
          }}
        >
          ⬡
        </span>
        <span
          className="tracking-[0.14em] opacity-55"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'clamp(10px, 0.75vw, 12px)'
          }}
        >
          PORTAL OS
        </span>
      </Link>

      {/* Desktop links */}
      <div className="hidden md:flex items-center gap-8">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="tracking-wider no-underline transition-opacity hover:opacity-70"
            style={{
              color: 'var(--text-secondary)',
              fontSize: 'clamp(11px, 0.85vw, 13px)'
            }}
          >
            {l.label}
          </Link>
        ))}
        <a
          href="https://github.com/johannesschuster060502-beep/portal-os-releases"
          target="_blank"
          rel="noopener noreferrer"
          className="tracking-wider no-underline transition-opacity hover:opacity-70"
          style={{
            color: 'var(--text-secondary)',
            fontSize: 'clamp(11px, 0.85vw, 13px)'
          }}
        >
          GitHub
        </a>
      </div>

      {/* Mobile: hamburger */}
      <button
        className="md:hidden flex flex-col gap-1.5 p-2"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Menu"
      >
        <span
          className="w-5 h-px transition-transform"
          style={{
            background: 'rgba(255,255,255,0.6)',
            transform: mobileOpen ? 'rotate(45deg) translate(2px, 3px)' : 'none'
          }}
        />
        <span
          className="w-5 h-px transition-opacity"
          style={{
            background: 'rgba(255,255,255,0.6)',
            opacity: mobileOpen ? 0 : 1
          }}
        />
        <span
          className="w-5 h-px transition-transform"
          style={{
            background: 'rgba(255,255,255,0.6)',
            transform: mobileOpen ? 'rotate(-45deg) translate(2px, -3px)' : 'none'
          }}
        />
      </button>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="md:hidden absolute top-full left-0 right-0 flex flex-col gap-4 p-6"
          style={{
            background: 'rgba(5,5,5,0.95)',
            backdropFilter: 'blur(16px)',
            borderBottom: '1px solid rgba(255,255,255,0.06)'
          }}
        >
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="tracking-wider no-underline"
              onClick={() => setMobileOpen(false)}
              style={{ color: 'var(--text-secondary)', fontSize: 13 }}
            >
              {l.label}
            </Link>
          ))}
          <a
            href="https://github.com/johannesschuster060502-beep/portal-os-releases"
            target="_blank"
            rel="noopener noreferrer"
            className="tracking-wider no-underline"
            style={{ color: 'var(--text-secondary)', fontSize: 13 }}
          >
            GitHub
          </a>
        </div>
      )}
    </nav>
  )
}
