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
    amount:      number
    currency:    'BRL' | 'CAD' | 'USD'
    type:        PriceType
    condominio?: number
    iptu?:       number
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
    type:        PropertyType
    bedrooms:    number
    bathrooms:   number
    areaSqFt:    number
    yearBuilt?:  number
    lavabo?:     number
    escritorio?: number
  }
  features: string[]
  media: { images: string[]; thumbnail: string }
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
  /** Snapshot of previous values stored when a user submits an edit for re-approval */
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
  const n = p.price.amount.toLocaleString('en-CA')
  return p.price.type === 'rent' ? `CA$ ${n}/mo` : `CA$ ${n}`
}

export function sqftToM2(sqft: number): number {
  return Math.round(sqft * 0.0929)
}

// ── Mock dataset ──────────────────────────────────────────────────────────────

export const PROPERTIES: Property[] = [
  // ── Houses – Sale ─────────────────────────────────────────────────────────
  {
    id: 'PROP-001', title: 'Spanish Bungalow',
    img: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&q=80',
    description: 'A charming Spanish-style bungalow nestled in one of Vancouver\'s most sought-after neighbourhoods. Features original hardwood floors, arched doorways, and a beautifully landscaped garden.',
    price: { amount: 620000, currency: 'CAD', type: 'sale' },
    location: { address: '55 Rosewood Ln, Vancouver, BC', city: 'Vancouver', province: 'BC', residential: 'Residencial Zero' },
    propertyDetails: { type: 'house', bedrooms: 3, bathrooms: 2, areaSqFt: 1780, yearBuilt: 1995 },
    features: ['parking', 'balcony'],
    media: {
      thumbnail: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&q=80',
      images: [
        'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200&q=85',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=85',
        'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1200&q=85',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=85',
        'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200&q=85',
      ],
    },
    status: { isActive: true, isFeatured: true, isSpecial: false },
    metrics: { views: 245, favorites: 18, searchAppearances: 120 },
    agent: { name: 'Sophie Martin', phone: '+14165550101', email: 'sophie@estatefind.com' },
  },
  {
    id: 'PROP-002', title: 'Lakefront Retreat',
    img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80',
    description: 'A stunning lakefront estate offering panoramic views of the surrounding mountains and lake. This 5-bedroom masterpiece features a chef\'s kitchen, infinity pool, and a private dock.',
    price: { amount: 1250000, currency: 'CAD', type: 'sale' },
    location: { address: '9 Lakewood Dr, Whistler, BC', city: 'Whistler', province: 'BC', residential: 'Alphaville' },
    propertyDetails: { type: 'house', bedrooms: 5, bathrooms: 4, areaSqFt: 4200, yearBuilt: 2010 },
    features: ['parking', 'pool', 'gym'],
    media: {
      thumbnail: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80',
      images: [
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=85',
        'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200&q=85',
        'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1200&q=85',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=85',
      ],
    },
    status: { isActive: true, isFeatured: true, isSpecial: false },
    metrics: { views: 389, favorites: 42, searchAppearances: 200 },
    agent: { name: 'James Wilson', phone: '+16045550202', email: 'james@estatefind.com' },
  },
  {
    id: 'PROP-003', title: 'Classic Craftsman',
    img: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&q=80',
    description: 'A beautifully preserved 4-bedroom Craftsman-style home in the heart of Victoria. Original wood trim, covered front porch, and a generous backyard garden make this a rare find.',
    price: { amount: 485000, currency: 'CAD', type: 'sale' },
    location: { address: '312 Maple Ave, Victoria, BC', city: 'Victoria', province: 'BC', residential: 'Tamboré' },
    propertyDetails: { type: 'house', bedrooms: 4, bathrooms: 3, areaSqFt: 2600, yearBuilt: 1988 },
    features: ['parking', 'garden'],
    media: {
      thumbnail: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&q=80',
      images: [
        'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1200&q=85',
        'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200&q=85',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=85',
      ],
    },
    status: { isActive: true, isFeatured: false, isSpecial: false },
    metrics: { views: 112, favorites: 9, searchAppearances: 78 },
    agent: { name: 'Laura Chen', phone: '+12505550303', email: 'laura@estatefind.com' },
  },
  // ── Houses – Rent ─────────────────────────────────────────────────────────
  {
    id: 'PROP-004', title: 'Suburban Family Home',
    img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80',
    description: 'A spacious 4-bedroom family home in a quiet Calgary suburb. Features a large backyard, double garage, and proximity to top-rated schools. Fully renovated kitchen and bathrooms.',
    price: { amount: 3200, currency: 'CAD', type: 'rent' },
    location: { address: '78 Elmwood Cres, Calgary, AB', city: 'Calgary', province: 'AB', residential: 'Burle Marx' },
    propertyDetails: { type: 'house', bedrooms: 4, bathrooms: 3, areaSqFt: 2340, yearBuilt: 2002 },
    features: ['parking', 'pool', 'garden'],
    media: {
      thumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80',
      images: [
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=85',
        'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200&q=85',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=85',
      ],
    },
    status: { isActive: true, isFeatured: true, isSpecial: false },
    metrics: { views: 178, favorites: 21, searchAppearances: 95 },
    agent: { name: 'Mike Thompson', phone: '+14035550404', email: 'mike@estatefind.com' },
  },
  {
    id: 'PROP-005', title: 'Cozy Ranch Home',
    img: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&q=80',
    description: 'A warm and welcoming ranch-style home in Edmonton. One-level living with an open floor plan, attached garage, and a lovely yard perfect for families and pets.',
    price: { amount: 1950, currency: 'CAD', type: 'rent' },
    location: { address: '414 Pebble Creek Rd, Edmonton, AB', city: 'Edmonton', province: 'AB', residential: 'Alpha Park' },
    propertyDetails: { type: 'house', bedrooms: 3, bathrooms: 2, areaSqFt: 1540, yearBuilt: 1998 },
    features: ['parking'],
    media: {
      thumbnail: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&q=80',
      images: [
        'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200&q=85',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=85',
      ],
    },
    status: { isActive: true, isFeatured: false, isSpecial: false },
    metrics: { views: 88, favorites: 5, searchAppearances: 60 },
    agent: { name: 'Sandra Lee', phone: '+17805550505', email: 'sandra@estatefind.com' },
  },
  {
    id: 'PROP-006', title: 'Modern Farmhouse',
    img: 'https://images.unsplash.com/photo-1591474200742-8e512e6f98f8?w=600&q=80',
    description: 'A striking modern farmhouse in Ottawa featuring 5 bedrooms, designer finishes, and a resort-style pool. Situated on a large private lot with mature trees.',
    price: { amount: 4500, currency: 'CAD', type: 'rent' },
    location: { address: '1108 Heritage Rd, Ottawa, ON', city: 'Ottawa', province: 'ON', residential: 'Itahyê' },
    propertyDetails: { type: 'house', bedrooms: 5, bathrooms: 4, areaSqFt: 3800, yearBuilt: 2015 },
    features: ['parking', 'pool', 'gym', 'garden'],
    media: {
      thumbnail: 'https://images.unsplash.com/photo-1591474200742-8e512e6f98f8?w=600&q=80',
      images: [
        'https://images.unsplash.com/photo-1591474200742-8e512e6f98f8?w=1200&q=85',
        'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200&q=85',
      ],
    },
    status: { isActive: true, isFeatured: false, isSpecial: false },
    metrics: { views: 145, favorites: 14, searchAppearances: 88 },
    agent: { name: 'David Park', phone: '+16135550606', email: 'david@estatefind.com' },
  },
  // ── Apartments – Sale ─────────────────────────────────────────────────────
  {
    id: 'PROP-007', title: 'Modern Downtown Loft',
    img: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80',
    description: 'A sophisticated 2-bedroom loft in the heart of Toronto\'s financial district. Floor-to-ceiling windows, polished concrete floors, and access to a full-service concierge.',
    price: { amount: 485000, currency: 'CAD', type: 'sale' },
    location: { address: '142 King St W #1204, Toronto, ON', city: 'Toronto', province: 'ON', residential: 'Residencial Zero' },
    propertyDetails: { type: 'apartment', bedrooms: 2, bathrooms: 2, areaSqFt: 1120, yearBuilt: 2018 },
    features: ['balcony', 'parking', 'gym', 'concierge'],
    media: {
      thumbnail: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80',
      images: [
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=85',
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=85',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=85',
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=85',
      ],
    },
    status: { isActive: true, isFeatured: true, isSpecial: false },
    metrics: { views: 312, favorites: 35, searchAppearances: 175 },
    agent: { name: 'Rachel Adams', phone: '+14165550707', email: 'rachel@estatefind.com' },
  },
  {
    id: 'PROP-008', title: 'High-Rise City View',
    img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80',
    description: 'A breathtaking 3-bedroom suite on the 18th floor with sweeping views of Toronto\'s skyline. Features a wraparound balcony, premium appliances, and building amenities including pool and gym.',
    price: { amount: 720000, currency: 'CAD', type: 'sale' },
    location: { address: '500 Bay St #1802, Toronto, ON', city: 'Toronto', province: 'ON', residential: 'Alphaville' },
    propertyDetails: { type: 'apartment', bedrooms: 3, bathrooms: 2, areaSqFt: 1650, yearBuilt: 2016 },
    features: ['balcony', 'parking', 'gym', 'pool', 'concierge'],
    media: {
      thumbnail: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80',
      images: [
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=85',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=85',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=85',
      ],
    },
    status: { isActive: true, isFeatured: false, isSpecial: false },
    metrics: { views: 201, favorites: 27, searchAppearances: 140 },
    agent: { name: 'Tom Nguyen', phone: '+14165550808', email: 'tom@estatefind.com' },
  },
  {
    id: 'PROP-009', title: 'Open-Plan Urban Flat',
    img: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80',
    description: 'A stylish 1-bedroom flat in Montreal\'s vibrant Plateau neighbourhood. Open-plan living area, exposed brick, and a private balcony overlooking a charming street.',
    price: { amount: 295000, currency: 'CAD', type: 'sale' },
    location: { address: '2727 St-Denis #305, Montreal, QC', city: 'Montreal', province: 'QC', residential: 'Tamboré' },
    propertyDetails: { type: 'apartment', bedrooms: 1, bathrooms: 1, areaSqFt: 820, yearBuilt: 2005 },
    features: ['balcony'],
    media: {
      thumbnail: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80',
      images: [
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=85',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=85',
      ],
    },
    status: { isActive: true, isFeatured: false, isSpecial: false },
    metrics: { views: 95, favorites: 8, searchAppearances: 55 },
    agent: { name: 'Claire Dubois', phone: '+15145550909', email: 'claire@estatefind.com' },
  },
  // ── Apartments – Rent ─────────────────────────────────────────────────────
  {
    id: 'PROP-010', title: 'Minimalist Studio',
    img: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80',
    description: 'A sleek minimalist studio in Vancouver\'s Granville district. Perfect for professionals, featuring smart storage solutions, a full kitchen, and access to a state-of-the-art gym.',
    price: { amount: 1400, currency: 'CAD', type: 'rent' },
    location: { address: '310 Granville St #4A, Vancouver, BC', city: 'Vancouver', province: 'BC', residential: 'Burle Marx' },
    propertyDetails: { type: 'apartment', bedrooms: 1, bathrooms: 1, areaSqFt: 540, yearBuilt: 2012 },
    features: ['gym'],
    media: {
      thumbnail: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80',
      images: [
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=85',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=85',
      ],
    },
    status: { isActive: true, isFeatured: false, isSpecial: false },
    metrics: { views: 76, favorites: 6, searchAppearances: 42 },
    agent: { name: 'Alex Kim', phone: '+16045551010', email: 'alex@estatefind.com' },
  },
  {
    id: 'PROP-011', title: 'Harbourfront Apartment',
    img: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=600&q=80',
    description: 'A gorgeous 2-bedroom apartment steps from Toronto\'s harbourfront. Features a large balcony with lake views, in-suite laundry, and a pet-friendly building with underground parking.',
    price: { amount: 2100, currency: 'CAD', type: 'rent' },
    location: { address: '801 Queens Quay W #210, Toronto, ON', city: 'Toronto', province: 'ON', residential: 'Alpha Park' },
    propertyDetails: { type: 'apartment', bedrooms: 2, bathrooms: 2, areaSqFt: 1050, yearBuilt: 2008 },
    features: ['balcony', 'parking', 'pet-friendly'],
    media: {
      thumbnail: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=600&q=80',
      images: [
        'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=1200&q=85',
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=85',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=85',
      ],
    },
    status: { isActive: true, isFeatured: false, isSpecial: false },
    metrics: { views: 134, favorites: 11, searchAppearances: 72 },
    agent: { name: 'Nina Patel', phone: '+14165551111', email: 'nina@estatefind.com' },
  },
  {
    id: 'PROP-012', title: 'Luxury 2-Bed Flat',
    img: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&q=80',
    description: 'An exquisite fully furnished 2-bedroom flat in Montreal\'s Westmount neighbourhood. Featuring premium finishes, a gourmet kitchen, and access to rooftop pool and fitness centre.',
    price: { amount: 3400, currency: 'CAD', type: 'rent' },
    location: { address: '4521 Sherbrooke W #1102, Montreal, QC', city: 'Montreal', province: 'QC', residential: 'Itahyê' },
    propertyDetails: { type: 'apartment', bedrooms: 2, bathrooms: 2, areaSqFt: 1380, yearBuilt: 2020 },
    features: ['balcony', 'parking', 'gym', 'pool', 'furnished'],
    media: {
      thumbnail: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&q=80',
      images: [
        'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&q=85',
        'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=1200&q=85',
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=85',
      ],
    },
    status: { isActive: true, isFeatured: true, isSpecial: false },
    metrics: { views: 287, favorites: 31, searchAppearances: 155 },
    agent: { name: 'Marc Lefebvre', phone: '+15145551212', email: 'marc@estatefind.com' },
  },
  // ── Commercial – Sale ─────────────────────────────────────────────────────
  {
    id: 'PROP-013', title: 'Downtown Office Suite',
    img: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80',
    description: 'A prestigious penthouse office suite at the most coveted address in Toronto\'s financial core. Features 2,800 sqft of premium space, 3 washrooms, and a private boardroom with stunning lake views.',
    price: { amount: 2100000, currency: 'CAD', type: 'sale' },
    location: { address: '1 Bay St #PH3, Toronto, ON', city: 'Toronto', province: 'ON', residential: 'Residencial Zero' },
    propertyDetails: { type: 'commercial', bedrooms: 0, bathrooms: 3, areaSqFt: 2800, yearBuilt: 2014 },
    features: ['parking', 'gym', 'concierge'],
    media: {
      thumbnail: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80',
      images: [
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=85',
        'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1200&q=85',
      ],
    },
    status: { isActive: true, isFeatured: true, isSpecial: false },
    metrics: { views: 189, favorites: 22, searchAppearances: 110 },
    agent: { name: 'Brian Scott', phone: '+14165551313', email: 'brian@estatefind.com' },
  },
  {
    id: 'PROP-014', title: 'Retail Corner Unit',
    img: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=600&q=80',
    description: 'A highly visible corner retail unit in Vancouver\'s Oak Street corridor. 1,300 sqft of open floor plan with large display windows, high foot traffic, and dedicated parking.',
    price: { amount: 410000, currency: 'CAD', type: 'sale' },
    location: { address: '8212 Oak St #14, Vancouver, BC', city: 'Vancouver', province: 'BC', residential: 'Alphaville' },
    propertyDetails: { type: 'commercial', bedrooms: 0, bathrooms: 1, areaSqFt: 1300, yearBuilt: 2000 },
    features: ['parking'],
    media: {
      thumbnail: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=600&q=80',
      images: [
        'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1200&q=85',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=85',
      ],
    },
    status: { isActive: true, isFeatured: false, isSpecial: false },
    metrics: { views: 67, favorites: 4, searchAppearances: 38 },
    agent: { name: 'Keiko Tanaka', phone: '+16045551414', email: 'keiko@estatefind.com' },
  },
  // ── Commercial – Rent ─────────────────────────────────────────────────────
  {
    id: 'PROP-015', title: 'Midtown Office Space',
    img: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600&q=80',
    description: 'A modern 890 sqft office unit in Toronto\'s Midtown. Ideal for a small to medium-sized business, featuring open-plan layout, reception area, private office, and a dedicated kitchenette.',
    price: { amount: 5500, currency: 'CAD', type: 'rent' },
    location: { address: '3225 Yonge St #611, Toronto, ON', city: 'Toronto', province: 'ON', residential: 'Tamboré' },
    propertyDetails: { type: 'commercial', bedrooms: 0, bathrooms: 1, areaSqFt: 890 },
    features: ['parking', 'concierge'],
    media: {
      thumbnail: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600&q=80',
      images: [
        'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&q=85',
      ],
    },
    status: { isActive: true, isFeatured: false, isSpecial: false },
    metrics: { views: 53, favorites: 3, searchAppearances: 29 },
    agent: { name: 'Olivia Brown', phone: '+14165551515', email: 'olivia@estatefind.com' },
  },
  // ── Land – Sale ───────────────────────────────────────────────────────────
  {
    id: 'PROP-016', title: 'Residential Development Lot',
    img: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=600&q=80',
    description: 'A prime 12,000 sqft residential development lot in Kelowna\'s rapidly growing west side. Zoned for single-family or multi-family development, with full municipal services at the lot line.',
    price: { amount: 280000, currency: 'CAD', type: 'sale' },
    location: { address: '5100 Country Rd, Kelowna, BC', city: 'Kelowna', province: 'BC', residential: 'Burle Marx' },
    propertyDetails: { type: 'land', bedrooms: 0, bathrooms: 0, areaSqFt: 12000 },
    features: [],
    media: {
      thumbnail: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=600&q=80',
      images: [
        'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1200&q=85',
        'https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=1200&q=85',
      ],
    },
    status: { isActive: true, isFeatured: false, isSpecial: false },
    metrics: { views: 44, favorites: 2, searchAppearances: 22 },
    agent: { name: 'Gary Ross', phone: '+12505551616', email: 'gary@estatefind.com' },
  },
  {
    id: 'PROP-017', title: 'Waterfront Land Parcel',
    img: 'https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=600&q=80',
    description: 'A rare 22,000 sqft waterfront parcel with 180 feet of private lake frontage on Okanagan Lake. Ideal for a luxury estate or boutique resort development. Exceptional views and privacy.',
    price: { amount: 950000, currency: 'CAD', type: 'sale' },
    location: { address: '200 Lakeshore Dr, Kelowna, BC', city: 'Kelowna', province: 'BC', residential: 'Alpha Park' },
    propertyDetails: { type: 'land', bedrooms: 0, bathrooms: 0, areaSqFt: 22000 },
    features: [],
    media: {
      thumbnail: 'https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=600&q=80',
      images: [
        'https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=1200&q=85',
        'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1200&q=85',
      ],
    },
    status: { isActive: true, isFeatured: false, isSpecial: false },
    metrics: { views: 61, favorites: 7, searchAppearances: 35 },
    agent: { name: 'Sarah Hall', phone: '+12505551717', email: 'sarah@estatefind.com' },
  },
  {
    id: 'PROP-018', title: 'Urban Infill Lot',
    img: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=600&q=80',
    description: 'A 6,500 sqft urban infill lot on Vancouver\'s Commercial Drive. Zoned RM-4 allowing for up to 4 units. Surrounded by vibrant cafes, shops, and public transit. Incredible development opportunity.',
    price: { amount: 540000, currency: 'CAD', type: 'sale' },
    location: { address: '1441 Commercial Dr, Vancouver, BC', city: 'Vancouver', province: 'BC', residential: 'Itahyê' },
    propertyDetails: { type: 'land', bedrooms: 0, bathrooms: 0, areaSqFt: 6500 },
    features: [],
    media: {
      thumbnail: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=600&q=80',
      images: [
        'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=1200&q=85',
        'https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=1200&q=85',
      ],
    },
    status: { isActive: true, isFeatured: true, isSpecial: false },
    metrics: { views: 99, favorites: 13, searchAppearances: 58 },
    agent: { name: 'Derek Chang', phone: '+16045551818', email: 'derek@estatefind.com' },
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
  valorMax:    string   // raw digit string, e.g. "1500000"
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
