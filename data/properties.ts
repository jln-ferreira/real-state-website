// ── Types ─────────────────────────────────────────────────────────────────────

export type PropertyType = 'house' | 'apartment' | 'commercial' | 'land'
export type Feature      = 'balcony' | 'parking' | 'gym' | 'pool' | 'garden' | 'furnished' | 'pet-friendly' | 'concierge' | 'baccarat'
export type PriceType    = 'sale' | 'rent'

export interface Property {
  id:          string
  title:       string
  img:         string
  description: string
  price: {
    amount:               number
    currency:             'BRL' | 'CAD' | 'USD'
    type:                 PriceType
    condominio?:          number
    iptu?:                number
    valorPacote?:         number
    valoresAdicionais?:   number
    observacoesPacote?:   string
    tipoGarantia?:        string
    observacoes?:         string
  }
  location: {
    address:     string
    city:        string
    province:    string
    country?:    string
    postalCode?: string
    residential: string
    coordinates?: { lat: number; lng: number }
  }
  propertyDetails: {
    type:               PropertyType
    bedrooms:           number
    bathrooms:          number
    areaSqFt:           number
    yearBuilt?:         number
    lavabo?:            number
    escritorio?:        number
    quartos?:           number
    vagas?:             number
    mobiliado?:         boolean
    areaTerrenoSqFt?:   number
    areaConstruidaSqFt?: number
  }
  features: string[]
  media: { images: Array<{ url: string; caption?: string }>; thumbnail: string }
  status: {
    isActive:   boolean
    isFeatured: boolean
    isSpecial?: boolean
  }
  metrics: {
    views:              number
    favorites:          number
    searchAppearances?: number
  }
  timestamps?: {
    createdAt: string
    updatedAt: string
  }
  agent: { name: string; phone: string; email: string }
  ownerId?: string
  adminStatus?: 'pending' | 'approved' | 'rejected'
  rejectionReason?: string
  editSnapshot?: {
    title?: string
    description?: string
    price?: Property['price']
    location?: Property['location']
    propertyDetails?: Property['propertyDetails']
    features?: string[]
    media?: Property['media']
    agent?: Property['agent']
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

export function formatPrice(p: Property): string {
  const n = p.price.amount.toLocaleString('pt-BR')
  const currency = p.price.currency === 'BRL' ? 'R$' : p.price.currency === 'USD' ? 'US$' : 'CA$'
  return p.price.type === 'rent' ? `${currency} ${n}/mês` : `${currency} ${n}`
}

export function sqftToM2(sqft: number): number {
  return Math.round(sqft * 0.0929)
}

// ── Dataset (empty — populated via admin panel) ───────────────────────────────

export const PROPERTIES: Property[] = []

// ── Derived constants ──────────────────────────────────────────────────────────

export const RESIDENTIAL_OPTIONS: string[] = []

// ── Filter types ──────────────────────────────────────────────────────────────

export interface Filters {
  negocio:     'all' | PriceType
  tipo:        'all' | PropertyType
  valorMax:    string
  residential: string
  ref:         string
  bedrooms:    number
  bathrooms:   number
  areaMin:     string
  areaMax:     string
  features:    Feature[]
}

export const DEFAULT_FILTERS: Filters = {
  negocio:     'all',
  tipo:        'all',
  valorMax:    '',
  residential: 'all',
  ref:         '',
  bedrooms:    0,
  bathrooms:   0,
  areaMin:     '',
  areaMax:     '',
  features:    [],
}

// ── Filter function ───────────────────────────────────────────────────────────

export function applyFilters(properties: Property[], f: Filters): Property[] {
  return properties.filter(p => {
    if (f.negocio !== 'all' && p.price.type !== f.negocio) return false
    if (f.tipo    !== 'all' && p.propertyDetails.type !== f.tipo) return false
    if (f.valorMax && p.price.amount > Number(f.valorMax)) return false
    if (f.residential !== 'all' && p.location.residential !== f.residential) return false
    if (f.ref && !p.id.toLowerCase().includes(f.ref.toLowerCase())) return false
    if (f.bedrooms  > 0 && p.propertyDetails.bedrooms  < f.bedrooms)  return false
    if (f.bathrooms > 0 && p.propertyDetails.bathrooms < f.bathrooms) return false
    if (f.areaMin && sqftToM2(p.propertyDetails.areaSqFt) < Number(f.areaMin)) return false
    if (f.areaMax && sqftToM2(p.propertyDetails.areaSqFt) > Number(f.areaMax)) return false
    if (f.features.length > 0) {
      for (const feat of f.features) {
        if (feat === 'baccarat') {
          // Accept if either the dedicated flag or the feature tag is set
          if (!p.status.isFeatured && !p.features.includes('baccarat')) return false
        } else {
          if (!p.features.includes(feat)) return false
        }
      }
    }
    return true
  })
}

// ── Sort ──────────────────────────────────────────────────────────────────────

export type SortKey = 'newest' | 'price-asc' | 'price-desc'

export function sortProperties(properties: Property[], key: SortKey): Property[] {
  const clone = [...properties]
  if (key === 'price-asc')  clone.sort((a, b) => a.price.amount - b.price.amount)
  if (key === 'price-desc') clone.sort((a, b) => b.price.amount - a.price.amount)
  return clone
}
