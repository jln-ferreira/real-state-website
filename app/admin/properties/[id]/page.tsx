import { notFound } from 'next/navigation'
import { getPropertyById } from '@/lib/properties'
import { PROPERTIES } from '@/data/properties'
import PropertyForm from '../PropertyForm'
import ReviewActions from './ReviewActions'

export default async function EditPropertyPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ review?: string }>
}) {
  const { id } = await params
  const { review } = await searchParams
  const isReview = review === '1'

  let property = null
  try {
    property = await getPropertyById(id)
  } catch {
    property = PROPERTIES.find(p => p.id === id) ?? null
  }
  if (!property) notFound()

  return (
    <>
      {isReview && <ReviewActions propertyId={id} />}
      <PropertyForm property={property} readOnly={isReview} />
    </>
  )
}
