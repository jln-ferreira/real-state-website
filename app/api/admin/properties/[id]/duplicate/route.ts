import { auth } from '@/auth'
import { duplicateProperty } from '@/lib/properties'
import { logAudit } from '@/lib/audit'
import { NextResponse } from 'next/server'

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const copy = await duplicateProperty(id)
  await logAudit({ action: 'DUPLICATE', propertyId: id, newValue: copy.id })
  return NextResponse.json(copy, { status: 201 })
}
