'use client'

import Link from 'next/link'
import { useLang } from '@/context/LangContext'

export default function Footer() {
  const { t } = useLang()

  return (
    <footer
      className="border-t px-6 py-12"
      style={{ borderColor: 'var(--border-dim)', background: 'var(--bg-base)' }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Top row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-3">
            <span className="text-sm opacity-30" style={{ fontFamily: 'var(--font-mono)' }}>
              ⬡
            </span>
            <span
              className="tracking-[0.2em]"
              style={{ color: 'var(--text-disabled)', fontFamily: 'var(--font-mono)', fontSize: 'clamp(9px, 0.7vw, 10px)' }}
            >
              PORTAL OS
            </span>
            <span
              className="tracking-[0.2em]"
              style={{ color: 'rgba(124,106,247,0.4)', fontFamily: 'var(--font-mono)', fontSize: 'clamp(9px, 0.7vw, 10px)' }}
            >
              ·
            </span>
            <span
              className="tracking-[0.25em]"
              style={{ color: 'rgba(124,106,247,0.6)', fontFamily: 'var(--font-mono)', fontSize: 'clamp(9px, 0.7vw, 10px)' }}
            >
              {t.footer.tagline}
            </span>
          </div>

          <div className="flex items-center gap-6">
            <Link
              href="/download"
              className="tracking-wider no-underline transition-opacity hover:opacity-60"
              style={{ color: 'var(--text-tertiary)', fontSize: 'clamp(10px, 0.8vw, 12px)' }}
            >
              {t.footer.download}
            </Link>
            <Link
              href="/changelog"
              className="tracking-wider no-underline transition-opacity hover:opacity-60"
              style={{ color: 'var(--text-tertiary)', fontSize: 'clamp(10px, 0.8vw, 12px)' }}
            >
              {t.footer.changelog}
            </Link>
            <a
              href="https://github.com/johannesschuster060502-beep/portal-os"
              target="_blank"
              rel="noopener noreferrer"
              className="tracking-wider no-underline transition-opacity hover:opacity-60"
              style={{ color: 'var(--text-tertiary)', fontSize: 'clamp(10px, 0.8vw, 12px)' }}
            >
              GitHub
            </a>
          </div>
        </div>

        {/* Bottom row */}
        <div
          className="pt-6 flex flex-col md:flex-row items-center justify-between gap-3"
          style={{ borderTop: '1px solid var(--border-dim)' }}
        >
          <div
            className="tracking-wider"
            style={{ color: 'var(--text-disabled)', fontFamily: 'var(--font-mono)', fontSize: 'clamp(9px, 0.7vw, 10px)' }}
          >
            {t.footer.builtBy}
          </div>
          <div
            className="tracking-[0.2em]"
            style={{ color: 'var(--text-disabled)', fontFamily: 'var(--font-mono)', fontSize: 'clamp(9px, 0.7vw, 10px)' }}
          >
            v{process.env.NEXT_PUBLIC_VERSION || '1.0.4'} · MIT LICENSE · OPEN SOURCE
          </div>
        </div>
      </div>
    </footer>
  )
}
