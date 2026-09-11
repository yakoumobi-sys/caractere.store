import type { Metadata } from 'next'
import { Inter, Oswald } from 'next/font/google'
import './globals.css'
import { JsonLd, jsonLdGraph, organizationLd, localBusinessLd, SITE_URL, LOGO_URL } from '@/lib/seo'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap', weight: ['300','400','500','600','700'] })

// Titres condensés. `latin-ext` est obligatoire ici : sans lui, le È de
// CARACTÈRE retombe sur une police de secours et casse le mot dans le hero.
const display = Oswald({ subsets: ['latin', 'latin-ext'], variable: '--font-display', display: 'swap', weight: ['400','500','600','700'] })

const DEFAULT_DESCRIPTION = 'Vêtements personnalisés, DTF, broderie — de 1 à 10 000 pièces. Simulation et devis gratuits. Alger, Algérie.'
const OG_IMAGE = LOGO_URL

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Caractère Store — Personnalisation Textile',
    // Pages qui définissent leur propre `title` (string court) l'insèrent ici ;
    // celles qui n'en définissent pas gardent le titre par défaut ci-dessus.
    template: '%s • Caractère Store',
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: 'Caractère Store',
  // Canonique par défaut : chaque page qui a sa propre URL la surcharge via
  // `alternates.canonical`. Évite que www/non-www et les paramètres de
  // campagne créent des doublons aux yeux de Google.
  alternates: { canonical: '/' },
  // Autorise les extraits longs et les grandes vignettes : c'est ce qui
  // alimente les résultats enrichis et les citations des moteurs IA.
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large', 'max-video-preview': -1 },
  },
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
    <html lang="fr" className={`${inter.variable} ${display.variable}`}>
      <head>
        {/* Identité de l'entreprise sur toutes les pages : c'est ce bloc que
            Google et les assistants IA lisent pour savoir qui publie le site. */}
        <JsonLd data={jsonLdGraph(organizationLd, localBusinessLd)} />
      </head>
      <body className="font-sans">{children}</body>
    </html>
  )
}
