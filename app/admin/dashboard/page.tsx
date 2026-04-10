import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { getProperties } from '@/lib/properties'
import { getPosts } from '@/lib/posts'
import { getAuditLog } from '@/lib/audit'
import { getContactMessages } from '@/lib/contacts'
import { getWhatsAppClicks } from '@/lib/whatsapp'
import { getAllUsers } from '@/lib/users'
import DashboardClient from './DashboardClient'

export default async function DashboardPage() {
  const session = await auth()
  if (!session) redirect('/admin/login')

  const [properties, posts, auditLog, contactMessages, whatsappClicks, allUsers] = await Promise.all([
    getProperties(),
    getPosts(),
    getAuditLog(20),
    getContactMessages(),
    getWhatsAppClicks(),
    getAllUsers(),
  ])

  const userMap: Record<string, string> = {}
  allUsers.forEach(u => { userMap[u.id] = `${u.first_name} ${u.last_name}` })

  return (
    <DashboardClient
      properties={properties}
      posts={posts}
      auditLog={auditLog as any[]}
      contactMessages={contactMessages}
      whatsappClicks={whatsappClicks}
      userMap={userMap}
    />
  )
}
