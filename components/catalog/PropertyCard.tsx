import { type Property, formatPrice } from '@/data/properties'

const TYPE_LABELS: Record<Property['type'], string> = {
  house:     'House',
  apartment: 'Apartment',
  condo:     'Condo',
}

const TYPE_COLORS: Record<Property['type'], string> = {
  house:     'bg-emerald-100 text-emerald-700',
  apartment: 'bg-violet-100 text-violet-700',
  condo:     'bg-amber-100 text-amber-700',
}

export default function PropertyCard({ p }: { p: Property }) {
  return (
    <article
      className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm
                 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
    >
      {/* ── Image ────────────────────────────────────────────────────────────── */}
      <div className="relative h-56 shrink-0 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={p.img}
          alt={p.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Gradient overlay — fades bottom so badges read cleanly */}
        <div aria-hidden="true"
             className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Top-left: transaction badge */}
        <span className={`absolute top-3 left-3 rounded-full px-2.5 py-1 text-[11px] font-bold
                          text-white shadow-md backdrop-blur-sm
                          ${p.transaction === 'buy' ? 'bg-emerald-500' : 'bg-blue-500'}`}>
          {p.transaction === 'buy' ? 'For Sale' : 'For Rent'}
        </span>

        {/* Top-left: featured badge (stacks below transaction) */}
        {p.featured && (
          <span className="absolute top-10 left-3 rounded-full bg-amber-400 px-2.5 py-1
                           text-[11px] font-bold text-white shadow-md">
            ★ Featured
          </span>
        )}

        {/* Top-right: save button */}
        <button
          aria-label="Save property"
          className="absolute top-3 right-3 rounded-full bg-white/90 p-2 text-slate-400
                     hover:text-rose-500 hover:bg-white transition-colors shadow-md"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
        </button>

        {/* Bottom-left: property ID */}
        <span className="absolute bottom-3 left-3 rounded-md bg-black/50 px-2 py-0.5
                         text-[10px] font-mono text-white/80 backdrop-blur-sm">
          {p.id}
        </span>

        {/* Bottom-right: type pill */}
        <span className={`absolute bottom-3 right-3 rounded-full px-2.5 py-0.5
                          text-[11px] font-semibold shadow-sm ${TYPE_COLORS[p.type]}`}>
          {TYPE_LABELS[p.type]}
        </span>
      </div>

      {/* ── Body ─────────────────────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col p-5">
        {/* Price */}
        <p className="text-2xl font-extrabold text-[--color-brand] leading-tight">
          {formatPrice(p)}
        </p>

        {/* Title */}
        <h3 className="mt-1.5 text-base font-semibold text-slate-900 leading-snug
                       group-hover:text-[--color-brand] transition-colors line-clamp-1">
          {p.title}
        </h3>

        {/* Address */}
        <p className="mt-1 flex items-center gap-1 text-xs text-slate-500 line-clamp-1">
          <svg className="h-3.5 w-3.5 shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24"
               strokeWidth={1.8} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round"
                  d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0zM19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
          </svg>
          {p.address}
        </p>

        {/* Specs */}
        <div className="mt-auto pt-4 flex items-center gap-3 text-xs text-slate-500 border-t border-slate-100">
          {/* Beds */}
          <span className="flex items-center gap-1">
            <svg className="h-3.5 w-3.5 text-slate-400" viewBox="0 0 24 24" fill="none"
                 strokeWidth={1.8} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round"
                    d="M2 9V6a1 1 0 011-1h18a1 1 0 011 1v3M2 9h20M2 9v9m20-9v9M2 18h20M7 13h10" />
            </svg>
            {p.beds} bed{p.beds !== 1 ? 's' : ''}
          </span>
          {/* Baths */}
          <span className="flex items-center gap-1">
            <svg className="h-3.5 w-3.5 text-slate-400" viewBox="0 0 24 24" fill="none"
                 strokeWidth={1.8} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round"
                    d="M4 12h16M4 12V7a2 2 0 012-2h3m-5 7v5a2 2 0 002 2h12a2 2 0 002-2v-5M10 5V4a1 1 0 011-1h2a1 1 0 011 1v1" />
            </svg>
            {p.baths} bath{p.baths !== 1 ? 's' : ''}
          </span>
          {/* Garage */}
          {p.garage > 0 && (
            <span className="flex items-center gap-1">
              <svg className="h-3.5 w-3.5 text-slate-400" viewBox="0 0 24 24" fill="none"
                   strokeWidth={1.8} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round"
                      d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
              </svg>
              {p.garage}
            </span>
          )}
          {/* Sqft */}
          <span className="ml-auto font-medium text-slate-600">
            {p.sqft.toLocaleString()} sqft
          </span>
        </div>
      </div>
    </article>
  )
}
