import type { Metadata } from 'next'
import { Montserrat, Cormorant_Garamond } from 'next/font/google'
import './globals.css'
import TopLoader from '@/components/TopLoader'

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400'],
  variable: '--font-montserrat',
  display: 'swap',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400'],
  variable: '--font-monument',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Casa Baccarat — Catálogo de Imóveis',
  description: 'Encontre o imóvel perfeito. Explore milhares de anúncios com mapas interativos e filtros inteligentes.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${montserrat.variable} ${cormorant.variable}`}>
      <body className="antialiased">
        <TopLoader />
        {children}
      </body>
    </html>
  )
}
