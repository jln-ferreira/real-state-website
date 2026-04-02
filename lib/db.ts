import { createClient, type Client } from '@libsql/client'

let _db: Client | null = null

export function getDb(): Client {
  if (!_db) {
    const url = process.env.TURSO_DATABASE_URL
    if (!url) throw new Error('TURSO_DATABASE_URL is not set')
    _db = createClient({ url, authToken: process.env.TURSO_AUTH_TOKEN })
  }
  return _db
}

export const db = new Proxy({} as Client, {
  get(_t, prop) {
    const client = getDb()
    const value = (client as unknown as Record<string | symbol, unknown>)[prop]
    return typeof value === 'function' ? (value as (...a: unknown[]) => unknown).bind(client) : value
  },
})

// Runs once per server process — all subsequent calls are no-ops
let _initPromise: Promise<void> | null = null
export function ensureInit(): Promise<void> {
  if (!_initPromise) _initPromise = initDb()
  return _initPromise
}

export async function initDb() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS properties (
      id TEXT PRIMARY KEY,
      data TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `)
  await db.execute(`
    CREATE TABLE IF NOT EXISTS audit_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      action TEXT NOT NULL,
      property_id TEXT,
      field TEXT,
      old_value TEXT,
      new_value TEXT,
      timestamp TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `)
  await db.execute(`
    CREATE TABLE IF NOT EXISTS blog_posts (
      slug TEXT PRIMARY KEY,
      data TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `)
  await db.execute(`
    CREATE TABLE IF NOT EXISTS custom_features (
      value TEXT PRIMARY KEY,
      label TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `)
  await db.execute(`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      property_id TEXT NOT NULL,
      name TEXT NOT NULL,
      phone TEXT,
      email TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `)
}
