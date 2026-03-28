// ── Types ─────────────────────────────────────────────────────────────────────

export type PropertyType = 'house' | 'apartment' | 'commercial' | 'land'
export type Feature      = 'balcony' | 'parking' | 'gym' | 'pool' | 'garden' | 'furnished' | 'pet-friendly' | 'concierge'
export type PriceType    = 'sale' | 'rent'

export interface Property {
  id:    string
  title: string
  img:   string
  price: {
    amount:   number
    currency: 'CAD'
    type:     PriceType
  }
  location: {
    address:     string
    city:        string
    province:    string
    residential: string
  }
  propertyDetails: {
    type:      PropertyType
    bedrooms:  number
    bathrooms: number
    areaSqFt:  number
  }
  features: Feature[]
  status: {
    isActive:   boolean
    isFeatured: boolean
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

export function formatPrice(p: Property): string {
  const n = p.price.amount.toLocaleString('en-CA')
  return p.price.type === 'rent' ? `CA$ ${n}/mo` : `CA$ ${n}`
}

// ── Mock dataset ──────────────────────────────────────────────────────────────

export const PROPERTIES: Property[] = [
  // ── Houses – Sale ─────────────────────────────────────────────────────────
  {
    id: 'PROP-001', title: 'Spanish Bungalow',
    img: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&q=80',
    price: { amount: 620000, currency: 'CAD', type: 'sale' },
    location: { address: '55 Rosewood Ln, Vancouver, BC', city: 'Vancouver', province: 'BC', residential: 'Residencial Zero' },
    propertyDetails: { type: 'house', bedrooms: 3, bathrooms: 2, areaSqFt: 1780 },
    features: ['parking', 'balcony'],
    status: { isActive: true, isFeatured: true },
  },
  {
    id: 'PROP-002', title: 'Lakefront Retreat',
    img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80',
    price: { amount: 1250000, currency: 'CAD', type: 'sale' },
    location: { address: '9 Lakewood Dr, Whistler, BC', city: 'Whistler', province: 'BC', residential: 'Alphaville' },
    propertyDetails: { type: 'house', bedrooms: 5, bathrooms: 4, areaSqFt: 4200 },
    features: ['parking', 'pool', 'gym'],
    status: { isActive: true, isFeatured: true },
  },
  {
    id: 'PROP-003', title: 'Classic Craftsman',
    img: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&q=80',
    price: { amount: 485000, currency: 'CAD', type: 'sale' },
    location: { address: '312 Maple Ave, Victoria, BC', city: 'Victoria', province: 'BC', residential: 'Tamboré' },
    propertyDetails: { type: 'house', bedrooms: 4, bathrooms: 3, areaSqFt: 2600 },
    features: ['parking', 'garden'],
    status: { isActive: true, isFeatured: false },
  },
  // ── Houses – Rent ─────────────────────────────────────────────────────────
  {
    id: 'PROP-004', title: 'Suburban Family Home',
    img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80',
    price: { amount: 3200, currency: 'CAD', type: 'rent' },
    location: { address: '78 Elmwood Cres, Calgary, AB', city: 'Calgary', province: 'AB', residential: 'Burle Marx' },
    propertyDetails: { type: 'house', bedrooms: 4, bathrooms: 3, areaSqFt: 2340 },
    features: ['parking', 'pool', 'garden'],
    status: { isActive: true, isFeatured: true },
  },
  {
    id: 'PROP-005', title: 'Cozy Ranch Home',
    img: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&q=80',
    price: { amount: 1950, currency: 'CAD', type: 'rent' },
    location: { address: '414 Pebble Creek Rd, Edmonton, AB', city: 'Edmonton', province: 'AB', residential: 'Alpha Park' },
    propertyDetails: { type: 'house', bedrooms: 3, bathrooms: 2, areaSqFt: 1540 },
    features: ['parking'],
    status: { isActive: true, isFeatured: false },
  },
  {
    id: 'PROP-006', title: 'Modern Farmhouse',
    img: 'https://images.unsplash.com/photo-1591474200742-8e512e6f98f8?w=600&q=80',
    price: { amount: 4500, currency: 'CAD', type: 'rent' },
    location: { address: '1108 Heritage Rd, Ottawa, ON', city: 'Ottawa', province: 'ON', residential: 'Itahyê' },
    propertyDetails: { type: 'house', bedrooms: 5, bathrooms: 4, areaSqFt: 3800 },
    features: ['parking', 'pool', 'gym', 'garden'],
    status: { isActive: true, isFeatured: false },
  },
  // ── Apartments – Sale ─────────────────────────────────────────────────────
  {
    id: 'PROP-007', title: 'Modern Downtown Loft',
    img: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80',
    price: { amount: 485000, currency: 'CAD', type: 'sale' },
    location: { address: '142 King St W #1204, Toronto, ON', city: 'Toronto', province: 'ON', residential: 'Residencial Zero' },
    propertyDetails: { type: 'apartment', bedrooms: 2, bathrooms: 2, areaSqFt: 1120 },
    features: ['balcony', 'parking', 'gym', 'concierge'],
    status: { isActive: true, isFeatured: true },
  },
  {
    id: 'PROP-008', title: 'High-Rise City View',
    img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80',
    price: { amount: 720000, currency: 'CAD', type: 'sale' },
    location: { address: '500 Bay St #1802, Toronto, ON', city: 'Toronto', province: 'ON', residential: 'Alphaville' },
    propertyDetails: { type: 'apartment', bedrooms: 3, bathrooms: 2, areaSqFt: 1650 },
    features: ['balcony', 'parking', 'gym', 'pool', 'concierge'],
    status: { isActive: true, isFeatured: false },
  },
  {
    id: 'PROP-009', title: 'Open-Plan Urban Flat',
    img: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80',
    price: { amount: 295000, currency: 'CAD', type: 'sale' },
    location: { address: '2727 St-Denis #305, Montreal, QC', city: 'Montreal', province: 'QC', residential: 'Tamboré' },
    propertyDetails: { type: 'apartment', bedrooms: 1, bathrooms: 1, areaSqFt: 820 },
    features: ['balcony'],
    status: { isActive: true, isFeatured: false },
  },
  // ── Apartments – Rent ─────────────────────────────────────────────────────
  {
    id: 'PROP-010', title: 'Minimalist Studio',
    img: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80',
    price: { amount: 1400, currency: 'CAD', type: 'rent' },
    location: { address: '310 Granville St #4A, Vancouver, BC', city: 'Vancouver', province: 'BC', residential: 'Burle Marx' },
    propertyDetails: { type: 'apartment', bedrooms: 1, bathrooms: 1, areaSqFt: 540 },
    features: ['gym'],
    status: { isActive: true, isFeatured: false },
  },
  {
    id: 'PROP-011', title: 'Harbourfront Apartment',
    img: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=600&q=80',
    price: { amount: 2100, currency: 'CAD', type: 'rent' },
    location: { address: '801 Queens Quay W #210, Toronto, ON', city: 'Toronto', province: 'ON', residential: 'Alpha Park' },
    propertyDetails: { type: 'apartment', bedrooms: 2, bathrooms: 2, areaSqFt: 1050 },
    features: ['balcony', 'parking', 'pet-friendly'],
    status: { isActive: true, isFeatured: false },
  },
  {
    id: 'PROP-012', title: 'Luxury 2-Bed Flat',
    img: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&q=80',
    price: { amount: 3400, currency: 'CAD', type: 'rent' },
    location: { address: '4521 Sherbrooke W #1102, Montreal, QC', city: 'Montreal', province: 'QC', residential: 'Itahyê' },
    propertyDetails: { type: 'apartment', bedrooms: 2, bathrooms: 2, areaSqFt: 1380 },
    features: ['balcony', 'parking', 'gym', 'pool', 'furnished'],
    status: { isActive: true, isFeatured: true },
  },
  // ── Commercial – Sale ─────────────────────────────────────────────────────
  {
    id: 'PROP-013', title: 'Downtown Office Suite',
    img: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80',
    price: { amount: 2100000, currency: 'CAD', type: 'sale' },
    location: { address: '1 Bay St #PH3, Toronto, ON', city: 'Toronto', province: 'ON', residential: 'Residencial Zero' },
    propertyDetails: { type: 'commercial', bedrooms: 0, bathrooms: 3, areaSqFt: 2800 },
    features: ['parking', 'gym', 'concierge'],
    status: { isActive: true, isFeatured: true },
  },
  {
    id: 'PROP-014', title: 'Retail Corner Unit',
    img: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=600&q=80',
    price: { amount: 410000, currency: 'CAD', type: 'sale' },
    location: { address: '8212 Oak St #14, Vancouver, BC', city: 'Vancouver', province: 'BC', residential: 'Alphaville' },
    propertyDetails: { type: 'commercial', bedrooms: 0, bathrooms: 1, areaSqFt: 1300 },
    features: ['parking'],
    status: { isActive: true, isFeatured: false },
  },
  // ── Commercial – Rent ─────────────────────────────────────────────────────
  {
    id: 'PROP-015', title: 'Midtown Office Space',
    img: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600&q=80',
    price: { amount: 5500, currency: 'CAD', type: 'rent' },
    location: { address: '3225 Yonge St #611, Toronto, ON', city: 'Toronto', province: 'ON', residential: 'Tamboré' },
    propertyDetails: { type: 'commercial', bedrooms: 0, bathrooms: 1, areaSqFt: 890 },
    features: ['parking', 'concierge'],
    status: { isActive: true, isFeatured: false },
  },
  // ── Land – Sale ───────────────────────────────────────────────────────────
  {
    id: 'PROP-016', title: 'Residential Development Lot',
    img: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=600&q=80',
    price: { amount: 280000, currency: 'CAD', type: 'sale' },
    location: { address: '5100 Country Rd, Kelowna, BC', city: 'Kelowna', province: 'BC', residential: 'Burle Marx' },
    propertyDetails: { type: 'land', bedrooms: 0, bathrooms: 0, areaSqFt: 12000 },
    features: [],
    status: { isActive: true, isFeatured: false },
  },
  {
    id: 'PROP-017', title: 'Waterfront Land Parcel',
    img: 'https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=600&q=80',
    price: { amount: 950000, currency: 'CAD', type: 'sale' },
    location: { address: '200 Lakeshore Dr, Kelowna, BC', city: 'Kelowna', province: 'BC', residential: 'Alpha Park' },
    propertyDetails: { type: 'land', bedrooms: 0, bathrooms: 0, areaSqFt: 22000 },
    features: [],
    status: { isActive: true, isFeatured: false },
  },
  {
    id: 'PROP-018', title: 'Urban Infill Lot',
    img: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=600&q=80',
    price: { amount: 540000, currency: 'CAD', type: 'sale' },
    location: { address: '1441 Commercial Dr, Vancouver, BC', city: 'Vancouver', province: 'BC', residential: 'Itahyê' },
    propertyDetails: { type: 'land', bedrooms: 0, bathrooms: 0, areaSqFt: 6500 },
    features: [],
    status: { isActive: true, isFeatured: true },
  },
]

// ── Derived constants ──────────────────────────────────────────────────────────

export const RESIDENTIAL_OPTIONS: string[] = [
  ...new Set(PROPERTIES.map(p => p.location.residential)),
]

// ── Filter types ──────────────────────────────────────────────────────────────

export interface Filters {
  negocio:     'all' | PriceType
  tipo:        'all' | PropertyType
  valorMin:    string   // raw digit string, e.g. "500000"
  valorMax:    string
  residential: string   // 'all' | specific residential name
  ref:         string
  bedrooms:    number   // 0 = any
  bathrooms:   number   // 0 = any
  areaMin:     string   // raw digit string
  areaMax:     string
  features:    Feature[]
}

export const DEFAULT_FILTERS: Filters = {
  negocio:     'all',
  tipo:        'all',
  valorMin:    '',
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
    if (f.valorMin && p.price.amount < Number(f.valorMin)) return false
    if (f.valorMax && p.price.amount > Number(f.valorMax)) return false
    if (f.residential !== 'all' && p.location.residential !== f.residential) return false
    if (f.ref && !p.id.toLowerCase().includes(f.ref.toLowerCase())) return false
    if (f.bedrooms  > 0 && p.propertyDetails.bedrooms  < f.bedrooms)  return false
    if (f.bathrooms > 0 && p.propertyDetails.bathrooms < f.bathrooms) return false
    if (f.areaMin && p.propertyDetails.areaSqFt < Number(f.areaMin)) return false
    if (f.areaMax && p.propertyDetails.areaSqFt > Number(f.areaMax)) return false
    if (f.features.length > 0 && !f.features.every(feat => p.features.includes(feat))) return false
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
