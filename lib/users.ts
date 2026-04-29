import { db, ensureInit } from './db'
import { randomUUID } from 'crypto'

export interface UserAccount {
  id: string
  email: string
  first_name: string
  last_name: string
  phone: string
  password_hash: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
}

function rowToUser(row: Record<string, unknown>): UserAccount {
  return {
    id: row.id as string,
    email: row.email as string,
    first_name: row.first_name as string,
    last_name: row.last_name as string,
    phone: row.phone as string,
    password_hash: row.password_hash as string,
    status: row.status as 'pending' | 'approved' | 'rejected',
    created_at: row.created_at as string,
  }
}

export async function createUser(
  data: Omit<UserAccount, 'id' | 'created_at'>,
): Promise<UserAccount> {
  await ensureInit()
  const id = randomUUID()
  await db.execute({
    sql: `INSERT INTO user_accounts (id, email, first_name, last_name, phone, password_hash, status)
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
    args: [id, data.email, data.first_name, data.last_name, data.phone, data.password_hash, data.status],
  })
  const user = await getUserById(id)
  return user!
}

export async function getUserByEmail(email: string): Promise<UserAccount | null> {
  await ensureInit()
  const result = await db.execute({
    sql: 'SELECT * FROM user_accounts WHERE email = ?',
    args: [email],
  })
  if (!result.rows[0]) return null
  return rowToUser(result.rows[0] as unknown as Record<string, unknown>)
}

export async function getUserById(id: string): Promise<UserAccount | null> {
  await ensureInit()
  const result = await db.execute({
    sql: 'SELECT * FROM user_accounts WHERE id = ?',
    args: [id],
  })
  if (!result.rows[0]) return null
  return rowToUser(result.rows[0] as unknown as Record<string, unknown>)
}

export async function getAllUsers(): Promise<UserAccount[]> {
  await ensureInit()
  const result = await db.execute('SELECT * FROM user_accounts ORDER BY created_at DESC')
  return result.rows.map(r => rowToUser(r as unknown as Record<string, unknown>))
}

export async function updateUserStatus(
  id: string,
  status: 'approved' | 'rejected',
): Promise<void> {
  await ensureInit()
  await db.execute({
    sql: 'UPDATE user_accounts SET status = ? WHERE id = ?',
    args: [status, id],
  })
}

export async function deleteUser(id: string): Promise<void> {
  await ensureInit()
  await db.execute({
    sql: 'DELETE FROM user_accounts WHERE id = ?',
    args: [id],
  })
}
