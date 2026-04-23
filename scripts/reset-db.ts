import { loadEnvConfig } from '@next/env'

loadEnvConfig(process.cwd())

import { createClient } from '@libsql/client'

const TABLES = [
  'properties',
  'audit_log',
  'blog_posts',
  'blog_categories',
  'custom_features',
  'contact_messages',
  'whatsapp_clicks',
  'image_views',
  'user_accounts',
]

async function reset() {
  const url = process.env.TURSO_DATABASE_URL
  if (!url) throw new Error('TURSO_DATABASE_URL is not set — check .env.local')

  const db = createClient({ url, authToken: process.env.TURSO_AUTH_TOKEN })
  console.log('Connected to:', url)

  for (const table of TABLES) {
    try {
      const result = await db.execute(`DELETE FROM ${table}`)
      console.log(`Cleared ${table} (${result.rowsAffected} rows)`)
    } catch {
      console.log(`Skipped ${table} (table does not exist yet)`)
    }
  }

  console.log('Database reset complete — ready to start fresh.')
  process.exit(0)
}

reset().catch(err => {
  console.error('Reset failed:', err.message)
  process.exit(1)
})
