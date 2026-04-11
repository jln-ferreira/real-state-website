import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getPropertyById, updateProperty, deleteProperty } from '@/lib/properties'
import { revalidatePath } from 'next/cache'

async function requireUser(req: NextRequest) {
  const session = await auth()
  if (!session?.user || (session.user as any).role !== 'user') return null
  return session
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await requireUser(req)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const property = await getPropertyById(id)
  if (!property) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const userId = (session.user as any).userId as string
  if (property.ownerId !== userId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  return NextResponse.json(property)
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await requireUser(req)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const existing = await getPropertyById(id)
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const userId = (session.user as any).userId as string
  if (existing.ownerId !== userId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  try {
    const body = await req.json()

    const extraImages: string[] = (body.media?.images ?? []).filter(Boolean)
    const thumbnail: string = body.media?.thumbnail ?? body.img ?? ''
    const allImages = thumbnail
      ? [thumbnail, ...extraImages.filter((i: string) => i !== thumbnail)]
      : extraImages

    const updated = await updateProperty(id, {
      title: body.title,
      description: body.description,
      img: thumbnail,
      price: body.price,
      location: body.location,
      propertyDetails: {
        ...body.propertyDetails,
        lavabo: body.propertyDetails?.lavabo ?? 0,
      },
      features: body.features ?? [],
      media: { thumbnail, images: allImages },
      agent: body.agent,
      // Send back for re-approval: reset to pending, keep isActive=false
      adminStatus: 'pending',
      status: { ...existing.status, isActive: false },
      rejectionReason: undefined,
      // Store previous values so admin can see what changed
      editSnapshot: {
        title: existing.title,
        description: existing.description,
        price: existing.price,
        location: existing.location,
        propertyDetails: existing.propertyDetails,
        features: existing.features,
        media: existing.media,
        agent: existing.agent,
      },
    })

    revalidatePath('/user/dashboard')
    revalidatePath('/admin/approvals')
    return NextResponse.json(updated)
  } catch (err) {
    console.error('[user/properties PATCH]', err)
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await requireUser(req)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const existing = await getPropertyById(id)
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const userId = (session.user as any).userId as string
  if (existing.ownerId !== userId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  await deleteProperty(id)
  revalidatePath('/user/dashboard')
  return NextResponse.json({ ok: true })
}
