import { notFound } from 'next/navigation'
import { getPost } from '@/lib/posts'
import { getPostBySlug } from '@/data/posts'
import PostForm from '../PostForm'

export default async function EditPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  let post = null
  try {
    post = await getPost(slug)
  } catch {
    post = null
  }
  if (!post) post = getPostBySlug(slug) ?? null
  if (!post) notFound()

  return <PostForm post={post} />
}
