import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useUIStore } from '@store/ui.store'
import { duration } from '@lib/motion'
import { detectLocale } from '@lib/i18n'

/**
 * Portal OS — Boot Screen
 *
 * Cinematic boot sequence with two modes:
 *   1. First session: full 2800ms sequence with line-by-line typing
 *   2. Cold start (has booted before): 800ms logo flash + bar fill
 *
 * Spec:
 *   - Each line types at exactly 28ms/char
 *   - Progress bar 1px tall, accent color
 *   - "ready." holds 600ms → fade out (300ms) + vignette in simultaneously → desktop in (400ms)
 *   - Total first-session duration: 2800ms ± 100ms
 *   - Font: monospace 13px, letter-spacing 0.08em, rgba(255,255,255,0.35) default
 */

const CHAR_MS = 28
const LINE_HOLD_MS = 140
const INITIAL_DELAY_MS = 200
const READY_HOLD_MS = 600

const bootLinesByLocale = {
  en: [
    { text: 'PORTAL OS v1.0.2', dim: false },
    { text: 'initializing chromium engine... ok', dim: true },
    { text: 'loading extensions... ok', dim: true },
    { text: 'mounting secure context... ok', dim: true },
    { text: 'establishing studox protocol... ok', dim: true },
    { text: 'ready.', dim: false }
  ],
  de: [
    { text: 'PORTAL OS v1.0.2', dim: false },
    { text: 'initialisiere chromium engine... ok', dim: true },
    { text: 'lade erweiterungen... ok', dim: true },
    { text: 'sicherer kontext aktiviert... ok', dim: true },
    { text: 'studox protokoll aufgebaut... ok', dim: true },
    { text: 'bereit.', dim: false }
  ]
}

const STORAGE_KEY = 'portalos-has-booted'

export default function BootScreen(): JSX.Element {
  const setBoot = useUIStore((s) => s.setBoot)
  const [lines, setLines] = useState<{ text: string; dim: boolean }[]>([])
  const [currentText, setCurrentText] = useState('')
  const [progress, setProgress] = useState(0)
  const [fadingOut, setFadingOut] = useState(false)
  const [isFirstSession] = useState(() => {
    try {
      return !localStorage.getItem(STORAGE_KEY)
    } catch {
      return true
    }
  })
  // Boot runs before i18n store is loaded, so read raw locale from storage/navigator
  const bootLines = (() => {
    try {
      const stored = localStorage.getItem('portalos-locale')
      if (stored === 'de' || stored === 'en') return bootLinesByLocale[stored]
    } catch {
      // Ignore
    }
    return bootLinesByLocale[detectLocale()]
  })()
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true

    const runFull = async (): Promise<void> => {
      await wait(INITIAL_DELAY_MS)

      for (let i = 0; i < bootLines.length; i++) {
        if (!mountedRef.current) return
        const line = bootLines[i]

        // Type char by char at consistent 28ms pace
        for (let c = 0; c <= line.text.length; c++) {
          if (!mountedRef.current) return
          setCurrentText(line.text.slice(0, c))
          await wait(CHAR_MS)
        }

        // Commit completed line
        setLines((prev) => [...prev, line])
        setCurrentText('')
        setProgress(((i + 1) / bootLines.length) * 100)
        await wait(LINE_HOLD_MS)
      }

      // Hold "ready." state
      await wait(READY_HOLD_MS)

      if (!mountedRef.current) return
      setFadingOut(true)
      await wait(300)

      // Mark has-booted for future cold starts
      try {
        localStorage.setItem(STORAGE_KEY, '1')
      } catch {
        // Ignore storage errors
      }

      if (mountedRef.current) setBoot(true)
    }

    const runQuick = async (): Promise<void> => {
      // Shortened cold-start: just show logo + fill bar
      setLines([bootLines[0]])
      await wait(100)
      setProgress(100)
      await wait(500)

      if (!mountedRef.current) return
      setFadingOut(true)
      await wait(200)

      if (mountedRef.current) setBoot(true)
    }

    if (isFirstSession) {
      void runFull()
    } else {
      void runQuick()
    }

    return () => {
      mountedRef.current = false
    }
  }, [isFirstSession, setBoot])

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black"
      initial={{ opacity: 1 }}
      animate={{ opacity: fadingOut ? 0 : 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: duration.slow, ease: 'easeOut' }}
    >
      {/* Radial vignette appears as the boot fades out */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(124,106,247,0.06) 0%, rgba(0,0,0,0) 60%)'
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: fadingOut ? 1 : 0 }}
        transition={{ duration: duration.slow }}
      />

      <div className="relative flex flex-col items-center gap-1 min-h-[140px] justify-center">
        {/* Completed lines */}
        {lines.map((line, i) => (
          <div
            key={i}
            className="tracking-[0.08em] leading-relaxed"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 13,
              color: line.dim ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.35)'
            }}
          >
            {line.text}
          </div>
        ))}

        {/* Currently typing line */}
        {currentText !== '' && (
          <div
            className="tracking-[0.08em] leading-relaxed"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 13,
              color: 'rgba(255,255,255,0.35)'
            }}
          >
            {currentText}
            <span className="animate-pulse" style={{ color: 'var(--accent)' }}>
              _
            </span>
          </div>
        )}

        {/* Blinking cursor between lines */}
        {currentText === '' && lines.length < bootLines.length && isFirstSession && (
          <div
            className="tracking-[0.08em] animate-pulse"
            style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--accent)' }}
          >
            _
          </div>
        )}
      </div>

      {/* Progress bar — 1px, accent color */}
      <div className="relative w-[200px] h-px mt-8 overflow-hidden" style={{ background: '#0a0a0a' }}>
        <motion.div
          className="h-full"
          style={{ background: 'var(--accent)' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        />
        {/* Shimmer pass */}
        <motion.div
          className="absolute inset-0 h-full w-10 pointer-events-none"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)'
          }}
          animate={{ x: [-40, 240] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      {/* Branding */}
      <div
        className="absolute bottom-8 flex items-center gap-2 text-[10px] tracking-[0.2em]"
        style={{ color: 'rgba(255,255,255,0.08)', fontFamily: 'var(--font-mono)' }}
      >
        <span>BY JOHANNESAFK</span>
        <span style={{ opacity: 0.4 }}>·</span>
        <span style={{ color: 'rgba(124,106,247,0.35)' }}>POWERED BY STUDOX</span>
      </div>
    </motion.div>
  )
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
