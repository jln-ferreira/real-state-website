'use client'

import { useState, useMemo } from 'react'
import {
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
  properties: Property[]
  filters: Filters
  onFiltersChange: (f: Filters) => void
}

// ── Label maps (used by ActiveChips) ──────────────────────────────────────────

const TIPO_LABELS: Record<string, string> = {
  house: 'House', apartment: 'Apartment', commercial: 'Commercial', land: 'Land',
}

const FEATURE_LABELS: Record<Feature, string> = {
  balcony: 'Balcony', parking: 'Parking', gym: 'Gym', pool: 'Pool',
  garden: 'Garden', furnished: 'Furnished', 'pet-friendly': 'Pet Friendly', concierge: 'Concierge',
}

// ── Active filter chips ────────────────────────────────────────────────────────

function ActiveChips({ filters, onChange }: { filters: Filters; onChange: (f: Filters) => void }) {
  const chips: { label: string; clear: () => void }[] = []
  const set = (patch: Partial<Filters>) => onChange({ ...filters, ...patch })

  if (filters.negocio !== 'all')
    chips.push({
      label: filters.negocio === 'sale' ? 'For Sale' : 'For Rent',
      clear: () => set({ negocio: 'all' }),
    })

  if (filters.tipo !== 'all')
    chips.push({
      label: TIPO_LABELS[filters.tipo] ?? filters.tipo,
      clear: () => set({ tipo: 'all' }),
    })

  if (filters.valorMin || filters.valorMax) {
    const lo = filters.valorMin ? `CA$ ${Number(filters.valorMin).toLocaleString('en-CA')}` : ''
    const hi = filters.valorMax ? `CA$ ${Number(filters.valorMax).toLocaleString('en-CA')}` : ''
    chips.push({
      label: lo && hi ? `${lo} – ${hi}` : lo ? `≥ ${lo}` : `≤ ${hi}`,
      clear: () => set({ valorMin: '', valorMax: '' }),
    })
  }

  if (filters.residential !== 'all')
    chips.push({ label: filters.residential, clear: () => set({ residential: 'all' }) })

  if (filters.ref.trim())
    chips.push({ label: `REF: ${filters.ref}`, clear: () => set({ ref: '' }) })

  if (filters.bedrooms > 0)
    chips.push({ label: `${filters.bedrooms}+ beds`, clear: () => set({ bedrooms: 0 }) })

  if (filters.bathrooms > 0)
    chips.push({ label: `${filters.bathrooms}+ baths`, clear: () => set({ bathrooms: 0 }) })

  if (filters.areaMin || filters.areaMax) {
    const lo = filters.areaMin ? `${Number(filters.areaMin).toLocaleString()} sqft` : ''
    const hi = filters.areaMax ? `${Number(filters.areaMax).toLocaleString()} sqft` : ''
    chips.push({
      label: lo && hi ? `${lo} – ${hi}` : lo ? `≥ ${lo}` : `≤ ${hi}`,
      clear: () => set({ areaMin: '', areaMax: '' }),
    })
  }

  filters.features.forEach(feat =>
    chips.push({
      label: FEATURE_LABELS[feat] ?? feat,
      clear: () => set({ features: filters.features.filter(f => f !== feat) as Feature[] }),
    })
  )

  if (chips.length === 0) return null

  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map(chip => (
        <span
          key={chip.label}
          className="flex items-center gap-1.5 rounded-full bg-[#1a56db]/10 px-3 py-1
                     text-xs font-medium text-[#1a56db]"
        >
          {chip.label}
          <button
            onClick={chip.clear}
            aria-label={`Remove ${chip.label} filter`}
            className="rounded-full hover:bg-[#1a56db]/20 transition-colors p-0.5"
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
        className="mt-5 rounded-xl bg-[#1a56db] px-5 py-2.5 text-sm font-semibold
                   text-white hover:bg-[#1e429f] transition-colors"
      >
        Reset Filters
      </button>
    </div>
  )
}

// ── Featured highlight card ────────────────────────────────────────────────────

function FeaturedCard({ p }: { p: Property }) {
  const isSale = p.price.type === 'sale'

  return (
    <article className="group flex cursor-pointer flex-col overflow-hidden
                        rounded-2xl bg-white shadow-sm transition-all duration-300
                        hover:-translate-y-0.5 hover:shadow-xl">
      {/* Image */}
      <div className="relative h-56 shrink-0 overflow-hidden">
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
            ${isSale ? 'bg-emerald-500' : 'bg-blue-500'}`}>
            {isSale ? 'For Sale' : 'For Rent'}
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
            {p.propertyDetails.type.charAt(0).toUpperCase() + p.propertyDetails.type.slice(1)}
          </span>
          <p className="mt-2 text-3xl font-extrabold leading-tight text-[#1a56db]">
            {formatPrice(p)}
          </p>
          <h3 className="mt-1.5 text-xl font-semibold text-slate-900 transition-colors
                         group-hover:text-[#1a56db]">
            {p.title}
          </h3>
          <p className="mt-2 flex items-center gap-1.5 text-sm text-slate-500">
            <svg className="h-4 w-4 shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24"
                 strokeWidth={1.8} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round"
                    d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0zM19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            {p.location.address}
          </p>
        </div>

        <div className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-5 text-xs text-slate-500">
          {p.propertyDetails.bedrooms > 0 && (
            <span className="flex items-center gap-1">
              <svg className="h-3.5 w-3.5 text-slate-400" viewBox="0 0 24 24" fill="none"
                   strokeWidth={1.8} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round"
                      d="M2 9V6a1 1 0 011-1h18a1 1 0 011 1v3M2 9h20M2 9v9m20-9v9M2 18h20M7 13h10" />
              </svg>
              {p.propertyDetails.bedrooms} bed{p.propertyDetails.bedrooms !== 1 ? 's' : ''}
            </span>
          )}
          {p.propertyDetails.bathrooms > 0 && (
            <span className="flex items-center gap-1">
              <svg className="h-3.5 w-3.5 text-slate-400" viewBox="0 0 24 24" fill="none"
                   strokeWidth={1.8} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round"
                      d="M4 12h16M4 12V7a2 2 0 012-2h3m-5 7v5a2 2 0 002 2h12a2 2 0 002-2v-5M10 5V4a1 1 0 011-1h2a1 1 0 011 1v1" />
              </svg>
              {p.propertyDetails.bathrooms} bath{p.propertyDetails.bathrooms !== 1 ? 's' : ''}
            </span>
          )}
          <span className="ml-auto font-medium text-slate-600">
            {p.propertyDetails.areaSqFt.toLocaleString()} sqft
          </span>
        </div>
      </div>
    </article>
  )
}

// ── CatalogSection ─────────────────────────────────────────────────────────────

export default function CatalogSection({ properties, filters, onFiltersChange }: CatalogProps) {
  const [sortKey, setSortKey] = useState<SortKey>('newest')

  const results = useMemo(
    () => sortProperties(applyFilters(properties, filters), sortKey),
    [properties, filters, sortKey],
  )

  const featured    = results.filter(p => p.status.isFeatured)
  const nonFeatured = results.filter(p => !p.status.isFeatured)

  return (
    <section id="listings" className="min-h-screen bg-[--color-surface] scroll-mt-16">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

        {/* Page heading */}
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Property Listings</h2>
            <p className="mt-1 text-sm text-slate-500">
              {results.length} of {properties.length} properties
            </p>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <span className="hidden text-sm text-slate-500 sm:inline">Sort:</span>
            <select
              value={sortKey}
              onChange={e => setSortKey(e.target.value as SortKey)}
              className="cursor-pointer rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm
                         font-medium text-slate-700 shadow-sm transition focus:border-[#1a56db]
                         focus:outline-none focus:ring-1 focus:ring-[#1a56db]"
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

            {featured.length > 0 && (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {featured.map(p => <FeaturedCard key={p.id} p={p} />)}
              </div>
            )}

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
