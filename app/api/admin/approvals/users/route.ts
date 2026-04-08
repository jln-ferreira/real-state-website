import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getAllUsers } from '@/lib/users'

export async function GET() {
  const session = await auth()
  if (!session || (session.user as any).role !== 'admin')
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const users = await getAllUsers()
  // Don't expose password hashes
  const safe = users.map(({ password_hash: _, ...u }) => u)
  return NextResponse.json(safe)
}
