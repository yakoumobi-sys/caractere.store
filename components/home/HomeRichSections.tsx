'use client'

import Link from 'next/link'

const C = {
  black: '#0A0A0A',
  white: '#FAFAFA',
  gray: '#A3A3A3',
  grayDark: '#525252',
  line: 'rgba(255,255,255,0.08)',
  card: 'rgba(255,255,255,0.03)',
}

// Bandeau défilant — capacités réelles du site, reprend le vocabulaire déjà
// utilisé partout ailleurs (Footer, /entreprises, /print-on-demand).
const STRIP_ITEMS = [
  'BRODERIE MACHINE', 'IMPRESSION DTF', 'SÉRIGRAPHIE', 'UNIFORMES B2B',
  'DEVIS SOUS 24H', 'PRODUCTION 48H', 'LIVRAISON NATIONALE', 'ALGER, ALGÉRIE',
]

export function CapabilityStrip() {
  const doubled = [...STRIP_ITEMS, ...STRIP_ITEMS]
  return (
    <div style={{ overflow: 'hidden', borderTop: `1px solid ${C.line}`, borderBottom: `1px solid ${C.line}`, padding: '18px 0' }}>
      <style>{`
        @keyframes hrsMarquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @media (prefers-reduced-motion: reduce) { .hrs-marquee-track { animation: none !important; } }
        .hrs-marquee-track { display: inline-flex; gap: 40px; white-space: nowrap; animation: hrsMarquee 26s linear infinite; }
      `}</style>
      <div className="hrs-marquee-track">
        {doubled.map((item, i) => (
          <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '40px', flexShrink: 0 }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, letterSpacing: '0.12em', color: C.grayDark }}>{item}</span>
            <span style={{ color: C.line }}>✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}

// Savoir-faire — descriptions reprises telles quelles du reste du site
// (Footer, FAQ /comment-ca-marche, metadata) : aucune donnée inventée.
const SERVICES = [
  { emoji: '🧵', title: 'Broderie machine', desc: 'Logos nets et texturés, tenue dans le temps. Rendu premium sur polos, casquettes et uniformes.' },
  { emoji: '🖨️', title: 'Impression DTF', desc: 'Haute définition, couleurs vives, résistant au lavage. Idéal pour les designs complexes et les dégradés.' },
  { emoji: '👔', title: 'Uniformes B2B', desc: 'De la conception à la livraison — de 1 à 10 000 pièces, prise en charge complète de votre projet.' },
  { emoji: '🎨', title: 'Sérigraphie', desc: 'Pour les grandes séries, un rendu mat premium avec des tarifs dégressifs au volume.' },
]

export function ServicesSection() {
  return (
    <section style={{ padding: '80px 20px', maxWidth: '1100px', margin: '0 auto' }}>
      <p style={{ textAlign: 'center', color: C.grayDark, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', fontSize: '0.78rem', marginBottom: '16px' }}>
        Notre savoir-faire
      </p>
      <h2 style={{ textAlign: 'center', fontWeight: 900, letterSpacing: '-0.03em', fontSize: 'clamp(1.8rem, 5vw, 2.8rem)', margin: '0 0 48px' }}>
        Une technique pour<br />chaque besoin.
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '16px' }}>
        {SERVICES.map(s => (
          <div key={s.title} className="card-hover" style={{
            background: C.card, border: `1px solid ${C.line}`,
            borderRadius: '20px', padding: '28px 24px',
          }}>
            <div style={{ fontSize: '1.8rem', marginBottom: '18px' }}>{s.emoji}</div>
            <div style={{ fontWeight: 800, fontSize: '1.05rem', letterSpacing: '-0.01em', marginBottom: '8px' }}>{s.title}</div>
            <div style={{ color: C.gray, fontWeight: 500, fontSize: '0.88rem', lineHeight: 1.55 }}>{s.desc}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

// Galerie — vraies photos produits (public/produits-photos) : celles déjà en
// production sur /configurateur (recadrées pour la vignette), plus tablier,
// hoodie et gilet de sécurité fournis directement par l'utilisateur.
const GALLERY = [
  { src: '/produits-photos/tshirt.jpg', label: 'T-shirt' },
  { src: '/produits-photos/tshirt-oversized.jpg', label: 'T-shirt Oversized' },
  { src: '/produits-photos/polo.jpg', label: 'Polo' },
  { src: '/produits-photos/gilet.jpg', label: 'Gilet de travail' },
  { src: '/produits-photos/casquette.jpg', label: 'Casquette' },
  { src: '/produits-photos/totebag.jpg', label: 'Totebag' },
  { src: '/produits-photos/tablier.jpg', label: 'Tablier' },
  { src: '/produits-photos/hoodie.jpg', label: 'Sweat à capuche' },
  { src: '/produits-photos/gilet-securite.jpg', label: 'Gilet de sécurité' },
]

export function GallerySection() {
  return (
    <section style={{ padding: '0 20px 80px', maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '32px' }}>
        <div>
          <p style={{ color: C.grayDark, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', fontSize: '0.78rem', marginBottom: '16px' }}>
            Nos réalisations
          </p>
          <h2 style={{ fontWeight: 900, letterSpacing: '-0.03em', fontSize: 'clamp(1.8rem, 5vw, 2.8rem)', margin: 0 }}>
            Ce qu&rsquo;on peut faire<br />pour vous.
          </h2>
        </div>
        <Link href="/produits" style={{ color: C.gray, fontWeight: 700, fontSize: '0.9rem', textDecoration: 'underline', textUnderlineOffset: '4px', whiteSpace: 'nowrap' }}>
          Voir tous les produits →
        </Link>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
        {GALLERY.map(g => (
          <div key={g.src} className="card-hover" style={{
            borderRadius: '18px', overflow: 'hidden', border: `1px solid ${C.line}`,
            background: C.card, aspectRatio: '4 / 5', position: 'relative',
          }}>
            <img src={g.src} alt={g.label} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            <div style={{
              position: 'absolute', left: 0, right: 0, bottom: 0, padding: '18px 14px 12px',
              background: 'linear-gradient(to top, rgba(0,0,0,0.75), transparent)',
              fontWeight: 700, fontSize: '0.82rem', color: C.white,
            }}>
              {g.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

// Process — étapes déjà décrites ailleurs sur le site (garanties /entreprises et
// /print-on-demand, FAQ /comment-ca-marche), simplement condensées ici en 4 étapes.
const STEPS = [
  { n: '01', title: 'Envoyez votre logo', desc: 'PNG, JPG ou vectoriel — pas de fichier parfait ? On vectorise gratuitement.' },
  { n: '02', title: 'Vous validez le devis', desc: 'Design et prix confirmés avant qu’on lance quoi que ce soit.' },
  { n: '03', title: 'Production 48h', desc: 'Broderie ou DTF, fabriqué dans notre atelier à Alger.' },
  { n: '04', title: 'Livraison', desc: 'Partout en Algérie, avec un suivi en temps réel.' },
]

export function ProcessSection() {
  return (
    <section style={{ padding: '80px 20px', borderTop: `1px solid ${C.line}` }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <p style={{ textAlign: 'center', color: C.grayDark, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', fontSize: '0.78rem', marginBottom: '16px' }}>
          Comment ça marche
        </p>
        <h2 style={{ textAlign: 'center', fontWeight: 900, letterSpacing: '-0.03em', fontSize: 'clamp(1.8rem, 5vw, 2.8rem)', margin: '0 0 48px' }}>
          De votre logo<br />à la livraison.
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          {STEPS.map(s => (
            <div key={s.n} style={{ padding: '4px' }}>
              <div style={{ fontWeight: 900, fontSize: '1.4rem', color: C.grayDark, marginBottom: '14px', letterSpacing: '-0.02em' }}>{s.n}</div>
              <div style={{ fontWeight: 800, fontSize: '1rem', marginBottom: '8px' }}>{s.title}</div>
              <div style={{ color: C.gray, fontWeight: 500, fontSize: '0.88rem', lineHeight: 1.55 }}>{s.desc}</div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: '44px' }}>
          <Link href="/comment-ca-marche" style={{ color: C.gray, fontWeight: 700, fontSize: '0.9rem', textDecoration: 'underline', textUnderlineOffset: '4px' }}>
            Voir le guide complet →
          </Link>
        </div>
      </div>
    </section>
  )
}

// Relance CTA à mi-page — après savoir-faire + réalisations + process, le
// visiteur a assez d'info pour convertir avant de redescendre vers la
// navigation secondaire (Accès rapide).
export function MidPageCta() {
  return (
    <section style={{ padding: '64px 20px', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderTop: `1px solid ${C.line}`, borderBottom: `1px solid ${C.line}` }}>
      <h2 style={{ fontWeight: 900, letterSpacing: '-0.02em', fontSize: 'clamp(1.4rem, 4vw, 2rem)', margin: '0 0 10px' }}>
        Prêt à commander ?
      </h2>
      <p style={{ color: C.gray, fontWeight: 600, fontSize: '0.95rem', margin: '0 0 28px' }}>
        Produit, couleur, quantité — devis instantané en 2 minutes.
      </p>
      <Link href="/configurateur" className="btn-glow" style={{
        display: 'inline-flex', alignItems: 'center', gap: '10px',
        background: C.white, color: C.black,
        padding: '16px 32px', borderRadius: '999px',
        fontWeight: 800, fontSize: '1rem', textDecoration: 'none',
        textTransform: 'uppercase', letterSpacing: '0.04em',
      }}>
        Commander maintenant
      </Link>
    </section>
  )
}
