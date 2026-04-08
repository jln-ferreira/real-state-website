import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { getAllUsers } from '@/lib/users'
import { getProperties } from '@/lib/properties'
import ApprovalsClient from './ApprovalsClient'

export default async function ApprovalsPage() {
  const session = await auth()
  if (!session || (session.user as any).role !== 'admin') redirect('/admin/login')

  const [allUsers, allProperties] = await Promise.all([
    getAllUsers(),
    getProperties(),
  ])

  const pendingUsers = allUsers
    .filter(u => u.status === 'pending')
    .map(({ password_hash: _, ...u }) => u)

  const pendingProperties = allProperties.filter(p => p.adminStatus === 'pending')

  // Build ownerId -> user name map for display
  const userMap: Record<string, string> = {}
  allUsers.forEach(u => {
    userMap[u.id] = `${u.first_name} ${u.last_name}`
  })

  return (
    <ApprovalsClient
      initialUsers={pendingUsers}
      initialProperties={pendingProperties}
      userMap={userMap}
    />
  )
}
