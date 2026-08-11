import type { Metadata } from 'next'
import PrintOnDemandClient from '@/components/print-on-demand/PrintOnDemandClient'

export const metadata: Metadata = {
  title: 'Print on Demand — Sans stock, sans risque',
  description: "Lancez votre marque de vêtements sans stock ni avance. Créez, on produit à la commande et on livre. DTF premium, production 48h, Alger — 58 wilayas.",
}

export default function PrintOnDemandPage() {
  return <PrintOnDemandClient />
}
