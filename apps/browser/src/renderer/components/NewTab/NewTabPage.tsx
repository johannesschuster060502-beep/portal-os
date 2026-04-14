import { useState, useEffect, KeyboardEvent } from 'react'
import { motion } from 'framer-motion'
import { MagnifyingGlass } from '@phosphor-icons/react'
import { useTabsStore } from '@store/tabs.store'
import { springSnappy } from '@lib/motion'
import ThreeScene from './ThreeScene'

/**
 * Portal OS — New Tab Page
 *
 * Responsive cinematic layout:
 *   - Works from 900px (min window) up to ultrawide 5120px
 *   - All typography scales with clamp()
 *   - Staggered entrance animations (greeting → clock → search → quick links)
 *   - Subtle violet glow behind the clock
 *   - Ambient vignette overlay
 *   - Footer anchored to true bottom with padding so it never overlaps content
 */

const quickLinks = [
  { label: 'GOOGLE', url: 'https://google.com', icon: 'G' },
  { label: 'GITHUB', url: 'https://github.com', icon: '⬡' },
  { label: 'YOUTUBE', url: 'https://youtube.com', icon: '▶' },
  { label: 'TWITTER', url: 'https://x.com', icon: '𝕏' },
  { label: 'REDDIT', url: 'https://reddit.com', icon: 'r/' },
  { label: 'STUDOX', url: 'https://studox.eu', icon: '◈' }
]

function staggerDelay(i: number): number {
  return 0.15 + i * 0.08
}

export default function NewTabPage(): JSX.Element {
  const [now, setNow] = useState(new Date())
  const [searchValue, setSearchValue] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)
  const navigateTo = useTabsStore((s) => s.navigateTo)

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
    .toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
    .toUpperCase()
  const greeting = getGreeting(now.getHours())

  return (
    <div className="relative flex-1 flex flex-col overflow-hidden">
      {/* Three.js ambient background */}
      <ThreeScene />

      {/* Radial vignette — subtle center glow */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(124,106,247,0.05) 0%, rgba(0,0,0,0) 70%)'
        }}
      />

      {/* Top vignette edge for depth */}
      <div
        className="absolute top-0 left-0 right-0 h-32 pointer-events-none z-[1]"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0) 100%)'
        }}
      />

      {/* Main content — absolutely centered, responsive */}
      <div
        className="relative z-10 flex-1 flex flex-col items-center justify-center"
        style={{
          padding: 'clamp(24px, 4vw, 64px)',
          paddingBottom: 'clamp(80px, 10vh, 140px)'
        }}
      >
        <div
          className="flex flex-col items-center w-full"
          style={{
            gap: 'clamp(20px, 3vw, 40px)',
            maxWidth: 'min(720px, 90vw)'
          }}
        >
          {/* Greeting line */}
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

          {/* Clock with violet glow */}
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.9, delay: staggerDelay(1), ease: [0.16, 1, 0.3, 1] }}
            className="relative text-center select-none"
          >
            {/* Accent glow behind clock */}
            <div
              aria-hidden
              className="absolute inset-0 -z-0 blur-3xl opacity-50 pointer-events-none"
              style={{
                background:
                  'radial-gradient(circle at center, rgba(124,106,247,0.18) 0%, rgba(124,106,247,0) 60%)'
              }}
            />
            <div
              className="relative font-extralight leading-none"
              style={{
                fontSize: 'clamp(64px, 8vw, 128px)',
                color: 'rgba(255,255,255,0.92)',
                fontFamily: 'var(--font-display)',
                letterSpacing: '-0.04em',
                textShadow: '0 0 60px rgba(124,106,247,0.12)'
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

          {/* Search bar — responsive width, scales on focus */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: staggerDelay(2), ease: [0.16, 1, 0.3, 1] }}
            className="w-full"
            style={{ maxWidth: 'min(560px, 85vw)' }}
          >
            <motion.div
              className="flex items-center rounded-full"
              animate={{
                scale: searchFocused ? 1.02 : 1,
                boxShadow: searchFocused
                  ? '0 0 0 1px rgba(124,106,247,0.5), 0 0 0 6px rgba(124,106,247,0.08), 0 20px 60px rgba(0,0,0,0.5)'
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
              <MagnifyingGlass
                className="opacity-30 shrink-0"
                size={17}
              />
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={handleSearch}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                placeholder="Search the web or enter URL"
                className="flex-1 bg-transparent border-none outline-none text-white/85 placeholder:text-white/20"
                style={{
                  fontFamily: 'var(--font-ui)',
                  caretColor: 'var(--accent)',
                  fontSize: 'clamp(13px, 1vw, 15px)'
                }}
                spellCheck={false}
                autoComplete="off"
                aria-label="Search"
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

          {/* Quick links — responsive grid, stagger entrance */}
          <div
            className="flex flex-wrap justify-center"
            style={{
              gap: 'clamp(10px, 1.5vw, 18px)',
              marginTop: 'clamp(8px, 1vw, 16px)'
            }}
          >
            {quickLinks.map((link, i) => (
              <motion.button
                key={link.url}
                onClick={() => navigateTo(link.url)}
                initial={{ opacity: 0, y: 10, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.55,
                  delay: staggerDelay(3) + i * 0.05,
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
                  {/* Shimmer glint on hover */}
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

      {/* Bottom status bar — permanently anchored, never overlaps content */}
      <motion.div
        className="relative z-10 flex items-center justify-between shrink-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.2 }}
        style={{
          padding: 'clamp(14px, 1.5vw, 22px) clamp(24px, 3vw, 48px)',
          borderTop: '1px solid rgba(255,255,255,0.03)'
        }}
      >
        <div
          className="flex items-center gap-2 tracking-[0.15em]"
          style={{
            fontSize: 'clamp(9px, 0.7vw, 10px)',
            color: 'var(--text-disabled)',
            fontFamily: 'var(--font-mono)'
          }}
        >
          <span className="opacity-60">⬡</span>
          <span>PORTAL OS v1.0.0</span>
        </div>
        <div
          className="tracking-[0.15em]"
          style={{
            fontSize: 'clamp(9px, 0.7vw, 10px)',
            color: 'var(--text-disabled)',
            fontFamily: 'var(--font-mono)'
          }}
        >
          BUILT BY JOHANNESAFK
        </div>
      </motion.div>
    </div>
  )
}

function getGreeting(hour: number): string {
  if (hour >= 5 && hour < 12) return 'GOOD MORNING'
  if (hour >= 12 && hour < 17) return 'GOOD AFTERNOON'
  if (hour >= 17 && hour < 22) return 'GOOD EVENING'
  return 'GOOD NIGHT'
}
