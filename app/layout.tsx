import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Casa Baccarat — Catálogo de Imóveis',
  description: 'Encontre o imóvel perfeito. Explore milhares de anúncios com mapas interativos e filtros inteligentes.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="bg-white text-slate-900 antialiased">
        {children}
      </body>
    </html>
  )
}
