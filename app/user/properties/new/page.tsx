import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { getUserById } from '@/lib/users'
import UserPropertyFormClient from './UserPropertyFormClient'

export const dynamic = 'force-dynamic'
export const maxDuration = 30

export default async function NewUserPropertyPage() {
  const session = await auth()
  if (!session?.user || (session.user as any).role !== 'user') {
    redirect('/login')
  }

  const userId = (session.user as any).userId as string
  const dbUser = await getUserById(userId).catch(() => null)

  const user = {
    name: dbUser ? `${dbUser.first_name} ${dbUser.last_name}` : (session.user.name ?? ''),
    phone: dbUser?.phone ?? '',
    email: dbUser?.email ?? (session.user.email ?? ''),
  }

  return <UserPropertyFormClient user={user} />
}
