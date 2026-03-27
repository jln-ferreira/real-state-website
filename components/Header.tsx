'use client'

import { useState } from 'react'
import MobileMenu from './MobileMenu'

const NAV_LINKS = [
  { label: 'Home',     href: '#home' },
  { label: 'Map',      href: '#map' },
  { label: 'Listings', href: '#listings' },
  { label: 'Contact',  href: '#contact' },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    if (href === '#home') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-30 bg-white shadow-sm border-b border-slate-100">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

          {/* Logo */}
          <a
            href="#home"
            onClick={e => handleNavClick(e, '#home')}
            className="flex items-center gap-2 shrink-0"
          >
            <svg className="h-7 w-7 text-[--color-brand]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              Estate<span className="text-[--color-brand]">Find</span>
            </span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ label, href }) => (
              <a
                key={href}
                href={href}
                onClick={e => handleNavClick(e, href)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600
                           hover:text-[--color-brand] hover:bg-slate-50 transition-colors"
              >
                {label}
              </a>
            ))}
            <a
              href="#listings"
              onClick={e => handleNavClick(e, '#listings')}
              className="ml-3 rounded-xl bg-[--color-brand] px-4 py-2 text-sm font-semibold
                         text-white hover:bg-[--color-brand-dark] transition-colors shadow-sm"
            >
              Browse Listings
            </a>
          </nav>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            className="md:hidden rounded-lg p-2 text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>
      </header>

      <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  )
}
