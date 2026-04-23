import { db, ensureInit } from './db'
import type { Post } from '@/data/posts'

export async function getPosts(): Promise<Post[]> {
  await ensureInit()
  const result = await db.execute(
    "SELECT data FROM blog_posts ORDER BY json_extract(data, '$.date') DESC"
  )
  return result.rows.map(row => JSON.parse(row.data as string) as Post)
}

export async function getPost(slug: string): Promise<Post | null> {
  await ensureInit()
  const result = await db.execute({
    sql: 'SELECT data FROM blog_posts WHERE slug = ?',
    args: [slug],
  })
  if (!result.rows[0]) return null
  return JSON.parse(result.rows[0].data as string) as Post
}

export async function createPost(post: Post): Promise<Post> {
  await ensureInit()
  const withDate: Post = {
    ...post,
    registeredAt: post.registeredAt ?? new Date().toISOString(),
  }
  await db.execute({
    sql: 'INSERT INTO blog_posts (slug, data) VALUES (?, ?)',
    args: [withDate.slug, JSON.stringify(withDate)],
  })
  return withDate
}

export async function updatePost(slug: string, updates: Partial<Post>): Promise<Post> {
  const existing = await getPost(slug)
  if (!existing) throw new Error('Post not found')
  const updated: Post = { ...existing, ...updates }
  await db.execute({
    sql: "UPDATE blog_posts SET data = ?, updated_at = datetime('now') WHERE slug = ?",
    args: [JSON.stringify(updated), slug],
  })
  return updated
}

export async function incrementPostViews(slug: string): Promise<void> {
  await ensureInit()
  const result = await db.execute({ sql: 'SELECT data FROM blog_posts WHERE slug = ?', args: [slug] })
  if (!result.rows[0]) return
  const post = JSON.parse(result.rows[0].data as string)
  const updated = { ...post, views: (post.views ?? 0) + 1 }
  await db.execute({ sql: 'UPDATE blog_posts SET data = ? WHERE slug = ?', args: [JSON.stringify(updated), slug] })
}

export async function deletePost(slug: string): Promise<void> {
  await ensureInit()
  await db.execute({ sql: 'DELETE FROM blog_posts WHERE slug = ?', args: [slug] })
}
