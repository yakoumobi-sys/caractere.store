import type { Metadata } from 'next'
import HomeClient from '@/components/home/HomeClient'

// Page d'accueil — wrapper serveur pour exposer un title/description propres
// (le contenu réel est un composant client, qui ne peut pas exporter `metadata`).
export const metadata: Metadata = {
  // Titre absolu (pas de suffixe du template racine) — le template ne
  // s'applique pas à la page du même segment que le layout qui le définit.
  title: 'Votre marque en 48h • Caractère Store',
  description: 'Vêtements personnalisés, DTF, broderie, uniformes — de 1 à 10 000 pièces. Designer 3D gratuit, devis en 2h. Alger, Algérie.',
}

export default function Home() {
  return <HomeClient />
}
