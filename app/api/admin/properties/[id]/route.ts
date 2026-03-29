import { auth } from '@/auth'
import { getPropertyById, updateProperty, deleteProperty } from '@/lib/properties'
import { logAudit } from '@/lib/audit'
import { PartialPropertySchema } from '@/lib/schemas'
import { NextResponse } from 'next/server'

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const property = await getPropertyById(id)
  if (!property) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(property)
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const body = await req.json()
  const parsed = PartialPropertySchema.safeParse({ ...body, id })
  if (!parsed.success)
    return NextResponse.json({ error: 'Validation failed', issues: parsed.error.issues }, { status: 400 })
  const before = await getPropertyById(id)
  const updated = await updateProperty(id, parsed.data as any)
  for (const key of Object.keys(parsed.data) as (keyof typeof parsed.data)[]) {
    if (JSON.stringify((before as any)?.[key]) !== JSON.stringify((updated as any)[key])) {
      await logAudit({
        action: 'UPDATE', propertyId: id, field: String(key),
        oldValue: JSON.stringify((before as any)?.[key]),
        newValue: JSON.stringify((updated as any)[key]),
      })
    }
  }
  return NextResponse.json(updated)
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  await deleteProperty(id)
  await logAudit({ action: 'DELETE', propertyId: id })
  return NextResponse.json({ success: true })
}
