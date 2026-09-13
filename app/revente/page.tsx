import type { Metadata } from 'next'
import ReventeClient from '@/components/revente/ReventeClient'
import { JsonLd, jsonLdGraph, breadcrumbLd, organizationLd } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Commander pour revendre',
  description:
    'Composez votre série : ensembles, hoodies et joggers Caractère, quantités par taille, devis revendeur chiffré par l’atelier. Alger, livraison 58 wilayas.',
  alternates: { canonical: '/revente' },
}

export default function ReventePage() {
  return (
    <>
      <JsonLd
        data={jsonLdGraph(
          organizationLd,
          breadcrumbLd([
            { name: 'Accueil', path: '/' },
            { name: 'Commander pour revendre', path: '/revente' },
          ]),
        )}
      />
      <ReventeClient />
    </>
  )
}
