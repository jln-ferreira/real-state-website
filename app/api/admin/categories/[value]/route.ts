import { NextResponse } from 'next/server'
import { db, ensureInit } from '@/lib/db'

export async function DELETE(_req: Request, { params }: { params: Promise<{ value: string }> }) {
  await ensureInit()
  const { value } = await params
  await db.execute({ sql: 'DELETE FROM blog_categories WHERE value = ?', args: [value] })
  return NextResponse.json({ ok: true })
}
