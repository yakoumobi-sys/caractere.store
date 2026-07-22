'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

/* Design system ui-ux-pro-max — Liquid Glass, noir + lime (énergie créateur) */

const C = {
  bg: '#0C0A09',
  surface: '#1C1917',
  white: '#FAFAF9',
  muted: '#A8A29E',
  border: 'rgba(250,250,249,0.1)',
  lime: '#A3E635',
  limeSoft: 'rgba(163,230,53,0.12)',
  gold: '#D4A574',
}

function Icon({ name, size = 20, color = 'currentColor' }: { name: string; size?: number; color?: string }) {
  const paths: Record<string, JSX.Element> = {
    arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
    palette: <><circle cx="13.5" cy="6.5" r=".5" /><circle cx="17.5" cy="10.5" r=".5" /><circle cx="8.5" cy="7.5" r=".5" /><circle cx="6.5" cy="12.5" r=".5" /><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" /></>,
    star: <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />,
    shirt: <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />,
    cube: <><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><path d="M3.27 6.96 12 12.01l8.73-5.05M12 22.08V12" /></>,
    sparkles: <><path d="M12 3l1.9 5.8a2 2 0 0 0 1.3 1.3L21 12l-5.8 1.9a2 2 0 0 0-1.3 1.3L12 21l-1.9-5.8a2 2 0 0 0-1.3-1.3L3 12l5.8-1.9a2 2 0 0 0 1.3-1.3L12 3z" /></>,
    coins: <><circle cx="8" cy="8" r="6" /><path d="M18.09 10.37A6 6 0 1 1 10.34 18M7 6h1v4M16.71 13.88l.7.71-2.82 2.82" /></>,
    trend: <path d="M22 7l-8.5 8.5-5-5L2 17M16 7h6v6" />,
    phone2: <><rect x="5" y="2" width="14" height="20" rx="2" /><path d="M12 18h.01" /></>,
    globe: <><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></>,
    zap: <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />,
    message: <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />,
    quote: <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />,
    box: <><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><path d="M3.27 6.96 12 12.01l8.73-5.05M12 22.08V12" /></>,
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

function CountUp({ to, suffix = '' }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [started, setStarted] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => e.isIntersecting && setStarted(true), { threshold: 0.5 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  useEffect(() => {
    if (!started || !ref.current) return
    const el = ref.current
    const t0 = performance.now()
    const tick = (t: number) => {
      const p = Math.min((t - t0) / 1400, 1)
      const eased = 1 - Math.pow(1 - p, 4)
      el.textContent = Math.round(eased * to).toLocaleString('fr-FR') + suffix
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [started, to, suffix])
  return <span ref={ref}>0{suffix}</span>
}

const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,400;0,600;0,700;1,500&family=Montserrat:wght@300;400;500;600;700&display=swap');

    .pod-root { font-family: 'Montserrat', sans-serif; background: ${C.bg}; color: ${C.white}; overflow-x: hidden; }
    .pod-root .display { font-family: 'Cormorant', serif; }

    .reveal { opacity: 0; transform: translateY(34px); transition: opacity .8s cubic-bezier(.16,1,.3,1), transform .8s cubic-bezier(.16,1,.3,1); }
    .reveal.in { opacity: 1; transform: none; }
    .reveal.d1 { transition-delay: .1s } .reveal.d2 { transition-delay: .2s }
    .reveal.d3 { transition-delay: .3s } .reveal.d4 { transition-delay: .4s } .reveal.d5 { transition-delay: .5s }

    @keyframes blobA { 0%,100% { transform: translate(0,0) scale(1) } 50% { transform: translate(50px,-40px) scale(1.15) } }
    @keyframes blobB { 0%,100% { transform: translate(0,0) scale(1) } 50% { transform: translate(-60px,40px) scale(.9) } }
    .blob { position: absolute; border-radius: 50%; filter: blur(95px); pointer-events: none; }
    .blobA { animation: blobA 14s ease-in-out infinite }
    .blobB { animation: blobB 18s ease-in-out infinite }

    @keyframes shimmer { to { background-position: 200% center } }
    .shimmer-lime {
      background: linear-gradient(110deg, ${C.white} 35%, ${C.lime} 50%, ${C.white} 65%);
      background-size: 200% auto; -webkit-background-clip: text; background-clip: text;
      -webkit-text-fill-color: transparent; animation: shimmer 5s linear infinite;
    }

    @keyframes floaty { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-10px) } }
    .floaty { animation: floaty 5s ease-in-out infinite }

    .glass {
      background: rgba(28,25,23,0.55); backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px);
      border: 1px solid ${C.border}; border-radius: 22px;
      transition: transform .45s cubic-bezier(.16,1,.3,1), border-color .3s, box-shadow .45s;
    }
    .glass:hover { transform: translateY(-6px); border-color: rgba(163,230,53,.5); box-shadow: 0 24px 60px -22px rgba(163,230,53,.25); }

    .btn { display: inline-flex; align-items: center; gap: 10px; padding: 15px 26px; border-radius: 999px;
      font-weight: 600; font-size: 15px; text-decoration: none; cursor: pointer;
      transition: transform .25s cubic-bezier(.16,1,.3,1), box-shadow .3s, background .3s; }
    .btn:hover { transform: translateY(-3px) scale(1.02); }
    .btn .ic { transition: transform .25s }
    .btn:hover .ic { transform: translateX(4px) }
    .btn-lime { background: ${C.lime}; color: ${C.bg}; }
    .btn-lime:hover { box-shadow: 0 16px 40px -12px rgba(163,230,53,.45); }
    .btn-ghost { background: rgba(250,250,249,.06); color: ${C.white}; border: 1px solid ${C.border}; }
    .btn-ghost:hover { background: rgba(250,250,249,.12); }

    .tool-card { text-decoration: none; color: ${C.white}; display: block; }

    @media (prefers-reduced-motion: reduce) {
      .reveal { opacity: 1 !important; transform: none !important; transition: none !important; }
      .blobA, .blobB, .shimmer-lime, .floaty { animation: none !important; }
      .glass:hover, .btn:hover { transform: none; }
    }
  `}</style>
)

function Hero() {
  return (
    <section style={{ position: 'relative', padding: '110px 24px 70px', textAlign: 'center', overflow: 'hidden' }}>
      <div className="blob blobA" style={{ width: 440, height: 440, top: -130, left: '-8%', background: C.lime, opacity: 0.16 }} />
      <div className="blob blobB" style={{ width: 360, height: 360, bottom: -60, right: '-6%', background: C.gold, opacity: 0.14 }} />

      <div style={{ position: 'relative', maxWidth: 940, margin: '0 auto' }}>
        <p className="reveal" style={{ letterSpacing: 5, fontSize: 12, fontWeight: 600, color: C.lime, textTransform: 'uppercase', marginBottom: 22 }}>
          Print on Demand
        </p>
        <h1 className="display reveal d1" style={{ fontSize: 'clamp(46px, 8vw, 92px)', lineHeight: 1.04, fontWeight: 700, margin: '0 0 24px' }}>
          Lance ta marque<br />en <em className="shimmer-lime" style={{ fontStyle: 'italic' }}>30 jours.</em>
        </h1>
        <p className="reveal d2" style={{ fontSize: 17, lineHeight: 1.7, color: C.muted, maxWidth: 560, margin: '0 auto 40px', fontWeight: 300 }}>
          Zéro stock. Zéro investissement lourd. Tu crées, on produit, tu vends.
          Dès 1 pièce, production 48h à Alger.
        </p>

        <div className="reveal d3" style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', marginBottom: 56 }}>
          <Link href="/designer" className="btn btn-lime">
            <Icon name="palette" size={18} /> Crée ta marque <span className="ic"><Icon name="arrow" size={18} /></span>
          </Link>
          <Link href="/collection" className="btn btn-ghost">
            <Icon name="star" size={18} /> Collection
          </Link>
          <Link href="/produits" className="btn btn-ghost">
            <Icon name="shirt" size={18} /> Produits
          </Link>
          <Link href="/studio-3d" className="btn btn-ghost">
            <Icon name="cube" size={18} /> Studio 3D
          </Link>
        </div>

        <div className="reveal d4" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, maxWidth: 560, margin: '0 auto' }}>
          {[
            { to: 0, suffix: '', label: 'Minimum commande' },
            { to: 48, suffix: 'h', label: 'Production Alger' },
            { to: 80, suffix: '%', label: 'Marge possible' },
          ].map((s, i) => (
            <div key={i} style={{ padding: '18px 8px', borderRadius: 18, background: C.surface, border: `1px solid ${C.border}` }}>
              <p className="display" style={{ fontSize: 34, fontWeight: 700, margin: 0, color: C.lime }}>
                <CountUp to={s.to} suffix={s.suffix} />
              </p>
              <p style={{ fontSize: 11, color: C.muted, margin: '4px 0 0', letterSpacing: 1 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function HowItWorks() {
  const steps = [
    { icon: 'palette', title: 'Crée', desc: 'Ton design dans le Designer ou choisis dans la Collection.' },
    { icon: 'cube', title: 'Visualise', desc: 'Aperçu 3D réaliste de ta pièce avant production.' },
    { icon: 'box', title: 'Commande', desc: 'Dès 1 pièce, sans minimum, sans stock.' },
    { icon: 'coins', title: 'Vends', desc: 'On produit et livre, tu gardes la marge.' },
  ]
  return (
    <section style={{ padding: '80px 24px' }}>
      <div style={{ maxWidth: 1080, margin: '0 auto' }}>
        <h2 className="display reveal" style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 700, textAlign: 'center', marginBottom: 48 }}>
          Comment ça marche
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 18 }}>
          {steps.map((s, i) => (
            <div key={i} className={`glass reveal d${i}`} style={{ padding: 30, textAlign: 'center' }}>
              <div className="floaty" style={{ width: 62, height: 62, margin: '0 auto 20px', borderRadius: 20, background: C.limeSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', animationDelay: `${i * 0.6}s` }}>
                <Icon name={s.icon} size={28} color={C.lime} />
              </div>
              <p className="display" style={{ fontSize: 26, fontWeight: 700, margin: '0 0 8px' }}>{s.title}</p>
              <p style={{ fontSize: 13.5, color: C.muted, lineHeight: 1.7, margin: 0, fontWeight: 300 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Benefits() {
  const items = [
    { icon: 'sparkles', title: 'Pas de stock', desc: 'Commande à la demande. Zéro risque d’invendu.' },
    { icon: 'coins', title: 'Marges 70–80%', desc: 'Possible dès la première pièce vendue.' },
    { icon: 'zap', title: 'Test & Scale', desc: 'Teste 5 designs, scale sur celui qui marche.' },
    { icon: 'palette', title: 'Liberté créative', desc: 'DTF, broderie, flex — ton imagination est la limite.' },
    { icon: 'trend', title: 'Suis les trends', desc: 'Trend TikTok ? Produit en 48h et livré.' },
    { icon: 'globe', title: 'Vends partout', desc: 'Shopify, TikTok Shop, Instagram — on suit tes clients.' },
  ]
  return (
    <section style={{ padding: '40px 24px 80px' }}>
      <div style={{ maxWidth: 1080, margin: '0 auto' }}>
        <h2 className="display reveal" style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 700, textAlign: 'center', marginBottom: 48 }}>
          Pourquoi les créateurs nous choisissent
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          {items.map((b, i) => (
            <div key={i} className={`glass reveal d${i % 3}`} style={{ padding: 30 }}>
              <div style={{ width: 50, height: 50, borderRadius: 15, background: C.limeSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
                <Icon name={b.icon} size={24} color={C.lime} />
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 600, margin: '0 0 6px' }}>{b.title}</h3>
              <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.7, margin: 0, fontWeight: 300 }}>{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Tools() {
  const tools = [
    { icon: 'palette', title: 'Designer', desc: 'Crée ton design en ligne : textes, images, positionnement. Aperçu instantané.', href: '/designer', cta: 'Ouvrir le Designer' },
    { icon: 'star', title: 'The Collection', desc: '18 designs exclusifs prêts à vendre : Automotive, Minimalist, Graphic & Art, Limited.', href: '/collection', cta: 'Voir la Collection' },
    { icon: 'shirt', title: 'Produits', desc: 'T-shirts, hoodies, polos, casquettes... 50+ supports de qualité premium.', href: '/produits', cta: 'Voir les Produits' },
    { icon: 'cube', title: 'Studio 3D', desc: 'Visualise ta pièce en 3D avant de commander. Rendu réaliste, zéro surprise.', href: '/studio-3d', cta: 'Ouvrir le Studio 3D' },
  ]
  return (
    <section style={{ padding: '80px 24px', background: C.surface }}>
      <div style={{ maxWidth: 1080, margin: '0 auto' }}>
        <h2 className="display reveal" style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 700, textAlign: 'center', marginBottom: 12 }}>
          Tes outils de créateur
        </h2>
        <p className="reveal d1" style={{ textAlign: 'center', color: C.muted, marginBottom: 44, fontWeight: 300 }}>
          Tout ce qu’il faut pour lancer ta marque
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          {tools.map((t, i) => (
            <Link key={i} href={t.href} className={`glass tool-card reveal d${i % 2}`} style={{ padding: 34 }}>
              <div style={{ width: 56, height: 56, borderRadius: 18, background: C.limeSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 22 }}>
                <Icon name={t.icon} size={26} color={C.lime} />
              </div>
              <h3 className="display" style={{ fontSize: 28, fontWeight: 700, margin: '0 0 10px' }}>{t.title}</h3>
              <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.7, margin: '0 0 20px', fontWeight: 300 }}>{t.desc}</p>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: C.lime, fontWeight: 600, fontSize: 14 }}>
                {t.cta} <Icon name="arrow" size={16} color={C.lime} />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

function Stories() {
  const items = [
    { name: 'Lina K.', brand: 'Brand Vert', story: '500+ clients en 6 mois. Zéro stock, zéro risque !' },
    { name: 'Riad M.', brand: 'Streetwear RDZ', story: 'Chaque trend TikTok produite en 48h. On vend direct !' },
    { name: 'Amira S.', brand: 'Art Wear DZ', story: 'Je crée, eux gèrent la logistique. Parfait !' },
  ]
  return (
    <section style={{ padding: '80px 24px' }}>
      <div style={{ maxWidth: 1080, margin: '0 auto' }}>
        <h2 className="display reveal" style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 700, textAlign: 'center', marginBottom: 12 }}>
          Ils ont lancé leur marque
        </h2>
        <p className="reveal d1" style={{ textAlign: 'center', color: C.muted, marginBottom: 44, fontWeight: 300 }}>
          De vrais créateurs algériens
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
          {items.map((s, i) => (
            <figure key={i} className={`glass reveal d${i}`} style={{ padding: 30, margin: 0 }}>
              <div style={{ marginBottom: 14 }}><Icon name="quote" size={24} color={C.lime} /></div>
              <blockquote style={{ margin: '0 0 18px', fontSize: 15, lineHeight: 1.8, fontWeight: 300, fontStyle: 'italic', color: '#E7E5E4' }}>
                {s.story}
              </blockquote>
              <figcaption>
                <p style={{ fontWeight: 600, fontSize: 14, margin: 0 }}>{s.name}</p>
                <p style={{ fontSize: 12, color: C.lime, margin: '2px 0 0', fontWeight: 600 }}>{s.brand}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

function Pricing() {
  const tiers = [
    { name: 'DTF Simple', price: '1 950', href: '/designer', cta: 'Démarrer' },
    { name: 'DTF Full Color', price: '2 450', href: '/designer', cta: 'Démarrer', popular: true },
    { name: 'Broderie Premium', price: '3 950', href: 'https://wa.me/213557440522', cta: 'Infos', external: true },
  ]
  return (
    <section style={{ padding: '40px 24px 90px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <h2 className="display reveal" style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 700, textAlign: 'center', marginBottom: 12 }}>
          Tarifs créateur
        </h2>
        <p className="reveal d1" style={{ textAlign: 'center', color: C.muted, marginBottom: 44, fontWeight: 300 }}>
          Dès 1 pièce, sans minimum
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 18 }}>
          {tiers.map((t, i) => (
            <div
              key={i}
              className={`glass reveal d${i}`}
              style={{
                padding: 32, textAlign: 'center',
                background: t.popular ? C.limeSoft : undefined,
                border: t.popular ? `1.5px solid ${C.lime}` : undefined,
              }}
            >
              {t.popular && (
                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: C.lime, margin: '0 0 10px', textTransform: 'uppercase' }}>Populaire</p>
              )}
              <p style={{ fontWeight: 600, fontSize: 15, margin: '0 0 8px' }}>{t.name}</p>
              <p className="display" style={{ fontSize: 46, fontWeight: 700, margin: '0 0 22px', color: C.lime }}>
                {t.price} <span style={{ fontSize: 16 }}>DA</span>
              </p>
              {t.external ? (
                <a href={t.href} className="btn btn-lime" style={{ width: '100%', justifyContent: 'center', padding: '12px 20px' }}>
                  {t.cta} <span className="ic"><Icon name="arrow" size={16} /></span>
                </a>
              ) : (
                <Link href={t.href} className="btn btn-lime" style={{ width: '100%', justifyContent: 'center', padding: '12px 20px' }}>
                  {t.cta} <span className="ic"><Icon name="arrow" size={16} /></span>
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FinalCTA() {
  return (
    <section style={{ position: 'relative', padding: '100px 24px', textAlign: 'center', overflow: 'hidden', background: C.surface }}>
      <div className="blob blobA" style={{ width: 480, height: 300, top: '15%', left: '30%', background: C.lime, opacity: 0.12 }} />
      <div style={{ position: 'relative' }}>
        <h2 className="display reveal" style={{ fontSize: 'clamp(38px, 6.5vw, 68px)', fontWeight: 700, marginBottom: 14 }}>
          Prêt à te lancer ?
        </h2>
        <p className="reveal d1" style={{ color: C.muted, marginBottom: 40, fontWeight: 300 }}>
          Commence maintenant. Zéro stock. Zéro risque.
        </p>
        <div className="reveal d2" style={{ display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center' }}>
          <Link href="/designer" className="btn btn-lime">
            <Icon name="palette" size={18} /> Crée ta marque <span className="ic"><Icon name="arrow" size={18} /></span>
          </Link>
          <Link href="/studio-3d" className="btn btn-ghost">
            <Icon name="cube" size={18} /> Studio 3D
          </Link>
          <a href="https://wa.me/213557440522" className="btn btn-ghost">
            <Icon name="message" size={18} /> WhatsApp
          </a>
        </div>
      </div>
    </section>
  )
}

export default function PagePrintOnDemand() {
  useReveal()
  return (
    <div className="pod-root">
      <GlobalStyle />
      <Hero />
      <HowItWorks />
      <Benefits />
      <Tools />
      <Stories />
      <Pricing />
      <FinalCTA />
    </div>
  )
}
