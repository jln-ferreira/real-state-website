import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { getAllUsers } from '@/lib/users'
import { getProperties } from '@/lib/properties'
import AccountsClient from './AccountsClient'

export default async function AdminAccountsPage() {
  const session = await auth()
  if (!session || (session.user as any).role !== 'admin') redirect('/admin/login')

  const [users, properties] = await Promise.all([
    getAllUsers(),
    getProperties(),
  ])

  const safeUsers = users.map(({ password_hash: _, ...u }) => u)
  const propertyCountByOwner: Record<string, number> = {}

  properties.forEach(property => {
    if (!property.ownerId) return
    propertyCountByOwner[property.ownerId] = (propertyCountByOwner[property.ownerId] ?? 0) + 1
  })

  return (
    <AccountsClient
      initialUsers={safeUsers}
      propertyCountByOwner={propertyCountByOwner}
    />
  )
}
