'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

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

interface FormState {
  title: string
  description: string
  propertyType: string
  priceType: string
  priceAmount: string
  currency: string
  condominio: string
  iptu: string
  address: string
  city: string
  province: string
  residential: string
  bedrooms: number
  bathrooms: number
  areaSqFt: string
  yearBuilt: string
  features: string[]
  thumbnail: string
  images: string[]
  agentName: string
  agentPhone: string
  agentEmail: string
}

function emptyForm(): FormState {
  return {
    title: '', description: '', propertyType: 'apartment', priceType: 'sale',
    priceAmount: '', currency: 'BRL', condominio: '', iptu: '',
    address: '', city: '', province: '', residential: '',
    bedrooms: 0, bathrooms: 0, areaSqFt: '', yearBuilt: '',
    features: [], thumbnail: '', images: [''],
    agentName: '', agentPhone: '', agentEmail: '',
  }
}

function Field({ label, required, children, error }: {
  label: string; required?: boolean; children: React.ReactNode; error?: string
}) {
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
const selectCls = inputCls + " cursor-pointer"

function Counter({ label, value, onChange }: { label: string; value: number; onChange: (n: number) => void }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-[#4F4F6B] mb-1.5">{label}</label>
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => onChange(Math.max(0, value - 1))}
          className="w-9 h-9 rounded-xl bg-[#F7F7FA] border border-[#E6E6EF] hover:bg-[#E6E6EF] flex items-center justify-center text-[#4F4F6B] font-bold transition-colors">−</button>
        <span className="w-8 text-center text-sm font-semibold text-[#1E3A5F]">{value}</span>
        <button type="button" onClick={() => onChange(value + 1)}
          className="w-9 h-9 rounded-xl bg-[#F7F7FA] border border-[#E6E6EF] hover:bg-[#E6E6EF] flex items-center justify-center text-[#4F4F6B] font-bold transition-colors">+</button>
      </div>
    </div>
  )
}

export default function UserPropertyFormClient() {
  const router = useRouter()
  const [form, setForm] = useState<FormState>(emptyForm())
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [apiError, setApiError] = useState('')

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
    setForm(f => {
      const imgs = [...f.images]
      imgs[idx] = val
      return { ...f, images: imgs }
    })
  }

  function addImageRow() {
    setForm(f => ({ ...f, images: [...f.images, ''] }))
  }

  function removeImage(idx: number) {
    setForm(f => ({ ...f, images: f.images.filter((_, i) => i !== idx) }))
  }

  function validate(): boolean {
    const e: Record<string, string> = {}
    if (!form.title.trim()) e.title = 'Título é obrigatório'
    if (!form.description.trim()) e.description = 'Descrição é obrigatória'
    if (!form.priceAmount.trim() || Number(form.priceAmount.replace(/\D/g, '')) <= 0) e.priceAmount = 'Preço é obrigatório'
    if (!form.address.trim()) e.address = 'Endereço é obrigatório'
    if (!form.city.trim()) e.city = 'Cidade é obrigatória'
    if (!form.province.trim()) e.province = 'Estado é obrigatório'
    if (!form.residential.trim()) e.residential = 'Residencial é obrigatório'
    if (!form.thumbnail.trim()) e.thumbnail = 'URL da miniatura é obrigatória'
    if (!form.agentName.trim()) e.agentName = 'Nome é obrigatório'
    if (!form.agentPhone.trim()) e.agentPhone = 'Telefone é obrigatório'
    if (!form.agentEmail.trim()) e.agentEmail = 'E-mail é obrigatório'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setApiError('')
    if (!validate()) return

    // Parse price: strip non-numeric except dot/comma
    const rawPrice = form.priceAmount.replace(/\./g, '').replace(',', '.')
    const price = parseFloat(rawPrice) || 0

    const payload = {
      title: form.title,
      description: form.description,
      img: form.thumbnail,
      price: {
        amount: price,
        currency: form.currency,
        type: form.priceType,
        ...(form.condominio ? { condominio: parseFloat(form.condominio.replace(',', '.')) } : {}),
        ...(form.iptu ? { iptu: parseFloat(form.iptu.replace(',', '.')) } : {}),
      },
      location: {
        address: form.address,
        city: form.city,
        province: form.province,
        country: 'Brasil',
        residential: form.residential,
      },
      propertyDetails: {
        type: form.propertyType,
        bedrooms: form.bedrooms,
        bathrooms: form.bathrooms,
        areaSqFt: parseFloat(form.areaSqFt) || 0,
        ...(form.yearBuilt ? { yearBuilt: parseInt(form.yearBuilt) } : {}),
      },
      features: form.features,
      media: {
        thumbnail: form.thumbnail,
        images: form.images.filter(Boolean),
      },
      agent: {
        name: form.agentName,
        phone: form.agentPhone,
        email: form.agentEmail,
      },
    }

    setSaving(true)
    try {
      const res = await fetch('/api/user/properties', {
        method: 'POST',
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

  function SectionTitle({ children }: { children: React.ReactNode }) {
    return <h2 className="text-base font-semibold text-[#1E3A5F] mb-4 pt-2 border-t border-[#E6E6EF] first:border-0 first:pt-0">{children}</h2>
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Link href="/user/dashboard" className="text-[#A3A3C2] hover:text-[#6B6B99] transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </Link>
        <div>
          <h1 className="text-xl font-bold text-[#1E3A5F]">Novo Imóvel</h1>
          <p className="text-xs text-[#6B6B99] mt-0.5">O imóvel ficará pendente até aprovação do administrador.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#E6E6EF] p-6 space-y-6">

        {/* Basic info */}
        <div>
          <SectionTitle>Informações Básicas</SectionTitle>
          <div className="space-y-4">
            <Field label="Título" required error={errors.title}>
              <input type="text" value={form.title} onChange={set('title')} placeholder="Ex: Apartamento de 3 quartos no centro" className={inputCls} />
            </Field>
            <Field label="Descrição" required error={errors.description}>
              <textarea value={form.description} onChange={set('description')} rows={4} placeholder="Descreva o imóvel..." className={inputCls + ' resize-none'} />
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
              <input type="text" inputMode="numeric" value={form.priceAmount} onChange={set('priceAmount')} placeholder="0,00" className={inputCls} />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Condomínio (opcional)">
                <input type="text" inputMode="numeric" value={form.condominio} onChange={set('condominio')} placeholder="0,00" className={inputCls} />
              </Field>
              <Field label="IPTU mensal (opcional)">
                <input type="text" inputMode="numeric" value={form.iptu} onChange={set('iptu')} placeholder="0,00" className={inputCls} />
              </Field>
            </div>
          </div>
        </div>

        {/* Location */}
        <div>
          <SectionTitle>Localização</SectionTitle>
          <div className="space-y-4">
            <Field label="Endereço" required error={errors.address}>
              <input type="text" value={form.address} onChange={set('address')} placeholder="Rua, número, bairro" className={inputCls} />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Cidade" required error={errors.city}>
                <input type="text" value={form.city} onChange={set('city')} placeholder="São Paulo" className={inputCls} />
              </Field>
              <Field label="Estado" required error={errors.province}>
                <input type="text" value={form.province} onChange={set('province')} placeholder="SP" className={inputCls} />
              </Field>
            </div>
            <Field label="Residencial / Condomínio" required error={errors.residential}>
              <input type="text" value={form.residential} onChange={set('residential')} placeholder="Nome do condomínio" className={inputCls} />
            </Field>
          </div>
        </div>

        {/* Details */}
        <div>
          <SectionTitle>Detalhes</SectionTitle>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-6">
              <Counter label="Quartos" value={form.bedrooms} onChange={v => setForm(f => ({ ...f, bedrooms: v }))} />
              <Counter label="Banheiros" value={form.bathrooms} onChange={v => setForm(f => ({ ...f, bathrooms: v }))} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Área (m²)">
                <input type="number" value={form.areaSqFt} onChange={set('areaSqFt')} placeholder="0" min="0" className={inputCls} />
              </Field>
              <Field label="Ano de construção">
                <input type="number" value={form.yearBuilt} onChange={set('yearBuilt')} placeholder="2000" min="1800" max={new Date().getFullYear()} className={inputCls} />
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
                <button
                  key={f.value}
                  type="button"
                  onClick={() => toggleFeature(f.value)}
                  className={[
                    'px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors',
                    active
                      ? 'bg-[#6B6B99] border-[#6B6B99] text-white'
                      : 'bg-[#F7F7FA] border-[#E6E6EF] text-[#4F4F6B] hover:border-[#6B6B99]',
                  ].join(' ')}
                >
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
            <Field label="URL da Miniatura" required error={errors.thumbnail}>
              <input type="url" value={form.thumbnail} onChange={set('thumbnail')} placeholder="https://..." className={inputCls} />
            </Field>
            <div>
              <label className="block text-xs font-semibold text-[#4F4F6B] mb-1.5">Fotos adicionais (URLs)</label>
              <div className="space-y-2">
                {form.images.map((img, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      type="url"
                      value={img}
                      onChange={e => setImage(i, e.target.value)}
                      placeholder="https://..."
                      className={inputCls}
                    />
                    {form.images.length > 1 && (
                      <button type="button" onClick={() => removeImage(i)}
                        className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-xl text-[#A3A3C2] hover:text-red-500 hover:bg-red-50 transition-colors">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={addImageRow}
                  className="text-xs text-[#6B6B99] hover:text-[#4F4F6B] font-medium flex items-center gap-1 transition-colors">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  Adicionar foto
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Agent */}
        <div>
          <SectionTitle>Informações de Contato</SectionTitle>
          <div className="space-y-4">
            <Field label="Seu nome" required error={errors.agentName}>
              <input type="text" value={form.agentName} onChange={set('agentName')} placeholder="João Silva" className={inputCls} />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Telefone / WhatsApp" required error={errors.agentPhone}>
                <input type="tel" value={form.agentPhone} onChange={set('agentPhone')} placeholder="(11) 99999-9999" className={inputCls} />
              </Field>
              <Field label="E-mail de contato" required error={errors.agentEmail}>
                <input type="email" value={form.agentEmail} onChange={set('agentEmail')} placeholder="joao@email.com" className={inputCls} />
              </Field>
            </div>
          </div>
        </div>

        {apiError && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
            {apiError}
          </div>
        )}

        {/* Submit */}
        <div className="flex items-center justify-between pt-2">
          <Link href="/user/dashboard" className="text-sm text-[#A3A3C2] hover:text-[#6B6B99] transition-colors">
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-[#6B6B99] hover:bg-[#4F4F6B] text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saving ? 'Enviando...' : 'Enviar para análise'}
          </button>
        </div>
      </form>
    </div>
  )
}
