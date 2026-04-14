import { autoUpdater } from 'electron-updater'
import { BrowserWindow, ipcMain } from 'electron'

let mainWin: BrowserWindow | null = null

export function initUpdater(mainWindow: BrowserWindow): void {
  mainWin = mainWindow

  autoUpdater.autoDownload = true
  autoUpdater.autoInstallOnAppQuit = true
  autoUpdater.allowDowngrade = false

  // Check for updates 5s after launch
  setTimeout(() => {
    autoUpdater.checkForUpdatesAndNotify().catch(() => {})
  }, 5000)

  // Periodic check every 4 hours
  setInterval(
    () => {
      autoUpdater.checkForUpdatesAndNotify().catch(() => {})
    },
    4 * 60 * 60 * 1000
  )

  autoUpdater.on('checking-for-update', () => {
    send('updater:checking')
  })

  autoUpdater.on('update-available', (info) => {
    send('updater:available', {
      version: info.version,
      releaseNotes: info.releaseNotes || ''
    })
  })

  autoUpdater.on('update-not-available', () => {
    send('updater:upToDate')
  })

  autoUpdater.on('download-progress', (progress) => {
    send('updater:progress', {
      percent: Math.round(progress.percent),
      bytesPerSecond: progress.bytesPerSecond,
      transferred: progress.transferred,
      total: progress.total
    })
  })

  autoUpdater.on('update-downloaded', (info) => {
    send('updater:ready', {
      version: info.version
    })
  })

  autoUpdater.on('error', (err) => {
    send('updater:error', err.message)
  })

  // Manual check from renderer
  ipcMain.on('updater:check', () => {
    autoUpdater.checkForUpdatesAndNotify().catch(() => {})
  })

  // Install now from renderer
  ipcMain.on('updater:install', () => {
    autoUpdater.quitAndInstall(false, true)
  })
}

function send(channel: string, data?: unknown): void {
  if (mainWin && !mainWin.isDestroyed()) {
    mainWin.webContents.send(channel, data)
  }
}
