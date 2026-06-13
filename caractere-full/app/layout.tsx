import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap', weight: ['300','400','500','600','700'] })

export const metadata: Metadata = {
  title: 'Caractère Store — Impression & Broderie Professionnelle',
  description: 'Broderie, DTF, uniformes pour entreprises. Devis gratuit sous 24h. Alger, Algérie.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={inter.variable}>
      <body className="font-sans">{children}</body>
    </html>
  )
}
