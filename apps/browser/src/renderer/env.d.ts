/// <reference types="vite/client" />

interface DownloadItem {
  id: string
  filename: string
  url: string
  savePath: string
  totalBytes: number
  receivedBytes: number
  state: 'progressing' | 'completed' | 'cancelled' | 'interrupted'
  startTime: number
}

interface PortalOSAPI {
  tabs: {
    create: (url?: string) => Promise<number>
    close: (id: number) => void
    activate: (id: number) => void
    navigate: (id: number, url: string) => void
    goBack: (id: number) => void
    goForward: (id: number) => void
    reload: (id: number) => void
    hardReload: (id: number) => void
    stop: (id: number) => void
    toggleMute: (id: number) => void
    reopenClosed: () => void
    duplicate: (id: number) => void
    closeOthers: (keepId: number) => void
    closeToRight: (afterId: number) => void
    findInPage: (id: number, text: string, options?: { forward?: boolean; matchCase?: boolean }) => void
    stopFind: (id: number) => void
    getState: (id: number) => Promise<unknown>
    getAll: () => Promise<unknown[]>
    getActive: () => Promise<number | null>
    onUpdated: (callback: (state: unknown) => void) => () => void
    onActivated: (callback: (id: number) => void) => () => void
    onListChanged: (callback: (tabs: unknown[]) => void) => () => void
    onZoomChanged: (callback: (id: number, zoom: number) => void) => () => void
    openDevTools: (id: number) => void
    zoomIn: (id: number) => void
    zoomOut: (id: number) => void
    zoomReset: (id: number) => void
    getZoom: (id: number) => Promise<number>
  }
  downloads: {
    getAll: () => Promise<DownloadItem[]>
    clear: () => void
    onStarted: (callback: (item: DownloadItem) => void) => () => void
    onProgress: (callback: (item: DownloadItem) => void) => () => void
    onDone: (callback: (item: DownloadItem) => void) => () => void
  }
  shell: {
    minimize: () => void
    maximize: () => void
    close: () => void
    isMaximized: () => Promise<boolean>
    onMaximizeChanged: (callback: (maximized: boolean) => void) => () => void
  }
  db: {
    getHistory: (limit?: number, offset?: number) => Promise<unknown[]>
    searchHistory: (query: string, limit?: number) => Promise<unknown[]>
    clearHistory: () => void
    addBookmark: (url: string, title: string, favicon: string, folderId?: number) => Promise<number>
    removeBookmark: (id: number) => void
    getBookmarks: (folderId?: number) => Promise<unknown[]>
    isBookmarked: (url: string) => Promise<boolean>
    getCachedFavicon: (domain: string) => Promise<string | null>
    cacheFavicon: (domain: string, dataUrl: string) => void
    getSetting: (key: string) => Promise<string | null>
    setSetting: (key: string, value: string) => void
    getAllSettings: () => Promise<Record<string, string>>
  }
  updater: {
    check: () => void
    install: () => void
    onAvailable: (callback: (data: { version: string }) => void) => () => void
    onProgress: (callback: (data: { percent: number }) => void) => () => void
    onReady: (callback: (data: { version: string }) => void) => () => void
    onUpToDate: (callback: () => void) => () => void
    onError: (callback: (msg: string) => void) => () => void
  }
  versions: {
    app: string
    electron: string
    chrome: string
    node: string
    v8: string
  }
  platform: string
}

declare global {
  interface Window {
    portalOS: PortalOSAPI
  }
}

export {}
