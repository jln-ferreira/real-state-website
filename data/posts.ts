export interface Post {
  slug: string
  title: string
  excerpt: string
  content: string
  image: string
  date: string
  category: string
  categories?: string[]
  readTime: string
  published?: boolean
  registeredAt?: string
  views?: number
}

export function getPostCategories(post: Post): string[] {
  if (post.categories && post.categories.length > 0) return post.categories
  if (post.category) return [post.category]
  return []
}

// ── Dataset (empty — populated via admin panel) ───────────────────────────────

export const POSTS: Post[] = []

export function getPostBySlug(slug: string): Post | undefined {
  return POSTS.find(p => p.slug === slug)
}

export function getRecentPosts(excludeSlug?: string, limit = 4): Post[] {
  return POSTS.filter(p => p.slug !== excludeSlug).slice(0, limit)
}

export function getCategories(): string[] {
  return [...new Set(POSTS.map(p => p.category))]
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}
