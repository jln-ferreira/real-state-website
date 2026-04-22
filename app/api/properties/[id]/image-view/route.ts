import { NextResponse } from 'next/server'
import { logImageView } from '@/lib/imageViews'

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const body = await req.json().catch(() => null)
  const imageUrl = body?.imageUrl
  if (!imageUrl || typeof imageUrl !== 'string') {
    return NextResponse.json({ error: 'imageUrl required' }, { status: 400 })
  }
  await logImageView(id, imageUrl)
  return NextResponse.json({ ok: true })
}
