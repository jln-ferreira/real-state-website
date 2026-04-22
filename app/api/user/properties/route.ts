import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { createProperty, getProperties } from '@/lib/properties'
import { randomUUID } from 'crypto'
import type { Property } from '@/data/properties'
import { revalidatePath } from 'next/cache'

async function requireUser(req: NextRequest) {
  const session = await auth()
  if (!session?.user || (session.user as any).role !== 'user') {
    return null
  }
  return session
}

export async function GET(req: NextRequest) {
  const session = await requireUser(req)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const userId = (session.user as any).userId as string
  const all = await getProperties()
  const userProps = all.filter(p => p.ownerId === userId)
  return NextResponse.json(userProps)
}

export async function POST(req: NextRequest) {
  const session = await requireUser(req)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const userId = (session.user as any).userId as string

  try {
    const body = await req.json()

    // Generate a unique ID
    const all = await getProperties()
    const nums = all
      .map(p => parseInt(p.id.replace('PROP-', '')))
      .filter(n => !isNaN(n))
      .sort((a, b) => b - a)
    const newId = `PROP-${String((nums[0] ?? 0) + 1).padStart(3, '0')}-U${randomUUID().slice(0, 4).toUpperCase()}`

    const now = new Date().toISOString()
    const property: Property = {
      id: newId,
      title: body.title ?? '',
      img: body.img ?? body.media?.thumbnail ?? '',
      description: body.description ?? '',
      price: {
        amount: body.price?.amount ?? 0,
        currency: body.price?.currency ?? 'BRL',
        type: body.price?.type ?? 'sale',
        ...(body.price?.condominio != null ? { condominio: body.price.condominio } : {}),
        ...(body.price?.iptu != null ? { iptu: body.price.iptu } : {}),
      },
      location: {
        address: body.location?.address ?? '',
        city: body.location?.city ?? '',
        province: body.location?.province ?? '',
        country: body.location?.country ?? 'Brasil',
        residential: body.location?.residential ?? '',
      },
      propertyDetails: {
        type: body.propertyDetails?.type ?? 'apartment',
        bedrooms: body.propertyDetails?.bedrooms ?? 0,
        bathrooms: body.propertyDetails?.bathrooms ?? 0,
        lavabo: body.propertyDetails?.lavabo ?? 0,
        escritorio: body.propertyDetails?.escritorio ?? 0,
        areaSqFt: body.propertyDetails?.areaSqFt ?? 0,
        ...(body.propertyDetails?.yearBuilt ? { yearBuilt: body.propertyDetails.yearBuilt } : {}),
      },
      features: body.features ?? [],
      media: {
        images: body.media?.images ?? [],
        thumbnail: body.media?.thumbnail ?? '',
      },
      status: { isActive: false, isFeatured: false, isSpecial: false },
      metrics: { views: 0, favorites: 0, searchAppearances: 0 },
      timestamps: { createdAt: now, updatedAt: now },
      agent: {
        name: body.agent?.name ?? '',
        phone: body.agent?.phone ?? '',
        email: body.agent?.email ?? '',
      },
      ownerId: userId,
      adminStatus: 'pending',
    }

    const created = await createProperty(property)
    revalidatePath('/user/dashboard')
    revalidatePath('/admin/approvals')
    return NextResponse.json(created, { status: 201 })
  } catch (err) {
    console.error('[user/properties POST]', err)
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 })
  }
}
