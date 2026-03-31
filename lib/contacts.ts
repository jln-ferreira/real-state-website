import { db } from './db'
import type { z } from 'zod'
import type { ContactSchema } from './schemas'

async function ensureTable() {
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

export async function saveContactMessage(data: z.infer<typeof ContactSchema>) {
  await ensureTable()
  await db.execute({
    sql: 'INSERT INTO contact_messages (property_id, name, phone, email, message) VALUES (?, ?, ?, ?, ?)',
    args: [data.propertyId, data.name, data.phone ?? null, data.email, data.message],
  })
}
