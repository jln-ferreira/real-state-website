import { auth } from '@/auth'
import { getProperties, createProperty } from '@/lib/properties'
import { logAudit } from '@/lib/audit'
import { PropertySchema } from '@/lib/schemas'
import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return NextResponse.json(await getProperties())
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session || (session.user as any).role !== 'admin')
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const parsed = PropertySchema.safeParse(body)
  if (!parsed.success)
    return NextResponse.json({ error: 'Validation failed', issues: parsed.error.issues }, { status: 400 })
  const property = await createProperty({
    ...(parsed.data as any),
    ownerId: undefined,
    adminStatus: 'approved',
    status: {
      ...parsed.data.status,
      isActive: true,
    },
  })
  await logAudit({ action: 'CREATE', propertyId: property.id })
  revalidatePath('/')
  revalidatePath('/admin/properties')
  revalidatePath('/admin/audit')
  return NextResponse.json(property, { status: 201 })
}
