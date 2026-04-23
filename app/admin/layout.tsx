'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import NextTopLoader from 'nextjs-toploader'

const NAV_ITEMS = [
  {
    label: 'Dashboard',
    href: '/admin/dashboard',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    ),
  },
  {
    label: 'Imóveis',
    href: '/admin/properties',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
    ),
  },
  {
    label: 'Blog',
    href: '/admin/blog',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
      </svg>
    ),
  },
  {
    label: 'Aprovações',
    href: '/admin/approvals',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
  },
  {
    label: 'Log de Auditoria',
    href: '/admin/audit',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
      </svg>
    ),
  },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [pendingCount, setPendingCount] = useState(0)

  useEffect(() => {
    const saved = localStorage.getItem('admin-sidebar-collapsed')
    if (saved === 'true') setCollapsed(true)
  }, [])

  function toggleCollapsed() {
    setCollapsed(c => {
      localStorage.setItem('admin-sidebar-collapsed', String(!c))
      return !c
    })
  }

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/approvals/users').then(r => r.ok ? r.json() : []),
      fetch('/api/admin/approvals/properties').then(r => r.ok ? r.json() : []),
    ]).then(([users, properties]) => {
      const pendingUsers = Array.isArray(users) ? users.filter((u: any) => u.status === 'pending').length : 0
      const pendingProps = Array.isArray(properties) ? properties.length : 0
      setPendingCount(pendingUsers + pendingProps)
    }).catch(() => {})
  }, [pathname])

  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  return (
    <>
    <NextTopLoader
      color="#6D6D85"
      height={3}
      showSpinner={false}
      easing="ease"
      speed={250}
      shadow="0 0 10px #6D6D85, 0 0 5px #6D6D85"
    />
    <div className="flex h-screen overflow-hidden bg-[#F7F7FA]">

      {/* ── Mobile overlay ─────────────────────────────────────────────────── */}
      {open && (
        <div
          aria-hidden="true"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-30 bg-black/30 md:hidden"
        />
      )}

      {/* ── Sidebar ─────────────────────────────────────────────────────────── */}
      <aside className={[
        'fixed inset-y-0 left-0 z-40 w-60 flex-shrink-0 bg-white flex flex-col',
        'transition-all duration-300 ease-in-out',
        open ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
        collapsed ? 'md:w-14' : 'md:w-60',
      ].join(' ')}
        style={{ borderRight: '1px solid #E6E6EF' }}
      >
        {/* Logo row */}
        <div className="h-14 flex items-center justify-between px-4 flex-shrink-0"
             style={{ borderBottom: '1px solid #E6E6EF' }}>
          <div className={['flex items-center gap-2.5 min-w-0 transition-all duration-300', collapsed ? 'md:hidden' : ''].join(' ')}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Casa Baccarat" className="h-8 w-auto rounded-lg flex-shrink-0" />
            <p className="text-[10px] font-semibold text-[#A3A3C2] leading-tight truncate">Painel Admin</p>
          </div>
          {/* Collapsed: centred logo */}
          <div className={['hidden items-center justify-center w-full', collapsed ? 'md:flex' : ''].join(' ')}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Casa Baccarat" className="h-8 w-auto rounded-lg" />
          </div>
          {/* Mobile close */}
          <button onClick={() => setOpen(false)} className="md:hidden text-[#A3A3C2] hover:text-[#6D6D85] transition-colors" aria-label="Fechar menu">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          {/* Desktop collapse */}
          <button onClick={toggleCollapsed} className={['hidden md:block text-[#A3A3C2] hover:text-[#6D6D85] transition-colors', collapsed ? 'md:hidden' : ''].join(' ')} aria-label="Recolher menu">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
        </div>

        {/* Expand button (desktop, collapsed only) */}
        <button
          onClick={toggleCollapsed}
          className={['hidden items-center justify-center py-2.5 text-[#A3A3C2] hover:text-[#6D6D85] hover:bg-[#F7F7FA] transition-colors', collapsed ? 'md:flex' : ''].join(' ')}
          style={{ borderBottom: '1px solid #E6E6EF' }}
          aria-label="Expandir menu"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>

        {/* Nav */}
        <nav className="flex-1 py-4 space-y-0.5 overflow-y-auto px-3">
          <p className={['text-[10px] font-bold uppercase tracking-widest text-[#A3A3C2] px-3 mb-3', collapsed ? 'md:hidden' : ''].join(' ')}>
            Menu
          </p>
          {NAV_ITEMS.map(item => {
            const active = pathname.startsWith(item.href)
            const showBadge = item.href === '/admin/approvals' && pendingCount > 0
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                title={collapsed ? item.label : undefined}
                className={[
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors duration-150',
                  collapsed ? 'md:justify-center md:px-0' : '',
                  active
                    ? 'bg-[#6D6D85]/10 text-[#4F4F6B] font-semibold'
                    : 'text-[#6D6D85] hover:bg-[#F7F7FA] hover:text-[#4F4F6B]',
                ].join(' ')}
              >
                <span className={['relative flex-shrink-0', active ? 'text-[#6D6D85]' : 'text-[#A3A3C2]'].join(' ')}>
                  {item.icon}
                  {showBadge && collapsed && (
                    <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-red-500" />
                  )}
                </span>
                <span className={['flex-1', collapsed ? 'md:hidden' : ''].join(' ')}>{item.label}</span>
                {showBadge && !collapsed && (
                  <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* User area */}
        <div className="p-4 flex items-center gap-3"
             style={{ borderTop: '1px solid #E6E6EF', background: '#F7F7FA' }}>
          <button
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            title={collapsed ? 'Sair' : undefined}
            className="w-8 h-8 rounded-full bg-[#6D6D85]/15 flex items-center justify-center text-sm font-bold text-[#4F4F6B] flex-shrink-0 hover:bg-[#6D6D85]/25 transition-colors"
          >
            A
          </button>
          <span className={['text-sm font-medium text-[#2E2E3A] flex-1', collapsed ? 'md:hidden' : ''].join(' ')}>Admin</span>
          <button
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            className={['text-[#A3A3C2] hover:text-[#6D6D85] transition-colors text-xs', collapsed ? 'md:hidden' : ''].join(' ')}
          >
            Sair
          </button>
        </div>
      </aside>

      {/* ── Main area ──────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* Mobile top bar */}
        <header className="md:hidden flex items-center gap-3 px-4 py-3 bg-white flex-shrink-0"
                style={{ borderBottom: '1px solid #E6E6EF' }}>
          <button
            onClick={() => setOpen(true)}
            aria-label="Abrir menu"
            className="p-2 rounded-xl text-[#6D6D85] hover:bg-[#F7F7FA] transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Casa Baccarat" className="h-7 w-auto rounded-md" />
            <span className="font-semibold text-sm text-[#A3A3C2]">Admin</span>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div key={pathname} className="animate-page-in">{children}</div>
        </div>
      </div>
    </div>
    </>
  )
}
