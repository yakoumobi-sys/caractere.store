'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

// ─── Palette ────────────────────────────────────────────────────────────────
const C = {
  blue:    '#0C4A6E',
  blueMid: '#1E6FA8',
  blueAcc: '#38BDF8',
  black:   '#0C1A26',
  gray1:   '#F0F7FF',
  gray2:   '#BAE6FD',
  gray3:   '#7DD3FC',
  gray4:   '#1E3A5F',
  white:   '#FFFFFF',
  green:   '#16A34A',
  greenLt: '#DCFCE7',
  blueLt:  '#EFF6FF',
}

// ─── Utilitaires ────────────────────────────────────────────────────────────
function useFadeIn(delay = 0) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.opacity = '0'
    el.style.transform = 'translateY(20px)'
    el.style.transition = `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.style.opacity = '1'; el.style.transform = 'translateY(0)' } },
      { threshold: 0.1 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [delay])
  return ref
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-[0.15em] uppercase mb-3" style={{ color: C.blueMid }}>
      {children}
    </p>
  )
}

// ─── Images produits ────────────────────────────────────────────────────────
const BASE = 'https://aijlvbipvqnvbywxhlbd.supabase.co/storage/v1/object/public/image'
const PRODUCT_IMAGES: Record<string, string> = {
  'T-shirt':               BASE + '/IMG_5850.jpeg',
  'T-shirt Oversized 250GSM': BASE + '/tshirt-oversized.jpeg',
  'Polo':                  BASE + '/IMG_5851.jpeg',
  'Casquette':             BASE + '/IMG_5853.jpeg',
  'Totebag':               BASE + '/IMG_5854.jpeg',
  'Gilet de travail':      BASE + '/IMG_5852.jpeg',
  'Gilet de securite':     BASE + '/images.jpg',
  'Tablier':               BASE + '/png-clipart-apron-apron-thumbnail.png',
  'Hoodie':                BASE + '/IMG_5850.jpeg',
}

// ─── CATALOGUE produits (fallback si Supabase vide) ──────────────────────────
const PRODUITS_FALLBACK = [
  { id: 'tshirt',            nom: 'T-shirt',             badge: '100% coton',       prix: 1950, tag: 'Bestseller', technique: 'DTF · Broderie' },
  { id: 'tshirt_oversized',  nom: 'T-shirt Oversized',   badge: '250 GSM premium',  prix: 3200, tag: 'Premium',    technique: 'DTF · Broderie' },
  { id: 'polo',              nom: 'Polo',                badge: 'Piqué coton',      prix: 2300, tag: null,         technique: 'DTF · Broderie' },
  { id: 'gilet',             nom: 'Gilet de travail',    badge: 'Multipoches',      prix: 2500, tag: null,         technique: 'DTF · Broderie' },
  { id: 'casquette',         nom: 'Casquette',           badge: 'Structurée',       prix: 1200, tag: null,         technique: 'Broderie' },
  { id: 'totebag',           nom: 'Tote Bag',            badge: 'Canvas premium',   prix: 950,  tag: null,         technique: 'DTF' },
]

/* ══════════════════════════════════════════════════════════════════════════════
   HERO — Layout 2 colonnes à la Tapstitch
══════════════════════════════════════════════════════════════════════════════ */
function Hero() {
  const LOGO = 'https://aijlvbipvqnvbywxhlbd.supabase.co/storage/v1/object/public/image/logo-white-transparent.png'
  const leftRef  = useFadeIn(0)
  const rightRef = useFadeIn(150)

  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: 'linear-gradient(150deg, #0C4A6E 0%, #0E5E8A 50%, #38BDF8 100%)',
        minHeight: '100vh',
        paddingTop: '72px',
      }}
    >
      {/* Grille de fond */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)`,
        backgroundSize: '48px 48px',
      }} />
      {/* Halo */}
      <div className="absolute pointer-events-none" style={{ top: -200, right: -200, width: 700, height: 700, background: 'radial-gradient(circle, rgba(56,189,248,0.25) 0%, transparent 70%)' }} />

      <div className="relative max-w-[1200px] mx-auto px-6 lg:px-10 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* ── Colonne texte ── */}
          <div ref={leftRef}>
            <img src={LOGO} alt="Caractère" className="h-14 w-auto object-contain mb-8" />

            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[12px] font-bold border mb-6"
              style={{ background: 'rgba(255,255,255,0.12)', color: '#BAE6FD', borderColor: 'rgba(255,255,255,0.25)' }}>
              ✦ Impression textile premium · Alger
            </span>

            <h1 className="font-black leading-[1.05] tracking-tight mb-5"
              style={{ fontSize: 'clamp(36px,5vw,60px)', color: '#FFFFFF', letterSpacing: '-0.025em' }}>
              Votre logo.<br />
              <span style={{ color: '#BAE6FD' }}>Nos machines.</span><br />
              Votre marque.
            </h1>

            <p className="mb-8 max-w-md leading-relaxed" style={{ fontSize: '17px', color: 'rgba(255,255,255,0.75)' }}>
              Broderie, DTF, uniformes B2B — dès 1 pièce. Devis gratuit sous 2h, production en 48h.
            </p>

            {/* CTAs principaux */}
            <div className="flex flex-wrap gap-3 mb-10">
              <Link href="/configurateur"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-[15px] font-bold no-underline transition-all hover:-translate-y-0.5"
                style={{ background: '#FFFFFF', color: C.blue, boxShadow: '0 8px 24px rgba(0,0,0,0.25)' }}>
                Configurer ma commande →
              </Link>
              <Link href="/designer"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-[15px] font-bold no-underline transition-all border-2 hover:-translate-y-0.5"
                style={{ color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.08)' }}>
                Open Designer ✏️
              </Link>
            </div>

            {/* 3 cards service — style Tapstitch */}
            <div className="flex flex-col gap-2">
              {[
                { emoji: '🖨️', title: 'Print on Demand', desc: 'Lancez votre marque sans stock.', href: '/designer' },
                { emoji: '🏢', title: 'Entreprises & B2B', desc: 'Uniformes sur-mesure pour votre équipe.', href: '/configurateur' },
                { emoji: '👕', title: 'Collection Caractère', desc: 'Pièces premium prêtes à porter.', href: '/collection' },
              ].map(card => (
                <Link key={card.title} href={card.href}
                  className="group flex items-center justify-between px-5 py-3.5 rounded-2xl border no-underline hover:shadow-md hover:-translate-y-0.5 transition-all"
                  style={{ background: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(12px)' }}>
                  <div className="flex items-center gap-3">
                    <span className="text-[20px]">{card.emoji}</span>
                    <div>
                      <p className="text-[13px] font-bold text-white leading-tight">{card.title}</p>
                      <p className="text-[12px]" style={{ color: 'rgba(255,255,255,0.6)' }}>{card.desc}</p>
                    </div>
                  </div>
                  <span className="text-[12px] font-bold flex-shrink-0 ml-3" style={{ color: '#BAE6FD' }}>→</span>
                </Link>
              ))}
            </div>
          </div>

          {/* ── Colonne visuelle ── */}
          <div ref={rightRef} className="relative hidden lg:flex items-center justify-center" style={{ height: '580px' }}>

            {/* Carte produit centrale */}
            <div className="relative w-[300px] h-[360px] rounded-[28px] overflow-hidden flex flex-col items-center justify-center"
              style={{ background: 'linear-gradient(145deg, #F0F7FF 0%, #E0EEFF 100%)', boxShadow: '0 32px 80px rgba(12,74,110,0.25)' }}>
              <img
                src={BASE + '/IMG_5850.jpeg'}
                alt="T-shirt premium"
                className="w-full h-[220px] object-cover"
              />
              <div className="p-5 w-full">
                <p className="text-[14px] font-black mb-0.5" style={{ color: C.black }}>T-shirt Premium 250 GSM</p>
                <p className="text-[11px] mb-3" style={{ color: C.gray4 }}>Broderie · DTF · dès 1 pièce</p>
                <div className="flex gap-1.5 mb-3">
                  {['#1A1A1A','#2563EB','#DC2626','#166534','#D6B99A'].map(hex => (
                    <div key={hex} className="w-5 h-5 rounded-full border-2 border-white shadow-sm" style={{ background: hex }} />
                  ))}
                </div>
                <Link href="/designer?product=tshirt"
                  className="block w-full py-2 rounded-xl text-[12px] font-bold text-white text-center no-underline"
                  style={{ background: C.blue }}>
                  Personnaliser →
                </Link>
              </div>
            </div>

            {/* Floating cards */}
            {/* Commande en cours */}
            <div className="absolute animate-float-slow" style={{ top: 30, left: -30, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(16px)', borderRadius: 16, border: `1px solid ${C.gray2}`, padding: '10px 14px', boxShadow: '0 8px 24px rgba(0,0,0,0.10)', minWidth: 190 }}>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold" style={{ background: C.blueLt, color: C.blue }}>POD</div>
                <div>
                  <p className="text-[11px] font-bold" style={{ color: C.black }}>Commande #5841</p>
                  <p className="text-[10px]" style={{ color: C.gray4 }}>En production · 48h</p>
                </div>
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse ml-1" />
              </div>
            </div>

            {/* Vente */}
            <div className="absolute animate-float" style={{ top: 150, right: -35, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(16px)', borderRadius: 16, border: `1px solid ${C.gray2}`, padding: '10px 14px', boxShadow: '0 8px 24px rgba(0,0,0,0.10)', minWidth: 170 }}>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold" style={{ background: C.greenLt, color: C.green }}>+1</div>
                <div>
                  <p className="text-[11px] font-bold" style={{ color: C.black }}>Nouvelle vente</p>
                  <p className="text-[10px]" style={{ color: C.green }}>Hoodie · 3 800 DA</p>
                </div>
              </div>
            </div>

            {/* Livraison */}
            <div className="absolute" style={{ bottom: 120, left: -35, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(16px)', borderRadius: 16, border: `1px solid ${C.gray2}`, padding: '10px 14px', boxShadow: '0 8px 24px rgba(0,0,0,0.10)', minWidth: 175 }}>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold" style={{ background: '#FFF7ED', color: '#EA580C' }}>🚚</div>
                <div>
                  <p className="text-[11px] font-bold" style={{ color: C.black }}>Expédié aujourd'hui</p>
                  <p className="text-[10px]" style={{ color: C.gray4 }}>Constantine · #5832</p>
                </div>
              </div>
            </div>

            {/* Note */}
            <div className="absolute" style={{ bottom: 35, right: -20, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(16px)', borderRadius: 16, border: `1px solid ${C.gray2}`, padding: '10px 14px', boxShadow: '0 8px 24px rgba(0,0,0,0.10)', minWidth: 145 }}>
              <div className="flex items-center gap-2">
                <span className="text-[18px]">⭐</span>
                <div>
                  <p className="text-[11px] font-bold" style={{ color: C.black }}>4.9 / 5</p>
                  <p className="text-[10px]" style={{ color: C.gray4 }}>500+ avis clients</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats rapides */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-[800px]">
          {[
            { v: '50 000+', l: 'Pièces produites' },
            { v: '1 pièce', l: 'Minimum de commande' },
            { v: '48h', l: 'Délai de production' },
            { v: '297K', l: 'Abonnés Instagram' },
          ].map(s => (
            <div key={s.l}>
              <p className="text-[28px] font-black text-white tracking-tight leading-none">{s.v}</p>
              <p className="text-[12px] mt-1" style={{ color: 'rgba(255,255,255,0.6)' }}>{s.l}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════════════════
   COMMENT ÇA MARCHE — 4 étapes à la Tapstitch
══════════════════════════════════════════════════════════════════════════════ */
function HowItWorks() {
  const ref = useFadeIn()
  const steps = [
    { n: '01', emoji: '🛍️', title: 'Choisissez votre produit', desc: 'T-shirt, polo, gilet, casquette… catalogue textile premium avec images HD.' },
    { n: '02', emoji: '🎨', title: 'Uploadez votre design', desc: 'Glissez votre logo dans le Designer ou passez par le Configurateur. Prévisualisation en temps réel.' },
    { n: '03', emoji: '🖨️', title: 'On produit', desc: 'DTF ou broderie — production en 48h à Alger. Contrôle qualité sur chaque pièce.' },
    { n: '04', emoji: '🚚', title: 'On livre', desc: 'Livraison nationale 3–5 jours. Retrait atelier disponible. Suivi de commande en temps réel.' },
  ]
  return (
    <section style={{ background: C.white, padding: '96px 0' }}>
      <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
        <div ref={ref} className="text-center mb-16">
          <Label>Comment ça fonctionne</Label>
          <h2 className="font-black tracking-tight" style={{ fontSize: 'clamp(28px,4vw,46px)', color: C.black, letterSpacing: '-0.025em' }}>
            De l'idée à la livraison<br />en 4 étapes.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => {
            const stepRef = useFadeIn(i * 80)
            return (
              <div key={step.n} ref={stepRef} className="relative group">
                {/* Connecteur */}
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[calc(100%-8px)] w-full h-px z-0" style={{ background: `linear-gradient(90deg, ${C.gray2}, transparent)` }} />
                )}
                <div className="relative z-10 p-6 rounded-[24px] border hover:shadow-lg hover:-translate-y-1 transition-all" style={{ background: C.gray1, borderColor: C.gray2 }}>
                  {/* Numéro + emoji */}
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-[22px]" style={{ background: C.white, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
                      {step.emoji}
                    </div>
                    <span className="text-[32px] font-black tracking-tighter" style={{ color: C.gray2, lineHeight: 1 }}>{step.n}</span>
                  </div>
                  <h3 className="font-bold text-[16px] mb-2 leading-tight" style={{ color: C.black }}>{step.title}</h3>
                  <p className="text-[13px] leading-relaxed" style={{ color: C.gray4 }}>{step.desc}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* CTA sous les étapes */}
        <div className="mt-12 text-center">
          <Link href="/configurateur"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-[15px] font-bold no-underline hover:-translate-y-0.5 transition-all"
            style={{ background: C.blue, color: C.white, boxShadow: '0 8px 24px rgba(12,74,110,0.25)' }}>
            Démarrer ma commande →
          </Link>
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════════════════
   PRODUITS — Grille style Tapstitch
══════════════════════════════════════════════════════════════════════════════ */
function ProduitCard({ produit, delay }: { produit: any; delay: number }) {
  const ref    = useFadeIn(delay)
  const imgUrl = PRODUCT_IMAGES[produit.nom] || (BASE + '/IMG_5509.png')
  const fallback = PRODUITS_FALLBACK.find(p => p.id === produit.id || p.nom === produit.nom)

  return (
    <div ref={ref} className="group rounded-[24px] border overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all bg-white"
      style={{ borderColor: C.gray2 }}>
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden" style={{ background: C.gray1 }}>
        {fallback?.tag && (
          <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold text-white z-10" style={{ background: C.blue }}>
            {fallback.tag}
          </span>
        )}
        {fallback?.technique && (
          <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-semibold z-10"
            style={{ background: 'rgba(12,74,110,0.1)', color: C.blue }}>
            {fallback.technique}
          </span>
        )}
        <img
          src={imgUrl}
          alt={produit.nom}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Infos */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <p className="font-bold text-[15px] leading-tight" style={{ color: C.black }}>{produit.nom}</p>
            <p className="text-[12px] mt-0.5" style={{ color: C.gray4 }}>{fallback?.badge || produit.description}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="font-black text-[16px] leading-tight" style={{ color: C.black }}>
              {(produit.prix_base || fallback?.prix || 0).toLocaleString('fr-FR')} DA
            </p>
            <p className="text-[11px]" style={{ color: C.gray3 }}>/ pièce</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Link
            href={`/designer?product=${produit.id || fallback?.id}`}
            className="flex-1 flex items-center justify-center py-2.5 rounded-xl text-[13px] font-bold no-underline transition-all"
            style={{ background: C.blueLt, color: C.blue }}>
            Designer ✏️
          </Link>
          <Link
            href={`/configurateur?produit=${encodeURIComponent(produit.nom)}`}
            className="flex-1 flex items-center justify-center py-2.5 rounded-xl text-[13px] font-bold no-underline transition-all"
            style={{ background: C.gray1, color: C.black }}>
            Commander →
          </Link>
        </div>
      </div>
    </div>
  )
}

function ProduitsSection({ produits }: { produits: any[] }) {
  const ref  = useFadeIn()
  const data = produits.length > 0 ? produits : PRODUITS_FALLBACK

  return (
    <section style={{ background: C.gray1, padding: '96px 0' }}>
      <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
        {/* Header */}
        <div ref={ref} className="flex items-end justify-between mb-12 flex-wrap gap-4">
          <div>
            <Label>Catalogue</Label>
            <h2 className="font-black tracking-tight" style={{ fontSize: 'clamp(28px,4vw,44px)', color: C.black, letterSpacing: '-0.025em' }}>
              Produits populaires.
            </h2>
            <p className="mt-2 text-[15px]" style={{ color: C.gray4 }}>
              Broderie ou DTF — de 1 à 10 000 pièces, prix dégressif.
            </p>
          </div>
          <Link href="/produits" className="text-[14px] font-bold no-underline flex items-center gap-1" style={{ color: C.blue }}>
            Voir le catalogue complet →
          </Link>
        </div>

        {/* Grille */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-5">
          {data.slice(0, 6).map((p, i) => (
            <ProduitCard key={p.id || p.nom} produit={p} delay={i * 60} />
          ))}
        </div>

        {/* Banner B2B */}
        <div className="mt-8 rounded-[24px] p-8 flex flex-col md:flex-row items-center justify-between gap-6"
          style={{ background: `linear-gradient(135deg, ${C.blue} 0%, ${C.blueMid} 100%)` }}>
          <div>
            <p className="text-[18px] font-black text-white mb-1">Commande entreprise ou volume ?</p>
            <p className="text-[14px]" style={{ color: 'rgba(255,255,255,0.75)' }}>
              Devis personnalisé · Remise dès 50 pièces · Livraison B2B
            </p>
          </div>
          <a href="https://wa.me/213557440522" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-6 py-3.5 rounded-full text-[14px] font-bold no-underline flex-shrink-0 transition-all hover:-translate-y-0.5"
            style={{ background: '#25D366', color: C.white, boxShadow: '0 4px 16px rgba(37,211,102,0.35)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Demander un devis
          </a>
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════════════════
   TECHNIQUES — DTF vs Broderie
══════════════════════════════════════════════════════════════════════════════ */
function TechniquesSection() {
  const ref = useFadeIn()
  return (
    <section style={{ background: C.white, padding: '96px 0' }}>
      <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
        <div ref={ref} className="text-center mb-14">
          <Label>Nos techniques</Label>
          <h2 className="font-black tracking-tight" style={{ fontSize: 'clamp(28px,4vw,44px)', color: C.black, letterSpacing: '-0.025em' }}>
            La meilleure technique<br />pour chaque projet.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* DTF */}
          {[
            {
              id: 'dtf',
              label: 'DTF — Direct to Film',
              emoji: '🖨️',
              title: 'Impression DTF',
              subtitle: 'Machines Epson I3200 · Format jusqu\'à 60cm',
              desc: 'Couleurs illimitées, dégradés parfaits, fond transparent. Idéal pour les logos complexes et les designs multi-couleurs.',
              specs: ['Rendu photographique', 'Résistant au lavage 40+', 'Tous types de tissus', 'Dès 1 pièce'],
              bg: '#EFF6FF',
              accent: C.blue,
              cta: 'Commander en DTF',
              href: '/configurateur',
            },
            {
              id: 'broderie',
              label: 'Broderie',
              emoji: '🪡',
              title: 'Broderie machine',
              subtitle: '3 têtes de broderie · Finition relief',
              desc: 'Finition haut de gamme, relief tactile, durabilité exceptionnelle. Le choix des marques premium et des uniformes professionnels.',
              specs: ['Effet 3D et relief', 'Tenue à vie', 'Casquettes et polos', 'Logos structurés'],
              bg: '#FFF7ED',
              accent: '#EA580C',
              cta: 'Commander en broderie',
              href: '/configurateur',
            },
          ].map((tech, i) => {
            const cardRef = useFadeIn(i * 100)
            return (
              <div key={tech.id} ref={cardRef} className="rounded-[28px] p-8 border hover:shadow-lg transition-all"
                style={{ background: tech.bg, borderColor: 'rgba(0,0,0,0.06)' }}>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-[22px] shadow-sm">
                    {tech.emoji}
                  </div>
                  <div>
                    <span className="text-[11px] font-bold tracking-widest uppercase" style={{ color: tech.accent }}>{tech.label}</span>
                    <p className="text-[12px]" style={{ color: C.gray4 }}>{tech.subtitle}</p>
                  </div>
                </div>
                <h3 className="font-black text-[22px] mb-3" style={{ color: C.black }}>{tech.title}</h3>
                <p className="text-[14px] leading-relaxed mb-6" style={{ color: C.gray4 }}>{tech.desc}</p>
                <div className="grid grid-cols-2 gap-2 mb-6">
                  {tech.specs.map(s => (
                    <div key={s} className="flex items-center gap-2 text-[13px] font-medium" style={{ color: C.black }}>
                      <span style={{ color: tech.accent }}>✓</span> {s}
                    </div>
                  ))}
                </div>
                <Link href={tech.href}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[13px] font-bold no-underline transition-all hover:-translate-y-0.5"
                  style={{ background: tech.accent, color: C.white }}>
                  {tech.cta} →
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════════════════
   STATS
══════════════════════════════════════════════════════════════════════════════ */
function StatsSection() {
  const ref = useFadeIn()
  return (
    <section style={{ background: C.black, padding: '80px 0' }}>
      <div ref={ref} className="max-w-[1200px] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {[
            { v: '50 000+', l: 'Pièces fabriquées' },
            { v: '500+', l: 'Marques & entreprises' },
            { v: '48h', l: 'Délai de production' },
            { v: '4.9 ★', l: 'Note moyenne clients' },
          ].map(s => (
            <div key={s.l}>
              <p className="font-black tracking-tight text-white" style={{ fontSize: 'clamp(32px,4vw,52px)', letterSpacing: '-0.03em' }}>{s.v}</p>
              <p className="mt-2 text-[13px]" style={{ color: 'rgba(255,255,255,0.5)' }}>{s.l}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════════════════
   ENGAGEMENTS — Dark grid
══════════════════════════════════════════════════════════════════════════════ */
function EngagementsSection() {
  const ref = useFadeIn()
  const items = [
    { emoji: '⚡', title: 'Production 48h', desc: 'Votre commande produite et prête à expédier en 48h ouvrables à Alger.' },
    { emoji: '📦', title: 'Dès 1 pièce', desc: 'Pas de minimum. Commandez 1 pièce ou 10 000 — prix dégressif à partir de 50 pièces.' },
    { emoji: '🎨', title: 'Vectorisation offerte', desc: 'Pas de fichier vectoriel ? Notre équipe adapte votre logo gratuitement.' },
    { emoji: '✅', title: 'Contrôle qualité', desc: 'Chaque pièce vérifiée avant expédition. Non-conforme = reprise gratuite.' },
    { emoji: '🚚', title: 'Livraison nationale', desc: 'Livraison dans toute l\'Algérie en 3–5 jours. Retrait atelier disponible.' },
    { emoji: '💬', title: 'Suivi WhatsApp', desc: 'Un message avec votre référence de commande. On vous tient informé à chaque étape.' },
  ]
  return (
    <section style={{ background: '#0C1A26', padding: '96px 0' }}>
      <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
        <div ref={ref} className="text-center mb-14">
          <Label>Nos engagements</Label>
          <h2 className="font-black tracking-tight text-white" style={{ fontSize: 'clamp(28px,4vw,44px)', letterSpacing: '-0.025em' }}>
            Pourquoi nous choisir.
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item, i) => {
            const cardRef = useFadeIn(i * 60)
            return (
              <div key={item.title} ref={cardRef} className="rounded-[20px] p-6 hover:bg-white/[0.07] transition-all"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-[20px] mb-4"
                  style={{ background: 'rgba(56,189,248,0.15)' }}>
                  {item.emoji}
                </div>
                <h3 className="font-bold text-[15px] text-white mb-2">{item.title}</h3>
                <p className="text-[13px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>{item.desc}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════════════════
   TÉMOIGNAGES
══════════════════════════════════════════════════════════════════════════════ */
const TEMOIGNAGES = [
  { init: 'K', nom: 'Karim B.', role: 'Gérant', co: 'Restaurant El Kef',    note: 5, texte: '80 polos brodés pour notre équipe. Rendu impeccable, délai respecté, suivi WhatsApp rassurant. On recommande sans hésiter.' },
  { init: 'S', nom: 'Samira M.', role: 'Directrice', co: 'Clinique Al Chifa', note: 5, texte: 'Blouses brodées pour toute notre équipe médicale. La qualité du tissu et la précision sur le logo sont vraiment au-dessus de nos attentes.' },
  { init: 'Y', nom: 'Yacine O.', role: 'Directeur', co: 'BTP Construct',       note: 5, texte: '120 gilets de chantier en 5 jours. Troisième commande chez Caractère — la régularité et le sérieux sont là à chaque fois.' },
  { init: 'L', nom: 'Lina K.', role: 'Fondatrice', co: 'Brand Vert',           note: 5, texte: "J'ai lancé ma marque de t-shirts sans stock grâce à Caractère. Le designer est simple, la qualité est premium. Mes clients adorent." },
]

function TestimonialsSection() {
  const ref = useFadeIn()
  return (
    <section style={{ background: C.white, padding: '96px 0' }}>
      <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
        <div ref={ref} className="text-center mb-14">
          <Label>Témoignages</Label>
          <h2 className="font-black tracking-tight" style={{ fontSize: 'clamp(28px,4vw,44px)', color: C.black, letterSpacing: '-0.025em' }}>
            Ils nous font confiance.
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {TEMOIGNAGES.map((t, i) => {
            const cardRef = useFadeIn(i * 70)
            return (
              <div key={t.nom} ref={cardRef} className="rounded-[24px] p-7 border hover:shadow-md transition-all"
                style={{ background: C.white, borderColor: C.gray2 }}>
                <div className="flex gap-0.5 mb-4">
                  {[...Array(t.note)].map((_, j) => <span key={j} style={{ color: '#F59E0B' }}>★</span>)}
                </div>
                <p className="text-[15px] leading-relaxed mb-6" style={{ color: '#374151' }}>"{t.texte}"</p>
                <div className="flex items-center gap-3 pt-5" style={{ borderTop: `1px solid ${C.gray2}` }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-[14px] font-black text-white flex-shrink-0"
                    style={{ background: `linear-gradient(135deg, ${C.blue}, #7C3AED)` }}>
                    {t.init}
                  </div>
                  <div>
                    <p className="font-bold text-[13px]" style={{ color: C.black }}>{t.nom}</p>
                    <p className="text-[12px]" style={{ color: C.gray3 }}>{t.role} · {t.co}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════════════════
   CTA FINAL
══════════════════════════════════════════════════════════════════════════════ */
function CtaSection() {
  const ref = useFadeIn()
  return (
    <section style={{ background: C.gray1, padding: '80px 0' }}>
      <div className="max-w-[1000px] mx-auto px-6 lg:px-10">
        <div ref={ref} className="rounded-[32px] p-10 md:p-16 text-center overflow-hidden relative"
          style={{ background: `linear-gradient(135deg, ${C.black} 0%, #1a1a2e 100%)` }}>
          {/* Halo décoratif */}
          <div className="absolute pointer-events-none" style={{ top: -100, right: -100, width: 400, height: 400, background: 'radial-gradient(circle, rgba(56,189,248,0.15) 0%, transparent 70%)' }} />

          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[12px] font-bold border mb-6"
            style={{ background: 'rgba(56,189,248,0.1)', color: '#BAE6FD', borderColor: 'rgba(56,189,248,0.2)' }}>
            Démarrez aujourd'hui
          </span>

          <h2 className="font-black tracking-tight text-white mb-4" style={{ fontSize: 'clamp(26px,4vw,42px)', letterSpacing: '-0.025em' }}>
            Prêt à lancer votre marque<br />ou habiller votre équipe ?
          </h2>
          <p className="text-[15px] mb-10" style={{ color: 'rgba(255,255,255,0.55)' }}>
            Devis gratuit · Réponse en 2h · Livraison nationale
          </p>

          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/configurateur"
              className="px-8 py-4 rounded-full text-[15px] font-bold text-white no-underline transition-all hover:-translate-y-0.5"
              style={{ background: C.blue, boxShadow: '0 8px 24px rgba(12,74,110,0.5)' }}>
              Configurer ma commande →
            </Link>
            <Link href="/designer"
              className="px-8 py-4 rounded-full text-[15px] font-bold no-underline transition-all border-2 hover:-translate-y-0.5"
              style={{ color: C.white, borderColor: 'rgba(255,255,255,0.25)', background: 'rgba(255,255,255,0.07)' }}>
              Open Designer ✏️
            </Link>
            <a href="https://wa.me/213557440522" target="_blank" rel="noopener noreferrer"
              className="px-8 py-4 rounded-full text-[15px] font-bold no-underline transition-all flex items-center gap-2 hover:-translate-y-0.5"
              style={{ background: '#25D366', color: C.white }}>
              WhatsApp direct
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════════════════
   FOOTER
══════════════════════════════════════════════════════════════════════════════ */
function Footer() {
  return (
    <footer style={{ background: '#0C1A26', padding: '60px 0 40px' }}>
      <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <p className="font-black text-white text-[20px] mb-3">Caractère</p>
            <p className="text-[13px] leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Fabrication textile premium en Algérie. Broderie, DTF, Print on Demand.
            </p>
            <p className="text-[12px]" style={{ color: 'rgba(255,255,255,0.3)' }}>📍 Alger, Algérie</p>
          </div>
          {[
            {
              title: 'Produits',
              links: [
                { label: 'Print on Demand', href: '/designer' },
                { label: 'Configurateur', href: '/configurateur' },
                { label: 'Collection', href: '/collection' },
                { label: 'Catalogue PDF', href: '/catalogue' },
              ],
            },
            {
              title: 'Support',
              links: [
                { label: 'Suivi commande', href: '/suivi' },
                { label: 'WhatsApp', href: 'https://wa.me/213557440522' },
                { label: 'Se connecter', href: '/auth/login' },
              ],
            },
            {
              title: 'Réseaux',
              links: [
                { label: 'Instagram @caractere.store', href: 'https://instagram.com/caractere.store' },
                { label: 'TikTok', href: '#' },
              ],
            },
          ].map(col => (
            <div key={col.title}>
              <p className="text-white font-bold text-[13px] mb-4">{col.title}</p>
              <div className="flex flex-col gap-2.5">
                {col.links.map(l => (
                  <a key={l.label} href={l.href} className="text-[13px] no-underline hover:text-white transition-colors" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    {l.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 pt-8" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <p className="text-[12px]" style={{ color: 'rgba(255,255,255,0.3)' }}>© 2025 Caractère Store · Alger</p>
          <p className="text-[12px]" style={{ color: 'rgba(255,255,255,0.3)' }}>@caractere.store · 297K abonnés</p>
        </div>
      </div>
    </footer>
  )
}

/* ══════════════════════════════════════════════════════════════════════════════
   EXPORT PRINCIPAL
══════════════════════════════════════════════════════════════════════════════ */
export default function HomePageContent({ produits = [] }: { produits?: any[] }) {
  return (
    <>
      <style>{`
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes float-slow { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
        .animate-float { animation: float 3s ease-in-out infinite }
        .animate-float-slow { animation: float-slow 4s ease-in-out infinite }
      `}</style>
      <Hero />
      <HowItWorks />
      <ProduitsSection produits={produits} />
      <TechniquesSection />
      <StatsSection />
      <EngagementsSection />
      <TestimonialsSection />
      <CtaSection />
      <Footer />
    </>
  )
}
