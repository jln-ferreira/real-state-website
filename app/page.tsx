import Layout from '@/components/Layout'
import HomeClient from '@/components/HomeClient'
import { getProperties } from '@/lib/properties'
import type { Property } from '@/data/properties'

export default async function Home() {
  let properties: Property[] = []
  try {
    const all = await getProperties()
    // Only show properties that are approved (user-submitted) or have no ownerId (static/admin-created)
    properties = all.filter(p => !p.ownerId || p.adminStatus === 'approved')
  } catch (err) {
    console.error('Failed to load properties from DB:', err)
  }
  return (
    <Layout>
      <HomeClient initialProperties={properties} />
    </Layout>
  )
}
