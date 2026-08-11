import type { Metadata } from 'next'
import CollectionClient from '@/components/collection/CollectionClient'

export const metadata: Metadata = {
  title: 'Collection — Designs prêts à porter',
  description: 'Notre collection de designs prêts à porter, personnalisables en DTF ou broderie. Commandez en quelques clics.',
}

export default function CollectionPage() {
  return <CollectionClient />
}
