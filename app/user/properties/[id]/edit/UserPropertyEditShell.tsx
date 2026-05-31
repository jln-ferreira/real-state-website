'use client'

import dynamic from 'next/dynamic'
import type { Property } from '@/data/properties'

const UserPropertyEditClient = dynamic(() => import('./UserPropertyEditClient'), {
  ssr: false,
  loading: () => (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-[#E6E6EF] p-6">
      <p className="text-sm text-[#6B6B99]">Carregando formulario...</p>
    </div>
  ),
})

interface UserInfo {
  name: string
  phone: string
  email: string
}

export default function UserPropertyEditShell({ property, user }: { property: Property; user: UserInfo }) {
  return <UserPropertyEditClient property={property} user={user} />
}
