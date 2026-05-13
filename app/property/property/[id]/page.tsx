import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPropertyById } from '@/lib/properties'
import { PROPERTIES } from '@/data/properties'
import PropertyDetailClient from '@/components/PropertyDetailClient'
import Layout from '@/components/Layout'
import { buildPropertyMetadata } from '@/lib/property-share'

export const dynamic = 'force-dynamic'
export const revalidate = 0

async function resolveProperty(id: string) {
  try {
    const property = await getPropertyById(id)
    if (property) return property
  } catch {}

  return PROPERTIES.find(p => p.id === id) ?? null
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const property = await resolveProperty(id)

  if (!property) {
    return {
      title: 'Imóvel não encontrado | Casa Baccarat Imóveis',
    }
  }

  return buildPropertyMetadata(property)
}

export default async function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const property = await resolveProperty(id)

  if (!property) notFound()
  return (
    <Layout>
      <PropertyDetailClient property={property} />
    </Layout>
  )
}
