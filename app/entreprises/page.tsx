import type { Metadata } from 'next'
import ConfigurateurClient from '@/components/configurateur/ConfigurateurClient'

export const metadata: Metadata = {
  title: 'Commande entreprise — configurez vos uniformes personnalisés',
  description: "Configurez la commande de votre équipe : uniformes, workwear et goodies personnalisés. Devis en 2h, production 48h, livraison dans les 58 wilayas.",
}

export default function EntreprisesPage() {
  return <ConfigurateurClient variant="b2b" />
}
