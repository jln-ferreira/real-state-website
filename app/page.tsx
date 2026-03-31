import Layout from '@/components/Layout'
import HomeClient from '@/components/HomeClient'
import { getProperties } from '@/lib/properties'
import type { Property } from '@/data/properties'

export default async function Home() {
  let properties: Property[] = []
  try {
    properties = await getProperties()
  } catch (err) {
    console.error('Failed to load properties from DB:', err)
  }
  return (
    <Layout>
      <HomeClient initialProperties={properties} />
    </Layout>
  )
}
