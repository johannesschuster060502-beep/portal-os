'use client'

import { motion } from 'framer-motion'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const changelog = [
  {
    version: '1.0.2',
    date: '2025',
    tag: 'STUDOX CORE + I18N + TAB GROUPS',
    items: [
      'STUDOX Core integration — dedicated button in the title bar with animated shimmer sweep',
      'Cyberpunk glitch transition (2 sec) when opening core.studox.eu — RGB split, data stream terminal, scanlines, violet + cyan pulse',
      'Hotkey Ctrl+Shift+S for instant STUDOX Core access',
      'Full i18n system — English + German translations (150+ keys)',
      'Time-based German greetings (GUTEN MORGEN / TAG / ABEND / NACHT)',
      'Language picker in Settings > Languages',
      'Tab Groups (Opera GX style) — 8 colors, collapse/expand, rename, context menu',
      'Chrome-style Settings page — 10 sections with sidebar nav and live search',
      'Settings: General, Appearance, Tabs, Privacy, Search, Downloads, Languages, Shortcuts, System, About',
      'New shortcuts table with 20 keyboard combinations',
      'Reset all settings to defaults with confirmation',
      'Window drag fully fixed — proper drag-region cascade, no-drag children automatic',
      'Tab bar empty space is draggable like Chrome',
      'Favicon clipping fixed — active tab indicator moved to bottom underline (animated layoutId)',
      'Status bar repositioned to true bottom, pointer-events-none, never overlaps content',
      'STUDOX Core accessible from: title bar button, omnibox action, new tab page hero, hotkey'
    ]
  },
  {
    version: '1.0.1',
    date: '2025',
    tag: 'SMOOTHNESS & CINEMATIC',
    items: [
      'Tab close is now buttery-smooth — new springQuick (700/42/0.5) for exit, layout="position" reflow, AnimatePresence popLayout mode',
      'New tab page redesigned — time-based greeting, violet radial glow behind clock, staggered entrance animations',
      'Search bar scales + glows on focus with box-shadow spring',
      'Quick links have animated diagonal shimmer on hover',
      'Status bar anchored to bottom — footer never overlaps content again',
      'Three.js scene upgraded — added torus knot with breathing scale, dual particle fields (near 8000 + far 2000), ambient violet point light, fog for depth',
      'Slow auto-drift camera — subtle cinematic breath independent of mouse',
      'Fully responsive — clamp() sizing from 900px to 5120px (4K/ultrawide)',
      'Custom Tailwind breakpoints tuned for Electron (sm:960 md:1200 lg:1600 xl:2000 2xl:2560)',
      'Landing page hero title scales from 56px to 180px responsively',
      'Navbar with mobile hamburger menu for small viewports',
      'Scroll-triggered opacity + scale parallax on hero section',
      'Sheen animation on primary download button'
    ]
  },
  {
    version: '1.0.0',
    date: '2025',
    tag: 'INITIAL RELEASE',
    items: [
      'Full Chromium-based browsing engine via Electron 33',
      'Immersive 3D new tab page with Three.js wireframe scenes and mouse parallax',
      'Cinematic boot sequence with monospace typing animation',
      'Custom dark-native UI shell — no native chrome, every pixel designed',
      'Command palette (Ctrl+K) — search tabs, history, bookmarks, and actions',
      'Tab management — create, close, reorder, mute, duplicate, context menu',
      'Bookmark system with star icon in address bar and SQLite persistence',
      'History panel (Ctrl+Y) with search and time-grouped entries',
      'Find in Page (Ctrl+F) with Chromium native search',
      'Download manager with progress tracking and auto-dismiss',
      'Per-tab zoom controls (Ctrl+/-, Ctrl+0)',
      'Configurable search engine — Google, DuckDuckGo, Brave, Bing, Kagi',
      'Settings panel — appearance, accent color, privacy, search engine config',
      'Auto-updater via GitHub Releases — seamless background updates',
      'Windows NSIS installer, macOS DMG, Linux AppImage',
      'Full keyboard shortcuts for all operations',
      'Sidebar with bookmarks and history quick access',
      'HTTPS security indicator and HTTP warnings in address bar',
      'Built-in crash recovery page',
      'All dependencies MIT/BSD/Apache-2.0 licensed — fully commercial'
    ]
  }
]

export default function ChangelogPage() {
  return (
    <>
      <Navbar />

      <main className="pt-28 pb-20 px-6 min-h-screen">
        <div className="max-w-3xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p
              className="text-[10px] tracking-[0.3em] mb-4"
              style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}
            >
              CHANGELOG
            </p>
            <h1
              className="text-3xl md:text-4xl font-extralight tracking-tight"
              style={{ color: 'var(--text-primary)' }}
            >
              What&apos;s New
            </h1>
          </motion.div>

          <div className="flex flex-col gap-8">
            {changelog.map((release, i) => (
              <motion.div
                key={release.version}
                className="relative pl-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                {/* Timeline line */}
                <div
                  className="absolute left-[11px] top-3 bottom-0 w-px"
                  style={{ background: 'var(--border-dim)' }}
                />
                {/* Timeline dot */}
                <div
                  className="absolute left-1.5 top-2 w-3 h-3 rounded-full"
                  style={{
                    background: 'var(--accent)',
                    boxShadow: '0 0 8px rgba(124,106,247,0.4)'
                  }}
                />

                <div
                  className="p-6 rounded-xl"
                  style={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-dim)'
                  }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span
                      className="text-base font-light"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      v{release.version}
                    </span>
                    <span
                      className="text-[9px] tracking-[0.15em] px-2 py-0.5 rounded-full"
                      style={{
                        background: 'var(--accent-dim)',
                        color: 'var(--accent)',
                        fontFamily: 'var(--font-mono)'
                      }}
                    >
                      {release.tag}
                    </span>
                    <span
                      className="text-[10px] ml-auto"
                      style={{ color: 'var(--text-disabled)', fontFamily: 'var(--font-mono)' }}
                    >
                      {release.date}
                    </span>
                  </div>

                  <ul className="flex flex-col gap-2">
                    {release.items.map((item, j) => (
                      <li
                        key={j}
                        className="flex items-start gap-2 text-[12px] leading-relaxed"
                        style={{ color: 'var(--text-tertiary)' }}
                      >
                        <span className="mt-1.5 shrink-0 w-1 h-1 rounded-full bg-white/15" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
