import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { springStandard } from '@lib/motion'
import {
  Star,
  ClockCounterClockwise,
  CaretRight,
  X
} from '@phosphor-icons/react'
import { useUIStore } from '@store/ui.store'
import { useTabsStore } from '@store/tabs.store'
import Favicon from '@components/Common/Favicon'

type SidebarSection = 'bookmarks' | 'history'

interface HistoryItem {
  id: number
  url: string
  title: string
  favicon_url: string
  visited_at: string
  visit_count: number
}

interface BookmarkItem {
  id: number
  url: string
  title: string
  favicon_url: string
}

export default function Sidebar(): JSX.Element {
  const setSidebar = useUIStore((s) => s.setSidebar)
  const navigateTo = useTabsStore((s) => s.navigateTo)
  const [section, setSection] = useState<SidebarSection>('bookmarks')
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([])
  const [history, setHistory] = useState<HistoryItem[]>([])

  useEffect(() => {
    window.portalOS.db.getBookmarks().then((b) => setBookmarks(b as BookmarkItem[]))
    window.portalOS.db.getHistory(50).then((h) => setHistory(h as HistoryItem[]))
  }, [])

  return (
    <motion.div
      className="absolute left-0 top-0 bottom-0 z-[50] flex flex-col shrink-0"
      style={{
        width: 260,
        background: 'var(--bg-base)',
        borderRight: '1px solid var(--border-dim)'
      }}
      initial={{ x: -260, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -260, opacity: 0 }}
      transition={springStandard}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 h-10 shrink-0"
        style={{ borderBottom: '1px solid var(--border-dim)' }}
      >
        <div className="flex items-center gap-1">
          <SectionTab
            active={section === 'bookmarks'}
            onClick={() => setSection('bookmarks')}
            icon={<Star size={12} />}
            label="Bookmarks"
          />
          <SectionTab
            active={section === 'history'}
            onClick={() => setSection('history')}
            icon={<ClockCounterClockwise size={12} />}
            label="History"
          />
        </div>
        <button
          onClick={() => setSidebar(false)}
          className="w-6 h-6 flex items-center justify-center rounded-md opacity-30
                     hover:opacity-70 hover:bg-white/5 transition-all"
          aria-label="Close sidebar"
        >
          <X size={12} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto py-2 px-2" style={{ scrollbarWidth: 'thin' }}>
        {section === 'bookmarks' && (
          <>
            {bookmarks.length === 0 ? (
              <EmptyState text="No bookmarks yet" sub="Press Ctrl+D to bookmark a page" />
            ) : (
              bookmarks.map((bm) => (
                <SidebarItem
                  key={bm.id}
                  title={bm.title || bm.url}
                  subtitle={bm.url}
                  favicon={bm.favicon_url}
                  url={bm.url}
                  onClick={() => navigateTo(bm.url)}
                />
              ))
            )}
          </>
        )}

        {section === 'history' && (
          <>
            {history.length === 0 ? (
              <EmptyState text="No history yet" sub="Start browsing to build history" />
            ) : (
              history.map((h) => (
                <SidebarItem
                  key={`${h.id}-${h.visited_at}`}
                  title={h.title || h.url}
                  subtitle={formatHistoryTime(h.visited_at)}
                  favicon={h.favicon_url}
                  url={h.url}
                  onClick={() => navigateTo(h.url)}
                />
              ))
            )}
          </>
        )}
      </div>
    </motion.div>
  )
}

function SectionTab({
  active,
  onClick,
  icon,
  label
}: {
  active: boolean
  onClick: () => void
  icon: JSX.Element
  label: string
}): JSX.Element {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] transition-all"
      style={{
        background: active ? 'rgba(255,255,255,0.05)' : 'transparent',
        color: active ? 'var(--text-primary)' : 'var(--text-tertiary)'
      }}
    >
      {icon}
      {label}
    </button>
  )
}

function SidebarItem({
  title,
  subtitle,
  favicon,
  url,
  onClick
}: {
  title: string
  subtitle: string
  favicon?: string
  url?: string
  onClick: () => void
}): JSX.Element {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2.5 w-full px-2.5 py-2 rounded-lg hover:bg-white/[0.03]
                 transition-colors text-left group"
    >
      <Favicon url={url} favicon={favicon} size={14} />
      <div className="flex-1 min-w-0">
        <div className="text-[11px] truncate" style={{ color: 'var(--text-secondary)' }}>
          {title}
        </div>
        <div className="text-[10px] truncate" style={{ color: 'var(--text-disabled)' }}>
          {subtitle}
        </div>
      </div>
      <CaretRight size={10} className="opacity-0 group-hover:opacity-20 transition-opacity shrink-0" />
    </button>
  )
}

function EmptyState({ text, sub }: { text: string; sub: string }): JSX.Element {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-2">
      <p className="text-[12px]" style={{ color: 'var(--text-tertiary)' }}>{text}</p>
      <p className="text-[10px]" style={{ color: 'var(--text-disabled)' }}>{sub}</p>
    </div>
  )
}

function formatHistoryTime(dateStr: string): string {
  try {
    const d = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - d.getTime()
    const diffMin = Math.floor(diffMs / 60000)

    if (diffMin < 1) return 'Just now'
    if (diffMin < 60) return `${diffMin}m ago`
    const diffHr = Math.floor(diffMin / 60)
    if (diffHr < 24) return `${diffHr}h ago`
    const diffDay = Math.floor(diffHr / 24)
    if (diffDay < 7) return `${diffDay}d ago`
    return d.toLocaleDateString()
  } catch {
    return dateStr
  }
}
