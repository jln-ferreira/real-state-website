import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getPropertyById, updateProperty } from '@/lib/properties'
import { revalidatePath } from 'next/cache'
import { logAudit } from '@/lib/audit'

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
  const rejectionReason = body.rejectionReason as string | undefined

  if (adminStatus !== 'approved' && adminStatus !== 'rejected')
    return NextResponse.json({ error: 'Invalid adminStatus' }, { status: 400 })

  const existing = await getPropertyById(id)
  if (!existing) return NextResponse.json({ error: 'Property not found' }, { status: 404 })

  const updated = await updateProperty(id, {
    adminStatus,
    status: {
      ...existing.status,
      isActive: adminStatus === 'approved',
    },
    editSnapshot: undefined,
    ...(adminStatus === 'rejected' && rejectionReason
      ? { rejectionReason }
      : adminStatus === 'approved'
      ? { rejectionReason: undefined }
      : {}),
  })

  revalidatePath('/')
  revalidatePath('/user/dashboard')
  revalidatePath('/admin/approvals')
  revalidatePath('/admin/audit')
  await logAudit({
    action: adminStatus === 'approved' ? 'APPROVE' : 'REJECT',
    propertyId: updated.id,
    field: 'adminStatus',
    oldValue: existing.adminStatus,
    newValue: adminStatus,
  })
  return NextResponse.json(updated)
}
