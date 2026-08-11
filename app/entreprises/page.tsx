import type { Metadata } from 'next'
import EntreprisesClient from '@/components/entreprises/EntreprisesClient'

export const metadata: Metadata = {
  title: 'Uniformes & Branding B2B — Entreprises',
  description: 'Uniformes de qualité en 48h pour restaurants, cliniques et chantiers en Algérie. Maquette gratuite, photos de contrôle avant livraison, garantie zéro risque.',
}

export default function EntreprisePage() {
  return <EntreprisesClient />
}
