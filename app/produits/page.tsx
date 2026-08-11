import type { Metadata } from 'next'
import ProduitsClient from '@/components/produits/ProduitsClient'

export const metadata: Metadata = {
  title: 'Produits — T-shirts, Polos, Uniformes',
  description: 'T-shirts, polos, sweats, casquettes, uniformes — DTF ou broderie, de 1 à 10 000 pièces. Simulation et devis gratuits.',
}

export default function ProduitsPage() {
  return <ProduitsClient />
}
