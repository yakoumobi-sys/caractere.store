import type { Metadata } from 'next'
import SimulationForm from './SimulationForm'

export const metadata: Metadata = {
  title: 'Votre simulation gratuite',
  description: 'Ajoutez votre logo et demandez votre simulation gratuite sur WhatsApp. Polos, t-shirts et tenues personnalisées par Caractère.',
  alternates: { canonical: 'https://www.caracteredz.com/simulation' },
  openGraph: {
    title: 'Votre logo mérite du caractère.',
    description: 'Votre logo. Nos vêtements. Demandez votre simulation gratuite.',
    url: 'https://www.caracteredz.com/simulation',
    images: [{ url: '/home-cutouts/polo.png' }],
  },
}

export default function SimulationPage() {
  return <SimulationForm />
}
