'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { sqftToM2 } from '@/data/properties'
import type { Property } from '@/data/properties'
import Layout from '@/components/Layout'

// ── Icons ──────────────────────────────────────────────────────────────────────

function ArrowLeftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
    </svg>
  )
}

function HeartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
  )
}

function ShareIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
    </svg>
  )
}

function BedIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" strokeWidth={1.8} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2 9V6a1 1 0 011-1h18a1 1 0 011 1v3M2 9h20M2 9v9m20-9v9M2 18h20M7 13h10" />
    </svg>
  )
}

function BathIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" strokeWidth={1.8} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 12h16M4 12V7a2 2 0 012-2h3m-5 7v5a2 2 0 002 2h12a2 2 0 002-2v-5M10 5V4a1 1 0 011-1h2a1 1 0 011 1v1" />
    </svg>
  )
}

function RulerIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" strokeWidth={1.8} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
    </svg>
  )
}

function MapPinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0zM19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
  )
}

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.637 0-8.572-3.007-9.963-7.178z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.025.507 3.94 1.404 5.617L0 24l6.532-1.384A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.017-1.373l-.36-.213-3.732.979.995-3.641-.234-.374A9.818 9.818 0 1112 21.818z" />
    </svg>
  )
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}

function ChevronLeftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
    </svg>
  )
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
    </svg>
  )
}

const FEATURE_LABELS: Record<string, string> = {
  balcony:      'Varanda',
  parking:      'Estacionamento',
  gym:          'Academia',
  pool:         'Piscina',
  garden:       'Jardim',
  furnished:    'Mobiliado',
  'pet-friendly': 'Aceita Pets',
  concierge:    'Portaria',
  baccarat:     'Exclusivo Baccarat',
  fireplace:    'Lareira',
  rooftop:      'Cobertura',
  'ev charging':'Carregador Elétrico',
  storage:      'Depósito',
  elevator:     'Elevador',
  security:     'Segurança',
  '24h security':'Segurança 24h',
}

// ── View ───────────────────────────────────────────────────────────────────────

export default function PropertyDetailView({ property, similarProperties }: { property: Property; similarProperties: Property[] }) {
  const images = property.media.images

  const [lightboxOpen,  setLightboxOpen]  = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [activeImg,     setActiveImg]     = useState(0)
  const [formData, setFormData] = useState({
    name:    '',
    phone:   '',
    email:   '',
    message: `Olá, tenho interesse no imóvel ${property.title} (${property.id}) que encontrei no seu site.`,
  })
  const [shareOpen,    setShareOpen]    = useState(false)
  const [linkCopied,   setLinkCopied]   = useState(false)
  const [formStatus,   setFormStatus]   = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const shareRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (shareRef.current && !shareRef.current.contains(e.target as Node)) {
        setShareOpen(false)
      }
    }
    if (shareOpen) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [shareOpen])

  function getPageUrl() {
    return typeof window !== 'undefined' ? window.location.href : ''
  }

  function copyLink() {
    navigator.clipboard.writeText(getPageUrl()).then(() => {
      setLinkCopied(true)
      setTimeout(() => setLinkCopied(false), 2000)
    })
  }

  function openLightbox(i: number) {
    setLightboxIndex(i)
    setLightboxOpen(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFormStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, propertyId: property!.id }),
      })
      setFormStatus(res.ok ? 'success' : 'error')
    } catch {
      setFormStatus('error')
    }
  }

  const shareUrl = encodeURIComponent(getPageUrl())
  const shareText = encodeURIComponent(`${property.title} — Casa Baccarat`)

  function buildWhatsAppMessage(): string {
    const { amount, currency, type } = property.price
    const currencyPrefix = currency === 'BRL' ? 'R$' : currency === 'CAD' ? 'CA$' : 'US$'
    const priceFormatted = amount.toLocaleString('pt-BR')
    const priceSuffix    = type === 'rent' ? '/mes' : ''
    const price = `${currencyPrefix} ${priceFormatted}${priceSuffix}`

    const { bedrooms, bathrooms, areaSqFt, lavabo, escritorio } = property.propertyDetails
    const featureLabelMap: Record<string, string> = {
      balcony: 'Varanda', parking: 'Estacionamento', gym: 'Academia', pool: 'Piscina',
      garden: 'Jardim', furnished: 'Mobiliado', 'pet-friendly': 'Aceita Pets',
      concierge: 'Portaria', baccarat: 'Exclusivo Baccarat', fireplace: 'Lareira',
      rooftop: 'Cobertura', 'ev charging': 'Carregador Eletrico', storage: 'Deposito',
      elevator: 'Elevador', security: 'Seguranca', '24h security': 'Seguranca 24h',
    }

    const bullets: string[] = []
    if (bedrooms > 0)              bullets.push(`- ${bedrooms} suite${bedrooms > 1 ? 's' : ''}`)
    if (bathrooms > 0)             bullets.push(`- ${bathrooms} banheiro${bathrooms > 1 ? 's' : ''}`)
    if (lavabo && lavabo > 0)      bullets.push(`- ${lavabo} lavabo${lavabo > 1 ? 's' : ''}`)
    if (escritorio && escritorio > 0) bullets.push(`- ${escritorio} escritorio${escritorio > 1 ? 's' : ''}`)
    if (areaSqFt > 0)              bullets.push(`- ${areaSqFt} m2`)
    property.features.slice(0, 4).forEach(f => bullets.push(`- ${featureLabelMap[f] ?? f}`))

    const typeMap: Record<string, string> = { house: 'Casa', apartment: 'Apartamento', commercial: 'Imovel Comercial', land: 'Terreno' }
    const typeLabel = typeMap[property.propertyDetails.type] || 'Imovel'
    const buyerProfile = type === 'rent'
      ? 'quem busca conforto e praticidade no dia a dia'
      : bedrooms >= 3
        ? 'familias que valorizam espaco e qualidade de vida'
        : 'casais e investidores que buscam sofisticacao'

    const photo = property.media?.thumbnail || property.media?.images?.[0] || ''

    const lines: string[] = [
      '*CASA BACCARAT IMOVEIS*',
      'Excelencia em cada detalhe',
      '',
      `*${property.title}*`,
      `${property.location.residential ? property.location.residential + ' - ' : ''}${property.location.city}, ${property.location.province}`,
      '',
      `Preco: *${price}*`,
      '',
      `${typeLabel} de alto padrao com acabamentos sofisticados e localizacao privilegiada.`,
      'Um imovel pensado para quem valoriza o melhor da vida.',
      '',
      '*Destaques:*',
      ...bullets,
      '',
      `Ideal para: ${buyerProfile}`,
      '',
      'Venha conhecer pessoalmente e se apaixone por cada detalhe.',
      '',
      ...(photo ? ['Foto principal:', photo, ''] : []),
      'Ver imovel completo:',
      getPageUrl(),
      '',
      'Entre em contato e solicite uma visita exclusiva.',
    ]

    return lines.join('\n')
  }

  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(buildWhatsAppMessage())}`

  return (
    <Layout>
    <div className="min-h-screen bg-[#F5F0E8]">

      {/* ── Sub-header bar ─────────────────────────────────────────────────── */}
      <div className="sticky z-30 border-b border-[#E0DACE] bg-[#F5F0E8] px-4 sm:px-6 lg:px-8" style={{ top: 'var(--header-h, 104px)' }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between h-12">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Voltar
          </Link>
          <div className="relative flex items-center gap-2" ref={shareRef}>
            <button
              onClick={() => setShareOpen(o => !o)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 text-sm text-neutral-600 hover:bg-neutral-50 transition-colors"
            >
              <ShareIcon className="w-4 h-4" /> Compartilhar
            </button>

            {shareOpen && (
              <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-lg border border-neutral-100 py-1 z-50">
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50"
                  onClick={() => setShareOpen(false)}
                >
                  <span className="text-[#25D366] w-4 h-4 shrink-0">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.025.507 3.94 1.404 5.617L0 24l6.532-1.384A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.017-1.373l-.36-.213-3.732.979.995-3.641-.234-.374A9.818 9.818 0 1112 21.818z"/></svg>
                  </span>
                  WhatsApp
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50"
                  onClick={() => setShareOpen(false)}
                >
                  <span className="text-[#1877F2] w-4 h-4 shrink-0">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073c0 6.023 4.388 11.018 10.125 11.927v-8.437H7.078v-3.49h3.047V9.428c0-3.018 1.793-4.684 4.533-4.684 1.313 0 2.686.236 2.686.236v2.964h-1.513c-1.491 0-1.956.93-1.956 1.883v2.246h3.328l-.532 3.49h-2.796V24C19.612 23.091 24 18.096 24 12.073z"/></svg>
                  </span>
                  Facebook
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50"
                  onClick={() => setShareOpen(false)}
                >
                  <span className="text-neutral-900 w-4 h-4 shrink-0">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.631L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/></svg>
                  </span>
                  X (Twitter)
                </a>
                <a
                  href={`mailto:?subject=${shareText}&body=Confira este imóvel: ${getPageUrl()}`}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50"
                  onClick={() => setShareOpen(false)}
                >
                  <svg className="w-4 h-4 text-neutral-500 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
                  E-mail
                </a>
                <div className="border-t border-neutral-100 mt-1 pt-1">
                  <button
                    onClick={copyLink}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50"
                  >
                    <svg className="w-4 h-4 text-neutral-500 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" /></svg>
                    {linkCopied ? 'Link copiado!' : 'Copiar link'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Page content ───────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* ── Desktop gallery ──────────────────────────────────────────────── */}
        <div className="hidden md:grid grid-cols-4 gap-2 rounded-2xl overflow-hidden">
          {/* Main large photo */}
          <div className="col-span-2 row-span-2 relative h-[360px] cursor-pointer bg-neutral-100" onClick={() => openLightbox(0)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={images[0]} alt={property.title} className="w-full h-full object-contain" />
            <div className="absolute top-4 left-4 flex gap-2 z-10">
              <span className="px-3 py-1 text-xs font-bold text-white bg-[#6B6B99] rounded-md">
                Ref: {property.id}
              </span>
              <span className="px-3 py-1 text-xs font-medium text-white bg-neutral-900/70 backdrop-blur-sm rounded-md">
                {images.length} Fotos
              </span>
            </div>
            <span className="absolute bottom-3 right-3 text-[10px] text-white/70 font-medium tracking-widest uppercase">
              Casa Baccarat
            </span>
          </div>

          {/* Thumbnails 1–3 */}
          {images.slice(1, 4).map((img, i) => (
            <div key={i} className="relative h-[176px] overflow-hidden cursor-pointer bg-neutral-100" onClick={() => openLightbox(i + 1)}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img} alt="" className="w-full h-full object-contain hover:opacity-95 transition-opacity" />
            </div>
          ))}

          {/* Last thumbnail with +N overlay */}
          {images[4] && (
            <div className="relative h-[176px] overflow-hidden cursor-pointer bg-neutral-900" onClick={() => openLightbox(4)}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={images[4]} alt="" className="w-full h-full object-contain opacity-50" />
              <span className="absolute inset-0 flex items-center justify-center text-white text-lg font-semibold">
                +{images.length - 4} fotos
              </span>
            </div>
          )}
        </div>

        {/* ── Mobile carousel ──────────────────────────────────────────────── */}
        <div className="md:hidden relative aspect-[4/3] rounded-2xl overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={images[activeImg]} alt={property.title} className="w-full h-full object-cover" />
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className={`h-1.5 rounded-full transition-all ${i === activeImg ? 'w-3 bg-white' : 'w-1.5 bg-white/50'}`}
              />
            ))}
          </div>
        </div>

        {/* ── 2-column layout ──────────────────────────────────────────────── */}
        <div className="grid lg:grid-cols-5 gap-6 mt-3">

          {/* ── Left column ─────────────────────────────────────────────────── */}
          <div className="lg:col-span-3 space-y-4">

            {/* Title card */}
            <div className="p-4 rounded-2xl border border-[#E0DACE] bg-white shadow-sm">
              <div className="flex items-start justify-between gap-2 mb-0.5">
                <h1 className="text-lg md:text-xl font-bold text-neutral-900">{property.title}</h1>
                <span className="flex-shrink-0 px-4 py-1.5 text-base font-extrabold text-[#6B6B99] bg-[#6B6B99]/10 rounded-lg">
                  {property.id}
                </span>
              </div>
              <p className="text-neutral-500 text-sm mb-2">
                {property.location.residential}, {property.location.city}/{property.location.province}
              </p>
              <div className="flex flex-wrap items-center gap-1.5 text-sm">
                {property.propertyDetails.bedrooms > 0 && (
                  <span className="flex items-center gap-1 bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded-lg font-medium">
                    <BedIcon className="w-3.5 h-3.5" /> {property.propertyDetails.bedrooms} quartos
                  </span>
                )}
                {property.propertyDetails.bathrooms > 0 && (
                  <span className="flex items-center gap-1 bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded-lg font-medium">
                    <BathIcon className="w-3.5 h-3.5" /> {property.propertyDetails.bathrooms} banheiros
                  </span>
                )}
                <span className="flex items-center gap-1 bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded-lg font-medium">
                  <RulerIcon className="w-3.5 h-3.5" /> {sqftToM2(property.propertyDetails.areaSqFt).toLocaleString()} m²
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="px-4">
              <h2 className="text-sm font-bold text-neutral-900 uppercase tracking-wide mb-3">
                Descrição do Imóvel
              </h2>
              <div className="text-sm text-neutral-600 leading-relaxed prose prose-sm max-w-none">
                <p>{property.description}</p>
                {property.features.length > 0 && (
                  <ul className="mt-3 space-y-1 not-prose">
                    {property.features.map(f => (
                      <li key={f} className="flex items-start gap-2">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#6B6B99] flex-shrink-0" />
                        <span>{FEATURE_LABELS[f] ?? f}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* WhatsApp CTA */}
            <a
              href={`https://wa.me/${property.agent.phone.replace(/\D/g, '')}`}
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-center gap-3 px-6 py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold transition-colors"
            >
              <WhatsAppIcon className="w-5 h-5" />
              Iniciar conversa no WhatsApp
            </a>

          </div>

          {/* ── Right sidebar ────────────────────────────────────────────────── */}
          <div className="lg:col-span-2">
            <div className="sticky space-y-4" style={{ top: 'calc(var(--header-h, 104px) + 4rem)' }}>

              {/* Price card */}
              <div className="p-4 rounded-2xl border border-[#E0DACE] bg-white shadow-sm">
                <div className="flex flex-wrap items-center gap-1.5 mb-2">
                  <span className="px-2.5 py-0.5 text-xs font-bold rounded-md uppercase bg-[#6B6B99] text-white">
                    {property.price.type === 'rent' ? 'ALUGUEL' : 'VENDA'}
                  </span>
                  <span className="px-2.5 py-0.5 text-xs font-medium bg-neutral-100 text-neutral-600 rounded-md capitalize">
                    {property.propertyDetails.type}
                  </span>
                </div>

                <div className="space-y-1 mb-3">
                  <p className="text-[10px] text-neutral-500 uppercase tracking-wide">
                    {property.price.type === 'rent' ? 'Aluguel Mensal' : 'Preço de Venda'}
                  </p>
                  <p className="text-2xl font-bold text-[#6B6B99]">
                    {property.price.currency} {property.price.amount.toLocaleString()}
                    {property.price.type === 'rent' && (
                      <span className="text-sm font-normal text-neutral-400">/mês</span>
                    )}
                  </p>
                </div>

                {formStatus === 'success' ? (
                  <div className="py-6 text-center space-y-2">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                      <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                    </div>
                    <p className="text-sm font-semibold text-neutral-900">Mensagem enviada!</p>
                    <p className="text-xs text-neutral-500">Entraremos em contato em breve.</p>
                    <button
                      onClick={() => { setFormStatus('idle'); setFormData(d => ({ ...d, name: '', phone: '', email: '' })) }}
                      className="text-xs text-[#6B6B99] underline underline-offset-2 mt-1"
                    >
                      Enviar outra mensagem
                    </button>
                  </div>
                ) : (
                  <form className="space-y-2" onSubmit={handleSubmit}>
                    <input
                      type="text"
                      placeholder="Seu nome *"
                      required
                      value={formData.name}
                      onChange={e => setFormData(d => ({ ...d, name: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-lg bg-neutral-100 border-0 text-sm focus:ring-2 focus:ring-[#6B6B99]/30 outline-none"
                    />
                    <div className="flex gap-2">
                      <span className="px-3 py-2.5 rounded-lg bg-neutral-100 text-sm text-neutral-500">Tel</span>
                      <input
                        type="tel"
                        placeholder=""
                        value={formData.phone}
                        onChange={e => setFormData(d => ({ ...d, phone: e.target.value }))}
                        className="flex-1 px-3 py-2.5 rounded-lg bg-neutral-100 border-0 text-sm focus:ring-2 focus:ring-[#6B6B99]/30 outline-none"
                      />
                    </div>
                    <input
                      type="email"
                      placeholder="Seu e-mail *"
                      required
                      value={formData.email}
                      onChange={e => setFormData(d => ({ ...d, email: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-lg bg-neutral-100 border-0 text-sm focus:ring-2 focus:ring-[#6B6B99]/30 outline-none"
                    />
                    <textarea
                      rows={3}
                      placeholder="Olá, tenho interesse neste imóvel..."
                      value={formData.message}
                      onChange={e => setFormData(d => ({ ...d, message: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-lg bg-neutral-100 border-0 text-sm resize-none focus:ring-2 focus:ring-[#6B6B99]/30 outline-none"
                    />
                    {formStatus === 'error' && (
                      <p className="text-xs text-red-500">Algo deu errado. Tente novamente.</p>
                    )}
                    <button
                      type="submit"
                      disabled={formStatus === 'sending'}
                      className="w-full py-2.5 bg-[#6B6B99] text-white font-semibold rounded-lg hover:bg-[#5a5a88] transition-colors disabled:opacity-60"
                    >
                      {formStatus === 'sending' ? 'Enviando...' : 'Enviar mensagem'}
                    </button>
                  </form>
                )}
              </div>

            </div>
          </div>
        </div>

        {/* ── Similar Properties ───────────────────────────────────────────── */}
        {similarProperties.length > 0 && (
          <section className="mt-8">
            <h2 className="text-sm font-bold text-neutral-900 uppercase tracking-wide mb-3">
              Imóveis Similares
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {similarProperties.map(p => (
                <Link key={p.id} href={`/property/${p.id}`} className="block h-full">
                  <div className="bg-white rounded-2xl overflow-hidden shadow-md border border-[#E0DACE] h-full flex flex-col">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={p.media.thumbnail}
                        alt={p.title}
                        className="w-full h-full object-cover object-center"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-20">
                        <span className="px-1.5 py-px bg-neutral-900/80 backdrop-blur-sm text-white text-[9px] font-medium rounded">
                          {p.id}
                        </span>
                        <span className="px-1.5 py-px bg-[#6B6B99] text-white text-[9px] font-bold uppercase rounded">
                          {p.price.type === 'rent' ? 'ALUGUEL' : 'VENDA'}
                        </span>
                      </div>
                    </div>
                    <div className="p-3 flex-1 flex flex-col">
                      <div className="flex items-center gap-1 text-neutral-500 text-[11px] mb-1">
                        <MapPinIcon className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{p.location.residential}, {p.location.city}</span>
                      </div>
                      <h3 className="font-bold text-neutral-900 text-sm mb-1 line-clamp-2 leading-snug">
                        {p.title}
                      </h3>
                      <p className="text-[10px] text-neutral-500 line-clamp-2 mb-1.5 leading-relaxed">
                        {p.description}
                      </p>
                      <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-neutral-500 mb-2">
                        {p.propertyDetails.bedrooms > 0 && (
                          <span className="flex items-center gap-1.5">
                            <BedIcon className="w-3 h-3" />
                            <strong className="text-neutral-800">{p.propertyDetails.bedrooms}</strong>
                          </span>
                        )}
                        <span className="flex items-center gap-1.5">
                          <RulerIcon className="w-3 h-3" />
                          <strong className="text-neutral-800">{sqftToM2(p.propertyDetails.areaSqFt).toLocaleString()}</strong> m²
                        </span>
                      </div>
                      <div className="pt-2 border-t border-neutral-100 mt-auto">
                        <span className="text-base font-bold text-[#6B6B99]">
                          {p.price.currency} {p.price.amount.toLocaleString()}
                          {p.price.type === 'rent' && (
                            <span className="text-xs font-normal text-neutral-400">/mês</span>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

      </div>

      {/* ── Lightbox ─────────────────────────────────────────────────────────── */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <XIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => setLightboxIndex(i => (i - 1 + images.length) % images.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[lightboxIndex]}
            alt={property.title}
            className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg"
          />
          <button
            onClick={() => setLightboxIndex(i => (i + 1) % images.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <ChevronRightIcon className="w-5 h-5" />
          </button>
          <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
            {lightboxIndex + 1} / {images.length}
          </span>
        </div>
      )}

    </div>
    </Layout>
  )
}
