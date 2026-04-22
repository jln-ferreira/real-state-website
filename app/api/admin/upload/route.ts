import { auth } from '@/auth'
import { NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { supabase, STORAGE_BUCKET } from '@/lib/supabase'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_SIZE_MB = 10

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

  if (!ALLOWED_TYPES.includes(file.type))
    return NextResponse.json({ error: 'Tipo de arquivo não permitido. Use JPG, PNG ou WebP.' }, { status: 400 })

  if (file.size > MAX_SIZE_MB * 1024 * 1024)
    return NextResponse.json({ error: `Arquivo muito grande. Máximo ${MAX_SIZE_MB}MB.` }, { status: 400 })

  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
  const filename = `${randomUUID()}.${ext}`

  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(filename, Buffer.from(await file.arrayBuffer()), {
      contentType: file.type,
      upsert: false,
    })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const { data: { publicUrl } } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(filename)

  return NextResponse.json({ url: publicUrl })
}
