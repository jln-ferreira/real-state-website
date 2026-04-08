import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Layout from '@/components/Layout'
import ScrollReveal from '@/components/blog/ScrollReveal'
import ViewTracker from '@/components/ViewTracker'
import { getPost, getPosts } from '@/lib/posts'
import { getPostBySlug, formatDate, getPostCategories } from '@/data/posts'
import type { Post } from '@/data/posts'

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  let post = null
  try { post = await getPost(slug) } catch { /* noop */ }
  if (!post) post = getPostBySlug(slug) ?? null
  if (!post) return {}
  return {
    title: `${post.title} — Blog Casa Baccarat`,
    description: post.excerpt,
  }
}

const CATEGORY_COLORS: Record<string, string> = {
  Dicas:    'bg-emerald-50 text-emerald-700 border border-emerald-200',
  Mercado:  'bg-violet-50  text-violet-700  border border-violet-200',
  Finanças: 'bg-blue-50    text-blue-700    border border-blue-200',
  Guias:    'bg-amber-50   text-amber-700   border border-amber-200',
}
function categoryClass(cat: string) {
  return CATEGORY_COLORS[cat] ?? 'bg-[#F7F7FA] text-[#6D6D85] border border-[#E6E6EF]'
}

export default async function BlogPostPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  let post = null
  try { post = await getPost(slug) } catch { /* noop */ }
  if (!post) post = getPostBySlug(slug) ?? null
  if (!post || post.published === false) notFound()

  let allPosts: Post[] = []
  try { allPosts = await getPosts() } catch { allPosts = [] }
  const recent     = allPosts.filter((p: Post) => p.slug !== slug).slice(0, 4)
  const categories = getPostCategories(post)

  return (
    <Layout>
      <ViewTracker endpoint={`/api/posts/${post.slug}/view`} />
      <article>

        {/* ── Hero ────────────────────────────────────────────────────────────── */}
        <div className="relative h-[400px] md:h-[500px] overflow-hidden animate-page-in">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/10" />

          <div className="absolute inset-0 flex flex-col justify-end">
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pb-10">
              <div className="flex flex-wrap gap-1.5 mb-4">
                {getPostCategories(post).map(cat => (
                  <span key={cat} className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${categoryClass(cat)}`}>{cat}</span>
                ))}
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight max-w-3xl mb-4">
                {post.title}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-sm text-white/70">
                <span>{formatDate(post.date)}</span>
                <span>·</span>
                <span>{post.readTime} de leitura</span>
                <span>·</span>
                <span>Casa Baccarat</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Breadcrumb ──────────────────────────────────────────────────────── */}
        <div className="bg-white border-b border-[#E6E6EF]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
            <nav className="flex items-center gap-2 text-sm text-[#A3A3C2]">
              <Link href="/" className="hover:text-[#6D6D85] transition-colors">Início</Link>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
              <Link href="/blog" className="hover:text-[#6D6D85] transition-colors">Blog</Link>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
              <span className="text-[#2E2E3A] truncate max-w-[200px] sm:max-w-none">{post.title}</span>
            </nav>
          </div>
        </div>

        {/* ── Body ────────────────────────────────────────────────────────────── */}
        <div className="bg-[#F7F7FA]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

              {/* ── Main content ──────────────────────────────────────────────── */}
              <ScrollReveal className="lg:col-span-2">
                <div
                  className="bg-white rounded-[14px] p-6 sm:p-10 border border-[#E6E6EF]
                             shadow-[0_4px_20px_rgba(0,0,0,0.05)]"
                >
                  <div
                    className="blog-prose"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />

                  <div className="mt-10 pt-8 border-t border-[#E6E6EF]">
                    <Link
                      href="/blog"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-[#6D6D85] hover:text-[#4F4F6B] transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                      </svg>
                      Voltar para o Blog
                    </Link>
                  </div>
                </div>
              </ScrollReveal>

              {/* ── Sidebar ───────────────────────────────────────────────────── */}
              <aside className="space-y-6">

                {/* Categories */}
                <ScrollReveal delay={100}>
                  <div
                    className="bg-white rounded-[14px] p-6 border border-[#E6E6EF]
                               shadow-[0_4px_20px_rgba(0,0,0,0.05)]"
                  >
                    <h3 className="text-xs font-bold uppercase tracking-widest text-[#A3A3C2] mb-4">
                      Categorias
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {categories.map(cat => (
                        <span
                          key={cat}
                          className={`px-3 py-1 rounded-full text-sm font-medium ${categoryClass(cat)}`}
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>
                </ScrollReveal>

                {/* Recent posts */}
                <ScrollReveal delay={180}>
                  <div
                    className="bg-white rounded-[14px] p-6 border border-[#E6E6EF]
                               shadow-[0_4px_20px_rgba(0,0,0,0.05)]"
                  >
                    <h3 className="text-xs font-bold uppercase tracking-widest text-[#A3A3C2] mb-4">
                      Artigos Recentes
                    </h3>
                    <ul className="space-y-4">
                      {recent.map(p => (
                        <li key={p.slug}>
                          <Link
                            href={`/blog/${p.slug}`}
                            className="group flex gap-3 items-start"
                          >
                            <div className="w-16 h-14 rounded-xl overflow-hidden flex-shrink-0 border border-[#E6E6EF]">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={p.image}
                                alt={p.title}
                                loading="lazy"
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-[#2E2E3A] leading-snug
                                           group-hover:text-[#6D6D85] transition-colors line-clamp-2">
                                {p.title}
                              </p>
                              <p className="text-[11px] text-[#A3A3C2] mt-1">{formatDate(p.date)}</p>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </ScrollReveal>

              </aside>
            </div>
          </div>
        </div>

      </article>
    </Layout>
  )
}
