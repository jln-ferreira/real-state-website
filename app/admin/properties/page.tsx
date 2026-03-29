import { getProperties } from '@/lib/properties'
import { PROPERTIES } from '@/data/properties'
import PropertiesClient from './PropertiesClient'

export default async function AdminPropertiesPage() {
  let properties
  try {
    properties = await getProperties()
    if (properties.length === 0) properties = PROPERTIES
  } catch {
    properties = PROPERTIES
  }
  return <PropertiesClient initialProperties={properties} />
}
