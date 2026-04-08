import { logWhatsAppClick } from '@/lib/whatsapp'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { propertyId } = await req.json()
    if (!propertyId) return NextResponse.json({ ok: false }, { status: 400 })
    await logWhatsAppClick(String(propertyId))
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
