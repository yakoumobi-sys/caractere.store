import type { Metadata } from 'next'
import HomeChooser from '@/components/home/HomeChooser'

// Accueil — wrapper serveur pour exposer un title/description propres
// (le contenu réel est un composant client, qui ne peut pas exporter `metadata`).
export const metadata: Metadata = {
  // Titre absolu (pas de suffixe du template racine) — le template ne
  // s'applique pas à la page du même segment que le layout qui le définit.
  title: 'Caractère Store — Vêtements personnalisés à Alger',
  description: 'Uniformes d\'entreprise, print on demand, promos et catalogue. DTF et broderie, de 1 à 10 000 pièces, livraison dans les 58 wilayas.',
}

export default function Home() {
  return <HomeChooser />
}
