import Link from 'next/link'
import { type Property, formatPrice } from '@/data/properties'

const TYPE_LABELS: Record<Property['propertyDetails']['type'], string> = {
  house:      'Casa',
  apartment:  'Apartamento',
  commercial: 'Comercial',
  land:       'Terreno',
}

export default function PropertyCard({ p }: { p: Property }) {
  return (
    <Link href={`/property/${p.id}`} className="block">
      <article
        className="group flex flex-col overflow-hidden rounded-[14px] bg-white cursor-pointer
                   transition-all duration-300 hover:-translate-y-1"
        style={{
          border: '1px solid #E0DACE',
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
        }}
        onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 12px 36px rgba(0,0,0,0.11)')}
        onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.06)')}
      >
        {/* ── Image ────────────────────────────────────────────────────────────── */}
        <div className="relative h-52 shrink-0 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={p.img}
            alt={p.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div aria-hidden="true"
               className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />

          {/* Seleção Casa Baccarat badge */}
          {p.status.isFeatured && (
            <span className="absolute bottom-0 left-0 bg-[#F5F0E8]/90 px-3 py-1.5
                             text-[9px] font-light tracking-[0.2em] uppercase text-[#4A5240]">
              Seleção Casa Baccarat
            </span>
          )}

          {/* Property ID */}
          <span className={[
            'absolute rounded-md bg-black/40 px-2 py-0.5 text-[10px] font-mono text-white/80 backdrop-blur-sm',
            p.status.isFeatured ? 'bottom-3 right-3' : 'bottom-3 left-3',
          ].join(' ')}>
            {p.id}
          </span>
        </div>

        {/* ── Body ─────────────────────────────────────────────────────────────── */}
        <div className="flex flex-1 flex-col p-5 gap-1">

          {/* Type · Residential */}
          <p className="text-xs text-[#9898BB]">
            {TYPE_LABELS[p.propertyDetails.type]}
            {p.location.residential ? ` · ${p.location.residential}` : ''}
          </p>

          {/* City · State */}
          <p className="text-xs text-[#9898BB]">
            {p.location.city}{p.location.province ? ` · ${p.location.province}` : ''}
          </p>

          {/* Area · Suites */}
          <p className="text-xs text-[#9898BB]">
            {p.propertyDetails.areaSqFt.toLocaleString()} m²
            {p.propertyDetails.bedrooms > 0 && (
              <> · {p.propertyDetails.bedrooms} suíte{p.propertyDetails.bedrooms !== 1 ? 's' : ''}</>
            )}
          </p>

          {/* Price */}
          <p className="mt-2 text-base font-extrabold text-[#4E6B5E] leading-tight">
            {formatPrice(p)}
          </p>
        </div>
      </article>
    </Link>
  )
}
