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
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    // py-3 + h-20 = 24px + 80px = 104px unscrolled; py-1 + h-12 = 8px + 48px = 56px scrolled
    document.documentElement.style.setProperty('--header-h', scrolled ? '56px' : '104px')
  }, [scrolled])

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
          'fixed top-0 inset-x-0 z-50 bg-[#6B6B99]',
          'transition-[padding,box-shadow] duration-300 ease-in-out',
          scrolled
            ? 'py-1 shadow-[0_4px_24px_rgba(0,0,0,0.22)]'
            : 'py-3 shadow-[0_2px_12px_rgba(0,0,0,0.12)]',
        ].join(' ')}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

          {/* Logo */}
          <a
            href="/"
            onClick={handleLogoClick}
            className="flex items-center shrink-0"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="Casa Baccarat Imóveis"
              className={[
                'w-auto transition-[height] duration-300 ease-in-out',
                scrolled ? 'h-12' : 'h-20',
              ].join(' ')}
            />
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ label, hash }) => (
              <a
                key={hash}
                href={isHome ? `#${hash}` : `/#${hash}`}
                onClick={e => handleHashNav(e, hash)}
                className="rounded-lg px-4 py-2 text-sm font-light tracking-wide text-white/80
                           hover:text-white hover:bg-white/10 transition-colors"
              >
                {label}
              </a>
            ))}
            <Link
              href="/blog"
              className="rounded-lg px-4 py-2 text-sm font-light tracking-wide text-white/80
                         hover:text-white hover:bg-white/10 transition-colors"
            >
              Blog
            </Link>
            <Link
              href="/register"
              className="ml-3 rounded-xl bg-white px-5 py-2 text-sm font-medium
                         text-[#6B6B99] hover:bg-[#F5F0E8] transition-colors duration-200 shadow-sm"
            >
              Anuncie seu Imóvel
            </Link>
          </nav>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Abrir menu"
            className="md:hidden rounded-lg p-2 text-white hover:bg-white/10 transition-colors"
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
