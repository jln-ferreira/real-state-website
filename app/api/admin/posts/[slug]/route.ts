import { auth } from '@/auth'
import { NextResponse } from 'next/server'
import { PostSchema } from '@/lib/schemas'
import { getPost, updatePost, deletePost } from '@/lib/posts'

export async function GET(
  _: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(post)
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { slug } = await params
  const body = await req.json()
  const parsed = PostSchema.partial().safeParse(body)
  if (!parsed.success)
    return NextResponse.json({ error: 'Validation failed', issues: parsed.error.issues }, { status: 400 })
  const updated = await updatePost(slug, parsed.data)
  return NextResponse.json(updated)
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { slug } = await params
  await deletePost(slug)
  return NextResponse.json({ ok: true })
}
