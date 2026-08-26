import type { Metadata } from 'next'
import BackToSchoolClient from '@/components/back-to-school/BackToSchoolClient'

export const metadata: Metadata = {
  title: 'Back to School — Packs & promotions rentrée | Caractère',
  description: "Tepyach pour la rentrée : packs et promotions Caractère. Jogger Pack — 2 baggy joggers à 4 900 DA. Livraison 58 wilayas.",
}

export default function BackToSchoolPage() {
  return <BackToSchoolClient />
}
