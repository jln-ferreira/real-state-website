'use client'

import dynamic from 'next/dynamic'

const UserPropertyFormClient = dynamic(() => import('./UserPropertyFormClient'), {
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

export default function UserPropertyFormShell({ user }: { user: UserInfo }) {
  return <UserPropertyFormClient user={user} />
}
