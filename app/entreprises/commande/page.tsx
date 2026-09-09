import type { Metadata } from 'next'
import ConfigurateurClient from '@/components/configurateur/ConfigurateurClient'

// Le configurateur B2B occupait auparavant /entreprises. Il vit désormais ici
// pour laisser la page mère devenir une vraie page de contenu indexable.
// `noindex, follow` : l'outil duplique /configurateur et n'a pas de contenu
// propre à positionner — mais il transmet son autorité aux pages liées.
export const metadata: Metadata = {
  title: 'Configurer une commande entreprise',
  description:
    "Configurez votre commande d'uniformes personnalisés : produit, quantité, technique, logo. Devis chiffré sous 2h.",
  robots: { index: false, follow: true },
}

export default function CommandeEntreprisePage() {
  return <ConfigurateurClient variant="b2b" />
}
