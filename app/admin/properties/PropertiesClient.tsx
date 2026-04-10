'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { Property } from '@/data/properties'
import SwipeableItem from '@/components/admin/SwipeableItem'
import type { SwipeAction } from '@/components/admin/SwipeableItem'

const TYPE_COLORS: Record<string, string> = {
  house: 'bg-emerald-100 text-emerald-700',
  apartment: 'bg-violet-100 text-violet-700',
  commercial: 'bg-amber-100 text-amber-700',
  land: 'bg-orange-100 text-orange-700',
}

export default function PropertiesClient({ initialProperties }: { initialProperties: Property[] }) {
  const router = useRouter()
  const [properties, setProperties] = useState(initialProperties)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [deleteTarget, setDeleteTarget] = useState<Property | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [isDuplicating, setIsDuplicating] = useState<string | null>(null)
  const [swipeOpenId, setSwipeOpenId] = useState<string | null>(null)
  const [statFilter, setStatFilter] = useState<'sale' | 'rent' | 'featured' | null>(null)
  const [priceMin, setPriceMin] = useState('')
  const [priceMax, setPriceMax] = useState('')
  const PER_PAGE = 10

  function toggleStat(val: 'sale' | 'rent' | 'featured') {
    setStatFilter(prev => prev === val ? null : val)
    setPage(1)
  }

  const filtered = useMemo(() => {
    const minVal = priceMin ? parseFloat(priceMin.replace(/\./g, '').replace(',', '.')) : null
    const maxVal = priceMax ? parseFloat(priceMax.replace(/\./g, '').replace(',', '.')) : null
    return properties.filter(p => {
      const s = search.toLowerCase()
      const matchSearch = !s || p.title.toLowerCase().includes(s) || p.id.toLowerCase().includes(s) || p.location.city.toLowerCase().includes(s) || p.location.address.toLowerCase().includes(s)
      const matchType = typeFilter === 'all' || p.propertyDetails.type === typeFilter
      const matchStatus = statusFilter === 'all'
        || (statusFilter === 'active' && p.status.isActive)
        || (statusFilter === 'inactive' && !p.status.isActive)
        || (statusFilter === 'featured' && p.status.isFeatured)
      const matchStat = !statFilter
        || (statFilter === 'sale' && p.price.type === 'sale')
        || (statFilter === 'rent' && p.price.type === 'rent')
        || (statFilter === 'featured' && p.status.isFeatured)
      const matchPrice = (minVal === null || p.price.amount >= minVal) && (maxVal === null || p.price.amount <= maxVal)
      return matchSearch && matchType && matchStatus && matchStat && matchPrice
    })
  }, [properties, search, typeFilter, statusFilter, statFilter, priceMin, priceMax])

  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const stats = {
    total: properties.length,
    sale: properties.filter(p => p.price.type === 'sale').length,
    rent: properties.filter(p => p.price.type === 'rent').length,
    featured: properties.filter(p => p.status.isFeatured).length,
  }

  async function handleDuplicate(id: string) {
    setIsDuplicating(id)
    try {
      const res = await fetch(`/api/admin/properties/${id}/duplicate`, { method: 'POST' })
      if (res.ok) {
        const copy = await res.json()
        setProperties(prev => [copy, ...prev])
      }
    } finally {
      setIsDuplicating(null)
    }
  }

  async function handleDelete() {
    if (!deleteTarget || deleteConfirm !== deleteTarget.id) return
    setIsDeleting(true)
    try {
      const res = await fetch(`/api/admin/properties/${deleteTarget.id}`, { method: 'DELETE' })
      if (res.ok) {
        setProperties(prev => prev.filter(p => p.id !== deleteTarget.id))
        setDeleteTarget(null)
        setDeleteConfirm('')
      }
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl font-bold text-neutral-900">Imóveis</h1>
          <p className="text-sm text-neutral-500 mt-0.5">{properties.length} anúncios no total</p>
        </div>
        <Link href="/admin/properties/new"
          className="flex items-center gap-2 bg-[#6D6D85] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[#585874] transition-colors duration-200 whitespace-nowrap">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Adicionar Imóvel
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <button
          onClick={() => { setStatFilter(null); setPage(1) }}
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
          { label: 'À Venda',     value: stats.sale,     key: 'sale'     },
          { label: 'Para Alugar', value: stats.rent,     key: 'rent'     },
          { label: 'Destaque',    value: stats.featured, key: 'featured' },
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
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <input
          type="text" placeholder="Buscar por título, ID, cidade..."
          value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
          className="w-full sm:flex-1 sm:min-w-48 px-3 py-2 bg-white border border-[#E6E6EF] rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#6D6D85]/20"
        />
        <select value={typeFilter} onChange={e => { setTypeFilter(e.target.value); setPage(1) }}
          className="flex-1 sm:flex-none px-3 py-2 bg-white border border-[#E6E6EF] rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#6D6D85]/20">
          <option value="all">Todos os Tipos</option>
          <option value="apartment">Apartamento</option>
          <option value="house">Casa</option>
          <option value="commercial">Comercial</option>
          <option value="land">Terreno</option>
        </select>
        <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1) }}
          className="flex-1 sm:flex-none px-3 py-2 bg-white border border-[#E6E6EF] rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#6D6D85]/20">
          <option value="all">Todos os Status</option>
          <option value="active">Ativo</option>
          <option value="inactive">Inativo</option>
          <option value="featured">Destaque</option>
        </select>
        <div className="flex items-center gap-1 w-full sm:w-auto">
          <input
            type="text"
            inputMode="numeric"
            placeholder="Preço mín."
            value={priceMin}
            onChange={e => { setPriceMin(e.target.value.replace(/[^\d.,]/g, '')); setPage(1) }}
            className="w-full sm:w-32 px-3 py-2 bg-white border border-[#E6E6EF] rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#6D6D85]/20"
          />
          <span className="text-neutral-400 text-sm flex-shrink-0">–</span>
          <input
            type="text"
            inputMode="numeric"
            placeholder="Preço máx."
            value={priceMax}
            onChange={e => { setPriceMax(e.target.value.replace(/[^\d.,]/g, '')); setPage(1) }}
            className="w-full sm:w-32 px-3 py-2 bg-white border border-[#E6E6EF] rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#6D6D85]/20"
          />
          {(priceMin || priceMax) && (
            <button
              onClick={() => { setPriceMin(''); setPriceMax(''); setPage(1) }}
              className="flex-shrink-0 text-neutral-400 hover:text-neutral-700 text-xs px-2 py-1.5 border border-[#E6E6EF] rounded-xl bg-white"
              title="Limpar filtro de preço"
            >✕</button>
          )}
        </div>
      </div>

      {/* Mobile / tablet card list */}
      <div className="lg:hidden bg-white rounded-2xl shadow-sm border border-[#E6E6EF] divide-y divide-[#E6E6EF] overflow-hidden">
        {paginated.length === 0 ? (
          <p className="text-center py-12 text-sm text-neutral-400">Nenhum imóvel encontrado</p>
        ) : paginated.map(p => {
          const mobileActions: SwipeAction[] = [
            {
              key: 'edit',
              icon: (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                </svg>
              ),
              label: 'Editar',
              onClick: () => router.push(`/admin/properties/${p.id}`),
              color: 'blue',
            },
            {
              key: 'duplicate',
              icon: (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
                </svg>
              ),
              label: 'Duplicar',
              onClick: () => handleDuplicate(p.id),
              color: 'neutral',
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
              onClick: () => window.open(`/property/${p.id}`, '_blank'),
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
              key={p.id}
              id={p.id}
              openId={swipeOpenId}
              onOpen={setSwipeOpenId}
              onTap={() => router.push(`/admin/properties/${p.id}`)}
              actions={mobileActions}
            >
              <div className="flex items-center gap-3 px-4 py-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.media?.thumbnail ?? p.img} alt="" className="w-12 h-12 rounded-lg object-cover flex-shrink-0" onError={e => { (e.target as HTMLImageElement).src = '/placeholder-property.svg' }} />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-neutral-900 line-clamp-1">{p.title}</p>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5">
                    <span className="text-xs text-neutral-400">{p.location.city}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium capitalize ${TYPE_COLORS[p.propertyDetails.type] ?? 'bg-neutral-100 text-neutral-600'}`}>
                      {p.propertyDetails.type}
                    </span>
                    <span className="text-xs font-semibold text-[#4F4F6B]">
                      {p.price.currency} {p.price.amount.toLocaleString()}
                      {p.price.type === 'rent' && <span className="font-normal text-neutral-400">/mo</span>}
                    </span>
                    <span className={`flex items-center gap-1 text-[10px] ${p.status.isActive ? 'text-green-600' : 'text-neutral-400'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full inline-block ${p.status.isActive ? 'bg-green-500' : 'bg-neutral-300'}`} />
                      {p.status.isActive ? 'Ativo' : 'Inativo'}
                      {p.status.isFeatured && <span className="text-amber-400 ml-0.5">★</span>}
                    </span>
                  </div>
                </div>
              </div>
            </SwipeableItem>
          )
        })}
      </div>

      {/* Desktop table */}
      <div className="hidden lg:block bg-white rounded-2xl shadow-sm overflow-hidden border border-[#E6E6EF] overflow-x-auto">
        <table className="w-full min-w-[500px]">
          <thead>
            <tr className="border-b border-[#E6E6EF] bg-[#F7F7FA]">
              <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">ID</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Imóvel</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider hidden sm:table-cell">Tipo</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider hidden md:table-cell">Preço</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider hidden lg:table-cell">Status</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider hidden xl:table-cell">Cadastro</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-12 text-sm text-neutral-400">Nenhum imóvel encontrado</td></tr>
            ) : paginated.map(p => (
              <tr key={p.id} className="border-b border-neutral-100 hover:bg-[#F7F7FA] transition-colors cursor-pointer" onClick={() => router.push(`/admin/properties/${p.id}`)}>
                <td className="px-4 py-3"><span className="text-xs font-mono text-neutral-400">{p.id}</span></td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.media?.thumbnail ?? p.img} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" onError={e => { (e.target as HTMLImageElement).src = '/placeholder-property.svg' }} />
                    <div>
                      <p className="font-semibold text-sm text-neutral-900 line-clamp-1">{p.title}</p>
                      <p className="text-xs text-neutral-400">{p.location.city}, {p.location.province}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  <span className={`px-2 py-0.5 rounded text-xs capitalize font-medium ${TYPE_COLORS[p.propertyDetails.type] ?? 'bg-neutral-100 text-neutral-600'}`}>
                    {p.propertyDetails.type}
                  </span>
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <span className="font-semibold text-[#4F4F6B] text-sm">
                    {p.price.currency} {p.price.amount.toLocaleString()}
                    {p.price.type === 'rent' && <span className="text-neutral-400 font-normal text-xs">/mo</span>}
                  </span>
                </td>
                <td className="px-4 py-3 hidden lg:table-cell">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${p.status.isActive ? 'bg-green-500' : 'bg-neutral-300'}`} />
                    <span className={`text-xs ${p.status.isActive ? 'text-green-600' : 'text-neutral-400'}`}>
                      {p.status.isActive ? 'Ativo' : 'Inativo'}
                    </span>
                    {p.status.isFeatured && <span className="text-amber-400 text-xs ml-1">★</span>}
                  </div>
                </td>
                <td className="px-4 py-3 hidden xl:table-cell">
                  <span className="text-xs text-neutral-500">
                    {p.timestamps?.createdAt
                      ? new Date(p.timestamps.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
                      : '—'}
                  </span>
                </td>
                <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                  <div className="flex items-center justify-end gap-3">
                    <Link href={`/admin/properties/${p.id}`} className="text-xs text-[#4F4F6B] hover:underline font-medium">Editar</Link>
                    <button onClick={() => handleDuplicate(p.id)} disabled={isDuplicating === p.id}
                      className="text-xs text-neutral-500 hover:text-neutral-700 disabled:opacity-40">
                      {isDuplicating === p.id ? '...' : 'Duplicar'}
                    </button>
                    <a href={`/property/${p.id}`} target="_blank" rel="noreferrer" className="text-xs text-neutral-500 hover:text-neutral-700">Ver</a>
                    <button onClick={() => { setDeleteTarget(p); setDeleteConfirm('') }}
                      className="text-xs text-red-500 hover:text-red-700">Excluir</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            className="px-3 py-1.5 text-sm border border-neutral-200 rounded-lg disabled:opacity-40 hover:bg-[#F7F7FA]">Anterior</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
            <button key={n} onClick={() => setPage(n)}
              className={`px-3 py-1.5 text-sm rounded-lg ${n === page ? 'bg-[#6D6D85] text-white' : 'border border-[#E6E6EF] hover:bg-[#F7F7FA]'}`}>
              {n}
            </button>
          ))}
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            className="px-3 py-1.5 text-sm border border-neutral-200 rounded-lg disabled:opacity-40 hover:bg-[#F7F7FA]">Próximo</button>
        </div>
      )}

      {/* Delete modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full">
            <h2 className="text-base font-bold text-neutral-900 mb-1">Excluir imóvel?</h2>
            <p className="text-sm text-neutral-500 mb-4">
              Esta ação não pode ser desfeita. Digite <strong className="font-mono">{deleteTarget.id}</strong> para confirmar.
            </p>
            <input type="text" value={deleteConfirm} onChange={e => setDeleteConfirm(e.target.value)}
              placeholder={deleteTarget.id}
              className="w-full px-3 py-2.5 bg-neutral-100 rounded-lg text-sm border-0 outline-none focus:ring-2 focus:ring-red-300 mb-4 font-mono" />
            <div className="flex gap-3">
              <button onClick={() => { setDeleteTarget(null); setDeleteConfirm('') }}
                className="flex-1 py-2.5 border border-neutral-200 rounded-xl text-sm font-medium hover:bg-[#F7F7FA]">Cancelar</button>
              <button onClick={handleDelete} disabled={deleteConfirm !== deleteTarget.id || isDeleting}
                className="flex-1 py-2.5 bg-red-600 text-white rounded-xl text-sm font-semibold disabled:opacity-40 hover:bg-red-700 transition-colors">
                {isDeleting ? 'Excluindo...' : 'Excluir'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
