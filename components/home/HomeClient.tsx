'use client'

import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import EntryGate from '@/components/home/EntryGate'
import StickyOrderBar from '@/components/home/StickyOrderBar'
import Reveal from '@/components/home/Reveal'
import { CapabilityStrip, ServicesSection, GallerySection, ProcessSection, MidPageCta } from '@/components/home/HomeRichSections'
import type { Avis } from '@/types'

// Fond 3D "liquid glass" — three.js/WebGL, jamais côté serveur.
const LiquidGlassHero = dynamic(() => import('@/components/home/LiquidGlassHero'), { ssr: false })

const GATE_KEY = 'caractere_gate_seen'

const C = {
  black: '#0A0A0A',
  white: '#FAFAFA',
  gray: '#A3A3A3',
  grayDark: '#525252',
  line: 'rgba(255,255,255,0.08)',
  card: 'rgba(255,255,255,0.03)',
}

function Logo({ size = 56 }) {
  return (
    <img 
      src="https://aijlvbipvqnvbywxhlbd.supabase.co/storage/v1/object/public/image/logo-white-transparent.png" 
      alt="Caractère" 
      width={size} 
      height={size}
      style={{ objectFit: 'contain' }}
    />
  )
}

function IconSliders({ size = 30 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none">
      <line x1="4" y1="21" x2="4" y2="14" />
      <line x1="4" y1="10" x2="4" y2="3" />
      <line x1="12" y1="21" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12" y2="3" />
      <line x1="20" y1="21" x2="20" y2="16" />
      <line x1="20" y1="12" x2="20" y2="3" />
      <line x1="1" y1="14" x2="7" y2="14" />
      <line x1="9" y1="8" x2="15" y2="8" />
      <line x1="17" y1="16" x2="23" y2="16" />
    </svg>
  )
}

function IconPen({ size = 30 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none">
      <path d="M12 19l7-7 3 3-7 7-3-3z" />
      <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
      <path d="M2 2l7.586 7.586" />
      <circle cx="11" cy="11" r="2" />
    </svg>
  )
}

function IconCube({ size = 30 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <path d="M3.27 6.96L12 12.01l8.73-5.05" />
      <path d="M12 22.08V12" />
    </svg>
  )
}

function IconShirt({ size = 30 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none">
      <path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />
    </svg>
  )
}

function IconStar({ size = 30 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}

function IconBook({ size = 30 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  )
}

function IconArrow({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none">
      <path d="M5 12h14" />
      <path d="M12 5l7 7-7 7" />
    </svg>
  )
}

function IconBriefcase({ size = 30 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none">
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      <path d="M2 13h20" />
    </svg>
  )
}

function IconPrinter({ size = 30 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none">
      <path d="M6 9V2h12v7" />
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
      <rect x="6" y="14" width="12" height="8" />
    </svg>
  )
}

function StarFilled({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#F5A623" stroke="#F5A623" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}

const quickLinks = [
  { href: '/configurateur', label: 'Configurateur', desc: 'Produit, couleur, quantité — devis instantané', Icon: IconSliders },
  { href: '/produits', label: 'Produits', desc: 'T-shirts, hoodies, uniformes', Icon: IconShirt },
  { href: '/designer', label: 'Designer', desc: 'Crée ton design en 2 minutes', Icon: IconPen },
  { href: '/studio-3d', label: 'Studio 3D', desc: 'Ton t-shirt animé en 3D', Icon: IconCube },
  { href: '/collection', label: 'Collection', desc: 'Nos designs prêts à porter', Icon: IconStar },
  { href: '/comment-ca-marche', label: 'Comment ça marche', desc: 'Le guide complet, étape par étape', Icon: IconBook },
  { href: '/entreprises', label: 'Entreprises', desc: 'Configurez la commande de votre équipe — devis immédiat', Icon: IconBriefcase },
  { href: '/print-on-demand', label: 'Print on Demand', desc: 'Sans stock, sans risque — vendez vos designs', Icon: IconPrinter },
]

export default function HomeClient() {
  const [avis, setAvis] = useState<Avis[]>([])
  // `true` par défaut pour que le rendu serveur et le premier rendu client
  // restent identiques (pas de mismatch d'hydratation) — on le désactive
  // ensuite au montage si ce visiteur a déjà choisi son parcours cette session.
  const [showGate, setShowGate] = useState(true)

  useEffect(() => {
    fetch('/api/avis')
      .then(r => r.ok ? r.json() : [])
      .then(data => setAvis(Array.isArray(data) ? data.slice(0, 3) : []))
      .catch(() => setAvis([]))
  }, [])

  useEffect(() => {
    try {
      if (sessionStorage.getItem(GATE_KEY)) setShowGate(false)
    } catch {}
  }, [])

  useEffect(() => {
    document.body.style.overflow = showGate ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [showGate])

  return (
    <>
      {showGate && <EntryGate onDismiss={() => setShowGate(false)} />}
      <StickyOrderBar hidden={showGate} />
      <Navbar />
      <div style={{ background: C.black, color: C.white, minHeight: '100vh', fontFamily: "'Inter','Archivo',system-ui,sans-serif", overflowX: 'hidden' }}>
        <style>{`
          @keyframes beamPulse {
            0%, 100% { opacity: 0.7; }
            50% { opacity: 1; }
          }
          @keyframes riseIn {
            from { opacity: 0; transform: translateY(24px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @media (prefers-reduced-motion: reduce) {
            .anim { animation: none !important; opacity: 1 !important; transform: none !important; }
          }
          .anim { animation: riseIn 0.8s cubic-bezier(0.22,1,0.36,1) both; }
          .card-hover { transition: border-color 0.25s ease, background 0.25s ease, transform 0.25s ease; }
          .card-hover:hover { border-color: rgba(255,255,255,0.25) !important; background: rgba(255,255,255,0.06) !important; transform: translateY(-3px); }
          .btn-glow { box-shadow: 0 0 40px rgba(255,255,255,0.25), 0 0 80px rgba(255,255,255,0.1); transition: box-shadow 0.3s ease, transform 0.2s ease; }
          .btn-glow:hover { box-shadow: 0 0 60px rgba(255,255,255,0.4), 0 0 120px rgba(255,255,255,0.15); transform: translateY(-2px); }
          .btn-outline { transition: border-color 0.25s ease, background 0.25s ease; }
          .btn-outline:hover { border-color: rgba(255,255,255,0.5) !important; background: rgba(255,255,255,0.05); }
        `}</style>

        {/* HERO */}
        <section style={{ position: 'relative', textAlign: 'center', padding: '72px 20px 0', minHeight: '92vh', display: 'flex', flexDirection: 'column', alignItems: 'center', overflow: 'hidden' }}>
          <LiquidGlassHero />

          <div aria-hidden style={{
            position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', zIndex: 1,
            width: '2px', height: '100%',
            background: 'linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.9) 30%, rgba(255,255,255,0.9) 70%, rgba(255,255,255,0) 100%)',
            animation: 'beamPulse 4s ease-in-out infinite',
            pointerEvents: 'none',
          }} />

          <div className="anim" style={{ position: 'relative', zIndex: 2, marginBottom: '36px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '18px' }}>
            <Logo size={110} />
            <span style={{ fontWeight: 900, fontSize: '1.9rem', letterSpacing: '-0.02em' }}>Caractère</span>
          </div>

          <h1 className="anim" style={{
            position: 'relative', zIndex: 2,
            fontSize: 'clamp(2.6rem, 9vw, 5.5rem)',
            fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1.02,
            margin: '0 0 24px', animationDelay: '0.1s',
            background: 'linear-gradient(180deg, #FFFFFF 0%, #B8B8B8 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            Votre marque<br />en 48h
          </h1>

          <p className="anim" style={{
            position: 'relative', zIndex: 2,
            fontSize: 'clamp(1.05rem, 3.5vw, 1.35rem)', fontWeight: 600,
            color: C.gray, maxWidth: '560px', lineHeight: 1.5,
            margin: '0 0 40px', animationDelay: '0.2s',
          }}>
            Configurez votre commande en <strong style={{ color: C.white }}>2 minutes</strong>.<br />
            Besoin d&rsquo;aide pour le design ? Notre <strong style={{ color: C.white }}>Designer</strong> est gratuit.<br />
            <span style={{ fontSize: '0.9em', color: C.grayDark }}>DTF • Broderie • Uniformes — Sans stock, sans risque.</span>
          </p>

          <div className="anim" style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center', animationDelay: '0.3s' }}>
            <Link href="/configurateur" className="btn-glow" style={{
              display: 'inline-flex', alignItems: 'center', gap: '10px',
              background: C.white, color: C.black,
              padding: '16px 32px', borderRadius: '999px',
              fontWeight: 800, fontSize: '1rem', textDecoration: 'none',
              textTransform: 'uppercase', letterSpacing: '0.04em',
            }}>
              Commander maintenant <IconArrow />
            </Link>
            <Link href="/designer" className="btn-outline btn-glass" style={{
              display: 'inline-flex', alignItems: 'center', gap: '10px',
              border: `1px solid ${C.line}`, color: C.white,
              padding: '16px 32px', borderRadius: '999px',
              fontWeight: 800, fontSize: '1rem', textDecoration: 'none',
              textTransform: 'uppercase', letterSpacing: '0.04em',
            }}>
              Designer mon tshirt
            </Link>
          </div>
        </section>

        <CapabilityStrip />
        <ServicesSection />
        <GallerySection />
        <ProcessSection />
        <MidPageCta />

        {/* ACCÈS RAPIDE */}
        <section style={{ padding: '80px 20px', maxWidth: '1100px', margin: '0 auto' }}>
          <Reveal>
            <p style={{ textAlign: 'center', color: C.grayDark, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', fontSize: '0.78rem', marginBottom: '40px' }}>
              Accès rapide
            </p>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            {quickLinks.map(({ href, label, desc, Icon }, i) => (
              <Reveal key={href} delay={(i % 4) * 60}>
                <Link href={href} className="card-hover liquid-glass-card" style={{
                  display: 'flex', flexDirection: 'column', gap: '16px',
                  borderRadius: '20px', padding: '32px 28px',
                  textDecoration: 'none', color: C.white,
                }}>
                  <span style={{ color: C.white, opacity: 0.9 }}><Icon /></span>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '1.15rem', letterSpacing: '-0.01em', marginBottom: '6px' }}>{label}</div>
                    <div style={{ color: C.gray, fontWeight: 500, fontSize: '0.92rem', lineHeight: 1.45 }}>{desc}</div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>

        {/* AVIS CLIENTS */}
        <section style={{ padding: '80px 20px', maxWidth: '1100px', margin: '0 auto', borderTop: `1px solid ${C.line}` }}>
          <Reveal>
            <p style={{ textAlign: 'center', color: C.grayDark, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', fontSize: '0.78rem', marginBottom: '40px' }}>
              Avis clients
            </p>
          </Reveal>
          {avis.length === 0 ? (
            <div style={{ textAlign: 'center', color: C.gray, fontWeight: 600 }}>
              <p style={{ margin: '0 0 20px' }}>Soyez le premier à laisser un avis.</p>
              <Link href="/avis" className="btn-outline" style={{
                display: 'inline-flex', alignItems: 'center', gap: '10px',
                border: `1px solid ${C.line}`, color: C.white,
                padding: '14px 28px', borderRadius: '999px',
                fontWeight: 800, textDecoration: 'none', fontSize: '0.9rem',
              }}>
                Laisser un avis
              </Link>
            </div>
          ) : (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '32px' }}>
                {avis.map((a, i) => (
                  <Reveal key={a.id} delay={(i % 3) * 60}>
                    <div className="liquid-glass-card" style={{ borderRadius: '20px', padding: '28px' }}>
                      <div style={{ display: 'flex', gap: '3px', marginBottom: '14px' }}>
                        {Array.from({ length: a.note }).map((_, j) => <StarFilled key={j} size={15} />)}
                      </div>
                      <p style={{ color: C.white, fontSize: '0.95rem', lineHeight: 1.55, marginBottom: '16px' }}>« {a.commentaire} »</p>
                      <p style={{ color: C.gray, fontWeight: 700, fontSize: '0.85rem' }}>{a.nom}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
              <div style={{ textAlign: 'center' }}>
                <Link href="/avis" style={{ color: C.gray, fontWeight: 700, fontSize: '0.9rem', textDecoration: 'underline' }}>
                  Voir tous les avis / laisser le vôtre →
                </Link>
              </div>
            </>
          )}
        </section>

        {/* CTA FINAL */}
        <section style={{ position: 'relative', textAlign: 'center', padding: '100px 20px', borderTop: `1px solid ${C.line}` }}>
          <h2 style={{ position: 'relative', fontSize: 'clamp(1.8rem, 6vw, 3rem)', fontWeight: 900, letterSpacing: '-0.03em', margin: '0 0 16px' }}>
            Commencez maintenant
          </h2>
          <p style={{ position: 'relative', color: C.gray, fontWeight: 600, margin: '0 0 36px' }}>
            Devis instantané. Zéro risque. Zéro engagement.
          </p>
          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
            <Link href="/configurateur" className="btn-glow" style={{
              display: 'inline-flex', alignItems: 'center', gap: '10px',
              background: C.white, color: C.black,
              padding: '16px 32px', borderRadius: '999px',
              fontWeight: 800, textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.04em',
            }}>
              Commander maintenant <IconArrow />
            </Link>
            <Link href="/designer" className="btn-outline btn-glass" style={{
              display: 'inline-flex', alignItems: 'center', gap: '10px',
              border: `1px solid ${C.line}`, color: C.white,
              padding: '16px 32px', borderRadius: '999px',
              fontWeight: 800, textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.04em',
            }}>
              Designer mon tshirt
            </Link>
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{ borderTop: `1px solid ${C.line}`, padding: '48px 20px', textAlign: 'center', color: C.grayDark, fontSize: '0.85rem', fontWeight: 600 }}>
          <p style={{ margin: 0 }}>© 2026 Caractère Store • Print on Demand • DTF • Production 48h • Alger</p>
          <p style={{ margin: '10px 0 0' }}>+213 557 440 522 • yakoumobi@gmail.com</p>
        </footer>
      </div>
    </>
  )
}
