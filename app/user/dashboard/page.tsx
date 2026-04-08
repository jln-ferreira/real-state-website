import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { getProperties } from '@/lib/properties'
import UserDashboardClient from './UserDashboardClient'

export default async function UserDashboardPage() {
  const session = await auth()
  if (!session?.user || (session.user as any).role !== 'user') {
    redirect('/login')
  }

  const userId = (session.user as any).userId as string
  const allProperties = await getProperties()
  const userProperties = allProperties.filter(p => p.ownerId === userId)

  return <UserDashboardClient properties={userProperties} />
}
