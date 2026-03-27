// ── Types ─────────────────────────────────────────────────────────────────────

export type TransactionType = 'buy' | 'rent'
export type PropertyType    = 'house' | 'apartment' | 'condo'
// Feature union — added today; used for advanced filter toggles
export type Feature         = 'balcony' | 'parking' | 'gym' | 'pool'

export interface Property {
  id:           string         // "RE-0001" – used for exact-match search
  title:        string
  type:         PropertyType
  transaction:  TransactionType
  price:        number         // dollars total (buy) or dollars/month (rent)
  city:         string
  neighborhood: string
  address:      string
  beds:         number
  baths:        number
  sqft:         number
  garage:       number
  yearBuilt:    number         // added today — drives the Year Built filter
  features:     Feature[]     // added today — drives the Features filter (AND logic)
  img:          string
  featured?:    boolean
}

// ── Helpers ───────────────────────────────────────────────────────────────────

export function formatPrice(p: Property): string {
  const n = p.price.toLocaleString('en-US')
  return p.transaction === 'rent' ? `$${n}/mo` : `$${n}`
}

// ── Mock dataset ──────────────────────────────────────────────────────────────

export const PROPERTIES: Property[] = [
  // ── Houses – Buy ──────────────────────────────────────────────────────────
  {
    id: 'RE-0001',
    title: 'Spanish Bungalow',
    type: 'house', transaction: 'buy',
    price: 620000,
    city: 'San Antonio', neighborhood: 'Alamo Heights',
    address: '55 Rosewood Ln, San Antonio, TX',
    beds: 3, baths: 2, sqft: 1780, garage: 1,
    yearBuilt: 1952, features: ['parking', 'balcony'],
    img: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&q=80',
    featured: true,
  },
  {
    id: 'RE-0002',
    title: 'Lakefront Retreat',
    type: 'house', transaction: 'buy',
    price: 1250000,
    city: 'Lago Vista', neighborhood: 'Waterfront Estates',
    address: '9 Lakewood Dr, Lago Vista, TX',
    beds: 5, baths: 4, sqft: 4200, garage: 2,
    yearBuilt: 2015, features: ['parking', 'pool', 'gym'],
    img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80',
    featured: true,
  },
  {
    id: 'RE-0003',
    title: 'Classic Craftsman',
    type: 'house', transaction: 'buy',
    price: 485000,
    city: 'Austin', neighborhood: 'Hyde Park',
    address: '312 Ave G, Austin, TX',
    beds: 4, baths: 3, sqft: 2600, garage: 1,
    yearBuilt: 1928, features: ['parking'],
    img: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&q=80',
  },
  // ── Houses – Rent ─────────────────────────────────────────────────────────
  {
    id: 'RE-0004',
    title: 'Suburban Family Home',
    type: 'house', transaction: 'rent',
    price: 3200,
    city: 'Round Rock', neighborhood: 'Brushy Creek',
    address: '78 Maple Ave, Round Rock, TX',
    beds: 4, baths: 3, sqft: 2340, garage: 2,
    yearBuilt: 2008, features: ['parking', 'pool'],
    img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80',
    featured: true,
  },
  {
    id: 'RE-0005',
    title: 'Cozy Ranch Home',
    type: 'house', transaction: 'rent',
    price: 1950,
    city: 'San Antonio', neighborhood: 'Stone Oak',
    address: '414 Pebble Creek, San Antonio, TX',
    beds: 3, baths: 2, sqft: 1540, garage: 1,
    yearBuilt: 1975, features: ['parking'],
    img: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&q=80',
  },
  {
    id: 'RE-0006',
    title: 'Modern Farmhouse',
    type: 'house', transaction: 'rent',
    price: 4500,
    city: 'Austin', neighborhood: 'Tarrytown',
    address: '1108 Enfield Rd, Austin, TX',
    beds: 5, baths: 4, sqft: 3800, garage: 3,
    yearBuilt: 2019, features: ['parking', 'pool', 'gym'],
    img: 'https://images.unsplash.com/photo-1591474200742-8e512e6f98f8?w=600&q=80',
  },
  // ── Apartments – Buy ──────────────────────────────────────────────────────
  {
    id: 'RE-0007',
    title: 'Modern Downtown Loft',
    type: 'apartment', transaction: 'buy',
    price: 485000,
    city: 'Austin', neighborhood: 'Downtown',
    address: '142 Oak Street, Austin, TX',
    beds: 2, baths: 2, sqft: 1120, garage: 1,
    yearBuilt: 2018, features: ['balcony', 'parking', 'gym'],
    img: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80',
    featured: true,
  },
  {
    id: 'RE-0008',
    title: 'High-Rise City View',
    type: 'apartment', transaction: 'buy',
    price: 720000,
    city: 'Houston', neighborhood: 'Midtown',
    address: '500 Bagby St #1802, Houston, TX',
    beds: 3, baths: 2, sqft: 1650, garage: 1,
    yearBuilt: 2020, features: ['balcony', 'parking', 'gym', 'pool'],
    img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80',
  },
  {
    id: 'RE-0009',
    title: 'Open-Plan Urban Flat',
    type: 'apartment', transaction: 'buy',
    price: 295000,
    city: 'Dallas', neighborhood: 'Deep Ellum',
    address: '2727 Canton St #305, Dallas, TX',
    beds: 1, baths: 1, sqft: 820, garage: 0,
    yearBuilt: 2005, features: ['balcony'],
    img: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80',
  },
  // ── Apartments – Rent ─────────────────────────────────────────────────────
  {
    id: 'RE-0010',
    title: 'Minimalist Studio',
    type: 'apartment', transaction: 'rent',
    price: 1400,
    city: 'Austin', neighborhood: 'Downtown',
    address: '310 Congress Ave #4A, Austin, TX',
    beds: 1, baths: 1, sqft: 540, garage: 0,
    yearBuilt: 2016, features: ['gym'],
    img: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80',
  },
  {
    id: 'RE-0011',
    title: 'River Walk Apartment',
    type: 'apartment', transaction: 'rent',
    price: 2100,
    city: 'San Antonio', neighborhood: 'River Walk',
    address: '801 S Alamo St #210, San Antonio, TX',
    beds: 2, baths: 2, sqft: 1050, garage: 1,
    yearBuilt: 2011, features: ['balcony', 'parking'],
    img: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=600&q=80',
  },
  {
    id: 'RE-0012',
    title: 'Luxury 2-Bed Flat',
    type: 'apartment', transaction: 'rent',
    price: 3400,
    city: 'Houston', neighborhood: 'River Oaks',
    address: '4521 Westheimer Rd #1102, Houston, TX',
    beds: 2, baths: 2, sqft: 1380, garage: 2,
    yearBuilt: 2022, features: ['balcony', 'parking', 'gym', 'pool'],
    img: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&q=80',
    featured: true,
  },
  // ── Condos – Buy ──────────────────────────────────────────────────────────
  {
    id: 'RE-0013',
    title: 'Urban Penthouse',
    type: 'condo', transaction: 'buy',
    price: 2100000,
    city: 'Houston', neighborhood: 'Downtown',
    address: '1 Skyline Blvd #PH3, Houston, TX',
    beds: 3, baths: 3, sqft: 2800, garage: 2,
    yearBuilt: 2017, features: ['balcony', 'parking', 'gym', 'pool'],
    img: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80',
    featured: true,
  },
  {
    id: 'RE-0014',
    title: 'Golf Course Condo',
    type: 'condo', transaction: 'buy',
    price: 410000,
    city: 'Austin', neighborhood: 'Barton Creek',
    address: '8212 Barton Club Dr #14, Austin, TX',
    beds: 2, baths: 2, sqft: 1300, garage: 1,
    yearBuilt: 2003, features: ['parking', 'pool', 'gym'],
    img: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=600&q=80',
  },
  {
    id: 'RE-0015',
    title: 'Midtown Corner Unit',
    type: 'condo', transaction: 'buy',
    price: 325000,
    city: 'Dallas', neighborhood: 'Uptown',
    address: '3225 Turtle Creek Blvd #611, Dallas, TX',
    beds: 1, baths: 1, sqft: 890, garage: 1,
    yearBuilt: 2010, features: ['balcony', 'parking'],
    img: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600&q=80',
  },
  // ── Condos – Rent ─────────────────────────────────────────────────────────
  {
    id: 'RE-0016',
    title: 'Skyline View Condo',
    type: 'condo', transaction: 'rent',
    price: 2800,
    city: 'Houston', neighborhood: 'Galleria',
    address: '5100 San Felipe St #350, Houston, TX',
    beds: 2, baths: 2, sqft: 1200, garage: 1,
    yearBuilt: 2014, features: ['balcony', 'parking', 'gym'],
    img: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=600&q=80',
  },
  {
    id: 'RE-0017',
    title: 'Trendy Pearl District Condo',
    type: 'condo', transaction: 'rent',
    price: 1850,
    city: 'San Antonio', neighborhood: 'Pearl District',
    address: '200 E Grayson St #305, San Antonio, TX',
    beds: 1, baths: 1, sqft: 750, garage: 1,
    yearBuilt: 2021, features: ['balcony', 'parking'],
    img: 'https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=600&q=80',
  },
  {
    id: 'RE-0018',
    title: 'Design District Condo',
    type: 'condo', transaction: 'rent',
    price: 3600,
    city: 'Dallas', neighborhood: 'Design District',
    address: '1441 Turtle Creek Blvd #802, Dallas, TX',
    beds: 3, baths: 2, sqft: 1750, garage: 2,
    yearBuilt: 2019, features: ['balcony', 'parking', 'gym', 'pool'],
    img: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=600&q=80',
    featured: true,
  },
]

// ── Filter types ──────────────────────────────────────────────────────────────

export interface Filters {
  location:     string
  transaction:  'all' | TransactionType
  types:        PropertyType[]   // empty = all types
  priceMin:     string
  priceMax:     string
  propertyId:   string
  minBeds:      number           // 0 = any
  minBaths:     number           // 0 = any
  // Fields added today ↓
  yearBuiltMin: string           // inclusive lower bound for yearBuilt
  yearBuiltMax: string           // inclusive upper bound for yearBuilt
  sqftMin:      string           // inclusive lower bound for sqft
  sqftMax:      string           // inclusive upper bound for sqft
  features:     Feature[]        // empty = any; AND logic (must have all selected)
}

export const DEFAULT_FILTERS: Filters = {
  location:     '',
  transaction:  'all',
  types:        [],
  priceMin:     '',
  priceMax:     '',
  propertyId:   '',
  minBeds:      0,
  minBaths:     0,
  yearBuiltMin: '',
  yearBuiltMax: '',
  sqftMin:      '',
  sqftMax:      '',
  features:     [],
}

// ── Filter function ───────────────────────────────────────────────────────────

export function applyFilters(properties: Property[], f: Filters): Property[] {
  return properties.filter(p => {
    if (f.transaction !== 'all' && p.transaction !== f.transaction) return false
    if (f.types.length > 0 && !f.types.includes(p.type)) return false

    if (f.location.trim()) {
      const q = f.location.trim().toLowerCase()
      const haystack = `${p.city} ${p.neighborhood} ${p.address}`.toLowerCase()
      if (!haystack.includes(q)) return false
    }

    if (f.priceMin !== '' && p.price < Number(f.priceMin)) return false
    if (f.priceMax !== '' && p.price > Number(f.priceMax)) return false

    if (f.propertyId.trim() &&
        !p.id.toLowerCase().includes(f.propertyId.trim().toLowerCase())) return false

    if (f.minBeds  > 0 && p.beds  < f.minBeds)  return false
    if (f.minBaths > 0 && p.baths < f.minBaths) return false

    // Year built range — added today
    if (f.yearBuiltMin !== '' && p.yearBuilt < Number(f.yearBuiltMin)) return false
    if (f.yearBuiltMax !== '' && p.yearBuilt > Number(f.yearBuiltMax)) return false

    // Square footage range — added today
    if (f.sqftMin !== '' && p.sqft < Number(f.sqftMin)) return false
    if (f.sqftMax !== '' && p.sqft > Number(f.sqftMax)) return false

    // Features — AND logic: property must include every selected feature (added today)
    if (f.features.length > 0 && !f.features.every(feat => p.features.includes(feat))) return false

    return true
  })
}

// ── Sort ──────────────────────────────────────────────────────────────────────

export type SortKey = 'newest' | 'price-asc' | 'price-desc'

export function sortProperties(properties: Property[], key: SortKey): Property[] {
  const clone = [...properties]
  if (key === 'price-asc')  clone.sort((a, b) => a.price - b.price)
  if (key === 'price-desc') clone.sort((a, b) => b.price - a.price)
  // 'newest' keeps insertion order (id ascending acts as newest-first mock)
  return clone
}
