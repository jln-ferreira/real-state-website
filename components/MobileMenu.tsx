'use client'

import { useEffect } from 'react'

const NAV_LINKS = [
  { label: 'Início',   href: '#home' },
  { label: 'Anúncios', href: '#listings' },
  { label: 'Contato',  href: '#contact' },
]

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  // Lock body scroll while menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    onClose()
    // Small delay so the drawer closes before scrolling
    setTimeout(() => {
      if (href === '#home') {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
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
          'fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300',
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        ].join(' ')}
      />

      {/* Slide-in panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navegação"
        className={[
          'fixed top-0 right-0 z-50 h-full w-72 bg-white shadow-2xl',
          'flex flex-col transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : 'translate-x-full',
        ].join(' ')}
      >
        {/* Panel header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <span className="text-lg font-bold tracking-tight text-slate-900">
            Casa <span className="text-[#1a56db]">Baccarat</span>
          </span>
          <button
            onClick={onClose}
            aria-label="Fechar menu"
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-4 py-6">
          <ul className="space-y-1">
            {NAV_LINKS.map(({ label, href }) => (
              <li key={href}>
                <a
                  href={href}
                  onClick={e => handleLinkClick(e, href)}
                  className="flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium text-slate-700
                             hover:bg-slate-50 hover:text-[#1a56db] transition-colors"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* CTA */}
        <div className="px-6 pb-8">
          <a
            href="#listings"
            onClick={e => handleLinkClick(e, '#listings')}
            className="block w-full rounded-xl bg-[#1a56db] px-4 py-3 text-center
                       text-sm font-semibold text-white hover:bg-[#1e429f] transition-colors"
          >
            Ver Imóveis
          </a>
        </div>
      </div>
    </>
  )
}
