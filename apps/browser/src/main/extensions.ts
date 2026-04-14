import { app, session, dialog, net } from 'electron'
import path from 'path'
import fs from 'fs'
import { execSync } from 'child_process'

export interface ExtensionInfo {
  id: string
  name: string
  version: string
  description: string
  homepageUrl: string
}

const EXTENSIONS_DIR = path.join(app.getPath('userData'), 'extensions')

function ensureExtensionsDir(): void {
  if (!fs.existsSync(EXTENSIONS_DIR)) {
    fs.mkdirSync(EXTENSIONS_DIR, { recursive: true })
  }
}

function readManifest(extPath: string): ExtensionInfo | null {
  try {
    const manifestPath = path.join(extPath, 'manifest.json')
    if (!fs.existsSync(manifestPath)) return null
    const m = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'))
    return {
      id: path.basename(extPath),
      name: m.name ?? path.basename(extPath),
      version: m.version ?? '0',
      description: m.description ?? '',
      homepageUrl: m.homepage_url ?? ''
    }
  } catch {
    return null
  }
}

/** Strip CRX2/CRX3 header to get the raw ZIP buffer */
function stripCrxHeader(buf: Buffer): Buffer {
  const magic = buf.subarray(0, 4).toString('ascii')
  if (magic !== 'Cr24') return buf // Already a plain zip
  const version = buf.readUInt32LE(4)
  if (version === 2) {
    const pubLen = buf.readUInt32LE(8)
    const sigLen = buf.readUInt32LE(12)
    return buf.subarray(16 + pubLen + sigLen)
  }
  if (version === 3) {
    const headerSize = buf.readUInt32LE(8)
    return buf.subarray(12 + headerSize)
  }
  return buf
}

/** Download a URL via Electron net module */
function downloadBuffer(url: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const req = net.request({ url, redirect: 'follow' })
    const chunks: Buffer[] = []
    req.on('response', (res) => {
      // Follow redirects handled by 'redirect: follow'
      res.on('data', (chunk) => chunks.push(Buffer.from(chunk)))
      res.on('end', () => resolve(Buffer.concat(chunks)))
      res.on('error', reject)
    })
    req.on('error', reject)
    req.end()
  })
}

/** Extract a zip file using platform tools */
function extractZip(zipPath: string, destPath: string): void {
  if (!fs.existsSync(destPath)) fs.mkdirSync(destPath, { recursive: true })
  if (process.platform === 'win32') {
    execSync(
      `powershell -NoProfile -Command "Expand-Archive -Path '${zipPath}' -DestinationPath '${destPath}' -Force"`,
      { timeout: 30_000 }
    )
  } else {
    execSync(`unzip -o "${zipPath}" -d "${destPath}"`, { timeout: 30_000 })
  }
}

/** Load all persisted extensions into the session */
export async function loadAllExtensions(): Promise<void> {
  ensureExtensionsDir()
  const entries = fs.readdirSync(EXTENSIONS_DIR)
  for (const entry of entries) {
    const extPath = path.join(EXTENSIONS_DIR, entry)
    if (!fs.statSync(extPath).isDirectory()) continue
    if (!fs.existsSync(path.join(extPath, 'manifest.json'))) continue
    try {
      await session.defaultSession.loadExtension(extPath, { allowFileAccess: true })
    } catch (e) {
      console.error('[extensions] Failed to load:', entry, e)
    }
  }
}

/** Return all installed extensions */
export function listExtensions(): ExtensionInfo[] {
  ensureExtensionsDir()
  return fs
    .readdirSync(EXTENSIONS_DIR)
    .filter((e) => {
      const p = path.join(EXTENSIONS_DIR, e)
      return fs.statSync(p).isDirectory() && fs.existsSync(path.join(p, 'manifest.json'))
    })
    .flatMap((e) => {
      const info = readManifest(path.join(EXTENSIONS_DIR, e))
      return info ? [info] : []
    })
}

/** Install an extension by Chrome Web Store ID */
export async function installExtensionById(extensionId: string): Promise<ExtensionInfo> {
  ensureExtensionsDir()

  const safeId = extensionId.replace(/[^a-z]/g, '')
  if (!safeId || safeId.length < 32) throw new Error('Invalid extension ID')

  const crxUrl =
    `https://clients2.google.com/service/update2/crx` +
    `?response=redirect&prodversion=128.0.0.0&acceptformat=crx3,crx2` +
    `&x=id%3D${safeId}%26installsource%3Dondemand%26uc`

  const crxBuf = await downloadBuffer(crxUrl)
  if (crxBuf.length < 16) throw new Error('Download failed or empty response')

  const zipBuf = stripCrxHeader(crxBuf)
  const zipPath = path.join(EXTENSIONS_DIR, `${safeId}.zip`)
  fs.writeFileSync(zipPath, zipBuf)

  const extPath = path.join(EXTENSIONS_DIR, safeId)
  try {
    extractZip(zipPath, extPath)
  } finally {
    try { fs.unlinkSync(zipPath) } catch { /* ignore */ }
  }

  await session.defaultSession.loadExtension(extPath, { allowFileAccess: true })

  const info = readManifest(extPath)
  if (!info) throw new Error('Extension installed but manifest unreadable')
  return info
}

/** Load an unpacked extension from a user-picked directory */
export async function loadUnpackedExtension(): Promise<ExtensionInfo | null> {
  const result = await dialog.showOpenDialog({
    title: 'Select unpacked extension folder',
    properties: ['openDirectory']
  })
  if (result.canceled || !result.filePaths[0]) return null
  const src = result.filePaths[0]

  const manifestPath = path.join(src, 'manifest.json')
  if (!fs.existsSync(manifestPath)) throw new Error('No manifest.json in selected folder')

  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'))
  const id: string = manifest.key ?? path.basename(src).replace(/[^a-zA-Z0-9_-]/g, '_')
  const dest = path.join(EXTENSIONS_DIR, id)

  ensureExtensionsDir()

  // Copy folder to our extensions dir (idempotent)
  if (process.platform === 'win32') {
    execSync(`robocopy "${src}" "${dest}" /E /IS /IT /NFL /NDL /NJH /NJS`, {
      timeout: 30_000
    })
  } else {
    fs.cpSync(src, dest, { recursive: true })
  }

  await session.defaultSession.loadExtension(dest, { allowFileAccess: true })

  return readManifest(dest)
}

/** Remove an extension by ID */
export async function removeExtension(id: string): Promise<void> {
  const safeId = id.replace(/[^a-zA-Z0-9_-]/g, '')
  const extPath = path.join(EXTENSIONS_DIR, safeId)
  if (fs.existsSync(extPath)) {
    fs.rmSync(extPath, { recursive: true, force: true })
  }
}
