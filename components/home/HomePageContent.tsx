'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import type { Produit } from '@/types'

/* ─────────────────────────────────────────────────────────────────────────
   TOKENS
───────────────────────────────────────────────────────────────────────── */
const C = {
  blue:    '#2563EB',
  blueDk:  '#1D4ED8',
  blueLt:  '#EFF6FF',
  black:   '#0A0A0A',
  gray1:   '#F7F7F7',
  gray2:   '#E5E5E5',
  gray3:   '#9CA3AF',
  gray4:   '#6B7280',
  white:   '#FFFFFF',
  green:   '#16A34A',
  greenLt: '#DCFCE7',
}

/* ─────────────────────────────────────────────────────────────────────────
   HOOK — fade-in au scroll
───────────────────────────────────────────────────────────────────────── */
function useFadeIn() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.style.opacity = '1'; el.style.transform = 'translateY(0)' } },
      { threshold: 0.1 }
    )
    el.style.opacity = '0'
    el.style.transform = 'translateY(28px)'
    el.style.transition = 'opacity 0.65s ease, transform 0.65s ease'
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return ref
}

/* ─────────────────────────────────────────────────────────────────────────
   COMPOSANTS ATOMS
───────────────────────────────────────────────────────────────────────── */
function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[13px] font-semibold border"
      style={{ background: C.blueLt, color: C.blue, borderColor: `${C.blue}30` }}>
      {children}
    </span>
  )
}

function FloatingCard({ children, className = '', style = {} }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`absolute rounded-2xl shadow-xl border px-4 py-3 ${className}`}
      style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(16px)', borderColor: C.gray2, ...style }}>
      {children}
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[12px] font-bold tracking-[0.15em] uppercase mb-4" style={{ color: C.blue }}>
      {children}
    </p>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
   HERO
───────────────────────────────────────────────────────────────────────── */
function Hero() {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ nom: '', telephone: '', email: '', entreprise: '', wilaya: '' })
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const wilayas = ['Alger','Oran','Constantine','Annaba','Blida','Batna','Sétif','Tlemcen',
    'Béjaïa','Tizi Ouzou','Médéa','Mostaganem','Biskra','Adrar','Chlef','Laghouat',
    'Oum El Bouaghi','Béchar','Bouira','Tamanrasset','Tébessa','Tiaret','Djelfa','Jijel',
    'Saïda','Skikda','Sidi Bel Abbès','Guelma','MSila','Mascara','Ouargla','El Bayadh',
    'Illizi','Bordj Bou Arréridj','Boumerdès','El Tarf','Tindouf','Tissemsilt','El Oued',
    'Khenchela','Souk Ahras','Tipaza','Mila','Aïn Defla','Naâma','Aïn Témouchent',
    'Ghardaïa','Relizane']

  const handleSubmit = async () => {
    if (!form.nom || !form.telephone) return alert('Nom et téléphone requis.')
    setLoading(true)
    try { await fetch('/api/leads', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({...form, source:'Hero CTA'}) }) } catch {}
    setDone(true); setLoading(false)
  }

  return (
    <section className="relative overflow-hidden" style={{ background: C.white, minHeight: '100vh', paddingTop: '80px' }}>
      {/* Subtle grid background */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `linear-gradient(${C.gray2} 1px, transparent 1px), linear-gradient(90deg, ${C.gray2} 1px, transparent 1px)`,
        backgroundSize: '60px 60px', opacity: 0.35,
      }} />
      {/* Blue glow */}
      <div className="absolute pointer-events-none" style={{
        top: '-200px', right: '-200px', width: '700px', height: '700px',
        background: `radial-gradient(circle, ${C.blue}18 0%, transparent 70%)`,
      }} />

      <div className="relative max-w-[1200px] mx-auto px-6 lg:px-10 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* LEFT */}
          <div>
            <Badge>🇩🇿 Fabrication textile premium en Algérie</Badge>

            <h1 className="mt-8 font-black leading-[1.05] tracking-tight"
              style={{ fontSize: 'clamp(38px, 5vw, 68px)', color: C.black, letterSpacing: '-0.02em' }}>
              Le textile premium<br />
              <span style={{ color: C.blue }}>pour votre marque.</span>
            </h1>

            <p className="mt-6 leading-relaxed max-w-lg" style={{ fontSize: '18px', color: C.gray4 }}>
              Une seule plateforme pour lancer votre marque en Print on Demand, commander des vêtements personnalisés ou acheter la collection Caractère.
            </p>

            {/* CTA buttons */}
            <div className="mt-10 flex flex-wrap gap-3">
              <Link href="/configurateur"
                className="inline-flex items-center gap-2 px-7 py-4 rounded-full text-[16px] font-bold text-white no-underline transition-all hover:opacity-90 hover:-translate-y-0.5"
                style={{ background: C.blue, boxShadow: `0 8px 24px ${C.blue}40` }}>
                Configurer ma commande
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
              </Link>
              <Link href="/designer"
                className="inline-flex items-center gap-2 px-7 py-4 rounded-full text-[16px] font-bold no-underline transition-all hover:-translate-y-0.5 border-2"
                style={{ color: C.black, borderColor: C.gray2, background: C.white }}>
                Lancer ma marque
              </Link>
            </div>

            {/* 3 mini cards */}
            <div className="mt-10 grid grid-cols-3 gap-3">
              {[
                { icon: '🚀', title: 'Print on Demand', desc: 'Lancez votre marque sans stock.', href: '/designer', cta: 'Commencer' },
                { icon: '🏢', title: 'Entreprises', desc: 'Vêtements personnalisés pour votre équipe.', href: '/configurateur', cta: 'Configurer' },
                { icon: '👕', title: 'Collection', desc: 'Notre collection premium prête à porter.', href: '/collection', cta: 'Voir' },
              ].map(card => (
                <Link key={card.title} href={card.href}
                  className="group flex flex-col justify-between p-4 rounded-2xl border no-underline transition-all hover:shadow-lg hover:-translate-y-1"
                  style={{ background: C.white, borderColor: C.gray2 }}>
                  <div>
                    <span className="text-2xl block mb-2">{card.icon}</span>
                    <p className="text-[13px] font-bold leading-tight mb-1" style={{ color: C.black }}>{card.title}</p>
                    <p className="text-[11px] leading-relaxed" style={{ color: C.gray4 }}>{card.desc}</p>
                  </div>
                  <span className="mt-3 text-[12px] font-bold" style={{ color: C.blue }}>{card.cta} →</span>
                </Link>
              ))}
            </div>
          </div>

          {/* RIGHT — mockup premium */}
          <div className="relative hidden lg:block" style={{ height: '580px' }}>
            {/* Main product visual */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-[340px] h-[400px] rounded-[32px] overflow-hidden"
                style={{ background: `linear-gradient(145deg, #F0F4FF 0%, #E8EFFF 100%)`, boxShadow: '0 40px 80px rgba(37,99,235,0.15)' }}>
                {/* Grid pattern inside card */}
                <div className="absolute inset-0" style={{
                  backgroundImage: `radial-gradient(${C.blue}20 1px, transparent 1px)`,
                  backgroundSize: '24px 24px'
                }} />
                {/* Central content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-8">
                  <div className="text-[80px] leading-none">👕</div>
                  <div className="text-center">
                    <p className="text-[14px] font-bold" style={{ color: C.black }}>T-shirt Premium 250GSM</p>
                    <p className="text-[12px] mt-1" style={{ color: C.gray4 }}>Broderie + DTF · 1 500 DA</p>
                  </div>
                  <div className="flex gap-2 mt-2">
                    {['#1A1A1A','#2563EB','#DC2626','#166534','#D6B99A'].map(hex => (
                      <div key={hex} className="w-5 h-5 rounded-full border-2 border-white shadow-sm" style={{ background: hex }} />
                    ))}
                  </div>
                  <div className="w-full mt-2 px-4 py-2 rounded-full text-[13px] font-bold text-white text-center"
                    style={{ background: C.blue }}>
                    Personnaliser →
                  </div>
                </div>
              </div>
            </div>

            {/* Floating cards */}
            <FloatingCard className="animate-float-slow" style={{ top: '20px', left: '-20px', minWidth: '180px' }}>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-[14px]"
                  style={{ background: C.blueLt }}>📦</div>
                <div>
                  <p className="text-[11px] font-bold" style={{ color: C.black }}>Commande #5841</p>
                  <p className="text-[10px]" style={{ color: C.gray4 }}>En production</p>
                </div>
                <span className="ml-1 w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              </div>
            </FloatingCard>

            <FloatingCard className="animate-float" style={{ top: '120px', right: '-30px', minWidth: '160px' }}>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-[14px]"
                  style={{ background: C.greenLt }}>✅</div>
                <div>
                  <p className="text-[11px] font-bold" style={{ color: C.black }}>Nouvelle vente</p>
                  <p className="text-[10px]" style={{ color: C.green }}>+1 Hoodie · 3 800 DA</p>
                </div>
              </div>
            </FloatingCard>

            <FloatingCard style={{ bottom: '100px', left: '-30px', minWidth: '170px' }}>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-[14px]"
                  style={{ background: '#FFF7ED' }}>🚚</div>
                <div>
                  <p className="text-[11px] font-bold" style={{ color: C.black }}>Expédition demain</p>
                  <p className="text-[10px]" style={{ color: C.gray4 }}>Constantine · #5832</p>
                </div>
              </div>
            </FloatingCard>

            <FloatingCard style={{ bottom: '30px', right: '-10px', minWidth: '150px' }}>
              <div className="flex items-center gap-2">
                <span className="text-[20px]">⭐</span>
                <div>
                  <p className="text-[11px] font-bold" style={{ color: C.black }}>4.9 / 5</p>
                  <p className="text-[10px]" style={{ color: C.gray4 }}>500+ avis clients</p>
                </div>
              </div>
            </FloatingCard>
          </div>
        </div>
      </div>

      {/* Formulaire inscription modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
          <div className="w-full max-w-md rounded-3xl p-6 space-y-3" style={{ background: C.white }}>
            {!done ? (
              <>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[18px] font-bold" style={{ color: C.black }}>Créer mon compte gratuit</p>
                  <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-full flex items-center justify-center border cursor-pointer" style={{ borderColor: C.gray2 }}>×</button>
                </div>
                <p className="text-[13px] pb-2" style={{ color: C.gray4 }}>Accédez au designer, suivez vos commandes, recevez nos offres.</p>
                {[
                  { key:'nom', placeholder:'Nom complet *', type:'text' },
                  { key:'telephone', placeholder:'Téléphone *', type:'tel' },
                  { key:'email', placeholder:'Email', type:'email' },
                  { key:'entreprise', placeholder:'Entreprise / Marque (optionnel)', type:'text' },
                ].map(f => (
                  <input key={f.key} type={f.type} placeholder={f.placeholder}
                    value={form[f.key as keyof typeof form]}
                    onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    className="w-full border rounded-xl px-4 py-3 text-[14px] outline-none"
                    style={{ borderColor: C.gray2 }} />
                ))}
                <select value={form.wilaya} onChange={e => setForm(p => ({ ...p, wilaya: e.target.value }))}
                  className="w-full border rounded-xl px-4 py-3 text-[14px] outline-none"
                  style={{ borderColor: C.gray2, color: form.wilaya ? C.black : C.gray3 }}>
                  <option value="">Wilaya (optionnel)</option>
                  {wilayas.map(w => <option key={w} value={w}>{w}</option>)}
                </select>
                <button onClick={handleSubmit} disabled={loading}
                  className="w-full py-3.5 rounded-xl text-[15px] font-bold text-white disabled:opacity-60"
                  style={{ background: C.blue }}>
                  {loading ? 'Envoi...' : 'Créer mon compte →'}
                </button>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="text-[56px] mb-4">✅</div>
                <p className="text-[20px] font-bold mb-2" style={{ color: C.black }}>Bienvenue !</p>
                <p className="text-[14px]" style={{ color: C.gray4 }}>Notre équipe vous contacte sous 24h.</p>
                <button onClick={() => { setShowForm(false); setDone(false) }}
                  className="mt-6 px-6 py-2.5 rounded-full text-[14px] font-bold text-white"
                  style={{ background: C.blue }}>
                  Fermer
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
   SECTION 2 — Pourquoi Caractère
───────────────────────────────────────────────────────────────────────── */
function WhySection() {
  const ref = useFadeIn()
  const cards = [
    {
      icon: '🚀',
      badge: 'Print on Demand',
      title: 'Vous vendez.\nNous fabriquons.',
      desc: 'Créez votre boutique, uploadez vos designs. Chaque commande est produite et expédiée directement à votre client. Zéro stock, zéro risque.',
      href: '/designer',
      cta: 'Lancer ma marque',
      accent: C.blue,
      bg: C.blueLt,
    },
    {
      icon: '🏢',
      badge: 'Entreprise',
      title: 'Configurez en\nquelques minutes.',
      desc: "Uniformes, tenues d'équipe, goodies corporate. Choisissez vos produits, ajoutez votre logo, recevez votre devis instantanément.",
      href: '/configurateur',
      cta: 'Configurer ma commande',
      accent: '#0A0A0A',
      bg: C.gray1,
    },
    {
      icon: '👕',
      badge: 'Collection',
      title: 'Des pièces premium\nprêtes à porter.',
      desc: 'La collection Caractère : t-shirts oversized 250GSM, hoodies, casquettes. Des éditions limitées fabriquées en Algérie.',
      href: '/collection',
      cta: 'Voir la collection',
      accent: C.blue,
      bg: '#F0F4FF',
    },
  ]

  return (
    <section style={{ background: C.white, padding: '100px 0' }}>
      <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
        <div ref={ref}>
          <SectionLabel>Pourquoi Caractère ?</SectionLabel>
          <h2 className="font-black tracking-tight mb-14" style={{ fontSize: 'clamp(30px,4vw,48px)', color: C.black, letterSpacing: '-0.02em', maxWidth: '600px' }}>
            Tout ce dont vous avez besoin, au même endroit.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {cards.map((card, i) => {
            const r = useFadeIn()
            return (
              <div key={card.badge} ref={r} className="group rounded-[28px] p-8 flex flex-col justify-between transition-all hover:shadow-xl hover:-translate-y-1"
                style={{ background: card.bg, minHeight: '340px', transitionDelay: `${i * 80}ms` }}>
                <div>
                  <span className="text-[40px] block mb-4">{card.icon}</span>
                  <span className="text-[11px] font-bold tracking-widest uppercase" style={{ color: card.accent }}>{card.badge}</span>
                  <h3 className="mt-3 font-black leading-tight whitespace-pre-line" style={{ fontSize: '22px', color: C.black }}>{card.title}</h3>
                  <p className="mt-3 text-[14px] leading-relaxed" style={{ color: C.gray4 }}>{card.desc}</p>
                </div>
                <Link href={card.href}
                  className="mt-8 inline-flex items-center gap-2 text-[14px] font-bold no-underline group-hover:gap-3 transition-all"
                  style={{ color: card.accent }}>
                  {card.cta} →
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
   SECTION 3 — Comment ça fonctionne
───────────────────────────────────────────────────────────────────────── */
function HowItWorksSection() {
  const ref = useFadeIn()
  const steps = [
    { n: '01', title: 'Choisissez vos produits', desc: 'T-shirts, polos, hoodies, casquettes, totebags — un catalogue de produits premium textile.', icon: '🛍️' },
    { n: '02', title: 'Ajoutez votre design', desc: 'Uploadez votre logo via le Designer ou configurez votre commande. Notre équipe adapte votre design pour un rendu optimal.', icon: '🎨' },
    { n: '03', title: 'Nous produisons & livrons', desc: 'Production en 48h dans notre atelier à Alger. Expédition nationale. Suivi en temps réel.', icon: '🚚' },
  ]

  return (
    <section style={{ background: C.gray1, padding: '100px 0' }}>
      <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
        <div ref={ref} className="text-center mb-16">
          <SectionLabel>Comment ça fonctionne</SectionLabel>
          <h2 className="font-black tracking-tight" style={{ fontSize: 'clamp(30px,4vw,48px)', color: C.black, letterSpacing: '-0.02em' }}>
            De l'idée à la livraison<br />en 3 étapes.
          </h2>
        </div>

        <div className="relative">
          {/* Connector line */}
          <div className="hidden lg:block absolute top-12 left-[16.66%] right-[16.66%] h-px" style={{ background: `linear-gradient(90deg, ${C.gray2}, ${C.blue}60, ${C.gray2})` }} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {steps.map((step, i) => {
              const r = useFadeIn()
              return (
                <div key={step.n} ref={r} className="text-center" style={{ transitionDelay: `${i * 100}ms` }}>
                  <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 text-[32px]"
                    style={{ background: C.white, boxShadow: `0 4px 20px rgba(0,0,0,0.08)`, border: `2px solid ${i === 1 ? C.blue : C.gray2}` }}>
                    {step.icon}
                    <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full text-[11px] font-black text-white flex items-center justify-center"
                      style={{ background: C.blue }}>{i + 1}</span>
                  </div>
                  <h3 className="font-bold text-[18px] mb-3" style={{ color: C.black }}>{step.title}</h3>
                  <p className="text-[14px] leading-relaxed" style={{ color: C.gray4 }}>{step.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
   SECTION 4 — Produits
───────────────────────────────────────────────────────────────────────── */
function ProduitsSection({ produits }: { produits: any[] }) {
  const ref = useFadeIn()

  const FEATURED = [
    { id: 'tshirt',  nom: 'T-shirt Premium', badge: '250 GSM', emoji: '👕', prix: 1800, tag: 'Bestseller' },
    { id: 'tshirt_oversized', nom: 'T-shirt Oversized', badge: '250 GSM', emoji: '👕', prix: 3200, tag: 'Premium' },
    { id: 'polo',    nom: 'Polo',            badge: 'Piqué',   emoji: '👔', prix: 2200, tag: null },
    { id: 'hoodie',  nom: 'Hoodie',          badge: 'Heavy',   emoji: '🧥', prix: 3800, tag: 'Populaire' },
    { id: 'casquette', nom: 'Casquette',     badge: 'Structured', emoji: '🧢', prix: 1500, tag: null },
    { id: 'totebag', nom: 'Tote Bag',        badge: 'Canvas',  emoji: '👜', prix: 1200, tag: null },
  ]

  return (
    <section style={{ background: C.white, padding: '100px 0' }}>
      <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
        <div ref={ref} className="flex items-end justify-between mb-12 flex-wrap gap-4">
          <div>
            <SectionLabel>Catalogue</SectionLabel>
            <h2 className="font-black tracking-tight" style={{ fontSize: 'clamp(30px,4vw,48px)', color: C.black, letterSpacing: '-0.02em' }}>
              Produits populaires.
            </h2>
          </div>
          <Link href="/#produits" className="text-[14px] font-bold no-underline" style={{ color: C.blue }}>
            Voir tout →
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
          {FEATURED.map((p, i) => {
            const r = useFadeIn()
            return (
              <div key={p.id} ref={r} className="group rounded-[24px] border overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1"
                style={{ background: C.white, borderColor: C.gray2, transitionDelay: `${i * 60}ms` }}>
                {/* Image area */}
                <div className="relative aspect-square flex items-center justify-center text-[72px]"
                  style={{ background: C.gray1 }}>
                  {p.tag && (
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold text-white"
                      style={{ background: C.blue }}>
                      {p.tag}
                    </span>
                  )}
                  {p.emoji}
                </div>
                {/* Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-bold text-[15px]" style={{ color: C.black }}>{p.nom}</p>
                      <p className="text-[12px] mt-0.5" style={{ color: C.gray3 }}>{p.badge}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-[16px]" style={{ color: C.black }}>{p.prix.toLocaleString('fr-FR')}</p>
                      <p className="text-[11px]" style={{ color: C.gray3 }}>DA / pièce</p>
                    </div>
                  </div>
                  <Link href={`/designer?product=${p.id}`}
                    className="mt-4 w-full flex items-center justify-center py-2.5 rounded-xl text-[13px] font-bold no-underline transition-all group-hover:opacity-90"
                    style={{ background: C.gray1, color: C.black }}>
                    Personnaliser →
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
   SECTION 5 — Features
───────────────────────────────────────────────────────────────────────── */
function FeaturesSection() {
  const ref = useFadeIn()
  const features = [
    { icon: '⚡', title: 'Production en 48h', desc: 'Votre commande produite et prête à expédier en 48 heures ouvrables.' },
    { icon: '📦', title: 'À partir d\'1 pièce', desc: 'Pas de minimum. Commandez 1 pièce ou 10 000, le même prix dégressif.' },
    { icon: '🧵', title: 'Broderie premium', desc: 'Machines professionnelles, fils haute qualité, rendu 3D impeccable.' },
    { icon: '🖨️', title: 'DTF haute qualité', desc: 'Impression jusqu\'à 60cm. Couleurs vives, lavable et durable.' },
    { icon: '🚚', title: 'Expédition nationale', desc: 'Livraison dans toute l\'Algérie. Retrait atelier disponible.' },
    { icon: '✅', title: 'Contrôle qualité', desc: 'Chaque pièce vérifiée avant expédition. Non-conforme = reprise gratuite.' },
  ]

  return (
    <section style={{ background: C.black, padding: '100px 0' }}>
      <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
        <div ref={ref} className="text-center mb-16">
          <SectionLabel>Nos engagements</SectionLabel>
          <h2 className="font-black tracking-tight text-white" style={{ fontSize: 'clamp(30px,4vw,48px)', letterSpacing: '-0.02em' }}>
            Pourquoi nous choisir.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => {
            const r = useFadeIn()
            return (
              <div key={f.title} ref={r}
                className="rounded-[24px] p-6 transition-all hover:scale-[1.02]"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', transitionDelay: `${i * 60}ms` }}>
                <span className="text-[32px] block mb-4">{f.icon}</span>
                <h3 className="font-bold text-[16px] text-white mb-2">{f.title}</h3>
                <p className="text-[14px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>{f.desc}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
   SECTION 6 — Stats
───────────────────────────────────────────────────────────────────────── */
function StatsSection() {
  const ref = useFadeIn()
  const stats = [
    { value: '50 000+', label: 'Produits fabriqués' },
    { value: '500+',    label: 'Marques & entreprises' },
    { value: '48h',     label: 'Délai de production' },
    { value: '4.9★',    label: 'Avis clients' },
  ]

  return (
    <section style={{ background: C.white, padding: '80px 0', borderTop: `1px solid ${C.gray2}`, borderBottom: `1px solid ${C.gray2}` }}>
      <div ref={ref} className="max-w-[1200px] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {stats.map((s, i) => (
            <div key={s.label} style={{ animationDelay: `${i * 80}ms` }}>
              <p className="font-black tracking-tight" style={{ fontSize: 'clamp(36px,5vw,56px)', color: C.blue, letterSpacing: '-0.03em' }}>{s.value}</p>
              <p className="mt-2 text-[14px]" style={{ color: C.gray4 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
   SECTION 7 — Témoignages
───────────────────────────────────────────────────────────────────────── */
function TestimonialsSection() {
  const ref = useFadeIn()
  const testimonials = [
    { init: 'K', name: 'Karim B.', role: 'Gérant', company: 'Restaurant El Kef', text: '80 polos brodés pour notre équipe de salle. Rendu impeccable, délai respecté, suivi WhatsApp rassurant. On recommande sans hésiter.', stars: 5 },
    { init: 'S', name: 'Samira M.', role: 'Directrice', company: 'Clinique Al Chifa', text: 'Blouses brodées pour toute notre équipe médicale. La qualité du tissu et la précision sur le logo sont vraiment au-dessus de nos attentes.', stars: 5 },
    { init: 'Y', name: 'Yacine O.', role: 'Directeur', company: 'BTP Construct', text: '120 gilets de chantier en 5 jours. Troisième commande chez Caractère — la régularité et le sérieux sont là à chaque fois.', stars: 5 },
    { init: 'L', name: 'Lina K.', role: 'Fondatrice', company: 'Brand Vert', text: "J'ai lancé ma marque de t-shirts sans stock grâce à Caractère. Le designer est simple, la qualité est premium. Mes clients adorent.", stars: 5 },
  ]

  return (
    <section style={{ background: C.gray1, padding: '100px 0' }}>
      <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
        <div ref={ref} className="text-center mb-14">
          <SectionLabel>Témoignages</SectionLabel>
          <h2 className="font-black tracking-tight" style={{ fontSize: 'clamp(30px,4vw,48px)', color: C.black, letterSpacing: '-0.02em' }}>
            Ils nous font confiance.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {testimonials.map((t, i) => {
            const r = useFadeIn()
            return (
              <div key={t.name} ref={r}
                className="rounded-[24px] p-7 border transition-all hover:shadow-lg"
                style={{ background: C.white, borderColor: C.gray2, transitionDelay: `${i * 80}ms` }}>
                <div className="flex gap-0.5 mb-5">
                  {[...Array(t.stars)].map((_, j) => <span key={j} style={{ color: '#F59E0B' }}>★</span>)}
                </div>
                <p className="text-[15px] leading-relaxed mb-6" style={{ color: '#374151' }}>"{t.text}"</p>
                <div className="flex items-center gap-3 pt-5" style={{ borderTop: `1px solid ${C.gray2}` }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-[14px] font-black text-white flex-shrink-0"
                    style={{ background: `linear-gradient(135deg, ${C.blue}, #7C3AED)` }}>
                    {t.init}
                  </div>
                  <div>
                    <p className="font-bold text-[14px]" style={{ color: C.black }}>{t.name}</p>
                    <p className="text-[12px]" style={{ color: C.gray3 }}>{t.role} — {t.company}</p>
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

/* ─────────────────────────────────────────────────────────────────────────
   CTA FINAL
───────────────────────────────────────────────────────────────────────── */
function CtaSection() {
  const ref = useFadeIn()
  return (
    <section style={{ background: C.white, padding: '100px 0' }}>
      <div className="max-w-[900px] mx-auto px-6 lg:px-10 text-center">
        <div ref={ref}
          className="rounded-[32px] p-12 md:p-16"
          style={{ background: `linear-gradient(135deg, ${C.black} 0%, #1a1a2e 100%)` }}>
          <Badge>Démarrez aujourd'hui</Badge>
          <h2 className="mt-6 font-black tracking-tight text-white" style={{ fontSize: 'clamp(28px,4vw,48px)', letterSpacing: '-0.02em' }}>
            Prêt à lancer votre marque<br />ou habiller votre équipe ?
          </h2>
          <p className="mt-4 text-[16px] mb-10" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Devis gratuit · Réponse en 2h · Livraison nationale
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/configurateur"
              className="px-8 py-4 rounded-full text-[16px] font-bold text-white no-underline transition-all hover:-translate-y-0.5"
              style={{ background: C.blue, boxShadow: `0 8px 24px ${C.blue}50` }}>
              Configurer ma commande →
            </Link>
            <a href="https://wa.me/213557440522"
              target="_blank" rel="noopener noreferrer"
              className="px-8 py-4 rounded-full text-[16px] font-bold no-underline border-2"
              style={{ borderColor: 'rgba(255,255,255,0.3)', color: 'white', background: 'rgba(255,255,255,0.08)' }}>
              WhatsApp direct
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
   FOOTER
───────────────────────────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer style={{ background: C.black, color: 'rgba(255,255,255,0.6)', padding: '60px 0 40px' }}>
      <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <p className="font-black text-white text-[20px] mb-3">Caractère</p>
            <p className="text-[13px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Fabrication textile premium en Algérie. Broderie, DTF, Print on Demand.
            </p>
          </div>
          {[
            { title: 'Produits', links: [
              { label: 'Print on Demand', href: '/designer' },
              { label: 'Configurateur', href: '/configurateur' },
              { label: 'Entreprise', href: '/configurateur' },
              { label: 'Collection', href: '/collection' },
              { label: 'Catalogue', href: '/catalogue' },
            ]},
            { title: 'Support', links: [
              { label: 'Contact', href: '/#contact' },
              { label: 'FAQ', href: '/#faq' },
              { label: 'Suivi commande', href: '/suivi' },
              { label: 'WhatsApp', href: 'https://wa.me/213557440522' },
            ]},
            { title: 'Réseaux', links: [
              { label: 'Instagram', href: 'https://instagram.com/caractere.store' },
              { label: 'TikTok', href: '#' },
              { label: 'Facebook', href: '#' },
            ]},
          ].map(col => (
            <div key={col.title}>
              <p className="text-white font-bold text-[14px] mb-4">{col.title}</p>
              <div className="flex flex-col gap-2.5">
                {col.links.map(l => (
                  <a key={l.label} href={l.href}
                    className="text-[13px] no-underline transition-colors hover:text-white"
                    style={{ color: 'rgba(255,255,255,0.45)' }}>
                    {l.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-8" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <p className="text-[12px]" style={{ color: 'rgba(255,255,255,0.3)' }}>
            © 2025 Caractère Store · Alger, Algérie
          </p>
          <p className="text-[12px]" style={{ color: 'rgba(255,255,255,0.3)' }}>
            @caractere.store · 297K abonnés
          </p>
        </div>
      </div>
    </footer>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
   PAGE PRINCIPALE
───────────────────────────────────────────────────────────────────────── */
export default function HomePageContent({ produits = [] }: { produits?: any[] }) {
  return (
    <>
      <style>{`
        @keyframes float { 0%,100% { transform: translateY(0px) } 50% { transform: translateY(-8px) } }
        @keyframes float-slow { 0%,100% { transform: translateY(0px) } 50% { transform: translateY(-5px) } }
        .animate-float { animation: float 3s ease-in-out infinite }
        .animate-float-slow { animation: float-slow 4s ease-in-out infinite }
      `}</style>
      <Hero />
      <WhySection />
      <HowItWorksSection />
      <ProduitsSection produits={produits} />
      <FeaturesSection />
      <StatsSection />
      <TestimonialsSection />
      <CtaSection />
      <Footer />
    </>
  )
}
