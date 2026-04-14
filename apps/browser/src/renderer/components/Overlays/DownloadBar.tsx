import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { X, Check, File, ArrowDown } from '@phosphor-icons/react'
import { springStandard } from '@lib/motion'

interface DownloadItem {
  id: string
  filename: string
  totalBytes: number
  receivedBytes: number
  state: string
}

export default function DownloadBar(): JSX.Element {
  const [downloads, setDownloads] = useState<DownloadItem[]>([])
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const unsubStarted = window.portalOS.downloads.onStarted((item) => {
      setDownloads((prev) => [item as DownloadItem, ...prev.slice(0, 4)])
      setVisible(true)
    })

    const unsubProgress = window.portalOS.downloads.onProgress((item) => {
      setDownloads((prev) =>
        prev.map((d) => (d.id === (item as DownloadItem).id ? (item as DownloadItem) : d))
      )
    })

    const unsubDone = window.portalOS.downloads.onDone((item) => {
      setDownloads((prev) =>
        prev.map((d) => (d.id === (item as DownloadItem).id ? (item as DownloadItem) : d))
      )
      // Auto-hide after 5s if no active downloads
      setTimeout(() => {
        setDownloads((current) => {
          const hasActive = current.some((d) => d.state === 'progressing')
          if (!hasActive) setVisible(false)
          return current
        })
      }, 5000)
    })

    return () => {
      unsubStarted()
      unsubProgress()
      unsubDone()
    }
  }, [])

  if (!visible || downloads.length === 0) return <></>

  return (
    <motion.div
      className="absolute bottom-0 left-0 right-0 z-[40] flex items-center gap-3 px-4 h-10"
      style={{
        background: 'var(--bg-surface)',
        borderTop: '1px solid var(--border-dim)'
      }}
      initial={{ y: 40 }}
      animate={{ y: 0 }}
      exit={{ y: 40 }}
      transition={springStandard}
    >
      <ArrowDown size={13} className="opacity-30 shrink-0" />

      <div className="flex items-center gap-3 flex-1 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
        {downloads.map((dl) => (
          <DownloadChip key={dl.id} download={dl} />
        ))}
      </div>

      <button
        onClick={() => setVisible(false)}
        className="w-6 h-6 flex items-center justify-center rounded opacity-30
                   hover:opacity-70 hover:bg-white/5 transition-all shrink-0"
        aria-label="Dismiss downloads"
      >
        <X size={12} />
      </button>
    </motion.div>
  )
}

function DownloadChip({ download }: { download: DownloadItem }): JSX.Element {
  const progress =
    download.totalBytes > 0
      ? Math.round((download.receivedBytes / download.totalBytes) * 100)
      : 0
  const isDone = download.state === 'completed'
  const isFailed = download.state === 'cancelled' || download.state === 'interrupted'

  return (
    <div
      className="flex items-center gap-2 px-2.5 py-1 rounded-md shrink-0 max-w-[200px]"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid var(--border-dim)'
      }}
    >
      {isDone ? (
        <Check size={11} style={{ color: 'var(--success)' }} />
      ) : isFailed ? (
        <X size={11} style={{ color: 'var(--danger)' }} />
      ) : (
        <File size={11} className="opacity-30" />
      )}

      <span
        className="text-[10px] truncate"
        style={{ color: 'var(--text-secondary)', maxWidth: 120 }}
      >
        {download.filename}
      </span>

      {!isDone && !isFailed && (
        <span
          className="text-[10px] shrink-0"
          style={{ color: 'var(--text-disabled)', fontFamily: 'var(--font-mono)' }}
        >
          {progress}%
        </span>
      )}
    </div>
  )
}
