'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'

const PALETTE = {
  black: '#0C1A26',
  white: '#FFFFFF',
  grayLight: '#F3F4F6',
  grayMed: '#E5E7EB',
  grayDark: '#6B7280',
  lime: '#84CC16',
  gold: '#D4A574',
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
      className="w-full pt-20 pb-16 px-6"
      style={{ background: PALETTE.black, color: PALETTE.white }}
    >
      <div className="max-w-5xl mx-auto text-center" ref={ref}>
        <div className="text-8xl font-black mb-8">C</div>
        <h1 className="text-5xl md:text-6xl font-black leading-tight tracking-tight mb-6">
          Personnalisez. Développez. Livrez.
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto" style={{ color: '#D1D5DB' }}>
          Atelier de personnalisation textile à Alger. DTF, broderie, uniformes.
          Production 48h, livraison nationale.
        </p>
      </div>
    </section>
  )
}

function ChoicePaths() {
  const ref = useFadeIn(100)
  return (
    <section className="w-full py-16 px-6" style={{ background: PALETTE.black }}>
      <div className="max-w-5xl mx-auto" ref={ref}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <Link
            href="/entreprise"
            className="block p-10 rounded-2xl transition-all hover:scale-105 no-underline"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: `2px solid ${PALETTE.gold}`,
            }}
          >
            <p className="text-5xl mb-4">🏢</p>
            <h2 className="text-2xl font-black mb-3" style={{ color: PALETTE.gold }}>
              Vous êtes une entreprise
            </h2>
            <p className="mb-6" style={{ color: '#B0BEC5' }}>
              Uniformes, polos brodés, gilets de chantier, blouses.
              Rabais volume jusqu’à -30%.
            </p>
            <span
              className="inline-block px-6 py-3 rounded-lg font-bold"
              style={{ background: PALETTE.gold, color: PALETTE.black }}
            >
              Espace Entreprise →
            </span>
          </Link>

          <Link
            href="/print-on-demand"
            className="block p-10 rounded-2xl transition-all hover:scale-105 no-underline"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: `2px solid ${PALETTE.lime}`,
            }}
          >
            <p className="text-5xl mb-4">🚀</p>
            <h2 className="text-2xl font-black mb-3" style={{ color: PALETTE.lime }}>
              Vous êtes un créateur
            </h2>
            <p className="mb-6" style={{ color: '#B0BEC5' }}>
              Lancez votre marque sans stock. Print on Demand dès 1 pièce.
              Designer en ligne + Studio 3D.
            </p>
            <span
              className="inline-block px-6 py-3 rounded-lg font-bold"
              style={{ background: PALETTE.lime, color: PALETTE.black }}
            >
              Print on Demand →
            </span>
          </Link>

        </div>
      </div>
    </section>
  )
}

function TrustSection() {
  const ref = useFadeIn()
  const stats = [
    { number: '50K+', label: 'Pièces produites' },
    { number: '500+', label: 'Marques & entreprises' },
    { number: '4.9★', label: 'Note clients' },
    { number: '48h', label: 'Délai production' },
  ]
  return (
    <section className="py-16 px-6" style={{ background: PALETTE.grayLight }}>
      <div className="max-w-5xl mx-auto">
        <div ref={ref} className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <div key={i} className="text-center">
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

function QuickLinks() {
  const ref = useFadeIn()
  const links = [
    { emoji: '👕', label: 'Produits', href: '/produits' },
    { emoji: '⭐', label: 'The Collection', href: '/collection' },
    { emoji: '🎨', label: 'Designer', href: '/designer' },
    { emoji: '🧊', label: 'Studio 3D', href: '/studio-3d' },
  ]
  return (
    <section className="py-16 px-6" style={{ background: PALETTE.white }}>
      <div className="max-w-5xl mx-auto" ref={ref}>
        <h2 className="text-3xl font-black mb-8 text-center" style={{ color: PALETTE.black }}>
          Accès rapide
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {links.map((l, i) => (
            <Link
              key={i}
              href={l.href}
              className="p-6 rounded-lg text-center transition-all hover:shadow-lg no-underline"
              style={{ background: PALETTE.grayLight, border: `1px solid ${PALETTE.grayMed}` }}
            >
              <p className="text-4xl mb-2">{l.emoji}</p>
              <p className="font-bold" style={{ color: PALETTE.black }}>{l.label}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

function FinalCTA() {
  const ref = useFadeIn()
  return (
    <section className="py-20 px-6" style={{ background: PALETTE.black, color: PALETTE.white }}>
      <div className="max-w-4xl mx-auto text-center" ref={ref}>
        <h2 className="text-4xl font-black mb-4">Une question?</h2>
        <p className="text-lg mb-8" style={{ color: '#D1D5DB' }}>
          Réponse en 2h · Devis gratuit · Sans engagement
        </p>
        <a
          href="https://wa.me/213557440522"
          className="inline-block px-8 py-4 rounded-lg font-bold transition-all hover:scale-105 no-underline"
          style={{ background: PALETTE.white, color: PALETTE.black }}
        >
          💬 WhatsApp direct
        </a>
      </div>
    </section>
  )
}

export default function HomePageContent({ produits = [] }: { produits?: any[] }) {
  return (
    <main style={{ background: PALETTE.white }}>
      <Hero />
      <ChoicePaths />
      <TrustSection />
      <QuickLinks />
      <FinalCTA />
    </main>
  )
}
