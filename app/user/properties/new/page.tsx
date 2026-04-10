import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import UserPropertyFormClient from './UserPropertyFormClient'

export const dynamic = 'force-dynamic'

export default async function NewUserPropertyPage() {
  const session = await auth()
  if (!session?.user || (session.user as any).role !== 'user') {
    redirect('/login')
  }
  return <UserPropertyFormClient />
}
