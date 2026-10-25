import type { Metadata } from 'next'
import PrintOnDemandClient from '@/components/print-on-demand/PrintOnDemandClient'

export const metadata: Metadata = {
  title: { absolute: 'Print on Demand Algérie | Caractère' },
  description: "Lancez votre marque textile en Algérie sans gérer de stock. Testez vos modèles, produisez à la demande en DTF ou broderie et demandez un devis gratuit.",
  alternates: { canonical: '/print-on-demand' },
  openGraph: {
    title: 'Print on Demand Algérie | Caractère',
    description: "Créez votre marque de vêtements en Algérie sans stock : production textile à la demande en DTF ou broderie.",
    url: 'https://www.caracteredz.com/print-on-demand',
    type: 'website',
    locale: 'fr_DZ',
    images: ['https://aijlvbipvqnvbywxhlbd.supabase.co/storage/v1/object/public/image/logo.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Print on Demand Algérie | Caractère',
    description: "Lancez votre marque textile en Algérie, testez vos produits et produisez à la demande.",
    images: ['https://aijlvbipvqnvbywxhlbd.supabase.co/storage/v1/object/public/image/logo.jpg'],
  },
}

export default function PrintOnDemandPage() {
  return <PrintOnDemandClient />
}
