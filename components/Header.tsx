'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import MobileMenu from './MobileMenu'

const NAV_LINKS = [
  { label: 'Início',   hash: 'home'     },
  { label: 'Anúncios', hash: 'listings'  },
  { label: 'Contato',  hash: 'contact'   },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const isHome   = pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    // Set initial state in case the page loads mid-scroll
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function handleHashNav(e: React.MouseEvent<HTMLAnchorElement>, hash: string) {
    if (!isHome) return
    e.preventDefault()
    if (hash === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  function handleLogoClick(e: React.MouseEvent<HTMLAnchorElement>) {
    if (isHome) {
      e.preventDefault()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <>
      <header
        className={[
          'fixed top-0 inset-x-0 z-30 bg-white',
          'transition-[padding,box-shadow] duration-300 ease-in-out',
          scrolled
            ? 'py-0 shadow-[0_1px_0_0_#E6E6EF]'
            : 'py-3 shadow-[0_4px_24px_rgba(0,0,0,0.06)]',
        ].join(' ')}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

          {/* Logo */}
          <a
            href="/"
            onClick={handleLogoClick}
            className="flex items-center gap-2 shrink-0"
          >
            <svg className="h-7 w-7 text-[#6D6D85]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            <span className="text-xl font-bold tracking-tight text-[#2E2E3A]">
              Casa <span className="text-[#6D6D85]">Baccarat</span>
            </span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ label, hash }) => (
              <a
                key={hash}
                href={isHome ? `#${hash}` : `/#${hash}`}
                onClick={e => handleHashNav(e, hash)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-[#6D6D85]
                           hover:text-[#4F4F6B] hover:bg-[#F7F7FA] transition-colors"
              >
                {label}
              </a>
            ))}
            <Link
              href="/blog"
              className="rounded-lg px-3 py-2 text-sm font-medium text-[#6D6D85]
                         hover:text-[#4F4F6B] hover:bg-[#F7F7FA] transition-colors"
            >
              Blog
            </Link>
            <a
              href={isHome ? '#listings' : '/#listings'}
              onClick={e => handleHashNav(e, 'listings')}
              className="ml-3 rounded-xl bg-[#6D6D85] px-4 py-2 text-sm font-semibold
                         text-white hover:bg-[#585874] transition-colors duration-200 shadow-sm"
            >
              Ver Imóveis
            </a>
          </nav>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Abrir menu"
            className="md:hidden rounded-lg p-2 text-[#6D6D85] hover:bg-[#F7F7FA] transition-colors"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>
      </header>

      <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} isHome={isHome} />
    </>
  )
}
