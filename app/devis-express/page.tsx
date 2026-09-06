import type { Metadata } from 'next'
import DevisExpressClient from '@/components/devis-express/DevisExpressClient'

export const metadata: Metadata = {
  title: 'Devis express — Votre prix en quelques minutes',
  description:
    "Recevez un devis personnalisé en quelques minutes : t-shirts, polos, casquettes et textiles personnalisés. Envoyez votre logo, on vous rappelle. Alger — 58 wilayas.",
  alternates: { canonical: '/devis-express' },
  openGraph: {
    title: 'Devis express — Caractère Store',
    description: "Envoyez votre logo et votre quantité, recevez votre prix en quelques minutes.",
    url: '/devis-express',
  },
}

export default function DevisExpressPage() {
  return <DevisExpressClient />
}
