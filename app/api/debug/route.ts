import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

export async function GET() {
  const info: Record<string, unknown> = {
    TURSO_DATABASE_URL: process.env.TURSO_DATABASE_URL ?? 'NOT SET',
    TURSO_AUTH_TOKEN: process.env.TURSO_AUTH_TOKEN ? 'SET ✓' : 'NOT SET',
  }

  try {
    const db = getDb()
    const result = await db.execute('SELECT COUNT(*) as count FROM properties')
    info.properties_count = result.rows[0]?.count ?? 0
  } catch (err) {
    info.db_error = String(err)
  }

  return NextResponse.json(info)
}
