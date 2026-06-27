import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap', weight: ['300','400','500','600','700'] })

export const metadata: Metadata = {
  title: 'Caractere Store — Personnalisation Textile',
  description: 'Vetements personnalises, DTF, broderie — de 1 a 10 000 pieces. Simulation et devis gratuits. Alger, Algerie.',
  icons: {
    icon: 'https://aijlvbipvqnvbywxhlbd.supabase.co/storage/v1/object/public/image/logo.jpg',
    apple: 'https://aijlvbipvqnvbywxhlbd.supabase.co/storage/v1/object/public/image/logo.jpg',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={inter.variable}>
      <body className="font-sans bg-[#0C4A6E]">{children}</body>
    </html>
  )
}
