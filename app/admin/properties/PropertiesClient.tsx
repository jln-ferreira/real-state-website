'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import type { Property } from '@/data/properties'

const TYPE_COLORS: Record<string, string> = {
  house: 'bg-emerald-100 text-emerald-700',
  apartment: 'bg-violet-100 text-violet-700',
  commercial: 'bg-amber-100 text-amber-700',
  land: 'bg-orange-100 text-orange-700',
}

export default function PropertiesClient({ initialProperties }: { initialProperties: Property[] }) {
  const [properties, setProperties] = useState(initialProperties)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [deleteTarget, setDeleteTarget] = useState<Property | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [isDuplicating, setIsDuplicating] = useState<string | null>(null)
  const PER_PAGE = 10

  const filtered = useMemo(() => properties.filter(p => {
    const s = search.toLowerCase()
    const matchSearch = !s || p.title.toLowerCase().includes(s) || p.id.toLowerCase().includes(s) || p.location.city.toLowerCase().includes(s)
    const matchType = typeFilter === 'all' || p.propertyDetails.type === typeFilter
    const matchStatus = statusFilter === 'all'
      || (statusFilter === 'active' && p.status.isActive)
      || (statusFilter === 'inactive' && !p.status.isActive)
      || (statusFilter === 'featured' && p.status.isFeatured)
    return matchSearch && matchType && matchStatus
  }), [properties, search, typeFilter, statusFilter])

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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-neutral-900">Properties</h1>
          <p className="text-sm text-neutral-500 mt-0.5">{properties.length} total listings</p>
        </div>
        <Link href="/admin/properties/new"
          className="flex items-center gap-2 bg-[#C4785A] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[#b8613c] transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Property
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total', value: stats.total },
          { label: 'For Sale', value: stats.sale },
          { label: 'For Rent', value: stats.rent },
          { label: 'Featured', value: stats.featured },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-100">
            <p className="text-2xl font-bold text-[#1E3A5F]">{s.value}</p>
            <p className="text-xs text-neutral-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <input
          type="text" placeholder="Search by title, ID, city..."
          value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
          className="flex-1 min-w-48 px-3 py-2 bg-white border border-neutral-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#1E3A5F]/20"
        />
        <select value={typeFilter} onChange={e => { setTypeFilter(e.target.value); setPage(1) }}
          className="px-3 py-2 bg-white border border-neutral-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#1E3A5F]/20">
          <option value="all">All Types</option>
          <option value="apartment">Apartment</option>
          <option value="house">House</option>
          <option value="commercial">Commercial</option>
          <option value="land">Land</option>
        </select>
        <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1) }}
          className="px-3 py-2 bg-white border border-neutral-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#1E3A5F]/20">
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="featured">Featured</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-neutral-100">
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-100 bg-neutral-50">
              <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">ID</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Property</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider hidden sm:table-cell">Type</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider hidden md:table-cell">Price</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider hidden lg:table-cell">Status</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-12 text-sm text-neutral-400">No properties found</td></tr>
            ) : paginated.map(p => (
              <tr key={p.id} className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
                <td className="px-4 py-3"><span className="text-xs font-mono text-neutral-400">{p.id}</span></td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.media?.thumbnail ?? p.img} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
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
                  <span className="font-semibold text-[#1E3A5F] text-sm">
                    {p.price.currency} {p.price.amount.toLocaleString()}
                    {p.price.type === 'rent' && <span className="text-neutral-400 font-normal text-xs">/mo</span>}
                  </span>
                </td>
                <td className="px-4 py-3 hidden lg:table-cell">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${p.status.isActive ? 'bg-green-500' : 'bg-neutral-300'}`} />
                    <span className={`text-xs ${p.status.isActive ? 'text-green-600' : 'text-neutral-400'}`}>
                      {p.status.isActive ? 'Active' : 'Inactive'}
                    </span>
                    {p.status.isFeatured && <span className="text-amber-400 text-xs ml-1">★</span>}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-3">
                    <Link href={`/admin/properties/${p.id}`} className="text-xs text-[#1E3A5F] hover:underline font-medium">Edit</Link>
                    <button onClick={() => handleDuplicate(p.id)} disabled={isDuplicating === p.id}
                      className="text-xs text-neutral-500 hover:text-neutral-700 disabled:opacity-40">
                      {isDuplicating === p.id ? '...' : 'Duplicate'}
                    </button>
                    <a href={`/property/${p.id}`} target="_blank" rel="noreferrer" className="text-xs text-neutral-500 hover:text-neutral-700">View</a>
                    <button onClick={() => { setDeleteTarget(p); setDeleteConfirm('') }}
                      className="text-xs text-red-500 hover:text-red-700">Delete</button>
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
            className="px-3 py-1.5 text-sm border border-neutral-200 rounded-lg disabled:opacity-40 hover:bg-neutral-50">Prev</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
            <button key={n} onClick={() => setPage(n)}
              className={`px-3 py-1.5 text-sm rounded-lg ${n === page ? 'bg-[#1E3A5F] text-white' : 'border border-neutral-200 hover:bg-neutral-50'}`}>
              {n}
            </button>
          ))}
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            className="px-3 py-1.5 text-sm border border-neutral-200 rounded-lg disabled:opacity-40 hover:bg-neutral-50">Next</button>
        </div>
      )}

      {/* Delete modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full">
            <h2 className="text-base font-bold text-neutral-900 mb-1">Delete property?</h2>
            <p className="text-sm text-neutral-500 mb-4">
              This action cannot be undone. Type <strong className="font-mono">{deleteTarget.id}</strong> to confirm.
            </p>
            <input type="text" value={deleteConfirm} onChange={e => setDeleteConfirm(e.target.value)}
              placeholder={deleteTarget.id}
              className="w-full px-3 py-2.5 bg-neutral-100 rounded-lg text-sm border-0 outline-none focus:ring-2 focus:ring-red-300 mb-4 font-mono" />
            <div className="flex gap-3">
              <button onClick={() => { setDeleteTarget(null); setDeleteConfirm('') }}
                className="flex-1 py-2.5 border border-neutral-200 rounded-xl text-sm font-medium hover:bg-neutral-50">Cancel</button>
              <button onClick={handleDelete} disabled={deleteConfirm !== deleteTarget.id || isDeleting}
                className="flex-1 py-2.5 bg-red-600 text-white rounded-xl text-sm font-semibold disabled:opacity-40 hover:bg-red-700 transition-colors">
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
