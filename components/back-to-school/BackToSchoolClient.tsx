'use client'

import { useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import wilayas from '@/lib/data/wilayas.json'
import communes from '@/lib/data/communes.json'

const C = {
  black: '#0C0A09',
  dark: '#151212',
  white: '#FAFAF9',
  muted: '#A8A29E',
  from: '#FF7A3D',
  to: '#E63965',
  green: '#22C55E',
}

const LOGO = 'https://aijlvbipvqnvbywxhlbd.supabase.co/storage/v1/object/public/image/logo-white-transparent.png'
const WA_NUMBER = '213557440522'
const WA = `https://wa.me/${WA_NUMBER}`

const PRODUCTS = [
  {
    id: 'jogger-pack',
    tag: 'Pack rentrée',
    title: 'Jogger Pack',
    subtitle: '2 Baggy Joggers',
    priceDZD: 4900,
    desc: "Un jogger gris, un jogger noir — coupe baggy confortable pour toute la journée en cours. Le duo qui couvre ta semaine.",
    bullets: ['2 joggers baggy — 1 gris, 1 noir', 'Molleton épais, coupe confortable', 'Paiement à la livraison'],
    images: ['/back-to-school/jogger-pack.png', '/back-to-school/jogger-gallery-2.jpg'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Gris', hex: '#9CA3AF' },
      { name: 'Noir', hex: '#111111' },
    ],
  },
  {
    id: 'bro-pack',
    tag: 'Pack complet',
    title: 'Bro Pack',
    subtitle: '2 T-shirts Oversized + 2 Joggers',
    priceDZD: 10000,
    desc: '2 T-shirts oversized "BOYZ FROM +213" + 2 baggy joggers (gris et noir). Le pack complet pour la rentrée.',
    bullets: ['2 T-shirts oversized premium', '2 Joggers baggy — 1 gris, 1 noir', 'Paiement à la livraison'],
    images: ['/back-to-school/bro-pack-hero.png', '/back-to-school/bro-gallery-1.jpg'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Blanc', hex: '#FFFFFF' },
      { name: 'Noir', hex: '#111111' },
    ],
  },
]

const money = (n: number) => `${n.toLocaleString('fr-FR')} DA`

type WilayaOpt = { code: number; name: string }
type CommuneOpt = { id: number; name: string; wilayaCode: number }
const WILAYAS = wilayas as WilayaOpt[]
const COMMUNES = communes as CommuneOpt[]

const PHONE_RE = /^0[5-7][0-9]{8}$/
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type FormState = {
  size: string
  qty: number
  nom: string
  email: string
  telephone: string
  modeLivraison: 'bureau' | 'domicile'
  wilayaCode: number | ''
  commune: string
  adresse: string
}

const initialForm: FormState = {
  size: '',
  qty: 1,
  nom: '',
  email: '',
  telephone: '',
  modeLivraison: 'bureau',
  wilayaCode: '',
  commune: '',
  adresse: '',
}

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

    .catalog { padding: 60px 0; }
    .catalog-title { font-size: clamp(32px, 5vw, 48px); font-weight: 900; text-align: center; letter-spacing: -1px; margin-bottom: 12px; }
    .catalog-sub { text-align: center; color: ${C.muted}; font-size: 16px; margin-bottom: 48px; }
    .catalog-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; max-width: 900px; margin: 0 auto; }
    @media (max-width: 768px) { .catalog-grid { grid-template-columns: 1fr; gap: 16px; } }

    .pack-card {
      position: relative;
      border: 1.5px solid rgba(250,250,249,.12);
      border-radius: 20px;
      padding: 32px 24px;
      cursor: pointer;
      transition: all .3s cubic-bezier(0.22,1,0.36,1);
      background: rgba(250,250,249,.02);
      overflow: hidden;
    }
    .pack-card::before {
      content: '';
      position: absolute; inset: 0;
      background: linear-gradient(135deg, rgba(255,122,61,0.1), rgba(230,57,101,0.1));
      opacity: 0;
      transition: opacity .3s;
      pointer-events: none;
    }
    .pack-card:hover {
      border-color: ${C.from};
      transform: translateY(-6px);
      box-shadow: 0 20px 50px rgba(0,0,0,0.3);
    }
    .pack-card:hover::before { opacity: 1; }

    .pack-card-badge { display: inline-block; background: linear-gradient(135deg, ${C.from}, ${C.to}); color: white; font-size: 11px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; padding: 6px 14px; border-radius: 999px; margin-bottom: 16px; }
    .pack-card-title { font-size: 28px; font-weight: 900; margin-bottom: 6px; letter-spacing: -0.5px; }
    .pack-card-sub { color: ${C.muted}; font-size: 14px; font-weight: 600; margin-bottom: 16px; }
    .pack-card-price { font-size: 36px; font-weight: 900; background: linear-gradient(135deg, ${C.from}, ${C.to}); -webkit-background-clip: text; background-clip: text; color: transparent; margin-bottom: 18px; }
    .pack-card-bullets { list-style: none; margin-bottom: 24px; }
    .pack-card-bullets li { display: flex; gap: 10px; font-size: 13px; margin-bottom: 8px; color: ${C.muted}; }
    .pack-card-bullets li:before { content: '✓'; color: ${C.from}; font-weight: 900; min-width: 20px; }

    .hero { padding: 44px 0 32px; }
    .hero-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 46px; align-items: start; }

    .gallery-main {
      position: relative; border-radius: 20px; overflow: hidden;
      background: #EDE7E0; aspect-ratio: 4/5;
    }
    .gallery-main img { width: 100%; height: 100%; object-fit: cover; display: block; }
    .gallery-main .tag {
      position: absolute; top: 16px; left: 16px;
      background: linear-gradient(135deg, ${C.from}, ${C.to}); color: ${C.white};
      padding: 6px 14px; border-radius: 999px;
      font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: .05em;
    }
    .gallery-thumbs { display: flex; gap: 10px; margin-top: 10px; }
    .gallery-thumbs button {
      flex: 1; padding: 0; border-radius: 12px; overflow: hidden; cursor: pointer;
      border: 2px solid transparent; background: #EDE7E0; aspect-ratio: 4/5;
    }
    .gallery-thumbs button.active { border-color: ${C.from}; }
    .gallery-thumbs img { width: 100%; height: 100%; object-fit: cover; display: block; }

    .eyebrow {
      display: inline-block;
      background: linear-gradient(135deg, ${C.from}, ${C.to});
      color: ${C.white};
      padding: 7px 16px; border-radius: 999px;
      font-size: 12px; font-weight: 800; letter-spacing: 1.5px;
      text-transform: uppercase; margin-bottom: 18px;
    }
    .p-title { font-size: clamp(28px, 4vw, 42px); font-weight: 900; letter-spacing: -1px; margin-bottom: 6px; }
    .p-subtitle { color: ${C.muted}; font-weight: 700; font-size: 15px; margin-bottom: 18px; }
    .p-price { font-size: 36px; font-weight: 900; background: linear-gradient(135deg, ${C.from}, ${C.to}); -webkit-background-clip: text; background-clip: text; color: transparent; margin-bottom: 18px; }
    .p-desc { color: ${C.muted}; font-size: 14px; margin-bottom: 22px; max-width: 480px; }

    .p-bullets { list-style: none; margin-bottom: 24px; }
    .p-bullets li { display: flex; gap: 10px; align-items: flex-start; font-size: 14px; font-weight: 700; padding: 7px 0; }
    .p-bullets li .check { color: ${C.from}; font-weight: 900; }

    .trust-row { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 26px; }
    .trust-chip {
      display: flex; align-items: center; gap: 6px;
      background: rgba(250,250,249,.05); border: 1px solid rgba(250,250,249,.1);
      border-radius: 999px; padding: 7px 14px; font-size: 12px; font-weight: 700; color: ${C.muted};
    }

    .btn {
      display: inline-flex; align-items: center; justify-content: center; gap: 10px;
      padding: 17px 28px; border-radius: 10px; width: 100%;
      font-weight: 800; font-size: 15px;
      text-decoration: none; cursor: pointer;
      transition: transform .2s, box-shadow .3s, opacity .2s; border: none;
    }
    .btn:hover { transform: translateY(-2px); }
    .btn:disabled { opacity: .55; cursor: not-allowed; transform: none; }
    .btn-bts { background: linear-gradient(135deg, ${C.from}, ${C.to}); color: ${C.white}; box-shadow: 0 12px 34px -12px rgba(230,57,101,.5); }
    .btn-back { background: transparent; border: 1.5px solid rgba(250,250,249,.2); color: ${C.white}; }

    .section { padding: 10px 0 90px; }
    .section-title { font-size: clamp(22px, 3vw, 30px); font-weight: 900; text-align: center; margin-bottom: 8px; letter-spacing: -.5px; }
    .section-sub { text-align: center; color: ${C.muted}; font-size: 14px; margin-bottom: 40px; }

    .checkout-card {
      max-width: 640px; margin: 0 auto;
      background: rgba(250,250,249,.03);
      border: 1px solid rgba(250,250,249,.09);
      border-radius: 22px; padding: 34px 30px;
    }
    .field { margin-bottom: 20px; }
    .field label { display: block; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: .05em; color: ${C.muted}; margin-bottom: 9px; }
    .field .req { color: ${C.from}; }
    .field input[type="text"], .field input[type="email"], .field input[type="tel"], .field select, .field textarea {
      width: 100%; background: rgba(250,250,249,.05); border: 1.5px solid rgba(250,250,249,.14);
      border-radius: 10px; padding: 13px 14px; font-size: 14px; font-weight: 600;
      color: ${C.white}; font-family: inherit; outline: none;
      transition: border-color .2s;
    }
    .field input::placeholder, .field textarea::placeholder { color: rgba(168,162,158,.6); }
    .field input:focus, .field select:focus, .field textarea:focus { border-color: ${C.from}; }
    .field select { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23A8A29E' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 14px center; padding-right: 40px; }
    .field select option { background: ${C.dark}; color: ${C.white}; }
    .field .error { color: #FCA5A5; font-size: 12px; font-weight: 700; margin-top: 7px; }
    .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

    .chip-row { display: flex; flex-wrap: wrap; gap: 10px; }
    .size-btn {
      min-width: 52px; height: 48px; padding: 0 8px;
      display: flex; align-items: center; justify-content: center;
      border: 1.5px solid rgba(250,250,249,.18); border-radius: 10px;
      font-size: 14px; font-weight: 800; color: ${C.white};
      background: transparent; cursor: pointer; transition: border-color .2s, background .2s;
    }
    .size-btn.active { border-color: ${C.from}; background: linear-gradient(135deg, ${C.from}, ${C.to}); }

    .qty-row { display: flex; align-items: center; gap: 14px; }
    .qty-btn {
      width: 44px; height: 44px; border-radius: 10px; border: 1.5px solid rgba(250,250,249,.18);
      background: transparent; color: ${C.white}; font-size: 18px; font-weight: 900; cursor: pointer;
    }
    .qty-val { font-size: 16px; font-weight: 800; min-width: 24px; text-align: center; }

    .mode-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    .mode-btn {
      padding: 14px 12px; border-radius: 12px; border: 1.5px solid rgba(250,250,249,.14);
      background: rgba(250,250,249,.03); cursor: pointer; text-align: left;
      transition: border-color .2s, background .2s;
    }
    .mode-btn.active { border-color: ${C.from}; background: rgba(255,122,61,.09); }
    .mode-btn .m-title { font-size: 13px; font-weight: 800; margin-bottom: 2px; }
    .mode-btn .m-sub { font-size: 11px; color: ${C.muted}; font-weight: 600; }

    .price-recap {
      display: flex; justify-content: space-between; align-items: baseline;
      padding: 16px 0; margin-bottom: 20px; border-top: 1px solid rgba(250,250,249,.08); border-bottom: 1px solid rgba(250,250,249,.08);
    }
    .price-recap .lbl { font-size: 13px; color: ${C.muted}; font-weight: 700; }
    .price-recap .val { font-size: 22px; font-weight: 900; }

    .cod-note { display: flex; gap: 8px; align-items: flex-start; font-size: 12px; color: ${C.muted}; font-weight: 600; margin-top: 14px; text-align: center; justify-content: center; }

    .confirm-box { max-width: 560px; margin: 0 auto; text-align: center; }
    .confirm-check {
      width: 68px; height: 68px; border-radius: 50%; margin: 0 auto 22px;
      background: rgba(34,197,94,.14); color: ${C.green};
      display: flex; align-items: center; justify-content: center; font-size: 32px;
    }
    .confirm-ref {
      display: inline-block; background: rgba(250,250,249,.06); border: 1px dashed rgba(250,250,249,.2);
      border-radius: 10px; padding: 10px 18px; font-weight: 900; font-size: 16px; letter-spacing: .05em;
      margin: 14px 0 26px;
    }
    .confirm-actions { display: flex; flex-direction: column; gap: 10px; max-width: 340px; margin: 0 auto; }
    .btn-outline { background: transparent; border: 1.5px solid rgba(250,250,249,.2); color: ${C.white}; }
    .btn-wa { background: #25D366; color: #06210F; }

    .sticky-bar {
      position: fixed; left: 0; right: 0; bottom: 0; z-index: 90;
      background: rgba(12,10,9,.96); backdrop-filter: blur(14px);
      border-top: 1px solid rgba(250,250,249,.1);
      padding: 12px 18px; display: none;
      align-items: center; justify-content: space-between; gap: 14px;
    }
    .sticky-bar .sb-price { font-size: 16px; font-weight: 900; }
    .sticky-bar .sb-price small { display: block; font-size: 10px; color: ${C.muted}; font-weight: 700; }
    .sticky-bar a.btn { width: auto; padding: 13px 22px; font-size: 13px; }

    footer { background: ${C.black}; border-top: 1px solid rgba(250,250,249,.07); padding: 40px 24px; text-align: center; }
    footer img { height: 30px; margin-bottom: 16px; opacity: .9; }
    footer p { font-size: 12px; color: ${C.muted}; font-weight: 700; }

    @media (max-width: 780px) {
      .hero-grid { grid-template-columns: 1fr; gap: 24px; }
      .checkout-card { padding: 26px 20px; }
      .field-row { grid-template-columns: 1fr; }
      .sticky-bar { display: flex; }
      body { padding-bottom: 76px; }
    }
  `}} />
)

export default function BackToSchoolClient() {
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(initialForm)
  const [confirmedRef, setConfirmedRef] = useState<string | null>(null)
  const [confirming, setConfirming] = useState(false)
  const checkoutRef = useRef<HTMLDivElement>(null)

  const selectedProduct = useMemo(
    () => PRODUCTS.find(p => p.id === selectedProductId),
    [selectedProductId]
  )

  const filteredCommunes = useMemo(
    () => form.wilayaCode !== '' ? COMMUNES.filter(c => c.wilayaCode === form.wilayaCode) : [],
    [form.wilayaCode]
  )

  const isFormValid = useMemo(() => {
    if (!selectedProduct) return false
    if (!form.size || form.qty < 1) return false
    if (form.nom.length < 3) return false
    if (!EMAIL_RE.test(form.email)) return false
    if (!PHONE_RE.test(form.telephone)) return false
    if (form.wilayaCode === '') return false
    if (!form.commune) return false
    if (form.modeLivraison === 'domicile' && !form.adresse) return false
    return true
  }, [form, selectedProduct])

  const handleProductSelect = (productId: string) => {
    setSelectedProductId(productId)
    setForm(initialForm)
    setConfirmedRef(null)
    setTimeout(() => checkoutRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
  }

  const handleConfirm = async () => {
    if (!selectedProduct || !isFormValid) return

    setConfirming(true)
    try {
      const ref = 'CAR-' + Date.now().toString(36).toUpperCase()
      const res = await fetch('/api/commandes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reference: ref,
          produit: selectedProduct.title,
          quantite: form.qty,
          tailles: [form.size],
          nom_client: form.nom,
          email: form.email,
          telephone: form.telephone,
          prix_total: selectedProduct.priceDZD * form.qty,
          mode_livraison: form.modeLivraison,
          wilaya: WILAYAS.find(w => w.code === form.wilayaCode)?.name || '',
          commune: form.commune,
          adresse: form.adresse || null,
        }),
      })

      if (res.ok) {
        setConfirmedRef(ref)
        setForm(initialForm)
        setSelectedProductId(null)
      }
    } finally {
      setConfirming(false)
    }
  }

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      <GlobalStyle />

      <header>
        <a href="/"><img src={LOGO} alt="Caractère" /></a>
        <a href={WA} className="cta-nav">💬 WhatsApp</a>
      </header>

      {confirmedRef ? (
        <section style={{ padding: '80px 20px', background: `rgba(34,197,94,0.05)` }}>
          <div className="wrap confirm-box">
            <div className="confirm-check">✓</div>
            <h2 style={{ fontSize: '28px', fontWeight: 900, marginBottom: '12px' }}>Commande confirmée</h2>
            <p style={{ color: C.muted, marginBottom: '24px' }}>
              Tu vas recevoir un appel pour confirmer ta commande avant l'expédition.
            </p>
            <div className="confirm-ref">{confirmedRef}</div>
            <p style={{ color: C.muted, fontSize: '13px', marginBottom: '28px' }}>
              Garde cette référence pour le suivi
            </p>
            <div className="confirm-actions">
              <a href={`${WA}?text=Bonjour,%20ma%20référence%20de%20commande%20est%20${confirmedRef}`} target="_blank" rel="noopener noreferrer" className="btn btn-wa">
                Confirmer par WhatsApp
              </a>
              <a href={`/suivi/${confirmedRef}`} className="btn btn-outline">
                Suivre ma commande →
              </a>
              <button onClick={() => setConfirmedRef(null)} className="btn btn-outline">
                Retour à la boutique
              </button>
            </div>
          </div>
        </section>
      ) : selectedProductId ? (
        <>
          <section className="section" ref={checkoutRef}>
            <div className="wrap">
              <button onClick={() => setSelectedProductId(null)} className="btn btn-back" style={{ maxWidth: '200px', marginBottom: '40px' }}>
                ← Changer de pack
              </button>

              <div className="hero-grid">
                <div>
                  <div className="gallery-main">
                    <span className="tag">{selectedProduct!.tag}</span>
                    <img src={selectedProduct!.images[0]} alt={selectedProduct!.title} />
                  </div>
                  <div className="gallery-thumbs">
                    {selectedProduct!.images.map((img, i) => (
                      <button key={i} className={i === 0 ? 'active' : ''}>
                        <img src={img} alt="" />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="eyebrow">🎒 Back to School</span>
                  <h1 className="p-title">{selectedProduct!.title}</h1>
                  <p className="p-subtitle">{selectedProduct!.subtitle}</p>
                  <p className="p-price">{money(selectedProduct!.priceDZD)}</p>
                  <p className="p-desc">{selectedProduct!.desc}</p>
                  <ul className="p-bullets">
                    {selectedProduct!.bullets.map((b, i) => (
                      <li key={i}><span className="check">✓</span>{b}</li>
                    ))}
                  </ul>
                  <div className="trust-row">
                    <span className="trust-chip">💳 Paiement à la livraison</span>
                    <span className="trust-chip">🚚 Livraison 58 wilayas</span>
                    <span className="trust-chip">📦 Bureau ou domicile</span>
                  </div>
                </div>
              </div>

              <h2 className="section-title" style={{ marginTop: '80px' }}>Finaliser ma commande</h2>
              <p className="section-sub">Remplissez vos infos — on vous appelle pour confirmer avant l'envoi.</p>

              <div className="checkout-card">
                <div className="field">
                  <label>Taille<span className="req"> *</span></label>
                  <div className="chip-row">
                    {selectedProduct!.sizes.map(s => (
                      <button
                        key={s}
                        onClick={() => setForm({ ...form, size: s })}
                        className={`size-btn ${form.size === s ? 'active' : ''}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="field">
                  <label>Quantité</label>
                  <div className="qty-row">
                    <button className="qty-btn" onClick={() => setForm({ ...form, qty: Math.max(1, form.qty - 1) })}>−</button>
                    <span className="qty-val">{form.qty}</span>
                    <button className="qty-btn" onClick={() => setForm({ ...form, qty: Math.min(5, form.qty + 1) })}>+</button>
                  </div>
                </div>

                <div className="field">
                  <label>Nom complet<span className="req"> *</span></label>
                  <input type="text" placeholder="Votre nom et prénom" value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} />
                </div>

                <div className="field-row">
                  <div className="field">
                    <label>Email<span className="req"> *</span></label>
                    <input type="email" placeholder="vous@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                  </div>
                  <div className="field">
                    <label>Téléphone<span className="req"> *</span></label>
                    <input type="tel" placeholder="05XX XX XX XX" value={form.telephone} onChange={e => setForm({ ...form, telephone: e.target.value })} />
                  </div>
                </div>

                <div className="field">
                  <label>Mode de livraison<span className="req"> *</span></label>
                  <div className="mode-row">
                    <button
                      className={`mode-btn ${form.modeLivraison === 'bureau' ? 'active' : ''}`}
                      onClick={() => setForm({ ...form, modeLivraison: 'bureau' })}
                    >
                      <div className="m-title">📍 Bureau Yalidine</div>
                      <div className="m-sub">Retrait au bureau — souvent plus rapide</div>
                    </button>
                    <button
                      className={`mode-btn ${form.modeLivraison === 'domicile' ? 'active' : ''}`}
                      onClick={() => setForm({ ...form, modeLivraison: 'domicile' })}
                    >
                      <div className="m-title">🏠 Domicile</div>
                      <div className="m-sub">Livré directement chez vous</div>
                    </button>
                  </div>
                </div>

                <div className="field-row">
                  <div className="field">
                    <label>Wilaya<span className="req"> *</span></label>
                    <select value={form.wilayaCode} onChange={e => setForm({ ...form, wilayaCode: e.target.value ? Number(e.target.value) : '', commune: '' })}>
                      <option value="">Sélectionner</option>
                      {WILAYAS.map(w => (
                        <option key={w.code} value={w.code}>{w.code.toString().padStart(2, '0')} — {w.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="field">
                    <label>Commune<span className="req"> *</span></label>
                    <select disabled={form.wilayaCode === ''} value={form.commune} onChange={e => setForm({ ...form, commune: e.target.value })}>
                      <option value="">{form.wilayaCode === '' ? 'Choisir une wilaya d\'abord' : 'Sélectionner'}</option>
                      {filteredCommunes.map(c => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {form.modeLivraison === 'domicile' && (
                  <div className="field">
                    <label>Adresse complète<span className="req"> *</span></label>
                    <textarea rows={3} placeholder="N°, rue, quartier, points de repère..." value={form.adresse} onChange={e => setForm({ ...form, adresse: e.target.value })} style={{ resize: 'none' }} />
                  </div>
                )}

                <div className="price-recap">
                  <span className="lbl">Total ({form.qty} pack{form.qty > 1 ? 's' : ''})</span>
                  <span className="val">{money(selectedProduct!.priceDZD * form.qty)}</span>
                </div>

                <button onClick={handleConfirm} disabled={!isFormValid || confirming} className="btn btn-bts">
                  {confirming ? 'Confirmation en cours...' : 'Confirmer ma commande'}
                </button>
                <p className="cod-note">💳 Paiement en espèces à la réception — rien à payer maintenant.</p>
              </div>
            </div>
          </section>

          <div className="sticky-bar">
            <span className="sb-price">{money(selectedProduct!.priceDZD * form.qty)}<small>{selectedProduct!.title}</small></span>
            <button onClick={() => checkoutRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })} className="btn btn-bts">
              Finaliser →
            </button>
          </div>
        </>
      ) : (
        <section className="catalog">
          <div className="wrap">
            <h1 className="catalog-title">Nos packs rentrée</h1>
            <p className="catalog-sub">Choisis ton essentiels pour la rentrée</p>

            <div className="catalog-grid">
              {PRODUCTS.map(product => (
                <div key={product.id} className="pack-card" onClick={() => handleProductSelect(product.id)}>
                  <div className="pack-card-badge">{product.tag}</div>
                  <div className="pack-card-title">{product.title}</div>
                  <div className="pack-card-sub">{product.subtitle}</div>
                  <div className="pack-card-price">{money(product.priceDZD)}</div>
                  <ul className="pack-card-bullets">
                    {product.bullets.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                  <button className="btn btn-bts">Choisir ce pack →</button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <footer>
        <img src={LOGO} alt="Caractère" />
        <p>© 2026 Caractère Store • Back to School • Livraison 58 wilayas</p>
      </footer>
    </div>
  )
}
