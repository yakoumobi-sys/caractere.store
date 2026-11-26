import type { Metadata } from 'next'
import Footer from '@/components/layout/Footer'
import CaracteriseHome from '@/components/home/CaracteriseHome'

const title = 'T-shirts, polos et gilets caractérisés en Algérie | Caractère'
const description = 'Un design créé à partir de votre logo, sur T-shirt, polo ou gilet. Simulation gratuite, devis sur WhatsApp et livraison dans les 58 wilayas.'

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: '/' },
  openGraph: {
    title,
    description,
    url: '/',
    type: 'website',
    locale: 'fr_DZ',
    images: ['/images/caracterise/campagne.webp'],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['/images/caracterise/campagne.webp'],
  },
}

export default function Home() {
  return <><CaracteriseHome /><Footer compact /></>
}
