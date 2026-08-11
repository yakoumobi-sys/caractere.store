import type { Metadata } from 'next'
import AvisClient from '@/components/avis/AvisClient'

// Wrapper serveur pour exposer un title/description propres
// (le contenu réel est un composant client, qui ne peut pas exporter `metadata`).
export const metadata: Metadata = {
  title: 'Avis clients',
  description: 'Donnez votre avis sur Caractère Store, ou découvrez ce que nos clients pensent de nos produits et de notre service.',
}

export default function AvisPage() {
  return <AvisClient />
}
