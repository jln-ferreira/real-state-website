'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Post } from '@/data/posts'

const TABS = ['Informações', 'Conteúdo'] as const
type Tab = typeof TABS[number]

const SUGGESTED_CATEGORIES = ['Dicas', 'Mercado', 'Finanças', 'Guias']

function slugify(str: string) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

function emptyPost(): Post {
  return {
    slug:      '',
    title:     '',
    excerpt:   '',
    content:   '',
    image:     '',
    date:      new Date().toISOString().split('T')[0],
    category:  '',
    readTime:  '',
    published: true,
  }
}

export default function PostForm({ post: initial }: { post?: Post }) {
  const router = useRouter()
  const isEdit = !!initial

  const [form,          setForm]          = useState<Post>(initial ?? emptyPost())
  const [activeTab,     setActiveTab]     = useState<Tab>('Informações')
  const [saveState,     setSaveState]     = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [errors,        setErrors]        = useState<Record<string, string>>({})
  const [showPreview,   setShowPreview]   = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState('')
  const [isDeleting,    setIsDeleting]    = useState(false)
  const [toast,         setToast]         = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

  function set<K extends keyof Post>(key: K, value: Post[K]) {
    setForm(f => ({ ...f, [key]: value }))
  }

  function showToast(msg: string, type: 'success' | 'error') {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  function validate() {
    const e: Record<string, string> = {}
    if (!form.title.trim())    e.title    = 'Título é obrigatório'
    if (!form.slug.trim())     e.slug     = 'Slug é obrigatório'
    if (form.slug && !/^[a-z0-9-]+$/.test(form.slug))
                               e.slug     = 'Apenas letras minúsculas, números e hífens'
    if (!form.excerpt.trim())  e.excerpt  = 'Resumo é obrigatório'
    if (!form.content.trim())  e.content  = 'Conteúdo é obrigatório'
    if (!form.image.trim())    e.image    = 'URL da imagem é obrigatória'
    if (!form.category.trim()) e.category = 'Categoria é obrigatória'
    if (!form.date.trim())     e.date     = 'Data é obrigatória'
    if (!form.readTime.trim()) e.readTime = 'Tempo de leitura é obrigatório'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSave() {
    if (!validate()) { showToast('Corrija os erros antes de salvar.', 'error'); return }
    setSaveState('saving')
    try {
      const res = isEdit
        ? await fetch(`/api/admin/posts/${initial!.slug}`, {
            method:  'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify(form),
          })
        : await fetch('/api/admin/posts', {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify(form),
          })

      if (res.ok) {
        setSaveState('saved')
        showToast(isEdit ? 'Post atualizado!' : 'Post criado!', 'success')
        if (!isEdit) {
          const created = await res.json()
          router.push(`/admin/blog/${created.slug}`)
        }
        setTimeout(() => setSaveState('idle'), 2000)
      } else {
        const data = await res.json().catch(() => ({}))
        setSaveState('error')
        showToast(data.error ?? 'Erro ao salvar.', 'error')
      }
    } catch {
      setSaveState('error')
      showToast('Erro de conexão.', 'error')
    }
  }

  async function handleDelete() {
    if (deleteConfirm !== form.slug) return
    setIsDeleting(true)
    try {
      const res = await fetch(`/api/admin/posts/${form.slug}`, { method: 'DELETE' })
      if (res.ok) router.push('/admin/blog')
    } finally {
      setIsDeleting(false)
    }
  }

  const inputCls = 'w-full px-3 py-2.5 bg-neutral-100 rounded-lg text-sm border-0 outline-none focus:ring-2 focus:ring-[#6D6D85]/20'
  const errCls   = 'text-xs text-red-500 mt-1'
  const labelCls = 'block text-xs font-semibold text-neutral-500 mb-1.5 uppercase tracking-wide'

  return (
    <div>

      {/* ── Page header ────────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl font-bold text-neutral-900">
            {isEdit ? 'Editar Post' : 'Novo Post'}
          </h1>
          {isEdit && (
            <p className="text-sm text-neutral-400 mt-0.5 font-mono">/blog/{form.slug}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isEdit && (
            <a
              href={`/blog/${form.slug}`}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-neutral-500 hover:text-neutral-800 border border-neutral-200 px-3 py-2 rounded-xl transition-colors"
            >
              Ver no site ↗
            </a>
          )}
          <button
            onClick={handleSave}
            disabled={saveState === 'saving'}
            className="flex items-center gap-2 bg-[#6D6D85] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[#585874] transition-colors disabled:opacity-60"
          >
            {saveState === 'saving' ? 'Salvando...' : saveState === 'saved' ? '✓ Salvo' : 'Salvar'}
          </button>
        </div>
      </div>

      {/* ── Tabs ───────────────────────────────────────────────────────────────── */}
      <div className="flex gap-1 mb-6 bg-neutral-100 p-1 rounded-xl w-fit">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={[
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              activeTab === tab
                ? 'bg-white text-neutral-900 shadow-sm'
                : 'text-neutral-500 hover:text-neutral-700',
            ].join(' ')}
          >
            {tab}
            {tab === 'Conteúdo' && errors.content && (
              <span className="ml-1.5 w-1.5 h-1.5 inline-block rounded-full bg-red-500" />
            )}
          </button>
        ))}
      </div>

      {/* ── Tab: Informações ───────────────────────────────────────────────────── */}
      {activeTab === 'Informações' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Left column */}
          <div className="space-y-6">

            <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6 space-y-4">
              <h2 className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Básico</h2>

              {/* Title */}
              <div>
                <label className={labelCls}>Título *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => set('title', e.target.value)}
                  className={inputCls}
                  placeholder="Título do post"
                />
                {errors.title && <p className={errCls}>{errors.title}</p>}
              </div>

              {/* Slug */}
              <div>
                <label className={labelCls}>Slug *</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={form.slug}
                    onChange={e => set('slug', e.target.value)}
                    disabled={isEdit}
                    className={`${inputCls} font-mono flex-1 disabled:opacity-60 disabled:cursor-not-allowed`}
                    placeholder="url-do-post"
                  />
                  {!isEdit && (
                    <button
                      onClick={() => set('slug', slugify(form.title))}
                      className="px-3 py-2 bg-neutral-200 hover:bg-neutral-300 rounded-lg text-xs font-medium text-neutral-600 transition-colors whitespace-nowrap"
                    >
                      Gerar
                    </button>
                  )}
                </div>
                {errors.slug && <p className={errCls}>{errors.slug}</p>}
                {isEdit && <p className="text-xs text-neutral-400 mt-1">O slug não pode ser alterado após a criação.</p>}
              </div>

              {/* Excerpt */}
              <div>
                <label className={labelCls}>Resumo *</label>
                <textarea
                  rows={3}
                  value={form.excerpt}
                  onChange={e => set('excerpt', e.target.value)}
                  className={`${inputCls} resize-none`}
                  placeholder="Breve descrição exibida nos cards do blog..."
                />
                {errors.excerpt && <p className={errCls}>{errors.excerpt}</p>}
              </div>

              {/* Category */}
              <div>
                <label className={labelCls}>Categoria *</label>
                <input
                  type="text"
                  list="post-categories"
                  value={form.category}
                  onChange={e => set('category', e.target.value)}
                  className={inputCls}
                  placeholder="Ex: Dicas"
                />
                <datalist id="post-categories">
                  {SUGGESTED_CATEGORIES.map(c => <option key={c} value={c} />)}
                </datalist>
                {errors.category && <p className={errCls}>{errors.category}</p>}
              </div>
            </div>

          </div>

          {/* Right column */}
          <div className="space-y-6">

            <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6 space-y-4">
              <h2 className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Publicação</h2>

              {/* Date */}
              <div>
                <label className={labelCls}>Data *</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={e => set('date', e.target.value)}
                  className={inputCls}
                />
                {errors.date && <p className={errCls}>{errors.date}</p>}
              </div>

              {/* Read time */}
              <div>
                <label className={labelCls}>Tempo de Leitura *</label>
                <input
                  type="text"
                  value={form.readTime}
                  onChange={e => set('readTime', e.target.value)}
                  className={inputCls}
                  placeholder="Ex: 5 min"
                />
                {errors.readTime && <p className={errCls}>{errors.readTime}</p>}
              </div>

              {/* Published toggle */}
              <div className="flex items-center justify-between pt-1">
                <div>
                  <p className="text-sm font-medium text-neutral-700">Publicado</p>
                  <p className="text-xs text-neutral-400">Visível no site para os leitores</p>
                </div>
                <button
                  onClick={() => set('published', !form.published)}
                  className={[
                    'relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none',
                    form.published ? 'bg-green-500' : 'bg-neutral-300',
                  ].join(' ')}
                  aria-label="Toggle publicado"
                >
                  <span className={[
                    'absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200',
                    form.published ? 'translate-x-5' : 'translate-x-0',
                  ].join(' ')} />
                </button>
              </div>
            </div>

            {/* Cover image */}
            <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6 space-y-4">
              <h2 className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Imagem de Capa</h2>
              <div>
                <label className={labelCls}>URL da Imagem *</label>
                <input
                  type="url"
                  value={form.image}
                  onChange={e => set('image', e.target.value)}
                  className={inputCls}
                  placeholder="https://..."
                />
                {errors.image && <p className={errCls}>{errors.image}</p>}
              </div>
              {form.image && (
                <div className="rounded-xl overflow-hidden aspect-video bg-neutral-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={form.image}
                    alt="Preview da capa"
                    className="w-full h-full object-cover"
                    onError={e => (e.currentTarget.style.display = 'none')}
                  />
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ── Tab: Conteúdo ──────────────────────────────────────────────────────── */}
      {activeTab === 'Conteúdo' && (
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Conteúdo HTML</h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                Use tags: &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;&lt;li&gt;, &lt;strong&gt;, &lt;blockquote&gt;
              </p>
            </div>
            <button
              onClick={() => setShowPreview(p => !p)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
            >
              {showPreview ? (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                  </svg>
                  Editar
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.637 0-8.572-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Pré-visualizar
                </>
              )}
            </button>
          </div>

          {!showPreview ? (
            <div>
              <textarea
                rows={26}
                value={form.content}
                onChange={e => set('content', e.target.value)}
                className="w-full px-4 py-3 bg-neutral-100 rounded-xl text-sm border-0 outline-none focus:ring-2 focus:ring-[#6D6D85]/20 font-mono resize-y leading-relaxed"
                placeholder={`<p>Introdução do post...</p>\n\n<h2>Primeiro subtítulo</h2>\n<p>Conteúdo do parágrafo...</p>\n\n<ul>\n  <li>Item 1</li>\n  <li>Item 2</li>\n</ul>`}
              />
              {errors.content && <p className={errCls}>{errors.content}</p>}
            </div>
          ) : (
            <div className="min-h-[500px] border border-neutral-100 rounded-xl p-8 bg-neutral-50">
              {form.content.trim() ? (
                <div
                  className="blog-prose max-w-2xl"
                  dangerouslySetInnerHTML={{ __html: form.content }}
                />
              ) : (
                <p className="text-sm text-neutral-400 text-center py-16">
                  Nenhum conteúdo para pré-visualizar.
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── Danger zone (edit only) ────────────────────────────────────────────── */}
      {isEdit && (
        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-red-100 p-6">
          <h2 className="text-xs font-bold text-red-600 uppercase tracking-widest mb-1">Zona de Perigo</h2>
          <p className="text-sm text-neutral-500 mb-4">
            Esta ação é irreversível. Digite{' '}
            <strong className="font-mono text-neutral-700">{form.slug}</strong> para confirmar a exclusão.
          </p>
          <div className="flex flex-wrap gap-3">
            <input
              type="text"
              value={deleteConfirm}
              onChange={e => setDeleteConfirm(e.target.value)}
              placeholder={form.slug}
              className="flex-1 min-w-40 px-3 py-2.5 bg-neutral-100 rounded-lg text-sm border-0 outline-none focus:ring-2 focus:ring-red-300 font-mono"
            />
            <button
              onClick={handleDelete}
              disabled={deleteConfirm !== form.slug || isDeleting}
              className="px-4 py-2.5 bg-red-600 text-white rounded-xl text-sm font-semibold disabled:opacity-40 hover:bg-red-700 transition-colors"
            >
              {isDeleting ? 'Excluindo...' : 'Excluir Post'}
            </button>
          </div>
        </div>
      )}

      {/* ── Toast ──────────────────────────────────────────────────────────────── */}
      {toast && (
        <div className={[
          'fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-medium text-white transition-all',
          toast.type === 'success' ? 'bg-green-600' : 'bg-red-600',
        ].join(' ')}>
          {toast.msg}
        </div>
      )}

    </div>
  )
}
