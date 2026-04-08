import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getProperties } from '@/lib/properties'

export async function GET() {
  const session = await auth()
  if (!session || (session.user as any).role !== 'admin')
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const all = await getProperties()
  const pending = all.filter(p => p.adminStatus === 'pending')
  return NextResponse.json(pending)
}
