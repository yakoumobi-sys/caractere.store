'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

/* Design system ui-ux-pro-max — Liquid Glass, noir + or, Cormorant/Montserrat */

const C = {
  bg: '#0C0A09',
  surface: '#1C1917',
  white: '#FAFAF9',
  muted: '#A8A29E',
  border: 'rgba(250,250,249,0.1)',
  gold: '#D4A574',
  goldSoft: 'rgba(212,165,116,0.14)',
}

function Icon({ name, size = 20, color = 'currentColor' }: { name: string; size?: number; color?: string }) {
  const paths: Record<string, JSX.Element> = {
    arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
    settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></>,
    shirt: <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />,
    phone: <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />,
    zap: <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />,
    box: <><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><path d="M3.27 6.96 12 12.01l8.73-5.05M12 22.08V12" /></>,
    target: <><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></>,
    chart: <path d="M3 3v18h18M18 17V9M13 17V5M8 17v-3" />,
    hands: <path d="M11 12h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 14M7 18l2-2c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9" />,
    brush: <><path d="M9.06 11.9 8.34 12.62a2.83 2.83 0 1 1-4-4l.72-.72" /><path d="m14 7 3 3M5 6v4M19 14v4M10 2v2M7 8H3M21 16h-4M11 3H9" /></>,
    check: <path d="M20 6 9 17l-5-5" />,
    quote: <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />,
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

    .ent-root { font-family: 'Montserrat', sans-serif; background: ${C.bg}; color: ${C.white}; overflow-x: hidden; }
    .ent-root .display { font-family: 'Cormorant', serif; }

    .reveal { opacity: 0; transform: translateY(34px); transition: opacity .8s cubic-bezier(.16,1,.3,1), transform .8s cubic-bezier(.16,1,.3,1); }
    .reveal.in { opacity: 1; transform: none; }
    .reveal.d1 { transition-delay: .1s } .reveal.d2 { transition-delay: .2s }
    .reveal.d3 { transition-delay: .3s } .reveal.d4 { transition-delay: .4s } .reveal.d5 { transition-delay: .5s }

    @keyframes blobA { 0%,100% { transform: translate(0,0) scale(1) } 50% { transform: translate(60px,-40px) scale(1.12) } }
    .blob { position: absolute; border-radius: 50%; filter: blur(100px); pointer-events: none; animation: blobA 16s ease-in-out infinite; }

    @keyframes shimmer { to { background-position: 200% center } }
    .shimmer-gold {
      background: linear-gradient(110deg, ${C.white} 35%, ${C.gold} 50%, ${C.white} 65%);
      background-size: 200% auto; -webkit-background-clip: text; background-clip: text;
      -webkit-text-fill-color: transparent; animation: shimmer 5s linear infinite;
    }

    .glass {
      background: rgba(28,25,23,0.55); backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px);
      border: 1px solid ${C.border}; border-radius: 22px;
      transition: transform .45s cubic-bezier(.16,1,.3,1), border-color .3s, box-shadow .45s;
    }
    .glass:hover { transform: translateY(-6px); border-color: rgba(212,165,116,.5); box-shadow: 0 24px 60px -22px rgba(212,165,116,.3); }

    .btn { display: inline-flex; align-items: center; gap: 10px; padding: 16px 28px; border-radius: 999px;
      font-weight: 600; font-size: 15px; text-decoration: none; cursor: pointer;
      transition: transform .25s cubic-bezier(.16,1,.3,1), box-shadow .3s, background .3s; }
    .btn:hover { transform: translateY(-3px) scale(1.02); }
    .btn .ic { transition: transform .25s }
    .btn:hover .ic { transform: translateX(4px) }
    .btn-gold { background: ${C.gold}; color: ${C.bg}; }
    .btn-gold:hover { box-shadow: 0 16px 40px -12px rgba(212,165,116,.5); }
    .btn-outline { background: transparent; color: ${C.gold}; border: 1.5px solid ${C.gold}; }
    .btn-outline:hover { background: ${C.goldSoft}; }
    .btn-ghost { background: rgba(250,250,249,.06); color: ${C.white}; border: 1px solid ${C.border}; }
    .btn-ghost:hover { background: rgba(250,250,249,.12); }

    .tier { transition: transform .4s cubic-bezier(.16,1,.3,1), border-color .3s; cursor: default; }
    .tier:hover { transform: translateY(-8px) scale(1.02); border-color: ${C.gold} !important; }

    .step-line { position: absolute; left: 27px; top: 56px; bottom: -28px; width: 2px;
      background: linear-gradient(${C.gold}, transparent); opacity: .35; }

    @media (prefers-reduced-motion: reduce) {
      .reveal { opacity: 1 !important; transform: none !important; transition: none !important; }
      .blob, .shimmer-gold { animation: none !important; }
      .glass:hover, .btn:hover, .tier:hover { transform: none; }
    }
  `}</style>
)

function Hero() {
  return (
    <section style={{ position: 'relative', padding: '110px 24px 70px', textAlign: 'center', overflow: 'hidden' }}>
      <div className="blob" style={{ width: 460, height: 460, top: -140, right: '-10%', background: C.gold, opacity: 0.2 }} />
      <div style={{ position: 'relative', maxWidth: 920, margin: '0 auto' }}>
        <p className="reveal" style={{ letterSpacing: 5, fontSize: 12, fontWeight: 600, color: C.gold, textTransform: 'uppercase', marginBottom: 22 }}>
          Espace Entreprise
        </p>
        <h1 className="display reveal d1" style={{ fontSize: 'clamp(44px, 7.5vw, 84px)', lineHeight: 1.05, fontWeight: 700, margin: '0 0 24px' }}>
          Uniformes & branding<br /><em className="shimmer-gold" style={{ fontStyle: 'italic' }}>au sérieux.</em>
        </h1>
        <p className="reveal d2" style={{ fontSize: 17, lineHeight: 1.7, color: C.muted, maxWidth: 600, margin: '0 auto 40px', fontWeight: 300 }}>
          Depuis 8 ans, nous équipons restaurants, cliniques, corporations et BTP algériens.
          Qualité garantie, délais respectés, suivi transparent.
        </p>

        <div className="reveal d3" style={{ display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center', marginBottom: 60 }}>
          <Link href="/configurateur" className="btn btn-gold">
            <Icon name="settings" size={18} /> Configurer ma commande <span className="ic"><Icon name="arrow" size={18} /></span>
          </Link>
          <Link href="/produits" className="btn btn-ghost">
            <Icon name="shirt" size={18} /> Produits
          </Link>
          <a href="tel:+213557440522" className="btn btn-outline">
            <Icon name="phone" size={18} /> Nous appeler
          </a>
        </div>

        <div className="reveal d4" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, maxWidth: 620, margin: '0 auto' }}>
          {[
            { to: 50000, suffix: '+', label: 'Pièces produites' },
            { to: 500, suffix: '+', label: 'Entreprises' },
            { to: 48, suffix: 'h', label: 'Production garantie' },
          ].map((s, i) => (
            <div key={i} style={{ padding: '20px 8px', borderRadius: 18, background: C.surface, border: `1px solid ${C.border}` }}>
              <p className="display" style={{ fontSize: 36, fontWeight: 700, margin: 0, color: C.gold }}>
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

function Benefits() {
  const items = [
    { icon: 'zap', title: 'Délai 48h garanti', desc: 'Production à Alger. Pas de retard, pas de surprise.' },
    { icon: 'box', title: 'Volume sans stress', desc: '10 pièces ou 500 — même qualité, même délai.' },
    { icon: 'target', title: 'Consistance totale', desc: 'Zéro variation entre les commandes.' },
    { icon: 'chart', title: 'Rabais volume', desc: 'Jusqu’à −30% à partir de 500 pièces.' },
    { icon: 'hands', title: 'Suivi transparent', desc: 'WhatsApp direct, photos de production, tracking.' },
    { icon: 'brush', title: 'Branding sur mesure', desc: 'Logo, couleurs, étiquettes personnalisées.' },
  ]
  return (
    <section style={{ padding: '80px 24px' }}>
      <div style={{ maxWidth: 1080, margin: '0 auto' }}>
        <h2 className="display reveal" style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 700, textAlign: 'center', marginBottom: 48 }}>
          Pourquoi les entreprises nous choisissent
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          {items.map((b, i) => (
            <div key={i} className={`glass reveal d${i % 3}`} style={{ padding: 32 }}>
              <div style={{ width: 52, height: 52, borderRadius: 16, background: C.goldSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                <Icon name={b.icon} size={24} color={C.gold} />
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 600, margin: '0 0 8px' }}>{b.title}</h3>
              <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.7, margin: 0, fontWeight: 300 }}>{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Sectors() {
  const sectors = [
    { name: 'Restauration', ex: 'Polos & tabliers brodés' },
    { name: 'Santé', ex: 'Blouses & uniformes' },
    { name: 'BTP', ex: 'Gilets de chantier' },
    { name: 'Corporate', ex: 'Événements & formations' },
    { name: 'Retail', ex: 'Merchandising' },
    { name: 'Sports', ex: 'Maillots & t-shirts' },
  ]
  return (
    <section style={{ padding: '40px 24px 80px' }}>
      <div style={{ maxWidth: 1080, margin: '0 auto' }}>
        <h2 className="display reveal" style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 700, textAlign: 'center', marginBottom: 12 }}>
          Secteurs desservis
        </h2>
        <p className="reveal d1" style={{ textAlign: 'center', color: C.muted, marginBottom: 44, fontWeight: 300 }}>
          Depuis 8 ans, on équipe tous les secteurs
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14 }}>
          {sectors.map((s, i) => (
            <div key={i} className={`reveal d${i % 3}`} style={{ padding: '22px 18px', borderRadius: 16, background: C.surface, borderLeft: `3px solid ${C.gold}`, border: `1px solid ${C.border}`, borderLeftColor: C.gold, borderLeftWidth: 3 }}>
              <p style={{ fontWeight: 600, fontSize: 15, margin: '0 0 4px' }}>{s.name}</p>
              <p style={{ fontSize: 12, color: C.muted, margin: 0, fontWeight: 300 }}>{s.ex}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Testimonials() {
  const items = [
    { name: 'Karim B.', role: 'Restaurant El Kef', text: '80 polos brodés. Rendu impeccable, délai respecté. Troisième commande !' },
    { name: 'Dr. Samira M.', role: 'Clinique Al Chifa', text: '45 blouses pour notre équipe. Qualité premium, broderie précise.' },
    { name: 'Yacine O.', role: 'BTP Construct', text: '120 gilets en 5 jours. Après 1 mois sur chantier, toujours parfait.' },
    { name: 'Mohamed T.', role: 'Alger Events', text: '200 t-shirts en 48h pour un événement corporate. Zéro problème.' },
  ]
  return (
    <section style={{ padding: '80px 24px', background: C.surface }}>
      <div style={{ maxWidth: 1080, margin: '0 auto' }}>
        <h2 className="display reveal" style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 700, textAlign: 'center', marginBottom: 48 }}>
          Nos clients parlent
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          {items.map((t, i) => (
            <figure key={i} className={`glass reveal d${i % 2}`} style={{ padding: 30, margin: 0 }}>
              <div style={{ marginBottom: 16 }}><Icon name="quote" size={26} color={C.gold} /></div>
              <blockquote style={{ margin: '0 0 20px', fontSize: 15, lineHeight: 1.8, fontWeight: 300, fontStyle: 'italic', color: '#E7E5E4' }}>
                {t.text}
              </blockquote>
              <figcaption>
                <p style={{ fontWeight: 600, fontSize: 14, margin: 0, color: C.gold }}>{t.name}</p>
                <p style={{ fontSize: 12, color: C.muted, margin: '2px 0 0' }}>{t.role}</p>
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
    { qty: '10–50', price: '1 950', note: 'Unité (DTF)' },
    { qty: '50–200', price: '1 650', note: '−15%', popular: true },
    { qty: '200–500', price: '1 400', note: '−25%' },
    { qty: '500+', price: '1 200', note: '−30%' },
  ]
  return (
    <section style={{ padding: '80px 24px' }}>
      <div style={{ maxWidth: 1080, margin: '0 auto' }}>
        <h2 className="display reveal" style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 700, textAlign: 'center', marginBottom: 12 }}>
          Tarifs B2B
        </h2>
        <p className="reveal d1" style={{ textAlign: 'center', color: C.muted, marginBottom: 44, fontWeight: 300 }}>
          À partir de 10 pièces · Rabais volume jusqu’à −30%
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          {tiers.map((t, i) => (
            <div
              key={i}
              className={`tier reveal d${i}`}
              style={{
                padding: '32px 22px', borderRadius: 20, textAlign: 'center',
                background: t.popular ? C.goldSoft : C.surface,
                border: t.popular ? `1.5px solid ${C.gold}` : `1px solid ${C.border}`,
              }}
            >
              {t.popular && (
                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: C.gold, margin: '0 0 10px', textTransform: 'uppercase' }}>Populaire</p>
              )}
              <p style={{ fontSize: 14, fontWeight: 600, margin: '0 0 6px' }}>{t.qty} pièces</p>
              <p className="display" style={{ fontSize: 42, fontWeight: 700, margin: 0, color: C.gold }}>
                {t.price} <span style={{ fontSize: 16 }}>DA</span>
              </p>
              <p style={{ fontSize: 12, color: C.muted, margin: '6px 0 0' }}>{t.note}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Process() {
  const steps = [
    { title: 'Devis gratuit', desc: 'Vous décrivez le projet, prix en 1h.' },
    { title: 'Validation', desc: '30% d’acompte pour démarrer.' },
    { title: 'Production 48h', desc: 'Photos de suivi via WhatsApp.' },
    { title: 'QC & Livraison', desc: 'Contrôle qualité, puis 3–5 jours.' },
  ]
  return (
    <section style={{ padding: '60px 24px 90px' }}>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <h2 className="display reveal" style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 700, textAlign: 'center', marginBottom: 48 }}>
          Processus transparent
        </h2>
        {steps.map((s, i) => (
          <div key={i} className={`reveal d${i}`} style={{ position: 'relative', display: 'flex', gap: 20, paddingBottom: i < steps.length - 1 ? 36 : 0 }}>
            {i < steps.length - 1 && <div className="step-line" />}
            <div style={{ width: 54, height: 54, borderRadius: '50%', flexShrink: 0, background: C.goldSoft, border: `1.5px solid ${C.gold}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="display" style={{ fontSize: 24, fontWeight: 700, color: C.gold }}>{i + 1}</span>
            </div>
            <div style={{ paddingTop: 6 }}>
              <p style={{ fontWeight: 600, fontSize: 17, margin: '0 0 4px' }}>{s.title}</p>
              <p style={{ fontSize: 14, color: C.muted, margin: 0, fontWeight: 300 }}>{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function FinalCTA() {
  return (
    <section style={{ position: 'relative', padding: '100px 24px', textAlign: 'center', overflow: 'hidden', background: C.surface }}>
      <div className="blob" style={{ width: 480, height: 300, top: '15%', left: '32%', background: C.gold, opacity: 0.15 }} />
      <div style={{ position: 'relative' }}>
        <h2 className="display reveal" style={{ fontSize: 'clamp(36px, 6vw, 60px)', fontWeight: 700, marginBottom: 14 }}>
          Prêt à équiper votre équipe ?
        </h2>
        <p className="reveal d1" style={{ color: C.muted, marginBottom: 40, fontWeight: 300 }}>
          Devis gratuit · Réponse en 2h · Sans engagement
        </p>
        <div className="reveal d2" style={{ display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center', marginBottom: 48 }}>
          <Link href="/configurateur" className="btn btn-gold">
            <Icon name="settings" size={18} /> Configurer ma commande <span className="ic"><Icon name="arrow" size={18} /></span>
          </Link>
          <a href="tel:+213557440522" className="btn btn-outline">
            <Icon name="phone" size={18} /> Nous appeler
          </a>
        </div>
        <div className="reveal d3" style={{ display: 'flex', flexWrap: 'wrap', gap: 36, justifyContent: 'center' }}>
          <div>
            <p style={{ fontSize: 11, letterSpacing: 2, color: C.muted, margin: '0 0 4px' }}>TÉLÉPHONE / WHATSAPP</p>
            <p style={{ fontWeight: 600, color: C.gold, margin: 0 }}>+213 557 440 522</p>
          </div>
          <div>
            <p style={{ fontSize: 11, letterSpacing: 2, color: C.muted, margin: '0 0 4px' }}>EMAIL</p>
            <p style={{ fontWeight: 600, color: C.gold, margin: 0 }}>yakoumobi@gmail.com</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function PageEntreprise() {
  useReveal()
  return (
    <div className="ent-root">
      <GlobalStyle />
      <Hero />
      <Benefits />
      <Sectors />
      <Testimonials />
      <Pricing />
      <Process />
      <FinalCTA />
    </div>
  )
}
