import { db, ensureInit } from './db'

export async function logImageView(propertyId: string, imageUrl: string): Promise<void> {
  await ensureInit()
  await db.execute({
    sql: 'INSERT INTO image_views (property_id, image_url) VALUES (?, ?)',
    args: [propertyId, imageUrl],
  })
}

export async function getTopImagePerProperty(): Promise<Array<{ property_id: string; image_url: string; views: number }>> {
  await ensureInit()
  const result = await db.execute(`
    WITH ranked AS (
      SELECT property_id, image_url, COUNT(*) as views,
        ROW_NUMBER() OVER (PARTITION BY property_id ORDER BY COUNT(*) DESC) as rn
      FROM image_views
      GROUP BY property_id, image_url
    )
    SELECT property_id, image_url, views
    FROM ranked
    WHERE rn = 1
    ORDER BY views DESC
  `)
  return result.rows.map(r => ({
    property_id: r.property_id as string,
    image_url:   r.image_url   as string,
    views:       r.views       as number,
  }))
}
