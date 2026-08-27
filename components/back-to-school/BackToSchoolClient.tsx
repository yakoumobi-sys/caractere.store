'use client'

import Link from 'next/link'

const C = {
  black: '#0C0A09',
  dark: '#151212',
  white: '#FAFAF9',
  muted: '#A8A29E',
  from: '#FF7A3D',
  to: '#E63965',
}

const LOGO = 'https://aijlvbipvqnvbywxhlbd.supabase.co/storage/v1/object/public/image/logo-white-transparent.png'
const WA = 'https://wa.me/213557440522'

type Offer = {
  id: string
  tag: string
  title: string
  subtitle: string
  price: string
  oldPrice?: string
  desc: string
  bullets: string[]
  image: string
  sizes: string[]
  colors: { name: string; hex: string }[]
}

const OFFERS: Offer[] = [
  {
    id: 'jogger-pack',
    tag: 'Pack rentrée',
    title: 'Jogger Pack',
    subtitle: '2 Baggy Joggers',
    price: '4 900 DA',
    desc: "Un jogger gris, un jogger noir — coupe baggy confortable pour toute la journée en cours. Le duo qui couvre ta semaine.",
    bullets: ['2 joggers baggy — 1 gris, 1 noir', 'Molleton épais, coupe confortable', 'Livraison 58 wilayas'],
    image: '/back-to-school/jogger-pack.png',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Gris', hex: '#9CA3AF' },
      { name: 'Noir', hex: '#111111' },
    ],
  },
]

const waLink = (offer: Offer) =>
  `${WA}?text=${encodeURIComponent(`Salam ! Je veux commander le ${offer.title} (${offer.subtitle}) à ${offer.price} 🎒\nTaille : \nCouleurs souhaitées : `)}`

const GlobalStyle = () => (
  <style dangerouslySetInnerHTML={{ __html: `
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;700;800;900&display=swap');

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body, html {
      font-family: 'Montserrat', sans-serif;
      background: ${C.black};
      color: ${C.white};
      font-weight: 600;
      line-height: 1.6;
    }

    header {
      position: sticky; top: 0; z-index: 100;
      background: rgba(12,10,9,.92);
      backdrop-filter: blur(14px);
      border-bottom: 1px solid rgba(250,250,249,.08);
      padding: 14px 24px;
      display: flex; justify-content: space-between; align-items: center;
    }
    header img { height: 34px; width: auto; }
    header .cta-nav {
      background: linear-gradient(135deg, ${C.from}, ${C.to}); color: ${C.white};
      padding: 10px 18px; border-radius: 8px;
      font-weight: 800; font-size: 13px; text-decoration: none;
      transition: transform .25s;
    }
    header .cta-nav:hover { transform: translateY(-2px); }

    .wrap { max-width: 1100px; margin: 0 auto; padding: 0 24px; }

    .hero { padding: 72px 0 56px; text-align: center; position: relative; overflow: hidden; }
    .hero::before {
      content: '';
      position: absolute; inset: -20% -10% auto -10%; height: 480px;
      background: radial-gradient(closest-side, rgba(255,122,61,.25), transparent 70%);
      pointer-events: none;
    }
    .hero .eyebrow {
      position: relative;
      display: inline-block;
      background: linear-gradient(135deg, ${C.from}, ${C.to});
      color: ${C.white};
      padding: 7px 18px; border-radius: 999px;
      font-size: 12px; font-weight: 800; letter-spacing: 2px;
      text-transform: uppercase; margin-bottom: 26px;
    }
    .hero h1 {
      position: relative;
      font-size: clamp(32px, 6vw, 60px);
      font-weight: 900; line-height: 1.08;
      margin-bottom: 18px; letter-spacing: -1px;
    }
    .hero h1 .accent {
      background: linear-gradient(135deg, ${C.from}, ${C.to});
      -webkit-background-clip: text; background-clip: text; color: transparent;
    }
    .hero .sub {
      position: relative;
      font-size: 17px; color: ${C.muted};
      max-width: 560px; margin: 0 auto; font-weight: 600;
    }

    .section { padding: 20px 0 90px; }

    .offer-card {
      display: grid; grid-template-columns: 1fr 1fr; gap: 0;
      background: rgba(250,250,249,.03);
      border: 1px solid rgba(250,250,249,.09);
      border-radius: 22px; overflow: hidden;
      max-width: 920px; margin: 0 auto;
    }
    .offer-media { position: relative; background: #EDE7E0; min-height: 360px; }
    .offer-media img { width: 100%; height: 100%; object-fit: cover; display: block; }
    .offer-media .tag {
      position: absolute; top: 18px; left: 18px;
      background: linear-gradient(135deg, ${C.from}, ${C.to}); color: ${C.white};
      padding: 6px 14px; border-radius: 999px;
      font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: .05em;
    }
    .offer-body { padding: 40px 38px; display: flex; flex-direction: column; }
    .offer-body h2 { font-size: clamp(24px, 3.4vw, 32px); font-weight: 900; margin-bottom: 4px; letter-spacing: -.5px; }
    .offer-body .subtitle { color: ${C.muted}; font-weight: 700; font-size: 15px; margin-bottom: 18px; }
    .offer-body .price-row { display: flex; align-items: baseline; gap: 12px; margin-bottom: 22px; }
    .offer-body .price { font-size: 34px; font-weight: 900; background: linear-gradient(135deg, ${C.from}, ${C.to}); -webkit-background-clip: text; background-clip: text; color: transparent; }
    .offer-body .old-price { font-size: 16px; color: ${C.muted}; text-decoration: line-through; font-weight: 700; }
    .offer-body p.desc { color: ${C.muted}; font-size: 14px; margin-bottom: 22px; }
    .offer-bullets { list-style: none; margin-bottom: 28px; }
    .offer-bullets li {
      display: flex; gap: 10px; align-items: flex-start;
      font-size: 14px; font-weight: 700; padding: 8px 0;
      border-bottom: 1px solid rgba(250,250,249,.07);
    }
    .offer-bullets li:last-child { border-bottom: none; }
    .offer-bullets li .check { color: ${C.from}; font-weight: 900; }

    .offer-meta { margin-bottom: 24px; }
    .offer-meta .meta-label { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: .08em; color: ${C.muted}; margin-bottom: 10px; }
    .offer-meta .meta-row { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 18px; }
    .offer-meta .meta-row:last-child { margin-bottom: 0; }
    .size-chip {
      min-width: 38px; height: 38px; padding: 0 6px;
      display: flex; align-items: center; justify-content: center;
      border: 1.5px solid rgba(250,250,249,.18); border-radius: 8px;
      font-size: 13px; font-weight: 800; color: ${C.white};
    }
    .color-chip {
      display: flex; align-items: center; gap: 8px;
      border: 1.5px solid rgba(250,250,249,.18); border-radius: 999px;
      padding: 6px 14px 6px 8px;
      font-size: 13px; font-weight: 700; color: ${C.white};
    }
    .color-chip .swatch { width: 18px; height: 18px; border-radius: 50%; border: 1px solid rgba(255,255,255,.25); }

    .btn {
      display: inline-flex; align-items: center; justify-content: center; gap: 10px;
      padding: 16px 28px; border-radius: 10px;
      font-weight: 800; font-size: 15px;
      text-decoration: none; cursor: pointer;
      transition: transform .25s, box-shadow .3s; border: none;
    }
    .btn:hover { transform: translateY(-3px); }
    .btn-bts { background: linear-gradient(135deg, ${C.from}, ${C.to}); color: ${C.white}; box-shadow: 0 12px 34px -12px rgba(230,57,101,.5); }

    .soon-card {
      max-width: 920px; margin: 22px auto 0;
      border: 1.5px dashed rgba(250,250,249,.16);
      border-radius: 22px; padding: 26px 30px;
      text-align: center; color: ${C.muted}; font-size: 14px; font-weight: 700;
    }

    footer { background: ${C.black}; border-top: 1px solid rgba(250,250,249,.07); padding: 40px 24px; text-align: center; }
    footer img { height: 30px; margin-bottom: 16px; opacity: .9; }
    footer p { font-size: 12px; color: ${C.muted}; font-weight: 700; }

    @media (max-width: 720px) {
      .offer-card { grid-template-columns: 1fr; }
      .offer-media { min-height: 280px; }
      .offer-body { padding: 32px 26px; }
    }
  `}} />
)

export default function BackToSchoolClient() {
  return (
    <div style={{ background: C.black, color: C.white, minHeight: '100vh' }}>
      <GlobalStyle />

      <header>
        <Link href="/"><img src={LOGO} alt="Caractère" /></Link>
        <a href={WA} className="cta-nav">💬 Commander sur WhatsApp</a>
      </header>

      <section className="hero">
        <div className="wrap">
          <span className="eyebrow">🎒 Back to School</span>
          <h1>
            Tepyach pour la rentrée.<br />
            <span className="accent">Packs & promotions.</span>
          </h1>
          <p className="sub">
            Des packs pensés pour la rentrée — prix serrés, qualité Caractère, livraison dans les 58 wilayas.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          {OFFERS.map((offer) => (
            <div key={offer.id} className="offer-card">
              <div className="offer-media">
                <span className="tag">{offer.tag}</span>
                <img src={offer.image} alt={offer.title} />
              </div>
              <div className="offer-body">
                <h2>{offer.title}</h2>
                <p className="subtitle">{offer.subtitle}</p>
                <div className="price-row">
                  <span className="price">{offer.price}</span>
                  {offer.oldPrice && <span className="old-price">{offer.oldPrice}</span>}
                </div>
                <p className="desc">{offer.desc}</p>

                <div className="offer-meta">
                  <div className="meta-label">Tailles disponibles</div>
                  <div className="meta-row">
                    {offer.sizes.map((s) => (
                      <span key={s} className="size-chip">{s}</span>
                    ))}
                  </div>
                  <div className="meta-label">Couleurs</div>
                  <div className="meta-row">
                    {offer.colors.map((c) => (
                      <span key={c.name} className="color-chip">
                        <span className="swatch" style={{ background: c.hex }} />
                        {c.name}
                      </span>
                    ))}
                  </div>
                </div>

                <ul className="offer-bullets">
                  {offer.bullets.map((b, i) => (
                    <li key={i}><span className="check">✓</span>{b}</li>
                  ))}
                </ul>
                <a href={waLink(offer)} className="btn btn-bts">💬 Commander ce pack</a>
              </div>
            </div>
          ))}

          <div className="soon-card">D&rsquo;autres packs rentrée arrivent bientôt 🎒</div>
        </div>
      </section>

      <footer>
        <img src={LOGO} alt="Caractère" />
        <p>© 2026 Caractère Store • Back to School • Livraison 58 wilayas</p>
      </footer>
    </div>
  )
}
