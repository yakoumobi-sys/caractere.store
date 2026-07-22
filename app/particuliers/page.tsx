'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

const PALETTE = { black: '#0C1A26', white: '#FFFFFF', grayLight: '#F3F4F6', grayMed: '#E5E7EB', grayDark: '#6B7280', lime: '#84CC16', blue: '#0C4A6E' }

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

function HeroParticuliers() {
  const ref = useFadeIn(0)
  return (
    <section className="relative w-full pt-16 pb-24 px-6" style={{ background: PALETTE.black, color: PALETTE.white }}>
      <div className="max-w-6xl mx-auto relative">
        <div ref={ref} className="text-center">
          <span className="inline-block px-4 py-2 rounded-full text-sm font-bold mb-4" style={{ background: `${PALETTE.lime}20`, color: PALETTE.lime, border: `1px solid ${PALETTE.lime}` }}>🚀 Pour les créateurs</span>
          <h1 className="text-6xl md:text-7xl font-black leading-tight mb-4 max-w-5xl mx-auto">Lance ta marque en <span style={{ color: PALETTE.lime }}>30 jours</span></h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8" style={{ color: '#D1D5DB' }}>Zéro stock. Zéro investissement. Juste ta créativité + Caractère.</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/designer" className="px-8 py-4 rounded-lg text-lg font-bold transition-all hover:scale-105 inline-block" style={{ background: PALETTE.lime, color: PALETTE.black }}>
              Ouvrir Designer →
            </Link>
            <Link href="/collection" className="px-8 py-4 rounded-lg text-lg font-bold transition-all inline-block" style={{ background: 'rgba(255,255,255,0.1)', color: PALETTE.white, border: `2px solid rgba(255,255,255,0.2)` }}>
              Voir la collection
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

function WhyForCreators() {
  const ref = useFadeIn()
  return (
    <section className="py-16 px-6" style={{ background: PALETTE.grayLight }}>
      <div className="max-w-6xl mx-auto">
        <div ref={ref} className="text-center mb-12">
          <h2 className="text-4xl font-black mb-2" style={{ color: PALETTE.black }}>Pourquoi nous?</h2>
          <p style={{ color: PALETTE.grayDark }}>6 raisons choisir Caractère</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: '✨', title: 'Pas de minimum', desc: 'À partir de 1 pièce, zéro risque' },
            { icon: '💰', title: 'Margins 70-80%', desc: 'Dès ta première vente' },
            { icon: '⚡', title: 'Réponse 48h', desc: 'Production garantie à Alger' },
            { icon: '🎨', title: 'Liberté créative', desc: 'DTF, broderie, flex... tout possible' },
            { icon: '📲', title: 'Trends rapides', desc: 'TikTok trend? Produit en 2 jours' },
            { icon: '🌍', title: 'Vends partout', desc: 'Shopify, Tiktok Shop, Instag...' },
          ].map((r, i) => (
            <div key={i} className="p-6 rounded-lg" style={{ background: PALETTE.white }}>
              <p className="text-3xl mb-2">{r.icon}</p>
              <p className="font-bold mb-1" style={{ color: PALETTE.black }}>{r.title}</p>
              <p className="text-sm" style={{ color: PALETTE.grayDark }}>{r.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CustomerStories() {
  const ref = useFadeIn()
  return (
    <section className="py-16 px-6" style={{ background: PALETTE.black, color: PALETTE.white }}>
      <div className="max-w-6xl mx-auto">
        <div ref={ref} className="mb-12 text-center">
          <h2 className="text-4xl font-black mb-2">Ça marche</h2>
          <p style={{ color: '#D1D5DB' }}>De vrais créateurs, de vrais résultats</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: 'Lina K.', brand: 'Brand Vert', story: '500+ clients en 6 mois. Zéro stock, zéro risque! 🚀' },
            { name: 'Riad M.', brand: 'Streetwear RDZ', story: 'Chaque trend TikTok en 48h. On vend direct!' },
            { name: 'Amira S.', brand: 'Art Wear DZ', story: 'Je crée, eux gèrent la logistique. Parfait!' },
          ].map((s, i) => (
            <div key={i} className="p-6 rounded-lg" style={{ background: 'rgba(255,255,255,0.08)', border: `1px solid ${PALETTE.lime}40` }}>
              <p className="text-sm italic mb-4" style={{ color: '#E0E0E0' }}>"{s.story}"</p>
              <p className="font-bold text-sm">{s.name}</p>
              <p style={{ color: PALETTE.lime }} className="text-xs">{s.brand}</p>
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
    <section className="py-16 px-6" style={{ background: PALETTE.grayLight }}>
      <div className="max-w-6xl mx-auto">
        <div ref={ref} className="mb-12 text-center">
          <h2 className="text-4xl font-black mb-2" style={{ color: PALETTE.black }}>Tarifs</h2>
          <p style={{ color: PALETTE.grayDark }}>À partir de 1 pièce</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="p-6 rounded-lg" style={{ background: PALETTE.white }}>
            <p className="font-bold mb-1" style={{ color: PALETTE.black }}>DTF Simple</p>
            <p className="text-3xl font-black mb-4" style={{ color: PALETTE.black }}>1 950 <span className="text-lg">DA</span></p>
            <Link href="/designer" className="w-full block py-2 rounded text-center font-bold text-sm" style={{ background: PALETTE.lime, color: PALETTE.black }}>Démarrer →</Link>
          </div>

          <div className="p-6 rounded-lg" style={{ background: PALETTE.black, color: PALETTE.white, border: `2px solid ${PALETTE.lime}` }}>
            <p className="font-bold mb-1">DTF Full Color</p>
            <p className="text-3xl font-black mb-4" style={{ color: PALETTE.lime }}>2 450 <span className="text-lg">DA</span></p>
            <Link href="/designer" className="w-full block py-2 rounded text-center font-bold text-sm" style={{ background: PALETTE.lime, color: PALETTE.black }}>Démarrer →</Link>
          </div>

          <div className="p-6 rounded-lg" style={{ background: PALETTE.white }}>
            <p className="font-bold mb-1" style={{ color: PALETTE.black }}>Broderie Premium</p>
            <p className="text-3xl font-black mb-4" style={{ color: PALETTE.black }}>3 950 <span className="text-lg">DA</span></p>
            <button className="w-full py-2 rounded text-sm font-bold border-2" style={{ borderColor: PALETTE.lime, color: PALETTE.lime }}>Infos →</button>
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
          <h2 className="text-4xl font-black mb-2" style={{ color: PALETTE.black }}>4 étapes</h2>
          <p style={{ color: PALETTE.grayDark }}>De l\'idée à ta main</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
          {[
            { emoji: '🎨', title: 'Design' },
            { emoji: '📦', title: 'Choix pièce' },
            { emoji: '✅', title: 'Valide' },
            { emoji: '🚚', title: 'Reçois' },
          ].map((s, i) => (
            <div key={i}>
              <p className="text-4xl mb-2">{s.emoji}</p>
              <p className="font-bold text-sm" style={{ color: PALETTE.black }}>{s.title}</p>
              {i < 3 && <p className="text-xl mt-2" style={{ color: PALETTE.lime }}>↓</p>}
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
    <section className="py-24 px-6" style={{ background: `linear-gradient(135deg, ${PALETTE.black} 0%, ${PALETTE.blue} 100%)`, color: PALETTE.white }}>
      <div className="max-w-4xl mx-auto text-center" ref={ref}>
        <h2 className="text-5xl md:text-6xl font-black mb-4">T'es prêt?</h2>
        <p className="text-lg mb-8" style={{ color: '#D1D5DB' }}>Commence maintenant. Zéro risque.</p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/designer" className="px-8 py-4 rounded-lg font-bold transition-all hover:scale-105 inline-block" style={{ background: PALETTE.lime, color: PALETTE.black }}>
            Ouvrir Designer →
          </Link>
          <a href="https://wa.me/213557440522" className="px-8 py-4 rounded-lg font-bold transition-all hover:scale-105 inline-block" style={{ background: 'rgba(255,255,255,0.1)', color: PALETTE.white, border: `2px solid rgba(255,255,255,0.3)` }}>
            💬 WhatsApp
          </a>
        </div>
      </div>
    </section>
  )
}

export default function PageParticuliers() {
  return (
    <main>
      <HeroParticuliers />
      <WhyForCreators />
      <CustomerStories />
      <Pricing />
      <Process />
      <FinalCTA />
    </main>
  )
}
