'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'

const NAV_ITEMS = [
  { label: 'Painel',           href: '/admin' },
  { label: 'Log de Auditoria', href: '/admin/audit' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  return (
    <div className="flex h-screen overflow-hidden bg-neutral-50">

      {/* ── Mobile overlay ─────────────────────────────────────────────────── */}
      {open && (
        <div
          aria-hidden="true"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
        />
      )}

      {/* ── Sidebar ────────────────────────────────────────────────────────── */}
      <aside className={[
        'fixed inset-y-0 left-0 z-40 w-64 flex-shrink-0 bg-[#1E3A5F] text-white flex flex-col',
        'transition-transform duration-300 ease-in-out',
        'md:static md:translate-x-0',
        open ? 'translate-x-0' : '-translate-x-full',
      ].join(' ')}>

        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            <div>
              <p className="font-bold text-sm leading-tight">Casa Baccarat</p>
              <p className="text-[10px] text-white/50 leading-tight">Painel Admin</p>
            </div>
          </div>
          {/* Close button — mobile only */}
          <button
            onClick={() => setOpen(false)}
            className="md:hidden text-white/60 hover:text-white transition-colors"
            aria-label="Fechar menu"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 px-3 mb-2">Menu</p>
          {NAV_ITEMS.map(item => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/70 hover:bg-white/5 hover:text-white text-sm transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm font-bold flex-shrink-0">A</div>
          <span className="text-sm font-medium flex-1">Admin</span>
          <button
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            className="text-white/60 hover:text-white transition-colors text-xs"
          >
            Sair
          </button>
        </div>
      </aside>

      {/* ── Main area ──────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* Mobile top bar */}
        <header className="md:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-neutral-100 flex-shrink-0">
          <button
            onClick={() => setOpen(true)}
            aria-label="Abrir menu"
            className="p-2 rounded-lg text-neutral-600 hover:bg-neutral-100 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5 text-[#1E3A5F]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            <span className="font-bold text-sm text-[#1E3A5F]">Casa Baccarat Admin</span>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</div>
      </div>
    </div>
  )
}
