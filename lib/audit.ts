import { db } from './db'

export async function logAudit({
  action, propertyId, field, oldValue, newValue,
}: {
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'DUPLICATE'
  propertyId?: string
  field?: string
  oldValue?: string
  newValue?: string
}) {
  await db.execute({
    sql: 'INSERT INTO audit_log (action, property_id, field, old_value, new_value) VALUES (?, ?, ?, ?, ?)',
    args: [action, propertyId ?? null, field ?? null, oldValue ?? null, newValue ?? null],
  })
}

export async function getAuditLog(limit = 50) {
  const result = await db.execute({
    sql: 'SELECT * FROM audit_log ORDER BY timestamp DESC LIMIT ?',
    args: [limit],
  })
  return result.rows
}
