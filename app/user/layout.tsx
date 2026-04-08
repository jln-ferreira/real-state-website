'use client'

import Link from 'next/link'
import { signOut } from 'next-auth/react'

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F7F7FA]">
      {/* Header */}
      <header className="bg-white border-b border-[#E6E6EF] sticky top-0 z-40">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 flex items-center justify-between h-14">
          <Link href="/user/dashboard" className="flex items-center gap-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Casa Baccarat" className="h-9 w-auto" />
            <span className="text-xs font-semibold text-[#A3A3C2] hidden sm:block">Minha Conta</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/user/dashboard"
              className="text-sm text-[#6B6B99] hover:text-[#4F4F6B] font-medium transition-colors"
            >
              Meus Imóveis
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="text-xs text-[#A3A3C2] hover:text-[#6B6B99] transition-colors border border-[#E6E6EF] rounded-lg px-3 py-1.5"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
        {children}
      </main>
    </div>
  )
}
