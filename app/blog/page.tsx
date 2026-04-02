import type { Metadata } from 'next'
import Link from 'next/link'
import Layout from '@/components/Layout'
import { getPosts } from '@/lib/posts'
import { POSTS, formatDate, getPostCategories } from '@/data/posts'
import type { Post } from '@/data/posts'

export const metadata: Metadata = {
  title: 'Blog — Casa Baccarat',
  description: 'Insights, dicas e novidades do mercado imobiliário para ajudar você a tomar as melhores decisões.',
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

export default async function BlogPage() {
  let allPosts: Post[]
  try {
    allPosts = await getPosts()
    if (allPosts.length === 0) allPosts = POSTS
  } catch {
    allPosts = POSTS
  }
  const posts = allPosts.filter(p => p.published !== false)
  const [featured, ...rest] = posts

  return (
    <Layout>
      {/* ── Hero ──────────────────────────────────────────────────────────────── */}
      <section className="bg-white border-b border-[#E6E6EF]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 animate-page-in">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#6D6D85] mb-3">
            Casa Baccarat
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#2E2E3A] tracking-tight mb-4">
            Blog
          </h1>
          <p className="text-lg text-[#A3A3C2] max-w-xl leading-relaxed">
            Insights, dicas e novidades do mercado imobiliário para ajudar você a tomar as melhores decisões.
          </p>
        </div>
      </section>

      {/* ── Content ───────────────────────────────────────────────────────────── */}
      <div className="bg-[#F7F7FA]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">

          {/* ── Featured post ─────────────────────────────────────────────────── */}
          <Link
            href={`/blog/${featured.slug}`}
            className="group block rounded-[14px] overflow-hidden bg-white mb-10 lg:grid lg:grid-cols-2
                       border border-[#E6E6EF] transition-all duration-300
                       shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.10)]
                       hover:-translate-y-0.5"
          >
            {/* Image */}
            <div className="relative h-64 lg:h-auto overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={featured.image}
                alt={featured.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent lg:bg-gradient-to-r" />
              <div className="absolute top-4 left-4 flex flex-wrap gap-1">
                {getPostCategories(featured).map(cat => (
                  <span key={cat} className={`px-2.5 py-1 rounded-full text-xs font-semibold ${categoryClass(cat)}`}>{cat}</span>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-col justify-center p-8 lg:p-10">
              <span className="text-xs text-[#A3A3C2] mb-3">
                {formatDate(featured.date)} · {featured.readTime} de leitura
              </span>
              <h2 className="text-2xl lg:text-3xl font-bold text-[#2E2E3A] leading-snug mb-3
                             group-hover:text-[#6D6D85] transition-colors duration-300">
                {featured.title}
              </h2>
              <p className="text-[#A3A3C2] leading-relaxed mb-6 text-sm lg:text-base">
                {featured.excerpt}
              </p>
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#6D6D85]">
                Ler artigo
                <svg className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                     fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </span>
            </div>
          </Link>

          {/* ── Grid ──────────────────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((post, i) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex flex-col rounded-[14px] overflow-hidden bg-white animate-fade-up
                           border border-[#E6E6EF] transition-all duration-300
                           shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_36px_rgba(0,0,0,0.10)]
                           hover:-translate-y-1"
                style={{ animationDelay: `${120 + i * 80}ms` }}
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={post.image}
                    alt={post.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                    {getPostCategories(post).map(cat => (
                      <span key={cat} className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${categoryClass(cat)}`}>{cat}</span>
                    ))}
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1 p-5">
                  <span className="text-[11px] text-[#A3A3C2] mb-2">
                    {formatDate(post.date)} · {post.readTime} de leitura
                  </span>
                  <h2 className="text-base font-bold text-[#2E2E3A] leading-snug mb-2
                                 group-hover:text-[#6D6D85] transition-colors duration-300 line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-sm text-[#A3A3C2] leading-relaxed line-clamp-3 flex-1">
                    {post.excerpt}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-[#6D6D85]">
                    Ler mais
                    <svg className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                         fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </div>
    </Layout>
  )
}
