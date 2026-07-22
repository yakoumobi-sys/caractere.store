'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'

const PALETTE = {
  black: '#0C1A26',
  white: '#FFFFFF',
  grayLight: '#F3F4F6',
  grayMed: '#E5E7EB',
  grayDark: '#6B7280',
  gold: '#D4A574',
  darkBlue: '#051B35',
}

function useFadeIn(delay = 0) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.opacity = '0'
    el.style.transform = 'translateY(20px)'
    el.style.transition = `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.style.opacity = '1'
          el.style.transform = 'translateY(0)'
        }
      },
      { threshold: 0.1 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [delay])
  return ref
}

function Hero() {
  const ref = useFadeIn(0)
  return (
    <section
      className="w-full pt-20 pb-24 px-6"
      style={{
        background: `linear-gradient(135deg, ${PALETTE.darkBlue} 0%, ${PALETTE.black} 100%)`,
        color: PALETTE.white,
      }}
    >
      <div className="max-w-5xl mx-auto text-center" ref={ref}>
        <span
          className="inline-block px-4 py-2 rounded-full text-xs font-bold mb-6 uppercase tracking-wide"
          style={{ background: 'rgba(212,165,116,0.15)', color: PALETTE.gold, border: `1px solid ${PALETTE.gold}` }}
        >
          ✓ Espace Entreprise
        </span>

        <h1 className="text-5xl md:text-6xl font-black leading-tight mb-6">
          Uniformes & Branding au sérieux
        </h1>

        <p className="text-lg md:text-xl max-w-3xl mx-auto mb-10" style={{ color: '#B0BEC5' }}>
          Depuis 8 ans, nous équipons les restaurants, cliniques, corporations et BTP algériens.
          <br />
          <span style={{ color: PALETTE.gold }}>Qualité garantie. Délais respectés. Suivi transparent.</span>
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            href="/configurateur"
            className="px-8 py-4 rounded-lg text-lg font-bold transition-all hover:scale-105 no-underline"
            style={{ background: PALETTE.gold, color: PALETTE.black }}
          >
            ⚙️ Configurer ma commande
          </Link>
          <Link
            href="/produits"
            className="px-8 py-4 rounded-lg text-lg font-bold transition-all no-underline"
            style={{
              background: 'rgba(255,255,255,0.08)',
              color: PALETTE.white,
              border: `2px solid rgba(255,255,255,0.2)`,
            }}
          >
            👕 Produits
          </Link>
          <a
            href="tel:+213557440522"
            className="px-8 py-4 rounded-lg text-lg font-bold transition-all no-underline"
            style={{
              background: 'rgba(212,165,116,0.1)',
              color: PALETTE.gold,
              border: `2px solid ${PALETTE.gold}`,
            }}
          >
            📞 Nous appeler
          </a>
        </div>

        <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
          <div className="text-center">
            <p className="text-3xl font-black" style={{ color: PALETTE.gold }}>50K+</p>
            <p className="text-xs" style={{ color: '#90A4AE' }}>Pièces produites</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-black" style={{ color: PALETTE.gold }}>500+</p>
            <p className="text-xs" style={{ color: '#90A4AE' }}>Entreprises</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-black" style={{ color: PALETTE.gold }}>48h</p>
            <p className="text-xs" style={{ color: '#90A4AE' }}>Production garantie</p>
          </div>
        </div>
      </div>
    </section>
  )
}

function Benefits() {
  const ref = useFadeIn()
  const items = [
    { icon: '⚡', title: 'Délai 48h garanti', desc: 'Production à Alger. Pas de retard, pas de surprise.' },
    { icon: '💼', title: 'Volume sans stress', desc: '10 pièces ou 500 — même qualité, même délai.' },
    { icon: '🎯', title: 'Consistance totale', desc: 'Zéro variation entre les commandes.' },
    { icon: '📊', title: 'Rabais volume', desc: 'Jusqu’à -30% à partir de 500 pièces.' },
    { icon: '🤝', title: 'Suivi transparent', desc: 'WhatsApp direct, photos de production, tracking.' },
    { icon: '🎨', title: 'Branding sur mesure', desc: 'Logo, couleurs, étiquettes personnalisées.' },
  ]
  return (
    <section className="py-20 px-6" style={{ background: PALETTE.grayLight }}>
      <div className="max-w-5xl mx-auto">
        <div ref={ref} className="mb-12 text-center">
          <h2 className="text-4xl font-black mb-2" style={{ color: PALETTE.black }}>
            Pourquoi les entreprises nous choisissent
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((b, i) => (
            <div key={i} className="p-6 rounded-lg" style={{ background: PALETTE.white }}>
              <p className="text-3xl mb-3">{b.icon}</p>
              <p className="font-bold mb-1" style={{ color: PALETTE.black }}>{b.title}</p>
              <p className="text-sm" style={{ color: PALETTE.grayDark }}>{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Sectors() {
  const ref = useFadeIn()
  const sectors = [
    { emoji: '🍽️', name: 'Restauration', ex: 'Polos & tabliers brodés' },
    { emoji: '👨‍⚕️', name: 'Santé', ex: 'Blouses & uniformes' },
    { emoji: '🏗️', name: 'BTP', ex: 'Gilets de chantier' },
    { emoji: '💼', name: 'Corporate', ex: 'Événements & formations' },
    { emoji: '🏪', name: 'Retail', ex: 'Merchandising' },
    { emoji: '🏃', name: 'Sports', ex: 'Maillots & t-shirts' },
  ]
  return (
    <section className="py-20 px-6" style={{ background: PALETTE.white }}>
      <div className="max-w-5xl mx-auto">
        <div ref={ref} className="mb-12 text-center">
          <h2 className="text-4xl font-black mb-2" style={{ color: PALETTE.black }}>Secteurs desservis</h2>
          <p style={{ color: PALETTE.grayDark }}>Depuis 8 ans, on équipe tous les secteurs</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {sectors.map((c, i) => (
            <div
              key={i}
              className="p-5 rounded-lg border-l-4"
              style={{ borderColor: PALETTE.gold, background: PALETTE.grayLight }}
            >
              <p className="text-3xl mb-1">{c.emoji}</p>
              <p className="font-bold text-sm" style={{ color: PALETTE.black }}>{c.name}</p>
              <p className="text-xs" style={{ color: PALETTE.grayDark }}>{c.ex}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Testimonials() {
  const ref = useFadeIn()
  const items = [
    { name: 'Karim B.', role: 'Restaurant El Kef', text: '80 polos brodés. Rendu impeccable, délai respecté. 3ème commande!' },
    { name: 'Dr. Samira M.', role: 'Clinique Al Chifa', text: '45 blouses pour notre équipe. Qualité premium, broderie précise.' },
    { name: 'Yacine O.', role: 'BTP Construct', text: '120 gilets en 5 jours. Après 1 mois sur chantier, toujours parfait.' },
    { name: 'Mohamed T.', role: 'Alger Events', text: '200 t-shirts en 48h pour un événement corporate. Zéro problème.' },
  ]
  return (
    <section className="py-20 px-6" style={{ background: PALETTE.darkBlue, color: PALETTE.white }}>
      <div className="max-w-5xl mx-auto">
        <div ref={ref} className="mb-12 text-center">
          <h2 className="text-4xl font-black mb-2">Nos clients parlent</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((t, i) => (
            <div
              key={i}
              className="p-6 rounded-lg"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212,165,116,0.25)' }}
            >
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

function Pricing() {
  const ref = useFadeIn()
  const tiers = [
    { qty: '10-50', price: '1 950 DA', note: 'Unité (DTF)' },
    { qty: '50-200', price: '1 650 DA', note: '-15%', popular: true },
    { qty: '200-500', price: '1 400 DA', note: '-25%' },
    { qty: '500+', price: '1 200 DA', note: '-30%' },
  ]
  return (
    <section className="py-20 px-6" style={{ background: PALETTE.grayLight }}>
      <div className="max-w-5xl mx-auto">
        <div ref={ref} className="mb-12 text-center">
          <h2 className="text-4xl font-black mb-2" style={{ color: PALETTE.black }}>Tarifs B2B</h2>
          <p style={{ color: PALETTE.grayDark }}>À partir de 10 pièces • Rabais volume jusqu’à -30%</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {tiers.map((t, i) => (
            <div
              key={i}
              className="p-5 rounded-lg text-center"
              style={{
                background: PALETTE.white,
                border: t.popular ? `2px solid ${PALETTE.gold}` : `1px solid ${PALETTE.grayMed}`,
              }}
            >
              {t.popular && (
                <p className="text-xs font-bold mb-1" style={{ color: PALETTE.gold }}>POPULAIRE</p>
              )}
              <p className="text-sm font-bold" style={{ color: PALETTE.black }}>{t.qty} pièces</p>
              <p className="text-2xl font-black my-1" style={{ color: PALETTE.gold }}>{t.price}</p>
              <p className="text-xs" style={{ color: PALETTE.grayDark }}>{t.note}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Process() {
  const ref = useFadeIn()
  const steps = [
    { num: 1, title: 'Devis gratuit', desc: 'Vous décrivez le projet, prix en 1h' },
    { num: 2, title: 'Validation', desc: '30% d’acompte pour démarrer' },
    { num: 3, title: 'Production 48h', desc: 'Photos de suivi via WhatsApp' },
    { num: 4, title: 'QC & Livraison', desc: 'Contrôle qualité, puis 3-5 jours' },
  ]
  return (
    <section className="py-20 px-6" style={{ background: PALETTE.white }}>
      <div className="max-w-3xl mx-auto">
        <div ref={ref} className="mb-12 text-center">
          <h2 className="text-4xl font-black mb-2" style={{ color: PALETTE.black }}>Processus transparent</h2>
        </div>
        {steps.map((s, i) => (
          <div key={i} className="flex gap-4 mb-8">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 font-black"
              style={{ background: PALETTE.gold, color: PALETTE.black }}
            >
              {s.num}
            </div>
            <div>
              <p className="font-bold" style={{ color: PALETTE.black }}>{s.title}</p>
              <p className="text-sm" style={{ color: PALETTE.grayDark }}>{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function FinalCTA() {
  const ref = useFadeIn()
  return (
    <section
      className="py-24 px-6"
      style={{
        background: `linear-gradient(135deg, ${PALETTE.black} 0%, ${PALETTE.darkBlue} 100%)`,
        color: PALETTE.white,
      }}
    >
      <div className="max-w-4xl mx-auto text-center" ref={ref}>
        <h2 className="text-4xl md:text-5xl font-black mb-4">Prêt à équiper votre équipe?</h2>
        <p className="text-lg mb-10" style={{ color: '#B0BEC5' }}>
          Devis gratuit · Réponse en 2h · Sans engagement
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            href="/configurateur"
            className="px-8 py-4 rounded-lg font-bold transition-all hover:scale-105 no-underline"
            style={{ background: PALETTE.gold, color: PALETTE.black }}
          >
            ⚙️ Configurer ma commande
          </Link>
          <a
            href="tel:+213557440522"
            className="px-8 py-4 rounded-lg font-bold transition-all no-underline"
            style={{
              background: 'rgba(212,165,116,0.1)',
              color: PALETTE.gold,
              border: `2px solid ${PALETTE.gold}`,
            }}
          >
            📞 Nous appeler
          </a>
        </div>

        <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
          <div className="text-center">
            <p className="text-xs" style={{ color: '#90A4AE' }}>TÉLÉPHONE / WHATSAPP</p>
            <p className="font-bold" style={{ color: PALETTE.gold }}>+213 557 440 522</p>
          </div>
          <div className="text-center">
            <p className="text-xs" style={{ color: '#90A4AE' }}>EMAIL</p>
            <p className="font-bold" style={{ color: PALETTE.gold }}>yakoumobi@gmail.com</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function PageEntreprise() {
  return (
    <main>
      <Hero />
      <Benefits />
      <Sectors />
      <Testimonials />
      <Pricing />
      <Process />
      <FinalCTA />
    </main>
  )
}
