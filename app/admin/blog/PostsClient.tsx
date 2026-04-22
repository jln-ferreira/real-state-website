'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { Post } from '@/data/posts'
import { formatDate, getPostCategories } from '@/data/posts'
import SwipeableItem from '@/components/admin/SwipeableItem'
import type { SwipeAction } from '@/components/admin/SwipeableItem'

const CATEGORY_COLORS: Record<string, string> = {
  Dicas:    'bg-emerald-100 text-emerald-700',
  Mercado:  'bg-violet-100  text-violet-700',
  Finanças: 'bg-blue-100    text-blue-700',
  Guias:    'bg-amber-100   text-amber-700',
}

export default function PostsClient({ initialPosts }: { initialPosts: Post[] }) {
  const router = useRouter()
  const [posts,          setPosts]          = useState(initialPosts)
  const [search,         setSearch]         = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter,   setStatusFilter]   = useState('all')
  const [deleteTarget,   setDeleteTarget]   = useState<Post | null>(null)
  const [deleteConfirm,  setDeleteConfirm]  = useState('')
  const [isDeleting,     setIsDeleting]     = useState(false)
  const [swipeOpenId,    setSwipeOpenId]    = useState<string | null>(null)
  const [statFilter,     setStatFilter]     = useState<'published' | 'draft' | null>(null)

  const categories = [...new Set(posts.flatMap(p => getPostCategories(p)))]

  function toggleStat(val: 'published' | 'draft') {
    setStatFilter(prev => prev === val ? null : val)
  }

  const filtered = useMemo(() => posts.filter(p => {
    const s = search.toLowerCase()
    const matchSearch   = !s || p.title.toLowerCase().includes(s) || p.slug.toLowerCase().includes(s)
    const matchCategory = categoryFilter === 'all' || getPostCategories(p).includes(categoryFilter)
    const matchStatus   = statusFilter === 'all'
      || (statusFilter === 'published' && p.published !== false)
      || (statusFilter === 'draft'     && p.published === false)
    const matchStat = !statFilter
      || (statFilter === 'published' && p.published !== false)
      || (statFilter === 'draft'     && p.published === false)
    return matchSearch && matchCategory && matchStatus && matchStat
  }), [posts, search, categoryFilter, statusFilter, statFilter])

  const stats = {
    total:      posts.length,
    published:  posts.filter(p => p.published !== false).length,
    drafts:     posts.filter(p => p.published === false).length,
    totalViews: posts.reduce((sum, p) => sum + (p.views ?? 0), 0),
  }

  async function handleDelete() {
    if (!deleteTarget || deleteConfirm !== deleteTarget.slug) return
    setIsDeleting(true)
    try {
      const res = await fetch(`/api/admin/posts/${deleteTarget.slug}`, { method: 'DELETE' })
      if (res.ok) {
        setPosts(prev => prev.filter(p => p.slug !== deleteTarget.slug))
        setDeleteTarget(null)
        setDeleteConfirm('')
      }
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div>

      {/* ── Header ─────────────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl font-bold text-neutral-900">Blog</h1>
          <p className="text-sm text-neutral-500 mt-0.5">{posts.length} posts no total</p>
        </div>
        <Link
          href="/admin/blog/new"
          className="flex items-center gap-2 bg-[#6D6D85] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[#585874] transition-colors whitespace-nowrap"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Novo Post
        </Link>
      </div>

      {/* ── Stats ──────────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <button
          onClick={() => setStatFilter(null)}
          className={`rounded-2xl p-4 shadow-sm border text-left transition-colors ${
            statFilter === null
              ? 'bg-[#4F4F6B] border-[#4F4F6B]'
              : 'bg-white border-[#E6E6EF] hover:border-[#6D6D85]'
          }`}
        >
          <p className={`text-2xl font-bold ${statFilter === null ? 'text-white' : 'text-[#4F4F6B]'}`}>{stats.total}</p>
          <p className={`text-xs mt-0.5 ${statFilter === null ? 'text-white/80' : 'text-neutral-500'}`}>Total</p>
        </button>
        {([
          { label: 'Publicados', value: stats.published, key: 'published' },
          { label: 'Rascunhos',  value: stats.drafts,    key: 'draft'     },
        ] as const).map(s => {
          const active = statFilter === s.key
          return (
            <button
              key={s.key}
              onClick={() => toggleStat(s.key)}
              className={`rounded-2xl p-4 shadow-sm border text-left transition-colors ${
                active
                  ? 'bg-[#4F4F6B] border-[#4F4F6B] text-white'
                  : 'bg-white border-[#E6E6EF] hover:border-[#6D6D85]'
              }`}
            >
              <p className={`text-2xl font-bold ${active ? 'text-white' : 'text-[#4F4F6B]'}`}>{s.value}</p>
              <p className={`text-xs mt-0.5 ${active ? 'text-white/80' : 'text-neutral-500'}`}>{s.label}</p>
            </button>
          )
        })}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#E6E6EF]">
          <p className="text-2xl font-bold text-[#4F4F6B]">{stats.totalViews.toLocaleString('pt-BR')}</p>
          <p className="text-xs text-neutral-500 mt-0.5">Visualizações totais</p>
        </div>
      </div>

      {/* ── Filters ────────────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-3 mb-4">
        <input
          type="text"
          placeholder="Buscar por título ou slug..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full sm:flex-1 sm:min-w-48 px-3 py-2 bg-white border border-[#E6E6EF] rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#6D6D85]/20"
        />
        <select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          className="flex-1 sm:flex-none px-3 py-2 bg-white border border-[#E6E6EF] rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#6D6D85]/20"
        >
          <option value="all">Todas as Categorias</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="flex-1 sm:flex-none px-3 py-2 bg-white border border-[#E6E6EF] rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#6D6D85]/20"
        >
          <option value="all">Todos os Status</option>
          <option value="published">Publicado</option>
          <option value="draft">Rascunho</option>
        </select>
      </div>

      {/* ── Mobile / tablet card list ──────────────────────────────────────────── */}
      <div className="lg:hidden bg-white rounded-2xl shadow-sm border border-[#E6E6EF] divide-y divide-[#E6E6EF] overflow-hidden">
        {filtered.length === 0 ? (
          <p className="text-center py-12 text-sm text-neutral-400">Nenhum post encontrado</p>
        ) : filtered.map(p => {
          const mobileActions: SwipeAction[] = [
            {
              key: 'edit',
              icon: (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                </svg>
              ),
              label: 'Editar',
              onClick: () => router.push(`/admin/blog/${p.slug}`),
              color: 'blue',
            },
            {
              key: 'view',
              icon: (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              ),
              label: 'Ver',
              onClick: () => window.open(`/blog/${p.slug}`, '_blank'),
              color: 'neutral',
            },
            {
              key: 'delete',
              icon: (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
              ),
              label: 'Excluir',
              onClick: () => { setDeleteTarget(p); setDeleteConfirm('') },
              color: 'red',
            },
          ]
          return (
            <SwipeableItem
              key={p.slug}
              id={p.slug}
              openId={swipeOpenId}
              onOpen={setSwipeOpenId}
              onTap={() => router.push(`/admin/blog/${p.slug}`)}
              actions={mobileActions}
            >
              <div className="flex items-center gap-3 px-4 py-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.image} alt="" className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-neutral-900 line-clamp-1">{p.title}</p>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5">
                    <span className="text-xs font-mono text-neutral-400 truncate max-w-[120px]">{p.slug}</span>
                    {getPostCategories(p).map(cat => (
                      <span key={cat} className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${CATEGORY_COLORS[cat] ?? 'bg-neutral-100 text-neutral-600'}`}>
                        {cat}
                      </span>
                    ))}
                    <span className={`flex items-center gap-1 text-[10px] ${p.published !== false ? 'text-green-600' : 'text-neutral-400'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full inline-block ${p.published !== false ? 'bg-green-500' : 'bg-neutral-300'}`} />
                      {p.published !== false ? 'Publicado' : 'Rascunho'}
                    </span>
                    <span className="flex items-center gap-0.5 text-[10px] text-neutral-500 font-medium">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {(p.views ?? 0).toLocaleString('pt-BR')}
                    </span>
                  </div>
                </div>
              </div>
            </SwipeableItem>
          )
        })}
      </div>

      {/* ── Desktop table ──────────────────────────────────────────────────────── */}
      <div className="hidden lg:block bg-white rounded-2xl shadow-sm overflow-hidden border border-[#E6E6EF] overflow-x-auto">
        <table className="w-full min-w-[520px]">
          <thead>
            <tr className="border-b border-[#E6E6EF] bg-[#F7F7FA]">
              <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Post</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider hidden sm:table-cell">Categoria</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider hidden md:table-cell">Data</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider hidden lg:table-cell">Status</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider hidden lg:table-cell">Visualizações</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider hidden xl:table-cell">Cadastro</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-sm text-neutral-400">
                  Nenhum post encontrado
                </td>
              </tr>
            ) : filtered.map(p => (
              <tr key={p.slug} className="border-b border-[#E6E6EF] hover:bg-[#F7F7FA] transition-colors cursor-pointer" onClick={() => router.push(`/admin/blog/${p.slug}`)}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.image} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-sm text-neutral-900 line-clamp-1">{p.title}</p>
                      <p className="text-xs text-neutral-400 font-mono">{p.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  <div className="flex flex-wrap gap-1">
                    {getPostCategories(p).map(cat => (
                      <span key={cat} className={`px-2 py-0.5 rounded text-xs font-medium ${CATEGORY_COLORS[cat] ?? 'bg-neutral-100 text-neutral-600'}`}>
                        {cat}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <span className="text-sm text-neutral-500">{formatDate(p.date)}</span>
                </td>
                <td className="px-4 py-3 hidden lg:table-cell">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${p.published !== false ? 'bg-green-500' : 'bg-neutral-300'}`} />
                    <span className={`text-xs ${p.published !== false ? 'text-green-600' : 'text-neutral-400'}`}>
                      {p.published !== false ? 'Publicado' : 'Rascunho'}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 hidden lg:table-cell">
                  <div className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-sm font-semibold text-[#4F4F6B]">{(p.views ?? 0).toLocaleString('pt-BR')}</span>
                  </div>
                </td>
                <td className="px-4 py-3 hidden xl:table-cell">
                  <span className="text-xs text-neutral-500">
                    {p.registeredAt
                      ? new Date(p.registeredAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
                      : '—'}
                  </span>
                </td>
                <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                  <div className="flex items-center justify-end gap-3">
                    <Link href={`/admin/blog/${p.slug}`} className="text-xs text-[#4F4F6B] hover:underline font-medium">
                      Editar
                    </Link>
                    <a href={`/blog/${p.slug}`} target="_blank" rel="noreferrer" className="text-xs text-neutral-500 hover:text-neutral-700">
                      Ver
                    </a>
                    <button
                      onClick={() => { setDeleteTarget(p); setDeleteConfirm('') }}
                      className="text-xs text-red-500 hover:text-red-700"
                    >
                      Excluir
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Delete modal ───────────────────────────────────────────────────────── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full">
            <h2 className="text-base font-bold text-neutral-900 mb-1">Excluir post?</h2>
            <p className="text-sm text-neutral-500 mb-4">
              Esta ação não pode ser desfeita. Digite{' '}
              <strong className="font-mono">{deleteTarget.slug}</strong> para confirmar.
            </p>
            <input
              type="text"
              value={deleteConfirm}
              onChange={e => setDeleteConfirm(e.target.value)}
              placeholder={deleteTarget.slug}
              className="w-full px-3 py-2.5 bg-neutral-100 rounded-lg text-sm border-0 outline-none focus:ring-2 focus:ring-red-300 mb-4 font-mono"
            />
            <div className="flex gap-3">
              <button
                onClick={() => { setDeleteTarget(null); setDeleteConfirm('') }}
                className="flex-1 py-2.5 border border-[#E6E6EF] rounded-xl text-sm font-medium hover:bg-neutral-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteConfirm !== deleteTarget.slug || isDeleting}
                className="flex-1 py-2.5 bg-red-600 text-white rounded-xl text-sm font-semibold disabled:opacity-40 hover:bg-red-700 transition-colors"
              >
                {isDeleting ? 'Excluindo...' : 'Excluir'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
