import { db, ensureInit } from './db'

export async function logImageView(propertyId: string, imageUrl: string): Promise<void> {
  await ensureInit()
  await db.execute({
    sql: 'INSERT INTO image_views (property_id, image_url) VALUES (?, ?)',
    args: [propertyId, imageUrl],
  })
}

export async function getTopImagePerProperty(): Promise<Array<{ property_id: string; image_url: string; views: number }>> {
  try {
    await ensureInit()
    const result = await db.execute(
      'SELECT property_id, image_url, COUNT(*) as views FROM image_views GROUP BY property_id, image_url ORDER BY views DESC'
    )
    const seen = new Set<string>()
    return result.rows
      .map(r => ({
        property_id: r.property_id as string,
        image_url:   r.image_url   as string,
        views:       Number(r.views),
      }))
      .filter(r => {
        if (seen.has(r.property_id)) return false
        seen.add(r.property_id)
        return true
      })
  } catch {
    return []
  }
}
