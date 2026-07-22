'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

const C = {
  bg: '#0C0A09',
  surface: '#1C1917',
  white: '#FAFAF9',
  muted: '#A8A29E',
  border: 'rgba(250,250,249,0.1)',
  gold: '#D4A574',
  goldSoft: 'rgba(212,165,116,0.14)',
  lime: '#A3E635',
  limeSoft: 'rgba(163,230,53,0.12)',
}

// TODO: Mettre l'URL du logo Supabase ici
const LOGO_URL = 'https://your-supabase-url.supabase.co/storage/v1/object/public/logos/caracterere-logo.png'

// TODO: URLs des images de collection (GitHub raw ou Supabase)
const IMAGE_URLS = {
  img1: 'https://raw.githubusercontent.com/yakoumobi-sys/caractere.store/main/public/collection/IMG_7474.jpeg',
  img2: 'https://raw.githubusercontent.com/yakoumobi-sys/caractere.store/main/public/collection/IMG_7473.jpeg',
  img3: 'https://raw.githubusercontent.com/yakoumobi-sys/caractere.store/main/public/collection/IMG_7468.jpeg',
  img4: 'https://raw.githubusercontent.com/yakoumobi-sys/caractere.store/main/public/collection/IMG_7465.jpeg',
}

function Icon({ name, size = 20, color = 'currentColor' }: { name: string; size?: number; color?: string }) {
  const paths: Record<string, JSX.Element> = {
    arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
    building: <><rect x="4" y="3" width="16" height="18" rx="1" /><path d="M9 8h1M14 8h1M9 12h1M14 12h1M9 16h1M14 16h1" /></>,
    rocket: <><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" /><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" /></>,
    shirt: <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />,
    star: <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />,
    palette: <><circle cx="13.5" cy="6.5" r=".5" /><circle cx="17.5" cy="10.5" r=".5" /><circle cx="8.5" cy="7.5" r=".5" /><circle cx="6.5" cy="12.5" r=".5" /><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" /></>,
    cube: <><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><path d="M3.27 6.96 12 12.01l8.73-5.05M12 22.08V12" /></>,
    message: <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />,
    menu: <><path d="M6 9h12M6 15h12M6 21h12" /></>,
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  )
}

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal')
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('in')),
      { threshold: 0.12 }
    )
    els.forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [])
}

const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,600;0,700;0,800;1,600;1,700&family=Montserrat:wght@300;400;500;600;700;800&display=swap');

    .cs-root { font-family: 'Montserrat', sans-serif; background: linear-gradient(135deg, #0C0A09 0%, #1a1512 50%, #0f0d0a 100%); color: ${C.white}; overflow-x: hidden; }
    .cs-root .display { font-family: 'Cormorant', serif; font-weight: 700; }

    .reveal { opacity: 0; transform: translateY(34px); transition: opacity .8s cubic-bezier(.16,1,.3,1), transform .8s cubic-bezier(.16,1,.3,1); }
    .reveal.in { opacity: 1; transform: none; }
    .reveal.d1 { transition-delay: .1s } .reveal.d2 { transition-delay: .2s }
    .reveal.d3 { transition-delay: .3s } .reveal.d4 { transition-delay: .4s }

    @keyframes blobA { 0%,100% { transform: translate(0,0) scale(1) } 50% { transform: translate(60px,-40px) scale(1.15) } }
    @keyframes blobB { 0%,100% { transform: translate(0,0) scale(1) } 50% { transform: translate(-50px,50px) scale(.9) } }
    .blob { position: absolute; border-radius: 50%; filter: blur(90px); opacity: .5; pointer-events: none; }
    .blobA { animation: blobA 14s ease-in-out infinite; }
    .blobB { animation: blobB 18s ease-in-out infinite; }

    @keyframes shimmer { to { background-position: 200% center } }
    .shimmer {
      background: linear-gradient(110deg, ${C.white} 40%, ${C.gold} 50%, ${C.white} 60%);
      background-size: 200% auto; -webkit-background-clip: text; background-clip: text;
      -webkit-text-fill-color: transparent; animation: shimmer 5s linear infinite;
    }

    @keyframes slideDown { from { transform: translateY(-100%); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
    .sticky-nav { position: fixed; top: 0; left: 0; right: 0; z-index: 999; background: rgba(12,10,9,.92); backdrop-filter: blur(20px); border-bottom: 1px solid ${C.border}; padding: 12px 24px; display: flex; justify-content: space-between; align-items: center; animation: slideDown .4s cubic-bezier(.16,1,.3,1); }
    .sticky-nav.hidden { transform: translateY(-120%); transition: transform .3s; }
    .sticky-nav .logo { width: 32px; height: 32px; border-radius: 8px; background: ${C.gold}; }
    .sticky-nav .links { display: flex; gap: 6px; }
    .sticky-nav a, .sticky-nav-link { padding: 6px 12px; border-radius: 6px; font-size: 11px; font-weight: 600; text-decoration: none; color: ${C.white}; transition: all .3s; border: 1px solid ${C.border}; display: inline-block; }
    .sticky-nav a:hover, .sticky-nav-link:hover { background: ${C.goldSoft}; border-color: ${C.gold}; color: ${C.gold}; }

    .glass {
      background: rgba(28,25,23,0.55);
      backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px);
      border: 1px solid ${C.border}; border-radius: 24px;
      transition: transform .45s cubic-bezier(.16,1,.3,1), border-color .3s, box-shadow .45s;
    }
    .glass:hover { transform: translateY(-8px); }
    .glass.gold:hover { border-color: rgba(212,165,116,.6); box-shadow: 0 24px 60px -20px rgba(212,165,116,.35); }
    .glass.lime:hover { border-color: rgba(163,230,53,.55); box-shadow: 0 24px 60px -20px rgba(163,230,53,.3); }

    .btn { display: inline-flex; align-items: center; gap: 10px; padding: 16px 30px; border-radius: 999px;
      font-weight: 600; font-size: 15px; text-decoration: none; cursor: pointer;
      transition: transform .25s cubic-bezier(.16,1,.3,1), box-shadow .3s, background .3s; }
    .btn:hover { transform: translateY(-3px) scale(1.02); }
    .btn .ic { transition: transform .25s; }
    .btn:hover .ic { transform: translateX(4px); }
    .btn-gold { background: ${C.gold}; color: ${C.bg}; }
    .btn-gold:hover { box-shadow: 0 16px 40px -12px rgba(212,165,116,.5); }
    .btn-ghost { background: rgba(250,250,249,.06); color: ${C.white}; border: 1px solid ${C.border}; }
    .btn-ghost:hover { background: rgba(250,250,249,.12); }

    .quick { border: 1px solid ${C.border}; border-radius: 20px; padding: 28px 20px;
      background: ${C.surface}; text-decoration: none; display: block; text-align: center;
      transition: transform .35s cubic-bezier(.16,1,.3,1), border-color .3s, background .3s; cursor: pointer; }
    .quick:hover { transform: translateY(-6px); border-color: rgba(212,165,116,.5); background: #232019; }

    @media (prefers-reduced-motion: reduce) {
      .reveal { opacity: 1 !important; transform: none !important; transition: none !important; }
      .blobA, .blobB, .shimmer { animation: none !important; }
      .glass:hover, .btn:hover, .quick:hover { transform: none; }
    }
  `}</style>
)

function StickyNav({ visible }: { visible: boolean }) {
  return (
    <nav className={`sticky-nav ${!visible ? 'hidden' : ''}`}>
      <div className="logo" title="Caractère Store" />
      <div className="sticky-nav links">
        <Link href="/designer" className="sticky-nav-link">🎨 Designer</Link>
        <Link href="/studio-3d" className="sticky-nav-link">🧊 3D</Link>
        <Link href="/collection" className="sticky-nav-link">⭐ Collection</Link>
        <Link href="/produits" className="sticky-nav-link">👕 Produits</Link>
      </div>
    </nav>
  )
}

function Hero() {
  return (
    <section style={{ position: 'relative', padding: '120px 24px 80px', textAlign: 'center' }}>
      <div className="blob blobA" style={{ width: 420, height: 420, top: -120, left: '-8%', background: C.gold, opacity: 0.25 }} />
      <div className="blob blobB" style={{ width: 380, height: 380, bottom: -80, right: '-6%', background: C.lime, opacity: 0.15 }} />

      <div style={{ position: 'relative', maxWidth: 900, margin: '0 auto' }}>
        <p className="reveal" style={{ letterSpacing: 5, fontSize: 12, fontWeight: 700, color: C.gold, textTransform: 'uppercase', marginBottom: 24 }}>
          Atelier de personnalisation textile — Alger
        </p>
        <h1 className="display reveal d1" style={{ fontSize: 'clamp(52px, 9vw, 104px)', lineHeight: 1.02, fontWeight: 800, margin: '0 0 28px' }}>
          Personnalisez.<br />
          <em className="shimmer" style={{ fontStyle: 'italic' }}>Développez.</em><br />
          Livrez.
        </h1>
        <p className="reveal d2" style={{ fontSize: 18, lineHeight: 1.7, color: C.muted, maxWidth: 560, margin: '0 auto 40px', fontWeight: 300 }}>
          DTF, broderie, uniformes. Production 48h, livraison nationale.
          Du créateur solo à l'entreprise de 500 employés.
        </p>
      </div>
    </section>
  )
}

function ChoicePaths() {
  return (
    <section style={{ padding: '90px 24px', position: 'relative' }}>
      <div style={{ maxWidth: 1080, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 6 }}>

          <Link
            href="/entreprise"
            className="glass gold reveal"
            style={{
              padding: 44, textDecoration: 'none', color: C.white, display: 'block'
            }}
          >
            <div style={{ width: 60, height: 60, borderRadius: 18, background: C.goldSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 26 }}>
              <Icon name="building" size={28} color={C.gold} />
            </div>
            <h2 className="display" style={{ fontSize: 34, fontWeight: 800, margin: '0 0 12px' }}>Vous êtes une entreprise</h2>
            <p style={{ color: C.muted, lineHeight: 1.7, fontSize: 15, marginBottom: 28, fontWeight: 300 }}>
              Uniformes, polos brodés, gilets de chantier, blouses médicales.
              Rabais volume jusqu'à −30%. Suivi transparent.
            </p>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: C.gold, fontWeight: 700, fontSize: 15 }}>
              Espace Entreprise <Icon name="arrow" size={18} color={C.gold} />
            </span>
          </Link>

          <Link
            href="/print-on-demand"
            className="glass lime reveal d1"
            style={{
              padding: 44, textDecoration: 'none', color: C.white, display: 'block'
            }}
          >
            <div style={{ width: 60, height: 60, borderRadius: 18, background: C.limeSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 26 }}>
              <Icon name="rocket" size={28} color={C.lime} />
            </div>
            <h2 className="display" style={{ fontSize: 34, fontWeight: 800, margin: '0 0 12px' }}>Vous êtes un créateur</h2>
            <p style={{ color: C.muted, lineHeight: 1.7, fontSize: 15, marginBottom: 28, fontWeight: 300 }}>
              Lancez votre marque sans stock. Print on Demand dès 1 pièce,
              Designer en ligne et Studio 3D.
            </p>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: C.lime, fontWeight: 700, fontSize: 15 }}>
              Print on Demand <Icon name="arrow" size={18} color={C.lime} />
            </span>
          </Link>

        </div>
      </div>
    </section>
  )
}

function TrustSection() {
  const stats = [
    { number: '50K+', label: 'Pièces produites' },
    { number: '500+', label: 'Marques & entreprises' },
    { number: '4.9★', label: 'Note clients' },
    { number: '48h', label: 'Délai production' },
  ]
  return (
    <section className="reveal" style={{ padding: '40px 24px', background: C.surface }}>
      <div style={{ maxWidth: 1080, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 20 }}>
          {stats.map((s, i) => (
            <div key={i} className={`reveal d${i}`} style={{ textAlign: 'center', padding: '20px 12px' }}>
              <p className="display" style={{ fontSize: 32, fontWeight: 800, margin: 0, color: C.gold }}>
                {s.number}
              </p>
              <p style={{ fontSize: 11, marginTop: 6, color: C.muted, letterSpacing: 1 }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Bestsellers() {
  const items = [
    { img: IMAGE_URLS.img1, name: 'DTF Premium T-shirt' },
    { img: IMAGE_URLS.img2, name: 'Polo Broderie Or' },
    { img: IMAGE_URLS.img3, name: 'Hoodie Custom' },
    { img: IMAGE_URLS.img4, name: 'Chemise Uniforme' },
  ]
  return (
    <section style={{ padding: '60px 24px 40px' }}>
      <div style={{ maxWidth: 1080, margin: '0 auto' }}>
        <h2 className="display reveal" style={{ fontSize: 36, fontWeight: 800, textAlign: 'center', marginBottom: 40 }}>
          Bestsellers
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 18 }}>
          {items.map((i, idx) => (
            <div key={idx} className={`reveal d${idx}`} style={{ borderRadius: 16, overflow: 'hidden', background: C.surface, border: `1px solid ${C.border}` }}>
              <div style={{ width: '100%', height: 240, background: C.surface, overflow: 'hidden' }}>
                <img src={i.img} alt={i.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <p style={{ padding: '16px 12px', margin: 0, fontWeight: 600, textAlign: 'center' }}>{i.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function QuickLinks() {
  const links = [
    { icon: 'shirt', label: 'Produits', href: '/produits' },
    { icon: 'star', label: 'The Collection', href: '/collection' },
    { icon: 'palette', label: 'Designer', href: '/designer' },
    { icon: 'cube', label: 'Studio 3D', href: '/studio-3d' },
  ]
  return (
    <section style={{ padding: '0 24px 100px' }}>
      <div style={{ maxWidth: 1080, margin: '0 auto' }}>
        <h2 className="display reveal" style={{ fontSize: 40, fontWeight: 800, textAlign: 'center', marginBottom: 40 }}>Accès rapide</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16 }}>
          {links.map((l, i) => (
            <Link key={i} href={l.href} className={`quick reveal d${i}`}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
                <Icon name={l.icon} size={30} color={C.gold} />
              </div>
              <span style={{ fontWeight: 700, fontSize: 15, color: C.white }}>{l.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

function FinalCTA() {
  return (
    <section style={{ position: 'relative', padding: '100px 24px', textAlign: 'center', overflow: 'hidden' }}>
      <div className="blob blobA" style={{ width: 500, height: 300, top: '20%', left: '30%', background: C.gold, opacity: 0.18 }} />
      <div style={{ position: 'relative' }}>
        <h2 className="display reveal" style={{ fontSize: 'clamp(38px, 6vw, 64px)', fontWeight: 800, marginBottom: 16 }}>Une question ?</h2>
        <p className="reveal d1" style={{ color: C.muted, marginBottom: 40, fontWeight: 300 }}>Réponse en 2h · Devis gratuit · Sans engagement</p>
        <a href="https://wa.me/213557440522" className="btn btn-gold reveal d2">
          <Icon name="message" size={18} /> WhatsApp direct <span className="ic"><Icon name="arrow" size={18} /></span>
        </a>
      </div>
    </section>
  )
}

export default function HomePageContent({ produits = [] }: { produits?: any[] }) {
  const [navVisible, setNavVisible] = useState(false)

  useReveal()

  useEffect(() => {
    const handleScroll = () => {
      setNavVisible(window.scrollY > 300)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="cs-root">
      <GlobalStyle />
      <StickyNav visible={navVisible} />
      <Hero />
      <ChoicePaths />
      <TrustSection />
      <Bestsellers />
      <QuickLinks />
      <FinalCTA />
    </div>
  )
}
