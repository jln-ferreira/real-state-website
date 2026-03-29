import Layout from '@/components/Layout'
import HomeClient from '@/components/HomeClient'
import { getProperties } from '@/lib/properties'
import { PROPERTIES } from '@/data/properties'
import type { Property } from '@/data/properties'

export default async function Home() {
  let properties: Property[]
  try {
    properties = await getProperties()
    if (properties.length === 0) properties = PROPERTIES
  } catch {
    properties = PROPERTIES
  }
  return (
    <Layout>
      <HomeClient initialProperties={properties} />
    </Layout>
  )
}
