import { NextResponse } from 'next/server'
import { db, ensureInit } from '@/lib/db'

const DEFAULTS = ['Dicas', 'Mercado', 'Finanças', 'Guias']

export async function GET() {
  await ensureInit()
  const rows = await db.execute('SELECT value FROM blog_categories ORDER BY created_at ASC')
  const saved = rows.rows.map(r => r[0] as string)
  // Merge defaults with saved custom ones (deduped)
  const all = [...new Set([...DEFAULTS, ...saved])]
  return NextResponse.json(all)
}

export async function POST(req: Request) {
  await ensureInit()
  const { value } = await req.json()
  if (!value) return NextResponse.json({ error: 'Missing value' }, { status: 400 })
  // Only persist non-default categories
  if (!DEFAULTS.includes(value)) {
    await db.execute({ sql: 'INSERT OR IGNORE INTO blog_categories (value) VALUES (?)', args: [value] })
  }
  return NextResponse.json({ value })
}
