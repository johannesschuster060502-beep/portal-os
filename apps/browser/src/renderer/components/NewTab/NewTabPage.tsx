import { useState, useEffect, KeyboardEvent } from 'react'
import { motion } from 'framer-motion'
import { MagnifyingGlass, Lightning } from '@phosphor-icons/react'
import { useTabsStore } from '@store/tabs.store'
import { useI18nStore } from '@store/i18n.store'
import { useUIStore } from '@store/ui.store'
import { springSnappy } from '@lib/motion'
import ThreeScene from './ThreeScene'

/**
 * Portal OS — New Tab Page
 *
 * Fully i18n-aware (DE/EN). Responsive clamp() sizing.
 * Status bar is anchored to the TRUE bottom of the viewport via fixed layout.
 * STUDOX Core is prominent as one of the quick links AND with a dedicated
 * CTA button that triggers the cyberpunk glitch transition.
 */

const quickLinks = [
  { label: 'GOOGLE', url: 'https://google.com', icon: 'G' },
  { label: 'GITHUB', url: 'https://github.com', icon: '⬡' },
  { label: 'YOUTUBE', url: 'https://youtube.com', icon: '▶' },
  { label: 'TWITTER', url: 'https://x.com', icon: '𝕏' },
  { label: 'REDDIT', url: 'https://reddit.com', icon: 'r/' }
]

function staggerDelay(i: number): number {
  return 0.15 + i * 0.08
}

export default function NewTabPage(): JSX.Element {
  const [now, setNow] = useState(new Date())
  const [searchValue, setSearchValue] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)
  const navigateTo = useTabsStore((s) => s.navigateTo)
  const t = useI18nStore((s) => s.t)
  const locale = useI18nStore((s) => s.locale)
  const openStudoxCore = useUIStore((s) => s.openStudoxCore)

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  function handleSearch(e: KeyboardEvent<HTMLInputElement>): void {
    if (e.key === 'Enter' && searchValue.trim()) {
      navigateTo(searchValue.trim())
    }
  }

  const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
  const date = now
    .toLocaleDateString(locale === 'de' ? 'de-DE' : 'en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
    .toUpperCase()
  const greeting = getGreeting(now.getHours(), t)
  const version = window.portalOS.versions.app

  return (
    <div className="relative flex-1 flex flex-col overflow-hidden">
      {/* Three.js ambient background */}
      <ThreeScene />

      {/* Radial center glow */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 42%, rgba(124,106,247,0.06) 0%, rgba(0,0,0,0) 70%)'
        }}
      />

      {/* Top vignette for depth */}
      <div
        className="absolute top-0 left-0 right-0 h-32 pointer-events-none z-[1]"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0) 100%)'
        }}
      />

      {/* Bottom vignette for status bar legibility */}
      <div
        className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none z-[1]"
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 100%)'
        }}
      />

      {/* Main content — flex-grow so status bar can sit at true bottom */}
      <div
        className="relative z-10 flex-1 flex flex-col items-center justify-center min-h-0"
        style={{
          padding: 'clamp(24px, 4vw, 64px)',
          paddingBottom: 'clamp(56px, 7vh, 96px)'
        }}
      >
        <div
          className="flex flex-col items-center w-full"
          style={{
            gap: 'clamp(20px, 3vw, 40px)',
            maxWidth: 'min(760px, 92vw)'
          }}
        >
          {/* Greeting */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: staggerDelay(0), ease: [0.16, 1, 0.3, 1] }}
            className="tracking-[0.3em] text-center"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'clamp(9px, 0.8vw, 11px)',
              color: 'var(--text-disabled)'
            }}
          >
            {greeting}
          </motion.div>

          {/* Clock */}
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.9, delay: staggerDelay(1), ease: [0.16, 1, 0.3, 1] }}
            className="relative text-center select-none"
          >
            <div
              aria-hidden
              className="absolute inset-0 -z-0 blur-3xl opacity-50 pointer-events-none"
              style={{
                background:
                  'radial-gradient(circle at center, rgba(124,106,247,0.2) 0%, rgba(124,106,247,0) 60%)'
              }}
            />
            <div
              className="relative font-extralight leading-none"
              style={{
                fontSize: 'clamp(64px, 8vw, 128px)',
                color: 'rgba(255,255,255,0.94)',
                fontFamily: 'var(--font-display)',
                letterSpacing: '-0.04em',
                textShadow: '0 0 60px rgba(124,106,247,0.14)'
              }}
            >
              {time}
            </div>
            <div
              className="relative mt-3 tracking-[0.22em]"
              style={{
                fontSize: 'clamp(10px, 0.85vw, 12px)',
                color: 'var(--text-tertiary)',
                fontFamily: 'var(--font-mono)'
              }}
            >
              {date}
            </div>
          </motion.div>

          {/* Search bar */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: staggerDelay(2), ease: [0.16, 1, 0.3, 1] }}
            className="w-full"
            style={{ maxWidth: 'min(560px, 90vw)' }}
          >
            <motion.div
              className="flex items-center rounded-full"
              animate={{
                scale: searchFocused ? 1.02 : 1,
                boxShadow: searchFocused
                  ? '0 0 0 1px rgba(124,106,247,0.55), 0 0 0 6px rgba(124,106,247,0.08), 0 20px 60px rgba(0,0,0,0.5)'
                  : '0 0 0 1px rgba(255,255,255,0.06), 0 0 0 0 rgba(124,106,247,0), 0 8px 32px rgba(0,0,0,0.3)'
              }}
              transition={springSnappy}
              style={{
                background: 'var(--glass-bg)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                height: 'clamp(48px, 5vw, 60px)',
                padding: '0 clamp(18px, 2vw, 24px)',
                gap: 'clamp(10px, 1.2vw, 14px)'
              }}
            >
              <MagnifyingGlass className="opacity-30 shrink-0" size={17} />
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={handleSearch}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                placeholder={t.newtab.searchPlaceholder}
                className="flex-1 bg-transparent border-none outline-none text-white/85 placeholder:text-white/25"
                style={{
                  fontFamily: 'var(--font-ui)',
                  caretColor: 'var(--accent)',
                  fontSize: 'clamp(13px, 1vw, 15px)'
                }}
                spellCheck={false}
                autoComplete="off"
                aria-label={t.newtab.searchPlaceholder}
              />
              <span
                className="shrink-0 px-2 py-0.5 rounded opacity-25"
                style={{
                  border: '1px solid var(--border-subtle)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'clamp(9px, 0.7vw, 10px)',
                  color: 'var(--text-secondary)'
                }}
              >
                ⏎
              </span>
            </motion.div>
          </motion.div>

          {/* Quick links + STUDOX CORE CTA */}
          <div
            className="flex flex-wrap justify-center items-start"
            style={{
              gap: 'clamp(10px, 1.5vw, 18px)',
              marginTop: 'clamp(8px, 1vw, 16px)'
            }}
          >
            {/* STUDOX Core — hero button */}
            <motion.button
              onClick={openStudoxCore}
              initial={{ opacity: 0, y: 10, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: 0.55,
                delay: staggerDelay(3),
                ease: [0.16, 1, 0.3, 1]
              }}
              whileHover={{ y: -4, scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              className="flex flex-col items-center group relative"
              style={{
                width: 'clamp(58px, 5.5vw, 74px)',
                gap: 'clamp(6px, 0.6vw, 8px)'
              }}
              aria-label={t.studox.coreButtonLabel}
            >
              <motion.div
                className="flex items-center justify-center rounded-2xl overflow-hidden relative"
                style={{
                  width: 'clamp(44px, 4vw, 54px)',
                  height: 'clamp(44px, 4vw, 54px)',
                  background: 'linear-gradient(135deg, rgba(124,106,247,0.22) 0%, rgba(124,106,247,0.08) 100%)',
                  border: '1px solid rgba(124,106,247,0.4)',
                  boxShadow:
                    '0 0 0 1px rgba(124,106,247,0.1), 0 12px 40px rgba(124,106,247,0.2)',
                  backdropFilter: 'blur(8px)'
                }}
                whileHover={{
                  borderColor: 'rgba(124,106,247,0.7)',
                  boxShadow:
                    '0 0 0 4px rgba(124,106,247,0.1), 0 20px 60px rgba(124,106,247,0.35)'
                }}
                transition={springSnappy}
              >
                {/* Shimmer */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  initial={{ x: '-120%' }}
                  whileHover={{ x: '120%' }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  style={{
                    background:
                      'linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.15) 50%, transparent 70%)'
                  }}
                />
                {/* Pulsing violet glow */}
                <motion.div
                  aria-hidden
                  className="absolute inset-0"
                  animate={{ opacity: [0.3, 0.55, 0.3] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                  style={{
                    background:
                      'radial-gradient(circle at center, rgba(124,106,247,0.3) 0%, rgba(124,106,247,0) 70%)'
                  }}
                />
                <Lightning
                  size={18}
                  weight="fill"
                  style={{
                    color: 'var(--accent)',
                    filter: 'drop-shadow(0 0 8px rgba(124,106,247,0.6))'
                  }}
                />
              </motion.div>
              <span
                className="tracking-wider"
                style={{
                  fontSize: 'clamp(9px, 0.7vw, 10px)',
                  color: 'var(--accent)',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 600
                }}
              >
                STUDOX
              </span>
            </motion.button>

            {/* Regular quick links */}
            {quickLinks.map((link, i) => (
              <motion.button
                key={link.url}
                onClick={() => navigateTo(link.url)}
                initial={{ opacity: 0, y: 10, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.55,
                  delay: staggerDelay(3) + (i + 1) * 0.05,
                  ease: [0.16, 1, 0.3, 1]
                }}
                whileHover={{ y: -3, scale: 1.05 }}
                whileTap={{ scale: 0.94 }}
                className="flex flex-col items-center group"
                style={{
                  width: 'clamp(58px, 5.5vw, 74px)',
                  gap: 'clamp(6px, 0.6vw, 8px)'
                }}
                aria-label={link.label}
              >
                <motion.div
                  className="flex items-center justify-center rounded-2xl overflow-hidden relative"
                  style={{
                    width: 'clamp(44px, 4vw, 54px)',
                    height: 'clamp(44px, 4vw, 54px)',
                    background: 'rgba(255,255,255,0.035)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: 'clamp(16px, 1.4vw, 20px)',
                    fontWeight: 500,
                    color: 'rgba(255,255,255,0.8)',
                    backdropFilter: 'blur(8px)'
                  }}
                  whileHover={{
                    borderColor: 'rgba(124,106,247,0.35)',
                    background: 'rgba(124,106,247,0.08)',
                    boxShadow: '0 0 0 4px rgba(124,106,247,0.06), 0 12px 30px rgba(0,0,0,0.4)'
                  }}
                  transition={springSnappy}
                >
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    initial={{ x: '-120%' }}
                    whileHover={{ x: '120%' }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    style={{
                      background:
                        'linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)'
                    }}
                  />
                  {link.icon}
                </motion.div>
                <span
                  className="tracking-wider transition-colors"
                  style={{
                    fontSize: 'clamp(9px, 0.7vw, 10px)',
                    color: 'var(--text-tertiary)',
                    fontFamily: 'var(--font-mono)'
                  }}
                >
                  {link.label}
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* ── STATUS BAR — TRUE bottom, absolute, full width ── */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 z-[5] flex items-center justify-between pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.2 }}
        style={{
          padding: 'clamp(10px, 1.2vw, 18px) clamp(20px, 2.5vw, 40px)'
        }}
      >
        <div
          className="flex items-center gap-2 tracking-[0.15em]"
          style={{
            fontSize: 'clamp(8px, 0.65vw, 10px)',
            color: 'var(--text-disabled)',
            fontFamily: 'var(--font-mono)'
          }}
        >
          <span style={{ opacity: 0.5 }}>⬡</span>
          <span>PORTAL OS v{version}</span>
        </div>
        <div
          className="tracking-[0.15em] flex items-center gap-2"
          style={{
            fontSize: 'clamp(8px, 0.65vw, 10px)',
            color: 'var(--text-disabled)',
            fontFamily: 'var(--font-mono)'
          }}
        >
          <span>BY JOHANNESAFK</span>
          <span style={{ opacity: 0.4 }}>·</span>
          <span style={{ color: 'rgba(124,106,247,0.55)' }}>STUDOX</span>
        </div>
      </motion.div>
    </div>
  )
}

function getGreeting(hour: number, t: ReturnType<typeof useI18nStore.getState>['t']): string {
  if (hour >= 5 && hour < 12) return t.newtab.greetingMorning
  if (hour >= 12 && hour < 17) return t.newtab.greetingAfternoon
  if (hour >= 17 && hour < 22) return t.newtab.greetingEvening
  return t.newtab.greetingNight
}
