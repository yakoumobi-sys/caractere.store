import type { Metadata } from 'next'
import DevisExpressClient from '@/components/devis-express/DevisExpressClient'

export const metadata: Metadata = {
  title: 'Devis express — Votre projet textile sur mesure',
  description:
    "Demandez un devis gratuit pour vos t-shirts, polos, casquettes et textiles personnalisés. Envoyez votre logo, on vous rappelle. Alger — 58 wilayas.",
  alternates: { canonical: '/devis-express' },
  openGraph: {
    title: 'Devis express — Caractère Store',
    description: "Envoyez votre logo et votre quantité. Notre équipe vous recontacte avec un devis adapté.",
    url: '/devis-express',
  },
}

export default function DevisExpressPage() {
  return <DevisExpressClient />
}
