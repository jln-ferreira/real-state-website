import { z } from 'zod'

export const PropertySchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1, 'Title is required'),
  img: z.string().optional(),
  description: z.string().min(1, 'Description is required'),
  price: z.object({
    amount: z.number().positive('Price must be positive'),
    currency: z.enum(['CAD', 'USD']),
    type: z.enum(['rent', 'sale']),
  }),
  location: z.object({
    address: z.string().min(1),
    city: z.string().min(1),
    province: z.string().min(1),
    country: z.string().default('Canada'),
    postalCode: z.string().optional(),
    residential: z.string().min(1),
    coordinates: z.object({ lat: z.number(), lng: z.number() }).optional(),
  }),
  propertyDetails: z.object({
    type: z.enum(['apartment', 'house', 'commercial', 'land']),
    bedrooms: z.number().int().min(0),
    bathrooms: z.number().int().min(0),
    areaSqFt: z.number().min(0),
    yearBuilt: z.number().int().optional(),
  }),
  features: z.array(z.string()),
  media: z.object({
    images: z.array(z.string().url('Must be a valid URL')),
    thumbnail: z.string().url('Must be a valid URL'),
  }),
  status: z.object({
    isActive: z.boolean(),
    isFeatured: z.boolean(),
    isSpecial: z.boolean().default(false),
  }),
  metrics: z.object({
    views: z.number().default(0),
    favorites: z.number().default(0),
    searchAppearances: z.number().default(0),
  }),
  timestamps: z.object({
    createdAt: z.string(),
    updatedAt: z.string(),
  }).optional(),
  agent: z.object({
    name: z.string().min(1),
    phone: z.string().min(1),
    email: z.string().email(),
  }),
})

export const PartialPropertySchema = PropertySchema.partial().required({ id: true })
