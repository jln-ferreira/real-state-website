'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { Property } from '@/data/properties'

const TABS = ['Info Básica', 'Preço', 'Localização', 'Detalhes', 'Características', 'Mídia', 'Status & Agente'] as const
type Tab = typeof TABS[number]

const TAB_ERROR_KEYS: Record<Tab, string[]> = {
  'Info Básica':     ['title', 'description'],
  'Preço':           ['price.amount'],
  'Localização':     ['location.address', 'location.city', 'location.province', 'location.residential'],
  'Detalhes':        [],
  'Características': [],
  'Mídia':           ['media.thumbnail'],
  'Status & Agente': ['agent.name', 'agent.phone', 'agent.email'],
}

const ALL_FEATURES: { value: string; label: string }[] = [
  { value: 'baccarat',    label: 'Exclusivo Baccarat' },
  { value: 'balcony',     label: 'Varanda'            },
  { value: 'parking',     label: 'Estacionamento'     },
  { value: 'gym',         label: 'Academia'           },
  { value: 'pool',        label: 'Piscina'            },
  { value: 'garden',      label: 'Jardim'             },
  { value: 'furnished',   label: 'Mobiliado'          },
  { value: 'pet-friendly',label: 'Aceita Pets'        },
  { value: 'concierge',   label: 'Portaria'           },
  { value: 'fireplace',   label: 'Lareira'            },
  { value: 'rooftop',     label: 'Cobertura'          },
  { value: 'ev charging', label: 'Carregador Elétrico'},
  { value: 'storage',     label: 'Depósito'           },
  { value: 'elevator',    label: 'Elevador'           },
  { value: 'security',    label: 'Segurança'          },
  { value: '24h security',label: 'Segurança 24h'      },
]

// ── BRL helpers ───────────────────────────────────────────────────────────────

function formatBRLDisplay(amount: number): string {
  const str = amount.toFixed(2)
  const [intStr, decStr] = str.split('.')
  const withDots = intStr.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  return withDots + ',' + decStr
}

function handleBRLChange(
  raw: string,
  setDisplay: (s: string) => void,
  setAmount: (n: number) => void,
) {
  // Remove existing thousand-separator dots so user can backspace freely
  const stripped = raw.replace(/\./g, '')
  // Allow only digits and one comma
  const onlyValid = stripped.replace(/[^\d,]/g, '')
  const firstComma = onlyValid.indexOf(',')
  const sanitized = firstComma === -1
    ? onlyValid
    : onlyValid.slice(0, firstComma + 1) + onlyValid.slice(firstComma + 1).replace(/,/g, '')

  const parts = sanitized.split(',')
  const intStr = parts[0].replace(/^0+(?=\d)/, '') // strip leading zeros
  const intNum = parseInt(intStr) || 0
  const intFormatted = intStr === '' ? '' : intNum.toLocaleString('pt-BR')
  const display = parts.length > 1
    ? intFormatted + ',' + parts[1].slice(0, 2)
    : intFormatted

  setDisplay(display)

  const dec = parts[1] !== undefined ? parseFloat('0.' + parts[1].padEnd(2, '0').slice(0, 2)) : 0
  setAmount(intNum + dec)
}

// ── Form sub-components (MUST be outside the main component to avoid remount on render) ──

function Input({ label, value, onChange, error, placeholder, type = 'text', required = false }: {
  label: string; value: string | number; onChange: (v: string) => void
  error?: string; placeholder?: string; type?: string; required?: boolean
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-neutral-600 mb-1">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-3 py-2.5 bg-neutral-100 rounded-lg text-sm border-0 outline-none focus:ring-2 ${error ? 'ring-2 ring-red-300' : 'focus:ring-[#1E3A5F]/20'}`}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}

function Toggle({ label, description, checked, onChange }: {
  label: string; description: string; checked: boolean; onChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-neutral-100 last:border-0">
      <div>
        <p className="text-sm font-medium text-neutral-800">{label}</p>
        <p className="text-xs text-neutral-400">{description}</p>
      </div>
      <button type="button" onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${checked ? 'bg-[#1E3A5F]' : 'bg-neutral-300'}`}>
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
      </button>
    </div>
  )
}

// ── Counter input used for bedrooms / suites / lavabo / escritório ─────────────

function Counter({ label, value, onChange, required = false }: {
  label: string; value: number; onChange: (n: number) => void; required?: boolean
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-neutral-600 mb-1">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => onChange(Math.max(0, value - 1))}
          className="w-9 h-9 rounded-lg bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-600 font-bold transition-colors">−</button>
        <span className="w-8 text-center text-sm font-semibold">{value}</span>
        <button type="button" onClick={() => onChange(value + 1)}
          className="w-9 h-9 rounded-lg bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-600 font-bold transition-colors">+</button>
      </div>
    </div>
  )
}

// ── BRL styled input (R$ prefix + live dot/comma formatting) ─────────────────

function BRLInput({ label, display, onChangeDisplay, error, placeholder = '0,00', required = false }: {
  label: string
  display: string
  onChangeDisplay: (raw: string) => void
  error?: string
  placeholder?: string
  required?: boolean
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-neutral-600 mb-1">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <div className={`flex items-center bg-neutral-100 rounded-lg overflow-hidden focus-within:ring-2 ${error ? 'ring-2 ring-red-300' : 'focus-within:ring-[#1E3A5F]/20'}`}>
        <span className="pl-3 pr-1 text-sm font-medium text-neutral-500 flex-shrink-0 select-none">R$</span>
        <input
          type="text"
          inputMode="numeric"
          value={display}
          onChange={e => onChangeDisplay(e.target.value)}
          placeholder={placeholder}
          className="flex-1 px-2 py-2.5 bg-transparent text-sm border-0 outline-none"
        />
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}

// ── Empty property factory ────────────────────────────────────────────────────

function emptyProperty(): Property {
  return {
    id: '',
    title: '',
    img: '',
    description: '',
    price: { amount: 0, currency: 'BRL', type: 'sale' },
    location: { address: '', city: '', province: '', country: 'Brasil', postalCode: '', residential: '' },
    propertyDetails: { type: 'apartment', bedrooms: 0, bathrooms: 0, areaSqFt: 0, lavabo: 0, escritorio: 0 },
    features: [],
    media: { images: [''], thumbnail: '' },
    status: { isActive: false, isFeatured: false, isSpecial: false },
    metrics: { views: 0, favorites: 0, searchAppearances: 0 },
    timestamps: { createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    agent: { name: '', phone: '', email: '' },
  }
}

// ── Main form component ───────────────────────────────────────────────────────

export default function PropertyForm({ property: initial }: { property?: Property }) {
  const router = useRouter()
  const isEdit = !!initial
  const [form, setForm] = useState<Property>(initial ?? emptyProperty())
  const [activeTab, setActiveTab] = useState<Tab>('Info Básica')
  const [isSaving, setIsSaving] = useState(false)
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [customFeature, setCustomFeature] = useState('')
  const [savedCustomFeatures, setSavedCustomFeatures] = useState<{ value: string; label: string }[]>([])
  const [deleteConfirm, setDeleteConfirm] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

  // BRL display states for price inputs
  const [brlDisplay, setBrlDisplay] = useState<string>(() =>
    initial?.price.currency === 'BRL' && initial.price.amount
      ? formatBRLDisplay(initial.price.amount)
      : '')
  const [condominioDisplay, setCondominioDisplay] = useState<string>(() =>
    initial?.price.condominio ? formatBRLDisplay(initial.price.condominio) : '')
  const [iptuDisplay, setIptuDisplay] = useState<string>(() =>
    initial?.price.iptu ? formatBRLDisplay(initial.price.iptu) : '')

  useEffect(() => {
    fetch('/api/admin/features')
      .then(r => r.json())
      .then(setSavedCustomFeatures)
      .catch(() => {})
  }, [])

  function set<K extends keyof Property>(key: K, value: Property[K]) {
    setForm(f => ({ ...f, [key]: value }))
  }

  function showToast(msg: string, type: 'success' | 'error') {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  function validate(): Record<string, string> {
    const e: Record<string, string> = {}
    if (!form.title.trim()) e.title = 'Título é obrigatório'
    if (!form.description.trim()) e.description = 'Descrição é obrigatória'
    if (!form.location.address.trim()) e['location.address'] = 'Endereço é obrigatório'
    if (!form.location.city.trim()) e['location.city'] = 'Cidade é obrigatória'
    if (!form.location.province.trim()) e['location.province'] = 'Província é obrigatória'
    if (!form.location.residential.trim()) e['location.residential'] = 'Residencial é obrigatório'
    if (!form.media.thumbnail.trim()) e['media.thumbnail'] = 'URL da miniatura é obrigatória'
    if (!(Number(form.price.amount) > 0)) e['price.amount'] = 'O preço deve ser maior que 0'
    if (!form.agent.name.trim()) e['agent.name'] = 'Nome do agente é obrigatório'
    if (!form.agent.phone.trim()) e['agent.phone'] = 'Telefone do agente é obrigatório'
    if (!form.agent.email.trim()) e['agent.email'] = 'E-mail do agente é obrigatório'
    setErrors(e)
    return e
  }

  async function handleSave() {
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      const firstErrorTab = TABS.find(tab => TAB_ERROR_KEYS[tab].some(key => key in errs))
      if (firstErrorTab) setActiveTab(firstErrorTab)
      showToast(`Corrija os erros${firstErrorTab ? ` na aba "${firstErrorTab}"` : ''} antes de salvar.`, 'error')
      return
    }
    setIsSaving(true)
    setSaveState('saving')
    const payload = { ...form, img: form.media.thumbnail }
    try {
      let res: Response
      if (isEdit) {
        res = await fetch(`/api/admin/properties/${form.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      } else {
        const allRes = await fetch('/api/admin/properties')
        const all: Property[] = allRes.ok ? await allRes.json() : []
        const nums = all.map(p => parseInt(p.id.replace('PROP-', ''))).filter(n => !isNaN(n)).sort((a, b) => b - a)
        const newId = `PROP-${String((nums[0] ?? 0) + 1).padStart(3, '0')}`
        res = await fetch('/api/admin/properties', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...payload,
            id: newId,
            timestamps: { createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
          }),
        })
        if (res.ok) {
          const created = await res.json()
          router.push(`/admin/properties/${created.id}`)
          return
        }
      }
      if (res.ok) {
        setSaveState('saved')
        showToast('Imóvel salvo ✓', 'success')
        if (isEdit) {
          const updated = await res.json()
          const updatedAt = updated?.timestamps?.updatedAt ?? new Date().toISOString()
          setForm(f => ({ ...f, timestamps: { createdAt: f.timestamps?.createdAt ?? '', updatedAt } }))
        }
        setTimeout(() => setSaveState('idle'), 2000)
      } else {
        setSaveState('error')
        showToast('Falha ao salvar. Tente novamente.', 'error')
        setTimeout(() => setSaveState('idle'), 2000)
      }
    } catch {
      setSaveState('error')
      showToast('Falha ao salvar. Tente novamente.', 'error')
      setTimeout(() => setSaveState('idle'), 2000)
    } finally {
      setIsSaving(false)
    }
  }

  async function handleDelete() {
    if (deleteConfirm !== form.id) return
    setIsDeleting(true)
    try {
      const res = await fetch(`/api/admin/properties/${form.id}`, { method: 'DELETE' })
      if (res.ok) router.push('/admin/properties')
    } finally {
      setIsDeleting(false)
    }
  }

  function toggleFeature(f: string) {
    setForm(prev => ({
      ...prev,
      features: prev.features.includes(f) ? prev.features.filter(x => x !== f) : [...prev.features, f],
    }))
  }

  async function addCustomFeature() {
    const label = customFeature.trim()
    const value = label.toLowerCase()
    if (!value) return
    setCustomFeature('')
    if (!form.features.includes(value))
      setForm(prev => ({ ...prev, features: [...prev.features, value] }))
    if (!ALL_FEATURES.find(f => f.value === value) && !savedCustomFeatures.find(f => f.value === value)) {
      await fetch('/api/admin/features', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value, label }),
      })
      setSavedCustomFeatures(prev => [...prev, { value, label }])
    }
  }

  async function deleteCustomFeature(value: string) {
    await fetch(`/api/admin/features/${encodeURIComponent(value)}`, { method: 'DELETE' })
    setSavedCustomFeatures(prev => prev.filter(f => f.value !== value))
    setForm(prev => ({ ...prev, features: prev.features.filter(f => f !== value) }))
  }

  return (
    <div className="w-full max-w-3xl">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-medium text-white ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          {toast.msg}
        </div>
      )}

      {/* Breadcrumb */}
      <p className="text-xs text-neutral-400 mb-4">
        Admin / <a href="/admin/properties" className="hover:underline">Imóveis</a>
        {isEdit ? ` / ${form.title || form.id}` : ' / Novo Imóvel'}
      </p>

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-neutral-900">{isEdit ? form.title : 'Novo Imóvel'}</h1>
            {isEdit && <span className="px-2.5 py-0.5 text-xs font-bold text-[#1E3A5F] bg-[#1E3A5F]/10 rounded-lg">{form.id}</span>}
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-0.5">
            {form.timestamps?.createdAt && (
              <p className="text-xs text-neutral-400">Cadastrado em: {new Date(form.timestamps.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
            )}
            {form.timestamps?.updatedAt && (
              <p className="text-xs text-neutral-400">Última atualização: {new Date(form.timestamps.updatedAt).toLocaleString('pt-BR')}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button onClick={() => router.push('/admin/properties')}
            className="px-4 py-2 border border-neutral-200 rounded-xl text-sm font-medium hover:bg-neutral-50 transition-colors">
            Descartar
          </button>
          <button onClick={handleSave} disabled={isSaving}
            className={`px-4 py-2 rounded-xl text-sm font-semibold text-white transition-colors flex items-center gap-2 disabled:opacity-60
              ${saveState === 'saved' ? 'bg-green-600' : saveState === 'error' ? 'bg-red-600' : 'bg-[#1E3A5F] hover:bg-[#141d3a]'}`}>
            {isSaving && (
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            )}
            {saveState === 'saving' ? 'Salvando...' : saveState === 'saved' ? 'Salvo ✓' : 'Salvar alterações'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-neutral-200 mb-6 overflow-x-auto">
        {TABS.map(tab => {
          const hasError = TAB_ERROR_KEYS[tab].some(key => errors[key])
          return (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`relative px-4 py-2.5 text-sm whitespace-nowrap transition-colors ${activeTab === tab ? 'border-b-2 border-[#1E3A5F] text-[#1E3A5F] font-semibold' : 'text-neutral-500 hover:text-neutral-700'}`}>
              {tab}
              {hasError && <span className="absolute top-2 right-1 w-1.5 h-1.5 rounded-full bg-red-500" />}
            </button>
          )
        })}
      </div>

      <div className="space-y-4">

        {/* ── Info Básica ── */}
        {activeTab === 'Info Básica' && (
          <>
            <Input label="Título" required value={form.title} onChange={v => set('title', v)} error={errors.title} placeholder="ex. Loft Moderno no Centro" />
            <div>
              <label className="block text-xs font-semibold text-neutral-600 mb-1">Descrição <span className="text-red-500">*</span></label>
              <div className="relative">
                <textarea rows={6} value={form.description} onChange={e => set('description', e.target.value)}
                  placeholder="Descreva o imóvel..."
                  className={`w-full px-3 py-2.5 bg-neutral-100 rounded-lg text-sm border-0 outline-none focus:ring-2 resize-none ${errors.description ? 'ring-2 ring-red-300' : 'focus:ring-[#1E3A5F]/20'}`} />
                <span className="absolute bottom-2 right-3 text-xs text-neutral-400">{form.description.length}</span>
              </div>
              {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-600 mb-1">Tipo de Imóvel <span className="text-red-500">*</span></label>
              <select value={form.propertyDetails.type} onChange={e => set('propertyDetails', { ...form.propertyDetails, type: e.target.value as any })}
                className="w-full px-3 py-2.5 bg-neutral-100 rounded-lg text-sm border-0 outline-none focus:ring-2 focus:ring-[#1E3A5F]/20">
                <option value="apartment">Apartamento</option>
                <option value="house">Casa</option>
                <option value="commercial">Comercial</option>
                <option value="land">Terreno</option>
              </select>
            </div>
          </>
        )}

        {/* ── Preço ── */}
        {activeTab === 'Preço' && (
          <>
            <div>
              <label className="block text-xs font-semibold text-neutral-600 mb-1">Tipo de Transação <span className="text-red-500">*</span></label>
              <div className="flex gap-2">
                {([['sale', 'Venda'], ['rent', 'Aluguel']] as const).map(([t, label]) => (
                  <button key={t} type="button" onClick={() => set('price', { ...form.price, type: t })}
                    className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${form.price.type === t ? 'bg-[#1E3A5F] text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}`}>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-600 mb-1">Moeda</label>
              <select
                value={form.price.currency}
                onChange={e => {
                  const curr = e.target.value as 'BRL' | 'CAD' | 'USD'
                  if (curr === 'BRL' && form.price.amount) setBrlDisplay(formatBRLDisplay(form.price.amount))
                  set('price', { ...form.price, currency: curr })
                }}
                className="w-full px-3 py-2.5 bg-neutral-100 rounded-lg text-sm border-0 outline-none focus:ring-2 focus:ring-[#1E3A5F]/20">
                <option value="BRL">BRL – Real Brasileiro</option>
                <option value="CAD">CAD – Dólar Canadense</option>
                <option value="USD">USD – Dólar Americano</option>
              </select>
            </div>

            {form.price.currency === 'BRL' ? (
              <BRLInput
                label="Preço"
                required
                display={brlDisplay}
                onChangeDisplay={raw => handleBRLChange(raw, setBrlDisplay, amount => set('price', { ...form.price, amount }))}
                error={errors['price.amount']}
              />
            ) : (
              <div>
                <label className="block text-xs font-semibold text-neutral-600 mb-1">Preço <span className="text-red-500">*</span></label>
                <div className="flex gap-2">
                  <span className="px-3 py-2.5 bg-neutral-100 rounded-lg text-sm text-neutral-500 flex-shrink-0">{form.price.currency}</span>
                  <input type="number" value={form.price.amount || ''} placeholder="0"
                    onChange={e => set('price', { ...form.price, amount: parseFloat(e.target.value) || 0 })}
                    className={`flex-1 px-3 py-2.5 bg-neutral-100 rounded-lg text-sm border-0 outline-none focus:ring-2 ${errors['price.amount'] ? 'ring-2 ring-red-300' : 'focus:ring-[#1E3A5F]/20'}`} />
                </div>
                {errors['price.amount'] && <p className="text-xs text-red-500 mt-1">{errors['price.amount']}</p>}
              </div>
            )}

            <BRLInput
              label="Condomínio (mensal)"
              display={condominioDisplay}
              onChangeDisplay={raw => handleBRLChange(raw, setCondominioDisplay, amount => set('price', { ...form.price, condominio: amount || undefined }))}
            />

            <BRLInput
              label="IPTU (anual)"
              display={iptuDisplay}
              onChangeDisplay={raw => handleBRLChange(raw, setIptuDisplay, amount => set('price', { ...form.price, iptu: amount || undefined }))}
            />
          </>
        )}

        {/* ── Localização ── */}
        {activeTab === 'Localização' && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Endereço" required value={form.location.address} onChange={v => set('location', { ...form.location, address: v })} error={errors['location.address']} />
              <Input label="Cidade" required value={form.location.city} onChange={v => set('location', { ...form.location, city: v })} error={errors['location.city']} />
              <Input label="Província / Estado" required value={form.location.province} onChange={v => set('location', { ...form.location, province: v })} error={errors['location.province']} />
              <Input label="Código Postal / CEP" value={form.location.postalCode ?? ''} onChange={v => set('location', { ...form.location, postalCode: v })} />
            </div>
            <Input label="Residencial / Comunidade" required value={form.location.residential} onChange={v => set('location', { ...form.location, residential: v })} error={errors['location.residential']} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Latitude" type="number" value={form.location.coordinates?.lat ?? ''} onChange={v => set('location', { ...form.location, coordinates: { lat: parseFloat(v) || 0, lng: form.location.coordinates?.lng ?? 0 } })} />
              <Input label="Longitude" type="number" value={form.location.coordinates?.lng ?? ''} onChange={v => set('location', { ...form.location, coordinates: { lat: form.location.coordinates?.lat ?? 0, lng: parseFloat(v) || 0 } })} />
            </div>
          </>
        )}

        {/* ── Detalhes ── */}
        {activeTab === 'Detalhes' && (
          <>
            <Counter
              label="Número de Suítes"
              value={form.propertyDetails.bedrooms}
              onChange={n => setForm(f => ({ ...f, propertyDetails: { ...f.propertyDetails, bedrooms: n } }))}
              required
            />
            <Counter
              label="Lavabo"
              value={form.propertyDetails.lavabo ?? 0}
              onChange={n => setForm(f => ({ ...f, propertyDetails: { ...f.propertyDetails, lavabo: n } }))}
              required
            />
            <Counter
              label="Escritório"
              value={form.propertyDetails.escritorio ?? 0}
              onChange={n => setForm(f => ({ ...f, propertyDetails: { ...f.propertyDetails, escritorio: n } }))}
            />
            <Input label="Área (m²)" required type="number" value={form.propertyDetails.areaSqFt || ''} onChange={v => setForm(f => ({ ...f, propertyDetails: { ...f.propertyDetails, areaSqFt: parseFloat(v) || 0 } }))} />
            <Input label="Ano de Construção" type="number" value={form.propertyDetails.yearBuilt ?? ''} onChange={v => setForm(f => ({ ...f, propertyDetails: { ...f.propertyDetails, yearBuilt: parseInt(v) || undefined } }))} placeholder="ex. 2018" />
          </>
        )}

        {/* ── Características ── */}
        {activeTab === 'Características' && (
          <>
            <p className="text-xs text-neutral-500">Clique para selecionar características</p>
            <div className="flex flex-wrap gap-2">
              {ALL_FEATURES.map(({ value, label }) => (
                <button key={value} type="button" onClick={() => toggleFeature(value)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${form.features.includes(value) ? 'bg-[#1E3A5F] text-white border-[#1E3A5F]' : 'bg-white text-neutral-600 border-neutral-200 hover:border-[#1E3A5F]'}`}>
                  {label}
                </button>
              ))}
              {savedCustomFeatures.map(({ value, label }) => {
                const active = form.features.includes(value)
                return (
                  <span key={value} className={`inline-flex items-center gap-1 rounded-full text-xs font-medium border transition-colors ${active ? 'bg-[#1E3A5F] text-white border-[#1E3A5F]' : 'bg-white text-neutral-600 border-neutral-200'}`}>
                    <button type="button" onClick={() => toggleFeature(value)} className="pl-3 py-1.5">
                      {label}
                    </button>
                    <button type="button" onClick={() => deleteCustomFeature(value)}
                      className={`pr-2.5 py-1.5 transition-colors ${active ? 'hover:text-red-300' : 'hover:text-red-500'}`}
                      title="Remover característica">
                      ×
                    </button>
                  </span>
                )
              })}
            </div>
            <div className="flex gap-2">
              <input type="text" value={customFeature} onChange={e => setCustomFeature(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addCustomFeature() } }}
                placeholder="Adicionar característica personalizada..."
                className="flex-1 px-3 py-2.5 bg-neutral-100 rounded-lg text-sm border-0 outline-none focus:ring-2 focus:ring-[#1E3A5F]/20" />
              <button type="button" onClick={addCustomFeature}
                className="px-4 py-2.5 bg-[#1E3A5F] text-white rounded-lg text-sm font-medium hover:bg-[#141d3a] transition-colors">Adicionar</button>
            </div>
          </>
        )}

        {/* ── Mídia ── */}
        {activeTab === 'Mídia' && (
          <>
            <div>
              <label className="block text-xs font-semibold text-neutral-600 mb-1">URL da Miniatura <span className="text-red-500">*</span></label>
              <div className="flex gap-3 items-start">
                <input type="text" value={form.media.thumbnail} placeholder="https://..."
                  onChange={e => set('media', { ...form.media, thumbnail: e.target.value })}
                  className={`flex-1 px-3 py-2.5 bg-neutral-100 rounded-lg text-sm border-0 outline-none focus:ring-2 ${errors['media.thumbnail'] ? 'ring-2 ring-red-300' : 'focus:ring-[#1E3A5F]/20'}`} />
                {form.media.thumbnail && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={form.media.thumbnail} alt="" className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                )}
              </div>
              {errors['media.thumbnail'] && <p className="text-xs text-red-500 mt-1">{errors['media.thumbnail']}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-600 mb-2">Imagens</label>
              <div className="space-y-2">
                {form.media.images.map((img, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <input type="text" value={img} placeholder="https://..."
                      onChange={e => { const imgs = [...form.media.images]; imgs[i] = e.target.value; set('media', { ...form.media, images: imgs }) }}
                      className="flex-1 px-3 py-2 bg-neutral-100 rounded-lg text-sm border-0 outline-none focus:ring-2 focus:ring-[#1E3A5F]/20" />
                    {img && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={img} alt="" className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                    )}
                    <button type="button" onClick={() => set('media', { ...form.media, images: form.media.images.filter((_, j) => j !== i) })}
                      className="text-neutral-400 hover:text-red-500 transition-colors flex-shrink-0">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
              <button type="button" onClick={() => set('media', { ...form.media, images: [...form.media.images, ''] })}
                className="mt-2 flex items-center gap-1.5 text-sm text-[#1E3A5F] hover:underline font-medium">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Adicionar URL de imagem
              </button>
            </div>
          </>
        )}

        {/* ── Status & Agente ── */}
        {activeTab === 'Status & Agente' && (
          <>
            <div className="bg-white rounded-xl border border-neutral-100 px-4 divide-y divide-neutral-100">
              <Toggle label="Anúncio ativo" description="Visível nos resultados de busca públicos" checked={form.status.isActive} onChange={v => set('status', { ...form.status, isActive: v })} />
              <Toggle label="Imóvel em destaque" description="Destacado na página inicial" checked={form.status.isFeatured} onChange={v => set('status', { ...form.status, isFeatured: v })} />
              <Toggle label="Promoção especial" description="Marcado com um selo especial" checked={form.status.isSpecial ?? false} onChange={v => set('status', { ...form.status, isSpecial: v })} />
            </div>
            <div>
              <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-3">Informações do Agente</p>
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input label="Nome do Agente" required value={form.agent.name} onChange={v => set('agent', { ...form.agent, name: v })} error={errors['agent.name']} />
                  <Input label="Telefone do Agente" required value={form.agent.phone} onChange={v => set('agent', { ...form.agent, phone: v })} error={errors['agent.phone']} />
                </div>
                <Input label="E-mail do Agente" required value={form.agent.email} onChange={v => set('agent', { ...form.agent, email: v })} error={errors['agent.email']} />
              </div>
            </div>
            {isEdit && (
              <div className="mt-8 border-2 border-red-200 rounded-2xl p-6">
                <h3 className="text-sm font-semibold text-red-600 mb-1">Zona de Perigo</h3>
                <p className="text-sm font-medium text-neutral-700 mb-0.5">Excluir este imóvel</p>
                <p className="text-xs text-neutral-500 mb-4">Isso remove permanentemente o anúncio. Esta ação não pode ser desfeita.</p>
                <label className="block text-xs font-semibold text-neutral-600 mb-1">Digite <strong className="font-mono">{form.id}</strong> para confirmar</label>
                <input type="text" value={deleteConfirm} onChange={e => setDeleteConfirm(e.target.value)}
                  className="w-full px-3 py-2.5 bg-neutral-100 rounded-lg text-sm border-0 outline-none focus:ring-2 focus:ring-red-300 font-mono mb-3" />
                <button type="button" onClick={handleDelete} disabled={deleteConfirm !== form.id || isDeleting}
                  className="px-4 py-2.5 bg-red-600 text-white rounded-xl text-sm font-semibold disabled:opacity-40 hover:bg-red-700 transition-colors">
                  {isDeleting ? 'Excluindo...' : 'Excluir Imóvel'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
