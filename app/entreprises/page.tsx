'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

const PALETTE = { black: '#0C1A26', white: '#FFFFFF', grayLight: '#F3F4F6', grayMed: '#E5E7EB', grayDark: '#6B7280', gold: '#D4A574', darkBlue: '#051B35' }

function useFadeIn(delay = 0) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.opacity = '0'; el.style.transform = 'translateY(20px)'
    el.style.transition = `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.style.opacity = '1'; el.style.transform = 'translateY(0)' } }, { threshold: 0.1 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [delay])
  return ref
}

function HeroEntreprises() {
  const ref = useFadeIn(0)
  return (
    <section className="relative w-full pt-16 pb-24 px-6" style={{ background: `linear-gradient(135deg, ${PALETTE.darkBlue} 0%, ${PALETTE.black} 100%)`, color: PALETTE.white }}>
      <div className="max-w-6xl mx-auto">
        <div ref={ref} className="text-center">
          <span className="inline-block px-4 py-2 rounded-full text-xs font-bold mb-4 uppercase" style={{ background: `${PALETTE.gold}20`, color: PALETTE.gold, border: `1px solid ${PALETTE.gold}` }}>✓ Qualité garantie</span>
          <h1 className="text-5xl md:text-6xl font-black mb-3 max-w-4xl mx-auto">Uniforms & Branding au sérieux</h1>
          <p className="text-lg max-w-2xl mx-auto mb-8" style={{ color: '#B0BEC5' }}>50K+ pièces produites. 500+ entreprises satisfaites. <span style={{ color: PALETTE.gold }}>Délais garantis. Qualité certaine.</span></p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/configurateur" className="px-8 py-4 rounded-lg text-lg font-bold transition-all hover:scale-105 inline-block" style={{ background: PALETTE.gold, color: PALETTE.black }}>
              Ouvrir Configurateur →
            </Link>
            <a href="https://wa.me/213557440522" className="px-8 py-4 rounded-lg text-lg font-bold transition-all inline-block" style={{ background: 'rgba(212, 165, 116, 0.1)', color: PALETTE.gold, border: `2px solid ${PALETTE.gold}` }}>
              WhatsApp Direct
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

function WhyForBusiness() {
  const ref = useFadeIn()
  return (
    <section className="py-16 px-6" style={{ background: PALETTE.grayLight }}>
      <div className="max-w-6xl mx-auto">
        <div ref={ref} className="mb-12 text-center">
          <h2 className="text-4xl font-black mb-2" style={{ color: PALETTE.black }}>Pourquoi nous?</h2>
          <p style={{ color: PALETTE.grayDark }}>Qualité, sérieux, résultats</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: '⚡', title: 'Délai 48h Garanti', desc: 'Production à Alger, pas d\'excuses' },
            { icon: '💼', title: 'Volume sans stress', desc: '10 ou 500 pièces, même qualité' },
            { icon: '🎯', title: 'Consistency', desc: 'Zéro variation entre commandes' },
            { icon: '📊', title: 'Rabais volume', desc: 'Jusqu\'à -30% à partir de 500' },
            { icon: '🤝', title: 'Suivi transparent', desc: 'WhatsApp, photos, tracking' },
            { icon: '🎨', title: 'Custom branding', desc: 'Logo, couleurs, tags perso' },
          ].map((b, i) => (
            <div key={i} className="p-6 rounded-lg" style={{ background: PALETTE.white }}>
              <p className="text-3xl mb-2">{b.icon}</p>
              <p className="font-bold mb-1" style={{ color: PALETTE.black }}>{b.title}</p>
              <p className="text-sm" style={{ color: PALETTE.grayDark }}>{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function UseCases() {
  const ref = useFadeIn()
  return (
    <section className="py-16 px-6" style={{ background: PALETTE.white }}>
      <div className="max-w-6xl mx-auto">
        <div ref={ref} className="mb-12 text-center">
          <h2 className="text-4xl font-black mb-2" style={{ color: PALETTE.black }}>Secteurs</h2>
          <p style={{ color: PALETTE.grayDark }}>On équipe tous les secteurs depuis 8 ans</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { emoji: '🍽️', sector: 'Restauration', example: 'Polos & tabliers brodés' },
            { emoji: '👨‍⚕️', sector: 'Santé', example: 'Blouses & uniforms' },
            { emoji: '🏗️', sector: 'BTP', example: 'Gilets de chantier' },
            { emoji: '💼', sector: 'Corporate', example: 'Uniforms événements' },
            { emoji: '🏪', sector: 'Retail', example: 'Merchandising' },
            { emoji: '🏃', sector: 'Sports', example: 'Maillots & t-shirts' },
          ].map((c, i) => (
            <div key={i} className="p-4 rounded-lg border-l-4" style={{ borderColor: PALETTE.gold, background: PALETTE.grayLight }}>
              <p className="text-3xl mb-1">{c.emoji}</p>
              <p className="font-bold text-sm" style={{ color: PALETTE.black }}>{c.sector}</p>
              <p className="text-xs" style={{ color: PALETTE.grayDark }}>{c.example}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Testimonials() {
  const ref = useFadeIn()
  return (
    <section className="py-16 px-6" style={{ background: PALETTE.darkBlue, color: PALETTE.white }}>
      <div className="max-w-6xl mx-auto">
        <div ref={ref} className="mb-12 text-center">
          <h2 className="text-4xl font-black mb-2">Nos clients</h2>
          <p style={{ color: '#B0BEC5' }}>Ils nous font confiance, ils sont satisfaits</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { name: 'Karim B.', role: 'Restaurant El Kef', text: '80 polos brodés, rendu impeccable, délai respecté. 3ème commande, c\'est consistent!' },
            { name: 'Dr. Samira M.', role: 'Clinique Al Chifa', text: '45 blouses pour notre équipe. Qualité premium, broderie précise. Merci!' },
            { name: 'Yacine O.', role: 'BTP Construct', text: '120 gilets en 5 jours. Après 1 mois, toujours parfait. Sérieux reconnu!' },
            { name: 'Mohamed T.', role: 'Alger Events', text: '200 t-shirts en 48h pour événement. Jour J, zéro problème. Merci!' },
          ].map((t, i) => (
            <div key={i} className="p-6 rounded-lg" style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${PALETTE.gold}40` }}>
              <p className="text-sm italic mb-3" style={{ color: '#E0E0E0' }}>"{t.text}"</p>
              <p className="font-bold text-sm" style={{ color: PALETTE.gold }}>{t.name}</p>
              <p className="text-xs" style={{ color: '#90A4AE' }}>{t.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function PricingBusiness() {
  const ref = useFadeIn()
  return (
    <section className="py-16 px-6" style={{ background: PALETTE.grayLight }}>
      <div className="max-w-6xl mx-auto">
        <div ref={ref} className="mb-12 text-center">
          <h2 className="text-4xl font-black mb-2" style={{ color: PALETTE.black }}>Tarifs B2B</h2>
          <p style={{ color: PALETTE.grayDark }}>À partir de 10 pièces • Rabais -30% dès 500</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg text-center" style={{ background: PALETTE.white }}>
            <p className="text-sm font-bold mb-1" style={{ color: PALETTE.black }}>10-50</p>
            <p className="text-2xl font-black" style={{ color: PALETTE.gold }}>1 950 DA</p>
            <p className="text-xs mt-1" style={{ color: PALETTE.grayDark }}>Unit (DTF)</p>
          </div>

          <div className="p-4 rounded-lg text-center" style={{ background: PALETTE.white, border: `2px solid ${PALETTE.gold}` }}>
            <p className="text-xs font-bold mb-1" style={{ color: PALETTE.gold }}>POPULAIRE</p>
            <p className="text-2xl font-black" style={{ color: PALETTE.gold }}>1 650 DA</p>
            <p className="text-xs mt-1" style={{ color: PALETTE.grayDark }}>50-200 (-15%)</p>
          </div>

          <div className="p-4 rounded-lg text-center" style={{ background: PALETTE.white }}>
            <p className="text-sm font-bold mb-1" style={{ color: PALETTE.black }}>200-500</p>
            <p className="text-2xl font-black" style={{ color: PALETTE.gold }}>1 400 DA</p>
            <p className="text-xs mt-1" style={{ color: PALETTE.grayDark }}>Unit (-25%)</p>
          </div>

          <div className="p-4 rounded-lg text-center" style={{ background: PALETTE.white }}>
            <p className="text-sm font-bold mb-1" style={{ color: PALETTE.black }}>500+</p>
            <p className="text-2xl font-black" style={{ color: PALETTE.gold }}>1 200 DA</p>
            <p className="text-xs mt-1" style={{ color: PALETTE.grayDark }}>Unit (-30%)</p>
          </div>
        </div>
      </div>
    </section>
  )
}

function Process() {
  const ref = useFadeIn()
  return (
    <section className="py-16 px-6" style={{ background: PALETTE.white }}>
      <div className="max-w-6xl mx-auto">
        <div ref={ref} className="mb-12 text-center">
          <h2 className="text-4xl font-black mb-2" style={{ color: PALETTE.black }}>Processus</h2>
          <p style={{ color: PALETTE.grayDark }}>De la commande à la livraison</p>
        </div>

        <div className="max-w-2xl mx-auto">
          {[
            { num: 1, title: 'Devis gratuit', desc: 'En 1h, tu reçois le prix' },
            { num: 2, title: 'Validation', desc: '30% acompte pour démarrer' },
            { num: 3, title: 'Production 48h', desc: 'Photos de suivi, WhatsApp' },
            { num: 4, title: 'QC & Livraison', desc: 'Contrôle qualité puis 3-5 jours' },
          ].map((s, i) => (
            <div key={i}>
              <div className="flex gap-4 mb-6">
                <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 font-bold" style={{ background: PALETTE.gold, color: PALETTE.black }}>{s.num}</div>
                <div>
                  <p className="font-bold" style={{ color: PALETTE.black }}>{s.title}</p>
                  <p className="text-sm" style={{ color: PALETTE.grayDark }}>{s.desc}</p>
                </div>
              </div>
              {i < 3 && <div className="flex justify-center mb-6"><div style={{ width: '2px', height: '20px', background: PALETTE.gold }}></div></div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FinalCTA() {
  const ref = useFadeIn()
  return (
    <section className="py-24 px-6" style={{ background: `linear-gradient(135deg, ${PALETTE.black} 0%, ${PALETTE.darkBlue} 100%)`, color: PALETTE.white }}>
      <div className="max-w-4xl mx-auto text-center" ref={ref}>
        <h2 className="text-5xl font-black mb-4">Équipez votre équipe</h2>
        <p className="text-lg mb-8" style={{ color: '#B0BEC5' }}>Devis gratuit • Réponse en 2h • Sans engagement</p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link href="/configurateur" className="px-8 py-4 rounded-lg font-bold transition-all hover:scale-105 inline-block" style={{ background: PALETTE.gold, color: PALETTE.black }}>
            Ouvrir Configurateur →
          </Link>
          <a href="https://wa.me/213557440522" className="px-8 py-4 rounded-lg font-bold transition-all inline-block" style={{ background: 'rgba(212, 165, 116, 0.1)', color: PALETTE.gold, border: `2px solid ${PALETTE.gold}` }}>
            WhatsApp Direct
          </a>
        </div>

        <div className="flex flex-col sm:flex-row gap-8 justify-center">
          <div className="text-center">
            <p className="text-xs" style={{ color: '#90A4AE' }}>WHATSAPP</p>
            <p className="font-bold" style={{ color: PALETTE.gold }}>+213 557 440 522</p>
          </div>
          <div style={{ width: '1px', height: '40px', background: `${PALETTE.gold}40` }}></div>
          <div className="text-center">
            <p className="text-xs" style={{ color: '#90A4AE' }}>EMAIL</p>
            <p className="font-bold" style={{ color: PALETTE.gold }}>yakoumobi@gmail.com</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function PageEntreprises() {
  return (
    <main>
      <HeroEntreprises />
      <WhyForBusiness />
      <UseCases />
      <Testimonials />
      <PricingBusiness />
      <Process />
      <FinalCTA />
    </main>
  )
}
