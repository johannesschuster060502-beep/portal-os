import { app, BrowserWindow, session } from 'electron'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { createWindow } from './window'
import { registerIpcHandlers, bindWindowEvents } from './ipc'
import { initDatabase } from './db'
import { initUpdater } from './updater'
import { initDownloadHandler } from './downloads'
import { loadAllExtensions } from './extensions'

app.setName('Portal OS')

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.portalos.browser')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // ── SECURITY: Permission request handler ──
  // Three tiers:
  //   allowedByDefault: always granted silently (clipboard)
  //   requirePrompt: would trigger a user prompt (media, geolocation, notifications, fullscreen)
  //   alwaysDeny: hard-denied regardless (midi, midi-sysex, openExternal, display-capture)
  const allowedByDefault = new Set(['clipboard-read', 'clipboard-sanitized-write'])
  const requirePrompt = new Set([
    'media',
    'mediaKeySystem',
    'geolocation',
    'notifications',
    'fullscreen',
    'pointerLock'
  ])
  const alwaysDeny = new Set([
    'midi',
    'midiSysex',
    'openExternal',
    'display-capture',
    'hid',
    'serial',
    'usb',
    'bluetooth',
    'persistent-storage'
  ])

  // ── IDENTITY: Stamp every outgoing request so StudoX services can
  //    detect Portal OS regardless of browser version or update channel.
  //    Detection string "StudoX-PortalOS" is intentionally version-free —
  //    do NOT add a version suffix here; the Core website detects the
  //    fixed token and will always work across all future releases.
  const baseUA = session.defaultSession.getUserAgent()
  session.defaultSession.setUserAgent(`${baseUA} StudoX-PortalOS`)

  session.defaultSession.setPermissionRequestHandler((_wc, permission, callback) => {
    if (alwaysDeny.has(permission)) return callback(false)
    if (allowedByDefault.has(permission)) return callback(true)
    if (requirePrompt.has(permission)) {
      // TODO: wire a proper permission prompt UI — deny for now
      return callback(false)
    }
    // Unknown permission — deny
    callback(false)
  })

  // Security: synchronous permission checks (e.g., from content scripts)
  session.defaultSession.setPermissionCheckHandler((_wc, permission) => {
    if (alwaysDeny.has(permission)) return false
    if (allowedByDefault.has(permission)) return true
    return false
  })

  initDatabase()
  registerIpcHandlers()
  initDownloadHandler()
  loadAllExtensions().catch((e) => console.error('[extensions] init failed:', e))

  const mainWindow = createWindow()

  // Bind window resize/maximize events AFTER window is created
  bindWindowEvents()

  if (!is.dev) {
    initUpdater(mainWindow)
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
      bindWindowEvents()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
