import Layout from '@/components/Layout'
import HomeClient from '@/components/HomeClient'
import { getProperties } from '@/lib/properties'
import type { Property } from '@/data/properties'

export const dynamic = 'force-dynamic'

export default async function Home() {
  let properties: Property[] = []
  try {
    const all = await getProperties()
    // Public catalog: only active properties that are approved (user-submitted)
    // or managed directly by an admin.
    properties = all.filter(
      p => p.status.isActive && (!p.ownerId || p.adminStatus === 'approved')
    )
  } catch (err) {
    console.error('Failed to load properties from DB:', err)
  }
  return (
    <Layout>
      <HomeClient initialProperties={properties} />
    </Layout>
  )
}
