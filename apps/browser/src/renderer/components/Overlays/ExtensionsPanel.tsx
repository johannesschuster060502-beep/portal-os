import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  PuzzlePiece,
  FolderOpen,
  Trash,
  ArrowClockwise,
  WarningCircle,
  CircleNotch,
  MagnifyingGlass
} from '@phosphor-icons/react'
import { springStandard, tapPress, springSnappy } from '@lib/motion'
import { useI18nStore } from '@store/i18n.store'
import { useUIStore } from '@store/ui.store'

export default function ExtensionsPanel(): JSX.Element {
  const { t } = useI18nStore()
  const extensionsOpen = useUIStore((s) => s.extensionsOpen)
  const setExtensionsOpen = useUIStore((s) => s.setExtensionsOpen)

  const [extensions, setExtensions] = useState<ExtensionInfo[]>([])
  const [loading, setLoading] = useState(false)
  const [installing, setInstalling] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [inputValue, setInputValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const labels = t.extensions

  function loadExtensions(): void {
    setLoading(true)
    window.portalOS.extensions
      .list()
      .then((list) => setExtensions(list))
      .catch(() => setExtensions([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    if (extensionsOpen) {
      loadExtensions()
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [extensionsOpen])

  /** Extract extension ID from a Chrome Web Store URL or plain ID */
  function parseExtensionId(raw: string): string | null {
    const trimmed = raw.trim()
    // Plain ID: 32 lowercase letters
    if (/^[a-z]{32}$/.test(trimmed)) return trimmed
    // Chrome Web Store URL
    const match = trimmed.match(/\/([a-z]{32})(?:[/?]|$)/)
    return match ? match[1] : null
  }

  async function handleInstall(): Promise<void> {
    const id = parseExtensionId(inputValue)
    if (!id) {
      setError('Invalid extension ID or URL. IDs are 32 lowercase letters.')
      return
    }
    setError(null)
    setInstalling(true)
    try {
      const ext = await window.portalOS.extensions.install(id)
      setExtensions((prev) => {
        const filtered = prev.filter((e) => e.id !== ext.id)
        return [ext, ...filtered]
      })
      setInputValue('')
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Installation failed')
    } finally {
      setInstalling(false)
    }
  }

  async function handleLoadUnpacked(): Promise<void> {
    setError(null)
    setInstalling(true)
    try {
      const ext = await window.portalOS.extensions.loadUnpacked()
      if (ext) {
        setExtensions((prev) => {
          const filtered = prev.filter((e) => e.id !== ext.id)
          return [ext, ...filtered]
        })
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load extension')
    } finally {
      setInstalling(false)
    }
  }

  async function handleRemove(id: string): Promise<void> {
    try {
      await window.portalOS.extensions.remove(id)
      setExtensions((prev) => prev.filter((e) => e.id !== id))
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to remove extension')
    }
  }

  return (
    <AnimatePresence>
      {extensionsOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[45]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setExtensionsOpen(false)}
          />

          {/* Panel — top-right dropdown, like Chrome extensions menu */}
          <motion.div
            className="absolute top-12 right-28 z-[46] rounded-xl overflow-hidden"
            style={{
              width: 360,
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-dim)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04) inset'
            }}
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={springStandard}
          >
            {/* Header */}
            <div
              className="flex items-center gap-2 px-4 py-3"
              style={{ borderBottom: '1px solid var(--border-dim)' }}
            >
              <PuzzlePiece size={14} style={{ color: 'var(--accent)' }} weight="fill" />
              <span
                className="flex-1 text-[12px] tracking-wider"
                style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}
              >
                {labels.title.toUpperCase()}
              </span>
              <motion.button
                onClick={loadExtensions}
                className="w-6 h-6 flex items-center justify-center rounded opacity-30 hover:opacity-70 hover:bg-white/5 transition-all"
                title="Refresh"
                whileTap={tapPress}
                transition={springSnappy}
              >
                <ArrowClockwise size={12} />
              </motion.button>
              <motion.button
                onClick={() => setExtensionsOpen(false)}
                className="w-6 h-6 flex items-center justify-center rounded opacity-30 hover:opacity-70 hover:bg-white/5 transition-all"
                aria-label="Close"
                whileTap={tapPress}
                transition={springSnappy}
              >
                <X size={12} />
              </motion.button>
            </div>

            {/* Install area */}
            <div className="px-4 pt-3 pb-2" style={{ borderBottom: '1px solid var(--border-dim)' }}>
              <div className="flex gap-2 mb-2">
                <div className="relative flex-1">
                  <MagnifyingGlass
                    size={12}
                    className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-30"
                  />
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => {
                      setInputValue(e.target.value)
                      setError(null)
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && inputValue.trim()) handleInstall()
                      if (e.key === 'Escape') setExtensionsOpen(false)
                    }}
                    placeholder={labels.inputPlaceholder}
                    className="w-full rounded-lg pl-8 pr-3 py-2 text-[11px] outline-none transition-all"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid var(--border-dim)',
                      color: 'var(--text-primary)',
                      caretColor: 'var(--accent)'
                    }}
                  />
                </div>
                <motion.button
                  onClick={handleInstall}
                  disabled={installing || !inputValue.trim()}
                  className="px-3 py-2 rounded-lg text-[11px] tracking-wide transition-all disabled:opacity-30"
                  style={{
                    background: installing || !inputValue.trim()
                      ? 'rgba(124,106,247,0.1)'
                      : 'rgba(124,106,247,0.22)',
                    color: 'var(--accent)',
                    border: '1px solid rgba(124,106,247,0.3)'
                  }}
                  whileTap={installing ? {} : tapPress}
                  transition={springSnappy}
                >
                  {installing ? (
                    <CircleNotch size={12} className="animate-spin" />
                  ) : (
                    labels.install
                  )}
                </motion.button>
              </div>

              {/* Load unpacked button */}
              <motion.button
                onClick={handleLoadUnpacked}
                disabled={installing}
                className="flex items-center gap-2 w-full px-3 py-1.5 rounded-lg text-[11px] transition-all hover:bg-white/5 disabled:opacity-30"
                style={{ color: 'var(--text-tertiary)' }}
                whileTap={installing ? {} : tapPress}
                transition={springSnappy}
              >
                <FolderOpen size={12} />
                {labels.loadUnpacked}
              </motion.button>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    className="flex items-start gap-2 mt-2 px-3 py-2 rounded-lg"
                    style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)' }}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <WarningCircle size={12} style={{ color: '#f87171', marginTop: 1, flexShrink: 0 }} />
                    <span className="text-[10px] leading-relaxed" style={{ color: '#f87171' }}>
                      {error}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Extension list */}
            <div className="overflow-y-auto" style={{ maxHeight: 320, scrollbarWidth: 'thin' }}>
              {loading ? (
                <div className="flex items-center justify-center py-10 gap-2" style={{ color: 'var(--text-disabled)' }}>
                  <CircleNotch size={14} className="animate-spin" />
                  <span className="text-[11px]">Loading…</span>
                </div>
              ) : extensions.length === 0 ? (
                <div className="py-10 px-6 text-center">
                  <PuzzlePiece size={28} className="mx-auto mb-3 opacity-10" />
                  <p className="text-[12px] mb-1" style={{ color: 'var(--text-tertiary)' }}>
                    {labels.empty}
                  </p>
                  <p className="text-[10px]" style={{ color: 'var(--text-disabled)' }}>
                    {labels.emptyHint}
                  </p>
                </div>
              ) : (
                extensions.map((ext) => (
                  <ExtensionRow
                    key={ext.id}
                    ext={ext}
                    onRemove={handleRemove}
                    removeLabel={labels.remove}
                  />
                ))
              )}
            </div>

            {/* Footer hint */}
            <div
              className="px-4 py-2"
              style={{ borderTop: '1px solid var(--border-dim)' }}
            >
              <p className="text-[9px] tracking-wide" style={{ color: 'var(--text-disabled)', fontFamily: 'var(--font-mono)' }}>
                CHROMIUM EXTENSIONS · MV2 + MV3
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

function ExtensionRow({
  ext,
  onRemove,
  removeLabel
}: {
  ext: ExtensionInfo
  onRemove: (id: string) => void
  removeLabel: string
}): JSX.Element {
  const [confirming, setConfirming] = useState(false)

  return (
    <div
      className="flex items-start gap-3 px-4 py-3 hover:bg-white/[0.02] transition-colors"
      style={{ borderBottom: '1px solid var(--border-dim)' }}
    >
      {/* Icon placeholder */}
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: 'rgba(124,106,247,0.1)', border: '1px solid rgba(124,106,247,0.15)' }}
      >
        <PuzzlePiece size={14} style={{ color: 'rgba(124,106,247,0.6)' }} />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-[12px] font-medium truncate" style={{ color: 'var(--text-primary)' }}>
            {ext.name}
          </span>
          <span
            className="text-[9px] shrink-0 px-1.5 py-0.5 rounded"
            style={{
              background: 'rgba(74,222,128,0.1)',
              color: '#4ade80',
              fontFamily: 'var(--font-mono)'
            }}
          >
            v{ext.version}
          </span>
        </div>
        {ext.description && (
          <p
            className="text-[10px] mt-0.5 line-clamp-2 leading-relaxed"
            style={{ color: 'var(--text-disabled)' }}
          >
            {ext.description}
          </p>
        )}
      </div>

      {/* Remove */}
      <AnimatePresence mode="wait">
        {confirming ? (
          <motion.button
            key="confirm"
            onClick={() => onRemove(ext.id)}
            className="shrink-0 px-2 py-1 rounded text-[10px] transition-all"
            style={{
              background: 'rgba(248,113,113,0.15)',
              color: '#f87171',
              border: '1px solid rgba(248,113,113,0.3)'
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileTap={tapPress}
          >
            {removeLabel}
          </motion.button>
        ) : (
          <motion.button
            key="trash"
            onClick={() => setConfirming(true)}
            onBlur={() => setTimeout(() => setConfirming(false), 200)}
            className="w-7 h-7 flex items-center justify-center rounded opacity-20 hover:opacity-60 hover:bg-white/5 transition-all shrink-0"
            title={removeLabel}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: undefined, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileTap={tapPress}
          >
            <Trash size={12} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
