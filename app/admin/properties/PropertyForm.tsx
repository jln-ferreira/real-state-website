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
  'Detalhes':        ['propertyDetails.quartos', 'propertyDetails.bedrooms', 'propertyDetails.lavabo'],
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

function Counter({ label, value, onChange, required = false, error, min = 0 }: {
  label: string; value: number; onChange: (n: number) => void; required?: boolean; error?: string; min?: number
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-neutral-600 mb-1">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => onChange(Math.max(min, value - 1))}
          className="w-9 h-9 rounded-lg bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-600 font-bold transition-colors">−</button>
        <span className="w-8 text-center text-sm font-semibold">{value}</span>
        <button type="button" onClick={() => onChange(value + 1)}
          className="w-9 h-9 rounded-lg bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-600 font-bold transition-colors">+</button>
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
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

// ── Media tab ─────────────────────────────────────────────────────────────────

type ImageEntry = { url: string; caption?: string }
type ImagesUpdate = ImageEntry[] | ((prev: ImageEntry[]) => ImageEntry[])

function MediaTab({
  thumbnail, images, thumbnailError,
  onThumbnailChange, onImagesChange,
}: {
  thumbnail: string
  images: ImageEntry[]
  thumbnailError?: string
  onThumbnailChange: (v: string) => void
  onImagesChange: (update: ImagesUpdate) => void
}) {
  const [uploading, setUploading] = useState<Record<number, boolean>>({})
  const [thumbUploading, setThumbUploading] = useState(false)

  async function uploadFile(file: File, onUrl: (url: string) => void, setProgress: (v: boolean) => void) {
    setProgress(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) {
        alert(data.error ?? 'Erro ao enviar arquivo.')
        return
      }
      if (data.url) onUrl(data.url)
      else alert(data.error ?? 'Erro ao enviar arquivo.')
    } finally {
      setProgress(false)
    }
  }

  function updateImage(i: number, patch: Partial<ImageEntry>) {
    onImagesChange(prev => {
      const next = [...prev]
      next[i] = { ...next[i], ...patch }
      return next
    })
  }

  function removeImage(i: number) {
    onImagesChange(prev => prev.filter((_, j) => j !== i))
  }

  return (
    <>
      {/* Thumbnail */}
      <div>
        <label className="block text-xs font-semibold text-neutral-600 mb-1">
          Miniatura <span className="text-red-500">*</span>
          <span className="font-normal text-neutral-400 ml-1">(imagem principal do card)</span>
        </label>
        <div className="flex gap-3 items-start">
          <div className="flex-1 space-y-1.5">
            <div className="flex gap-2">
              <input type="text" value={thumbnail} placeholder="Cole uma URL ou faça upload..."
                onChange={e => onThumbnailChange(e.target.value)}
                className={`flex-1 px-3 py-2.5 bg-neutral-100 rounded-lg text-sm border-0 outline-none focus:ring-2 ${thumbnailError ? 'ring-2 ring-red-300' : 'focus:ring-[#1E3A5F]/20'}`} />
              <label className={`flex items-center gap-1.5 px-3 py-2.5 rounded-lg text-sm font-medium cursor-pointer transition-colors ${thumbUploading ? 'bg-neutral-200 text-neutral-400' : 'bg-[#1E3A5F] text-white hover:bg-[#141d3a]'}`}>
                {thumbUploading ? (
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"/></svg>
                )}
                <span className="hidden sm:inline">Upload</span>
                <input type="file" accept="image/*" className="sr-only" disabled={thumbUploading}
                  onChange={e => { const f = e.target.files?.[0]; if (f) uploadFile(f, onThumbnailChange, setThumbUploading); e.target.value = '' }} />
              </label>
            </div>
            {thumbnailError && <p className="text-xs text-red-500">{thumbnailError}</p>}
          </div>
          {thumbnail && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={thumbnail} alt="" className="w-20 h-20 rounded-xl object-cover flex-shrink-0 border border-neutral-200" />
          )}
        </div>
      </div>

      {/* Images */}
      <div>
        <label className="block text-xs font-semibold text-neutral-600 mb-2">
          Fotos do imóvel
          <span className="font-normal text-neutral-400 ml-1">({images.length} foto{images.length !== 1 ? 's' : ''})</span>
        </label>

        {images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
            {images.map((img, i) => (
              <div key={i} className="relative group rounded-xl overflow-hidden border border-neutral-200 bg-neutral-50">
                {/* Preview */}
                <div className="aspect-[4/3] bg-neutral-100">
                  {img.url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={img.url} alt={img.caption ?? ''} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-300">
                      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M13.5 12h.008v.008H13.5V12zm-6 6h.008v.008H6V18zm12 0h.008v.008H18V18z" />
                      </svg>
                    </div>
                  )}
                  {uploading[i] && (
                    <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                      <svg className="w-6 h-6 animate-spin text-[#1E3A5F]" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                    </div>
                  )}
                </div>
                {/* Delete button */}
                <button type="button" onClick={() => removeImage(i)}
                  className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                {/* Caption + URL */}
                <div className="p-2 space-y-1.5">
                  <input type="text" value={img.caption ?? ''} placeholder="Legenda (opcional)"
                    onChange={e => updateImage(i, { caption: e.target.value })}
                    className="w-full px-2 py-1.5 bg-neutral-100 rounded-md text-xs border-0 outline-none focus:ring-2 focus:ring-[#1E3A5F]/20" />
                  <div className="flex gap-1">
                    <input type="text" value={img.url} placeholder="URL..."
                      onChange={e => updateImage(i, { url: e.target.value })}
                      className="flex-1 min-w-0 px-2 py-1.5 bg-neutral-100 rounded-md text-xs border-0 outline-none focus:ring-2 focus:ring-[#1E3A5F]/20" />
                    <label className={`flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-md cursor-pointer transition-colors ${uploading[i] ? 'bg-neutral-200' : 'bg-neutral-200 hover:bg-[#1E3A5F] hover:text-white text-neutral-500'}`}>
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"/>
                      </svg>
                      <input type="file" accept="image/*" className="sr-only" disabled={!!uploading[i]}
                        onChange={e => {
                          const f = e.target.files?.[0]
                          if (f) uploadFile(f, url => updateImage(i, { url }), v => setUploading(u => ({ ...u, [i]: v })))
                          e.target.value = ''
                        }} />
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add buttons */}
        <div className="flex gap-2 flex-wrap">
          <button type="button"
            onClick={() => onImagesChange(prev => [...prev, { url: '' }])}
            className="flex items-center gap-1.5 text-sm text-[#1E3A5F] hover:underline font-medium">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Adicionar URL
          </button>
          <span className="text-neutral-300">|</span>
          <label className="flex items-center gap-1.5 text-sm text-[#1E3A5F] hover:underline font-medium cursor-pointer">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"/>
            </svg>
            Enviar do computador
            <input type="file" accept="image/*" multiple className="sr-only"
              onChange={e => {
                const files = Array.from(e.target.files ?? [])
                const startIdx = images.length
                const placeholders: ImageEntry[] = files.map(() => ({ url: '' }))
                onImagesChange(prev => [...prev, ...placeholders])
                files.forEach((file, fi) => {
                  const idx = startIdx + fi
                  uploadFile(
                    file,
                    url => updateImage(idx, { url }),
                    v => setUploading(u => ({ ...u, [idx]: v }))
                  )
                })
                e.target.value = ''
              }} />
          </label>
        </div>
      </div>
    </>
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
    media: { images: [], thumbnail: '' },
    status: { isActive: false, isFeatured: false, isSpecial: false },
    metrics: { views: 0, favorites: 0, searchAppearances: 0 },
    timestamps: { createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    agent: { name: '', phone: '', email: '' },
  }
}

// ── Main form component ───────────────────────────────────────────────────────

export default function PropertyForm({ property: initial, readOnly = false }: { property?: Property; readOnly?: boolean }) {
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
  const [valorPacoteDisplay, setValorPacoteDisplay] = useState<string>(() =>
    initial?.price.valorPacote ? formatBRLDisplay(initial.price.valorPacote) : '')
  const [valoresAdicionaisDisplay, setValoresAdicionaisDisplay] = useState<string>(() =>
    initial?.price.valoresAdicionais ? formatBRLDisplay(initial.price.valoresAdicionais) : '')

  useEffect(() => {
    fetch('/api/admin/features')
      .then(r => r.json())
      .then(setSavedCustomFeatures)
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (!isEdit) {
      setForm(f => ({ ...f, id: `PROP-${Date.now().toString(36).toUpperCase()}` }))
    }
  }, [isEdit])

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
    if ((form.propertyDetails.quartos ?? 0) < 1) e['propertyDetails.quartos'] = 'Mínimo 1 quarto'
    if (form.propertyDetails.bedrooms < 1) e['propertyDetails.bedrooms'] = 'Mínimo 1 suíte'
    if ((form.propertyDetails.lavabo ?? 0) < 1) e['propertyDetails.lavabo'] = 'Mínimo 1 lavabo'
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
        res = await fetch('/api/admin/properties', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...payload,
            id: form.id,
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
        const data = await res.json().catch(() => null)
        const firstIssue = data?.issues?.[0]
        const issuePath = Array.isArray(firstIssue?.path) ? firstIssue.path.join('.') : ''
        const issueMsg = firstIssue?.message as string | undefined
        showToast(
          issueMsg
            ? `Falha ao salvar: ${issuePath ? `${issuePath} - ` : ''}${issueMsg}`
            : (data?.error ?? 'Falha ao salvar. Tente novamente.'),
          'error'
        )
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
        {!readOnly && (
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
        )}
      </div>

      {/* ── Edit changes diff (review mode only) ── */}
      {readOnly && initial?.editSnapshot && (() => {
        const snap = initial.editSnapshot!
        const changes: { label: string; old: string; cur: string }[] = []
        if (snap.title !== undefined && snap.title !== form.title)
          changes.push({ label: 'Título', old: snap.title, cur: form.title })
        if (snap.description !== undefined && snap.description !== form.description)
          changes.push({ label: 'Descrição', old: snap.description.slice(0, 60) + (snap.description.length > 60 ? '…' : ''), cur: form.description.slice(0, 60) + (form.description.length > 60 ? '…' : '') })
        if (snap.price?.amount !== undefined && snap.price.amount !== form.price.amount)
          changes.push({ label: 'Preço', old: `${snap.price.amount.toLocaleString('pt-BR')}`, cur: `${form.price.amount.toLocaleString('pt-BR')}` })
        if (snap.price?.type !== undefined && snap.price.type !== form.price.type)
          changes.push({ label: 'Tipo de negócio', old: snap.price.type === 'sale' ? 'Venda' : 'Aluguel', cur: form.price.type === 'sale' ? 'Venda' : 'Aluguel' })
        if (snap.location?.address !== undefined && snap.location.address !== form.location.address)
          changes.push({ label: 'Endereço', old: snap.location.address, cur: form.location.address })
        if (snap.location?.city !== undefined && snap.location.city !== form.location.city)
          changes.push({ label: 'Cidade', old: snap.location.city, cur: form.location.city })
        if (snap.location?.province !== undefined && snap.location.province !== form.location.province)
          changes.push({ label: 'Estado', old: snap.location.province, cur: form.location.province })
        if (snap.location?.residential !== undefined && snap.location.residential !== form.location.residential)
          changes.push({ label: 'Residencial', old: snap.location.residential, cur: form.location.residential })
        if (snap.propertyDetails?.bedrooms !== undefined && snap.propertyDetails.bedrooms !== form.propertyDetails.bedrooms)
          changes.push({ label: 'Suítes', old: String(snap.propertyDetails.bedrooms), cur: String(form.propertyDetails.bedrooms) })
        if (snap.propertyDetails?.lavabo !== undefined && snap.propertyDetails.lavabo !== (form.propertyDetails.lavabo ?? 0))
          changes.push({ label: 'Lavabos', old: String(snap.propertyDetails.lavabo), cur: String(form.propertyDetails.lavabo ?? 0) })
        if (snap.propertyDetails?.areaSqFt !== undefined && snap.propertyDetails.areaSqFt !== form.propertyDetails.areaSqFt)
          changes.push({ label: 'Área (m²)', old: String(snap.propertyDetails.areaSqFt), cur: String(form.propertyDetails.areaSqFt) })
        if (snap.features !== undefined) {
          const added = form.features.filter(f => !snap.features!.includes(f))
          const removed = snap.features.filter(f => !form.features.includes(f))
          if (added.length > 0) changes.push({ label: 'Características +', old: '—', cur: added.join(', ') })
          if (removed.length > 0) changes.push({ label: 'Características −', old: removed.join(', '), cur: '—' })
        }
        if (snap.agent?.name !== undefined && snap.agent.name !== form.agent.name)
          changes.push({ label: 'Agente', old: snap.agent.name, cur: form.agent.name })
        if (snap.media?.thumbnail !== undefined && snap.media.thumbnail !== form.media.thumbnail)
          changes.push({ label: 'Miniatura', old: '(imagem anterior)', cur: '(nova imagem)' })

        if (changes.length === 0) return (
          <div className="mb-5 bg-neutral-50 border border-neutral-200 rounded-2xl px-4 py-3 text-xs text-neutral-500">
            Edição enviada — nenhuma alteração detectada nos campos comparados.
          </div>
        )
        return (
          <div className="mb-5 bg-amber-50 border border-amber-200 rounded-2xl p-4">
            <p className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-3">
              {changes.length} campo{changes.length !== 1 ? 's' : ''} alterado{changes.length !== 1 ? 's' : ''}
            </p>
            <div className="space-y-2">
              {changes.map((c, i) => (
                <div key={i} className="grid grid-cols-[100px_1fr_12px_1fr] items-start gap-2 text-xs">
                  <span className="font-semibold text-amber-700 truncate">{c.label}</span>
                  <span className="text-neutral-500 line-through truncate">{c.old}</span>
                  <span className="text-amber-400 text-center">→</span>
                  <span className="text-amber-900 font-medium truncate">{c.cur}</span>
                </div>
              ))}
            </div>
          </div>
        )
      })()}

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

      <div className={`space-y-4${readOnly ? ' pointer-events-none select-none opacity-80' : ''}`}>

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

            <BRLInput
              label="Preço"
              required
              display={brlDisplay}
              onChangeDisplay={raw => handleBRLChange(raw, setBrlDisplay, amount => set('price', { ...form.price, amount }))}
              error={errors['price.amount']}
            />

            {/* Condomínio + IPTU na mesma linha */}
            <div className="grid grid-cols-2 gap-4">
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
            </div>

            {/* Valor do pacote + Valores adicionais + Observações na mesma linha */}
            <div className="grid grid-cols-3 gap-4">
              <BRLInput
                label="Valor do pacote"
                display={valorPacoteDisplay}
                onChangeDisplay={raw => handleBRLChange(raw, setValorPacoteDisplay, amount => set('price', { ...form.price, valorPacote: amount || undefined }))}
              />
              <BRLInput
                label="Valores adicionais"
                display={valoresAdicionaisDisplay}
                onChangeDisplay={raw => handleBRLChange(raw, setValoresAdicionaisDisplay, amount => set('price', { ...form.price, valoresAdicionais: amount || undefined }))}
              />
              <div>
                <label className="block text-xs font-semibold text-neutral-600 mb-1">Observações</label>
                <input
                  type="text"
                  value={form.price.observacoesPacote ?? ''}
                  placeholder="Ex: inclui água e gás"
                  onChange={e => set('price', { ...form.price, observacoesPacote: e.target.value || undefined })}
                  className="w-full px-3 py-2.5 bg-neutral-100 rounded-lg text-sm border-0 outline-none focus:ring-2 focus:ring-[#1E3A5F]/20"
                />
              </div>
            </div>

            {/* Tipo de garantia */}
            <div>
              <label className="block text-xs font-semibold text-neutral-600 mb-1">Tipo de garantia</label>
              <select
                value={form.price.tipoGarantia ?? ''}
                onChange={e => set('price', { ...form.price, tipoGarantia: e.target.value || undefined })}
                className="w-full px-3 py-2.5 bg-neutral-100 rounded-lg text-sm border-0 outline-none focus:ring-2 focus:ring-[#1E3A5F]/20"
              >
                <option value="">Selecionar...</option>
                <option value="Caução">Caução</option>
                <option value="Fiança">Fiança</option>
                <option value="Seguro Fiança">Seguro Fiança</option>
                <option value="Cessão Fiduciária de Cotas de Fundo de Investimento">Cessão Fiduciária de Cotas de Fundo de Investimento</option>
                <option value="Título de Capitalização">Título de Capitalização</option>
                <option value="Garantidoras">Garantidoras</option>
              </select>
            </div>

            {/* Observações gerais */}
            <div>
              <label className="block text-xs font-semibold text-neutral-600 mb-1">Observações gerais</label>
              <textarea
                value={form.price.observacoes ?? ''}
                rows={3}
                placeholder="Informações adicionais sobre o preço ou condições..."
                onChange={e => set('price', { ...form.price, observacoes: e.target.value || undefined })}
                className="w-full px-3 py-2.5 bg-neutral-100 rounded-lg text-sm border-0 outline-none focus:ring-2 focus:ring-[#1E3A5F]/20 resize-none"
              />
            </div>
          </>
        )}

        {/* ── Localização ── */}
        {activeTab === 'Localização' && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Endereço" required value={form.location.address} onChange={v => set('location', { ...form.location, address: v })} error={errors['location.address']} />
              <Input label="Cidade" required value={form.location.city} onChange={v => set('location', { ...form.location, city: v })} error={errors['location.city']} />
              <Input label="Estado" required value={form.location.province} onChange={v => set('location', { ...form.location, province: v })} error={errors['location.province']} />
              <Input label="Código Postal / CEP" value={form.location.postalCode ?? ''} onChange={v => set('location', { ...form.location, postalCode: v })} />
            </div>
            <Input label="Residencial / Condomínio" required value={form.location.residential} onChange={v => set('location', { ...form.location, residential: v })} error={errors['location.residential']} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Latitude" type="number" value={form.location.coordinates?.lat ?? ''} onChange={v => set('location', { ...form.location, coordinates: { lat: parseFloat(v) || 0, lng: form.location.coordinates?.lng ?? 0 } })} />
              <Input label="Longitude" type="number" value={form.location.coordinates?.lng ?? ''} onChange={v => set('location', { ...form.location, coordinates: { lat: form.location.coordinates?.lat ?? 0, lng: parseFloat(v) || 0 } })} />
            </div>
          </>
        )}

        {/* ── Detalhes ── */}
        {activeTab === 'Detalhes' && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <Counter
                label="Nº de Quartos (total)"
                value={form.propertyDetails.quartos ?? 0}
                min={1}
                required
                onChange={n => setForm(f => ({ ...f, propertyDetails: { ...f.propertyDetails, quartos: n } }))}
                error={errors['propertyDetails.quartos']}
              />
              <Counter
                label="Nº de Suítes"
                value={form.propertyDetails.bedrooms}
                onChange={n => setForm(f => ({ ...f, propertyDetails: { ...f.propertyDetails, bedrooms: n } }))}
                error={errors['propertyDetails.bedrooms']}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Counter
                label="Lavabo"
                value={form.propertyDetails.lavabo ?? 0}
                min={1}
                required
                onChange={n => setForm(f => ({ ...f, propertyDetails: { ...f.propertyDetails, lavabo: n } }))}
                error={errors['propertyDetails.lavabo']}
              />
              <Counter
                label="Escritório"
                value={form.propertyDetails.escritorio ?? 0}
                onChange={n => setForm(f => ({ ...f, propertyDetails: { ...f.propertyDetails, escritorio: n } }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Counter
                label="Vagas (cobertas ou descobertas)"
                value={form.propertyDetails.vagas ?? 0}
                onChange={n => setForm(f => ({ ...f, propertyDetails: { ...f.propertyDetails, vagas: n } }))}
              />
              <div className="flex items-center gap-3 px-4 py-3 bg-neutral-100 rounded-lg">
                <input
                  id="mobiliado"
                  type="checkbox"
                  checked={form.propertyDetails.mobiliado ?? false}
                  onChange={e => setForm(f => ({ ...f, propertyDetails: { ...f.propertyDetails, mobiliado: e.target.checked } }))}
                  className="h-4 w-4 rounded border-neutral-300 text-[#1E3A5F] focus:ring-[#1E3A5F]"
                />
                <label htmlFor="mobiliado" className="text-sm font-medium text-neutral-600 cursor-pointer">
                  Mobiliado
                </label>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Área construída (m²)"
                type="number"
                value={form.propertyDetails.areaSqFt || ''}
                onChange={v => setForm(f => ({ ...f, propertyDetails: { ...f.propertyDetails, areaSqFt: parseFloat(v) || 0 } }))}
                placeholder="0"
              />
              <Input
                label="Área de terreno (m²)"
                type="number"
                value={form.propertyDetails.areaTerrenoSqFt ?? ''}
                onChange={v => setForm(f => ({ ...f, propertyDetails: { ...f.propertyDetails, areaTerrenoSqFt: parseFloat(v) || undefined } }))}
                placeholder="0"
              />
            </div>
          </>
        )}

        {/* ── Características ── */}
        {activeTab === 'Características' && (
          <>
            <p className="text-xs text-neutral-500">Clique para selecionar características</p>
            <div className="flex flex-wrap gap-2">
              {ALL_FEATURES.map(({ value, label }) => {
                const active = form.features.includes(value)
                const locked = value === 'baccarat' && form.status.isFeatured
                return (
                  <button key={value} type="button"
                    onClick={() => !locked && toggleFeature(value)}
                    disabled={locked}
                    title={locked ? 'Ativado automaticamente por Seleção Casa Baccarat' : undefined}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                      locked
                        ? 'bg-[#1E3A5F] text-white border-[#1E3A5F] opacity-60 cursor-not-allowed'
                        : active
                          ? 'bg-[#1E3A5F] text-white border-[#1E3A5F]'
                          : 'bg-white text-neutral-600 border-neutral-200 hover:border-[#1E3A5F]'
                    }`}>
                    {locked ? `🔒 ${label}` : label}
                  </button>
                )
              })}
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
          <MediaTab
            thumbnail={form.media.thumbnail}
            images={form.media.images}
            thumbnailError={errors['media.thumbnail']}
            onThumbnailChange={v => set('media', { ...form.media, thumbnail: v })}
            onImagesChange={update => setForm(prev => ({
              ...prev,
              media: {
                ...prev.media,
                images: typeof update === 'function' ? update(prev.media.images) : update,
              },
            }))}
          />
        )}

        {/* ── Status & Agente ── */}
        {activeTab === 'Status & Agente' && (
          <>
            {!isEdit && form.id && (
              <div>
                <label className="block text-xs font-semibold text-neutral-600 mb-1">ID do Imóvel (gerado automaticamente)</label>
                <div className="px-3 py-2.5 bg-neutral-100 rounded-lg text-sm font-mono text-neutral-500 select-all">{form.id}</div>
              </div>
            )}
            <div className="bg-white rounded-xl border border-neutral-100 px-4 divide-y divide-neutral-100">
              <Toggle label="Anúncio ativo" description="Visível nos resultados de busca públicos" checked={form.status.isActive} onChange={v => set('status', { ...form.status, isActive: v })} />
              <Toggle label="Seleção Casa Baccarat" description="Exibido em card maior na curadoria" checked={form.status.isFeatured} onChange={v => {
                set('status', { ...form.status, isFeatured: v })
                setForm(prev => ({
                  ...prev,
                  features: v
                    ? prev.features.includes('baccarat') ? prev.features : [...prev.features, 'baccarat']
                    : prev.features.filter(f => f !== 'baccarat'),
                }))
              }} />
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
            {isEdit && !readOnly && (
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
