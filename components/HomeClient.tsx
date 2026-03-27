'use client'

import { useState } from 'react'
import {
  DEFAULT_FILTERS,
  type Filters,
  type PropertyType,
  type Feature,
} from '@/data/properties'
import CatalogSection from './catalog/CatalogSection'

// ── Static option tables ───────────────────────────────────────────────────────

const PRICE_MIN_BUY = [
  { label: 'No min',  value: '' },
  { label: '$100k',   value: '100000' },
  { label: '$200k',   value: '200000' },
  { label: '$300k',   value: '300000' },
  { label: '$400k',   value: '400000' },
  { label: '$500k',   value: '500000' },
  { label: '$750k',   value: '750000' },
  { label: '$1M',     value: '1000000' },
  { label: '$1.5M',   value: '1500000' },
  { label: '$2M',     value: '2000000' },
]
const PRICE_MAX_BUY = [
  { label: 'No max',  value: '' },
  { label: '$200k',   value: '200000' },
  { label: '$300k',   value: '300000' },
  { label: '$400k',   value: '400000' },
  { label: '$500k',   value: '500000' },
  { label: '$750k',   value: '750000' },
  { label: '$1M',     value: '1000000' },
  { label: '$1.5M',   value: '1500000' },
  { label: '$2M',     value: '2000000' },
  { label: '$2.5M+',  value: '2500000' },
]
const PRICE_MIN_RENT = [
  { label: 'No min',   value: '' },
  { label: '$500/mo',  value: '500' },
  { label: '$1k/mo',   value: '1000' },
  { label: '$1.5k/mo', value: '1500' },
  { label: '$2k/mo',   value: '2000' },
  { label: '$2.5k/mo', value: '2500' },
  { label: '$3k/mo',   value: '3000' },
  { label: '$4k/mo',   value: '4000' },
]
const PRICE_MAX_RENT = [
  { label: 'No max',   value: '' },
  { label: '$1k/mo',   value: '1000' },
  { label: '$1.5k/mo', value: '1500' },
  { label: '$2k/mo',   value: '2000' },
  { label: '$2.5k/mo', value: '2500' },
  { label: '$3k/mo',   value: '3000' },
  { label: '$4k/mo',   value: '4000' },
  { label: '$5k+/mo',  value: '5000' },
]
// ── Advanced filter option tables (added today) ────────────────────────────────
// Square footage range options for the advanced filter panel
const SQFT_MIN_OPTS = [
  { label: 'Min sqft',    value: '' },
  { label: '500 sqft',    value: '500' },
  { label: '750 sqft',    value: '750' },
  { label: '1,000 sqft',  value: '1000' },
  { label: '1,250 sqft',  value: '1250' },
  { label: '1,500 sqft',  value: '1500' },
  { label: '2,000 sqft',  value: '2000' },
  { label: '2,500 sqft',  value: '2500' },
  { label: '3,000 sqft',  value: '3000' },
]
const SQFT_MAX_OPTS = [
  { label: 'Max sqft',    value: '' },
  { label: '1,000 sqft',  value: '1000' },
  { label: '1,500 sqft',  value: '1500' },
  { label: '2,000 sqft',  value: '2000' },
  { label: '2,500 sqft',  value: '2500' },
  { label: '3,000 sqft',  value: '3000' },
  { label: '3,500 sqft',  value: '3500' },
  { label: '4,000 sqft',  value: '4000' },
  { label: '5,000+ sqft', value: '5000' },
]
// Year built range options — mirrors the yearBuilt field added to Property today
const YEAR_MIN_OPTS = [
  { label: 'Any year', value: '' },
  { label: '1950',     value: '1950' },
  { label: '1970',     value: '1970' },
  { label: '1980',     value: '1980' },
  { label: '1990',     value: '1990' },
  { label: '2000',     value: '2000' },
  { label: '2005',     value: '2005' },
  { label: '2010',     value: '2010' },
  { label: '2015',     value: '2015' },
  { label: '2020',     value: '2020' },
]
const YEAR_MAX_OPTS = [
  { label: 'Any year', value: '' },
  { label: '2000',     value: '2000' },
  { label: '2005',     value: '2005' },
  { label: '2010',     value: '2010' },
  { label: '2015',     value: '2015' },
  { label: '2019',     value: '2019' },
  { label: '2020',     value: '2020' },
  { label: '2022',     value: '2022' },
  { label: '2025',     value: '2025' },
]
// Feature toggle options — each value maps to the Feature union type added today
const FEATURES_LIST: { value: Feature; label: string; icon: string }[] = [
  { value: 'balcony', label: 'Balcony', icon: '🌇' },
  { value: 'parking', label: 'Parking', icon: '🅿️' },
  { value: 'gym',     label: 'Gym',     icon: '💪' },
  { value: 'pool',    label: 'Pool',    icon: '🏊' },
]

// ── Shared style helpers ───────────────────────────────────────────────────────

const labelCls =
  'mb-2 block text-[10px] font-bold uppercase tracking-widest text-slate-400'

const selectCls =
  'w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 pr-8 ' +
  'text-sm text-slate-700 focus:border-[--color-brand] focus:outline-none ' +
  'focus:ring-1 focus:ring-[--color-brand] cursor-pointer transition'

function ChevronDown() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
      fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
    </svg>
  )
}

function SelectWrap({ children }: { children: React.ReactNode }) {
  return <div className="relative">{children}<ChevronDown /></div>
}

function toggleBtnCls(active: boolean) {
  return (
    'rounded-lg px-3.5 py-2 text-sm font-semibold whitespace-nowrap transition-all ' +
    (active
      ? 'bg-[--color-brand] text-white shadow-sm'
      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800')
  )
}

function segmentBtnCls(active: boolean) {
  return (
    'flex-1 rounded-xl py-2.5 text-sm font-semibold transition-all ' +
    (active
      ? 'bg-[--color-brand] text-white shadow-sm'
      : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50')
  )
}

function featureBtnCls(active: boolean) {
  return (
    'flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition-all ' +
    (active
      ? 'border-[--color-brand] bg-[--color-brand]/8 text-[--color-brand]'
      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50')
  )
}

// ── HeroSection ───────────────────────────────────────────────────────────────

function HeroSection({
  filters,
  onChange,
}: {
  filters: Filters
  onChange: (f: Filters) => void
}) {
  const [expanded, setExpanded] = useState(false)
  const set = (patch: Partial<Filters>) => onChange({ ...filters, ...patch })

  const isRent = filters.transaction === 'rent'
  const priceMinOpts = isRent ? PRICE_MIN_RENT : PRICE_MIN_BUY
  const priceMaxOpts = isRent ? PRICE_MAX_RENT : PRICE_MAX_BUY

  const toggleType = (t: PropertyType) => {
    const next = filters.types.includes(t)
      ? filters.types.filter(x => x !== t)
      : [...filters.types, t]
    set({ types: next })
  }

  // Toggle a feature on/off (AND logic — property must have all selected features)
  const toggleFeature = (f: Feature) => {
    const next = filters.features.includes(f)
      ? filters.features.filter(x => x !== f)
      : [...filters.features, f]
    set({ features: next as Feature[] })
  }

  return (
    <section
      id="home"
      className="relative flex flex-col items-center justify-center overflow-hidden"
      style={{
        backgroundImage:
          'url("https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1600&q=85")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Dark gradient overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-slate-900/75 via-slate-900/65 to-slate-900/80"
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-5xl px-4 py-16 text-center sm:px-6 lg:px-8">

        {/* Headline */}
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
          Find Your Perfect{' '}
          <span className="text-[--color-brand]">Home</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-slate-300">
          Browse thousands of verified listings with smart filters tailored to your lifestyle.
        </p>

        {/* ── Filter Card ─────────────────────────────────────────────────── */}
        <div className="mt-10 overflow-hidden rounded-2xl bg-white text-left shadow-2xl ring-1 ring-white/10">

          {/* ── Row 1: Location search ───────────────────────────────────── */}
          <div className="border-b border-slate-100 px-5 pt-5 pb-4">
            <div className="relative">
              <svg
                aria-hidden="true"
                className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
                fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0zM19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              <input
                type="text"
                placeholder="City, neighborhood, or address"
                value={filters.location}
                onChange={e => set({ location: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4
                           text-sm text-slate-800 placeholder-slate-400
                           focus:border-[--color-brand] focus:bg-white focus:outline-none
                           focus:ring-1 focus:ring-[--color-brand] transition"
              />
            </div>
          </div>

          {/* ── Row 2: Property type + Transaction ──────────────────────── */}
          <div className="border-b border-slate-100 px-5 py-4">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">

              {/* Property type toggles */}
              <div>
                <span className={labelCls}>Property Type</span>
                <div className="flex flex-wrap gap-2">
                  {(
                    [
                      { value: 'house',     label: '🏠 House' },
                      { value: 'apartment', label: '🏢 Apartment' },
                      { value: 'condo',     label: '🏙️ Condo' },
                    ] as { value: PropertyType; label: string }[]
                  ).map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() => toggleType(value)}
                      className={toggleBtnCls(filters.types.includes(value))}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Transaction toggles */}
              <div>
                <span className={labelCls}>Transaction</span>
                <div className="flex gap-2">
                  {(['all', 'buy', 'rent'] as const).map(val => (
                    <button
                      key={val}
                      onClick={() => set({ transaction: val, priceMin: '', priceMax: '' })}
                      className={toggleBtnCls(filters.transaction === val)}
                    >
                      {val === 'all' ? 'All' : val.charAt(0).toUpperCase() + val.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Row 3: Price range + Search CTA ─────────────────────────── */}
          <div className="px-5 py-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">

              {/* Price dropdowns */}
              <div className="flex-1">
                <span className={labelCls}>Price Range</span>
                <div className="grid grid-cols-2 gap-2">
                  <SelectWrap>
                    <select
                      value={filters.priceMin}
                      onChange={e => set({ priceMin: e.target.value })}
                      aria-label="Minimum price"
                      className={selectCls}
                    >
                      {priceMinOpts.map((o, i) => (
                        <option key={i} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                  </SelectWrap>
                  <SelectWrap>
                    <select
                      value={filters.priceMax}
                      onChange={e => set({ priceMax: e.target.value })}
                      aria-label="Maximum price"
                      className={selectCls}
                    >
                      {priceMaxOpts.map((o, i) => (
                        <option key={i} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                  </SelectWrap>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex shrink-0 gap-2">
                {/* Advanced Filters toggle */}
                <button
                  onClick={() => setExpanded(v => !v)}
                  aria-expanded={expanded}
                  className={
                    'flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all ' +
                    (expanded
                      ? 'border-[--color-brand] bg-[--color-brand]/8 text-[--color-brand]'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50')
                  }
                >
                  <svg
                    aria-hidden="true"
                    className="h-4 w-4 shrink-0"
                    fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                  </svg>
                  {expanded ? 'Less Filters' : 'Advanced Filters'}
                </button>

                {/* Search */}
                <a
                  href="#listings"
                  className="flex items-center gap-2 rounded-xl bg-[--color-brand] px-5 py-2.5
                             text-sm font-semibold text-white transition-colors
                             hover:bg-[--color-brand-dark] whitespace-nowrap"
                >
                  <svg
                    aria-hidden="true"
                    className="h-4 w-4 shrink-0"
                    fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 15.803m10.607 0A7.5 7.5 0 0 1 5.196 15.803" />
                  </svg>
                  Search
                </a>
              </div>
            </div>
          </div>

          {/* ── Advanced filters panel (expands inline) ──────────────────── */}
          <div
            aria-hidden={!expanded}
            className={
              'overflow-hidden transition-all duration-500 ease-in-out ' +
              (expanded ? 'max-h-[640px] opacity-100' : 'max-h-0 opacity-0')
            }
          >
            <div className="space-y-6 border-t border-slate-100 bg-slate-50/60 px-5 py-6">

              {/* Bedrooms + Bathrooms */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">

                <div>
                  <span className={labelCls}>Bedrooms</span>
                  <div className="flex gap-2">
                    {[0, 1, 2, 3, 4].map(n => (
                      <button
                        key={n}
                        onClick={() => set({ minBeds: n })}
                        className={segmentBtnCls(filters.minBeds === n)}
                      >
                        {n === 0 ? 'Any' : `${n}+`}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className={labelCls}>Bathrooms</span>
                  <div className="flex gap-2">
                    {[0, 1, 2, 3].map(n => (
                      <button
                        key={n}
                        onClick={() => set({ minBaths: n })}
                        className={segmentBtnCls(filters.minBaths === n)}
                      >
                        {n === 0 ? 'Any' : `${n}+`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Features */}
              <div>
                <span className={labelCls}>Features</span>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {FEATURES_LIST.map(({ value, label, icon }) => (
                    <button
                      key={value}
                      onClick={() => toggleFeature(value)}
                      className={featureBtnCls(filters.features.includes(value))}
                    >
                      <span className="text-base" aria-hidden="true">{icon}</span>
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sqft + Year Built */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">

                <div>
                  <span className={labelCls}>Square Footage</span>
                  <div className="grid grid-cols-2 gap-2">
                    <SelectWrap>
                      <select
                        value={filters.sqftMin}
                        onChange={e => set({ sqftMin: e.target.value })}
                        aria-label="Minimum square footage"
                        className={selectCls}
                      >
                        {SQFT_MIN_OPTS.map((o, i) => (
                          <option key={i} value={o.value}>{o.label}</option>
                        ))}
                      </select>
                    </SelectWrap>
                    <SelectWrap>
                      <select
                        value={filters.sqftMax}
                        onChange={e => set({ sqftMax: e.target.value })}
                        aria-label="Maximum square footage"
                        className={selectCls}
                      >
                        {SQFT_MAX_OPTS.map((o, i) => (
                          <option key={i} value={o.value}>{o.label}</option>
                        ))}
                      </select>
                    </SelectWrap>
                  </div>
                </div>

                <div>
                  <span className={labelCls}>Year Built</span>
                  <div className="grid grid-cols-2 gap-2">
                    <SelectWrap>
                      <select
                        value={filters.yearBuiltMin}
                        onChange={e => set({ yearBuiltMin: e.target.value })}
                        aria-label="Year built from"
                        className={selectCls}
                      >
                        {YEAR_MIN_OPTS.map((o, i) => (
                          <option key={i} value={o.value}>{o.label}</option>
                        ))}
                      </select>
                    </SelectWrap>
                    <SelectWrap>
                      <select
                        value={filters.yearBuiltMax}
                        onChange={e => set({ yearBuiltMax: e.target.value })}
                        aria-label="Year built to"
                        className={selectCls}
                      >
                        {YEAR_MAX_OPTS.map((o, i) => (
                          <option key={i} value={o.value}>{o.label}</option>
                        ))}
                      </select>
                    </SelectWrap>
                  </div>
                </div>
              </div>

              {/* Property ID + footer actions */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end">

                <div className="flex-1">
                  <span className={labelCls}>Property ID</span>
                  <input
                    type="text"
                    placeholder="e.g. RE-0013"
                    value={filters.propertyId}
                    onChange={e => set({ propertyId: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5
                               font-mono text-sm text-slate-800 placeholder-slate-400
                               focus:border-[--color-brand] focus:outline-none
                               focus:ring-1 focus:ring-[--color-brand] transition"
                  />
                </div>

                <div className="flex shrink-0 gap-2">
                  <button
                    onClick={() => onChange(DEFAULT_FILTERS)}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm
                               font-semibold text-slate-500 transition-colors hover:bg-slate-100"
                  >
                    Reset All
                  </button>
                  <button
                    onClick={() => setExpanded(false)}
                    className="flex items-center gap-1.5 rounded-xl bg-slate-800 px-4 py-2.5
                               text-sm font-semibold text-white transition-colors hover:bg-slate-700"
                  >
                    <svg
                      aria-hidden="true"
                      className="h-4 w-4 shrink-0"
                      fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                    Close Filters
                  </button>
                </div>
              </div>

            </div>
          </div>
          {/* End advanced panel */}

        </div>
        {/* End filter card */}
      </div>
    </section>
  )
}

// ── Map Section (commented out — to be integrated with Mapbox or Google Maps) ──
/*
function MapSection() {
  return (
    <section id="map" className="border-t border-slate-100 bg-white scroll-mt-16">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-slate-800">Explore by Map</h2>
          <p className="mt-0.5 text-sm text-slate-500">Click a pin to preview a property</p>
        </div>

        <div className="relative h-72 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 sm:h-96">
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                'linear-gradient(rgba(148,163,184,.4) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,.4) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />
          {[
            { top: '30%', left: '22%', price: '$485k' },
            { top: '52%', left: '48%', price: '$3.2k/mo' },
            { top: '25%', left: '65%', price: '$1.25M' },
            { top: '60%', left: '74%', price: '$1.4k/mo' },
            { top: '70%', left: '35%', price: '$620k' },
          ].map((pin, i) => (
            <button
              key={i}
              style={{ top: pin.top, left: pin.left }}
              className="absolute -translate-x-1/2 -translate-y-full"
            >
              <span className="flex items-center rounded-full bg-[--color-brand] px-2.5 py-1
                               text-xs font-bold text-white shadow-lg transition-transform hover:scale-110">
                {pin.price}
              </span>
              <span className="mx-auto mt-0.5 block h-2 w-0.5 bg-[--color-brand]" />
            </button>
          ))}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="rounded-xl border border-slate-200 bg-white/80 px-6 py-4 text-center shadow-sm backdrop-blur-sm">
              <p className="text-sm font-medium text-slate-600">
                Interactive map — integrate Mapbox or Google Maps here
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
*/

// ── Home Client ────────────────────────────────────────────────────────────────

export default function HomeClient() {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS)

  return (
    <>
      <HeroSection filters={filters} onChange={setFilters} />
      {/* <MapSection /> — commented out until map integration is ready */}
      <CatalogSection filters={filters} onFiltersChange={setFilters} />
    </>
  )
}
