'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  return (
    <div className="flex h-screen overflow-hidden bg-neutral-50">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-[#1E3A5F] text-white flex flex-col">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-2">
            <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            <div>
              <p className="font-bold text-sm leading-tight">EstateFind</p>
              <p className="text-[10px] text-white/50 leading-tight">Admin Panel</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 px-3 mb-2">Menu</p>
          {[
            { label: 'Dashboard', href: '/admin' },
            { label: 'Properties', href: '/admin/properties' },
            { label: 'Add Property', href: '/admin/properties/new' },
            { label: 'Audit Log', href: '/admin/audit' },
          ].map(item => (
            <Link
              key={item.href}
              href={item.href}
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
            Sign out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  )
}
