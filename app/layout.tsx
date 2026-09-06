import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap', weight: ['300','400','500','600','700'] })

const SITE_URL = 'https://www.caracteredz.com'
const DEFAULT_DESCRIPTION = 'Vêtements personnalisés, DTF, broderie — de 1 à 10 000 pièces. Simulation et devis gratuits. Alger, Algérie.'
const OG_IMAGE = 'https://aijlvbipvqnvbywxhlbd.supabase.co/storage/v1/object/public/image/logo.jpg'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Caractère Store — Personnalisation Textile',
    // Pages qui définissent leur propre `title` (string court) l'insèrent ici ;
    // celles qui n'en définissent pas gardent le titre par défaut ci-dessus.
    template: '%s • Caractère Store',
  },
  description: DEFAULT_DESCRIPTION,
  icons: {
    icon: OG_IMAGE,
    apple: OG_IMAGE,
  },
  openGraph: {
    type: 'website',
    locale: 'fr_DZ',
    siteName: 'Caractère Store',
    title: 'Caractère Store — Personnalisation Textile',
    description: DEFAULT_DESCRIPTION,
    images: [{ url: OG_IMAGE }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Caractère Store — Personnalisation Textile',
    description: DEFAULT_DESCRIPTION,
    images: [OG_IMAGE],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={inter.variable}>
      <body className="font-sans bg-[#0C4A6E]">{children}</body>
    </html>
  )
}
