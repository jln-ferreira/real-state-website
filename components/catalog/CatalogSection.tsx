'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import Link from 'next/link'
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

// ── Label maps ─────────────────────────────────────────────────────────────────

const TIPO_LABELS: Record<string, string> = {
  house: 'Casa', apartment: 'Apartamento', commercial: 'Comercial', land: 'Terreno',
}

const FEATURE_LABELS: Record<Feature, string> = {
  balcony: 'Varanda', parking: 'Estacionamento', gym: 'Academia', pool: 'Piscina',
  garden: 'Jardim', furnished: 'Mobiliado', 'pet-friendly': 'Aceita Pets', concierge: 'Portaria',
  baccarat: 'Exclusivo Baccarat',
}

// ── Active filter chips ────────────────────────────────────────────────────────

function ActiveChips({ filters, onChange }: { filters: Filters; onChange: (f: Filters) => void }) {
  const chips: { label: string; clear: () => void }[] = []
  const set = (patch: Partial<Filters>) => onChange({ ...filters, ...patch })

  if (filters.negocio !== 'all')
    chips.push({
      label: filters.negocio === 'sale' ? 'À Venda' : 'Para Alugar',
      clear: () => set({ negocio: 'all' }),
    })
  if (filters.tipo !== 'all')
    chips.push({ label: TIPO_LABELS[filters.tipo] ?? filters.tipo, clear: () => set({ tipo: 'all' }) })
  if (filters.valorMax) {
    chips.push({
      label: `≤ CA$ ${Number(filters.valorMax).toLocaleString('en-CA')}`,
      clear: () => set({ valorMax: '' }),
    })
  }
  if (filters.residential !== 'all')
    chips.push({ label: filters.residential, clear: () => set({ residential: 'all' }) })
  if (filters.ref.trim())
    chips.push({ label: `REF: ${filters.ref}`, clear: () => set({ ref: '' }) })
  if (filters.bedrooms > 0)
    chips.push({ label: `${filters.bedrooms}+ suítes`, clear: () => set({ bedrooms: 0 }) })
  if (filters.bathrooms > 0)
    chips.push({ label: `${filters.bathrooms}+ banheiros`, clear: () => set({ bathrooms: 0 }) })
  if (filters.areaMin || filters.areaMax) {
    const lo = filters.areaMin ? `${Number(filters.areaMin).toLocaleString()} m²` : ''
    const hi = filters.areaMax ? `${Number(filters.areaMax).toLocaleString()} m²` : ''
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
          className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
          style={{ background: 'rgba(109,109,133,0.1)', color: '#4E6B5E' }}
        >
          {chip.label}
          <button
            onClick={chip.clear}
            aria-label={`Remover filtro ${chip.label}`}
            className="rounded-full p-0.5 transition-colors hover:bg-[#6B6B99]/20"
          >
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </span>
      ))}
      <button
        onClick={() => onChange(DEFAULT_FILTERS)}
        className="text-xs text-[#9898BB] hover:text-[#6B6B99] underline underline-offset-2 transition-colors"
      >
        Limpar tudo
      </button>
    </div>
  )
}

// ── Empty state ────────────────────────────────────────────────────────────────

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EDEDF4] text-3xl">
        🏠
      </div>
      <h3 className="text-lg font-semibold text-[#4A5240]">Nenhum imóvel encontrado</h3>
      <p className="mt-1 max-w-xs text-sm text-[#9898BB]">
        Nenhum anúncio corresponde aos seus filtros atuais. Tente ajustar os critérios de busca.
      </p>
      <button
        onClick={onReset}
        className="mt-5 rounded-xl bg-[#6B6B99] px-5 py-2.5 text-sm font-semibold
                   text-white hover:bg-[#5757A0] transition-colors duration-200"
      >
        Redefinir Filtros
      </button>
    </div>
  )
}

// ── Featured highlight card ────────────────────────────────────────────────────

function FeaturedCard({ p }: { p: Property }) {
  const isSale = p.price.type === 'sale'

  return (
    <Link href={`/property/${p.id}`} className="block">
      <article
        className="group flex cursor-pointer flex-col overflow-hidden rounded-[14px] bg-white
                   transition-all duration-300 hover:-translate-y-0.5"
        style={{
          border: '1px solid #E0DACE',
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
        }}
        onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 16px 48px rgba(0,0,0,0.12)')}
        onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.06)')}
      >
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
            <span className="rounded-full bg-amber-400 px-3 py-1 text-[11px] font-bold text-white">
              ★ Destaque
            </span>
            <span className={`rounded-full px-3 py-1 text-[11px] font-semibold text-white
              ${isSale ? 'bg-emerald-500' : 'bg-[#6B6B99]'}`}>
              {isSale ? 'À Venda' : 'Para Alugar'}
            </span>
          </div>
          <span className="absolute bottom-3 left-3 rounded-md bg-black/40 px-2 py-0.5
                           text-[10px] font-mono text-white/80 backdrop-blur-sm">
            {p.id}
          </span>
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col justify-between p-7">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#9898BB]">
              {p.propertyDetails.type.charAt(0).toUpperCase() + p.propertyDetails.type.slice(1)}
            </span>
            <p className="mt-2 font-monument text-2xl leading-tight text-[#4E6B5E]">
              {formatPrice(p)}
            </p>
            <h3 className="mt-1.5 text-lg font-normal text-[#4A5240] transition-colors duration-200
                           group-hover:text-[#6B6B99]">
              {p.title}
            </h3>
            <p className="mt-2 flex items-center gap-1.5 text-sm text-[#9898BB]">
              <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24"
                   strokeWidth={1.8} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round"
                      d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0zM19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              {p.location.address}
            </p>
          </div>

          <div className="mt-6 flex items-center gap-3 border-t border-[#E0DACE] pt-5 text-xs text-[#9898BB]">
            {p.propertyDetails.bedrooms > 0 && (
              <span className="flex items-center gap-1">
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" strokeWidth={1.8} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round"
                        d="M2 9V6a1 1 0 011-1h18a1 1 0 011 1v3M2 9h20M2 9v9m20-9v9M2 18h20M7 13h10" />
                </svg>
                {p.propertyDetails.bedrooms} suíte{p.propertyDetails.bedrooms !== 1 ? 's' : ''}
              </span>
            )}
            <span className="ml-auto font-medium text-[#6B6B99]">
              {p.propertyDetails.areaSqFt.toLocaleString()} m²
            </span>
          </div>
        </div>
      </article>
    </Link>
  )
}

// ── CatalogSection ─────────────────────────────────────────────────────────────

export default function CatalogSection({ properties, filters, onFiltersChange }: CatalogProps) {
  const [sortKey, setSortKey] = useState<SortKey>('newest')
  const [downloading, setDownloading] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [visibleCount, setVisibleCount] = useState(7)
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 768)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  async function handleDownload() {
    setDownloading(true)
    try {
      const res = await fetch('/api/catalog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: results.map(p => p.id) }),
      })
      if (!res.ok) throw new Error('Failed')
      const blob = await res.blob()
      const url  = URL.createObjectURL(blob)
      const a    = document.createElement('a')
      a.href     = url
      a.download = `catalogo-${new Date().toISOString().split('T')[0]}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch {
      alert('Erro ao gerar catálogo. Tente novamente.')
    } finally {
      setDownloading(false)
    }
  }

  const results = useMemo(
    () => sortProperties(applyFilters(properties, filters), sortKey),
    [properties, filters, sortKey],
  )

  // Reset mobile pagination when filters or sort change
  useEffect(() => { setVisibleCount(7) }, [filters, sortKey])

  // Infinite scroll (mobile only) — load more when sentinel is visible
  useEffect(() => {
    if (!isMobile) return
    const el = sentinelRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting)
          setVisibleCount(c => Math.min(c + 7, results.length))
      },
      { rootMargin: '0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [isMobile, results.length])

  const visibleResults = isMobile ? results.slice(0, visibleCount) : results
  const hasMore = isMobile && visibleCount < results.length

  const featured    = visibleResults.filter(p => p.status.isFeatured)
  const nonFeatured = visibleResults.filter(p => !p.status.isFeatured)

  return (
    <section id="listings" className="min-h-screen bg-[#F5F0E8] scroll-mt-16">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">

        {/* Section heading */}
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-monument text-xl text-[#4A5240]">Anúncios de Imóveis</h2>
            <p className="mt-1 text-sm text-[#9898BB]">
              {results.length} de {properties.length} imóveis
            </p>
          </div>

          {/* Sort + Download */}
          <div className="flex items-center gap-2">
            <span className="hidden text-sm text-[#9898BB] sm:inline">Ordenar:</span>
            <select
              value={sortKey}
              onChange={e => setSortKey(e.target.value as SortKey)}
              className="cursor-pointer rounded-xl border border-[#E0DACE] bg-white px-3 py-2 text-sm
                         font-medium text-[#4A5240] shadow-sm transition
                         focus:border-[#6B6B99] focus:outline-none focus:ring-1 focus:ring-[#6B6B99]/30"
            >
              <option value="newest">Mais recente</option>
              <option value="price-asc">Preço: Menor → Maior</option>
              <option value="price-desc">Preço: Maior → Menor</option>
            </select>
            <button
              onClick={handleDownload}
              disabled={downloading || results.length === 0}
              className="flex items-center gap-2 rounded-xl border border-[#E0DACE] bg-white px-3 py-2 text-sm
                         font-medium text-[#6B6B99] shadow-sm transition hover:border-[#6B6B99] hover:text-[#4E6B5E]
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {downloading ? (
                <>
                  <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Gerando...
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  Baixar Catálogo
                </>
              )}
            </button>
          </div>
        </div>

        {/* Active chips */}
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
            {/* Infinite scroll sentinel */}
            {hasMore ? (
              <div ref={sentinelRef} className="flex justify-center py-6">
                <svg className="h-6 w-6 animate-spin text-[#9898BB]" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              </div>
            ) : (
              <p className="text-center text-sm text-[#9898BB] py-4">
                {results.length} imóve{results.length !== 1 ? 'is' : 'l'} exibido{results.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
