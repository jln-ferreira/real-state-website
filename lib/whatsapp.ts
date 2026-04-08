import { db, ensureInit } from './db'

export async function logWhatsAppClick(propertyId: string): Promise<void> {
  await ensureInit()
  await db.execute({
    sql: 'INSERT INTO whatsapp_clicks (property_id) VALUES (?)',
    args: [propertyId],
  })
}

export async function getWhatsAppClicks(): Promise<{ property_id: string; created_at: string }[]> {
  await ensureInit()
  const result = await db.execute('SELECT property_id, created_at FROM whatsapp_clicks ORDER BY created_at DESC')
  return result.rows as unknown as { property_id: string; created_at: string }[]
}
