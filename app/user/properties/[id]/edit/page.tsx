import { auth } from '@/auth'
import { redirect, notFound } from 'next/navigation'
import { getPropertyById } from '@/lib/properties'
import { getUserById } from '@/lib/users'
import UserPropertyEditClient from './UserPropertyEditClient'

export const dynamic = 'force-dynamic'
export const maxDuration = 30

export default async function EditUserPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user || (session.user as any).role !== 'user') {
    redirect('/login')
  }

  const { id } = await params
  const userId = (session.user as any).userId as string

  const property = await getPropertyById(id).catch(() => null)
  if (!property) notFound()
  if (property.ownerId !== userId) notFound()

  const dbUser = await getUserById(userId).catch(() => null)
  const user = {
    name: dbUser ? `${dbUser.first_name} ${dbUser.last_name}` : (session.user.name ?? ''),
    phone: dbUser?.phone ?? '',
    email: dbUser?.email ?? (session.user.email ?? ''),
  }

  return <UserPropertyEditClient property={property} user={user} />
}
