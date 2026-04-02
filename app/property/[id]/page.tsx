import { getPropertyById, getSimilarProperties } from '@/lib/properties'
import { PROPERTIES } from '@/data/properties'
import { notFound } from 'next/navigation'
import PropertyDetailView from './PropertyDetailView'

export default async function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  let property = null
  try {
    property = await getPropertyById(id)
    if (!property) property = PROPERTIES.find(p => p.id === id) ?? null
  } catch {
    property = PROPERTIES.find(p => p.id === id) ?? null
  }

  if (!property) notFound()

  let similar: import('@/data/properties').Property[] = []
  try {
    similar = await getSimilarProperties(id, property.propertyDetails.type)
  } catch {
    similar = PROPERTIES
      .filter(p => p.propertyDetails.type === property!.propertyDetails.type && p.id !== id)
      .slice(0, 4)
  }

  return <PropertyDetailView property={property} similarProperties={similar} />
}
