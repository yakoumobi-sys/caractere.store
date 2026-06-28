import { supabase } from '@/lib/supabase'
import type { Produit, SiteConfig } from '@/types'
import Navbar from '@/components/layout/Navbar'
import HomePageContent from '@/components/home/HomePageContent'

export const revalidate = 60

async function getData() {
  const [produitsRes] = await Promise.all([
    supabase.from('produits').select('*').eq('actif', true).order('ordre'),
  ])
  const produits: Produit[] = produitsRes.data ?? []
  return { produits }
}

export default async function HomePage() {
  const { produits } = await getData()
  return (
    <>
      <Navbar />
      <main>
        <HomePageContent produits={produits} />
      </main>
    </>
  )
}
