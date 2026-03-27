'use client'

import { useState, useMemo } from 'react'
import {
  PROPERTIES,
  DEFAULT_FILTERS,
  applyFilters,
  sortProperties,
  formatPrice,
  type Filters,
  type SortKey,
  type Property,
  type Feature,
} from '@/data/properties'
import PropertyCard from './PropertyCard'

interface CatalogProps {
  filters: Filters
  onFiltersChange: (f: Filters) => void
}

// ── Active filter chips ────────────────────────────────────────────────────────

function ActiveChips({ filters, onChange }: { filters: Filters; onChange: (f: Filters) => void }) {
  const chips: { label: string; clear: () => void }[] = []
  const set = (patch: Partial<Filters>) => onChange({ ...filters, ...patch })

  if (filters.transaction !== 'all')
    chips.push({ label: filters.transaction === 'buy' ? 'For Sale' : 'For Rent', clear: () => set({ transaction: 'all' }) })

  filters.types.forEach(t =>
    chips.push({
      label: t.charAt(0).toUpperCase() + t.slice(1),
      clear: () => set({ types: filters.types.filter(x => x !== t) }),
    })
  )

  if (filters.location.trim())
    chips.push({ label: `"${filters.location}"`, clear: () => set({ location: '' }) })

  if (filters.priceMin || filters.priceMax) {
    const lo = filters.priceMin ? `$${Number(filters.priceMin).toLocaleString()}` : ''
    const hi = filters.priceMax ? `$${Number(filters.priceMax).toLocaleString()}` : ''
    chips.push({
      label: lo && hi ? `${lo} – ${hi}` : lo ? `≥ ${lo}` : `≤ ${hi}`,
      clear: () => set({ priceMin: '', priceMax: '' }),
    })
  }

  if (filters.minBeds > 0)
    chips.push({ label: `${filters.minBeds}+ beds`, clear: () => set({ minBeds: 0 }) })
  if (filters.minBaths > 0)
    chips.push({ label: `${filters.minBaths}+ baths`, clear: () => set({ minBaths: 0 }) })
  if (filters.propertyId.trim())
    chips.push({ label: `ID: ${filters.propertyId}`, clear: () => set({ propertyId: '' }) })

  // Year built chip — added today
  if (filters.yearBuiltMin || filters.yearBuiltMax) {
    const lo = filters.yearBuiltMin || ''
    const hi = filters.yearBuiltMax || ''
    chips.push({
      label: lo && hi ? `Built ${lo}–${hi}` : lo ? `Built ≥ ${lo}` : `Built ≤ ${hi}`,
      clear: () => set({ yearBuiltMin: '', yearBuiltMax: '' }),
    })
  }
  // Sqft chip — added today
  if (filters.sqftMin || filters.sqftMax) {
    const lo = filters.sqftMin ? `${Number(filters.sqftMin).toLocaleString()} sqft` : ''
    const hi = filters.sqftMax ? `${Number(filters.sqftMax).toLocaleString()} sqft` : ''
    chips.push({
      label: lo && hi ? `${lo} – ${hi}` : lo ? `≥ ${lo}` : `≤ ${hi}`,
      clear: () => set({ sqftMin: '', sqftMax: '' }),
    })
  }
  // One chip per selected feature — added today
  filters.features.forEach(feat =>
    chips.push({
      label: feat.charAt(0).toUpperCase() + feat.slice(1),
      clear: () => set({ features: filters.features.filter(f => f !== feat) as Feature[] }),
    })
  )

  if (chips.length === 0) return null

  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map(chip => (
        <span
          key={chip.label}
          className="flex items-center gap-1.5 rounded-full bg-[--color-brand]/10 px-3 py-1
                     text-xs font-medium text-[--color-brand]"
        >
          {chip.label}
          <button
            onClick={chip.clear}
            aria-label={`Remove ${chip.label} filter`}
            className="rounded-full hover:bg-[--color-brand]/20 transition-colors p-0.5"
          >
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </span>
      ))}
      <button
        onClick={() => onChange(DEFAULT_FILTERS)}
        className="text-xs text-slate-400 hover:text-slate-700 underline underline-offset-2 transition-colors"
      >
        Clear all
      </button>
    </div>
  )
}

// ── Empty state ────────────────────────────────────────────────────────────────

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-3xl">
        🏠
      </div>
      <h3 className="text-lg font-semibold text-slate-800">No properties found</h3>
      <p className="mt-1 max-w-xs text-sm text-slate-500">
        No listings match your current filters. Try adjusting your search criteria.
      </p>
      <button
        onClick={onReset}
        className="mt-5 rounded-xl bg-[--color-brand] px-5 py-2.5 text-sm font-semibold
                   text-white hover:bg-[--color-brand-dark] transition-colors"
      >
        Reset Filters
      </button>
    </div>
  )
}

// ── Featured highlight card ────────────────────────────────────────────────────

function FeaturedCard({ p }: { p: Property }) {
  return (
    <article className="group relative col-span-full flex cursor-pointer flex-col overflow-hidden
                        rounded-2xl bg-white shadow-sm transition-all duration-300
                        hover:-translate-y-0.5 hover:shadow-xl sm:flex-row">
      {/* Image */}
      <div className="relative h-64 shrink-0 overflow-hidden sm:h-auto sm:w-96">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={p.img}
          alt={p.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div aria-hidden="true"
             className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          <span className="rounded-full bg-amber-400 px-3 py-1 text-[11px] font-bold text-white shadow-md">
            ★ Featured
          </span>
          <span className={`rounded-full px-3 py-1 text-[11px] font-bold text-white shadow-md
            ${p.transaction === 'buy' ? 'bg-emerald-500' : 'bg-blue-500'}`}>
            {p.transaction === 'buy' ? 'For Sale' : 'For Rent'}
          </span>
        </div>
        <span className="absolute bottom-3 left-3 rounded-md bg-black/50 px-2 py-0.5
                         text-[10px] font-mono text-white/80 backdrop-blur-sm">
          {p.id}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col justify-between p-7">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {p.type.charAt(0).toUpperCase() + p.type.slice(1)}
          </span>
          <p className="mt-2 text-3xl font-extrabold leading-tight text-[--color-brand]">
            {formatPrice(p)}
          </p>
          <h3 className="mt-1.5 text-xl font-semibold text-slate-900 transition-colors
                         group-hover:text-[--color-brand]">
            {p.title}
          </h3>
          <p className="mt-2 flex items-center gap-1.5 text-sm text-slate-500">
            <svg className="h-4 w-4 shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24"
                 strokeWidth={1.8} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round"
                    d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0zM19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            {p.address}
          </p>
        </div>

        <div className="mt-6 flex items-center gap-5 border-t border-slate-100 pt-5 text-sm text-slate-700">
          <span className="font-medium">{p.beds} beds</span>
          <span className="font-medium">{p.baths} baths</span>
          {p.garage > 0 && <span className="font-medium">{p.garage} garage</span>}
          <span className="font-medium">{p.sqft.toLocaleString()} sqft</span>
          <button className="ml-auto flex items-center gap-1.5 rounded-xl bg-[--color-brand] px-5 py-2.5
                             text-sm font-semibold text-white hover:bg-[--color-brand-dark] transition-colors">
            View Details
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>
        </div>
      </div>
    </article>
  )
}

// ── CatalogSection ─────────────────────────────────────────────────────────────

export default function CatalogSection({ filters, onFiltersChange }: CatalogProps) {
  const [sortKey, setSortKey] = useState<SortKey>('newest')

  const results = useMemo(
    () => sortProperties(applyFilters(PROPERTIES, filters), sortKey),
    [filters, sortKey],
  )

  const featured    = results.filter(p => p.featured)
  const nonFeatured = results.filter(p => !p.featured)

  return (
    <section id="listings" className="min-h-screen bg-[--color-surface] scroll-mt-16">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

        {/* Page heading */}
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Property Listings</h2>
            <p className="mt-1 text-sm text-slate-500">
              {results.length} of {PROPERTIES.length} properties
            </p>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <span className="hidden text-sm text-slate-500 sm:inline">Sort:</span>
            <select
              value={sortKey}
              onChange={e => setSortKey(e.target.value as SortKey)}
              className="cursor-pointer rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm
                         font-medium text-slate-700 shadow-sm transition focus:border-[--color-brand]
                         focus:outline-none focus:ring-1 focus:ring-[--color-brand]"
            >
              <option value="newest">Newest first</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
            </select>
          </div>
        </div>

        {/* Active filter chips */}
        <div className="mb-6">
          <ActiveChips filters={filters} onChange={onFiltersChange} />
        </div>

        {/* Results */}
        {results.length === 0 ? (
          <EmptyState onReset={() => onFiltersChange(DEFAULT_FILTERS)} />
        ) : (
          <div className="space-y-6">

            {/* Featured row */}
            {featured.length > 0 && (
              <div className="grid grid-cols-1 gap-6">
                {featured.map(p => <FeaturedCard key={p.id} p={p} />)}
              </div>
            )}

            {/* Regular grid — expanded to use full width */}
            {nonFeatured.length > 0 && (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {nonFeatured.map(p => <PropertyCard key={p.id} p={p} />)}
              </div>
            )}

          </div>
        )}
      </div>
    </section>
  )
}
