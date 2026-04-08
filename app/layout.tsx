import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import './globals.css'

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400'],
  variable: '--font-montserrat',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Casa Baccarat — Catálogo de Imóveis',
  description: 'Encontre o imóvel perfeito. Explore milhares de anúncios com mapas interativos e filtros inteligentes.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={montserrat.variable}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
