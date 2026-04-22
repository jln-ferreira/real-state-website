'use client'

import { useEffect } from 'react'
import Link from 'next/link'

const NAV_LINKS = [
  { label: 'Início',  hash: 'home'     },
  { label: 'Imóveis', hash: 'listings'  },
]

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  isHome: boolean
}

export default function MobileMenu({ isOpen, onClose, isHome }: MobileMenuProps) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  function handleHashNav(e: React.MouseEvent<HTMLAnchorElement>, hash: string) {
    onClose()
    if (!isHome) return // let href="/#hash" navigate normally
    e.preventDefault()
    setTimeout(() => {
      if (hash === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' })
      }
    }, 150)
  }

  return (
    <>
      {/* Overlay */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={[
          'fixed inset-0 z-60 bg-black/40 backdrop-blur-sm transition-opacity duration-300',
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        ].join(' ')}
      />

      {/* Slide-in panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navegação"
        className={[
          'fixed top-0 right-0 z-70 h-full w-72 bg-white',
          'flex flex-col transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : 'translate-x-full',
        ].join(' ')}
      >
        {/* Panel header */}
        <div className="flex items-center justify-between bg-[#6B6B99] px-6 py-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Casa Baccarat Imóveis" className="h-20 w-auto" />
          <button
            onClick={onClose}
            aria-label="Fechar menu"
            className="rounded-lg p-2 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-4 py-6">
          <ul className="space-y-1">
            {NAV_LINKS.map(({ label, hash }) => (
              <li key={hash}>
                <a
                  href={isHome ? `#${hash}` : `/#${hash}`}
                  onClick={e => handleHashNav(e, hash)}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium text-[#6B6B99]
                             hover:bg-[#F5F0E8] hover:text-[#4E6B5E] transition-colors"
                >
                  {label}
                </a>
              </li>
            ))}
            <li>
              <Link
                href="/sobre-nos"
                onClick={onClose}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium text-[#6B6B99]
                           hover:bg-[#F5F0E8] hover:text-[#4E6B5E] transition-colors"
              >
                Sobre
              </Link>
            </li>
            <li>
              <Link
                href="/blog"
                onClick={onClose}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium text-[#6B6B99]
                           hover:bg-[#F5F0E8] hover:text-[#4E6B5E] transition-colors"
              >
                Blog
              </Link>
            </li>
            <li>
              <a
                href={isHome ? '#contact' : '/#contact'}
                onClick={e => handleHashNav(e, 'contact')}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium text-[#6B6B99]
                           hover:bg-[#F5F0E8] hover:text-[#4E6B5E] transition-colors"
              >
                Contato
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </>
  )
}
