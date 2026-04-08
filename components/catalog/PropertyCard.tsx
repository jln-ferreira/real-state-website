import Link from 'next/link'
import { type Property, formatPrice, sqftToM2 } from '@/data/properties'

const TYPE_LABELS: Record<Property['propertyDetails']['type'], string> = {
  house:      'Casa',
  apartment:  'Apartamento',
  commercial: 'Comercial',
  land:       'Terreno',
}

export default function PropertyCard({ p }: { p: Property }) {
  const isSale = p.price.type === 'sale'

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

          {/* Transaction badge */}
          <span className={`absolute top-3 left-3 rounded-full px-2.5 py-1 text-[11px] font-semibold
                            text-white backdrop-blur-sm
                            ${isSale ? 'bg-emerald-500' : 'bg-[#6B6B99]'}`}>
            {isSale ? 'À Venda' : 'Para Alugar'}
          </span>

          {/* Featured badge */}
          {p.status.isFeatured && (
            <span className="absolute top-10 left-3 rounded-full bg-amber-400 px-2.5 py-1
                             text-[11px] font-semibold text-white">
              ★ Destaque
            </span>
          )}

          {/* Property ID */}
          <span className="absolute bottom-3 left-3 rounded-md bg-black/40 px-2 py-0.5
                           text-[10px] font-mono text-white/80 backdrop-blur-sm">
            {p.id}
          </span>
        </div>

        {/* ── Body ─────────────────────────────────────────────────────────────── */}
        <div className="flex flex-1 flex-col p-5">
          {/* Price */}
          <p className="text-xl font-extrabold text-[#4E6B5E] leading-tight">
            {formatPrice(p)}
          </p>

          {/* Title */}
          <h3 className="mt-1.5 text-sm font-semibold text-[#4A5240] leading-snug
                         group-hover:text-[#6B6B99] transition-colors duration-200 line-clamp-1">
            {p.title}
          </h3>

          {/* Address */}
          <p className="mt-1 flex items-center gap-1 text-xs text-[#9898BB] line-clamp-1">
            <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24"
                 strokeWidth={1.8} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round"
                    d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0zM19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            {p.location.address}
          </p>

          {/* Specs */}
          <div className="mt-auto pt-4 flex items-center gap-3 text-xs text-[#9898BB] border-t border-[#E0DACE]">
            {p.propertyDetails.bedrooms > 0 && (
              <span className="flex items-center gap-1">
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none"
                     strokeWidth={1.8} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round"
                        d="M2 9V6a1 1 0 011-1h18a1 1 0 011 1v3M2 9h20M2 9v9m20-9v9M2 18h20M7 13h10" />
                </svg>
                {p.propertyDetails.bedrooms} quarto{p.propertyDetails.bedrooms !== 1 ? 's' : ''}
              </span>
            )}
            {p.propertyDetails.bathrooms > 0 && (
              <span className="flex items-center gap-1">
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none"
                     strokeWidth={1.8} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round"
                        d="M4 12h16M4 12V7a2 2 0 012-2h3m-5 7v5a2 2 0 002 2h12a2 2 0 002-2v-5M10 5V4a1 1 0 011-1h2a1 1 0 011 1v1" />
                </svg>
                {p.propertyDetails.bathrooms} banheiro{p.propertyDetails.bathrooms !== 1 ? 's' : ''}
              </span>
            )}
            <span className="ml-auto font-medium text-[#6B6B99]">
              {sqftToM2(p.propertyDetails.areaSqFt).toLocaleString()} m²
            </span>
          </div>
        </div>
      </article>
    </Link>
  )
}
