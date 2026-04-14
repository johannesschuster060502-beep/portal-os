import { useState, useRef, useEffect, KeyboardEvent } from 'react'
import { motion } from 'framer-motion'
import { Lock, Warning, MagnifyingGlass, X as XIcon, Star } from '@phosphor-icons/react'
import { useTabsStore } from '@store/tabs.store'
import { springSnappy, tapPress } from '@lib/motion'

export default function AddressBar(): JSX.Element {
  const tabs = useTabsStore((s) => s.tabs)
  const activeTabId = useTabsStore((s) => s.activeTabId)
  const navigateTo = useTabsStore((s) => s.navigateTo)
  const stopLoading = useTabsStore((s) => s.stopLoading)

  const activeTab = tabs.find((t) => t.id === activeTabId)
  const currentUrl = activeTab?.url || ''
  const isLoading = activeTab?.isLoading ?? false
  const loadProgress = activeTab?.loadProgress ?? 0
  const isInternal = activeTab?.isInternalPage ?? true

  const [value, setValue] = useState('')
  const [focused, setFocused] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [zoom, setZoom] = useState(1)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!focused) setValue(formatUrl(currentUrl))
  }, [currentUrl, focused])

  // Check bookmark status
  useEffect(() => {
    if (currentUrl && !isInternal) {
      window.portalOS.db.isBookmarked(currentUrl).then(setIsBookmarked)
    } else {
      setIsBookmarked(false)
    }
  }, [currentUrl, isInternal])

  // Listen for zoom changes
  useEffect(() => {
    const unsub = window.portalOS.tabs.onZoomChanged((id, z) => {
      if (id === activeTabId) setZoom(z)
    })
    if (activeTabId) {
      window.portalOS.tabs.getZoom(activeTabId).then(setZoom)
    }
    return unsub
  }, [activeTabId])

  function formatUrl(url: string): string {
    if (!url || url === 'portal://newtab') return ''
    try {
      const u = new URL(url)
      if (u.protocol === 'https:') return url.replace(/^https:\/\//, '')
      return url
    } catch {
      return url
    }
  }

  function handleFocus(): void {
    setFocused(true)
    setValue(currentUrl === 'portal://newtab' ? '' : currentUrl)
    setTimeout(() => inputRef.current?.select(), 0)
  }

  function handleBlur(): void {
    setFocused(false)
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>): void {
    if (e.key === 'Enter' && value.trim()) {
      navigateTo(value.trim())
      inputRef.current?.blur()
    }
    if (e.key === 'Escape') inputRef.current?.blur()
  }

  async function toggleBookmark(): Promise<void> {
    if (!activeTab || isInternal) return
    if (isBookmarked) {
      const bookmarks = (await window.portalOS.db.getBookmarks()) as { id: number; url: string }[]
      const match = bookmarks.find((b) => b.url === currentUrl)
      if (match) window.portalOS.db.removeBookmark(match.id)
      setIsBookmarked(false)
    } else {
      await window.portalOS.db.addBookmark(currentUrl, activeTab.title, activeTab.favicon)
      setIsBookmarked(true)
    }
  }

  const isSecure = currentUrl.startsWith('https://')
  const isInsecure = currentUrl.startsWith('http://') && !currentUrl.startsWith('https://')
  const showIndicator = !focused && !isInternal && currentUrl !== ''
  const showZoom = zoom !== 1 && !isInternal
  const zoomPercent = Math.round(zoom * 100)

  return (
    <div className="relative w-full">
      <motion.div
        className="flex items-center gap-2 h-7 px-3 rounded-full"
        animate={{
          backgroundColor: focused ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)',
          boxShadow: focused
            ? '0 0 0 3px rgba(124,106,247,0.15), 0 0 0 1px rgba(124,106,247,0.55)'
            : '0 0 0 0px rgba(124,106,247,0), 0 0 0 1px rgba(255,255,255,0.05)'
        }}
        transition={springSnappy}
      >
        {showIndicator && isSecure && (
          <Lock size={12} weight="fill" className="opacity-30 shrink-0" />
        )}
        {showIndicator && isInsecure && (
          <Warning size={12} weight="fill" className="text-warning opacity-60 shrink-0" />
        )}
        {(!showIndicator || isInternal) && (
          <MagnifyingGlass size={12} className="opacity-20 shrink-0" />
        )}

        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder="Search or enter URL"
          className="flex-1 bg-transparent border-none outline-none text-[12px] text-white/80
                     placeholder:text-white/20"
          style={{ fontFamily: 'var(--font-ui)', caretColor: 'var(--accent)' }}
          role="combobox"
          aria-label="Address bar"
          aria-expanded={false}
          spellCheck={false}
          autoComplete="off"
        />

        {/* Zoom indicator */}
        {showZoom && (
          <motion.button
            onClick={() => activeTabId && window.portalOS.tabs.zoomReset(activeTabId)}
            className="shrink-0 text-[10px] px-1.5 py-0.5 rounded opacity-40 hover:opacity-70
                       transition-opacity"
            style={{
              border: '1px solid var(--border-dim)',
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-secondary)'
            }}
            whileTap={tapPress}
          >
            {zoomPercent}%
          </motion.button>
        )}

        {/* Bookmark star */}
        {!isInternal && !focused && (
          <motion.button
            onClick={toggleBookmark}
            className="shrink-0 opacity-30 hover:opacity-80 transition-opacity"
            aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
            whileTap={tapPress}
            whileHover={{ scale: 1.15 }}
            transition={springSnappy}
          >
            <Star
              size={13}
              weight={isBookmarked ? 'fill' : 'regular'}
              style={{ color: isBookmarked ? 'var(--accent)' : undefined }}
            />
          </motion.button>
        )}

        {isLoading && !isInternal && (
          <motion.button
            onClick={stopLoading}
            className="shrink-0 opacity-30 hover:opacity-70 transition-opacity"
            aria-label="Stop loading"
            whileTap={tapPress}
          >
            <XIcon size={12} />
          </motion.button>
        )}
      </motion.div>

      {isLoading && (
        <div className="absolute bottom-0 left-3 right-3 h-[1px] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              width: `${Math.max(loadProgress * 100, 5)}%`,
              background: 'var(--accent)',
              transition: 'width 0.3s ease-out'
            }}
          />
        </div>
      )}
    </div>
  )
}
