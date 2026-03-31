import { getProperties } from '@/lib/properties'
import type { Property } from '@/data/properties'
import PropertiesClient from './PropertiesClient'

export default async function AdminPropertiesPage() {
  let properties: Property[] = []
  try {
    properties = await getProperties()
  } catch {
    properties = []
  }
  return <PropertiesClient initialProperties={properties} />
}
