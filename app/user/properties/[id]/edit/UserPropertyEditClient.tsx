'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { Property } from '@/data/properties'
import { getUploadErrorMessage, prepareImageForUpload } from '@/lib/client-image-upload'

const PROPERTY_TYPES = [
  { value: 'apartment', label: 'Apartamento' },
  { value: 'house', label: 'Casa' },
  { value: 'commercial', label: 'Comercial' },
  { value: 'land', label: 'Terreno' },
]

const FEATURES = [
  { value: 'balcony',      label: 'Varanda' },
  { value: 'parking',      label: 'Estacionamento' },
  { value: 'gym',          label: 'Academia' },
  { value: 'pool',         label: 'Piscina' },
  { value: 'garden',       label: 'Jardim' },
  { value: 'furnished',    label: 'Mobiliado' },
  { value: 'pet-friendly', label: 'Aceita Pets' },
  { value: 'concierge',    label: 'Portaria' },
  { value: 'fireplace',    label: 'Lareira' },
  { value: 'rooftop',      label: 'Cobertura' },
  { value: 'storage',      label: 'Depósito' },
  { value: 'elevator',     label: 'Elevador' },
  { value: 'security',     label: 'Segurança 24h' },
]

interface UserInfo { name: string; phone: string; email: string }
interface FormState {
  title: string; description: string; propertyType: string; priceType: string
  priceAmount: string; currency: string; condominio: string; iptu: string
  address: string; city: string; province: string; residential: string
  bedrooms: number; lavabo: number; escritorio: number; areaSqFt: string; yearBuilt: string
  features: string[]; thumbnail: string; images: string[]
  agentName: string; agentPhone: string; agentEmail: string
}

function formatBRL(raw: string): string {
  const stripped = raw.replace(/\./g, '')
  const onlyValid = stripped.replace(/[^\d,]/g, '')
  const firstComma = onlyValid.indexOf(',')
  const sanitized = firstComma === -1
    ? onlyValid
    : onlyValid.slice(0, firstComma + 1) + onlyValid.slice(firstComma + 1).replace(/,/g, '')
  const parts = sanitized.split(',')
  const intStr = parts[0].replace(/^0+(?=\d)/, '')
  const intNum = parseInt(intStr) || 0
  const intFormatted = intStr === '' ? '' : intNum.toLocaleString('pt-BR')
  return parts.length > 1
    ? intFormatted + ',' + parts[1].slice(0, 2)
    : intFormatted
}

function numToBRL(n: number): string {
  if (!n) return ''
  const str = n.toFixed(2)
  const [intStr, decStr] = str.split('.')
  const withDots = intStr.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  return withDots + ',' + decStr
}

function fromProperty(p: Property, user: UserInfo): FormState {
  const extraImages = (p.media?.images ?? [])
    .map(i => i.url)
    .filter(url => url !== p.media?.thumbnail)
  return {
    title: p.title ?? '',
    description: p.description ?? '',
    propertyType: p.propertyDetails?.type ?? 'apartment',
    priceType: p.price?.type ?? 'sale',
    priceAmount: numToBRL(p.price?.amount ?? 0),
    currency: p.price?.currency ?? 'BRL',
    condominio: p.price?.condominio ? numToBRL(p.price.condominio) : '',
    iptu: p.price?.iptu ? numToBRL(p.price.iptu) : '',
    address: p.location?.address ?? '',
    city: p.location?.city ?? '',
    province: p.location?.province ?? '',
    residential: p.location?.residential ?? '',
    bedrooms: p.propertyDetails?.bedrooms ?? 1,
    lavabo: p.propertyDetails?.lavabo ?? p.propertyDetails?.bathrooms ?? 0,
    escritorio: p.propertyDetails?.escritorio ?? 0,
    areaSqFt: p.propertyDetails?.areaSqFt ? String(p.propertyDetails.areaSqFt) : '',
    yearBuilt: p.propertyDetails?.yearBuilt ? String(p.propertyDetails.yearBuilt) : '',
    features: p.features ?? [],
    thumbnail: p.media?.thumbnail ?? p.img ?? '',
    images: extraImages.length > 0 ? extraImages : [''],
    agentName: p.agent?.name ?? user.name,
    agentPhone: p.agent?.phone ?? user.phone,
    agentEmail: p.agent?.email ?? user.email,
  }
}

function Field({ label, required, children, error }: { label: string; required?: boolean; children: React.ReactNode; error?: string }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-[#4F4F6B] mb-1.5">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}

const inputCls = "w-full px-3 py-2.5 bg-[#F7F7FA] border border-[#E6E6EF] rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#6B6B99]/30 focus:border-[#6B6B99] transition"
const inputErrCls = "w-full px-3 py-2.5 bg-[#FFF5F5] border border-red-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-300/30 focus:border-red-400 transition"
const selectCls = inputCls + " cursor-pointer"

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-base font-semibold text-[#1E3A5F] mb-4 pt-2 border-t border-[#E6E6EF] first:border-0 first:pt-0">{children}</h2>
}

function Counter({ label, value, min = 0, required, error, onChange }: { label: string; value: number; min?: number; required?: boolean; error?: string; onChange: (n: number) => void }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-[#4F4F6B] mb-1.5">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min}
          className="w-9 h-9 rounded-xl bg-[#F7F7FA] border border-[#E6E6EF] hover:bg-[#E6E6EF] flex items-center justify-center text-[#4F4F6B] font-bold transition-colors disabled:opacity-40 disabled:cursor-not-allowed">−</button>
        <span className="w-8 text-center text-sm font-semibold text-[#1E3A5F]">{value}</span>
        <button type="button" onClick={() => onChange(value + 1)}
          className="w-9 h-9 rounded-xl bg-[#F7F7FA] border border-[#E6E6EF] hover:bg-[#E6E6EF] flex items-center justify-center text-[#4F4F6B] font-bold transition-colors">+</button>
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}

export default function UserPropertyEditClient({ property, user }: { property: Property; user: UserInfo }) {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)
  const [form, setForm] = useState<FormState>(fromProperty(property, user))
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [apiError, setApiError] = useState('')
  const [submitError, setSubmitError] = useState('')
  const [thumbUploading, setThumbUploading] = useState(false)
  const [uploading, setUploading] = useState<Record<number, boolean>>({})
  const [bulkUploading, setBulkUploading] = useState(false)
  const [dragImageIndex, setDragImageIndex] = useState<number | null>(null)
  const [dragOverImageIndex, setDragOverImageIndex] = useState<number | null>(null)

  function set(field: keyof FormState) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [field]: e.target.value }))
  }

  function toggleFeature(v: string) {
    setForm(f => ({
      ...f,
      features: f.features.includes(v) ? f.features.filter(x => x !== v) : [...f.features, v],
    }))
  }

  function setImage(idx: number, val: string) {
    setForm(f => { const imgs = [...f.images]; imgs[idx] = val; return { ...f, images: imgs } })
  }

  function moveImage(from: number, to: number) {
    if (!Number.isInteger(from) || !Number.isInteger(to) || from === to || from < 0 || to < 0 || from >= form.images.length || to >= form.images.length) return
    setForm(f => {
      const images = [...f.images]
      const [moved] = images.splice(from, 1)
      images.splice(to, 0, moved)
      return { ...f, images }
    })
  }

  async function uploadFile(file: File): Promise<string | null> {
    try {
      const uploadFile = await prepareImageForUpload(file)
      const fd = new FormData()
      fd.append('file', uploadFile)
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok || !data.url) {
        setApiError(data.error ?? 'Erro ao enviar arquivo.')
        return null
      }
      return data.url
    } catch (err) {
      setApiError(getUploadErrorMessage(err, file))
      return null
    }
  }

  async function uploadThumbnail(file: File) {
    setApiError('')
    setThumbUploading(true)
    try {
      const url = await uploadFile(file)
      if (url) {
        setForm(f => ({ ...f, thumbnail: url }))
        setErrors(e => {
          const { thumbnail, ...rest } = e
          return rest
        })
      }
    } finally {
      setThumbUploading(false)
    }
  }

  async function uploadImage(file: File, idx: number) {
    setApiError('')
    setUploading(u => ({ ...u, [idx]: true }))
    try {
      const url = await uploadFile(file)
      if (url) {
        setForm(f => {
          const imgs = [...f.images]
          imgs[idx] = url
          return { ...f, thumbnail: f.thumbnail || url, images: imgs }
        })
        setErrors(e => {
          const { thumbnail, ...rest } = e
          return rest
        })
      }
    } finally {
      setUploading(u => ({ ...u, [idx]: false }))
    }
  }

  async function uploadImages(files: File[]) {
    if (files.length === 0) return
    setApiError('')
    setBulkUploading(true)
    try {
      const urls = (await Promise.all(files.map(uploadFile))).filter((url): url is string => Boolean(url))
      if (urls.length > 0) {
        setForm(f => {
          const existing = f.images.filter(Boolean)
          return {
            ...f,
            thumbnail: f.thumbnail || urls[0],
            images: [...existing, ...urls],
          }
        })
        setErrors(e => {
          const { thumbnail, ...rest } = e
          return rest
        })
      }
    } finally {
      setBulkUploading(false)
    }
  }

  function validate(): boolean {
    const e: Record<string, string> = {}
    if (!form.title.trim()) e.title = 'Título é obrigatório'
    if (!form.description.trim()) e.description = 'Descrição é obrigatória'
    if (!form.priceAmount.trim() || Number(form.priceAmount.replace(/\./g, '').replace(',', '.')) <= 0)
      e.priceAmount = 'Preço é obrigatório'
    if (!form.address.trim()) e.address = 'Endereço é obrigatório'
    if (!form.city.trim()) e.city = 'Cidade é obrigatória'
    if (!form.province.trim()) e.province = 'Estado é obrigatório'
    if (!form.residential.trim()) e.residential = 'Residencial é obrigatório'
    if (!form.thumbnail.trim()) e.thumbnail = 'URL da miniatura é obrigatória'
    if (!form.agentName.trim()) e.agentName = 'Nome é obrigatório'
    if (!form.agentPhone.trim()) e.agentPhone = 'Telefone é obrigatório'
    if (!form.agentEmail.trim()) e.agentEmail = 'E-mail é obrigatório'
    if (form.bedrooms < 1) e.bedrooms = 'Mínimo 1 suíte'
    if (form.lavabo < 1) e.lavabo = 'Mínimo 1 lavabo'
    if (!form.areaSqFt.trim() || parseFloat(form.areaSqFt) <= 0) e.areaSqFt = 'Área é obrigatória'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setApiError('')
    setSubmitError('')
    if (!validate()) {
      setSubmitError('Preencha todos os campos obrigatórios destacados abaixo.')
      formRef.current?.scrollIntoView({ block: 'start' })
      return
    }

    const rawPrice = form.priceAmount.replace(/\./g, '').replace(',', '.')
    const price = parseFloat(rawPrice) || 0
    const extraImages = form.images.filter(Boolean)
    const allImages = form.thumbnail
      ? [form.thumbnail, ...extraImages.filter(i => i !== form.thumbnail)]
      : extraImages

    const payload = {
      title: form.title,
      description: form.description,
      img: form.thumbnail,
      price: {
        amount: price,
        currency: form.currency,
        type: form.priceType,
        ...(form.condominio ? { condominio: parseFloat(form.condominio.replace(/\./g, '').replace(',', '.')) } : {}),
        ...(form.iptu ? { iptu: parseFloat(form.iptu.replace(/\./g, '').replace(',', '.')) } : {}),
      },
      location: { address: form.address, city: form.city, province: form.province, country: 'Brasil', residential: form.residential },
      propertyDetails: {
        type: form.propertyType,
        bedrooms: form.bedrooms,
        bathrooms: form.lavabo,
        lavabo: form.lavabo,
        escritorio: form.escritorio,
        areaSqFt: parseFloat(form.areaSqFt) || 0,
        ...(form.yearBuilt ? { yearBuilt: parseInt(form.yearBuilt) } : {}),
      },
      features: form.features,
      media: { thumbnail: form.thumbnail, images: allImages.map((url: string) => ({ url })) },
      agent: { name: form.agentName, phone: form.agentPhone, email: form.agentEmail },
    }

    setSaving(true)
    try {
      const res = await fetch(`/api/user/properties/${property.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) {
        setApiError(data.error ?? 'Erro ao salvar imóvel.')
      } else {
        router.push('/user/dashboard')
      }
    } catch {
      setApiError('Erro de conexão. Tente novamente.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/user/dashboard" className="text-[#A3A3C2] hover:text-[#6B6B99] transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-[#1E3A5F]">Editar Imóvel</h1>
          <p className="text-xs text-[#6B6B99] mt-0.5">As alterações serão enviadas para aprovação do administrador antes de publicar.</p>
        </div>
      </div>

      {/* Info banner */}
      <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-700 font-medium flex items-start gap-2">
        <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
        Após salvar, o imóvel ficará pendente de aprovação. Não ficará visível no site até ser aprovado novamente.
      </div>

      <form ref={formRef} onSubmit={handleSubmit} noValidate className="bg-white rounded-2xl border border-[#E6E6EF] p-6 space-y-6">

        {submitError && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700 font-medium">
            {submitError}
          </div>
        )}

        {/* Basic info */}
        <div>
          <SectionTitle>Informações Básicas</SectionTitle>
          <div className="space-y-4">
            <Field label="Título" required error={errors.title}>
              <input type="text" value={form.title} onChange={set('title')} className={errors.title ? inputErrCls : inputCls} />
            </Field>
            <Field label="Descrição" required error={errors.description}>
              <textarea value={form.description} onChange={set('description')} rows={4} className={`w-full px-3 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#6B6B99]/30 focus:border-[#6B6B99] transition resize-none ${errors.description ? 'bg-[#FFF5F5] border-red-300' : 'bg-white border-neutral-300'}`} />
            </Field>
            <Field label="Tipo de Imóvel" required>
              <select value={form.propertyType} onChange={set('propertyType')} className={selectCls}>
                {PROPERTY_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </Field>
          </div>
        </div>

        {/* Price */}
        <div>
          <SectionTitle>Preço</SectionTitle>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Tipo" required>
                <select value={form.priceType} onChange={set('priceType')} className={selectCls}>
                  <option value="sale">Venda</option>
                  <option value="rent">Aluguel</option>
                </select>
              </Field>
              <Field label="Moeda" required>
                <select value={form.currency} onChange={set('currency')} className={selectCls}>
                  <option value="BRL">R$ (BRL)</option>
                  <option value="USD">US$ (USD)</option>
                  <option value="CAD">CA$ (CAD)</option>
                </select>
              </Field>
            </div>
            <Field label="Valor" required error={errors.priceAmount}>
              <input type="text" inputMode="numeric" value={form.priceAmount}
                onChange={e => setForm(f => ({ ...f, priceAmount: formatBRL(e.target.value) }))}
                className={errors.priceAmount ? inputErrCls : inputCls} />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Condomínio (opcional)">
                <input type="text" inputMode="numeric" value={form.condominio}
                  onChange={e => setForm(f => ({ ...f, condominio: formatBRL(e.target.value) }))}
                  className={inputCls} />
              </Field>
              <Field label="IPTU mensal (opcional)">
                <input type="text" inputMode="numeric" value={form.iptu}
                  onChange={e => setForm(f => ({ ...f, iptu: formatBRL(e.target.value) }))}
                  className={inputCls} />
              </Field>
            </div>
          </div>
        </div>

        {/* Location */}
        <div>
          <SectionTitle>Localização</SectionTitle>
          <div className="space-y-4">
            <Field label="Endereço" required error={errors.address}>
              <input type="text" value={form.address} onChange={set('address')} className={errors.address ? inputErrCls : inputCls} />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Cidade" required error={errors.city}>
                <input type="text" value={form.city} onChange={set('city')} className={errors.city ? inputErrCls : inputCls} />
              </Field>
              <Field label="Estado" required error={errors.province}>
                <input type="text" value={form.province} onChange={set('province')} className={errors.province ? inputErrCls : inputCls} />
              </Field>
            </div>
            <Field label="Residencial / Condomínio" required error={errors.residential}>
              <input type="text" value={form.residential} onChange={set('residential')} className={errors.residential ? inputErrCls : inputCls} />
            </Field>
          </div>
        </div>

        {/* Details */}
        <div>
          <SectionTitle>Detalhes</SectionTitle>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <Counter label="Suítes" value={form.bedrooms} min={1} required error={errors.bedrooms}
                onChange={v => setForm(f => ({ ...f, bedrooms: v }))} />
              <Counter label="Lavabos" value={form.lavabo} min={1} required error={errors.lavabo}
                onChange={v => setForm(f => ({ ...f, lavabo: v }))} />
              <Counter label="Escritórios" value={form.escritorio} min={0}
                onChange={v => setForm(f => ({ ...f, escritorio: v }))} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Área (m²)" required error={errors.areaSqFt}>
                <input type="number" value={form.areaSqFt} onChange={set('areaSqFt')} min="0" className={errors.areaSqFt ? inputErrCls : inputCls} />
              </Field>
              <Field label="Ano de construção">
                <input type="number" value={form.yearBuilt} onChange={set('yearBuilt')} min="1800" max={new Date().getFullYear()} className={inputCls} />
              </Field>
            </div>
          </div>
        </div>

        {/* Features */}
        <div>
          <SectionTitle>Características</SectionTitle>
          <div className="flex flex-wrap gap-2">
            {FEATURES.map(f => {
              const active = form.features.includes(f.value)
              return (
                <button key={f.value} type="button" onClick={() => toggleFeature(f.value)}
                  className={['px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors',
                    active ? 'bg-[#6B6B99] border-[#6B6B99] text-white' : 'bg-[#F7F7FA] border-[#E6E6EF] text-[#4F4F6B] hover:border-[#6B6B99]',
                  ].join(' ')}>
                  {f.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Media */}
        <div>
          <SectionTitle>Mídia</SectionTitle>
          <div className="space-y-4">
            <Field label="URL da Miniatura (foto principal)" required error={errors.thumbnail}>
              <div className="flex gap-2">
                <input type="url" value={form.thumbnail} onChange={set('thumbnail')} className={errors.thumbnail ? inputErrCls : inputCls} />
                <label className={`flex-shrink-0 px-3 py-2.5 rounded-xl text-sm font-semibold cursor-pointer transition-colors ${thumbUploading ? 'bg-[#E6E6EF] text-[#A3A3C2]' : 'bg-[#6B6B99] text-white hover:bg-[#4F4F6B]'}`}>
                  {thumbUploading ? 'Enviando...' : 'Upload'}
                  <input type="file" accept="image/*" className="sr-only" disabled={thumbUploading}
                    onChange={e => {
                      const file = e.target.files?.[0]
                      if (file) uploadThumbnail(file)
                      e.target.value = ''
                    }} />
                </label>
              </div>
            </Field>
            {form.thumbnail && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={form.thumbnail} alt="Miniatura" className="w-24 h-20 object-cover rounded-xl bg-[#F7F7FA] border border-[#E6E6EF]"
                onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
            )}
            <div>
              <label className="block text-xs font-semibold text-[#4F4F6B] mb-1.5">Fotos adicionais (URLs)</label>
              <p className="text-xs text-[#A3A3C2] mb-2">Arraste as fotos para alterar a sequência exibida no anúncio.</p>
              <div className="space-y-2">
                {form.images.map((img, i) => (
                  <div
                    key={i}
                    onDragOver={e => {
                      e.preventDefault()
                      e.dataTransfer.dropEffect = 'move'
                      setDragOverImageIndex(i)
                    }}
                    onDragLeave={() => setDragOverImageIndex(current => current === i ? null : current)}
                    onDrop={e => {
                      e.preventDefault()
                      const rawIndex = e.dataTransfer.getData('text/plain')
                      const from = dragImageIndex ?? (rawIndex ? Number(rawIndex) : NaN)
                      if (Number.isInteger(from)) moveImage(from, i)
                      setDragImageIndex(null)
                      setDragOverImageIndex(null)
                    }}
                    className={`flex items-center gap-2 rounded-xl transition ${dragOverImageIndex === i ? 'bg-[#F0F0F7] ring-2 ring-[#6B6B99]/25' : ''} ${dragImageIndex === i ? 'opacity-60' : ''}`}
                  >
                    <button
                      type="button"
                      draggable
                      onDragStart={e => {
                        setDragImageIndex(i)
                        e.dataTransfer.effectAllowed = 'move'
                        e.dataTransfer.setData('text/plain', String(i))
                      }}
                      onDragEnd={() => {
                        setDragImageIndex(null)
                        setDragOverImageIndex(null)
                      }}
                      className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-xl bg-[#F7F7FA] border border-[#E6E6EF] text-xs font-semibold text-[#6B6B99] cursor-grab active:cursor-grabbing"
                      aria-label={`Arrastar foto ${i + 1}`}
                      title="Arrastar para reordenar"
                    >
                      {i + 1}
                    </button>
                    <input type="url" value={img} onChange={e => setImage(i, e.target.value)} className={inputCls} />
                    {form.images.length > 1 && (
                      <div className="flex flex-col gap-1">
                        <button type="button" onClick={() => moveImage(i, i - 1)} disabled={i === 0}
                          className="w-7 h-4 flex items-center justify-center rounded-md text-[#A3A3C2] hover:text-[#6B6B99] hover:bg-[#E6E6EF] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          aria-label={`Mover foto ${i + 1} para cima`}>
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                          </svg>
                        </button>
                        <button type="button" onClick={() => moveImage(i, i + 1)} disabled={i === form.images.length - 1}
                          className="w-7 h-4 flex items-center justify-center rounded-md text-[#A3A3C2] hover:text-[#6B6B99] hover:bg-[#E6E6EF] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          aria-label={`Mover foto ${i + 1} para baixo`}>
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      </div>
                    )}
                    <label className={`w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-xl cursor-pointer transition-colors ${uploading[i] ? 'bg-[#E6E6EF] text-[#A3A3C2]' : 'bg-[#F7F7FA] text-[#6B6B99] hover:bg-[#E6E6EF]'}`}>
                      {uploading[i] ? (
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                        </svg>
                      )}
                      <input type="file" accept="image/*" className="sr-only" disabled={!!uploading[i]}
                        onChange={e => {
                          const file = e.target.files?.[0]
                          if (file) uploadImage(file, i)
                          e.target.value = ''
                        }} />
                    </label>
                    {form.images.length > 1 && (
                      <button type="button" onClick={() => setForm(f => ({ ...f, images: f.images.filter((_, j) => j !== i) }))}
                        className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-xl text-[#A3A3C2] hover:text-red-500 hover:bg-red-50 transition-colors">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={() => setForm(f => ({ ...f, images: [...f.images, ''] }))}
                  className="text-xs text-[#6B6B99] hover:text-[#4F4F6B] font-medium flex items-center gap-1 transition-colors">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  Adicionar foto
                </button>
                <label className={`text-xs font-medium flex items-center gap-1 transition-colors ${bulkUploading ? 'text-[#A3A3C2]' : 'text-[#6B6B99] hover:text-[#4F4F6B] cursor-pointer'}`}>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                  {bulkUploading ? 'Enviando fotos...' : 'Enviar fotos do computador'}
                  <input type="file" accept="image/*" multiple className="sr-only" disabled={bulkUploading}
                    onChange={e => {
                      uploadImages(Array.from(e.target.files ?? []))
                      e.target.value = ''
                    }} />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Agent */}
        <div>
          <SectionTitle>Informações de Contato</SectionTitle>
          <div className="space-y-4">
            <Field label="Seu nome" required error={errors.agentName}>
              <input type="text" value={form.agentName} onChange={set('agentName')} className={errors.agentName ? inputErrCls : inputCls} />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Telefone / WhatsApp" required error={errors.agentPhone}>
                <input type="tel" value={form.agentPhone} onChange={set('agentPhone')} className={errors.agentPhone ? inputErrCls : inputCls} />
              </Field>
              <Field label="E-mail de contato" required error={errors.agentEmail}>
                <input type="email" value={form.agentEmail} onChange={set('agentEmail')} className={errors.agentEmail ? inputErrCls : inputCls} />
              </Field>
            </div>
          </div>
        </div>

        {apiError && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
            {apiError}
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <Link href="/user/dashboard" className="text-sm text-[#A3A3C2] hover:text-[#6B6B99] transition-colors">
            Cancelar
          </Link>
          <button type="submit" disabled={saving}
            className="px-6 py-2.5 bg-[#6B6B99] hover:bg-[#4F4F6B] text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2">
            {saving && (
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            )}
            {saving ? 'Salvando...' : 'Salvar e enviar para aprovação'}
          </button>
        </div>
      </form>
    </div>
  )
}
