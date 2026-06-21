import { supabase } from '@/lib/supabase'
import type { Produit, Couleur, Taille, SiteConfig } from '@/types'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import HeroSection from '@/components/sections/HeroSection'
import MarqueeStrip from '@/components/sections/MarqueeStrip'
import ServicesSection from '@/components/sections/ServicesSection'
import ProduitsSection from '@/components/sections/ProduitsSection'
import ProcessSection from '@/components/sections/ProcessSection'
import WhySection from '@/components/sections/WhySection'
import SecteursSection from '@/components/sections/SecteursSection'
import TestimonialsSection from '@/components/sections/TestimonialsSection'
import FaqSection from '@/components/sections/FaqSection'
import CtaDarkSection from '@/components/sections/CtaDarkSection'
import ContactSection from '@/components/sections/ContactSection'
import CaracterePopup from "@/components/layout/CaracterePopup";

export const revalidate = 60 // revalidate every 60 seconds

async function getData() {
  const [produitsRes, configRes] = await Promise.all([
    supabase.from('produits').select('*').eq('actif', true).order('ordre'),
    supabase.from('site_config').select('*'),
  ])
  const produits: Produit[] = produitsRes.data ?? []
  const config: Record<string, string> = {}
  ;(configRes.data as SiteConfig[] ?? []).forEach(c => { config[c.cle] = c.valeur })
  return { produits, config }
}

export default async function HomePage() {
  const { produits, config } = await getData()
  return (
    <>
<CaracterePopup />
      <Navbar />
      <main>
        <HeroSection config={config} />
        <MarqueeStrip />
        <ServicesSection />
        <ProduitsSection produits={produits} />
        <ProcessSection />
        <WhySection />
        <SecteursSection />
        <TestimonialsSection />
        <FaqSection />
        <CtaDarkSection />
        <ContactSection config={config} />
      </main>
      <Footer />
    </>
  )
}
