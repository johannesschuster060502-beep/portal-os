import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowsClockwise, X } from '@phosphor-icons/react'
import { springStandard } from '@lib/motion'

type UpdateState = 'idle' | 'available' | 'downloading' | 'ready'

export default function UpdateBar(): JSX.Element {
  const [state, setState] = useState<UpdateState>('idle')
  const [version, setVersion] = useState('')
  const [progress, setProgress] = useState(0)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const unsubAvail = window.portalOS.updater.onAvailable((data) => {
      setVersion(data.version)
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
    <AnimatePresence>
      {show && (
        <motion.div
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
                Downloading Portal OS {version}... {progress}%
              </span>
            )}

            {state === 'ready' && (
              <span className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>
                Portal OS {version} is ready to install.
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {state === 'ready' && (
              <button
                onClick={() => window.portalOS.updater.install()}
                className="px-3 py-1 rounded-md text-[11px] transition-all hover:brightness-110"
                style={{
                  background: 'var(--accent)',
                  color: '#fff'
                }}
              >
                Install & Restart
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

          {/* Download progress bar */}
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
  )
}
