import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowsClockwise, X, CaretUp, CaretDown } from '@phosphor-icons/react'
import { springStandard } from '@lib/motion'
import { useI18nStore } from '@store/i18n.store'

type UpdateState = 'idle' | 'downloading' | 'ready'

// Convert HTML release notes (from GitHub Markdown) to readable plain text
function htmlToText(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<\/h[1-6]>/gi, '\n')
    .replace(/<h[1-6][^>]*>/gi, '\n')
    .replace(/<li[^>]*>/gi, '\n• ')
    .replace(/<\/li>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

export default function UpdateBar(): JSX.Element {
  const t = useI18nStore((s) => s.t)
  const [state, setState] = useState<UpdateState>('idle')
  const [version, setVersion] = useState('')
  const [progress, setProgress] = useState(0)
  const [dismissed, setDismissed] = useState(false)
  const [releaseNotes, setReleaseNotes] = useState('')
  const [showChangelog, setShowChangelog] = useState(false)

  useEffect(() => {
    const unsubAvail = window.portalOS.updater.onAvailable((data) => {
      setVersion(data.version)
      setReleaseNotes(data.releaseNotes ? htmlToText(data.releaseNotes) : '')
      setState('downloading')
      setDismissed(false)
    })

    const unsubProgress = window.portalOS.updater.onProgress((data) => {
      setProgress(data.percent)
    })

    const unsubReady = window.portalOS.updater.onReady((data) => {
      setVersion(data.version)
      setState('ready')
      setDismissed(false)
    })

    return () => {
      unsubAvail()
      unsubProgress()
      unsubReady()
    }
  }, [])

  const show = (state === 'downloading' || state === 'ready') && !dismissed

  return (
    <>
      {/* Changelog panel — appears just above the bar */}
      <AnimatePresence>
        {show && showChangelog && releaseNotes && (
          <motion.div
            key="changelog"
            className="absolute bottom-9 left-0 right-0 z-[45] overflow-y-auto"
            style={{
              background: 'var(--bg-elevated)',
              borderTop: '1px solid var(--border-subtle)',
              maxHeight: '200px'
            }}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.15 }}
          >
            <div className="px-4 py-3">
              <div
                className="text-[10px] tracking-wider mb-2"
                style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}
              >
                {t.updater.whatsNew} — v{version}
              </div>
              <div
                className="text-[11px] leading-relaxed whitespace-pre-wrap"
                style={{ color: 'var(--text-secondary)' }}
              >
                {releaseNotes}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main update bar */}
      <AnimatePresence>
        {show && (
          <motion.div
            key="bar"
            className="absolute bottom-0 left-0 right-0 z-[45] flex items-center justify-between
                       px-4 h-9"
            style={{
              background: 'var(--bg-elevated)',
              borderTop: '1px solid var(--border-subtle)'
            }}
            initial={{ y: 36 }}
            animate={{ y: 0 }}
            exit={{ y: 36 }}
            transition={springStandard}
          >
            <div className="flex items-center gap-2.5">
              <ArrowsClockwise
                size={13}
                className={state === 'downloading' ? 'animate-spin' : ''}
                style={{ color: 'var(--accent)', opacity: 0.7 }}
              />

              {state === 'downloading' && (
                <span className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>
                  {t.updater.downloading} v{version}... {progress}%
                </span>
              )}

              {state === 'ready' && (
                <span className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>
                  Portal OS v{version} {t.updater.ready}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* What's new toggle — only shown if release notes exist */}
              {releaseNotes && (
                <button
                  onClick={() => setShowChangelog((v) => !v)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px]
                             transition-all hover:bg-white/5"
                  style={{
                    border: '1px solid var(--border-subtle)',
                    color: showChangelog ? 'var(--accent)' : 'var(--text-tertiary)'
                  }}
                >
                  {t.updater.whatsNew}
                  {showChangelog ? <CaretDown size={9} /> : <CaretUp size={9} />}
                </button>
              )}

              {state === 'ready' && (
                <button
                  onClick={() => window.portalOS.updater.install()}
                  className="px-3 py-1 rounded-md text-[11px] transition-all hover:brightness-110"
                  style={{
                    background: 'var(--accent)',
                    color: '#fff'
                  }}
                >
                  {t.updater.installAndRestart}
                </button>
              )}

              <button
                onClick={() => setDismissed(true)}
                className="w-6 h-6 flex items-center justify-center rounded opacity-30
                           hover:opacity-70 hover:bg-white/5 transition-all"
                aria-label="Dismiss"
              >
                <X size={11} />
              </button>
            </div>

            {/* Download progress indicator */}
            {state === 'downloading' && (
              <div className="absolute bottom-0 left-0 right-0 h-[1px]">
                <div
                  className="h-full"
                  style={{
                    width: `${progress}%`,
                    background: 'var(--accent)',
                    transition: 'width 0.5s ease-out'
                  }}
                />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
