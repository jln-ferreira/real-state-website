import { NextResponse } from 'next/server'
import { PROPERTIES } from '@/data/properties'
import { getPropertyById } from '@/lib/properties'
import { getPropertyPhotoUrl } from '@/lib/property-share'

export const dynamic = 'force-dynamic'
export const revalidate = 0

async function resolveProperty(id: string) {
  try {
    const property = await getPropertyById(id)
    if (property) return property
  } catch {}

  return PROPERTIES.find(p => p.id === id) ?? null
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const property = await resolveProperty(id)
  const imageUrl = property ? getPropertyPhotoUrl(property) : new URL('/log.png', _request.url).toString()

  try {
    const imageResponse = await fetch(imageUrl, {
      headers: {
        Accept: 'image/avif,image/webp,image/png,image/jpeg,image/*,*/*',
      },
      cache: 'no-store',
    })

    if (!imageResponse.ok || !imageResponse.body) throw new Error('Image fetch failed')

    return new NextResponse(imageResponse.body, {
      headers: {
        'Content-Type': imageResponse.headers.get('content-type') || 'image/jpeg',
        'Cache-Control': 'public, max-age=300, s-maxage=300',
      },
    })
  } catch {
    const fallback = await fetch(new URL('/log.png', _request.url), { cache: 'no-store' })
    return new NextResponse(fallback.body, {
      headers: {
        'Content-Type': fallback.headers.get('content-type') || 'image/png',
        'Cache-Control': 'public, max-age=300, s-maxage=300',
      },
    })
  }
}
