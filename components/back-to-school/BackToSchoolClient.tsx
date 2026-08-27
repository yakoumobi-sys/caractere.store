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

const PRODUCT = {
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
}

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

    .section { padding: 10px 0 90px; }
    .section-title { font-size: clamp(22px, 3vw, 30px); font-weight: 900; text-align: center; margin-bottom: 8px; letter-spacing: -.5px; }
    .section-sub { text-align: center; color: ${C.muted}; font-size: 14px; margin-bottom: 40px; }

    /* ── Checkout form ── */
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

    /* Confirmation */
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

    /* Sticky mobile buy bar */
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

function Field({ label, required, error, children }: { label: string; required?: boolean; error?: string; children: React.ReactNode }) {
  return (
    <div className="field">
      <label>{label}{required && <span className="req"> *</span>}</label>
      {children}
      {error && <p className="error">{error}</p>}
    </div>
  )
}

export default function BackToSchoolClient() {
  const [activeImg, setActiveImg] = useState(0)
  const [form, setForm] = useState<FormState>(initialForm)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [submitting, setSubmitting] = useState(false)
  const [confirmed, setConfirmed] = useState<{ ref: string; total: number } | null>(null)
  const checkoutRef = useRef<HTMLDivElement>(null)

  const total = PRODUCT.priceDZD * form.qty

  const communesForWilaya = useMemo(
    () => (form.wilayaCode === '' ? [] : COMMUNES.filter((c) => c.wilayaCode === form.wilayaCode)),
    [form.wilayaCode]
  )

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }))
    setErrors((e) => ({ ...e, [key]: undefined }))
  }

  const scrollToCheckout = () => {
    checkoutRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const validate = (): boolean => {
    const errs: Partial<Record<keyof FormState, string>> = {}
    if (!form.size) errs.size = 'Choisissez une taille.'
    if (form.nom.trim().length < 3) errs.nom = 'Nom complet requis.'
    if (!EMAIL_RE.test(form.email.trim())) errs.email = 'Email invalide.'
    if (!PHONE_RE.test(form.telephone.trim())) errs.telephone = 'Numéro invalide (ex: 0555 12 34 56).'
    if (form.wilayaCode === '') errs.wilayaCode = 'Choisissez une wilaya.'
    if (!form.commune) errs.commune = 'Choisissez une commune.'
    if (form.modeLivraison === 'domicile' && form.adresse.trim().length < 6) {
      errs.adresse = 'Adresse complète requise pour la livraison à domicile.'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) {
      const firstError = document.querySelector('.error')
      firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    setSubmitting(true)
    const ref = 'CAR-' + Date.now().toString(36).toUpperCase()
    const wilayaName = WILAYAS.find((w) => w.code === form.wilayaCode)?.name ?? ''

    try {
      const res = await fetch('/api/commandes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reference: ref,
          produit: `Back to School — ${PRODUCT.title}`,
          quantite: form.qty,
          couleur: 'Gris + Noir',
          tailles: [form.size],
          position: null,
          technique: null,
          urgent: false,
          nom_client: form.nom.trim(),
          entreprise: null,
          telephone: form.telephone.trim(),
          email: form.email.trim(),
          notes: null,
          prix_unitaire: PRODUCT.priceDZD,
          prix_total: total,
          mode_livraison: form.modeLivraison,
          wilaya: wilayaName,
          commune: form.commune,
          adresse: form.modeLivraison === 'domicile' ? form.adresse.trim() : null,
        }),
      })
      if (!res.ok) throw new Error('order-failed')
      setConfirmed({ ref, total })
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch {
      alert("Un souci est survenu lors de l'envoi de votre commande. Réessayez ou contactez-nous sur WhatsApp.")
    } finally {
      setSubmitting(false)
    }
  }

  const waConfirmLink = confirmed
    ? `${WA}?text=${encodeURIComponent(
        `Salam ! Je viens de commander le ${PRODUCT.title} (${form.size}) — réf ${confirmed.ref}. Je confirme ma commande 🎒`
      )}`
    : '#'

  return (
    <div style={{ background: C.black, color: C.white, minHeight: '100vh' }}>
      <GlobalStyle />

      <header>
        <Link href="/"><img src={LOGO} alt="Caractère" /></Link>
        <a href={WA} className="cta-nav">💬 WhatsApp</a>
      </header>

      {confirmed ? (
        <section className="section" style={{ paddingTop: 64 }}>
          <div className="wrap confirm-box">
            <div className="confirm-check">✓</div>
            <h1 style={{ fontSize: 'clamp(24px,4vw,32px)', fontWeight: 900, marginBottom: 10 }}>Commande reçue !</h1>
            <p style={{ color: C.muted, fontSize: 14 }}>
              On vous appelle rapidement pour confirmer avant l&rsquo;envoi. Gardez votre référence :
            </p>
            <div className="confirm-ref">{confirmed.ref}</div>
            <p style={{ color: C.muted, fontSize: 13, marginBottom: 24 }}>
              Total : <strong style={{ color: C.white }}>{money(confirmed.total)}</strong> — paiement à la livraison
            </p>
            <div className="confirm-actions">
              <a href={waConfirmLink} className="btn btn-wa" target="_blank" rel="noopener noreferrer">💬 Confirmer sur WhatsApp</a>
              <Link href={`/suivi/${confirmed.ref}`} className="btn btn-outline">Suivre ma commande</Link>
              <Link href="/back-to-school" className="btn btn-outline" onClick={() => setConfirmed(null)}>Commander un autre pack</Link>
            </div>
          </div>
        </section>
      ) : (
        <>
          <section className="hero">
            <div className="wrap hero-grid">
              <div>
                <div className="gallery-main">
                  <span className="tag">{PRODUCT.tag}</span>
                  <img src={PRODUCT.images[activeImg]} alt={PRODUCT.title} />
                </div>
                <div className="gallery-thumbs">
                  {PRODUCT.images.map((src, i) => (
                    <button key={src} type="button" className={i === activeImg ? 'active' : ''} onClick={() => setActiveImg(i)}>
                      <img src={src} alt="" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="eyebrow">🎒 Back to School</span>
                <h1 className="p-title">{PRODUCT.title}</h1>
                <p className="p-subtitle">{PRODUCT.subtitle}</p>
                <p className="p-price">{money(PRODUCT.priceDZD)}</p>
                <p className="p-desc">{PRODUCT.desc}</p>

                <ul className="p-bullets">
                  {PRODUCT.bullets.map((b, i) => (
                    <li key={i}><span className="check">✓</span>{b}</li>
                  ))}
                </ul>

                <div className="trust-row">
                  <span className="trust-chip">💳 Paiement à la livraison</span>
                  <span className="trust-chip">🚚 Livraison 58 wilayas</span>
                  <span className="trust-chip">📦 Bureau ou domicile</span>
                </div>

                <button type="button" onClick={scrollToCheckout} className="btn btn-bts">
                  Acheter maintenant →
                </button>
              </div>
            </div>
          </section>

          <section className="section" ref={checkoutRef}>
            <div className="wrap">
              <h2 className="section-title">Finaliser ma commande</h2>
              <p className="section-sub">Remplissez vos infos — on vous appelle pour confirmer avant l&rsquo;envoi.</p>

              <div className="checkout-card">
                <Field label="Taille" required error={errors.size}>
                  <div className="chip-row">
                    {PRODUCT.sizes.map((s) => (
                      <button
                        key={s}
                        type="button"
                        className={`size-btn ${form.size === s ? 'active' : ''}`}
                        onClick={() => set('size', s)}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </Field>

                <Field label="Quantité">
                  <div className="qty-row">
                    <button type="button" className="qty-btn" onClick={() => set('qty', Math.max(1, form.qty - 1))}>−</button>
                    <span className="qty-val">{form.qty}</span>
                    <button type="button" className="qty-btn" onClick={() => set('qty', Math.min(5, form.qty + 1))}>+</button>
                  </div>
                </Field>

                <Field label="Nom complet" required error={errors.nom}>
                  <input type="text" placeholder="Votre nom et prénom" value={form.nom} onChange={(e) => set('nom', e.target.value)} />
                </Field>

                <div className="field-row">
                  <Field label="Email" required error={errors.email}>
                    <input type="email" placeholder="vous@email.com" value={form.email} onChange={(e) => set('email', e.target.value)} />
                  </Field>
                  <Field label="Téléphone" required error={errors.telephone}>
                    <input type="tel" placeholder="05XX XX XX XX" value={form.telephone} onChange={(e) => set('telephone', e.target.value)} />
                  </Field>
                </div>

                <Field label="Mode de livraison" required>
                  <div className="mode-row">
                    <button
                      type="button"
                      className={`mode-btn ${form.modeLivraison === 'bureau' ? 'active' : ''}`}
                      onClick={() => set('modeLivraison', 'bureau')}
                    >
                      <div className="m-title">📍 Bureau Yalidine</div>
                      <div className="m-sub">Retrait au bureau — souvent plus rapide</div>
                    </button>
                    <button
                      type="button"
                      className={`mode-btn ${form.modeLivraison === 'domicile' ? 'active' : ''}`}
                      onClick={() => set('modeLivraison', 'domicile')}
                    >
                      <div className="m-title">🏠 Domicile</div>
                      <div className="m-sub">Livré directement chez vous</div>
                    </button>
                  </div>
                </Field>

                <div className="field-row">
                  <Field label="Wilaya" required error={errors.wilayaCode}>
                    <select
                      value={form.wilayaCode}
                      onChange={(e) => {
                        const code = e.target.value === '' ? '' : Number(e.target.value)
                        setForm((f) => ({ ...f, wilayaCode: code, commune: '' }))
                        setErrors((er) => ({ ...er, wilayaCode: undefined }))
                      }}
                    >
                      <option value="">Sélectionner</option>
                      {WILAYAS.map((w) => (
                        <option key={w.code} value={w.code}>{String(w.code).padStart(2, '0')} — {w.name}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Commune" required error={errors.commune}>
                    <select
                      value={form.commune}
                      onChange={(e) => set('commune', e.target.value)}
                      disabled={form.wilayaCode === ''}
                    >
                      <option value="">{form.wilayaCode === '' ? 'Choisir une wilaya d\'abord' : 'Sélectionner'}</option>
                      {communesForWilaya.map((c) => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </Field>
                </div>

                {form.modeLivraison === 'domicile' && (
                  <Field label="Adresse complète" required error={errors.adresse}>
                    <textarea
                      rows={3}
                      placeholder="N°, rue, quartier, points de repère..."
                      value={form.adresse}
                      onChange={(e) => set('adresse', e.target.value)}
                    />
                  </Field>
                )}

                <div className="price-recap">
                  <span className="lbl">Total ({form.qty} pack{form.qty > 1 ? 's' : ''})</span>
                  <span className="val">{money(total)}</span>
                </div>

                <button type="button" className="btn btn-bts" onClick={handleSubmit} disabled={submitting}>
                  {submitting ? 'Envoi en cours…' : 'Confirmer ma commande'}
                </button>
                <p className="cod-note">💳 Paiement en espèces à la réception — rien à payer maintenant.</p>
              </div>
            </div>
          </section>

          <div className="sticky-bar">
            <span className="sb-price">
              {money(PRODUCT.priceDZD)}
              <small>{PRODUCT.title}</small>
            </span>
            <button type="button" className="btn btn-bts" onClick={scrollToCheckout}>Acheter maintenant</button>
          </div>
        </>
      )}

      <footer>
        <img src={LOGO} alt="Caractère" />
        <p>© 2026 Caractère Store • Back to School • Livraison 58 wilayas</p>
      </footer>
    </div>
  )
}
