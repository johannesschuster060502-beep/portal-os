import { useState, useEffect, useRef, useMemo } from 'react'
import { motion } from 'framer-motion'
import { springStandard, overlayVariants, duration } from '@lib/motion'
import {
  MagnifyingGlass,
  Globe,
  ClockCounterClockwise,
  Star,
  Gear,
  Plus,
  BookmarkSimple,
  Lightning
} from '@phosphor-icons/react'
import { useUIStore } from '@store/ui.store'
import { useTabsStore } from '@store/tabs.store'
import { useI18nStore } from '@store/i18n.store'

interface OmniResult {
  id: string
  type: 'tab' | 'history' | 'bookmark' | 'action'
  title: string
  subtitle: string
  icon: JSX.Element
  action: () => void
}

export default function Omnibox(): JSX.Element {
  const setOmnibox = useUIStore((s) => s.setOmnibox)
  const openStudoxCore = useUIStore((s) => s.openStudoxCore)
  const tabs = useTabsStore((s) => s.tabs)
  const navigateTo = useTabsStore((s) => s.navigateTo)
  const addTab = useTabsStore((s) => s.addTab)
  const t = useI18nStore((s) => s.t)

  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [historyResults, setHistoryResults] = useState<unknown[]>([])
  const [bookmarkResults, setBookmarkResults] = useState<unknown[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Search history and bookmarks as user types
  useEffect(() => {
    if (query.length < 1) {
      setHistoryResults([])
      setBookmarkResults([])
      return
    }
    window.portalOS.db.searchHistory(query, 5).then(setHistoryResults)
    window.portalOS.db.getBookmarks().then((bm) => {
      const filtered = (bm as { title: string; url: string }[]).filter(
        (b) =>
          b.title.toLowerCase().includes(query.toLowerCase()) ||
          b.url.toLowerCase().includes(query.toLowerCase())
      )
      setBookmarkResults(filtered.slice(0, 3))
    })
  }, [query])

  const results = useMemo<OmniResult[]>(() => {
    const items: OmniResult[] = []

    // Open tabs matching query
    const matchingTabs = tabs.filter(
      (t) =>
        !t.isInternalPage &&
        (t.title.toLowerCase().includes(query.toLowerCase()) ||
          t.url.toLowerCase().includes(query.toLowerCase()))
    )
    for (const t of matchingTabs.slice(0, 3)) {
      items.push({
        id: `tab-${t.id}`,
        type: 'tab',
        title: t.title || 'Untitled',
        subtitle: t.url,
        icon: <Globe size={14} className="opacity-40" />,
        action: () => {
          useTabsStore.getState().setActiveTab(t.id)
          setOmnibox(false)
        }
      })
    }

    // History results
    for (const h of historyResults as { url: string; title: string }[]) {
      if (items.find((i) => i.subtitle === h.url)) continue
      items.push({
        id: `hist-${h.url}`,
        type: 'history',
        title: h.title || h.url,
        subtitle: h.url,
        icon: <ClockCounterClockwise size={14} className="opacity-40" />,
        action: () => {
          navigateTo(h.url)
          setOmnibox(false)
        }
      })
    }

    // Bookmark results
    for (const b of bookmarkResults as { url: string; title: string }[]) {
      if (items.find((i) => i.subtitle === b.url)) continue
      items.push({
        id: `bm-${b.url}`,
        type: 'bookmark',
        title: b.title || b.url,
        subtitle: b.url,
        icon: <Star size={14} className="opacity-40" />,
        action: () => {
          navigateTo(b.url)
          setOmnibox(false)
        }
      })
    }

    // Quick actions
    const actions: OmniResult[] = [
      {
        id: 'action-studox',
        type: 'action',
        title: t.omnibox.actionStudoxCore,
        subtitle: 'core.studox.eu',
        icon: <Lightning size={14} weight="fill" style={{ color: 'var(--accent)' }} />,
        action: () => {
          setOmnibox(false)
          openStudoxCore()
        }
      },
      {
        id: 'action-newtab',
        type: 'action',
        title: t.omnibox.actionNewTab,
        subtitle: t.newtab.newTab,
        icon: <Plus size={14} className="opacity-40" />,
        action: () => {
          addTab()
          setOmnibox(false)
        }
      },
      {
        id: 'action-settings',
        type: 'action',
        title: t.omnibox.actionSettings,
        subtitle: t.settings.title,
        icon: <Gear size={14} className="opacity-40" />,
        action: () => {
          useUIStore.getState().setSettings(true)
          setOmnibox(false)
        }
      },
      {
        id: 'action-bookmarks',
        type: 'action',
        title: t.omnibox.actionBookmarks,
        subtitle: t.sidebar.bookmarks,
        icon: <BookmarkSimple size={14} className="opacity-40" />,
        action: () => {
          useUIStore.getState().setSidebar(true)
          setOmnibox(false)
        }
      }
    ]

    const matchingActions = query
      ? actions.filter((a) => a.title.toLowerCase().includes(query.toLowerCase()))
      : actions

    items.push(...matchingActions)

    return items
  }, [query, tabs, historyResults, bookmarkResults, t, addTab, navigateTo, openStudoxCore, setOmnibox])

  // Reset selection on results change
  useEffect(() => {
    setSelectedIndex(0)
  }, [results.length])

  function handleKeyDown(e: React.KeyboardEvent): void {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((i) => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (results[selectedIndex]) {
        results[selectedIndex].action()
      } else if (query.trim()) {
        navigateTo(query.trim())
        setOmnibox(false)
      }
    } else if (e.key === 'Escape') {
      setOmnibox(false)
    }
  }

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: duration.fast }}
      onClick={() => setOmnibox(false)}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{
          background: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(8px)'
        }}
      />

      {/* Modal */}
      <motion.div
        className="relative w-[640px] max-h-[60vh] flex flex-col overflow-hidden"
        style={{
          background: 'var(--glass-bg)',
          border: '1px solid var(--border-mid)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: '0 40px 100px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04) inset'
        }}
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={springStandard}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
      >
        {/* Search input */}
        <div
          className="flex items-center gap-3 px-5 h-14 shrink-0"
          style={{ borderBottom: '1px solid var(--border-dim)' }}
        >
          <MagnifyingGlass size={18} className="opacity-25 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t.omnibox.placeholder}
            className="flex-1 bg-transparent border-none outline-none text-[14px] text-white/85
                       placeholder:text-white/20"
            style={{ fontFamily: 'var(--font-ui)', caretColor: 'var(--accent)' }}
            spellCheck={false}
            autoComplete="off"
          />
          <span
            className="text-[10px] px-1.5 py-0.5 rounded opacity-20"
            style={{
              border: '1px solid var(--border-subtle)',
              fontFamily: 'var(--font-mono)'
            }}
          >
            ESC
          </span>
        </div>

        {/* Results */}
        <div className="overflow-y-auto py-2 px-2" style={{ scrollbarWidth: 'thin' }}>
          {results.length === 0 && query.trim() && (
            <div className="flex flex-col items-center justify-center gap-2 py-10">
              <div
                className="w-9 h-9 flex items-center justify-center rounded-full"
                style={{
                  background: 'var(--accent-dim)',
                  border: '1px solid rgba(124,106,247,0.15)'
                }}
              >
                <MagnifyingGlass size={14} className="opacity-40" />
              </div>
              <p className="text-[12px]" style={{ color: 'var(--text-tertiary)' }}>
                {t.omnibox.noResults}
              </p>
            </div>
          )}
          {results.length === 0 && !query.trim() && (
            <div className="px-3 py-6 text-center">
              <p className="text-[11px]" style={{ color: 'var(--text-disabled)' }}>
                {t.omnibox.placeholder}
              </p>
            </div>
          )}

          {/* Group: Open Tabs */}
          {results.some((r) => r.type === 'tab') && (
            <GroupLabel label={t.omnibox.openTabs} />
          )}
          {results
            .filter((r) => r.type === 'tab')
            .map((r) => (
              <ResultRow
                key={r.id}
                result={r}
                selected={results.indexOf(r) === selectedIndex}
                onSelect={r.action}
                onHover={() => setSelectedIndex(results.indexOf(r))}
              />
            ))}

          {/* Group: History */}
          {results.some((r) => r.type === 'history') && (
            <GroupLabel label={t.omnibox.history} />
          )}
          {results
            .filter((r) => r.type === 'history')
            .map((r) => (
              <ResultRow
                key={r.id}
                result={r}
                selected={results.indexOf(r) === selectedIndex}
                onSelect={r.action}
                onHover={() => setSelectedIndex(results.indexOf(r))}
              />
            ))}

          {/* Group: Bookmarks */}
          {results.some((r) => r.type === 'bookmark') && (
            <GroupLabel label={t.omnibox.bookmarks} />
          )}
          {results
            .filter((r) => r.type === 'bookmark')
            .map((r) => (
              <ResultRow
                key={r.id}
                result={r}
                selected={results.indexOf(r) === selectedIndex}
                onSelect={r.action}
                onHover={() => setSelectedIndex(results.indexOf(r))}
              />
            ))}

          {/* Group: Actions */}
          {results.some((r) => r.type === 'action') && (
            <GroupLabel label={t.omnibox.actions} />
          )}
          {results
            .filter((r) => r.type === 'action')
            .map((r) => (
              <ResultRow
                key={r.id}
                result={r}
                selected={results.indexOf(r) === selectedIndex}
                onSelect={r.action}
                onHover={() => setSelectedIndex(results.indexOf(r))}
              />
            ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

function GroupLabel({ label }: { label: string }): JSX.Element {
  return (
    <div
      className="text-[10px] tracking-[0.15em] px-3 pt-3 pb-1"
      style={{ color: 'var(--text-disabled)', fontFamily: 'var(--font-mono)' }}
    >
      {label}
    </div>
  )
}

function ResultRow({
  result,
  selected,
  onSelect,
  onHover
}: {
  result: OmniResult
  selected: boolean
  onSelect: () => void
  onHover: () => void
}): JSX.Element {
  return (
    <button
      onClick={onSelect}
      onMouseEnter={onHover}
      className="flex items-center gap-3 w-full px-3 py-2 rounded-lg transition-colors text-left"
      style={{
        background: selected ? 'rgba(255,255,255,0.05)' : 'transparent'
      }}
    >
      <div className="shrink-0">{result.icon}</div>
      <div className="flex-1 min-w-0">
        <div className="text-[13px] truncate" style={{ color: 'var(--text-primary)' }}>
          {result.title}
        </div>
        <div className="text-[11px] truncate" style={{ color: 'var(--text-tertiary)' }}>
          {result.subtitle}
        </div>
      </div>
      {selected && (
        <span
          className="text-[10px] px-1.5 py-0.5 rounded shrink-0"
          style={{
            color: 'var(--text-disabled)',
            border: '1px solid var(--border-dim)',
            fontFamily: 'var(--font-mono)'
          }}
        >
          ↵
        </span>
      )}
    </button>
  )
}
