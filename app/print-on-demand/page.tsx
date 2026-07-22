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
  blue: '#0C4A6E',
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
      style={{ background: PALETTE.black, color: PALETTE.white }}
    >
      <div className="max-w-5xl mx-auto text-center" ref={ref}>
        <span
          className="inline-block px-4 py-2 rounded-full text-sm font-bold mb-6"
          style={{ background: 'rgba(132,204,22,0.15)', color: PALETTE.lime, border: `1px solid ${PALETTE.lime}` }}
        >
          🚀 Print on Demand
        </span>

        <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6">
          Lance ta marque en <span style={{ color: PALETTE.lime }}>30 jours</span>
        </h1>

        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-10" style={{ color: '#D1D5DB' }}>
          Zéro stock. Zéro investissement lourd. Tu crées, on produit, tu vends.
          Dès 1 pièce, production 48h à Alger.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto mb-10">
          <Link
            href="/designer"
            className="px-4 py-4 rounded-lg font-bold transition-all hover:scale-105 no-underline"
            style={{ background: PALETTE.lime, color: PALETTE.black }}
          >
            🎨 Crée ta marque
          </Link>
          <Link
            href="/collection"
            className="px-4 py-4 rounded-lg font-bold transition-all no-underline"
            style={{
              background: 'rgba(255,255,255,0.1)',
              color: PALETTE.white,
              border: '2px solid rgba(255,255,255,0.2)',
            }}
          >
            ⭐ Collection
          </Link>
          <Link
            href="/produits"
            className="px-4 py-4 rounded-lg font-bold transition-all no-underline"
            style={{
              background: 'rgba(255,255,255,0.1)',
              color: PALETTE.white,
              border: '2px solid rgba(255,255,255,0.2)',
            }}
          >
            👕 Produits
          </Link>
          <Link
            href="/studio-3d"
            className="px-4 py-4 rounded-lg font-bold transition-all no-underline"
            style={{
              background: 'rgba(255,255,255,0.1)',
              color: PALETTE.white,
              border: '2px solid rgba(255,255,255,0.2)',
            }}
          >
            🧊 Studio 3D
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-6 max-w-xl mx-auto">
          <div className="text-center">
            <p className="text-3xl font-black" style={{ color: PALETTE.lime }}>0</p>
            <p className="text-xs" style={{ color: '#9CA3AF' }}>Minimum commande</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-black" style={{ color: PALETTE.lime }}>48h</p>
            <p className="text-xs" style={{ color: '#9CA3AF' }}>Production Alger</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-black" style={{ color: PALETTE.lime }}>📱</p>
            <p className="text-xs" style={{ color: '#9CA3AF' }}>Suivi WhatsApp</p>
          </div>
        </div>
      </div>
    </section>
  )
}

function HowItWorksPOD() {
  const ref = useFadeIn()
  const steps = [
    { emoji: '🎨', title: 'Crée', desc: 'Ton design dans le Designer ou choisis dans la Collection' },
    { emoji: '🧊', title: 'Visualise', desc: 'Aperçu 3D réaliste de ta pièce avant production' },
    { emoji: '📦', title: 'Commande', desc: 'Dès 1 pièce, sans minimum, sans stock' },
    { emoji: '💰', title: 'Vends', desc: 'On produit et livre à ton client, tu gardes la marge' },
  ]
  return (
    <section className="py-20 px-6" style={{ background: PALETTE.grayLight }}>
      <div className="max-w-5xl mx-auto">
        <div ref={ref} className="mb-12 text-center">
          <h2 className="text-4xl font-black mb-2" style={{ color: PALETTE.black }}>
            Comment ça marche
          </h2>
          <p style={{ color: PALETTE.grayDark }}>Le Print on Demand, simplement</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <div key={i} className="text-center p-6 rounded-lg" style={{ background: PALETTE.white }}>
              <p className="text-5xl mb-3">{s.emoji}</p>
              <p className="font-black mb-2" style={{ color: PALETTE.black }}>{s.title}</p>
              <p className="text-sm" style={{ color: PALETTE.grayDark }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Benefits() {
  const ref = useFadeIn()
  const items = [
    { icon: '✨', title: 'Pas de stock', desc: 'Commande à la demande. Zéro risque d’invendu.' },
    { icon: '💰', title: 'Marges 70-80%', desc: 'Possible dès la première pièce vendue.' },
    { icon: '⚡', title: 'Test & Scale', desc: 'Teste 5 designs, scale sur celui qui marche.' },
    { icon: '🎨', title: 'Liberté créative', desc: 'DTF, broderie, flex — ton imagination est la limite.' },
    { icon: '📲', title: 'Suis les trends', desc: 'Trend TikTok? Produit en 48h et livré.' },
    { icon: '🌍', title: 'Vends partout', desc: 'Shopify, TikTok Shop, Instagram — on suit tes clients.' },
  ]
  return (
    <section className="py-20 px-6" style={{ background: PALETTE.white }}>
      <div className="max-w-5xl mx-auto">
        <div ref={ref} className="mb-12 text-center">
          <h2 className="text-4xl font-black mb-2" style={{ color: PALETTE.black }}>
            Pourquoi les créateurs nous choisissent
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((r, i) => (
            <div key={i} className="p-6 rounded-lg" style={{ background: PALETTE.grayLight }}>
              <p className="text-3xl mb-3">{r.icon}</p>
              <p className="font-bold mb-1" style={{ color: PALETTE.black }}>{r.title}</p>
              <p className="text-sm" style={{ color: PALETTE.grayDark }}>{r.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Tools() {
  const ref = useFadeIn()
  const tools = [
    {
      emoji: '🎨',
      title: 'Designer',
      desc: 'Crée ton design en ligne: textes, images, positionnement. Aperçu instantané.',
      href: '/designer',
      cta: 'Ouvrir le Designer →',
    },
    {
      emoji: '⭐',
      title: 'The Collection',
      desc: '18 designs exclusifs prêts à vendre: Automotive, Minimalist, Graphic & Art, Limited.',
      href: '/collection',
      cta: 'Voir la Collection →',
    },
    {
      emoji: '👕',
      title: 'Produits',
      desc: 'T-shirts, hoodies, polos, casquettes... 50+ supports de qualité premium.',
      href: '/produits',
      cta: 'Voir les Produits →',
    },
    {
      emoji: '🧊',
      title: 'Studio 3D',
      desc: 'Visualise ta pièce en 3D avant de commander. Rendu réaliste, zéro surprise.',
      href: '/studio-3d',
      cta: 'Ouvrir le Studio 3D →',
    },
  ]
  return (
    <section className="py-20 px-6" style={{ background: PALETTE.black, color: PALETTE.white }}>
      <div className="max-w-5xl mx-auto">
        <div ref={ref} className="mb-12 text-center">
          <h2 className="text-4xl font-black mb-2">Tes outils de créateur</h2>
          <p style={{ color: '#D1D5DB' }}>Tout ce qu’il faut pour lancer ta marque</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tools.map((t, i) => (
            <Link
              key={i}
              href={t.href}
              className="block p-8 rounded-2xl transition-all hover:scale-105 no-underline"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(132,204,22,0.3)',
              }}
            >
              <p className="text-5xl mb-4">{t.emoji}</p>
              <p className="text-xl font-black mb-2" style={{ color: PALETTE.white }}>{t.title}</p>
              <p className="text-sm mb-4" style={{ color: '#B0BEC5' }}>{t.desc}</p>
              <span className="font-bold text-sm" style={{ color: PALETTE.lime }}>{t.cta}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

function Stories() {
  const ref = useFadeIn()
  const items = [
    { name: 'Lina K.', brand: 'Brand Vert', story: '500+ clients en 6 mois. Zéro stock, zéro risque!' },
    { name: 'Riad M.', brand: 'Streetwear RDZ', story: 'Chaque trend TikTok produite en 48h. On vend direct!' },
    { name: 'Amira S.', brand: 'Art Wear DZ', story: 'Je crée, eux gèrent la logistique. Parfait!' },
  ]
  return (
    <section className="py-20 px-6" style={{ background: PALETTE.grayLight }}>
      <div className="max-w-5xl mx-auto">
        <div ref={ref} className="mb-12 text-center">
          <h2 className="text-4xl font-black mb-2" style={{ color: PALETTE.black }}>
            Ils ont lancé leur marque
          </h2>
          <p style={{ color: PALETTE.grayDark }}>De vrais créateurs algériens</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((s, i) => (
            <div
              key={i}
              className="p-6 rounded-lg"
              style={{ background: PALETTE.white, border: `1px solid ${PALETTE.grayMed}` }}
            >
              <p className="text-sm italic mb-4" style={{ color: PALETTE.black }}>"{s.story}"</p>
              <p className="font-bold text-sm" style={{ color: PALETTE.black }}>{s.name}</p>
              <p className="text-xs font-bold" style={{ color: PALETTE.lime }}>{s.brand}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Pricing() {
  const ref = useFadeIn()
  return (
    <section className="py-20 px-6" style={{ background: PALETTE.white }}>
      <div className="max-w-4xl mx-auto">
        <div ref={ref} className="mb-12 text-center">
          <h2 className="text-4xl font-black mb-2" style={{ color: PALETTE.black }}>Tarifs créateur</h2>
          <p style={{ color: PALETTE.grayDark }}>Dès 1 pièce, sans minimum</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-lg" style={{ background: PALETTE.grayLight }}>
            <p className="font-bold mb-1" style={{ color: PALETTE.black }}>DTF Simple</p>
            <p className="text-3xl font-black mb-4" style={{ color: PALETTE.black }}>
              1 950 <span className="text-base">DA</span>
            </p>
            <Link
              href="/designer"
              className="block w-full py-2 rounded text-center font-bold text-sm no-underline"
              style={{ background: PALETTE.lime, color: PALETTE.black }}
            >
              Démarrer →
            </Link>
          </div>

          <div
            className="p-6 rounded-lg"
            style={{ background: PALETTE.black, color: PALETTE.white, border: `2px solid ${PALETTE.lime}` }}
          >
            <p className="text-xs font-bold mb-1" style={{ color: PALETTE.lime }}>POPULAIRE</p>
            <p className="font-bold mb-1">DTF Full Color</p>
            <p className="text-3xl font-black mb-4" style={{ color: PALETTE.lime }}>
              2 450 <span className="text-base">DA</span>
            </p>
            <Link
              href="/designer"
              className="block w-full py-2 rounded text-center font-bold text-sm no-underline"
              style={{ background: PALETTE.lime, color: PALETTE.black }}
            >
              Démarrer →
            </Link>
          </div>

          <div className="p-6 rounded-lg" style={{ background: PALETTE.grayLight }}>
            <p className="font-bold mb-1" style={{ color: PALETTE.black }}>Broderie Premium</p>
            <p className="text-3xl font-black mb-4" style={{ color: PALETTE.black }}>
              3 950 <span className="text-base">DA</span>
            </p>
            <a
              href="https://wa.me/213557440522"
              className="block w-full py-2 rounded text-center font-bold text-sm no-underline"
              style={{ border: `2px solid ${PALETTE.lime}`, color: PALETTE.black }}
            >
              Infos →
            </a>
          </div>
        </div>
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
        background: `linear-gradient(135deg, ${PALETTE.black} 0%, ${PALETTE.blue} 100%)`,
        color: PALETTE.white,
      }}
    >
      <div className="max-w-4xl mx-auto text-center" ref={ref}>
        <h2 className="text-5xl md:text-6xl font-black mb-4">Prêt à te lancer?</h2>
        <p className="text-lg mb-10" style={{ color: '#D1D5DB' }}>
          Commence maintenant. Zéro stock. Zéro risque.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/designer"
            className="px-8 py-4 rounded-lg font-bold transition-all hover:scale-105 no-underline"
            style={{ background: PALETTE.lime, color: PALETTE.black }}
          >
            🎨 Crée ta marque →
          </Link>
          <Link
            href="/studio-3d"
            className="px-8 py-4 rounded-lg font-bold transition-all no-underline"
            style={{
              background: 'rgba(255,255,255,0.1)',
              color: PALETTE.white,
              border: '2px solid rgba(255,255,255,0.3)',
            }}
          >
            🧊 Studio 3D
          </Link>
          <a
            href="https://wa.me/213557440522"
            className="px-8 py-4 rounded-lg font-bold transition-all no-underline"
            style={{
              background: 'rgba(255,255,255,0.1)',
              color: PALETTE.white,
              border: '2px solid rgba(255,255,255,0.3)',
            }}
          >
            💬 WhatsApp
          </a>
        </div>
      </div>
    </section>
  )
}

export default function PagePrintOnDemand() {
  return (
    <main>
      <Hero />
      <HowItWorksPOD />
      <Benefits />
      <Tools />
      <Stories />
      <Pricing />
      <FinalCTA />
    </main>
  )
}
