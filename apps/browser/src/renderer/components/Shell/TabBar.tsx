import { useState, useRef, useEffect, memo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, SpeakerHigh, SpeakerSlash } from '@phosphor-icons/react'
import { useTabsStore, TabState } from '@store/tabs.store'
import Favicon from '@components/Common/Favicon'
import { springElastic, springQuick, springSnappy, tabVariants, tapPress } from '@lib/motion'

export default function TabBar(): JSX.Element {
  const tabs = useTabsStore((s) => s.tabs)
  const activeTabId = useTabsStore((s) => s.activeTabId)
  const addTab = useTabsStore((s) => s.addTab)

  const handleNewTab = useCallback(() => {
    void addTab()
  }, [addTab])

  return (
    <div
      className="flex items-center h-9 shrink-0 overflow-x-auto overflow-y-hidden"
      style={{
        background: 'var(--bg-void)',
        borderBottom: '1px solid var(--border-dim)',
        scrollbarWidth: 'none',
        paddingLeft: 'clamp(4px, 0.4vw, 8px)',
        paddingRight: 'clamp(4px, 0.4vw, 8px)'
      }}
    >
      <AnimatePresence initial={false} mode="popLayout">
        {tabs.map((tab) => (
          <Tab key={tab.id} tab={tab} isActive={tab.id === activeTabId} />
        ))}
      </AnimatePresence>

      <motion.button
        onClick={handleNewTab}
        className="flex items-center justify-center w-7 h-7 rounded-md ml-0.5 shrink-0
                   opacity-30 hover:opacity-70 hover:bg-white/5 transition-all"
        whileHover={{ scale: 1.08, y: -1 }}
        whileTap={tapPress}
        transition={springSnappy}
        aria-label="New tab"
      >
        <Plus size={14} />
      </motion.button>
    </div>
  )
}

const Tab = memo(function Tab({
  tab,
  isActive
}: {
  tab: TabState
  isActive: boolean
}): JSX.Element {
  const setActiveTab = useTabsStore((s) => s.setActiveTab)
  const closeTab = useTabsStore((s) => s.closeTab)
  const toggleMute = useTabsStore((s) => s.toggleMute)
  const duplicateTab = useTabsStore((s) => s.duplicateTab)
  const closeOtherTabs = useTabsStore((s) => s.closeOtherTabs)
  const closeTabsToRight = useTabsStore((s) => s.closeTabsToRight)
  const reload = useTabsStore((s) => s.reload)

  const onActivate = useCallback(() => setActiveTab(tab.id), [setActiveTab, tab.id])

  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const title = tab.title || 'New Tab'
  const isNewTab = tab.isInternalPage
  const faviconUrl = tab.favicon

  // Close context menu on outside click
  useEffect(() => {
    if (!contextMenu) return
    const close = (e: MouseEvent): void => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setContextMenu(null)
      }
    }
    window.addEventListener('mousedown', close)
    return () => window.removeEventListener('mousedown', close)
  }, [contextMenu])

  function handleContextMenu(e: React.MouseEvent): void {
    e.preventDefault()
    setContextMenu({ x: e.clientX, y: e.clientY })
  }

  function menuAction(fn: () => void): void {
    fn()
    setContextMenu(null)
  }

  return (
    <>
      <motion.div
        layout="position"
        variants={tabVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{
          default: springQuick,
          scale: springElastic,
          layout: springQuick
        }}
        whileHover={!isActive ? { y: -1 } : undefined}
        onClick={onActivate}
        onContextMenu={handleContextMenu}
        className="flex items-center gap-1.5 h-7 px-2.5 rounded-md cursor-pointer shrink-0 group
                   transition-colors duration-100"
        style={{
          maxWidth: 220,
          minWidth: 60,
          background: isActive ? 'var(--bg-surface)' : 'transparent',
          borderLeft: isActive ? '2px solid var(--accent)' : '2px solid transparent'
        }}
        onMouseEnter={(e) => {
          if (!isActive) e.currentTarget.style.background = 'var(--bg-elevated)'
        }}
        onMouseLeave={(e) => {
          if (!isActive) e.currentTarget.style.background = 'transparent'
        }}
      >
        {/* Favicon / Loading spinner */}
        <div className="w-3.5 h-3.5 shrink-0 flex items-center justify-center">
          {tab.isLoading ? (
            <div className="w-3 h-3 border border-white/20 border-t-[var(--accent)] rounded-full animate-spin" />
          ) : (
            <Favicon url={isNewTab ? undefined : tab.url} favicon={isNewTab ? undefined : faviconUrl} size={14} />
          )}
        </div>

        {/* Title */}
        <span
          className="text-[11px] truncate flex-1 select-none"
          style={{ color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)' }}
        >
          {isNewTab ? 'New Tab' : title}
        </span>

        {/* Audio indicator — click to mute */}
        {(tab.isAudioPlaying || tab.isMuted) && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              toggleMute(tab.id)
            }}
            className="shrink-0 opacity-40 hover:opacity-80 transition-opacity"
            aria-label={tab.isMuted ? 'Unmute tab' : 'Mute tab'}
          >
            {tab.isMuted ? <SpeakerSlash size={10} /> : <SpeakerHigh size={10} />}
          </button>
        )}

        {/* Close button */}
        <motion.button
          onClick={(e) => {
            e.stopPropagation()
            closeTab(tab.id)
          }}
          className="w-4 h-4 flex items-center justify-center rounded-sm opacity-0 group-hover:opacity-40
                     hover:!opacity-80 hover:bg-white/10 transition-all shrink-0"
          aria-label="Close tab"
          whileTap={tapPress}
          transition={springSnappy}
        >
          <X size={10} />
        </motion.button>
      </motion.div>

      {/* Context menu */}
      {contextMenu && (
        <div
          ref={menuRef}
          className="fixed z-[100] py-1 min-w-[180px] rounded-lg overflow-hidden"
          style={{
            left: contextMenu.x,
            top: contextMenu.y,
            background: 'var(--glass-bg)',
            backdropFilter: 'blur(var(--glass-blur))',
            border: '1px solid var(--border-mid)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
          }}
        >
          <ContextMenuItem label="Reload" onClick={() => menuAction(() => {
            useTabsStore.getState().setActiveTab(tab.id)
            reload()
          })} />
          <ContextMenuItem label="Duplicate tab" onClick={() => menuAction(() => duplicateTab(tab.id))} />
          {(tab.isAudioPlaying || tab.isMuted) && (
            <ContextMenuItem
              label={tab.isMuted ? 'Unmute tab' : 'Mute tab'}
              onClick={() => menuAction(() => toggleMute(tab.id))}
            />
          )}
          <div className="h-px mx-2 my-1" style={{ background: 'var(--border-dim)' }} />
          <ContextMenuItem label="Close tab" onClick={() => menuAction(() => closeTab(tab.id))} />
          <ContextMenuItem label="Close other tabs" onClick={() => menuAction(() => closeOtherTabs(tab.id))} />
          <ContextMenuItem label="Close tabs to the right" onClick={() => menuAction(() => closeTabsToRight(tab.id))} />
        </div>
      )}
    </>
  )
})

const ContextMenuItem = memo(function ContextMenuItem({
  label,
  onClick
}: {
  label: string
  onClick: () => void
}): JSX.Element {
  return (
    <button
      onClick={onClick}
      className="w-full text-left px-3 py-1.5 text-[12px] hover:bg-white/5 transition-colors"
      style={{ color: 'var(--text-secondary)' }}
    >
      {label}
    </button>
  )
})
