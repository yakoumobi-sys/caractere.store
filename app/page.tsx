import type { Metadata } from 'next'
import HomeChooser from '@/components/home/HomeChooser'

// Accueil — wrapper serveur pour exposer un title/description propres
// (le contenu réel est un composant client, qui ne peut pas exporter `metadata`).
export const metadata: Metadata = {
  // Titre absolu (pas de suffixe du template racine) — le template ne
  // s'applique pas à la page du même segment que le layout qui le définit.
  title: 'Caractère — Portez votre identité. Textile personnalisé à Alger',
  description: 'Votre marque, votre équipe, votre identité. T-shirts, polos et vêtements de travail personnalisés à Alger. DTF et broderie dès 1 pièce. Devis gratuit.',
}

export default function Home() {
  return <HomeChooser />
}
