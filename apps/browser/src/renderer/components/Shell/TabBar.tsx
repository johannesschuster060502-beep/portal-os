import { useState, useRef, useEffect, memo, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Plus,
  SpeakerHigh,
  SpeakerSlash,
  Folder,
  FolderOpen
} from '@phosphor-icons/react'
import { useTabsStore, TabState } from '@store/tabs.store'
import { useGroupsStore, TabGroup, groupColors, colorHex, GroupColor } from '@store/groups.store'
import { useI18nStore } from '@store/i18n.store'
import Favicon from '@components/Common/Favicon'
import { springElastic, springQuick, springSnappy, tabVariants, tapPress } from '@lib/motion'

/**
 * Portal OS — Tab Bar
 *
 * Features:
 *   - Drag-region on empty space (like Chrome)
 *   - Tab groups à la Opera GX (color, name, collapse)
 *   - New active-tab indicator: accent underline at bottom (no more left-border clipping favicons)
 *   - Per-group pill with collapse toggle
 *   - Right-click context menu with group operations
 */

interface TabBarRow {
  type: 'tab' | 'group-pill'
  tab?: TabState
  group?: TabGroup
  memberCount?: number
}

export default function TabBar(): JSX.Element {
  const tabs = useTabsStore((s) => s.tabs)
  const activeTabId = useTabsStore((s) => s.activeTabId)
  const addTab = useTabsStore((s) => s.addTab)
  const tabToGroup = useGroupsStore((s) => s.tabToGroup)
  const groups = useGroupsStore((s) => s.groups)
  const toggleCollapse = useGroupsStore((s) => s.toggleCollapse)

  const handleNewTab = useCallback(() => {
    void addTab()
  }, [addTab])

  // Build the ordered row list respecting groups
  // - Tabs without a group render as-is in original order
  // - Tabs in a collapsed group are hidden, replaced by one pill
  // - Tabs in an expanded group render inside a visible border wrapper
  const rows = useMemo<TabBarRow[]>(() => {
    const result: TabBarRow[] = []
    const seenGroups = new Set<string>()

    for (const tab of tabs) {
      const groupId = tabToGroup[tab.id]
      if (!groupId) {
        result.push({ type: 'tab', tab })
        continue
      }
      const group = groups.find((g) => g.id === groupId)
      if (!group) {
        result.push({ type: 'tab', tab })
        continue
      }

      if (group.collapsed) {
        if (!seenGroups.has(group.id)) {
          const memberCount = tabs.filter((t) => tabToGroup[t.id] === group.id).length
          result.push({ type: 'group-pill', group, memberCount })
          seenGroups.add(group.id)
        }
        // Collapsed: skip individual tabs
        continue
      }

      // Expanded group: tabs render normally but wrapped visually
      if (!seenGroups.has(group.id)) {
        result.push({ type: 'group-pill', group, memberCount: tabs.filter((t) => tabToGroup[t.id] === group.id).length })
        seenGroups.add(group.id)
      }
      result.push({ type: 'tab', tab })
    }

    return result
  }, [tabs, tabToGroup, groups])

  return (
    <div
      className="drag-region relative flex items-end h-9 shrink-0 overflow-x-auto overflow-y-hidden"
      style={{
        background: 'var(--bg-void)',
        borderBottom: '1px solid var(--border-dim)',
        scrollbarWidth: 'none',
        paddingLeft: 'clamp(4px, 0.4vw, 8px)',
        paddingRight: 'clamp(4px, 0.4vw, 8px)'
      }}
    >
      <div className="no-drag flex items-end h-full">
        <AnimatePresence initial={false} mode="popLayout">
          {rows.map((row, idx) => {
            if (row.type === 'group-pill' && row.group) {
              return (
                <GroupPill
                  key={`group-${row.group.id}`}
                  group={row.group}
                  memberCount={row.memberCount ?? 0}
                  onToggle={() => toggleCollapse(row.group!.id)}
                />
              )
            }
            if (row.type === 'tab' && row.tab) {
              const group = row.tab && tabToGroup[row.tab.id]
                ? groups.find((g) => g.id === tabToGroup[row.tab!.id])
                : undefined
              return (
                <Tab
                  key={row.tab.id}
                  tab={row.tab}
                  isActive={row.tab.id === activeTabId}
                  group={group}
                  isFirstInGroup={isFirstInGroup(rows, idx)}
                  isLastInGroup={isLastInGroup(rows, idx)}
                />
              )
            }
            return null
          })}
        </AnimatePresence>

        <motion.button
          onClick={handleNewTab}
          className="flex items-center justify-center w-7 h-7 rounded-md ml-1 mb-1 shrink-0 opacity-40 hover:opacity-90 hover:bg-white/5 transition-colors"
          whileHover={{ scale: 1.08, y: -1 }}
          whileTap={tapPress}
          transition={springSnappy}
          aria-label="New tab"
        >
          <Plus size={14} />
        </motion.button>
      </div>

      {/* Empty space after controls acts as drag-region (inherited from parent) */}
      <div className="flex-1 h-full" />
    </div>
  )
}

function isFirstInGroup(rows: TabBarRow[], idx: number): boolean {
  const row = rows[idx]
  if (row.type !== 'tab' || !row.tab) return false
  const prev = rows[idx - 1]
  return !prev || prev.type === 'group-pill' || !prev.tab
}

function isLastInGroup(rows: TabBarRow[], idx: number): boolean {
  const row = rows[idx]
  if (row.type !== 'tab' || !row.tab) return false
  const next = rows[idx + 1]
  if (!next) return true
  if (next.type === 'group-pill') return true
  return false
}

// ══════════════════════════════════════════════════════════════
//  GROUP PILL
// ══════════════════════════════════════════════════════════════

const GroupPill = memo(function GroupPill({
  group,
  memberCount,
  onToggle
}: {
  group: TabGroup
  memberCount: number
  onToggle: () => void
}): JSX.Element {
  const [menu, setMenu] = useState<{ x: number; y: number } | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const renameGroup = useGroupsStore((s) => s.renameGroup)
  const setGroupColor = useGroupsStore((s) => s.setGroupColor)
  const deleteGroup = useGroupsStore((s) => s.deleteGroup)
  const [renaming, setRenaming] = useState(false)
  const [nameValue, setNameValue] = useState(group.name)
  const color = colorHex(group.color)

  useEffect(() => {
    setNameValue(group.name)
  }, [group.name])

  useEffect(() => {
    if (!menu) return
    const close = (e: MouseEvent): void => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenu(null)
      }
    }
    window.addEventListener('mousedown', close)
    return () => window.removeEventListener('mousedown', close)
  }, [menu])

  function handleContextMenu(e: React.MouseEvent): void {
    e.preventDefault()
    setMenu({ x: e.clientX, y: e.clientY })
  }

  function commitRename(): void {
    if (nameValue.trim()) renameGroup(group.id, nameValue.trim())
    setRenaming(false)
  }

  return (
    <>
      <motion.div
        layout="position"
        initial={{ scale: 0.9, opacity: 0, width: 0 }}
        animate={{ scale: 1, opacity: 1, width: 'auto' }}
        exit={{ scale: 0.9, opacity: 0, width: 0 }}
        transition={{ default: springQuick, scale: springElastic, layout: springQuick }}
        onDoubleClick={() => setRenaming(true)}
        onContextMenu={handleContextMenu}
        className="flex items-center gap-1.5 h-7 px-2.5 mx-0.5 mb-1 rounded-lg cursor-pointer shrink-0 select-none"
        style={{
          background: `${color}14`,
          border: `1px solid ${color}40`,
          maxWidth: 200
        }}
      >
        <motion.button
          onClick={onToggle}
          className="flex items-center justify-center w-3.5 h-3.5 shrink-0"
          whileTap={tapPress}
          aria-label={group.collapsed ? 'Expand group' : 'Collapse group'}
        >
          {group.collapsed ? (
            <Folder size={11} weight="fill" style={{ color }} />
          ) : (
            <FolderOpen size={11} weight="fill" style={{ color }} />
          )}
        </motion.button>

        {renaming ? (
          <input
            type="text"
            value={nameValue}
            onChange={(e) => setNameValue(e.target.value)}
            onBlur={commitRename}
            onKeyDown={(e) => {
              if (e.key === 'Enter') commitRename()
              if (e.key === 'Escape') {
                setNameValue(group.name)
                setRenaming(false)
              }
            }}
            autoFocus
            className="bg-transparent border-none outline-none text-[11px] w-20"
            style={{ color: 'rgba(255,255,255,0.95)' }}
          />
        ) : (
          <span
            className="text-[11px] truncate"
            style={{ color: 'rgba(255,255,255,0.88)', maxWidth: 110 }}
          >
            {group.name}
          </span>
        )}

        <span
          className="text-[9px] px-1 rounded-full shrink-0"
          style={{
            background: `${color}26`,
            color: 'rgba(255,255,255,0.55)',
            minWidth: 14,
            textAlign: 'center',
            fontFamily: 'var(--font-mono)'
          }}
        >
          {memberCount}
        </span>
      </motion.div>

      {menu && (
        <div
          ref={menuRef}
          className="fixed z-[200] py-1 min-w-[220px] rounded-lg overflow-hidden"
          style={{
            left: menu.x,
            top: menu.y,
            background: 'var(--glass-bg)',
            backdropFilter: 'blur(var(--glass-blur))',
            border: '1px solid var(--border-mid)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
          }}
        >
          <div className="px-3 py-2 text-[10px] tracking-wider" style={{ color: 'var(--text-disabled)', fontFamily: 'var(--font-mono)' }}>
            COLOR
          </div>
          <div className="flex gap-1.5 px-3 pb-2">
            {groupColors.map((c) => (
              <button
                key={c.key}
                onClick={() => {
                  setGroupColor(group.id, c.key as GroupColor)
                  setMenu(null)
                }}
                className="w-5 h-5 rounded-full transition-transform hover:scale-110"
                style={{
                  background: c.hex,
                  boxShadow:
                    group.color === c.key ? `0 0 0 2px var(--bg-base), 0 0 0 4px ${c.hex}` : 'none'
                }}
                aria-label={c.name}
              />
            ))}
          </div>
          <div className="h-px mx-2 my-1" style={{ background: 'var(--border-dim)' }} />
          <button
            onClick={() => {
              setRenaming(true)
              setMenu(null)
            }}
            className="w-full text-left px-3 py-1.5 text-[12px] hover:bg-white/5"
            style={{ color: 'var(--text-secondary)' }}
          >
            Rename group
          </button>
          <button
            onClick={() => {
              deleteGroup(group.id)
              setMenu(null)
            }}
            className="w-full text-left px-3 py-1.5 text-[12px] hover:bg-white/5"
            style={{ color: 'var(--danger)' }}
          >
            Ungroup all tabs
          </button>
        </div>
      )}
    </>
  )
})

// ══════════════════════════════════════════════════════════════
//  TAB
// ══════════════════════════════════════════════════════════════

const Tab = memo(function Tab({
  tab,
  isActive,
  group,
  isFirstInGroup,
  isLastInGroup
}: {
  tab: TabState
  isActive: boolean
  group?: TabGroup
  isFirstInGroup: boolean
  isLastInGroup: boolean
}): JSX.Element {
  const setActiveTab = useTabsStore((s) => s.setActiveTab)
  const closeTab = useTabsStore((s) => s.closeTab)
  const toggleMute = useTabsStore((s) => s.toggleMute)
  const duplicateTab = useTabsStore((s) => s.duplicateTab)
  const closeOtherTabs = useTabsStore((s) => s.closeOtherTabs)
  const closeTabsToRight = useTabsStore((s) => s.closeTabsToRight)
  const reload = useTabsStore((s) => s.reload)
  const t = useI18nStore((s) => s.t)

  const createGroup = useGroupsStore((s) => s.createGroup)
  const assignTab = useGroupsStore((s) => s.assignTab)
  const unassignTab = useGroupsStore((s) => s.unassignTab)
  const allGroups = useGroupsStore((s) => s.groups)

  const onActivate = useCallback(() => setActiveTab(tab.id), [setActiveTab, tab.id])

  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const title = tab.title || t.newtab.newTab
  const isNewTab = tab.isInternalPage
  const faviconUrl = tab.favicon

  const accentColor = group ? colorHex(group.color) : 'var(--accent)'

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
        className="relative flex items-center gap-1.5 h-7 mb-1 px-2.5 rounded-md cursor-pointer shrink-0 group transition-colors duration-100"
        style={{
          maxWidth: 220,
          minWidth: 64,
          marginLeft: isFirstInGroup ? 1 : 0.5,
          marginRight: isLastInGroup ? 3 : 0.5,
          background: isActive ? 'var(--bg-surface)' : 'transparent',
          // Group context: subtle left/right borders
          borderLeft: group && isFirstInGroup ? `1px solid ${colorHex(group.color)}35` : undefined,
          borderRight: group && isLastInGroup ? `1px solid ${colorHex(group.color)}35` : undefined,
          borderTopLeftRadius: group && isFirstInGroup ? 6 : undefined,
          borderBottomLeftRadius: group && isFirstInGroup ? 6 : undefined,
          borderTopRightRadius: group && isLastInGroup ? 6 : undefined,
          borderBottomRightRadius: group && isLastInGroup ? 6 : undefined
        }}
        onMouseEnter={(e) => {
          if (!isActive) e.currentTarget.style.background = 'var(--bg-elevated)'
        }}
        onMouseLeave={(e) => {
          if (!isActive) e.currentTarget.style.background = 'transparent'
        }}
      >
        {/* Favicon / Loading spinner — NO MORE LEFT BORDER CLIPPING */}
        <div className="w-4 h-4 shrink-0 flex items-center justify-center">
          {tab.isLoading ? (
            <div
              className="w-3 h-3 rounded-full border-[1.5px] border-white/15 animate-spin"
              style={{ borderTopColor: accentColor }}
            />
          ) : (
            <Favicon
              url={isNewTab ? undefined : tab.url}
              favicon={isNewTab ? undefined : faviconUrl}
              size={14}
            />
          )}
        </div>

        {/* Title */}
        <span
          className="text-[11px] truncate flex-1 select-none"
          style={{ color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)' }}
        >
          {isNewTab ? t.newtab.newTab : title}
        </span>

        {/* Audio indicator */}
        {(tab.isAudioPlaying || tab.isMuted) && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              toggleMute(tab.id)
            }}
            className="shrink-0 opacity-50 hover:opacity-90 transition-opacity"
            aria-label={tab.isMuted ? t.tabMenu.unmute : t.tabMenu.mute}
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
          className="w-4 h-4 flex items-center justify-center rounded-sm opacity-0 group-hover:opacity-50 hover:!opacity-90 hover:bg-white/10 transition-all shrink-0"
          aria-label={t.tabMenu.close}
          whileTap={tapPress}
          transition={springSnappy}
        >
          <X size={10} />
        </motion.button>

        {/* Active indicator — bottom underline, no favicon clipping */}
        {isActive && (
          <motion.div
            layoutId="active-tab-indicator"
            className="absolute left-2 right-2 bottom-0 h-[2px] rounded-full"
            style={{
              background: accentColor,
              boxShadow: `0 0 8px ${accentColor}88`
            }}
            transition={springQuick}
          />
        )}
      </motion.div>

      {/* Context menu */}
      {contextMenu && (
        <div
          ref={menuRef}
          className="fixed z-[200] py-1 min-w-[200px] rounded-lg overflow-hidden"
          style={{
            left: contextMenu.x,
            top: contextMenu.y,
            background: 'var(--glass-bg)',
            backdropFilter: 'blur(var(--glass-blur))',
            border: '1px solid var(--border-mid)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
          }}
        >
          <ContextMenuItem
            label={t.tabMenu.reload}
            onClick={() =>
              menuAction(() => {
                useTabsStore.getState().setActiveTab(tab.id)
                reload()
              })
            }
          />
          <ContextMenuItem
            label={t.tabMenu.duplicate}
            onClick={() => menuAction(() => duplicateTab(tab.id))}
          />
          {(tab.isAudioPlaying || tab.isMuted) && (
            <ContextMenuItem
              label={tab.isMuted ? t.tabMenu.unmute : t.tabMenu.mute}
              onClick={() => menuAction(() => toggleMute(tab.id))}
            />
          )}

          {/* ── Groups submenu ── */}
          <div className="h-px mx-2 my-1" style={{ background: 'var(--border-dim)' }} />
          <ContextMenuItem
            label={t.tabMenu.addToNewGroup}
            onClick={() =>
              menuAction(() => {
                const id = createGroup()
                assignTab(tab.id, id)
              })
            }
          />
          {allGroups.length > 0 && (
            <>
              <div className="px-3 py-1 text-[9px] tracking-wider" style={{ color: 'var(--text-disabled)', fontFamily: 'var(--font-mono)' }}>
                {t.tabMenu.addToGroup.toUpperCase()}
              </div>
              {allGroups.map((g) => (
                <button
                  key={g.id}
                  onClick={() => menuAction(() => assignTab(tab.id, g.id))}
                  className="w-full flex items-center gap-2 text-left px-3 py-1.5 text-[12px] hover:bg-white/5"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ background: colorHex(g.color) }}
                  />
                  <span className="truncate">{g.name}</span>
                </button>
              ))}
            </>
          )}
          {group && (
            <ContextMenuItem
              label={t.tabMenu.removeFromGroup}
              onClick={() => menuAction(() => unassignTab(tab.id))}
            />
          )}

          <div className="h-px mx-2 my-1" style={{ background: 'var(--border-dim)' }} />
          <ContextMenuItem
            label={t.tabMenu.close}
            onClick={() => menuAction(() => closeTab(tab.id))}
          />
          <ContextMenuItem
            label={t.tabMenu.closeOthers}
            onClick={() => menuAction(() => closeOtherTabs(tab.id))}
          />
          <ContextMenuItem
            label={t.tabMenu.closeToRight}
            onClick={() => menuAction(() => closeTabsToRight(tab.id))}
          />
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
