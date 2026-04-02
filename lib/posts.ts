import { db, ensureInit } from './db'
import type { Post } from '@/data/posts'

export async function getPosts(): Promise<Post[]> {
  await ensureInit()
  const result = await db.execute(
    "SELECT data FROM blog_posts ORDER BY json_extract(data, '$.date') DESC"
  )
  const posts = result.rows.map(row => JSON.parse(row.data as string) as Post)

  // Auto-seed static posts on first run
  if (posts.length === 0) {
    const { POSTS } = await import('@/data/posts')
    for (const p of POSTS) {
      const seeded: Post = { ...p, published: p.published ?? true }
      await db.execute({
        sql: 'INSERT OR IGNORE INTO blog_posts (slug, data) VALUES (?, ?)',
        args: [seeded.slug, JSON.stringify(seeded)],
      })
    }
    return POSTS.map(p => ({ ...p, published: p.published ?? true }))
  }

  return posts
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
  await db.execute({
    sql: 'INSERT INTO blog_posts (slug, data) VALUES (?, ?)',
    args: [post.slug, JSON.stringify(post)],
  })
  return post
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

export async function deletePost(slug: string): Promise<void> {
  await ensureInit()
  await db.execute({ sql: 'DELETE FROM blog_posts WHERE slug = ?', args: [slug] })
}
