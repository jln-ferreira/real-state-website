import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'EstateFind — Real Estate Catalog',
  description: 'Find your perfect property. Browse thousands of listings with interactive maps and smart filters.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-slate-900 antialiased">
        {children}
      </body>
    </html>
  )
}
