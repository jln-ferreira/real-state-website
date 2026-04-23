import { z } from 'zod'

export const PropertySchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1, 'Title is required'),
  img: z.string().optional(),
  description: z.string().min(1, 'Description is required'),
  price: z.object({
    amount: z.number().positive('Price must be positive'),
    currency: z.enum(['BRL', 'CAD', 'USD']),
    type: z.enum(['rent', 'sale']),
    condominio:          z.number().min(0).optional(),
    iptu:                z.number().min(0).optional(),
    valorPacote:         z.number().min(0).optional(),
    valoresAdicionais:   z.number().min(0).optional(),
    observacoesPacote:   z.string().optional(),
    tipoGarantia:        z.string().optional(),
    observacoes:         z.string().optional(),
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
    type:               z.enum(['apartment', 'house', 'commercial', 'land']),
    bedrooms:           z.number().int().min(0),
    bathrooms:          z.number().int().min(0),
    areaSqFt:           z.number().min(0),
    yearBuilt:          z.number().int().optional(),
    lavabo:             z.number().int().min(0).optional(),
    escritorio:         z.number().int().min(0).optional(),
    quartos:            z.number().int().min(0).optional(),
    vagas:              z.number().int().min(0).optional(),
    mobiliado:          z.boolean().optional(),
    areaTerrenoSqFt:    z.number().min(0).optional(),
  }),
  features: z.array(z.string()),
  media: z.object({
    images: z.array(
      z.union([
        z.string().min(1),
        z.object({ url: z.string().min(1), caption: z.string().optional() }),
      ]).transform(item => typeof item === 'string' ? { url: item } : item)
    ),
    thumbnail: z.string().min(1),
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
  ownerId: z.string().optional(),
  adminStatus: z.enum(['pending', 'approved', 'rejected']).optional(),
})

export const PartialPropertySchema = PropertySchema.partial().required({ id: true })

export const PostSchema = z.object({
  slug:       z.string().regex(/^[a-z0-9-]+$/, 'Slug deve conter apenas letras minúsculas, números e hífens'),
  title:      z.string().min(1, 'Título é obrigatório'),
  excerpt:    z.string().min(1, 'Resumo é obrigatório'),
  content:    z.string().min(1, 'Conteúdo é obrigatório'),
  image:      z.string().min(1, 'Imagem é obrigatória'),
  date:       z.string().min(1, 'Data é obrigatória'),
  category:   z.string().optional().default(''),
  categories: z.array(z.string()).optional().default([]),
  readTime:     z.string().min(1, 'Tempo de leitura é obrigatório'),
  published:    z.boolean().default(true),
  registeredAt: z.string().optional(),
  views:        z.number().int().min(0).default(0),
})

export const ContactSchema = z.object({
  propertyId: z.string().min(1),
  name: z.string().min(1, 'Nome é obrigatório'),
  phone: z.string().optional(),
  email: z.string().email('E-mail inválido'),
  message: z.string().min(1, 'Mensagem é obrigatória'),
})
