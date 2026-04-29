import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { deleteUser, getUserById } from '@/lib/users'

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth()
  if (!session || (session.user as any).role !== 'admin')
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const user = await getUserById(id)
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  await deleteUser(id)
  return NextResponse.json({ ok: true })
}
