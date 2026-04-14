import { ipcMain } from 'electron'
import {
  createTab,
  closeTab,
  activateTab,
  navigateTo,
  goBack,
  goForward,
  reload,
  hardReload,
  stopLoading,
  toggleMute,
  reopenLastClosedTab,
  duplicateTab,
  closeOtherTabs,
  closeTabsToRight,
  getTabState,
  getAllTabStates,
  getActiveTabId,
  findInPage,
  stopFindInPage,
  zoomIn,
  zoomOut,
  zoomReset,
  getZoom,
  openDevTools,
  bindWindowResize
} from './tabs'
import { getDownloads, clearDownloads, cancelDownload, openDownloadedFile, showDownloadInFolder } from './downloads'
import { listExtensions, installExtensionById, loadUnpackedExtension, removeExtension } from './extensions'
import {
  getHistory,
  searchHistory,
  clearHistory,
  addBookmark,
  removeBookmark,
  getBookmarks,
  isBookmarked,
  getSetting,
  setSetting,
  getAllSettings,
  getCachedFavicon,
  cacheFavicon,
  sanitizeString,
  sanitizeNumber,
  sanitizeUrl
} from './db'
import { getMainWindow } from './window'

export function registerIpcHandlers(): void {
  // ── Window controls ──
  ipcMain.on('shell:minimize', () => {
    getMainWindow()?.minimize()
  })

  ipcMain.on('shell:maximize', () => {
    const win = getMainWindow()
    if (win?.isMaximized()) {
      win.unmaximize()
    } else {
      win?.maximize()
    }
  })

  ipcMain.on('shell:close', () => {
    getMainWindow()?.close()
  })

  ipcMain.handle('shell:isMaximized', () => {
    return getMainWindow()?.isMaximized() ?? false
  })

  // ── Tab management (all inputs validated) ──
  ipcMain.handle('tabs:create', (_e, url?: string) => {
    return createTab(url ? sanitizeUrl(url) || undefined : undefined)
  })

  ipcMain.on('tabs:close', (_e, id: number) => {
    closeTab(sanitizeNumber(id))
  })

  ipcMain.on('tabs:activate', (_e, id: number) => {
    activateTab(sanitizeNumber(id))
  })

  ipcMain.on('tabs:navigate', (_e, id: number, url: string) => {
    const cleanUrl = sanitizeUrl(url)
    if (cleanUrl) navigateTo(sanitizeNumber(id), cleanUrl)
  })

  ipcMain.on('tabs:back', (_e, id: number) => {
    goBack(sanitizeNumber(id))
  })

  ipcMain.on('tabs:forward', (_e, id: number) => {
    goForward(sanitizeNumber(id))
  })

  ipcMain.on('tabs:reload', (_e, id: number) => {
    reload(sanitizeNumber(id))
  })

  ipcMain.on('tabs:hardReload', (_e, id: number) => {
    hardReload(sanitizeNumber(id))
  })

  ipcMain.on('tabs:stop', (_e, id: number) => {
    stopLoading(sanitizeNumber(id))
  })

  ipcMain.on('tabs:toggleMute', (_e, id: number) => {
    toggleMute(sanitizeNumber(id))
  })

  ipcMain.on('tabs:reopenClosed', () => {
    reopenLastClosedTab()
  })

  ipcMain.on('tabs:duplicate', (_e, id: number) => {
    duplicateTab(sanitizeNumber(id))
  })

  ipcMain.on('tabs:closeOthers', (_e, keepId: number) => {
    closeOtherTabs(sanitizeNumber(keepId))
  })

  ipcMain.on('tabs:closeToRight', (_e, afterId: number) => {
    closeTabsToRight(sanitizeNumber(afterId))
  })

  ipcMain.handle('tabs:getState', (_e, id: number) => {
    return getTabState(sanitizeNumber(id))
  })

  ipcMain.handle('tabs:getAll', () => {
    return getAllTabStates()
  })

  ipcMain.handle('tabs:getActive', () => {
    return getActiveTabId()
  })

  // ── Find in page ──
  ipcMain.on(
    'tabs:findInPage',
    (_e, id: number, text: string, options?: { forward?: boolean; matchCase?: boolean }) => {
      const cleanText = sanitizeString(text)
      if (cleanText) findInPage(sanitizeNumber(id), cleanText, options)
    }
  )

  ipcMain.on('tabs:stopFind', (_e, id: number) => {
    stopFindInPage(sanitizeNumber(id))
  })

  // ── Favicon cache ──
  ipcMain.handle('db:getCachedFavicon', (_e, domain: string) => {
    return getCachedFavicon(sanitizeString(domain))
  })

  ipcMain.on('db:cacheFavicon', (_e, domain: string, dataUrl: string) => {
    cacheFavicon(sanitizeString(domain), sanitizeString(dataUrl))
  })

  // ── History ──
  ipcMain.handle('db:getHistory', (_e, limit?: number, offset?: number) => {
    return getHistory(sanitizeNumber(limit, 100), sanitizeNumber(offset, 0))
  })

  ipcMain.handle('db:searchHistory', (_e, query: string, limit?: number) => {
    return searchHistory(sanitizeString(query), sanitizeNumber(limit, 50))
  })

  ipcMain.on('db:clearHistory', () => {
    clearHistory()
  })

  // ── Bookmarks ──
  ipcMain.handle(
    'db:addBookmark',
    (_e, url: string, title: string, favicon: string, folderId?: number) => {
      const cleanUrl = sanitizeUrl(url)
      if (!cleanUrl) return -1
      return addBookmark(
        cleanUrl,
        sanitizeString(title),
        sanitizeString(favicon),
        folderId != null ? sanitizeNumber(folderId) : undefined
      )
    }
  )

  ipcMain.on('db:removeBookmark', (_e, id: number) => {
    removeBookmark(sanitizeNumber(id))
  })

  ipcMain.handle('db:getBookmarks', (_e, folderId?: number) => {
    return getBookmarks(folderId != null ? sanitizeNumber(folderId) : undefined)
  })

  ipcMain.handle('db:isBookmarked', (_e, url: string) => {
    return isBookmarked(sanitizeUrl(url))
  })

  // ── DevTools ──
  ipcMain.on('tabs:openDevTools', (_e, id: number) => {
    openDevTools(sanitizeNumber(id))
  })

  // ── Zoom ──
  ipcMain.on('tabs:zoomIn', (_e, id: number) => {
    zoomIn(sanitizeNumber(id))
  })

  ipcMain.on('tabs:zoomOut', (_e, id: number) => {
    zoomOut(sanitizeNumber(id))
  })

  ipcMain.on('tabs:zoomReset', (_e, id: number) => {
    zoomReset(sanitizeNumber(id))
  })

  ipcMain.handle('tabs:getZoom', (_e, id: number) => {
    return getZoom(sanitizeNumber(id))
  })

  // ── Downloads ──
  ipcMain.handle('downloads:getAll', () => {
    return getDownloads()
  })

  ipcMain.on('downloads:clear', () => {
    clearDownloads()
  })

  ipcMain.on('downloads:cancel', (_e, id: string) => {
    cancelDownload(sanitizeString(id))
  })

  ipcMain.on('downloads:openFile', (_e, savePath: string) => {
    openDownloadedFile(sanitizeString(savePath))
  })

  ipcMain.on('downloads:showInFolder', (_e, savePath: string) => {
    showDownloadInFolder(sanitizeString(savePath))
  })

  // ── Extensions ──
  ipcMain.handle('extensions:list', () => {
    return listExtensions()
  })

  ipcMain.handle('extensions:install', (_e, extensionId: string) => {
    return installExtensionById(sanitizeString(extensionId))
  })

  ipcMain.handle('extensions:loadUnpacked', () => {
    return loadUnpackedExtension()
  })

  ipcMain.handle('extensions:remove', (_e, id: string) => {
    return removeExtension(sanitizeString(id))
  })

  // ── Settings ──
  ipcMain.handle('db:getSetting', (_e, key: string) => {
    return getSetting(sanitizeString(key))
  })

  ipcMain.on('db:setSetting', (_e, key: string, value: string) => {
    const cleanKey = sanitizeString(key)
    if (cleanKey) setSetting(cleanKey, sanitizeString(value))
  })

  ipcMain.handle('db:getAllSettings', () => {
    return getAllSettings()
  })
}

// Call this after window is created to bind resize events
export function bindWindowEvents(): void {
  bindWindowResize()

  const win = getMainWindow()
  if (win) {
    // Forward maximize/unmaximize state changes to renderer
    win.on('maximize', () => {
      win.webContents.send('shell:maximizeChanged', true)
    })
    win.on('unmaximize', () => {
      win.webContents.send('shell:maximizeChanged', false)
    })
  }
}
