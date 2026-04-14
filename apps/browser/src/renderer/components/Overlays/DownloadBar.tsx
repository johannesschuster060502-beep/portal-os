import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Check, Warning, ArrowDown, FolderOpen, File } from '@phosphor-icons/react'
import { springStandard } from '@lib/motion'
import { useI18nStore } from '@store/i18n.store'
import { useUIStore } from '@store/ui.store'

function formatBytes(bytes: number): string {
  if (bytes <= 0) return '—'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`
}

function formatSpeed(bytesPerSec: number): string {
  if (bytesPerSec <= 0) return ''
  return `${formatBytes(bytesPerSec)}/s`
}

function formatTime(seconds: number): string {
  if (seconds <= 0) return ''
  if (seconds < 60) return `${seconds}s`
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return s > 0 ? `${m}m ${s}s` : `${m}m`
}

export default function DownloadBar(): JSX.Element {
  const { t } = useI18nStore()
  const downloadsOpen = useUIStore((s) => s.downloadsOpen)
  const setDownloadsOpen = useUIStore((s) => s.setDownloadsOpen)
  const setActiveDownloadsCount = useUIStore((s) => s.setActiveDownloadsCount)
  const [downloads, setDownloads] = useState<DownloadItem[]>([])

  // Sync active count to store whenever downloads list changes
  useEffect(() => {
    const active = downloads.filter((d) => d.state === 'progressing').length
    setActiveDownloadsCount(active)
  }, [downloads, setActiveDownloadsCount])

  useEffect(() => {
    window.portalOS.downloads.getAll().then((items) => {
      if (items.length > 0) {
        setDownloads(items)
        setDownloadsOpen(true)
      }
    })

    const unsubStarted = window.portalOS.downloads.onStarted((dl) => {
      setDownloads((prev) => {
        if (prev.find((d) => d.id === dl.id)) return prev
        return [dl, ...prev]
      })
      setDownloadsOpen(true)
    })

    const unsubProgress = window.portalOS.downloads.onProgress((dl) => {
      setDownloads((prev) => prev.map((d) => (d.id === dl.id ? dl : d)))
    })

    const unsubDone = window.portalOS.downloads.onDone((dl) => {
      setDownloads((prev) => prev.map((d) => (d.id === dl.id ? dl : d)))
    })

    return () => {
      unsubStarted()
      unsubProgress()
      unsubDone()
    }
  }, [setDownloadsOpen])

  function handleClearDone(): void {
    window.portalOS.downloads.clear()
    setDownloads((prev) => prev.filter((d) => d.state === 'progressing'))
  }

  function handleCancel(id: string): void {
    window.portalOS.downloads.cancel(id)
    setDownloads((prev) =>
      prev.map((d) => (d.id === id ? { ...d, state: 'cancelled' as const } : d))
    )
  }

  function handleOpen(savePath: string): void {
    window.portalOS.downloads.openFile(savePath)
  }

  function handleShowInFolder(savePath: string): void {
    window.portalOS.downloads.showInFolder(savePath)
  }

  const hasDone = downloads.some((d) => d.state !== 'progressing')

  return (
    <AnimatePresence>
      {downloadsOpen && downloads.length > 0 && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 z-[40]"
          style={{
            background: 'var(--bg-surface)',
            borderTop: '1px solid var(--border-dim)'
          }}
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          transition={springStandard}
        >
          {/* Header row */}
          <div
            className="flex items-center gap-2 px-4 py-2"
            style={{ borderBottom: '1px solid var(--border-dim)' }}
          >
            <ArrowDown size={12} className="opacity-30 shrink-0" />
            <span
              className="text-[11px] font-light flex-1"
              style={{ color: 'var(--text-tertiary)' }}
            >
              {t.sidebar.downloads}
            </span>
            {hasDone && (
              <button
                onClick={handleClearDone}
                className="text-[10px] px-2 py-0.5 rounded transition-opacity hover:opacity-70"
                style={{ color: 'var(--text-disabled)', fontFamily: 'var(--font-mono)' }}
              >
                {t.downloadsPanel.clearDone}
              </button>
            )}
            <button
              onClick={() => setDownloadsOpen(false)}
              className="w-5 h-5 flex items-center justify-center rounded opacity-30 hover:opacity-70 hover:bg-white/5 transition-all shrink-0"
              aria-label="Close"
            >
              <X size={11} />
            </button>
          </div>

          {/* Download rows */}
          <div
            className="overflow-y-auto"
            style={{ maxHeight: 240, scrollbarWidth: 'thin' as const }}
          >
            {downloads.map((dl) => (
              <DownloadRow
                key={dl.id}
                dl={dl}
                onCancel={handleCancel}
                onOpen={handleOpen}
                onShowInFolder={handleShowInFolder}
                labels={{
                  cancel: t.common.cancel,
                  open: t.downloadsPanel.open,
                  showInFolder: t.downloadsPanel.showInFolder,
                  cancelled: t.downloadsPanel.cancelled,
                  interrupted: t.downloadsPanel.interrupted
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

interface RowLabels {
  cancel: string
  open: string
  showInFolder: string
  cancelled: string
  interrupted: string
}

function DownloadRow({
  dl,
  onCancel,
  onOpen,
  onShowInFolder,
  labels
}: {
  dl: DownloadItem
  onCancel: (id: string) => void
  onOpen: (path: string) => void
  onShowInFolder: (path: string) => void
  labels: RowLabels
}): JSX.Element {
  const isProgressing = dl.state === 'progressing'
  const isCompleted = dl.state === 'completed'
  const isFailed = dl.state === 'cancelled' || dl.state === 'interrupted'

  const progress =
    dl.totalBytes > 0 ? Math.min(100, (dl.receivedBytes / dl.totalBytes) * 100) : 0

  const sizeLabel =
    isProgressing && dl.totalBytes > 0
      ? `${formatBytes(dl.receivedBytes)} / ${formatBytes(dl.totalBytes)}`
      : isCompleted
        ? formatBytes(dl.totalBytes > 0 ? dl.totalBytes : dl.receivedBytes)
        : ''

  return (
    <div
      className="px-4 py-3"
      style={{ borderBottom: '1px solid var(--border-dim)' }}
    >
      {/* Top line: icon + name + size + actions */}
      <div className="flex items-center gap-2 min-w-0">
        <div className="shrink-0">
          {isCompleted ? (
            <Check size={13} style={{ color: '#4ade80' }} />
          ) : isFailed ? (
            <Warning size={13} style={{ color: '#f87171' }} />
          ) : (
            <File size={13} className="opacity-30" />
          )}
        </div>

        <span
          className="text-[12px] font-light flex-1 truncate"
          style={{ color: 'var(--text-primary)' }}
          title={dl.filename}
        >
          {dl.filename}
        </span>

        {sizeLabel && (
          <span
            className="text-[10px] shrink-0 ml-2"
            style={{ color: 'var(--text-disabled)', fontFamily: 'var(--font-mono)' }}
          >
            {sizeLabel}
          </span>
        )}

        <div className="flex items-center gap-1 shrink-0 ml-1">
          {isProgressing && (
            <button
              onClick={() => onCancel(dl.id)}
              className="w-6 h-6 flex items-center justify-center rounded opacity-40
                         hover:opacity-80 hover:bg-white/5 transition-all"
              title={labels.cancel}
            >
              <X size={11} />
            </button>
          )}

          {isCompleted && (
            <>
              <button
                onClick={() => onOpen(dl.savePath)}
                className="text-[10px] px-2 py-0.5 rounded transition-all hover:opacity-80"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--border-dim)'
                }}
              >
                {labels.open}
              </button>
              <button
                onClick={() => onShowInFolder(dl.savePath)}
                className="w-6 h-6 flex items-center justify-center rounded opacity-40
                           hover:opacity-80 hover:bg-white/5 transition-all"
                title={labels.showInFolder}
              >
                <FolderOpen size={12} />
              </button>
            </>
          )}

          {isFailed && (
            <span
              className="text-[9px] tracking-wide px-2 py-0.5 rounded"
              style={{
                background: 'rgba(248,113,113,0.1)',
                color: '#f87171',
                fontFamily: 'var(--font-mono)'
              }}
            >
              {dl.state === 'cancelled' ? labels.cancelled : labels.interrupted}
            </span>
          )}
        </div>
      </div>

      {/* Progress bar + speed + ETA */}
      {isProgressing && (
        <div className="mt-2 flex items-center gap-3">
          <div
            className="flex-1 h-[3px] rounded-full overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.06)' }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'var(--accent)', originX: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {dl.speed > 0 && (
            <span
              className="text-[10px] shrink-0"
              style={{ color: 'var(--text-disabled)', fontFamily: 'var(--font-mono)' }}
            >
              {formatSpeed(dl.speed)}
            </span>
          )}

          {dl.timeRemaining > 0 && (
            <span
              className="text-[10px] shrink-0"
              style={{ color: 'var(--text-disabled)', fontFamily: 'var(--font-mono)' }}
            >
              {formatTime(dl.timeRemaining)}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
