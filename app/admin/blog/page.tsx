import { getPosts } from '@/lib/posts'
import { POSTS } from '@/data/posts'
import PostsClient from './PostsClient'

export default async function AdminBlogPage() {
  let posts
  try {
    posts = await getPosts()
    if (posts.length === 0) posts = POSTS.map(p => ({ ...p, published: p.published ?? true }))
  } catch {
    posts = POSTS.map(p => ({ ...p, published: p.published ?? true }))
  }
  return <PostsClient initialPosts={posts} />
}
