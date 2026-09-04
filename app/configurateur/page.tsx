import type { Metadata } from 'next'
import ConfigurateurClient from '@/components/configurateur/ConfigurateurClient'

export const metadata: Metadata = {
  title: 'Configurateur de commande — personnalisez votre textile',
  description: "Choisissez votre produit, vos couleurs, vos tailles et envoyez votre logo. Devis instantané, production 48h, livraison dans les 58 wilayas.",
}

export default function ConfigurateurPage() {
  return <ConfigurateurClient />
}
