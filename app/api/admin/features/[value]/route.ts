import { NextResponse } from 'next/server'
import { db, initDb } from '@/lib/db'

export async function DELETE(_req: Request, { params }: { params: Promise<{ value: string }> }) {
  await initDb()
  const { value } = await params
  await db.execute({ sql: 'DELETE FROM custom_features WHERE value = ?', args: [value] })
  return NextResponse.json({ ok: true })
}
