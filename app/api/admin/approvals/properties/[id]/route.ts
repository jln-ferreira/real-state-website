import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getPropertyById, updateProperty } from '@/lib/properties'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth()
  if (!session || (session.user as any).role !== 'admin')
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await req.json()
  const adminStatus = body.adminStatus as 'approved' | 'rejected'

  if (adminStatus !== 'approved' && adminStatus !== 'rejected')
    return NextResponse.json({ error: 'Invalid adminStatus' }, { status: 400 })

  const existing = await getPropertyById(id)
  if (!existing) return NextResponse.json({ error: 'Property not found' }, { status: 404 })

  const updated = await updateProperty(id, {
    adminStatus,
    // When approved, make it active; when rejected, keep inactive
    status: {
      ...existing.status,
      isActive: adminStatus === 'approved',
    },
  })

  return NextResponse.json(updated)
}
