import { auth } from '@/auth'
import { NextResponse } from 'next/server'
import { PostSchema } from '@/lib/schemas'
import { getPosts, createPost } from '@/lib/posts'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return NextResponse.json(await getPosts())
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const parsed = PostSchema.safeParse(body)
  if (!parsed.success)
    return NextResponse.json({ error: 'Validation failed', issues: parsed.error.issues }, { status: 400 })
  const post = await createPost(parsed.data)
  return NextResponse.json(post, { status: 201 })
}
