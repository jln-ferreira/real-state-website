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
  { value: 'balcony',      label: 'Varanda'           },
  { value: 'parking',      label: 'Estacionamento'    },
  { value: 'gym',          label: 'Academia'          },
  { value: 'pool',         label: 'Piscina'           },
  { value: 'garden',       label: 'Jardim'            },
  { value: 'furnished',    label: 'Mobiliado'         },
  { value: 'pet-friendly', label: 'Aceita Pets'       },
  { value: 'concierge',    label: 'Portaria'          },
]

// ── CA$ display helper (raw digits → "CA$ 1,500,000") ─────────────────────────

function displayCAD(rawDigits: string): string {
  if (!rawDigits) return ''
  return 'CA$ ' + Number(rawDigits).toLocaleString('en-CA')
}

// ── Chevron icon ───────────────────────────────────────────────────────────────

function Chevron({ open, className = '' }: { open: boolean; className?: string }) {
  return (
    <svg
      className={`shrink-0 text-[#1B2A4A] transition-transform duration-200 ${open ? 'rotate-180' : ''} ${className}`}
      fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
    </svg>
  )
}

// ── Custom Dropdown ────────────────────────────────────────────────────────────
// Fix 1: on mobile the outer div is a flex-row (justify-between) so the label
// stack sits on the left and the chevron is pushed to the far right.
// On desktop (md+) it reverts to the original flex-col column layout.

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
        // Mobile: horizontal row — label+value left, chevron right
        'relative flex cursor-pointer items-center justify-between px-4 py-3 ' +
        'border-b border-[#E5E7EB] ' +
        // Desktop: vertical column — label top, value+chevron below
        'md:flex-col md:items-stretch md:justify-center md:px-5 md:py-4 ' +
        'md:border-b-0 ' +
        (hasRightBorder ? 'md:border-r md:border-[#E5E7EB]' : '')
      }
    >
      {/* Label + value — always present */}
      <div className="flex min-w-0 flex-col">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#999999]">
          {label}
        </span>

        {/* Desktop: value inline with chevron */}
        <div className="mt-0.5 hidden items-center gap-1.5 md:flex">
          <span className="whitespace-nowrap text-sm font-semibold text-[#1B2A4A]">
            {displayLabel}
          </span>
          <Chevron open={open} className="h-3 w-3" />
        </div>

        {/* Mobile: value only (chevron is separate, pushed right) */}
        <span className="mt-0.5 text-sm font-semibold text-[#1B2A4A] md:hidden">
          {displayLabel}
        </span>
      </div>

      {/* Mobile-only chevron — pushed to far right by justify-between */}
      <Chevron open={open} className="h-4 w-4 md:hidden" />

      {/* Dropdown menu */}
      {open && (
        <div className="absolute left-0 top-full z-[100] mt-1 min-w-[180px] overflow-hidden
                        rounded-xl border border-[#E5E7EB] bg-white shadow-xl">
          {options.map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={e => { e.stopPropagation(); onChange(opt.value); setOpen(false) }}
              className={
                'w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-[#FDF1EB] ' +
                (value === opt.value
                  ? 'bg-[#FDF1EB] font-semibold text-[#C9714A]'
                  : 'text-[#1B2A4A]')
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
// Fix 2: removed items-center so label and controls are left-aligned within
// each grid cell (matches conectaimovel.com reference).

function Stepper({
  value,
  onChange,
}: {
  value: number
  onChange: (v: number) => void
}) {
  return (
    <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(Math.max(0, value - 1))}
          disabled={value === 0}
          className="flex h-8 w-8 items-center justify-center rounded-full border-2
                     border-[#E5E7EB] text-[#1B2A4A] transition-colors
                     hover:border-[#C9714A] hover:text-[#C9714A]
                     disabled:cursor-not-allowed disabled:opacity-30"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
          </svg>
        </button>

        <span className="w-7 text-center text-sm font-bold text-[#1B2A4A]">
          {value}+
        </span>

        <button
          type="button"
          onClick={() => onChange(value + 1)}
          className="flex h-8 w-8 items-center justify-center rounded-full border-2
                     border-[#E5E7EB] text-[#1B2A4A] transition-colors
                     hover:border-[#C9714A] hover:text-[#C9714A]"
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
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
}: {
  label: string
  type?: string
  placeholder: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div>
      <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-[#999999]">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3
                   text-sm text-[#1B2A4A] placeholder-[#BBBBBB]
                   outline-none transition focus:border-[#C9714A] focus:ring-1 focus:ring-[#C9714A]"
      />
    </div>
  )
}

// ── HeroSection ────────────────────────────────────────────────────────────────

function HeroSection({
  filters,
  onChange,
}: {
  filters: Filters
  onChange: (f: Filters) => void
}) {
  const [expanded, setExpanded] = useState(false)
  const set = (patch: Partial<Filters>) => onChange({ ...filters, ...patch })

  const toggleFeature = (f: Feature) =>
    set({
      features: filters.features.includes(f)
        ? (filters.features.filter(x => x !== f) as Feature[])
        : [...filters.features, f],
    })

  const handleSearch = () => {
    console.log(JSON.stringify(filters, null, 2))
    document.getElementById('listings')?.scrollIntoView({ behavior: 'smooth' })
  }

  const residentialOpts = [
    { label: 'Todos', value: 'all' },
    ...RESIDENTIAL_OPTIONS.map(r => ({ label: r, value: r })),
  ]

  return (
    <section
      id="home"
      className="relative flex min-h-[80vh] flex-col items-center justify-center"
      style={{
        backgroundImage:
          'url("https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1600&q=85")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Dark overlay */}
      <div aria-hidden="true" className="absolute inset-0 bg-[#1B2A4A]/72" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-6xl px-4 py-20 text-center sm:px-6 lg:px-8">

        {/* Headline */}
        <h1 className="text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
          Seja bem vindo!
          <br />
          <span className="text-white/85">Seu novo lar está aqui.</span>
        </h1>

        {/* ── Filter area ──────────────────────────────────────────────────── */}
        <div className="mt-12">

          {/* ── Main filter bar ────────────────────────────────────────────── */}
          <div className="rounded-2xl bg-white shadow-2xl">
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

              {/* VALOR MÍN
                  Fix 1: mobile uses px-4 py-3 (matches field row spec);
                  desktop reverts to px-5 py-4 with justify-center. */}
              <div className="flex flex-1 flex-col border-b border-[#E5E7EB]
                              px-4 py-3 text-left
                              md:justify-center md:border-b-0 md:border-r md:border-[#E5E7EB]
                              md:px-5 md:py-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#999999]">
                  VALOR MÍN.
                </span>
                <input
                  type="text"
                  value={displayCAD(filters.valorMin)}
                  placeholder="CA$ 0"
                  onChange={e => set({ valorMin: e.target.value.replace(/\D/g, '') })}
                  className="mt-0.5 w-full bg-transparent text-sm font-semibold text-[#1B2A4A]
                             placeholder-[#BBBBBB] outline-none"
                />
              </div>

              {/* VALOR MÁX */}
              <div className="flex flex-1 flex-col border-b border-[#E5E7EB]
                              px-4 py-3 text-left
                              md:justify-center md:border-b-0 md:border-r md:border-[#E5E7EB]
                              md:px-5 md:py-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#999999]">
                  VALOR MÁX.
                </span>
                <input
                  type="text"
                  value={displayCAD(filters.valorMax)}
                  placeholder="CA$ Ilimitado"
                  onChange={e => set({ valorMax: e.target.value.replace(/\D/g, '') })}
                  className="mt-0.5 w-full bg-transparent text-sm font-semibold text-[#1B2A4A]
                             placeholder-[#BBBBBB] outline-none"
                />
              </div>

              {/* RESIDENCIAL */}
              <CustomDropdown
                label="RESIDENCIAL"
                value={filters.residential}
                options={residentialOpts}
                onChange={v => set({ residential: v })}
              />

              {/* REF — last field: NO border-b on mobile */}
              <div className="flex flex-col px-4 py-3 text-left
                              md:justify-center md:px-5 md:py-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#999999]">
                  REF.
                </span>
                <input
                  type="text"
                  value={filters.ref}
                  placeholder="PROP-000"
                  onChange={e => set({ ref: e.target.value })}
                  className="mt-0.5 w-full bg-transparent text-sm font-semibold text-[#1B2A4A]
                             placeholder-[#BBBBBB] outline-none"
                />
              </div>

              {/* Search CTA */}
              <button
                onClick={handleSearch}
                className="flex shrink-0 items-center justify-center gap-2
                           bg-[#C9714A] px-7 py-4 text-sm font-bold text-white
                           transition-colors hover:bg-[#b8613c] whitespace-nowrap
                           rounded-b-2xl md:rounded-b-none md:rounded-r-2xl"
              >
                <svg
                  className="h-4 w-4 shrink-0"
                  fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 15.803m10.607 0A7.5 7.5 0 0 1 5.196 15.803" />
                </svg>
                Pesquisar Imóveis
              </button>

            </div>
          </div>

          {/* ── Advanced toggle ───────────────────────────────────────────── */}
          <div className="mt-4 flex justify-center">
            <button
              onClick={() => setExpanded(v => !v)}
              className="flex items-center gap-1.5 text-sm font-semibold
                         text-white/75 transition-colors hover:text-white"
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

          {/* ── Advanced panel ────────────────────────────────────────────── */}
          <div
            className={
              'overflow-hidden transition-all duration-500 ease-in-out ' +
              (expanded ? 'max-h-[700px] opacity-100 mt-3' : 'max-h-0 opacity-0')
            }
          >
            <div className="rounded-2xl bg-[#1B2A4A] p-6 shadow-xl">

              {/* Steppers + Area — 2-column grid of individual light boxes */}
              <div className="mb-4 grid grid-cols-2 gap-3">

                <div className="flex flex-col items-center gap-3 rounded-2xl bg-white p-4 shadow-sm">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#999999]">
                    QUARTOS
                  </span>
                  <Stepper
                    value={filters.bedrooms}
                    onChange={v => set({ bedrooms: v })}
                  />
                </div>

                <div className="flex flex-col items-center gap-3 rounded-2xl bg-white p-4 shadow-sm">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#999999]">
                    BANHEIROS
                  </span>
                  <Stepper
                    value={filters.bathrooms}
                    onChange={v => set({ bathrooms: v })}
                  />
                </div>

                <div className="rounded-2xl bg-white p-4 shadow-sm">
                  <AdvancedInput
                    label="ÁREA MÍN (m²)"
                    placeholder="0"
                    value={filters.areaMin}
                    onChange={v => set({ areaMin: v })}
                  />
                </div>

                <div className="rounded-2xl bg-white p-4 shadow-sm">
                  <AdvancedInput
                    label="ÁREA MÁX (m²)"
                    placeholder="Ilimitado"
                    value={filters.areaMax}
                    onChange={v => set({ areaMax: v })}
                  />
                </div>

              </div>

              {/* Features chips — full width, wraps naturally */}
              <div className="text-left">
                <span className="mb-3 block text-[10px] font-bold uppercase tracking-widest text-white/60">
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
                          'cursor-pointer rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ' +
                          (active
                            ? 'border-[#C9714A] bg-[#C9714A] text-white'
                            : 'border-white/25 bg-white/10 text-white hover:border-[#C9714A]')
                        }
                      >
                        {label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Clear advanced filters — only shown when something is active */}
              {(filters.bedrooms > 0 || filters.bathrooms > 0 ||
                filters.areaMin || filters.areaMax || filters.features.length > 0) && (
                <div className="mt-5 flex justify-end border-t border-white/10 pt-4">
                  <button
                    type="button"
                    onClick={() => set({ bedrooms: 0, bathrooms: 0, areaMin: '', areaMax: '', features: [] })}
                    className="flex items-center gap-1.5 rounded-full border border-white/25 px-4 py-1.5
                               text-sm font-medium text-white/70 transition-colors
                               hover:border-white/50 hover:text-white"
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
        {/* End filter area */}

      </div>
    </section>
  )
}

// ── Map Section (commented out — to be integrated with Mapbox or Google Maps) ──
/*
function MapSection() { ... }
*/

// ── Home Client ────────────────────────────────────────────────────────────────

export default function HomeClient({ initialProperties }: { initialProperties: Property[] }) {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS)

  return (
    <>
      <HeroSection filters={filters} onChange={setFilters} />
      <CatalogSection properties={initialProperties} filters={filters} onFiltersChange={setFilters} />
    </>
  )
}
