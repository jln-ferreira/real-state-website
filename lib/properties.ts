import { db, ensureInit } from './db'
import type { Property } from '@/data/properties'

export async function getProperties(): Promise<Property[]> {
  await ensureInit()
  const result = await db.execute('SELECT data FROM properties ORDER BY created_at DESC')
  const properties = result.rows.map(row => JSON.parse(row.data as string) as Property)

  // Auto-seed static properties on first run
  if (properties.length === 0) {
    const { PROPERTIES } = await import('@/data/properties')
    for (const p of PROPERTIES) {
      await db.execute({
        sql: 'INSERT OR IGNORE INTO properties (id, data) VALUES (?, ?)',
        args: [p.id, JSON.stringify(p)],
      })
    }
    return PROPERTIES
  }

  return properties
}

export async function getPropertyById(id: string): Promise<Property | null> {
  await ensureInit()
  const result = await db.execute({
    sql: 'SELECT data FROM properties WHERE id = ?',
    args: [id],
  })
  if (!result.rows[0]) return null
  return JSON.parse(result.rows[0].data as string)
}

export async function getSimilarProperties(id: string, type: string, limit = 4): Promise<Property[]> {
  await ensureInit()
  const result = await db.execute({
    sql: `SELECT data FROM properties WHERE json_extract(data, '$.propertyDetails.type') = ? AND id != ? AND json_extract(data, '$.status.isActive') = 1 LIMIT ?`,
    args: [type, id, limit],
  })
  return result.rows.map(r => JSON.parse(r.data as string) as Property)
}

export async function createProperty(property: Property): Promise<Property> {
  await ensureInit()
  await db.execute({
    sql: 'INSERT INTO properties (id, data) VALUES (?, ?)',
    args: [property.id, JSON.stringify(property)],
  })
  return property
}

export async function updateProperty(id: string, updates: Partial<Property>): Promise<Property> {
  const existing = await getPropertyById(id)
  if (!existing) throw new Error('Property not found')
  const updated: Property = {
    ...existing,
    ...updates,
    timestamps: {
      createdAt: existing.timestamps?.createdAt ?? new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  }
  await db.execute({
    sql: "UPDATE properties SET data = ?, updated_at = datetime('now') WHERE id = ?",
    args: [JSON.stringify(updated), id],
  })
  return updated
}

export async function deleteProperty(id: string): Promise<void> {
  await ensureInit()
  await db.execute({ sql: 'DELETE FROM properties WHERE id = ?', args: [id] })
}

export async function duplicateProperty(id: string): Promise<Property> {
  const source = await getPropertyById(id)
  if (!source) throw new Error('Not found')

  // Use MAX query instead of fetching all properties
  const maxResult = await db.execute(
    `SELECT MAX(CAST(REPLACE(id, 'PROP-', '') AS INTEGER)) FROM properties WHERE id LIKE 'PROP-%'`
  )
  const lastNum = (maxResult.rows[0][0] as number | null) ?? 0
  const newId = `PROP-${String(lastNum + 1).padStart(3, '0')}`

  const duplicate: Property = {
    ...source,
    id: newId,
    title: `${source.title} (Copy)`,
    status: { ...source.status, isActive: false, isFeatured: false },
    timestamps: { createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    metrics: { views: 0, favorites: 0, searchAppearances: 0 },
  }
  return createProperty(duplicate)
}
