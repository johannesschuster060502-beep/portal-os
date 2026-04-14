import { useState, useEffect, KeyboardEvent } from 'react'
import { motion } from 'framer-motion'
import { MagnifyingGlass } from '@phosphor-icons/react'
import { useTabsStore } from '@store/tabs.store'
import ThreeScene from './ThreeScene'

export default function NewTabPage(): JSX.Element {
  const [time, setTime] = useState(getTime())
  const [date, setDate] = useState(getDate())
  const [searchValue, setSearchValue] = useState('')
  const navigateTo = useTabsStore((s) => s.navigateTo)

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getTime())
      setDate(getDate())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  function handleSearch(e: KeyboardEvent<HTMLInputElement>): void {
    if (e.key === 'Enter' && searchValue.trim()) {
      navigateTo(searchValue.trim())
    }
  }

  return (
    <div className="relative flex-1 flex flex-col items-center justify-center overflow-hidden">
      {/* Three.js background */}
      <ThreeScene />

      {/* Content overlay */}
      <motion.div
        className="relative z-10 flex flex-col items-center gap-6"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Clock */}
        <div className="text-center select-none">
          <div
            className="text-7xl font-extralight tracking-tight"
            style={{ color: 'rgba(255,255,255,0.85)', fontFamily: 'var(--font-display)' }}
          >
            {time}
          </div>
          <div
            className="text-[11px] tracking-[0.2em] mt-2"
            style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}
          >
            {date}
          </div>
        </div>

        {/* Search bar */}
        <div
          className="flex items-center gap-3 w-[480px] h-12 px-5 rounded-full transition-all"
          style={{
            background: 'var(--glass-bg)',
            backdropFilter: 'blur(var(--glass-blur))',
            border: '1px solid var(--border-subtle)'
          }}
        >
          <MagnifyingGlass size={16} className="opacity-25 shrink-0" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={handleSearch}
            placeholder="Search the web or enter URL"
            className="flex-1 bg-transparent border-none outline-none text-sm text-white/80
                       placeholder:text-white/20"
            style={{ fontFamily: 'var(--font-ui)', caretColor: 'var(--accent)' }}
            spellCheck={false}
            autoComplete="off"
          />
        </div>

        {/* Quick links */}
        <div className="flex gap-4 mt-2">
          {quickLinks.map((link) => (
            <motion.button
              key={link.url}
              onClick={() => navigateTo(link.url)}
              className="flex flex-col items-center gap-2 w-16 group"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center text-lg
                           transition-all group-hover:border-white/15"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                {link.icon}
              </div>
              <span className="text-[10px] tracking-wide" style={{ color: 'var(--text-tertiary)' }}>
                {link.label}
              </span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Bottom credit */}
      <div
        className="absolute bottom-5 text-[10px] tracking-[0.15em] z-10"
        style={{ color: 'var(--text-disabled)', fontFamily: 'var(--font-mono)' }}
      >
        PORTAL OS — BUILT BY JOHANNESAFK
      </div>
    </div>
  )
}

function getTime(): string {
  const now = new Date()
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
}

function getDate(): string {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }).toUpperCase()
}

const quickLinks = [
  { label: 'GOOGLE', url: 'https://google.com', icon: 'G' },
  { label: 'GITHUB', url: 'https://github.com', icon: '⬡' },
  { label: 'YOUTUBE', url: 'https://youtube.com', icon: '▶' },
  { label: 'TWITTER', url: 'https://x.com', icon: '𝕏' },
  { label: 'REDDIT', url: 'https://reddit.com', icon: 'r/' },
  { label: 'STUDOX', url: 'https://studox.eu', icon: '◈' }
]
