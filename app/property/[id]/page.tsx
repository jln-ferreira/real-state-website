import { getPropertyById, getProperties } from '@/lib/properties'
import { PROPERTIES } from '@/data/properties'
import { notFound } from 'next/navigation'
import PropertyDetailView from './PropertyDetailView'

export default async function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  let property = null
  let allProperties: import('@/data/properties').Property[] = []
  try {
    ;[property, allProperties] = await Promise.all([getPropertyById(id), getProperties()])
    if (!property) {
      property = PROPERTIES.find(p => p.id === id) ?? null
      if (allProperties.length === 0) allProperties = PROPERTIES
    }
  } catch {
    property = PROPERTIES.find(p => p.id === id) ?? null
    allProperties = PROPERTIES
  }

  if (!property) notFound()

  const similar = allProperties
    .filter(p => p.propertyDetails.type === property!.propertyDetails.type && p.id !== property!.id)
    .slice(0, 4)

  return <PropertyDetailView property={property} similarProperties={similar} />
}
