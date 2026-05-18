import { db, ensureInit } from './db'

export type AuditAction =
  | 'CREATE'
  | 'UPDATE'
  | 'DELETE'
  | 'DUPLICATE'
  | 'SUBMIT'
  | 'APPROVE'
  | 'REJECT'

export async function logAudit({
  action, propertyId, field, oldValue, newValue,
}: {
  action: AuditAction
  propertyId?: string
  field?: string
  oldValue?: string
  newValue?: string
}) {
  await ensureInit()
  await db.execute({
    sql: 'INSERT INTO audit_log (action, property_id, field, old_value, new_value) VALUES (?, ?, ?, ?, ?)',
    args: [action, propertyId ?? null, field ?? null, oldValue ?? null, newValue ?? null],
  })
}

export async function getAuditLog(limit = 50) {
  await ensureInit()
  const result = await db.execute({
    sql: 'SELECT * FROM audit_log ORDER BY timestamp DESC LIMIT ?',
    args: [limit],
  })
  return result.rows.map(row => ({
    id:          row.id          as number,
    action:      row.action      as string,
    property_id: row.property_id as string | null,
    field:       row.field       as string | null,
    old_value:   row.old_value   as string | null,
    new_value:   row.new_value   as string | null,
    timestamp:   row.timestamp   as string,
  }))
}
