import { getProperties } from '@/lib/properties'
import { getAllUsers } from '@/lib/users'
import type { Property } from '@/data/properties'
import PropertiesClient from './PropertiesClient'

export const dynamic = 'force-dynamic'

export default async function AdminPropertiesPage() {
  let properties: Property[] = []
  let users: { id: string; first_name: string; last_name: string }[] = []
  try {
    ;[properties, users] = await Promise.all([
      getProperties(),
      getAllUsers().then(all => all.map(({ id, first_name, last_name }) => ({ id, first_name, last_name }))),
    ])
  } catch {
    properties = []
  }
  return <PropertiesClient initialProperties={properties} users={users} />
}
