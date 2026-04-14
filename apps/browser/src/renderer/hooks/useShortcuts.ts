import { useEffect } from 'react'
import { useTabsStore } from '@store/tabs.store'
import { useUIStore } from '@store/ui.store'

export function useShortcuts(): void {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent): void {
      const mod = e.metaKey || e.ctrlKey
      const shift = e.shiftKey

      if (mod && !shift && e.key === 't') {
        e.preventDefault()
        useTabsStore.getState().addTab()
        return
      }

      if (mod && !shift && e.key === 'w') {
        e.preventDefault()
        const id = useTabsStore.getState().activeTabId
        if (id !== null) useTabsStore.getState().closeTab(id)
        return
      }

      if (mod && shift && e.key === 'T') {
        e.preventDefault()
        useTabsStore.getState().reopenClosed()
        return
      }

      if (mod && !shift && e.key === 'l') {
        e.preventDefault()
        document.querySelector<HTMLInputElement>('[role="combobox"]')?.focus()
        return
      }

      if (mod && !shift && e.key === 'k') {
        e.preventDefault()
        useUIStore.getState().toggleOmnibox()
        return
      }

      if (mod && !shift && e.key === 'r') {
        e.preventDefault()
        useTabsStore.getState().reload()
        return
      }

      if (mod && shift && e.key === 'R') {
        e.preventDefault()
        useTabsStore.getState().hardReload()
        return
      }

      if (mod && e.key === '[') {
        e.preventDefault()
        useTabsStore.getState().goBack()
        return
      }

      if (mod && e.key === ']') {
        e.preventDefault()
        useTabsStore.getState().goForward()
        return
      }

      if (mod && e.key === ',') {
        e.preventDefault()
        useUIStore.getState().toggleSettings()
        return
      }

      if (mod && shift && e.key === 'B') {
        e.preventDefault()
        useUIStore.getState().toggleSidebar()
        return
      }

      // Cmd+D — toggle bookmark
      if (mod && !shift && e.key === 'd') {
        e.preventDefault()
        const tab = useTabsStore.getState().tabs.find(
          (t) => t.id === useTabsStore.getState().activeTabId
        )
        if (tab && !tab.isInternalPage) {
          window.portalOS.db.isBookmarked(tab.url).then((isBookmarked) => {
            if (isBookmarked) {
              window.portalOS.db.getBookmarks().then((bms) => {
                const match = (bms as { id: number; url: string }[]).find(
                  (b) => b.url === tab.url
                )
                if (match) window.portalOS.db.removeBookmark(match.id)
              })
            } else {
              window.portalOS.db.addBookmark(tab.url, tab.title, tab.favicon)
            }
          })
        }
        return
      }

      // Cmd+Y — history
      if (mod && !shift && e.key === 'y') {
        e.preventDefault()
        useUIStore.getState().toggleHistory()
        return
      }

      // Cmd+F — find in page
      if (mod && !shift && e.key === 'f') {
        e.preventDefault()
        useUIStore.getState().toggleFind()
        return
      }

      // F12 or Cmd+Shift+I — devtools for active tab
      if (e.key === 'F12' || (mod && shift && (e.key === 'I' || e.key === 'i'))) {
        e.preventDefault()
        const id = useTabsStore.getState().activeTabId
        if (id !== null) window.portalOS.tabs.openDevTools(id)
        return
      }

      // Cmd+= / Cmd++ — zoom in
      if (mod && !shift && (e.key === '=' || e.key === '+')) {
        e.preventDefault()
        const id = useTabsStore.getState().activeTabId
        if (id !== null) window.portalOS.tabs.zoomIn(id)
        return
      }

      // Cmd+- — zoom out
      if (mod && !shift && e.key === '-') {
        e.preventDefault()
        const id = useTabsStore.getState().activeTabId
        if (id !== null) window.portalOS.tabs.zoomOut(id)
        return
      }

      // Cmd+0 — reset zoom
      if (mod && !shift && e.key === '0') {
        e.preventDefault()
        const id = useTabsStore.getState().activeTabId
        if (id !== null) window.portalOS.tabs.zoomReset(id)
        return
      }

      // Cmd+1-9 — switch to tab
      if (mod && !shift && e.key >= '1' && e.key <= '9') {
        e.preventDefault()
        const tabs = useTabsStore.getState().tabs
        const idx = parseInt(e.key) - 1
        if (e.key === '9') {
          if (tabs.length > 0) useTabsStore.getState().setActiveTab(tabs[tabs.length - 1].id)
        } else if (idx < tabs.length) {
          useTabsStore.getState().setActiveTab(tabs[idx].id)
        }
        return
      }

      // Escape — cascade close
      if (e.key === 'Escape') {
        const ui = useUIStore.getState()
        if (ui.findOpen) {
          ui.setFindOpen(false)
          const id = useTabsStore.getState().activeTabId
          if (id !== null) window.portalOS.tabs.stopFind(id)
        } else if (ui.omniboxOpen) {
          ui.setOmnibox(false)
        } else if (ui.historyOpen) {
          ui.setHistoryOpen(false)
        } else if (ui.settingsOpen) {
          ui.setSettings(false)
        } else if (ui.sidebarOpen) {
          ui.setSidebar(false)
        } else {
          useTabsStore.getState().stopLoading()
        }
        return
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])
}
