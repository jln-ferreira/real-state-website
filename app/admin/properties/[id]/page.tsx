import { notFound } from 'next/navigation'
import { getPropertyById } from '@/lib/properties'
import { PROPERTIES } from '@/data/properties'
import PropertyForm from '../PropertyForm'

export default async function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  let property = null
  try {
    property = await getPropertyById(id)
  } catch {
    property = PROPERTIES.find(p => p.id === id) ?? null
  }
  if (!property) notFound()
  return <PropertyForm property={property} />
}
