'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PALETTE — Noir/Blanc/Gris clair + accent bleu
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const PALETTE = {
  black: '#0C1A26',
  white: '#FFFFFF',
  grayLight: '#F3F4F6',
  grayMed: '#E5E7EB',
  grayDark: '#6B7280',
  blue: '#0C4A6E',
  blueMid: '#1E6FA8',
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// HOOK: Fade In on Scroll
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

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

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// HERO — Minimaliste, puissant, 2 CTAs uniquement
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function Hero() {
  const [userType, setUserType] = useState<'b2c' | 'b2b'>('b2c')
  const ref = useFadeIn(0)

  return (
    <section 
      className="relative w-full pt-20 pb-32 px-6"
      style={{ background: PALETTE.black, color: PALETTE.white }}
    >
      <div className="max-w-6xl mx-auto">
        <div ref={ref} className="text-center">
          {/* Logo */}
          <div className="mb-12 flex justify-center">
            <img 
              src="https://aijlvbipvqnvbywxhlbd.supabase.co/storage/v1/object/public/image/logo-white-transparent.png"
              alt="Caractère"
              className="h-16 w-auto"
            />
          </div>

          {/* Headline — Minimaliste, puissant */}
          <h1 className="text-5xl md:text-7xl font-black leading-tight tracking-tight mb-6 max-w-4xl mx-auto">
            Personnalisez.
            <br />
            <span style={{ color: PALETTE.blue }}>Développez.</span>
            <br />
            Livrez.
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-10" style={{ color: '#D1D5DB' }}>
            Vêtements personnalisés DTF & broderie. Dès 1 pièce, sans minimum.
            Production 48h, livraison nationale 3-5 jours.
          </p>

          {/* Segmentation: B2C / B2B — Hick's Law: Max 2 choix */}
          <div className="flex gap-2 justify-center mb-10">
            <button
              onClick={() => setUserType('b2c')}
              className="px-5 py-2 rounded-full text-sm font-bold transition-all"
              style={{
                background: userType === 'b2c' ? PALETTE.blue : 'rgba(255,255,255,0.1)',
                color: PALETTE.white,
                border: `2px solid ${userType === 'b2c' ? PALETTE.blue : 'rgba(255,255,255,0.2)'}`,
              }}
            >
              Particulier
            </button>
            <button
              onClick={() => setUserType('b2b')}
              className="px-5 py-2 rounded-full text-sm font-bold transition-all"
              style={{
                background: userType === 'b2b' ? PALETTE.blue : 'rgba(255,255,255,0.1)',
                color: PALETTE.white,
                border: `2px solid ${userType === 'b2b' ? PALETTE.blue : 'rgba(255,255,255,0.2)'}`,
              }}
            >
              Entreprise
            </button>
          </div>

          {/* PRIMARY CTA */}
          <div className="flex flex-col items-center gap-4 mb-8">
            {userType === 'b2c' ? (
              <>
                <Link 
                  href="/configurateur"
                  className="px-8 py-5 rounded-lg text-lg font-bold no-underline transition-all hover:scale-105"
                  style={{
                    background: PALETTE.blue,
                    color: PALETTE.white,
                    boxShadow: '0 8px 24px rgba(12,74,110,0.3)',
                  }}
                >
                  Commencer une commande
                </Link>
                <p className="text-sm" style={{ color: '#9CA3AF' }}>
                  À partir de 1 950 DA / pièce
                </p>
              </>
            ) : (
              <>
                <Link 
                  href="/configurateur"
                  className="px-8 py-5 rounded-lg text-lg font-bold no-underline transition-all hover:scale-105"
                  style={{
                    background: PALETTE.blue,
                    color: PALETTE.white,
                    boxShadow: '0 8px 24px rgba(12,74,110,0.3)',
                  }}
                >
                  Demander un devis
                </Link>
                <p className="text-sm" style={{ color: '#9CA3AF' }}>
                  À partir de 1 200 DA / pièce (dès 50 pièces)
                </p>
              </>
            )}
          </div>

          {/* Trust markers — Réduction friction */}
          <p className="text-sm" style={{ color: '#9CA3AF' }}>
            ✓ Devis gratuit en 2h  •  ✓ Dès 1 pièce  •  ✓ Délai garanti
          </p>
        </div>
      </div>
    </section>
  )
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TRUST SECTION — Social Proof puissant (Availability Heuristic)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function TrustSection() {
  const ref = useFadeIn()
  const stats = [
    { number: '50K+', label: 'Pièces produites', icon: '📦' },
    { number: '500+', label: 'Marques & entreprises', icon: '🏢' },
    { number: '4.9★', label: 'Note clients', icon: '⭐' },
    { number: '48h', label: 'Délai production', icon: '⚡' },
  ]

  return (
    <section 
      className="py-20 px-6"
      style={{ background: PALETTE.grayLight }}
    >
      <div className="max-w-6xl mx-auto">
        <div ref={ref} className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <p className="text-3xl mb-2">{s.icon}</p>
              <p className="text-3xl font-black" style={{ color: PALETTE.black }}>
                {s.number}
              </p>
              <p className="text-sm mt-1" style={{ color: PALETTE.grayDark }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// BESTSELLERS — 4 produits avec images
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function BestsellersSection() {
  const ref = useFadeIn()
  const products = [
    { name: 'T-shirt Premium', desc: '100% coton', price: '1 950 DA', img: 'https://aijlvbipvqnvbywxhlbd.supabase.co/storage/v1/object/public/image/IMG_5850.jpeg' },
    { name: 'Polo', desc: 'Piqué premium', price: '2 300 DA', img: 'https://aijlvbipvqnvbywxhlbd.supabase.co/storage/v1/object/public/image/IMG_5850.jpeg' },
    { name: 'Gilet travail', desc: 'Multipoches', price: '2 500 DA', img: 'https://aijlvbipvqnvbywxhlbd.supabase.co/storage/v1/object/public/image/IMG_5850.jpeg' },
    { name: 'Casquette', desc: 'Structurée', price: '1 200 DA', img: 'https://aijlvbipvqnvbywxhlbd.supabase.co/storage/v1/object/public/image/IMG_5850.jpeg' },
  ]

  return (
    <section className="py-24 px-6" style={{ background: PALETTE.white }}>
      <div className="max-w-6xl mx-auto">
        <div ref={ref} className="mb-16 text-center">
          <h2 className="text-4xl font-black mb-2" style={{ color: PALETTE.black }}>
            Bestsellers
          </h2>
          <p style={{ color: PALETTE.grayDark }}>
            Les produits les plus commandés
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {products.map((p, i) => (
            <div 
              key={i}
              className="rounded-lg overflow-hidden border transition-all hover:shadow-lg"
              style={{ background: PALETTE.white, borderColor: PALETTE.grayMed }}
            >
              <div className="h-48 bg-gray-300 relative overflow-hidden">
                <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-5">
                <p className="font-black text-black mb-1">{p.name}</p>
                <p className="text-sm" style={{ color: PALETTE.grayDark }}>{p.desc}</p>
                <p className="font-bold text-lg mt-3 mb-4" style={{ color: PALETTE.blue }}>
                  {p.price}
                </p>
                <button
                  className="w-full py-2 rounded-lg text-sm font-bold text-white transition-all hover:opacity-90"
                  style={{ background: PALETTE.black }}
                >
                  Commander
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/produits"
            className="inline-block px-6 py-3 rounded-lg font-bold no-underline transition-all"
            style={{
              background: PALETTE.grayLight,
              color: PALETTE.black,
              border: `2px solid ${PALETTE.grayMed}`,
            }}
          >
            Voir tous les produits →
          </Link>
        </div>
      </div>
    </section>
  )
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// THE COLLECTION — 4 thèmes, 8 designs
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function CollectionSection() {
  const ref = useFadeIn()
  const themes = [
    { name: 'Automotive', desc: 'Speed & Passion', color: '#DC2626' },
    { name: 'Minimalist', desc: 'Clean & Bold', color: '#2563EB' },
    { name: 'Graphic & Art', desc: 'Urban Canvas', color: '#7C3AED' },
    { name: 'Limited', desc: 'Exclusif', color: '#F59E0B' },
  ]

  return (
    <section className="py-24 px-6" style={{ background: PALETTE.grayLight }}>
      <div className="max-w-6xl mx-auto">
        <div ref={ref} className="mb-16 text-center">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-4" style={{ background: PALETTE.blue, color: PALETTE.white }}>
            18 DESIGNS EXCLUSIFS
          </span>
          <h2 className="text-4xl font-black mb-3" style={{ color: PALETTE.black }}>
            The Collection
          </h2>
          <p style={{ color: PALETTE.grayDark }}>
            Designs premium par thème • 3200 DA pièce • Dès 1 pièce
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          {themes.map((t, i) => (
            <Link
              key={i}
              href="/collection"
              className="p-6 rounded-lg border-2 transition-all hover:shadow-lg no-underline"
              style={{
                background: PALETTE.white,
                borderColor: t.color,
              }}
            >
              <p className="text-3xl mb-2">✨</p>
              <p className="font-bold text-black mb-1">{t.name}</p>
              <p className="text-sm mb-4" style={{ color: PALETTE.grayDark }}>
                {t.desc}
              </p>
              <p className="text-xs font-bold" style={{ color: t.color }}>
                Voir →
              </p>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/collection"
            className="inline-block px-8 py-4 rounded-lg font-bold no-underline transition-all"
            style={{
              background: PALETTE.blue,
              color: PALETTE.white,
            }}
          >
            Découvrir les 18 designs →
          </Link>
        </div>
      </div>
    </section>
  )
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// HOW IT WORKS — 4 steps minimaliste
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function HowItWorks() {
  const ref = useFadeIn()
  const steps = [
    { num: 1, title: 'Choisissez', desc: 'T-shirt, polo, gilet...' },
    { num: 2, title: 'Personnalisez', desc: 'DTF ou broderie' },
    { num: 3, title: 'Produisez', desc: '48h à Alger' },
    { num: 4, title: 'Livrez', desc: '3-5 jours national' },
  ]

  return (
    <section className="py-24 px-6" style={{ background: PALETTE.white }}>
      <div className="max-w-6xl mx-auto">
        <div ref={ref} className="mb-16 text-center">
          <h2 className="text-4xl font-black mb-2" style={{ color: PALETTE.black }}>
            Comment ça marche
          </h2>
          <p style={{ color: PALETTE.grayDark }}>4 étapes simples</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <div key={i} className="text-center">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 font-black text-white text-2xl"
                style={{ background: PALETTE.black }}
              >
                {s.num}
              </div>
              <p className="font-bold text-black mb-1">{s.title}</p>
              <p className="text-sm" style={{ color: PALETTE.grayDark }}>
                {s.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/comment-ca-marche"
            className="inline-block px-6 py-3 rounded-lg font-bold no-underline transition-all"
            style={{
              background: PALETTE.grayLight,
              color: PALETTE.black,
              border: `2px solid ${PALETTE.grayMed}`,
            }}
          >
            Voir en détail →
          </Link>
        </div>
      </div>
    </section>
  )
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TECHNIQUES — DTF vs Broderie
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function TechniquesSection() {
  const ref = useFadeIn()
  const techniques = [
    {
      icon: '🖨️',
      name: 'DTF',
      desc: 'Direct to Film — Rendu photographique, tous tissus',
      points: ['Résistant lavage 40+', 'Dès 1 pièce', 'Jusqu\'à 60cm'],
    },
    {
      icon: '🪡',
      name: 'Broderie',
      desc: 'Machine — Effet 3D, finition relief premium',
      points: ['Tenue à vie', 'Casquettes & polos', 'Logos structurés'],
    },
  ]

  return (
    <section className="py-24 px-6" style={{ background: PALETTE.grayLight }}>
      <div className="max-w-6xl mx-auto">
        <div ref={ref} className="mb-16 text-center">
          <h2 className="text-4xl font-black mb-2" style={{ color: PALETTE.black }}>
            Nos techniques
          </h2>
          <p style={{ color: PALETTE.grayDark }}>Choisissez la meilleure pour votre projet</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {techniques.map((t, i) => (
            <div
              key={i}
              className="p-8 rounded-lg border"
              style={{
                background: PALETTE.white,
                borderColor: PALETTE.grayMed,
              }}
            >
              <p className="text-4xl mb-4">{t.icon}</p>
              <p className="font-black text-xl mb-1" style={{ color: PALETTE.black }}>
                {t.name}
              </p>
              <p className="text-sm mb-6" style={{ color: PALETTE.grayDark }}>
                {t.desc}
              </p>
              <ul className="space-y-2 mb-6">
                {t.points.map((pt, j) => (
                  <li key={j} className="text-sm" style={{ color: PALETTE.grayDark }}>
                    ✓ {pt}
                  </li>
                ))}
              </ul>
              <Link
                href="/configurateur"
                className="text-sm font-bold no-underline transition-all"
                style={{ color: PALETTE.blue }}
              >
                Commander →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TESTIMONIALS — 4 clients réels
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function TestimonialsSection() {
  const ref = useFadeIn()
  const testimonials = [
    { init: 'K', name: 'Karim B.', role: 'Restaurant El Kef', text: '80 polos brodés. Rendu impeccable, délai respecté. On recommande.' },
    { init: 'S', name: 'Samira M.', role: 'Clinique Al Chifa', text: 'Blouses brodées pour notre équipe. Qualité et précision au-dessus des attentes.' },
    { init: 'Y', name: 'Yacine O.', role: 'BTP Construct', text: '120 gilets en 5 jours. Troisième commande — régularité et sérieux garantis.' },
    { init: 'L', name: 'Lina K.', role: 'Brand Vert', text: 'J\'ai lancé ma marque sans stock. Design simple, qualité premium, clients adorent.' },
  ]

  return (
    <section className="py-24 px-6" style={{ background: PALETTE.white }}>
      <div className="max-w-6xl mx-auto">
        <div ref={ref} className="mb-16 text-center">
          <h2 className="text-4xl font-black mb-2" style={{ color: PALETTE.black }}>
            Ils nous font confiance
          </h2>
          <p style={{ color: PALETTE.grayDark }}>De vrais clients, de vrais retours</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="p-6 rounded-lg border"
              style={{
                background: PALETTE.grayLight,
                borderColor: PALETTE.grayMed,
              }}
            >
              <p className="text-sm italic mb-4" style={{ color: PALETTE.black }}>
                "{t.text}"
              </p>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm"
                  style={{ background: PALETTE.blue }}
                >
                  {t.init}
                </div>
                <div>
                  <p className="font-bold text-sm" style={{ color: PALETTE.black }}>
                    {t.name}
                  </p>
                  <p className="text-xs" style={{ color: PALETTE.grayDark }}>
                    {t.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// FINAL CTA — Action puissante
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function FinalCTA() {
  const ref = useFadeIn()

  return (
    <section 
      className="py-24 px-6"
      style={{ background: PALETTE.black, color: PALETTE.white }}
    >
      <div className="max-w-4xl mx-auto text-center" ref={ref}>
        <h2 className="text-4xl md:text-5xl font-black mb-6">
          Prêt à démarrer?
        </h2>
        <p className="text-lg mb-10" style={{ color: '#D1D5DB' }}>
          Devis gratuit · Réponse en 2h · Sans engagement
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/configurateur"
            className="px-8 py-4 rounded-lg font-bold no-underline transition-all"
            style={{
              background: PALETTE.blue,
              color: PALETTE.white,
            }}
          >
            Commencer maintenant →
          </Link>
          <a
            href="https://wa.me/213557440522"
            className="px-8 py-4 rounded-lg font-bold no-underline transition-all"
            style={{
              background: 'rgba(255,255,255,0.1)',
              color: PALETTE.white,
              border: `2px solid rgba(255,255,255,0.3)`,
            }}
          >
            💬 WhatsApp direct
          </a>
        </div>
      </div>
    </section>
  )
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MAIN EXPORT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export default function HomePageContent({ produits = [] }: { produits?: any[] }) {
  return (
    <main style={{ background: PALETTE.white }}>
      <Hero />
      <TrustSection />
      <BestsellersSection />
      <CollectionSection />
      <HowItWorks />
      <TechniquesSection />
      <TestimonialsSection />
      <FinalCTA />
    </main>
  )
}
