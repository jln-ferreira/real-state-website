import Layout from '@/components/Layout'
import HomeClient from '@/components/HomeClient'
import { getProperties } from '@/lib/properties'
import type { Property } from '@/data/properties'

export default async function Home() {
  let properties: Property[] = []
  try {
    properties = await getProperties()
  } catch {
    // DB unavailable — render with empty list
  }
  return (
    <Layout>
      <HomeClient initialProperties={properties} />
    </Layout>
  )
}
