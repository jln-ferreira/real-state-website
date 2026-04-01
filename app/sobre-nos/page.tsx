import type { Metadata } from 'next'
import Layout from '@/components/Layout'
import SobreNosClient from './SobreNosClient'

export const metadata: Metadata = {
  title: 'Sobre Nós — Casa Baccarat',
  description: 'Conheça a Casa Baccarat, uma imobiliária com anos de experiência no mercado, dedicada a encontrar o imóvel perfeito para você e sua família.',
}

export default function SobreNosPage() {
  return (
    <Layout>
      <SobreNosClient />
    </Layout>
  )
}
