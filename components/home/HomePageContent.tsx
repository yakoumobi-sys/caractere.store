'use client'

import Link from 'next/link'

// ============================================
// CARACTÈRE — HOMEPAGE V5 "NOIR"
// Theme: noir / blanc / gris clair (style Huly)
// Deploy to: components/home/HomePageContent.tsx
// ============================================

const C = {
  black: '#0A0A0A',
  white: '#FAFAFA',
  gray: '#A3A3A3',
  grayDark: '#525252',
  line: 'rgba(255,255,255,0.08)',
  card: 'rgba(255,255,255,0.03)',
}

// ---------- LOGO IMAGE ----------
function Logo({ size = 56 }: { size?: number }) {
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

// ---------- ICONES SVG (remplacent les emojis) ----------
type IconProps = { size?: number }

const stroke = { stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, fill: 'none' }

function IconPen({ size = 30 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...stroke}>
      <path d="M12 19l7-7 3 3-7 7-3-3z" />
      <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
      <path d="M2 2l7.586 7.586" />
      <circle cx="11" cy="11" r="2" />
    </svg>
  )
}

function IconCube({ size = 30 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...stroke}>
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <path d="M3.27 6.96L12 12.01l8.73-5.05" />
      <path d="M12 22.08V12" />
    </svg>
  )
}

function IconShirt({ size = 30 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...stroke}>
      <path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />
    </svg>
  )
}

function IconStar({ size = 30 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...stroke}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}

function IconBook({ size = 30 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...stroke}>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  )
}

function IconArrow({ size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...stroke}>
      <path d="M5 12h14" />
      <path d="M12 5l7 7-7 7" />
    </svg>
  )
}

function IconChat({ size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...stroke}>
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  )
}

// ---------- DONNÉES ----------
const quickLinks = [
  { href: '/designer', label: 'Designer', desc: 'Crée ton design en 2 minutes', Icon: IconPen },
  { href: '/studio-3d', label: 'Studio 3D', desc: 'Ton t-shirt animé en 3D', Icon: IconCube },
  { href: '/produits', label: 'Produits', desc: 'T-shirts, hoodies, uniformes', Icon: IconShirt },
  { href: '/collection', label: 'Collection', desc: 'Nos designs prêts à porter', Icon: IconStar },
  { href: '/comment-ca-marche', label: 'Comment ça marche', desc: 'Le guide complet, étape par étape', Icon: IconBook },
]

// ---------- PAGE ----------
export default function HomePageContent() {
  return (
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

      {/* ================= HERO ================= */}
      <section style={{ position: 'relative', textAlign: 'center', padding: '72px 20px 0', minHeight: '92vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

        {/* Faisceau de lumière central (signature Huly, en monochrome) */}
        <div aria-hidden style={{
          position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
          width: '2px', height: '100%',
          background: 'linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.9) 30%, rgba(255,255,255,0.9) 70%, rgba(255,255,255,0) 100%)',
          animation: 'beamPulse 4s ease-in-out infinite',
          pointerEvents: 'none',
        }} />
        <div aria-hidden style={{
          position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
          width: 'min(90vw, 700px)', height: '60%',
          background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.03) 40%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* LOGO EN GRAND — au-dessus du titre */}
        <div className="anim" style={{ position: 'relative', zIndex: 2, marginBottom: '36px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '18px' }}>
          <Logo size={110} />
          <span style={{ fontWeight: 900, fontSize: '1.9rem', letterSpacing: '-0.02em' }}>Caractère</span>
        </div>

        {/* TITRE */}
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

        {/* SOUS-TITRE — Designer + Studio 3D */}
        <p className="anim" style={{
          position: 'relative', zIndex: 2,
          fontSize: 'clamp(1.05rem, 3.5vw, 1.35rem)', fontWeight: 600,
          color: C.gray, maxWidth: '560px', lineHeight: 1.5,
          margin: '0 0 40px', animationDelay: '0.2s',
        }}>
          Design ton t-shirt avec le <strong style={{ color: C.white }}>Designer</strong>.<br />
          Anime-le avec notre <strong style={{ color: C.white }}>Studio 3D</strong>.<br />
          <span style={{ fontSize: '0.9em', color: C.grayDark }}>DTF • Broderie • Uniformes — Sans stock, sans risque.</span>
        </p>

        {/* CTA */}
        <div className="anim" style={{ position: 'relative', zIndex: 2, display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center', animationDelay: '0.3s' }}>
          <Link href="/designer" className="btn-glow" style={{
            display: 'inline-flex', alignItems: 'center', gap: '10px',
            background: C.white, color: C.black,
            padding: '16px 32px', borderRadius: '999px',
            fontWeight: 800, fontSize: '1rem', textDecoration: 'none',
            textTransform: 'uppercase', letterSpacing: '0.04em',
          }}>
            Designer gratuit <IconArrow />
          </Link>
          <a href="https://wa.me/213557440522" className="btn-outline" style={{
            display: 'inline-flex', alignItems: 'center', gap: '10px',
            border: `1px solid ${C.line}`, color: C.white,
            padding: '16px 32px', borderRadius: '999px',
            fontWeight: 800, fontSize: '1rem', textDecoration: 'none',
            textTransform: 'uppercase', letterSpacing: '0.04em',
          }}>
            <IconChat /> Question ?
          </a>
        </div>

        {/* Base du faisceau : ligne lumineuse horizontale */}
        <div aria-hidden style={{
          position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)',
          width: 'min(92vw, 900px)', height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)',
          boxShadow: '0 0 30px rgba(255,255,255,0.3)',
        }} />
      </section>

      {/* ================= ACCÈS RAPIDE ================= */}
      <section style={{ padding: '80px 20px', maxWidth: '1100px', margin: '0 auto' }}>
        <p style={{ textAlign: 'center', color: C.grayDark, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', fontSize: '0.78rem', marginBottom: '40px' }}>
          Accès rapide
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
          {quickLinks.map(({ href, label, desc, Icon }) => (
            <Link key={href} href={href} className="card-hover" style={{
              display: 'flex', flexDirection: 'column', gap: '16px',
              background: C.card, border: `1px solid ${C.line}`,
              borderRadius: '20px', padding: '32px 28px',
              textDecoration: 'none', color: C.white,
            }}>
              <span style={{ color: C.white, opacity: 0.9 }}><Icon /></span>
              <div>
                <div style={{ fontWeight: 800, fontSize: '1.15rem', letterSpacing: '-0.01em', marginBottom: '6px' }}>{label}</div>
                <div style={{ color: C.gray, fontWeight: 500, fontSize: '0.92rem', lineHeight: 1.45 }}>{desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ================= CTA FINAL ================= */}
      <section style={{ position: 'relative', textAlign: 'center', padding: '100px 20px', borderTop: `1px solid ${C.line}` }}>
        <div aria-hidden style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 50% 100%, rgba(255,255,255,0.07) 0%, transparent 60%)',
          pointerEvents: 'none',
        }} />
        <h2 style={{ position: 'relative', fontSize: 'clamp(1.8rem, 6vw, 3rem)', fontWeight: 900, letterSpacing: '-0.03em', margin: '0 0 16px' }}>
          Commencez maintenant
        </h2>
        <p style={{ position: 'relative', color: C.gray, fontWeight: 600, margin: '0 0 36px' }}>
          Designer gratuit. Zéro risque. Zéro engagement.
        </p>
        <div style={{ position: 'relative', display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link href="/designer" className="btn-glow" style={{
            display: 'inline-flex', alignItems: 'center', gap: '10px',
            background: C.white, color: C.black,
            padding: '16px 32px', borderRadius: '999px',
            fontWeight: 800, textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.04em',
          }}>
            Designer gratuit <IconArrow />
          </Link>
          <Link href="/studio-3d" className="btn-outline" style={{
            display: 'inline-flex', alignItems: 'center', gap: '10px',
            border: `1px solid ${C.line}`, color: C.white,
            padding: '16px 32px', borderRadius: '999px',
            fontWeight: 800, textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.04em',
          }}>
            <IconCube size={18} /> Studio 3D
          </Link>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer style={{ borderTop: `1px solid ${C.line}`, padding: '48px 20px', textAlign: 'center', color: C.grayDark, fontSize: '0.85rem', fontWeight: 600 }}>
        <p style={{ margin: 0 }}>© 2026 Caractère Store • Print on Demand • DTF • Production 48h • Alger</p>
        <p style={{ margin: '10px 0 0' }}>+213 557 440 522 • yakoumobi@gmail.com</p>
      </footer>
    </div>
  )
}
