import type { Metadata } from 'next'
import { Montserrat, Cormorant_Garamond } from 'next/font/google'
import './globals.css'
import TopLoader from '@/components/TopLoader'
import WhatsAppFloatingButton from '@/components/WhatsAppFloatingButton'

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
  title: 'Casa Baccarat Imóveis . Curadoria de Alto Padrão em Alphaville',
  description: 'Curadoria exclusiva de Imóveis de Alto Padrão em Alphaville e região. Cada imóvel selecionado com olhar de arquiteta - para quem entende que morar bem é uma escolha',
  icons: {
    icon: '/log.png',
    shortcut: '/log.png',
    apple: '/log.png',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${montserrat.variable} ${cormorant.variable}`}>
      <head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=AW-18349549812" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'AW-18349549812');
            `,
          }}
        />
      </head>
      <body className="antialiased">
        <TopLoader />
        {children}
        <WhatsAppFloatingButton />
      </body>
    </html>
  )
}
