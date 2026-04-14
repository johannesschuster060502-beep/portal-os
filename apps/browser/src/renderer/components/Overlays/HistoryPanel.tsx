import { useState, useEffect, useRef, useMemo } from 'react'
import { motion } from 'framer-motion'
import { X, MagnifyingGlass, Trash } from '@phosphor-icons/react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { springStandard, overlayVariants, duration } from '@lib/motion'
import { useUIStore } from '@store/ui.store'
import { useTabsStore } from '@store/tabs.store'
import { useI18nStore } from '@store/i18n.store'
import Favicon from '@components/Common/Favicon'

interface HistoryEntry {
  id: number
  url: string
  title: string
  favicon_url: string
  visited_at: string
  visit_count: number
}

export default function HistoryPanel(): JSX.Element {
  const setHistoryOpen = useUIStore((s) => s.setHistoryOpen)
  const navigateTo = useTabsStore((s) => s.navigateTo)
  const t = useI18nStore((s) => s.t)
  const [entries, setEntries] = useState<HistoryEntry[]>([])
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
    loadHistory()
  }, [])

  useEffect(() => {
    if (query) {
      window.portalOS.db.searchHistory(query, 500).then((r) => setEntries(r as HistoryEntry[]))
    } else {
      loadHistory()
    }
  }, [query])

  function loadHistory(): void {
    window.portalOS.db.getHistory(500).then((r) => setEntries(r as HistoryEntry[]))
  }

  function clearAll(): void {
    window.portalOS.db.clearHistory()
    setEntries([])
  }

  // Group entries with section headers
  const rows = useMemo(() => {
    const result: ({ type: 'header'; label: string } | { type: 'entry'; entry: HistoryEntry })[] = []
    const now = new Date()
    const today = now.toDateString()
    const yesterday = new Date(now.getTime() - 86400000).toDateString()
    let lastLabel = ''

    for (const entry of entries) {
      const d = new Date(entry.visited_at)
      const ds = d.toDateString()
      let label: string
      if (ds === today) label = t.history.today
      else if (ds === yesterday) label = t.history.yesterday
      else {
        const diff = Math.floor((now.getTime() - d.getTime()) / 86400000)
        label = diff < 7 ? t.history.thisWeek : t.history.older
      }

      if (label !== lastLabel) {
        result.push({ type: 'header', label })
        lastLabel = label
      }
      result.push({ type: 'entry', entry })
    }
    return result
  }, [entries, t])

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => listRef.current,
    estimateSize: (i) => (rows[i].type === 'header' ? 32 : 44),
    overscan: 10
  })

  return (
    <motion.div
      className="fixed inset-0 z-[150] flex"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: duration.fast }}
    >
      <div
        className="absolute inset-0"
        style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
        onClick={() => setHistoryOpen(false)}
      />

      <motion.div
        className="relative m-auto w-[600px] max-h-[75vh] flex flex-col overflow-hidden"
        style={{
          background: 'var(--bg-base)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: '0 40px 100px rgba(0,0,0,0.6)'
        }}
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={springStandard}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 h-12 shrink-0"
          style={{ borderBottom: '1px solid var(--border-dim)' }}
        >
          <span className="text-[13px]" style={{ color: 'var(--text-primary)' }}>{t.history.title}</span>
          <div className="flex items-center gap-2">
            <button
              onClick={clearAll}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] opacity-40
                         hover:opacity-80 hover:bg-white/5 transition-all"
              style={{ color: 'var(--danger)' }}
              aria-label={t.history.clearAll}
            >
              <Trash size={12} />
              {t.history.clearAll}
            </button>
            <button
              onClick={() => setHistoryOpen(false)}
              className="w-6 h-6 flex items-center justify-center rounded-md opacity-30
                         hover:opacity-70 hover:bg-white/5 transition-all"
              aria-label={t.common.close}
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="px-4 py-3 shrink-0" style={{ borderBottom: '1px solid var(--border-dim)' }}>
          <div
            className="flex items-center gap-2 h-8 px-3 rounded-lg"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-dim)' }}
          >
            <MagnifyingGlass size={13} className="opacity-20 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.history.searchPlaceholder}
              className="flex-1 bg-transparent border-none outline-none text-[12px] text-white/80
                         placeholder:text-white/20"
              spellCheck={false}
              aria-label={t.history.searchPlaceholder}
            />
          </div>
        </div>

        {/* Virtualized history list */}
        <div
          ref={listRef}
          className="flex-1 overflow-y-auto px-2"
          style={{ scrollbarWidth: 'thin' }}
        >
          {rows.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 gap-2">
              <p className="text-[12px]" style={{ color: 'var(--text-tertiary)' }}>
                {query ? t.history.noResults : t.history.noHistory}
              </p>
            </div>
          )}

          {rows.length > 0 && (
            <div
              style={{ height: virtualizer.getTotalSize(), width: '100%', position: 'relative' }}
            >
              {virtualizer.getVirtualItems().map((virtualRow) => {
                const row = rows[virtualRow.index]
                return (
                  <div
                    key={virtualRow.key}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: virtualRow.size,
                      transform: `translateY(${virtualRow.start}px)`
                    }}
                  >
                    {row.type === 'header' ? (
                      <div
                        className="text-[10px] tracking-[0.15em] px-3 pt-3 pb-1"
                        style={{
                          color: 'var(--text-disabled)',
                          fontFamily: 'var(--font-mono)'
                        }}
                      >
                        {row.label}
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          navigateTo(row.entry.url)
                          setHistoryOpen(false)
                        }}
                        className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg
                                   hover:bg-white/[0.03] transition-colors text-left"
                      >
                        <Favicon url={row.entry.url} favicon={row.entry.favicon_url} size={14} />
                        <div className="flex-1 min-w-0">
                          <div
                            className="text-[12px] truncate"
                            style={{ color: 'var(--text-secondary)' }}
                          >
                            {row.entry.title || row.entry.url}
                          </div>
                          <div
                            className="text-[10px] truncate"
                            style={{ color: 'var(--text-disabled)' }}
                          >
                            {row.entry.url}
                          </div>
                        </div>
                        <span
                          className="text-[10px] shrink-0"
                          style={{
                            color: 'var(--text-disabled)',
                            fontFamily: 'var(--font-mono)'
                          }}
                        >
                          {formatTime(row.entry.visited_at)}
                        </span>
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

function formatTime(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  } catch {
    return ''
  }
}
