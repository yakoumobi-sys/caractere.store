'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Studio3DPreview from './Studio3DPreview'

// ─── Palette ────────────────────────────────────────────────────────────────
const C = {
  blue:    '#0C4A6E',
  blueMid: '#1E6FA8',
  blueAcc: '#38BDF8',
  black:   '#0C1A26',
  gray1:   '#F0F7FF',
  gray2:   '#BAE6FD',
  gray3:   '#7DD3FC',
  gray4:   '#1E3A5F',
  white:   '#FFFFFF',
  green:   '#16A34A',
  greenLt: '#DCFCE7',
  blueLt:  '#EFF6FF',
}

// ─── Utilitaires ────────────────────────────────────────────────────────────
function useFadeIn(delay = 0) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.opacity = '0'
    el.style.transform = 'translateY(20px)'
    el.style.transition = `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.style.opacity = '1'; el.style.transform = 'translateY(0)' } },
      { threshold: 0.1 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [delay])
  return ref
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-[0.15em] uppercase mb-3" style={{ color: C.blueMid }}>
      {children}
    </p>
  )
}

// ─── Images produits ────────────────────────────────────────────────────────
const BASE = 'https://aijlvbipvqnvbywxhlbd.supabase.co/storage/v1/object/public/image'

// ─── CATALOGUE produits (fallback si Supabase vide) ──────────────────────────
const PRODUITS_FALLBACK = [
  { id: 'tshirt',            nom: 'T-shirt',             badge: '100% coton',       prix: 1950, tag: 'Bestseller', technique: 'DTF · Broderie' },
  { id: 'tshirt_oversized',  nom: 'T-shirt Oversized',   badge: '250 GSM premium',  prix: 3200, tag: 'Premium',    technique: 'DTF · Broderie' },
  { id: 'polo',              nom: 'Polo',                badge: 'Piqué coton',      prix: 2300, tag: null,         technique: 'DTF · Broderie' },
  { id: 'gilet',             nom: 'Gilet de travail',    badge: 'Multipoches',      prix: 2500, tag: null,         technique: 'DTF · Broderie' },
  { id: 'casquette',         nom: 'Casquette',           badge: 'Structurée',       prix: 1200, tag: null,         technique: 'Broderie' },
  { id: 'totebag',           nom: 'Tote Bag',            badge: 'Canvas premium',   prix: 950,  tag: null,         technique: 'DTF' },
]

/* ══════════════════════════════════════════════════════════════════════════════
   HERO — OPTIMISÉ: Single CTA primaire + pricing transparent
══════════════════════════════════════════════════════════════════════════════ */
function Hero() {
  const LOGO = 'https://aijlvbipvqnvbywxhlbd.supabase.co/storage/v1/object/public/image/logo-white-transparent.png'
  const [userType, setUserType] = useState<'b2c' | 'b2b'>('b2c')
  const leftRef  = useFadeIn(0)
  const rightRef = useFadeIn(150)

  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: 'linear-gradient(150deg, #0C4A6E 0%, #0E5E8A 50%, #38BDF8 100%)',
        minHeight: '100vh',
        paddingTop: '56px',
      }}
    >
      {/* Grille de fond */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)`,
        backgroundSize: '48px 48px',
      }} />
      {/* Halo */}
      <div className="absolute pointer-events-none" style={{ top: -200, right: -200, width: 700, height: 700, background: 'radial-gradient(circle, rgba(56,189,248,0.25) 0%, transparent 70%)' }} />

      <div className="relative max-w-[1200px] mx-auto px-6 lg:px-10 pt-4 pb-8 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* ── Colonne texte ── */}
          <div ref={leftRef}>
            <img src={LOGO} alt="Caractère" className="h-28 w-auto object-contain mb-5 mx-auto block lg:mx-0" />

            <h1 className="font-black leading-[1.08] tracking-tight mb-3"
              style={{ fontSize: 'clamp(30px,5vw,56px)', color: '#FFFFFF', letterSpacing: '-0.025em' }}>
              Personnalisez vos vêtements.<br />
              <span style={{ color: '#BAE6FD' }}>Développez votre marque.</span>
            </h1>

            <p className="mb-5 max-w-md leading-relaxed" style={{ fontSize: '15px', color: 'rgba(255,255,255,0.72)' }}>
              Print on Demand sans abonnement, vêtements personnalisés pour entreprises et particuliers. Production rapide à partir d'une seule pièce.
            </p>

            {/* SEGMENTATION: Toggle B2C/B2B */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setUserType('b2c')}
                className="px-4 py-2 rounded-full text-[12px] font-bold transition-all"
                style={{
                  background: userType === 'b2c' ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.15)',
                  color: userType === 'b2c' ? C.blue : 'rgba(255,255,255,0.7)',
                  border: '1px solid rgba(255,255,255,0.25)',
                }}>
                👤 Particulier
              </button>
              <button
                onClick={() => setUserType('b2b')}
                className="px-4 py-2 rounded-full text-[12px] font-bold transition-all"
                style={{
                  background: userType === 'b2b' ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.15)',
                  color: userType === 'b2b' ? C.blue : 'rgba(255,255,255,0.7)',
                  border: '1px solid rgba(255,255,255,0.25)',
                }}>
                🏢 Entreprise
              </button>
            </div>

            {/* CTA PRIMAIRE + Pricing transparent */}
            {userType === 'b2c' ? (
              <div className="space-y-3">
                <Link href="/designer"
                  className="flex flex-col px-7 py-5 rounded-2xl no-underline transition-all hover:-translate-y-0.5 hover:shadow-xl group w-full"
                  style={{ background: '#FFFFFF', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[18px] font-black leading-tight" style={{ color: C.blue }}>Lancez votre marque</p>
                      <p className="text-[12px] mt-0.5" style={{ color: C.blueMid }}>À partir de 1 950 DA / pièce</p>
                    </div>
                    <span className="text-[22px] group-hover:translate-x-1 transition-transform" style={{ color: C.blue }}>→</span>
                  </div>
                </Link>
                <p className="text-[12px] text-center" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  ✓ Dès 1 pièce · Sans abonnement · Devis gratuit
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <Link href="/configurateur"
                  className="flex flex-col px-7 py-5 rounded-2xl no-underline transition-all hover:-translate-y-0.5 hover:shadow-xl group w-full"
                  style={{ background: '#FFFFFF', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[18px] font-black leading-tight" style={{ color: C.blue }}>Habillez votre équipe</p>
                      <p className="text-[12px] mt-0.5" style={{ color: C.blueMid }}>À partir de 1 200 DA / pièce</p>
                    </div>
                    <span className="text-[22px] group-hover:translate-x-1 transition-transform" style={{ color: C.blue }}>→</span>
                  </div>
                </Link>
                <p className="text-[12px] text-center" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  ✓ Remise dès 50 pièces · Devis en 2h · Livraison nationale
                </p>
              </div>
            )}

            <Link href="/comment-ca-marche"
              className="text-center py-2.5 text-[13px] font-medium no-underline transition-all mt-3 block"
              style={{ color: 'rgba(255,255,255,0.5)' }}>
              Comment ça marche ? →
            </Link>
          </div>

          {/* ── Colonne visuelle ── */}
          <div ref={rightRef} className="relative hidden lg:flex items-center justify-center" style={{ height: '580px' }}>
            {/* Carte produit centrale */}
            <div className="relative w-[300px] h-[360px] rounded-[28px] overflow-hidden flex flex-col items-center justify-center"
              style={{ background: 'linear-gradient(145deg, #F0F7FF 0%, #E0EEFF 100%)', boxShadow: '0 32px 80px rgba(12,74,110,0.25)' }}>
              <img
                src={BASE + '/IMG_5850.jpeg'}
                alt="T-shirt premium"
                className="w-full h-[220px] object-cover"
              />
              <div className="p-5 w-full">
                <p className="text-[14px] font-black mb-0.5" style={{ color: C.black }}>T-shirt Premium 250 GSM</p>
                <p className="text-[11px] mb-3" style={{ color: C.gray4 }}>Broderie · DTF · dès 1 pièce</p>
                <div className="flex gap-1.5 mb-3">
                  {['#1A1A1A','#2563EB','#DC2626','#166534','#D6B99A'].map(hex => (
                    <div key={hex} className="w-5 h-5 rounded-full border-2 border-white shadow-sm" style={{ background: hex }} />
                  ))}
                </div>
                <p className="text-[16px] font-black" style={{ color: C.blue }}>À partir de 1 950 DA</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════════════════
   SOCIAL PROOF — DÉPLACÉ PLUS TÔT (juste après Hero)
══════════════════════════════════════════════════════════════════════════════ */
function TrustBadges() {
  const ref = useFadeIn()
  return (
    <section style={{ background: C.white, padding: '64px 0' }}>
      <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
        <div ref={ref} className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <p className="text-[28px] font-black" style={{ color: C.blue }}>50 000+</p>
            <p className="text-[13px] mt-1" style={{ color: C.gray4 }}>Pièces fabriquées</p>
          </div>
          <div>
            <p className="text-[28px] font-black" style={{ color: C.blue }}>500+</p>
            <p className="text-[13px] mt-1" style={{ color: C.gray4 }}>Marques & entreprises</p>
          </div>
          <div>
            <p className="text-[28px] font-black" style={{ color: C.blue }}>4.9 ⭐</p>
            <p className="text-[13px] mt-1" style={{ color: C.gray4 }}>Note moyenne clients</p>
          </div>
          <div>
            <p className="text-[28px] font-black" style={{ color: C.blue }}>48h</p>
            <p className="text-[13px] mt-1" style={{ color: C.gray4 }}>Délai de production</p>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════════════════
   GARANTIES & OBJECTIONS — NOUVELLE SECTION CLÉE
══════════════════════════════════════════════════════════════════════════════ */
function GuaranteesSection() {
  const ref = useFadeIn()
  const guarantees = [
    {
      icon: '✓',
      title: 'Qualité garantie',
      desc: 'Contrôle QC sur chaque pièce. Non-conforme = reprise gratuite.',
    },
    {
      icon: '⚡',
      title: 'Délai respecté',
      desc: 'Production en 48h à Alger. Livraison 3-5 jours. Garantie délai.',
    },
    {
      icon: '🎨',
      title: 'Design adapté',
      desc: 'Pas de fichier vectoriel? On vectorise gratuitement pour vous.',
    },
    {
      icon: '💬',
      title: 'Support WhatsApp',
      desc: 'Suivi temps réel à chaque étape. On vous tient informé.',
    },
  ]

  return (
    <section style={{ background: '#F8FAFB', padding: '80px 0' }}>
      <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
        <div ref={ref} className="text-center mb-14">
          <Label>Nos engagements</Label>
          <h2 className="font-black tracking-tight" style={{ fontSize: 'clamp(28px,4vw,44px)', color: C.black, letterSpacing: '-0.025em' }}>
            Pourquoi nous choisir
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {guarantees.map((g, i) => (
            <div key={i} className="p-6 rounded-2xl" style={{ background: C.white, border: '1px solid #E5E7EB' }}>
              <p className="text-[32px] mb-3">{g.icon}</p>
              <p className="font-black text-[15px] mb-2" style={{ color: C.black }}>{g.title}</p>
              <p className="text-[13px] leading-relaxed" style={{ color: C.gray4 }}>{g.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════════════════
   HOW IT WORKS
══════════════════════════════════════════════════════════════════════════════ */
function HowItWorks() {
  const ref = useFadeIn()
  const steps = [
    { num: '01', title: 'Choisissez votre produit', desc: 'T-shirt, polo, gilet, casquette… catalogue textile premium avec images HD.' },
    { num: '02', title: 'Uploadez votre design', desc: 'Glissez votre logo dans le Designer ou passez par le Configurateur. Prévisualisation en temps réel.' },
    { num: '03', title: 'On produit', desc: 'DTF ou broderie — production en 48h à Alger. Contrôle qualité sur chaque pièce.' },
    { num: '04', title: 'On livre', desc: 'Livraison nationale 3–5 jours. Retrait atelier disponible. Suivi de commande en temps réel.' },
  ]

  return (
    <section style={{ background: 'rgba(12,74,110,0.03)', padding: '96px 0' }}>
      <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
        <div ref={ref} className="text-center mb-14">
          <Label>Le processus</Label>
          <h2 className="font-black tracking-tight" style={{ fontSize: 'clamp(28px,4vw,44px)', color: C.black, letterSpacing: '-0.025em' }}>
            De l'idée à la livraison en 4 étapes
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <div key={i} className="text-center">
              <p className="text-[42px] font-black mb-4" style={{ color: C.blueAcc }}>{s.num}</p>
              <h3 className="font-black text-[16px] mb-2" style={{ color: C.black }}>{s.title}</h3>
              <p className="text-[13px] leading-relaxed" style={{ color: C.gray4 }}>{s.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/comment-ca-marche"
            className="inline-block px-7 py-3 rounded-full font-bold text-[14px] no-underline transition-all hover:-translate-y-0.5"
            style={{ background: C.blue, color: C.white, boxShadow: '0 4px 12px rgba(12,74,110,0.3)' }}>
            Voir en détail →
          </Link>
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════════════════
   TECHNIQUES
══════════════════════════════════════════════════════════════════════════════ */
function TechniquesSection() {
  const ref = useFadeIn()

  return (
    <section style={{ background: C.white, padding: '96px 0' }}>
      <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
        <div ref={ref} className="text-center mb-14">
          <Label>Nos techniques</Label>
          <h2 className="font-black tracking-tight" style={{ fontSize: 'clamp(28px,4vw,44px)', color: C.black, letterSpacing: '-0.025em' }}>
            La meilleure technique pour chaque projet
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {[
            {
              icon: '🖨️',
              title: 'DTF — Direct to Film',
              subtitle: 'Machines Epson I3200 · Format jusqu\'à 60cm',
              points: [
                'Rendu photographique',
                'Résistant au lavage 40+',
                'Tous types de tissus',
                'Dès 1 pièce',
              ],
              link: { text: 'Commander en DTF →', href: '/configurateur' },
            },
            {
              icon: '🪡',
              title: 'Broderie machine',
              subtitle: '3 têtes de broderie · Finition relief',
              points: [
                'Effet 3D et relief',
                'Tenue à vie',
                'Casquettes et polos',
                'Logos structurés',
              ],
              link: { text: 'Commander en broderie →', href: '/configurateur' },
            },
          ].map((t, i) => (
            <div key={i} className="p-8 rounded-2xl" style={{ background: C.gray1, border: `2px solid ${C.gray2}` }}>
              <p className="text-[48px] mb-4">{t.icon}</p>
              <h3 className="font-black text-[20px] mb-1" style={{ color: C.black }}>{t.title}</h3>
              <p className="text-[13px] mb-6" style={{ color: C.gray4 }}>{t.subtitle}</p>
              <ul className="space-y-2 mb-6">
                {t.points.map((pt, j) => (
                  <li key={j} className="flex items-center gap-2 text-[13px]" style={{ color: C.gray4 }}>
                    <span style={{ color: C.green }}>✓</span> {pt}
                  </li>
                ))}
              </ul>
              <Link href={t.link.href}
                className="inline-block text-[13px] font-bold no-underline transition-all hover:translate-x-1"
                style={{ color: C.blue }}>
                {t.link.text}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════════════════
   PRODUITS
══════════════════════════════════════════════════════════════════════════════ */
function ProduitsSection({ produits = [] }: { produits?: any[] }) {
  const ref = useFadeIn()
  const items = produits.length > 0 ? produits : PRODUITS_FALLBACK

  return (
    <section style={{ background: C.white, padding: '96px 0' }}>
      <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
        <div ref={ref} className="text-center mb-14">
          <Label>Catalogue</Label>
          <h2 className="font-black tracking-tight" style={{ fontSize: 'clamp(28px,4vw,44px)', color: C.black, letterSpacing: '-0.025em' }}>
            Produits populaires
          </h2>
          <p className="text-[15px] mt-3" style={{ color: C.gray4 }}>
            Broderie ou DTF — de 1 à 10 000 pièces, prix dégressif.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {items.slice(0, 6).map((p: any, i: number) => (
            <div key={p.id || i} className="rounded-2xl overflow-hidden transition-transform hover:scale-105" style={{ background: C.gray1, border: '1px solid #E5E7EB' }}>
              <div className="h-[200px] bg-gray-200 relative overflow-hidden">
                {p.tag && (
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[11px] font-bold" style={{ background: C.blueAcc, color: C.white }}>
                    {p.tag}
                  </span>
                )}
              </div>
              <div className="p-5">
                <p className="text-[14px] font-black mb-1" style={{ color: C.black }}>{p.nom || p.name}</p>
                <p className="text-[11px] mb-3" style={{ color: C.gray4 }}>{p.badge || p.description}</p>
                <p className="text-[14px] font-bold mb-4" style={{ color: C.blue }}>{p.prix || p.price} DA / pièce</p>
                <Link href="/configurateur"
                  className="inline-block px-4 py-2 rounded-lg text-[12px] font-bold no-underline transition-all hover:-translate-y-0.5 w-full text-center"
                  style={{ background: C.blue, color: C.white }}>
                  Commander →
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link href="/produits"
            className="inline-block px-7 py-3 rounded-full font-bold text-[14px] no-underline transition-all hover:-translate-y-0.5"
            style={{ background: C.blueLt, color: C.blue, border: `2px solid ${C.blueAcc}` }}>
            Voir le catalogue complet →
          </Link>
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════════════════
   TESTIMONIALS — SIMPLIFIED
══════════════════════════════════════════════════════════════════════════════ */
const TEMOIGNAGES = [
  { init: 'K', nom: 'Karim B.', role: 'Gérant', co: 'Restaurant El Kef', note: 5, texte: '80 polos brodés pour notre équipe. Rendu impeccable, délai respecté, suivi WhatsApp rassurant. On recommande sans hésiter.' },
  { init: 'S', nom: 'Samira M.', role: 'Directrice', co: 'Clinique Al Chifa', note: 5, texte: 'Blouses brodées pour toute notre équipe médicale. La qualité du tissu et la précision sur le logo sont vraiment au-dessus de nos attentes.' },
  { init: 'Y', nom: 'Yacine O.', role: 'Directeur', co: 'BTP Construct', note: 5, texte: '120 gilets de chantier en 5 jours. Troisième commande chez Caractère — la régularité et le sérieux sont là à chaque fois.' },
  { init: 'L', nom: 'Lina K.', role: 'Fondatrice', co: 'Brand Vert', note: 5, texte: "J'ai lancé ma marque de t-shirts sans stock grâce à Caractère. Le designer est simple, la qualité est premium. Mes clients adorent." },
]

function TemoignageCard({ t, delay }: { t: any; delay: number }) {
  const ref = useFadeIn(delay)
  return (
    <div ref={ref} className="p-6 rounded-2xl" style={{ background: C.gray1, border: '1px solid #E5E7EB' }}>
      <div className="flex gap-3 mb-3">
        {[...Array(t.note)].map((_, i) => (
          <span key={i} style={{ color: '#FFB703' }}>⭐</span>
        ))}
      </div>
      <p className="text-[13px] leading-relaxed mb-4 italic" style={{ color: C.gray4 }}>"{t.texte}"</p>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full flex items-center justify-center font-black text-white" style={{ background: C.blue }}>
          {t.init}
        </div>
        <div>
          <p className="text-[13px] font-bold" style={{ color: C.black }}>{t.nom}</p>
          <p className="text-[11px]" style={{ color: C.gray4 }}>{t.role} · {t.co}</p>
        </div>
      </div>
    </div>
  )
}

function TestimonialsSection() {
  const ref = useFadeIn()
  return (
    <section style={{ background: C.white, padding: '96px 0' }}>
      <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
        <div ref={ref} className="text-center mb-14">
          <Label>Témoignages</Label>
          <h2 className="font-black tracking-tight" style={{ fontSize: 'clamp(28px,4vw,44px)', color: C.black, letterSpacing: '-0.025em' }}>
            Ils nous font confiance
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {TEMOIGNAGES.map((t, i) => (
            <TemoignageCard key={t.nom} t={t} delay={i * 70} />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════════════════
   CTA FINAL
══════════════════════════════════════════════════════════════════════════════ */
function CtaSection() {
  const ref = useFadeIn()
  return (
    <section style={{ background: C.gray1, padding: '80px 0' }}>
      <div className="max-w-[1000px] mx-auto px-6 lg:px-10">
        <div ref={ref} className="rounded-[32px] p-10 md:p-16 text-center overflow-hidden relative"
          style={{ background: `linear-gradient(135deg, ${C.black} 0%, #1a1a2e 100%)` }}>
          <div className="absolute pointer-events-none" style={{ top: -100, right: -100, width: 400, height: 400, background: 'radial-gradient(circle, rgba(56,189,248,0.15) 0%, transparent 70%)' }} />

          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[12px] font-bold border mb-6"
            style={{ background: 'rgba(56,189,248,0.1)', color: '#BAE6FD', borderColor: 'rgba(56,189,248,0.2)' }}>
            🚀 Démarrez aujourd'hui
          </span>

          <h2 className="font-black tracking-tight text-white mb-4" style={{ fontSize: 'clamp(26px,4vw,42px)', letterSpacing: '-0.025em' }}>
            Prêt à lancer votre marque<br />ou habiller votre équipe ?
          </h2>
          <p className="text-[15px] mb-10" style={{ color: 'rgba(255,255,255,0.55)' }}>
            Devis gratuit · Réponse en 2h · Livraison nationale
          </p>

          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/designer"
              className="px-8 py-4 rounded-full text-[15px] font-bold text-white no-underline transition-all hover:-translate-y-0.5"
              style={{ background: C.blue, boxShadow: '0 8px 24px rgba(12,74,110,0.5)' }}>
              Lancer ma marque →
            </Link>
            <Link href="/configurateur"
              className="px-8 py-4 rounded-full text-[15px] font-bold no-underline transition-all border-2 hover:-translate-y-0.5"
              style={{ color: C.white, borderColor: 'rgba(255,255,255,0.25)', background: 'rgba(255,255,255,0.07)' }}>
              Configurer ma commande
            </Link>
            <a href="https://wa.me/213557440522" target="_blank" rel="noopener noreferrer"
              className="px-8 py-4 rounded-full text-[15px] font-bold no-underline transition-all flex items-center gap-2 hover:-translate-y-0.5"
              style={{ background: '#25D366', color: C.white }}>
              💬 WhatsApp direct
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════════════════
   FOOTER
══════════════════════════════════════════════════════════════════════════════ */
function Footer() {
  return (
    <footer style={{ background: '#0C1A26', padding: '60px 0 40px' }}>
      <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <p className="font-black text-white text-[20px] mb-3">Caractère</p>
            <p className="text-[13px] leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Fabrication textile premium en Algérie. Broderie, DTF, Print on Demand.
            </p>
            <p className="text-[12px]" style={{ color: 'rgba(255,255,255,0.3)' }}>📍 Alger, Algérie</p>
          </div>
          {[
            {
              title: 'Produits',
              links: [
                { label: 'Print on Demand', href: '/designer' },
                { label: 'Configurateur', href: '/configurateur' },
                { label: 'Collection', href: '/collection' },
                { label: 'Catalogue PDF', href: '/catalogue' },
              ],
            },
            {
              title: 'Support',
              links: [
                { label: 'Suivi commande', href: '/suivi' },
                { label: 'WhatsApp', href: 'https://wa.me/213557440522' },
                { label: 'Se connecter', href: '/auth/login' },
              ],
            },
            {
              title: 'Réseaux',
              links: [
                { label: 'Instagram @caractere.store', href: 'https://instagram.com/caractere.store' },
                { label: 'TikTok', href: '#' },
              ],
            },
          ].map(col => (
            <div key={col.title}>
              <p className="text-white font-bold text-[13px] mb-4">{col.title}</p>
              <div className="flex flex-col gap-2.5">
                {col.links.map(l => (
                  <a key={l.label} href={l.href} className="text-[13px] no-underline hover:text-white transition-colors" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    {l.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 pt-8" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <p className="text-[12px]" style={{ color: 'rgba(255,255,255,0.3)' }}>© 2025 Caractère Store · Alger</p>
          <p className="text-[12px]" style={{ color: 'rgba(255,255,255,0.3)' }}>@caractere.store · 297K abonnés</p>
        </div>
      </div>
    </footer>
  )
}

/* ══════════════════════════════════════════════════════════════════════════════
   EXPORT PRINCIPAL — OPTIMISÉ
══════════════════════════════════════════════════════════════════════════════ */
export default function HomePageContent({ produits = [] }: { produits?: any[] }) {
  return (
    <>
      <style>{`
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes float-slow { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
        .animate-float { animation: float 3s ease-in-out infinite }
        .animate-float-slow { animation: float-slow 4s ease-in-out infinite }
      `}</style>
      <Hero />
      <TrustBadges />
      <GuaranteesSection />
      <HowItWorks />
      <ProduitsSection produits={produits} />
      <TechniquesSection />
      <TestimonialsSection />
      <CtaSection />
      <Footer />
    </>
  )
}
