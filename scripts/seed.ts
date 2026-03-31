import { loadEnvConfig } from '@next/env'

// Must load env BEFORE importing lib/db (which initialises the client at module load)
loadEnvConfig(process.cwd())

import { createClient } from '@libsql/client'
import { PROPERTIES } from '../data/properties'

async function seed() {
  const url = process.env.TURSO_DATABASE_URL
  if (!url) throw new Error('TURSO_DATABASE_URL is not set — check .env.local')

  const db = createClient({ url, authToken: process.env.TURSO_AUTH_TOKEN })

  console.log('📦 Connected to:', url)

  // Create tables
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
      action TEXT NOT NULL, property_id TEXT, field TEXT,
      old_value TEXT, new_value TEXT,
      timestamp TEXT NOT NULL DEFAULT (datetime('now'))
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

  // Seed properties
  let count = 0
  for (const p of PROPERTIES) {
    const enriched = {
      ...p,
      status: {
        isActive: p.status.isActive,
        isFeatured: p.status.isFeatured,
        isSpecial: p.status.isSpecial ?? false,
      },
      metrics: {
        views: p.metrics.views,
        favorites: p.metrics.favorites,
        searchAppearances: p.metrics.searchAppearances ?? 0,
      },
      timestamps: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    }
    await db.execute({
      sql: 'INSERT OR REPLACE INTO properties (id, data) VALUES (?, ?)',
      args: [enriched.id, JSON.stringify(enriched)],
    })
    count++
  }

  console.log(`✅ Seeded ${count} properties successfully`)
  process.exit(0)
}

seed().catch(err => { console.error('❌ Seed failed:', err.message); process.exit(1) })
