import type { Metadata } from 'next'
import type { Property } from '@/data/properties'
import { formatPrice } from '@/data/properties'

const FEATURE_LABELS: Record<string, string> = {
  balcony: 'Varanda',
  parking: 'Estacionamento',
  gym: 'Academia',
  pool: 'Piscina',
  garden: 'Jardim',
  furnished: 'Mobiliado',
  'pet-friendly': 'Aceita pets',
  concierge: 'Portaria',
  baccarat: 'Exclusivo Casa Baccarat',
  fireplace: 'Lareira',
  rooftop: 'Cobertura',
  'ev charging': 'Carregador eletrico',
  storage: 'Deposito',
  elevator: 'Elevador',
  security: 'Seguranca',
  '24h security': 'Seguranca 24h',
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL || 'https://casabaccarat.com.br'
const PREVIEW_IMAGE_WIDTH = 1200
const PREVIEW_IMAGE_HEIGHT = 630

function normalizeSiteUrl(url: string): string {
  return url.startsWith('http') ? url : `https://${url}`
}

function absoluteUrl(url: string): string {
  if (!url) return ''
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  return new URL(url.startsWith('/') ? url : `/${url}`, normalizeSiteUrl(SITE_URL)).toString()
}

function locationLine(property: Property): string {
  const { residential, city, province } = property.location
  const cityState = [city, province].filter(Boolean).join(', ')
  return [residential, cityState].filter(Boolean).join(' - ')
}

function pushUnique(items: string[], value: string) {
  const clean = value.trim()
  if (clean && !items.includes(clean)) items.push(clean)
}

export function buildPropertyShareMessage(property: Property, pageUrl: string): string {
  const details = property.propertyDetails
  const bullets: string[] = []

  property.features.forEach(feature => {
    pushUnique(bullets, FEATURE_LABELS[feature] ?? feature)
  })

  if (details.areaSqFt > 0) pushUnique(bullets, `${details.areaSqFt.toLocaleString('pt-BR')} m²`)
  if ((details.quartos ?? 0) > 0) {
    pushUnique(bullets, `${details.quartos} quarto${details.quartos! > 1 ? 's' : ''}`)
  }
  if (details.bedrooms > 0) pushUnique(bullets, `${details.bedrooms} suíte${details.bedrooms > 1 ? 's' : ''}`)
  if (details.bathrooms > 0) {
    pushUnique(bullets, `${details.bathrooms} banheiro${details.bathrooms > 1 ? 's' : ''}`)
  }
  if ((details.lavabo ?? 0) > 0) {
    pushUnique(bullets, `${details.lavabo} lavabo${details.lavabo! > 1 ? 's' : ''}`)
  }
  if ((details.escritorio ?? 0) > 0) {
    pushUnique(bullets, `${details.escritorio} escritório${details.escritorio! > 1 ? 's' : ''}`)
  }
  if ((details.vagas ?? 0) > 0) pushUnique(bullets, `${details.vagas} vaga${details.vagas! > 1 ? 's' : ''}`)
  if (details.mobiliado) pushUnique(bullets, 'Mobiliado')

  const lines = [
    'CASA BACCARAT IMOVEIS',
    'Cada imóvel selecionado com olhar de arquiteta.',
    '',
    property.title,
  ]

  const location = locationLine(property)
  if (location) lines.push(location)

  if (bullets.length > 0) {
    lines.push('', 'Destaques:', ...bullets.map(item => `• ${item}`))
  }

  const description = property.description?.trim()
  if (description) lines.push('', description)

  lines.push('', `Valor: ${formatPrice(property)}`)

  const cleanPageUrl = pageUrl.trim()
  if (cleanPageUrl) lines.push('', cleanPageUrl)

  return lines.join('\n')
}

export function getPropertyPageUrl(propertyId: string): string {
  return absoluteUrl(`/property/${propertyId}`)
}

export function getPropertyOpenGraphImageUrl(propertyId: string): string {
  return absoluteUrl(`/api/properties/${propertyId}/og-image`)
}

export function getPropertyPhotoUrl(property: Property): string {
  const firstImage = property.media?.images?.[0]
  const firstImageUrl = typeof firstImage === 'string' ? firstImage : firstImage?.url
  return absoluteUrl(property.media?.thumbnail || property.img || firstImageUrl || '/log.png')
}

export function buildPropertyMetadata(property: Property): Metadata {
  const url = getPropertyPageUrl(property.id)
  const image = getPropertyOpenGraphImageUrl(property.id)
  const title = `${property.title} | Casa Baccarat Imóveis`
  const descriptionParts = [
    locationLine(property),
    property.description?.trim(),
    `Valor: ${formatPrice(property)}`,
  ].filter(Boolean)
  const description = descriptionParts.join(' | ')

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: 'Casa Baccarat Imóveis',
      type: 'website',
      images: image
        ? [{
            url: image,
            width: PREVIEW_IMAGE_WIDTH,
            height: PREVIEW_IMAGE_HEIGHT,
            alt: property.title,
          }]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : undefined,
    },
  }
}
