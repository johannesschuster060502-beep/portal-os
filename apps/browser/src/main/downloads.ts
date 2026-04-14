import { session, app } from 'electron'
import { join } from 'path'
import { getMainWindow } from './window'

export interface DownloadItem {
  id: string
  filename: string
  url: string
  savePath: string
  totalBytes: number
  receivedBytes: number
  state: 'progressing' | 'completed' | 'cancelled' | 'interrupted'
  startTime: number
}

const downloads = new Map<string, DownloadItem>()
let downloadCounter = 0

export function initDownloadHandler(): void {
  session.defaultSession.on('will-download', (_event, item, _webContents) => {
    const win = getMainWindow()
    if (!win) return

    const id = `dl-${++downloadCounter}`
    const filename = item.getFilename()
    const defaultPath = join(app.getPath('downloads'), filename)

    item.setSavePath(defaultPath)

    const dlItem: DownloadItem = {
      id,
      filename,
      url: item.getURL(),
      savePath: defaultPath,
      totalBytes: item.getTotalBytes(),
      receivedBytes: 0,
      state: 'progressing',
      startTime: Date.now()
    }

    downloads.set(id, dlItem)
    win.webContents.send('download:started', { ...dlItem })

    item.on('updated', (_e, state) => {
      dlItem.receivedBytes = item.getReceivedBytes()
      dlItem.totalBytes = item.getTotalBytes()
      dlItem.state = state === 'interrupted' ? 'interrupted' : 'progressing'
      win.webContents.send('download:progress', { ...dlItem })
    })

    item.once('done', (_e, state) => {
      dlItem.receivedBytes = item.getReceivedBytes()
      dlItem.state = state as DownloadItem['state']
      win.webContents.send('download:done', { ...dlItem })
    })
  })
}

export function getDownloads(): DownloadItem[] {
  return Array.from(downloads.values()).sort((a, b) => b.startTime - a.startTime)
}

export function clearDownloads(): void {
  // Only clear completed/cancelled, not in-progress
  for (const [id, dl] of downloads) {
    if (dl.state !== 'progressing') {
      downloads.delete(id)
    }
  }
}
