'use client'

import { useState, useRef, useEffect } from 'react'
import {
  DEFAULT_FILTERS,
  RESIDENTIAL_OPTIONS,
  type Filters,
  type PropertyType,
  type Feature,
  type Property,
} from '@/data/properties'
import CatalogSection from './catalog/CatalogSection'

// ── Option lists ───────────────────────────────────────────────────────────────

const NEGOCIO_OPTIONS = [
  { label: 'Todos',   value: 'all'  },
  { label: 'Venda',   value: 'sale' },
  { label: 'Aluguel', value: 'rent' },
] as const

const TIPO_OPTIONS = [
  { label: 'Todos',       value: 'all'        },
  { label: 'Apartamento', value: 'apartment'  },
  { label: 'Casa',        value: 'house'      },
  { label: 'Comercial',   value: 'commercial' },
  { label: 'Terreno',     value: 'land'       },
] as const

const FEATURE_OPTIONS: { value: Feature; label: string }[] = [
  { value: 'balcony',      label: 'Varanda'        },
  { value: 'parking',      label: 'Estacionamento' },
  { value: 'gym',          label: 'Academia'       },
  { value: 'pool',         label: 'Piscina'        },
  { value: 'garden',       label: 'Jardim'         },
  { value: 'furnished',    label: 'Mobiliado'      },
  { value: 'baccarat',     label: 'Exclusivo Baccarat' },
  { value: 'pet-friendly', label: 'Aceita Pets'    },
  { value: 'concierge',    label: 'Portaria'       },
]

// ── CA$ display helper ─────────────────────────────────────────────────────────

function displayCAD(rawDigits: string): string {
  if (!rawDigits) return ''
  return 'CA$ ' + Number(rawDigits).toLocaleString('en-CA')
}

// ── Chevron icon ───────────────────────────────────────────────────────────────

function Chevron({ open, className = '' }: { open: boolean; className?: string }) {
  return (
    <svg
      className={`shrink-0 text-[#9898BB] transition-transform duration-200 ${open ? 'rotate-180' : ''} ${className}`}
      fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
    </svg>
  )
}

// ── Custom Dropdown ────────────────────────────────────────────────────────────

function CustomDropdown({
  label,
  value,
  options,
  onChange,
  hasRightBorder = true,
}: {
  label: string
  value: string
  options: readonly { label: string; value: string }[]
  onChange: (v: string) => void
  hasRightBorder?: boolean
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onMouseDown)
    return () => document.removeEventListener('mousedown', onMouseDown)
  }, [])

  const displayLabel = options.find(o => o.value === value)?.label ?? value

  return (
    <div
      ref={ref}
      onClick={() => setOpen(v => !v)}
      className={
        'relative flex cursor-pointer items-center justify-between px-4 py-3 ' +
        'border-b border-[#E0DACE] ' +
        'md:flex-col md:items-stretch md:justify-center md:px-5 md:py-4 ' +
        'md:border-b-0 ' +
        (hasRightBorder ? 'md:border-r md:border-[#E0DACE]' : '')
      }
    >
      <div className="flex min-w-0 flex-col">
        <span className="font-monument text-[10px] text-[#9898BB]">
          {label}
        </span>
        <div className="mt-0.5 hidden items-center gap-1.5 md:flex">
          <span className="whitespace-nowrap text-sm font-semibold text-[#4A5240]">
            {displayLabel}
          </span>
          <Chevron open={open} className="h-3 w-3" />
        </div>
        <span className="mt-0.5 text-sm font-semibold text-[#4A5240] md:hidden">
          {displayLabel}
        </span>
      </div>
      <Chevron open={open} className="h-4 w-4 md:hidden" />

      {open && (
        <div className="absolute left-0 top-full z-[100] mt-1 min-w-[180px] overflow-hidden
                        rounded-xl border border-[#E0DACE] bg-white shadow-[0_8px_24px_rgba(0,0,0,0.10)]">
          {options.map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={e => { e.stopPropagation(); onChange(opt.value); setOpen(false) }}
              className={
                'w-full px-4 py-2.5 text-left text-sm transition-colors ' +
                (value === opt.value
                  ? 'bg-[#EDEDF4] font-semibold text-[#4E6B5E]'
                  : 'text-[#4A5240] hover:bg-[#F5F0E8]')
              }
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Stepper ────────────────────────────────────────────────────────────────────

function Stepper({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => onChange(Math.max(0, value - 1))}
        disabled={value === 0}
        className="flex h-8 w-8 items-center justify-center rounded-full border-2
                   border-[#E0DACE] text-[#4A5240] transition-colors
                   hover:border-[#6B6B99] hover:text-[#6B6B99]
                   disabled:cursor-not-allowed disabled:opacity-30"
      >
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
        </svg>
      </button>
      <span className="w-7 text-center text-sm font-bold text-[#4A5240]">
        {value}+
      </span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        className="flex h-8 w-8 items-center justify-center rounded-full border-2
                   border-[#E0DACE] text-[#4A5240] transition-colors
                   hover:border-[#6B6B99] hover:text-[#6B6B99]"
      >
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      </button>
    </div>
  )
}

// ── AdvancedInput ──────────────────────────────────────────────────────────────

function AdvancedInput({
  label, type = 'text', placeholder, value, onChange,
}: {
  label: string; type?: string; placeholder: string; value: string; onChange: (v: string) => void
}) {
  return (
    <div>
      <label className="mb-1.5 block font-monument text-[10px] text-[#9898BB]">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full rounded-xl border border-[#E0DACE] bg-white px-4 py-3
                   text-sm text-[#4A5240] placeholder-[#C8C8D8]
                   outline-none transition focus:border-[#6B6B99] focus:ring-1 focus:ring-[#6B6B99]/30"
      />
    </div>
  )
}

// ── HeroSection ────────────────────────────────────────────────────────────────

function HeroSection({ filters, onChange, totalCount }: { filters: Filters; onChange: (f: Filters) => void; totalCount: number }) {
  const [expanded, setExpanded] = useState(false)
  const set = (patch: Partial<Filters>) => onChange({ ...filters, ...patch })

  const toggleFeature = (f: Feature) =>
    set({
      features: filters.features.includes(f)
        ? (filters.features.filter(x => x !== f) as Feature[])
        : ([...filters.features, f] as Feature[]),
    })

  const handleSearch = () => {
    document.getElementById('listings')?.scrollIntoView({ behavior: 'smooth' })
  }

  const scrollToListings = () => {
    document.getElementById('listings')?.scrollIntoView({ behavior: 'smooth' })
  }

  const residentialOpts = [
    { label: 'Todos', value: 'all' },
    ...RESIDENTIAL_OPTIONS.map(r => ({ label: r, value: r })),
  ]

  return (
    <section id="home" className="relative bg-[#F5F0E8]">

      {/* Decorative radial gradients — clipped to section, never affecting dropdowns */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-40 -right-40 h-[700px] w-[700px] rounded-full"
          style={{ background: 'radial-gradient(circle at center, rgba(109,109,133,0.07) 0%, transparent 68%)' }}
        />
        <div
          className="absolute -bottom-20 -left-20 h-[400px] w-[400px] rounded-full"
          style={{ background: 'radial-gradient(circle at center, rgba(163,163,194,0.06) 0%, transparent 70%)' }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-14 lg:pt-20 lg:pb-16">

        {/* ── Split hero ──────────────────────────────────────────────────── */}
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">

          {/* Left — headline + CTA */}
          <div className="animate-page-in">
            <p className="font-monument mb-4 text-[10px] text-[#C8DDB8]">
              Bem-vindo à Casa Baccarat
            </p>
            <h1 className="font-monument text-4xl leading-[1.25] text-[#4A5240] sm:text-5xl lg:text-[3.25rem]">
              Encontre o imóvel<br />
              <span className="text-[#6B6B99]">ideal para você</span>
            </h1>
            <p className="mt-5 max-w-[420px] text-base font-light leading-relaxed text-[#4E6B5E]">
              Explore centenas de anúncios verificados. Compra, venda ou aluguel — encontramos a opção certa para o seu momento.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                onClick={scrollToListings}
                className="inline-flex items-center gap-2 rounded-xl bg-[#6B6B99] px-6 py-3.5
                           text-sm font-semibold text-white shadow-sm
                           hover:bg-[#5757A0] transition-colors duration-200"
              >
                Anuncie seu Imóvel
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </button>
              <span className="text-sm text-[#9898BB]">
                {totalCount > 0 ? `${totalCount} imóveis disponíveis` : 'Imóveis disponíveis'}
              </span>
            </div>
          </div>

          {/* Right — hero image */}
          <div
            className="relative hidden overflow-hidden rounded-2xl lg:block"
            style={{ height: '480px', boxShadow: '0 20px 60px rgba(0,0,0,0.12)' }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=85"
              alt="Imóveis modernos"
              className="h-full w-full object-cover"
            />
            {/* Subtle scrim */}
            <div
              aria-hidden="true"
              className="absolute inset-0"
              style={{ background: 'linear-gradient(135deg, rgba(79,79,107,0.15) 0%, transparent 60%)' }}
            />
            {/* Floating stats card */}
            <div className="absolute bottom-5 left-5 rounded-xl bg-white px-4 py-3"
                 style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.12)' }}>
              <p className="font-monument text-[10px] text-[#9898BB]">
                Imóveis verificados
              </p>
              <p className="mt-0.5 font-monument text-2xl text-[#4A5240]">{totalCount > 0 ? `${totalCount}+` : '—'}</p>
            </div>
            {/* Floating badge */}
            <div className="absolute top-5 right-5 rounded-xl bg-[#6B6B99] px-3 py-1.5">
              <p className="text-[11px] font-semibold text-white">★ Plataforma verificada</p>
            </div>
          </div>
        </div>

        {/* ── Search bar ──────────────────────────────────────────────────── */}
        <div className="mt-10">
          <div
            className="rounded-2xl bg-white"
            style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.07)', border: '1px solid #E0DACE' }}
          >
            <div className="flex flex-col md:flex-row md:items-stretch">

              {/* NEGÓCIO */}
              <CustomDropdown
                label="NEGÓCIO"
                value={filters.negocio}
                options={NEGOCIO_OPTIONS}
                onChange={v => set({ negocio: v as Filters['negocio'] })}
              />

              {/* TIPO */}
              <CustomDropdown
                label="TIPO"
                value={filters.tipo}
                options={TIPO_OPTIONS}
                onChange={v => set({ tipo: v as 'all' | PropertyType })}
              />

              {/* VALOR MÁX */}
              <div className="flex flex-1 flex-col border-b border-[#E0DACE]
                              px-4 py-3 text-left
                              md:justify-center md:border-b-0 md:border-r md:border-[#E0DACE]
                              md:px-5 md:py-4">
                <span className="font-monument text-[10px] text-[#9898BB]">
                  VALOR MÁX.
                </span>
                <input
                  type="text"
                  value={displayCAD(filters.valorMax)}
                  placeholder="CA$ Ilimitado"
                  onChange={e => set({ valorMax: e.target.value.replace(/\D/g, '') })}
                  className="mt-0.5 w-full bg-transparent text-sm font-semibold text-[#4A5240]
                             placeholder-[#C8C8D8] outline-none"
                />
              </div>

              {/* RESIDENCIAL */}
              <CustomDropdown
                label="RESIDENCIAL"
                value={filters.residential}
                options={residentialOpts}
                onChange={v => set({ residential: v })}
              />

              {/* REF */}
              <div className="flex flex-col px-4 py-3 text-left
                              md:justify-center md:px-5 md:py-4">
                <span className="font-monument text-[10px] text-[#9898BB]">
                  REF.
                </span>
                <input
                  type="text"
                  value={filters.ref}
                  placeholder="PROP-000"
                  onChange={e => set({ ref: e.target.value })}
                  className="mt-0.5 w-full bg-transparent text-sm font-semibold text-[#4A5240]
                             placeholder-[#C8C8D8] outline-none"
                />
              </div>

              {/* Search CTA */}
              <button
                onClick={handleSearch}
                className="flex shrink-0 items-center justify-center gap-2
                           bg-[#6B6B99] px-7 py-4 text-sm font-bold text-white whitespace-nowrap
                           transition-colors duration-200 hover:bg-[#5757A0]
                           rounded-b-2xl md:rounded-b-none md:rounded-r-2xl"
              >
                <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 15.803m10.607 0A7.5 7.5 0 0 1 5.196 15.803" />
                </svg>
                Pesquisar
              </button>
            </div>
          </div>

          {/* Advanced toggle */}
          <div className="mt-3 flex justify-center">
            <button
              onClick={() => setExpanded(v => !v)}
              className="flex items-center gap-1.5 text-sm font-medium
                         text-[#9898BB] transition-colors hover:text-[#6B6B99]"
            >
              Filtros Avançados
              <svg
                className={`h-4 w-4 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
                fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            </button>
          </div>

          {/* Advanced panel */}
          <div
            className={
              'overflow-hidden transition-all duration-500 ease-in-out ' +
              (expanded ? 'max-h-[700px] opacity-100 mt-3' : 'max-h-0 opacity-0')
            }
          >
            <div
              className="rounded-2xl bg-[#F5F0E8] p-6"
              style={{ border: '3px solid #C8DDB8', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}
            >
              <p className="mb-4 font-monument text-[10px] text-[#9898BB]">
                Filtros Avançados
              </p>

              {/* Steppers + Area */}
              <div className="mb-5 grid grid-cols-2 gap-3">
                <div className="flex flex-col items-center gap-3 rounded-xl border border-[#E0DACE] bg-white p-4">
                  <span className="font-monument text-[10px] text-[#9898BB]">
                    NUMERO DE SUITES
                  </span>
                  <Stepper value={filters.bedrooms} onChange={v => set({ bedrooms: v })} />
                </div>
                <div className="flex flex-col items-center gap-3 rounded-xl border border-[#E0DACE] bg-white p-4">
                  <span className="font-monument text-[10px] text-[#9898BB]">
                    NUMERO DE LAVABOS
                  </span>
                  <Stepper value={filters.bathrooms} onChange={v => set({ bathrooms: v })} />
                </div>
                <div className="rounded-xl border border-[#E0DACE] bg-white p-4">
                  <AdvancedInput
                    label="ÁREA MÍN (m²)"
                    placeholder="0"
                    value={filters.areaMin}
                    onChange={v => set({ areaMin: v })}
                  />
                </div>
                <div className="rounded-xl border border-[#E0DACE] bg-white p-4">
                  <AdvancedInput
                    label="ÁREA MÁX (m²)"
                    placeholder="Ilimitado"
                    value={filters.areaMax}
                    onChange={v => set({ areaMax: v })}
                  />
                </div>
              </div>

              {/* Features */}
              <div>
                <span className="mb-3 block font-monument text-[10px] text-[#9898BB]">
                  CARACTERÍSTICAS
                </span>
                <div className="flex flex-wrap gap-2">
                  {FEATURE_OPTIONS.map(({ value, label }) => {
                    const active = filters.features.includes(value)
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => toggleFeature(value)}
                        className={
                          'cursor-pointer rounded-full border px-4 py-1.5 text-sm font-medium transition-colors duration-200 ' +
                          (active
                            ? 'border-[#6B6B99] bg-[#6B6B99] text-white'
                            : 'border-[#E0DACE] bg-white text-[#6B6B99] hover:border-[#6B6B99]')
                        }
                      >
                        {label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Clear */}
              {(filters.bedrooms > 0 || filters.bathrooms > 0 ||
                filters.areaMin || filters.areaMax || filters.features.length > 0) && (
                <div className="mt-5 flex justify-end border-t border-[#E0DACE] pt-4">
                  <button
                    type="button"
                    onClick={() => set({ bedrooms: 0, bathrooms: 0, areaMin: '', areaMax: '', features: [] })}
                    className="flex items-center gap-1.5 rounded-full border border-[#E0DACE] px-4 py-1.5
                               text-sm font-medium text-[#9898BB] transition-colors
                               hover:border-[#6B6B99] hover:text-[#6B6B99]"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Limpar filtros avançados
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
        {/* End search bar */}

      </div>
    </section>
  )
}

// ── HomeClient ─────────────────────────────────────────────────────────────────

export default function HomeClient({ initialProperties }: { initialProperties: Property[] }) {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS)

  return (
    <>
      <HeroSection filters={filters} onChange={setFilters} totalCount={initialProperties.length} />
      <CatalogSection properties={initialProperties} filters={filters} onFiltersChange={setFilters} />
    </>
  )
}
