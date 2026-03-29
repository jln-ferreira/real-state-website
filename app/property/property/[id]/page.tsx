import { notFound } from 'next/navigation'
import { getPropertyById } from '@/lib/properties'
import { PROPERTIES } from '@/data/properties'
import PropertyDetailClient from '@/components/PropertyDetailClient'
import Layout from '@/components/Layout'

export default async function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  let property = null
  try {
    property = await getPropertyById(id)
  } catch {
    property = PROPERTIES.find(p => p.id === id) ?? null
  }
  if (!property) notFound()
  return (
    <Layout>
      <PropertyDetailClient property={property} />
    </Layout>
  )
}
