import { NextResponse } from 'next/server'
import { db, initDb } from '@/lib/db'

export async function GET() {
  await initDb()
  const rows = await db.execute('SELECT value, label FROM custom_features ORDER BY created_at ASC')
  const features = rows.rows.map(r => ({ value: r[0] as string, label: r[1] as string }))
  return NextResponse.json(features)
}

export async function POST(req: Request) {
  await initDb()
  const { value, label } = await req.json()
  if (!value || !label) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  await db.execute({ sql: 'INSERT OR IGNORE INTO custom_features (value, label) VALUES (?, ?)', args: [value, label] })
  return NextResponse.json({ value, label })
}
