import Database from 'better-sqlite3'
import { app } from 'electron'
import { join } from 'path'

let db: Database.Database

export function initDatabase(): void {
  const dbPath = join(app.getPath('userData'), 'portal-os.db')
  db = new Database(dbPath)

  db.pragma('journal_mode = WAL')
  db.pragma('foreign_keys = ON')

  db.exec(`
    CREATE TABLE IF NOT EXISTS history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      url TEXT NOT NULL,
      title TEXT DEFAULT '',
      favicon_url TEXT DEFAULT '',
      visited_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      visit_count INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS bookmarks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      url TEXT NOT NULL,
      title TEXT DEFAULT '',
      favicon_url TEXT DEFAULT '',
      folder_id INTEGER DEFAULT NULL,
      position INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (folder_id) REFERENCES bookmark_folders(id)
    );

    CREATE TABLE IF NOT EXISTS bookmark_folders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      parent_id INTEGER DEFAULT NULL,
      position INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS favicon_cache (
      domain TEXT PRIMARY KEY,
      data_url TEXT NOT NULL,
      cached_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_history_url ON history(url);
    CREATE INDEX IF NOT EXISTS idx_history_visited ON history(visited_at DESC);
    CREATE INDEX IF NOT EXISTS idx_bookmarks_folder ON bookmarks(folder_id);
  `)
}

// History
export function addHistoryEntry(url: string, title: string, favicon: string): void {
  if (!db || !url || url.startsWith('portal://')) return

  const existing = db
    .prepare('SELECT id, visit_count FROM history WHERE url = ?')
    .get(url) as { id: number; visit_count: number } | undefined

  if (existing) {
    db.prepare(
      'UPDATE history SET title = ?, favicon_url = ?, visited_at = CURRENT_TIMESTAMP, visit_count = ? WHERE id = ?'
    ).run(title, favicon, existing.visit_count + 1, existing.id)
  } else {
    db.prepare('INSERT INTO history (url, title, favicon_url) VALUES (?, ?, ?)').run(
      url,
      title,
      favicon
    )
  }
}

export function getHistory(limit = 100, offset = 0): unknown[] {
  if (!db) return []
  return db
    .prepare('SELECT * FROM history ORDER BY visited_at DESC LIMIT ? OFFSET ?')
    .all(limit, offset)
}

export function searchHistory(query: string, limit = 50): unknown[] {
  if (!db) return []
  const pattern = `%${query}%`
  return db
    .prepare(
      'SELECT * FROM history WHERE url LIKE ? OR title LIKE ? ORDER BY visited_at DESC LIMIT ?'
    )
    .all(pattern, pattern, limit)
}

export function clearHistory(): void {
  if (!db) return
  db.prepare('DELETE FROM history').run()
}

// Bookmarks
export function addBookmark(url: string, title: string, favicon: string, folderId?: number): number {
  if (!db) return -1
  const result = db
    .prepare('INSERT INTO bookmarks (url, title, favicon_url, folder_id) VALUES (?, ?, ?, ?)')
    .run(url, title, favicon, folderId ?? null)
  return result.lastInsertRowid as number
}

export function removeBookmark(id: number): void {
  if (!db) return
  db.prepare('DELETE FROM bookmarks WHERE id = ?').run(id)
}

export function getBookmarks(folderId?: number): unknown[] {
  if (!db) return []
  if (folderId !== undefined) {
    return db
      .prepare('SELECT * FROM bookmarks WHERE folder_id = ? ORDER BY position ASC')
      .all(folderId)
  }
  return db.prepare('SELECT * FROM bookmarks ORDER BY position ASC').all()
}

export function isBookmarked(url: string): boolean {
  if (!db) return false
  const row = db.prepare('SELECT id FROM bookmarks WHERE url = ?').get(url)
  return !!row
}

// Settings
export function getSetting(key: string): string | null {
  if (!db) return null
  const row = db.prepare('SELECT value FROM settings WHERE key = ?').get(key) as
    | { value: string }
    | undefined
  return row?.value ?? null
}

export function setSetting(key: string, value: string): void {
  if (!db) return
  db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)').run(key, value)
}

export function getAllSettings(): Record<string, string> {
  if (!db) return {}
  const rows = db.prepare('SELECT key, value FROM settings').all() as {
    key: string
    value: string
  }[]
  const settings: Record<string, string> = {}
  for (const row of rows) {
    settings[row.key] = row.value
  }
  return settings
}

// Favicon cache
export function getCachedFavicon(domain: string): string | null {
  if (!db) return null
  const row = db.prepare('SELECT data_url FROM favicon_cache WHERE domain = ?').get(domain) as
    | { data_url: string }
    | undefined
  return row?.data_url ?? null
}

export function cacheFavicon(domain: string, dataUrl: string): void {
  if (!db) return
  db.prepare('INSERT OR REPLACE INTO favicon_cache (domain, data_url) VALUES (?, ?)').run(
    domain,
    dataUrl
  )
}

// Input sanitization helpers
export function sanitizeString(input: unknown): string {
  if (typeof input !== 'string') return ''
  return input.slice(0, 10000) // Limit length
}

export function sanitizeNumber(input: unknown, fallback = 0): number {
  if (typeof input === 'number' && Number.isFinite(input)) return input
  return fallback
}

export function sanitizeUrl(input: unknown): string {
  const str = sanitizeString(input)
  if (!str) return ''
  // Block dangerous protocols
  if (/^(javascript|data|vbscript):/i.test(str) && !str.startsWith('data:text/html')) {
    return ''
  }
  return str
}
