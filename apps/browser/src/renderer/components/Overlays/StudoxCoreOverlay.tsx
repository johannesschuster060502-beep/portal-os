import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useUIStore } from '@store/ui.store'
import { useI18nStore } from '@store/i18n.store'

/**
 * Portal OS — STUDOX Core Transition Overlay
 *
 * Cyberpunk glitch transition played when opening core.studox.eu.
 * Lifecycle:
 *   0.00s → overlay enters with instant opacity (no fade)
 *   0.10s → RGB glitch title flickers in
 *   0.30s → data stream + scanlines + loading bar
 *   0.80s → progress reaches 100%
 *   1.10s → "CORE ACCESSED" confirmation
 *   1.40s → navigation begins (handled by store)
 *   1.60s → overlay fades out
 */

const dataLines = [
  'ESTABLISHING HANDSHAKE WITH CORE.STUDOX.EU',
  'VERIFYING CLIENT CERTIFICATE... OK',
  'NEGOTIATING TLS 1.3... OK',
  'AUTHENTICATING SESSION TOKEN... OK',
  'LOADING CORE MODULES [████████████████] 100%',
  'CORE INTERFACE READY. WELCOME.'
]

export default function StudoxCoreOverlay(): JSX.Element {
  const active = useUIStore((s) => s.studoxTransitioning)
  const t = useI18nStore((s) => s.t)

  const [typedLines, setTypedLines] = useState<string[]>([])
  const [currentLine, setCurrentLine] = useState('')
  const [progress, setProgress] = useState(0)
  const [glitchBurst, setGlitchBurst] = useState(false)

  useEffect(() => {
    if (!active) {
      setTypedLines([])
      setCurrentLine('')
      setProgress(0)
      setGlitchBurst(false)
      return
    }

    let cancelled = false

    async function run(): Promise<void> {
      // Phase 1: glitch burst (100ms)
      setGlitchBurst(true)
      await wait(100)
      if (cancelled) return

      // Phase 2: type data lines (300-1100ms)
      for (let i = 0; i < dataLines.length; i++) {
        if (cancelled) return
        const line = dataLines[i]
        for (let c = 0; c <= line.length; c += 3) {
          if (cancelled) return
          setCurrentLine(line.slice(0, c))
          await wait(4)
        }
        setTypedLines((prev) => [...prev, line])
        setCurrentLine('')
        setProgress(((i + 1) / dataLines.length) * 100)
        await wait(40)
      }

      if (cancelled) return
      // Phase 3: hold before navigation happens
      await wait(200)
    }

    run()

    return () => {
      cancelled = true
    }
  }, [active])

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="fixed inset-0 z-[9998] overflow-hidden pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          aria-hidden="true"
        >
          {/* Solid black base */}
          <div className="absolute inset-0" style={{ background: '#020203' }} />

          {/* Violet radial pulse */}
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1 }}
            animate={{ opacity: [0, 0.45, 0.25, 0.35], scale: [0.9, 1.1, 1] }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            style={{
              background:
                'radial-gradient(circle at 50% 50%, rgba(124,106,247,0.35) 0%, rgba(124,106,247,0.05) 40%, rgba(0,0,0,0) 70%)'
            }}
          />

          {/* Cyan chromatic offset layer */}
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.2, 0.1, 0.15, 0.08] }}
            transition={{ duration: 1.6, ease: 'linear' }}
            style={{
              background:
                'radial-gradient(circle at 30% 40%, rgba(0,255,240,0.1) 0%, rgba(0,0,0,0) 50%)',
              mixBlendMode: 'screen'
            }}
          />

          {/* Scanlines */}
          <div className="absolute inset-0 scanlines pointer-events-none" />

          {/* Grid overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-30"
            style={{
              backgroundImage: `
                linear-gradient(rgba(124,106,247,0.08) 1px, transparent 1px),
                linear-gradient(90deg, rgba(124,106,247,0.08) 1px, transparent 1px)
              `,
              backgroundSize: '60px 60px',
              maskImage:
                'radial-gradient(ellipse 80% 70% at 50% 50%, black 30%, transparent 80%)'
            }}
          />

          {/* Horizontal glitch bars */}
          <AnimatePresence>
            {glitchBurst && (
              <>
                <motion.div
                  className="absolute left-0 right-0 h-[3px]"
                  style={{ background: 'rgba(255,0,80,0.9)', mixBlendMode: 'screen' }}
                  initial={{ y: '30vh', opacity: 0 }}
                  animate={{ y: ['30vh', '70vh', '45vh'], opacity: [0, 1, 0] }}
                  transition={{ duration: 0.6, ease: 'easeInOut' }}
                />
                <motion.div
                  className="absolute left-0 right-0 h-[2px]"
                  style={{ background: 'rgba(0,255,240,0.9)', mixBlendMode: 'screen' }}
                  initial={{ y: '55vh', opacity: 0 }}
                  animate={{ y: ['55vh', '25vh', '65vh'], opacity: [0, 1, 0] }}
                  transition={{ duration: 0.7, ease: 'easeInOut', delay: 0.1 }}
                />
                <motion.div
                  className="absolute left-0 right-0 h-[4px]"
                  style={{ background: 'rgba(124,106,247,0.8)', mixBlendMode: 'screen' }}
                  initial={{ y: '20vh', opacity: 0 }}
                  animate={{ y: ['20vh', '80vh', '40vh'], opacity: [0, 1, 0] }}
                  transition={{ duration: 0.9, ease: 'easeInOut', delay: 0.2 }}
                />
              </>
            )}
          </AnimatePresence>

          {/* Center content */}
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center gap-8 px-6"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {/* STUDOX CORE title with RGB glitch */}
            <div className="text-center">
              <div
                className="tracking-[0.3em] mb-3"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  color: 'rgba(124,106,247,0.75)',
                  animation: 'glitch-flicker 0.4s infinite'
                }}
              >
                {t.studox.coreLoading}
              </div>
              <div
                className="glitch-text font-extralight leading-none"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(48px, 7vw, 112px)',
                  color: 'rgba(255,255,255,0.96)',
                  letterSpacing: '-0.04em',
                  textShadow:
                    '0 0 60px rgba(124,106,247,0.45), 0 0 120px rgba(124,106,247,0.2)'
                }}
              >
                STUDOX
              </div>
              <div
                className="mt-2 tracking-[0.28em]"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'clamp(10px, 0.9vw, 13px)',
                  color: 'rgba(0,255,240,0.5)'
                }}
              >
                CORE SYSTEM v1.0
              </div>
            </div>

            {/* Data stream box */}
            <div
              className="w-full max-w-[560px] rounded-lg p-5"
              style={{
                background: 'rgba(0,0,0,0.6)',
                border: '1px solid rgba(124,106,247,0.28)',
                boxShadow:
                  '0 0 0 1px rgba(0,255,240,0.05), 0 20px 80px rgba(124,106,247,0.2)',
                backdropFilter: 'blur(8px)'
              }}
            >
              <div
                className="flex items-center justify-between mb-3 pb-2"
                style={{ borderBottom: '1px solid rgba(124,106,247,0.12)' }}
              >
                <span
                  className="tracking-[0.2em]"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 9,
                    color: 'rgba(124,106,247,0.7)'
                  }}
                >
                  ● STUDOX PROTOCOL
                </span>
                <span
                  className="tracking-wider flicker"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 9,
                    color: 'rgba(0,255,240,0.55)'
                  }}
                >
                  {progress.toFixed(0)}%
                </span>
              </div>
              <div
                className="font-normal leading-relaxed min-h-[108px]"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  color: 'rgba(255,255,255,0.55)',
                  letterSpacing: '0.04em'
                }}
              >
                {typedLines.map((line, i) => (
                  <div key={i} className="flex gap-2">
                    <span style={{ color: 'rgba(0,255,240,0.4)' }}>&gt;</span>
                    <span>{line}</span>
                  </div>
                ))}
                {currentLine !== '' && (
                  <div className="flex gap-2">
                    <span style={{ color: 'rgba(0,255,240,0.4)' }}>&gt;</span>
                    <span style={{ color: 'rgba(255,255,255,0.75)' }}>
                      {currentLine}
                      <span style={{ color: 'var(--accent)' }}>_</span>
                    </span>
                  </div>
                )}
              </div>

              {/* Progress bar */}
              <div
                className="mt-4 w-full h-[2px] overflow-hidden rounded-full"
                style={{ background: 'rgba(255,255,255,0.04)' }}
              >
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background:
                      'linear-gradient(90deg, rgba(124,106,247,1) 0%, rgba(0,255,240,0.8) 100%)',
                    boxShadow: '0 0 12px rgba(124,106,247,0.6)'
                  }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                />
              </div>
            </div>

            {/* Footer */}
            <div
              className="tracking-[0.3em]"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 9,
                color: 'rgba(124,106,247,0.4)'
              }}
            >
              {t.studox.poweredBy}
            </div>
          </motion.div>

          {/* Bottom scan line sweep */}
          <motion.div
            className="absolute left-0 right-0 h-[1px]"
            style={{
              background:
                'linear-gradient(90deg, transparent 0%, rgba(124,106,247,0.8) 50%, transparent 100%)',
              boxShadow: '0 0 20px rgba(124,106,247,0.6)'
            }}
            initial={{ top: '-2px' }}
            animate={{ top: '100%' }}
            transition={{ duration: 1.4, ease: 'linear' }}
          />

          {/* Vignette edges */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse 90% 80% at 50% 50%, transparent 50%, rgba(0,0,0,0.8) 100%)'
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
