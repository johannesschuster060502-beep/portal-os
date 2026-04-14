import { session, app, shell } from 'electron'
import { join } from 'path'
import { getMainWindow } from './window'

export interface DownloadItem {
  id: string
  filename: string
  url: string
  savePath: string
  totalBytes: number
  receivedBytes: number
  speed: number        // bytes/sec
  timeRemaining: number // seconds, -1 = unknown
  state: 'progressing' | 'completed' | 'cancelled' | 'interrupted'
  error: string
  startTime: number
}

const downloads = new Map<string, DownloadItem>()
const electronItems = new Map<string, Electron.DownloadItem>()
let downloadCounter = 0

export function initDownloadHandler(): void {
  session.defaultSession.on('will-download', (_event, item) => {
    const win = getMainWindow()
    if (!win || win.isDestroyed()) return

    const id = `dl-${++downloadCounter}`
    const filename = item.getFilename()
    const defaultPath = join(app.getPath('downloads'), filename)

    item.setSavePath(defaultPath)
    electronItems.set(id, item)

    const dlItem: DownloadItem = {
      id,
      filename,
      url: item.getURL(),
      savePath: defaultPath,
      totalBytes: item.getTotalBytes(),
      receivedBytes: 0,
      speed: 0,
      timeRemaining: -1,
      state: 'progressing',
      error: '',
      startTime: Date.now()
    }

    downloads.set(id, dlItem)
    safeSend(win, 'download:started', { ...dlItem })

    let lastBytes = 0
    let lastTime = Date.now()

    item.on('updated', (_e, state) => {
      try {
        if (win.isDestroyed()) return

        const now = Date.now()
        const elapsedSec = (now - lastTime) / 1000
        const received = item.getReceivedBytes()

        if (elapsedSec >= 0.5) {
          dlItem.speed = Math.round((received - lastBytes) / elapsedSec)
          lastBytes = received
          lastTime = now
        }

        dlItem.receivedBytes = received
        dlItem.totalBytes = item.getTotalBytes()
        dlItem.state = state === 'interrupted' ? 'interrupted' : 'progressing'

        if (dlItem.speed > 0 && dlItem.totalBytes > dlItem.receivedBytes) {
          dlItem.timeRemaining = Math.round(
            (dlItem.totalBytes - dlItem.receivedBytes) / dlItem.speed
          )
        } else {
          dlItem.timeRemaining = -1
        }

        safeSend(win, 'download:progress', { ...dlItem })
      } catch {
        // item may have been destroyed — silently ignore
      }
    })

    item.once('done', (_e, state) => {
      try {
        dlItem.receivedBytes = item.getReceivedBytes()
        dlItem.state = state as DownloadItem['state']
        dlItem.speed = 0
        dlItem.timeRemaining = 0
        if (!win.isDestroyed()) {
          safeSend(win, 'download:done', { ...dlItem })
        }
      } catch {
        // item may have been destroyed — silently ignore
      }
      electronItems.delete(id)
    })
  })
}

function safeSend(win: Electron.BrowserWindow, channel: string, data: unknown): void {
  try {
    if (!win.isDestroyed()) {
      win.webContents.send(channel, data)
    }
  } catch {}
}

export function cancelDownload(id: string): void {
  const item = electronItems.get(id)
  if (item) {
    try { item.cancel() } catch {}
    electronItems.delete(id)
  }
}

export function openDownloadedFile(savePath: string): void {
  shell.openPath(savePath).catch(() => {})
}

export function showDownloadInFolder(savePath: string): void {
  try {
    shell.showItemInFolder(savePath)
  } catch {}
}

export function getDownloads(): DownloadItem[] {
  return Array.from(downloads.values()).sort((a, b) => b.startTime - a.startTime)
}

export function clearDownloads(): void {
  for (const [id, dl] of downloads) {
    if (dl.state !== 'progressing') {
      downloads.delete(id)
    }
  }
}
