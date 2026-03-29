import { db } from './db'
import type { Property } from '@/data/properties'

export async function getProperties(): Promise<Property[]> {
  const result = await db.execute('SELECT data FROM properties ORDER BY created_at DESC')
  return result.rows.map(row => JSON.parse(row.data as string))
}

export async function getPropertyById(id: string): Promise<Property | null> {
  const result = await db.execute({
    sql: 'SELECT data FROM properties WHERE id = ?',
    args: [id],
  })
  if (!result.rows[0]) return null
  return JSON.parse(result.rows[0].data as string)
}

export async function createProperty(property: Property): Promise<Property> {
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
  await db.execute({ sql: 'DELETE FROM properties WHERE id = ?', args: [id] })
}

export async function duplicateProperty(id: string): Promise<Property> {
  const source = await getPropertyById(id)
  if (!source) throw new Error('Not found')
  const allProps = await getProperties()
  const lastNum = allProps
    .map(p => parseInt(p.id.replace('PROP-', '')))
    .filter(n => !isNaN(n))
    .sort((a, b) => b - a)[0] ?? 0
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
