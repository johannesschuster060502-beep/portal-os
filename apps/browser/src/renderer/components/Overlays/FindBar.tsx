import { useState, useRef, useEffect, KeyboardEvent } from 'react'
import { motion } from 'framer-motion'
import { X, ArrowUp, ArrowDown, TextAa } from '@phosphor-icons/react'
import { springSnappy } from '@lib/motion'
import { useTabsStore } from '@store/tabs.store'
import { useUIStore } from '@store/ui.store'

export default function FindBar(): JSX.Element {
  const setFindOpen = useUIStore((s) => s.setFindOpen)
  const activeTabId = useTabsStore((s) => s.activeTabId)
  const [query, setQuery] = useState('')
  const [matchCase, setMatchCase] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    if (activeTabId === null) return
    if (query) {
      window.portalOS.tabs.findInPage(activeTabId, query, { matchCase })
    } else {
      window.portalOS.tabs.stopFind(activeTabId)
    }
  }, [query, matchCase, activeTabId])

  function close(): void {
    if (activeTabId !== null) window.portalOS.tabs.stopFind(activeTabId)
    setFindOpen(false)
  }

  function findNext(): void {
    if (activeTabId !== null && query) {
      window.portalOS.tabs.findInPage(activeTabId, query, { forward: true, matchCase })
    }
  }

  function findPrev(): void {
    if (activeTabId !== null && query) {
      window.portalOS.tabs.findInPage(activeTabId, query, { forward: false, matchCase })
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>): void {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (e.shiftKey) findPrev()
      else findNext()
    }
    if (e.key === 'Escape') close()
  }

  return (
    <motion.div
      className="absolute top-0 right-4 z-[60] flex items-center gap-1.5 px-3 h-9 rounded-b-lg"
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderTop: 'none',
        boxShadow: '0 4px 16px rgba(0,0,0,0.3)'
      }}
      initial={{ y: -36, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -36, opacity: 0 }}
      transition={springSnappy}
    >
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Find in page"
        className="w-48 bg-transparent border-none outline-none text-[12px] text-white/80
                   placeholder:text-white/20"
        style={{ fontFamily: 'var(--font-ui)', caretColor: 'var(--accent)' }}
        spellCheck={false}
      />

      <button
        onClick={() => setMatchCase(!matchCase)}
        className="w-6 h-6 flex items-center justify-center rounded transition-all"
        style={{
          opacity: matchCase ? 0.9 : 0.3,
          background: matchCase ? 'var(--accent-dim)' : 'transparent'
        }}
        aria-label="Match case"
        title="Match case"
      >
        <TextAa size={12} />
      </button>

      <div className="w-px h-4 mx-0.5" style={{ background: 'var(--border-dim)' }} />

      <button
        onClick={findPrev}
        className="w-6 h-6 flex items-center justify-center rounded opacity-40
                   hover:opacity-80 hover:bg-white/5 transition-all"
        aria-label="Previous match"
      >
        <ArrowUp size={12} />
      </button>
      <button
        onClick={findNext}
        className="w-6 h-6 flex items-center justify-center rounded opacity-40
                   hover:opacity-80 hover:bg-white/5 transition-all"
        aria-label="Next match"
      >
        <ArrowDown size={12} />
      </button>

      <button
        onClick={close}
        className="w-6 h-6 flex items-center justify-center rounded opacity-30
                   hover:opacity-70 hover:bg-white/5 transition-all ml-0.5"
        aria-label="Close find"
      >
        <X size={12} />
      </button>
    </motion.div>
  )
}
