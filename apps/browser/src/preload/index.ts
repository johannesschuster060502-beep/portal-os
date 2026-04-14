import { contextBridge, ipcRenderer } from 'electron'

const api = {
  // ── Tab management ──
  tabs: {
    create: (url?: string): Promise<number> => ipcRenderer.invoke('tabs:create', url),
    close: (id: number): void => ipcRenderer.send('tabs:close', id),
    activate: (id: number): void => ipcRenderer.send('tabs:activate', id),
    navigate: (id: number, url: string): void => ipcRenderer.send('tabs:navigate', id, url),
    goBack: (id: number): void => ipcRenderer.send('tabs:back', id),
    goForward: (id: number): void => ipcRenderer.send('tabs:forward', id),
    reload: (id: number): void => ipcRenderer.send('tabs:reload', id),
    hardReload: (id: number): void => ipcRenderer.send('tabs:hardReload', id),
    stop: (id: number): void => ipcRenderer.send('tabs:stop', id),
    toggleMute: (id: number): void => ipcRenderer.send('tabs:toggleMute', id),
    reopenClosed: (): void => ipcRenderer.send('tabs:reopenClosed'),
    duplicate: (id: number): void => ipcRenderer.send('tabs:duplicate', id),
    closeOthers: (keepId: number): void => ipcRenderer.send('tabs:closeOthers', keepId),
    closeToRight: (afterId: number): void => ipcRenderer.send('tabs:closeToRight', afterId),
    findInPage: (id: number, text: string, options?: { forward?: boolean; matchCase?: boolean }): void =>
      ipcRenderer.send('tabs:findInPage', id, text, options),
    stopFind: (id: number): void => ipcRenderer.send('tabs:stopFind', id),
    getState: (id: number): Promise<unknown> => ipcRenderer.invoke('tabs:getState', id),
    getAll: (): Promise<unknown[]> => ipcRenderer.invoke('tabs:getAll'),
    getActive: (): Promise<number | null> => ipcRenderer.invoke('tabs:getActive'),
    onUpdated: (callback: (state: unknown) => void) => {
      const handler = (_: unknown, state: unknown): void => callback(state)
      ipcRenderer.on('tab:updated', handler)
      return () => ipcRenderer.removeListener('tab:updated', handler)
    },
    onActivated: (callback: (id: number) => void) => {
      const handler = (_: unknown, id: number): void => callback(id)
      ipcRenderer.on('tab:activated', handler)
      return () => ipcRenderer.removeListener('tab:activated', handler)
    },
    onListChanged: (callback: (tabs: unknown[]) => void) => {
      const handler = (_: unknown, tabs: unknown[]): void => callback(tabs)
      ipcRenderer.on('tabs:list', handler)
      return () => ipcRenderer.removeListener('tabs:list', handler)
    },
    onZoomChanged: (callback: (id: number, zoom: number) => void) => {
      const handler = (_: unknown, id: number, zoom: number): void => callback(id, zoom)
      ipcRenderer.on('tab:zoom', handler)
      return () => ipcRenderer.removeListener('tab:zoom', handler)
    },
    openDevTools: (id: number): void => ipcRenderer.send('tabs:openDevTools', id),
    zoomIn: (id: number): void => ipcRenderer.send('tabs:zoomIn', id),
    zoomOut: (id: number): void => ipcRenderer.send('tabs:zoomOut', id),
    zoomReset: (id: number): void => ipcRenderer.send('tabs:zoomReset', id),
    getZoom: (id: number): Promise<number> => ipcRenderer.invoke('tabs:getZoom', id)
  },

  // ── Downloads ──
  downloads: {
    getAll: (): Promise<unknown[]> => ipcRenderer.invoke('downloads:getAll'),
    clear: (): void => ipcRenderer.send('downloads:clear'),
    cancel: (id: string): void => ipcRenderer.send('downloads:cancel', id),
    openFile: (savePath: string): void => ipcRenderer.send('downloads:openFile', savePath),
    showInFolder: (savePath: string): void => ipcRenderer.send('downloads:showInFolder', savePath),
    onStarted: (callback: (item: unknown) => void) => {
      const handler = (_: unknown, item: unknown): void => callback(item)
      ipcRenderer.on('download:started', handler)
      return () => ipcRenderer.removeListener('download:started', handler)
    },
    onProgress: (callback: (item: unknown) => void) => {
      const handler = (_: unknown, item: unknown): void => callback(item)
      ipcRenderer.on('download:progress', handler)
      return () => ipcRenderer.removeListener('download:progress', handler)
    },
    onDone: (callback: (item: unknown) => void) => {
      const handler = (_: unknown, item: unknown): void => callback(item)
      ipcRenderer.on('download:done', handler)
      return () => ipcRenderer.removeListener('download:done', handler)
    }
  },

  // ── Extensions ──
  extensions: {
    list: (): Promise<unknown[]> => ipcRenderer.invoke('extensions:list'),
    install: (extensionId: string): Promise<unknown> =>
      ipcRenderer.invoke('extensions:install', extensionId),
    loadUnpacked: (): Promise<unknown> => ipcRenderer.invoke('extensions:loadUnpacked'),
    remove: (id: string): Promise<void> => ipcRenderer.invoke('extensions:remove', id)
  },

  // ── Window shell ──
  shell: {
    minimize: (): void => ipcRenderer.send('shell:minimize'),
    maximize: (): void => ipcRenderer.send('shell:maximize'),
    close: (): void => ipcRenderer.send('shell:close'),
    isMaximized: (): Promise<boolean> => ipcRenderer.invoke('shell:isMaximized'),
    onMaximizeChanged: (callback: (maximized: boolean) => void) => {
      const handler = (_: unknown, maximized: boolean): void => callback(maximized)
      ipcRenderer.on('shell:maximizeChanged', handler)
      return () => ipcRenderer.removeListener('shell:maximizeChanged', handler)
    }
  },

  // ── Database ──
  db: {
    getHistory: (limit?: number, offset?: number): Promise<unknown[]> =>
      ipcRenderer.invoke('db:getHistory', limit, offset),
    searchHistory: (query: string, limit?: number): Promise<unknown[]> =>
      ipcRenderer.invoke('db:searchHistory', query, limit),
    clearHistory: (): void => ipcRenderer.send('db:clearHistory'),
    addBookmark: (
      url: string,
      title: string,
      favicon: string,
      folderId?: number
    ): Promise<number> => ipcRenderer.invoke('db:addBookmark', url, title, favicon, folderId),
    removeBookmark: (id: number): void => ipcRenderer.send('db:removeBookmark', id),
    getBookmarks: (folderId?: number): Promise<unknown[]> =>
      ipcRenderer.invoke('db:getBookmarks', folderId),
    isBookmarked: (url: string): Promise<boolean> => ipcRenderer.invoke('db:isBookmarked', url),
    getCachedFavicon: (domain: string): Promise<string | null> =>
      ipcRenderer.invoke('db:getCachedFavicon', domain),
    cacheFavicon: (domain: string, dataUrl: string): void =>
      ipcRenderer.send('db:cacheFavicon', domain, dataUrl),
    getSetting: (key: string): Promise<string | null> =>
      ipcRenderer.invoke('db:getSetting', key),
    setSetting: (key: string, value: string): void =>
      ipcRenderer.send('db:setSetting', key, value),
    getAllSettings: (): Promise<Record<string, string>> =>
      ipcRenderer.invoke('db:getAllSettings')
  },

  // ── Auto-updater ──
  updater: {
    check: (): void => ipcRenderer.send('updater:check'),
    install: (): void => ipcRenderer.send('updater:install'),
    onAvailable: (callback: (data: { version: string; releaseNotes: string }) => void) => {
      const handler = (_: unknown, data: { version: string; releaseNotes: string }): void =>
        callback(data)
      ipcRenderer.on('updater:available', handler)
      return () => ipcRenderer.removeListener('updater:available', handler)
    },
    onProgress: (callback: (data: { percent: number }) => void) => {
      const handler = (_: unknown, data: { percent: number }): void => callback(data)
      ipcRenderer.on('updater:progress', handler)
      return () => ipcRenderer.removeListener('updater:progress', handler)
    },
    onReady: (callback: (data: { version: string }) => void) => {
      const handler = (_: unknown, data: { version: string }): void => callback(data)
      ipcRenderer.on('updater:ready', handler)
      return () => ipcRenderer.removeListener('updater:ready', handler)
    },
    onUpToDate: (callback: () => void) => {
      const handler = (): void => callback()
      ipcRenderer.on('updater:upToDate', handler)
      return () => ipcRenderer.removeListener('updater:upToDate', handler)
    },
    onError: (callback: (msg: string) => void) => {
      const handler = (_: unknown, msg: string): void => callback(msg)
      ipcRenderer.on('updater:error', handler)
      return () => ipcRenderer.removeListener('updater:error', handler)
    }
  },

  // ── App info ──
  versions: {
    app: '1.0.0',
    electron: process.versions.electron,
    chrome: process.versions.chrome,
    node: process.versions.node,
    v8: process.versions.v8
  },

  platform: process.platform
}

contextBridge.exposeInMainWorld('portalOS', api)

export type PortalOSAPI = typeof api
