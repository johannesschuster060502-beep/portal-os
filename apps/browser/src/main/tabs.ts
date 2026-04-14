import { WebContentsView } from 'electron'
import { getMainWindow } from './window'
import { addHistoryEntry, getSetting } from './db'
import { getErrorPageHTML, getErrorType } from './error-page'

export interface TabState {
  id: number
  url: string
  title: string
  favicon: string
  isLoading: boolean
  canGoBack: boolean
  canGoForward: boolean
  loadProgress: number
  isAudioPlaying: boolean
  isMuted: boolean
  isCrashed: boolean
  isInternalPage: boolean
}

interface ManagedTab {
  view: WebContentsView
  state: TabState
}

let tabCounter = 0
const tabs = new Map<number, ManagedTab>()
let activeTabId: number | null = null
const CHROME_HEIGHT = 76 // titlebar (40) + tabbar (36)
const closedTabs: { url: string; title: string }[] = []

function getSearchUrl(query: string): string {
  const engine = getSetting('searchEngine') || 'google'
  const q = encodeURIComponent(query)
  switch (engine) {
    case 'duckduckgo':
      return `https://duckduckgo.com/?q=${q}`
    case 'brave':
      return `https://search.brave.com/search?q=${q}`
    case 'bing':
      return `https://www.bing.com/search?q=${q}`
    case 'kagi':
      return `https://kagi.com/search?q=${q}`
    default:
      return `https://www.google.com/search?q=${q}`
  }
}

function resolveUrl(input: string): string {
  // Already a full URL
  if (/^https?:\/\//i.test(input) || input.startsWith('file://')) {
    return input
  }

  // Has protocol like ftp:// etc
  if (/^[a-z][a-z0-9+.-]*:\/\//i.test(input)) {
    return input
  }

  // Looks like a domain (has dot, no spaces, not just numbers with dots like IPs need extra check)
  const trimmed = input.trim()
  if (
    !trimmed.includes(' ') &&
    (trimmed.includes('.') || trimmed.includes(':') || trimmed === 'localhost')
  ) {
    // Check it's not obviously a search query
    if (!/\s/.test(trimmed)) {
      return 'https://' + trimmed
    }
  }

  // Treat as search query
  return getSearchUrl(trimmed)
}

function emitTabUpdate(tabId: number): void {
  const win = getMainWindow()
  const tab = tabs.get(tabId)
  if (!win || !tab) return
  win.webContents.send('tab:updated', { ...tab.state })
}

function emitAllTabs(): void {
  const win = getMainWindow()
  if (!win) return
  const allStates = Array.from(tabs.values()).map((t) => ({ ...t.state }))
  win.webContents.send('tabs:list', allStates)
}

function emitActiveTab(id: number): void {
  const win = getMainWindow()
  if (!win) return
  win.webContents.send('tab:activated', id)
}

export function createTab(url?: string): number {
  const win = getMainWindow()
  if (!win) return -1

  const id = ++tabCounter
  const targetUrl = url || 'portal://newtab'
  const isInternal = targetUrl === 'portal://newtab'

  const view = new WebContentsView({
    webPreferences: {
      sandbox: true,
      contextIsolation: true,
      nodeIntegration: false,
      // Allow web content to access clipboard etc
      spellcheck: true
    }
  })

  const state: TabState = {
    id,
    url: targetUrl,
    title: isInternal ? 'New Tab' : targetUrl,
    favicon: '',
    isLoading: false,
    canGoBack: false,
    canGoForward: false,
    loadProgress: 0,
    isAudioPlaying: false,
    isMuted: false,
    isCrashed: false,
    isInternalPage: isInternal
  }

  const managed: ManagedTab = { view, state }
  tabs.set(id, managed)

  const wc = view.webContents

  // ── Loading progress — perceived-progress curve 15→40→75→100 ──
  wc.on('did-start-loading', () => {
    state.isLoading = true
    state.loadProgress = 0.15 // immediate perceived progress
    state.isCrashed = false
    emitTabUpdate(id)
  })

  wc.on('did-frame-finish-load', () => {
    if (state.loadProgress < 0.4) {
      state.loadProgress = 0.4
      emitTabUpdate(id)
    }
  })

  wc.on('dom-ready', () => {
    if (state.loadProgress < 0.75) {
      state.loadProgress = 0.75
      emitTabUpdate(id)
    }
  })

  wc.on('did-stop-loading', () => {
    state.loadProgress = 1
    state.canGoBack = wc.canGoBack()
    state.canGoForward = wc.canGoForward()
    emitTabUpdate(id)
    // Hold 100% briefly, then clear loading state
    setTimeout(() => {
      if (state.loadProgress === 1) {
        state.isLoading = false
        emitTabUpdate(id)
      }
    }, 400)
  })

  // ── Navigation events ──
  wc.on('did-navigate', (_e, navUrl) => {
    state.url = navUrl
    state.isInternalPage = false
    state.canGoBack = wc.canGoBack()
    state.canGoForward = wc.canGoForward()
    emitTabUpdate(id)
  })

  wc.on('did-navigate-in-page', (_e, navUrl) => {
    state.url = navUrl
    state.canGoBack = wc.canGoBack()
    state.canGoForward = wc.canGoForward()
    emitTabUpdate(id)
  })

  wc.on('will-redirect', (_e, navUrl) => {
    state.url = navUrl
    state.loadProgress = 0.3
    emitTabUpdate(id)
  })

  // ── Page metadata ──
  wc.on('page-title-updated', (_e, title) => {
    state.title = title
    emitTabUpdate(id)
    // Save to history
    if (!state.isInternalPage) {
      addHistoryEntry(state.url, title, state.favicon)
    }
  })

  wc.on('page-favicon-updated', (_e, favicons) => {
    if (favicons.length > 0) {
      state.favicon = favicons[0]
    }
    emitTabUpdate(id)
  })

  // Google favicon fallback after page loads
  wc.on('did-stop-loading', () => {
    if (!state.favicon && !state.isInternalPage && state.url) {
      try {
        const domain = new URL(state.url).hostname
        state.favicon = `https://www.google.com/s2/favicons?domain=${domain}&sz=32`
        emitTabUpdate(id)
      } catch {}
    }
  })

  // ── Audio ──
  wc.on('audio-state-changed', (event) => {
    state.isAudioPlaying = event.audible
    emitTabUpdate(id)
  })

  // ── Error handling ──
  wc.on('render-process-gone', () => {
    state.isCrashed = true
    state.isLoading = false
    emitTabUpdate(id)
  })

  wc.on('did-fail-load', (_e, errorCode, errorDescription, validatedURL) => {
    if (errorCode === -3) return // Aborted by navigation, ignore
    if (errorCode === -27) return // ERR_BLOCKED_BY_CLIENT (ad blockers etc)

    state.isLoading = false
    state.loadProgress = 0
    emitTabUpdate(id)

    // Show custom error page
    const errorType = getErrorType(errorCode)
    const html = getErrorPageHTML(errorType, validatedURL, `${errorDescription} (${errorCode})`)
    wc.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(html)}`)
  })

  wc.on('certificate-error', (_event, _url, _error, _cert, callback) => {
    // Deny by default — don't allow insecure connections
    callback(false)
  })

  // ── New window requests → open in new tab ──
  wc.setWindowOpenHandler(({ url }) => {
    if (url && (url.startsWith('http:') || url.startsWith('https:'))) {
      createTab(url)
    }
    return { action: 'deny' }
  })

  // ── Load the URL if it's a real page ──
  if (!isInternal) {
    wc.loadURL(resolveUrl(targetUrl))
  }

  activateTab(id)
  emitAllTabs()

  return id
}

export function closeTab(id: number): void {
  const win = getMainWindow()
  if (!win) return

  const tab = tabs.get(id)
  if (!tab) return

  // Save for reopen
  if (!tab.state.isInternalPage) {
    closedTabs.push({ url: tab.state.url, title: tab.state.title })
    if (closedTabs.length > 20) closedTabs.shift()
  }

  // Switch to adjacent tab if closing active
  if (activeTabId === id) {
    const ids = Array.from(tabs.keys())
    const idx = ids.indexOf(id)
    const nextId = ids[idx + 1] ?? ids[idx - 1] ?? null
    if (nextId) {
      activateTab(nextId)
    } else {
      activeTabId = null
    }
  }

  try {
    win.contentView.removeChildView(tab.view)
  } catch {
    // View may not be attached
  }
  tab.view.webContents.close()
  tabs.delete(id)
  emitAllTabs()

  // Always keep at least one tab
  if (tabs.size === 0) {
    createTab()
  }
}

export function activateTab(id: number): void {
  const win = getMainWindow()
  if (!win) return

  const tab = tabs.get(id)
  if (!tab) return

  // Hide previous active tab view + enable background throttling
  if (activeTabId !== null && activeTabId !== id) {
    const prevTab = tabs.get(activeTabId)
    if (prevTab) {
      try {
        win.contentView.removeChildView(prevTab.view)
      } catch {
        // May not be attached
      }
      // Throttle background tab
      prevTab.view.webContents.setBackgroundThrottling(true)
    }
  }

  activeTabId = id

  // Disable throttling for active tab — full performance
  tab.view.webContents.setBackgroundThrottling(false)

  // Only show view for non-internal pages
  if (!tab.state.isInternalPage) {
    win.contentView.addChildView(tab.view)
    repositionActiveTab()
  } else {
    // Hide the view for internal pages (renderer shows NewTabPage)
    try {
      win.contentView.removeChildView(tab.view)
    } catch {
      // Not attached
    }
  }

  emitActiveTab(id)
}

export function repositionActiveTab(): void {
  const win = getMainWindow()
  if (!win || activeTabId === null) return

  const tab = tabs.get(activeTabId)
  if (!tab) return

  // Don't show view for internal pages
  if (tab.state.isInternalPage) {
    tab.view.setBounds({ x: 0, y: 0, width: 0, height: 0 })
    return
  }

  const bounds = win.getContentBounds()

  tab.view.setBounds({
    x: 0,
    y: CHROME_HEIGHT,
    width: bounds.width,
    height: bounds.height - CHROME_HEIGHT
  })
}

export function navigateTo(id: number, url: string): void {
  const tab = tabs.get(id)
  if (!tab) return

  const win = getMainWindow()
  if (!win) return

  const finalUrl = resolveUrl(url)

  tab.state.url = finalUrl
  tab.state.isInternalPage = false
  tab.state.isLoading = true
  tab.state.loadProgress = 0.05
  emitTabUpdate(id)

  // If this tab was an internal page, we need to attach its view now
  if (id === activeTabId) {
    win.contentView.addChildView(tab.view)
    repositionActiveTab()
  }

  tab.view.webContents.loadURL(finalUrl)
}

export function stopLoading(id: number): void {
  const tab = tabs.get(id)
  if (tab) {
    tab.view.webContents.stop()
  }
}

export function goBack(id: number): void {
  const tab = tabs.get(id)
  if (tab?.view.webContents.canGoBack()) {
    tab.view.webContents.goBack()
  }
}

export function goForward(id: number): void {
  const tab = tabs.get(id)
  if (tab?.view.webContents.canGoForward()) {
    tab.view.webContents.goForward()
  }
}

export function reload(id: number): void {
  const tab = tabs.get(id)
  if (tab) {
    tab.view.webContents.reload()
  }
}

export function hardReload(id: number): void {
  const tab = tabs.get(id)
  if (tab) {
    tab.view.webContents.reloadIgnoringCache()
  }
}

export function toggleMute(id: number): void {
  const tab = tabs.get(id)
  if (tab) {
    const muted = !tab.state.isMuted
    tab.view.webContents.setAudioMuted(muted)
    tab.state.isMuted = muted
    emitTabUpdate(id)
  }
}

export function reopenLastClosedTab(): void {
  const last = closedTabs.pop()
  if (last) {
    createTab(last.url)
  }
}

export function duplicateTab(id: number): void {
  const tab = tabs.get(id)
  if (tab && !tab.state.isInternalPage) {
    createTab(tab.state.url)
  }
}

export function closeOtherTabs(keepId: number): void {
  const ids = Array.from(tabs.keys())
  for (const id of ids) {
    if (id !== keepId) {
      closeTab(id)
    }
  }
}

export function closeTabsToRight(afterId: number): void {
  const ids = Array.from(tabs.keys())
  const idx = ids.indexOf(afterId)
  if (idx === -1) return
  for (let i = ids.length - 1; i > idx; i--) {
    closeTab(ids[i])
  }
}

export function getTabState(id: number): TabState | null {
  const tab = tabs.get(id)
  return tab ? { ...tab.state } : null
}

export function getAllTabStates(): TabState[] {
  return Array.from(tabs.values()).map((t) => ({ ...t.state }))
}

export function getActiveTabId(): number | null {
  return activeTabId
}

export function findInPage(id: number, text: string, options?: { forward?: boolean; matchCase?: boolean }): void {
  const tab = tabs.get(id)
  if (!tab) return
  if (text) {
    tab.view.webContents.findInPage(text, {
      forward: options?.forward ?? true,
      matchCase: options?.matchCase ?? false
    })
  } else {
    tab.view.webContents.stopFindInPage('clearSelection')
  }
}

export function stopFindInPage(id: number): void {
  const tab = tabs.get(id)
  if (tab) {
    tab.view.webContents.stopFindInPage('clearSelection')
  }
}

// ── DevTools ──
export function openDevTools(id: number): void {
  const tab = tabs.get(id)
  if (tab) {
    tab.view.webContents.openDevTools({ mode: 'detach' })
  }
}

// ── Zoom ──
export function zoomIn(id: number): void {
  const tab = tabs.get(id)
  if (!tab) return
  const current = tab.view.webContents.getZoomFactor()
  tab.view.webContents.setZoomFactor(Math.min(current + 0.1, 3))
  emitZoom(id)
}

export function zoomOut(id: number): void {
  const tab = tabs.get(id)
  if (!tab) return
  const current = tab.view.webContents.getZoomFactor()
  tab.view.webContents.setZoomFactor(Math.max(current - 0.1, 0.3))
  emitZoom(id)
}

export function zoomReset(id: number): void {
  const tab = tabs.get(id)
  if (!tab) return
  tab.view.webContents.setZoomFactor(1)
  emitZoom(id)
}

export function getZoom(id: number): number {
  const tab = tabs.get(id)
  return tab ? tab.view.webContents.getZoomFactor() : 1
}

function emitZoom(id: number): void {
  const win = getMainWindow()
  const tab = tabs.get(id)
  if (!win || !tab) return
  win.webContents.send('tab:zoom', id, tab.view.webContents.getZoomFactor())
}

// Wire up resize events — called once window exists
export function bindWindowResize(): void {
  const win = getMainWindow()
  if (!win) return

  const onResize = (): void => repositionActiveTab()
  win.on('resize', onResize)
  win.on('maximize', onResize)
  win.on('unmaximize', onResize)
  win.on('enter-full-screen', onResize)
  win.on('leave-full-screen', onResize)
}
