import type { Metadata } from 'next'
import ProduitsClient from '@/components/produits/ProduitsClient'

export const metadata: Metadata = {
  title: { absolute: 'T-shirts, polos et uniformes personnalisés | Caractère' },
  description: 'Découvrez nos t-shirts, polos, casquettes et uniformes personnalisables en Algérie : impression DTF, broderie, simulation et devis gratuits.',
  alternates: { canonical: '/produits' },
  openGraph: {
    title: 'T-shirts, polos et uniformes personnalisés | Caractère',
    description: 'Catalogue de vêtements personnalisables en Algérie : t-shirts, polos, casquettes, uniformes et impression DTF ou broderie.',
    url: 'https://www.caracteredz.com/produits',
    type: 'website',
    locale: 'fr_DZ',
    images: ['https://aijlvbipvqnvbywxhlbd.supabase.co/storage/v1/object/public/image/logo.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'T-shirts, polos et uniformes personnalisés | Caractère',
    description: 'Découvrez les t-shirts, polos, casquettes et uniformes personnalisables de Caractère.',
    images: ['https://aijlvbipvqnvbywxhlbd.supabase.co/storage/v1/object/public/image/logo.jpg'],
  },
}

export default function ProduitsPage() {
  return <ProduitsClient />
}
