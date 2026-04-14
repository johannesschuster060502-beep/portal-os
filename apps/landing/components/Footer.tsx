import Link from 'next/link'

export default function Footer() {
  return (
    <footer
      className="border-t px-6 py-12"
      style={{ borderColor: 'var(--border-dim)', background: 'var(--bg-base)' }}
    >
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <span className="text-sm opacity-40" style={{ fontFamily: 'var(--font-mono)' }}>
            ⬡
          </span>
          <span
            className="text-[10px] tracking-[0.2em]"
            style={{ color: 'var(--text-disabled)', fontFamily: 'var(--font-mono)' }}
          >
            PORTAL OS v{process.env.NEXT_PUBLIC_VERSION || '1.0.1'}
          </span>
        </div>

        <div className="flex items-center gap-6">
          <Link
            href="/download"
            className="text-[11px] tracking-wider no-underline transition-opacity hover:opacity-60"
            style={{ color: 'var(--text-tertiary)' }}
          >
            Download
          </Link>
          <Link
            href="/changelog"
            className="text-[11px] tracking-wider no-underline transition-opacity hover:opacity-60"
            style={{ color: 'var(--text-tertiary)' }}
          >
            Changelog
          </Link>
          <a
            href="https://github.com/johannesschuster060502-beep/portal-os-releases"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] tracking-wider no-underline transition-opacity hover:opacity-60"
            style={{ color: 'var(--text-tertiary)' }}
          >
            GitHub
          </a>
        </div>

        <div
          className="text-[10px] tracking-wider"
          style={{ color: 'var(--text-disabled)', fontFamily: 'var(--font-mono)' }}
        >
          BUILT BY JOHANNESAFK (STUDOX)
        </div>
      </div>
    </footer>
  )
}
