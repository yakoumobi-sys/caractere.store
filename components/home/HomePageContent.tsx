'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

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

function useFadeIn(delay = 0) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.opacity = '0'
    el.style.transform = 'translateY(24px)'
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

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[13px] font-semibold border"
      style={{ background: C.blueLt, color: C.blue, borderColor: `${C.blue}30` }}>
      {children}
    </span>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-[12px] font-bold tracking-[0.15em] uppercase mb-4" style={{ color: C.blue }}>{children}</p>
}

function FloatingCard({ children, className = '', style = {} }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`absolute rounded-2xl shadow-xl border px-4 py-3 ${className}`}
      style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(16px)', borderColor: C.gray2, ...style }}>
      {children}
    </div>
  )
}

/* ── HERO ─────────────────────────────────────────────────────────────── */
function Hero() {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ nom: '', telephone: '', email: '', entreprise: '', wilaya: '' })
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const wilayas = ['Alger','Oran','Constantine','Annaba','Blida','Batna','Sétif','Tlemcen','Béjaïa','Tizi Ouzou','Médéa','Mostaganem','Biskra','Adrar','Chlef','Bouira','Tamanrasset','Tébessa','Tiaret','Djelfa','Jijel','Saïda','Skikda','Sidi Bel Abbès','Guelma','MSila','Mascara','Ouargla','El Bayadh','Illizi','Bordj Bou Arréridj','Boumerdès','El Tarf','Tindouf','Tissemsilt','El Oued','Khenchela','Souk Ahras','Tipaza','Mila','Aïn Defla','Naâma','Aïn Témouchent','Ghardaïa','Relizane']

  const handleSubmit = async () => {
    if (!form.nom || !form.telephone) return alert('Nom et téléphone requis.')
    setLoading(true)
    try { await fetch('/api/leads', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, source: 'Hero CTA' }) }) } catch {}
    setDone(true); setLoading(false)
  }

  const heroRef = useFadeIn(0)

  return (
    <section className="relative overflow-hidden" style={{ background: C.white, minHeight: '100vh', paddingTop: '80px' }}>
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `linear-gradient(${C.gray2} 1px, transparent 1px), linear-gradient(90deg, ${C.gray2} 1px, transparent 1px)`,
        backgroundSize: '60px 60px', opacity: 0.3,
      }} />
      <div className="absolute pointer-events-none" style={{ top: '-200px', right: '-200px', width: '700px', height: '700px', background: `radial-gradient(circle, ${C.blue}14 0%, transparent 70%)` }} />

      <div className="relative max-w-[1200px] mx-auto px-6 lg:px-10 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* LEFT */}
          <div ref={heroRef}>
            <Badge>🇩🇿 Fabrication textile premium en Algérie</Badge>
            <h1 className="mt-8 font-black leading-[1.05] tracking-tight" style={{ fontSize: 'clamp(38px,5vw,64px)', color: C.black, letterSpacing: '-0.02em' }}>
              Le textile premium<br /><span style={{ color: C.blue }}>pour votre marque.</span>
            </h1>
            <p className="mt-6 leading-relaxed max-w-lg" style={{ fontSize: '18px', color: C.gray4 }}>
              Une seule plateforme pour lancer votre marque en Print on Demand, commander des vêtements personnalisés ou acheter la collection Caractère.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link href="/configurateur"
                className="inline-flex items-center gap-2 px-7 py-4 rounded-full text-[16px] font-bold text-white no-underline transition-all hover:opacity-90 hover:-translate-y-0.5"
                style={{ background: C.blue, boxShadow: `0 8px 24px ${C.blue}40` }}>
                Configurer ma commande →
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
                { icon: '🏢', title: 'Entreprises', desc: 'Uniformes pour votre équipe.', href: '/configurateur', cta: 'Configurer' },
                { icon: '👕', title: 'Collection', desc: 'Pièces premium prêtes à porter.', href: '/collection', cta: 'Voir' },
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

          {/* RIGHT — mockup */}
          <div className="relative hidden lg:block" style={{ height: '560px' }}>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-[320px] h-[380px] rounded-[32px] overflow-hidden"
                style={{ background: 'linear-gradient(145deg, #EEF2FF 0%, #E0E7FF 100%)', boxShadow: '0 40px 80px rgba(37,99,235,0.12)' }}>
                <div className="absolute inset-0" style={{ backgroundImage: `radial-gradient(${C.blue}18 1px, transparent 1px)`, backgroundSize: '24px 24px' }} />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-8">
                  <div className="text-[80px] leading-none">👕</div>
                  <div className="text-center">
                    <p className="text-[15px] font-bold" style={{ color: C.black }}>T-shirt Premium 250GSM</p>
                    <p className="text-[12px] mt-1" style={{ color: C.gray4 }}>Broderie + DTF</p>
                  </div>
                  <div className="flex gap-2">
                    {['#1A1A1A','#2563EB','#DC2626','#166534','#D6B99A'].map(hex => (
                      <div key={hex} className="w-5 h-5 rounded-full border-2 border-white shadow-sm" style={{ background: hex }} />
                    ))}
                  </div>
                  <div className="w-full px-4 py-2 rounded-full text-[13px] font-bold text-white text-center" style={{ background: C.blue }}>
                    Personnaliser →
                  </div>
                </div>
              </div>
            </div>

            <FloatingCard className="animate-float-slow" style={{ top: '20px', left: '-20px', minWidth: '180px' }}>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-[14px]" style={{ background: C.blueLt }}>📦</div>
                <div>
                  <p className="text-[11px] font-bold" style={{ color: C.black }}>Commande #5841</p>
                  <p className="text-[10px]" style={{ color: C.gray4 }}>En production</p>
                </div>
                <span className="ml-1 w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              </div>
            </FloatingCard>

            <FloatingCard className="animate-float" style={{ top: '130px', right: '-30px', minWidth: '160px' }}>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: C.greenLt }}>✅</div>
                <div>
                  <p className="text-[11px] font-bold" style={{ color: C.black }}>Nouvelle vente</p>
                  <p className="text-[10px]" style={{ color: C.green }}>+1 Hoodie · 3 800 DA</p>
                </div>
              </div>
            </FloatingCard>

            <FloatingCard style={{ bottom: '110px', left: '-30px', minWidth: '170px' }}>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: '#FFF7ED' }}>🚚</div>
                <div>
                  <p className="text-[11px] font-bold" style={{ color: C.black }}>Expédition demain</p>
                  <p className="text-[10px]" style={{ color: C.gray4 }}>Constantine · #5832</p>
                </div>
              </div>
            </FloatingCard>

            <FloatingCard style={{ bottom: '30px', right: '-10px', minWidth: '140px' }}>
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

      {/* Modal formulaire */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
          <div className="w-full max-w-md rounded-3xl p-6 space-y-3" style={{ background: C.white }}>
            {!done ? (
              <>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[18px] font-bold" style={{ color: C.black }}>Créer mon compte gratuit</p>
                  <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-full flex items-center justify-center border cursor-pointer bg-transparent" style={{ borderColor: C.gray2 }}>×</button>
                </div>
                <input placeholder="Nom complet *" value={form.nom} onChange={e => setForm(f => ({ ...f, nom: e.target.value }))} className="w-full border rounded-xl px-4 py-3 text-[14px] outline-none" style={{ borderColor: C.gray2 }} />
                <input placeholder="Téléphone *" type="tel" value={form.telephone} onChange={e => setForm(f => ({ ...f, telephone: e.target.value }))} className="w-full border rounded-xl px-4 py-3 text-[14px] outline-none" style={{ borderColor: C.gray2 }} />
                <input placeholder="Email" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="w-full border rounded-xl px-4 py-3 text-[14px] outline-none" style={{ borderColor: C.gray2 }} />
                <input placeholder="Entreprise / Marque (optionnel)" value={form.entreprise} onChange={e => setForm(f => ({ ...f, entreprise: e.target.value }))} className="w-full border rounded-xl px-4 py-3 text-[14px] outline-none" style={{ borderColor: C.gray2 }} />
                <select value={form.wilaya} onChange={e => setForm(f => ({ ...f, wilaya: e.target.value }))} className="w-full border rounded-xl px-4 py-3 text-[14px] outline-none" style={{ borderColor: C.gray2 }}>
                  <option value="">Wilaya (optionnel)</option>
                  {wilayas.map(w => <option key={w} value={w}>{w}</option>)}
                </select>
                <button onClick={handleSubmit} disabled={loading} className="w-full py-3.5 rounded-xl text-[15px] font-bold text-white disabled:opacity-60" style={{ background: C.blue }}>
                  {loading ? 'Envoi...' : 'Créer mon compte →'}
                </button>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="text-[56px] mb-4">✅</div>
                <p className="text-[20px] font-bold mb-2" style={{ color: C.black }}>Bienvenue !</p>
                <p className="text-[14px]" style={{ color: C.gray4 }}>Notre équipe vous contacte sous 24h.</p>
                <button onClick={() => { setShowForm(false); setDone(false) }} className="mt-6 px-6 py-2.5 rounded-full text-[14px] font-bold text-white" style={{ background: C.blue }}>Fermer</button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  )
}

/* ── WHY CARD (composant séparé pour les hooks) ──────────────────────── */
function WhyCard({ icon, badge, title, desc, href, cta, accent, bg, delay }: {
  icon: string; badge: string; title: string; desc: string; href: string; cta: string; accent: string; bg: string; delay: number
}) {
  const ref = useFadeIn(delay)
  return (
    <div ref={ref} className="group rounded-[28px] p-8 flex flex-col justify-between transition-all hover:shadow-xl hover:-translate-y-1" style={{ background: bg, minHeight: '320px' }}>
      <div>
        <span className="text-[40px] block mb-4">{icon}</span>
        <span className="text-[11px] font-bold tracking-widest uppercase" style={{ color: accent }}>{badge}</span>
        <h3 className="mt-3 font-black leading-tight whitespace-pre-line" style={{ fontSize: '22px', color: C.black }}>{title}</h3>
        <p className="mt-3 text-[14px] leading-relaxed" style={{ color: C.gray4 }}>{desc}</p>
      </div>
      <Link href={href} className="mt-8 inline-flex items-center gap-2 text-[14px] font-bold no-underline" style={{ color: accent }}>
        {cta} →
      </Link>
    </div>
  )
}

function WhySection() {
  const ref = useFadeIn()
  return (
    <section style={{ background: C.white, padding: '100px 0' }}>
      <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
        <div ref={ref}>
          <SectionLabel>Pourquoi Caractère ?</SectionLabel>
          <h2 className="font-black tracking-tight mb-14" style={{ fontSize: 'clamp(30px,4vw,48px)', color: C.black, letterSpacing: '-0.02em', maxWidth: '600px' }}>
            Tout ce dont vous avez besoin,<br />au même endroit.
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <WhyCard icon="🚀" badge="Print on Demand" title={"Vous vendez.\nNous fabriquons."} desc="Créez votre boutique, uploadez vos designs. Chaque commande est produite et expédiée directement. Zéro stock, zéro risque." href="/designer" cta="Lancer ma marque" accent={C.blue} bg={C.blueLt} delay={0} />
          <WhyCard icon="🏢" badge="Entreprise" title={"Configurez en\nquelques minutes."} desc="Uniformes, tenues d'équipe, goodies corporate. Choisissez vos produits, ajoutez votre logo, recevez votre devis." href="/configurateur" cta="Configurer ma commande" accent={C.black} bg={C.gray1} delay={80} />
          <WhyCard icon="👕" badge="Collection" title={"Des pièces premium\nprêtes à porter."} desc="La collection Caractère : t-shirts oversized 250GSM, hoodies, casquettes. Des éditions limitées fabriquées en Algérie." href="/collection" cta="Voir la collection" accent={C.blue} bg="#F0F4FF" delay={160} />
        </div>
      </div>
    </section>
  )
}

/* ── HOW IT WORKS STEP (composant séparé) ────────────────────────────── */
function HowStep({ n, icon, title, desc, delay, isMiddle }: { n: number; icon: string; title: string; desc: string; delay: number; isMiddle: boolean }) {
  const ref = useFadeIn(delay)
  return (
    <div ref={ref} className="text-center">
      <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 text-[32px]"
        style={{ background: C.white, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: `2px solid ${isMiddle ? C.blue : C.gray2}` }}>
        {icon}
        <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full text-[11px] font-black text-white flex items-center justify-center" style={{ background: C.blue }}>{n}</span>
      </div>
      <h3 className="font-bold text-[18px] mb-3" style={{ color: C.black }}>{title}</h3>
      <p className="text-[14px] leading-relaxed" style={{ color: C.gray4 }}>{desc}</p>
    </div>
  )
}

function HowItWorksSection() {
  const ref = useFadeIn()
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
          <div className="hidden lg:block absolute top-10 left-[16.66%] right-[16.66%] h-px" style={{ background: `linear-gradient(90deg, ${C.gray2}, ${C.blue}60, ${C.gray2})` }} />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <HowStep n={1} icon="🛍️" title="Choisissez vos produits" desc="T-shirts, polos, hoodies, casquettes, totebags — un catalogue de produits textile premium." delay={0} isMiddle={false} />
            <HowStep n={2} icon="🎨" title="Ajoutez votre design" desc="Uploadez votre logo via le Designer ou configurez votre commande. Notre équipe adapte votre design." delay={100} isMiddle={true} />
            <HowStep n={3} icon="🚚" title="Nous produisons & livrons" desc="Production en 48h dans notre atelier à Alger. Expédition nationale. Suivi en temps réel." delay={200} isMiddle={false} />
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── PRODUIT CARD (composant séparé) ─────────────────────────────────── */
function ProduitCard({ icon, nom, badge, prix, tag, href, delay }: {
  icon: string; nom: string; badge: string; prix: number; tag: string | null; href: string; delay: number
}) {
  const ref = useFadeIn(delay)
  return (
    <div ref={ref} className="group rounded-[24px] border overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1" style={{ background: C.white, borderColor: C.gray2 }}>
      <div className="relative aspect-square flex items-center justify-center text-[72px]" style={{ background: C.gray1 }}>
        {tag && <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold text-white" style={{ background: C.blue }}>{tag}</span>}
        {icon}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-bold text-[15px]" style={{ color: C.black }}>{nom}</p>
            <p className="text-[12px] mt-0.5" style={{ color: C.gray3 }}>{badge}</p>
          </div>
          <div className="text-right">
            <p className="font-black text-[16px]" style={{ color: C.black }}>{prix.toLocaleString('fr-FR')}</p>
            <p className="text-[11px]" style={{ color: C.gray3 }}>DA / pièce</p>
          </div>
        </div>
        <Link href={href} className="mt-4 w-full flex items-center justify-center py-2.5 rounded-xl text-[13px] font-bold no-underline transition-all" style={{ background: C.gray1, color: C.black }}>
          Personnaliser →
        </Link>
      </div>
    </div>
  )
}

function ProduitsSection() {
  const ref = useFadeIn()
  const products = [
    { icon: '👕', nom: 'T-shirt Premium', badge: '250 GSM', prix: 1800, tag: 'Bestseller', id: 'tshirt' },
    { icon: '👕', nom: 'T-shirt Oversized', badge: '250 GSM', prix: 3200, tag: 'Premium', id: 'tshirt_oversized' },
    { icon: '👔', nom: 'Polo', badge: 'Piqué coton', prix: 2200, tag: null, id: 'polo' },
    { icon: '🧥', nom: 'Hoodie', badge: 'Heavy fleece', prix: 3800, tag: 'Populaire', id: 'hoodie' },
    { icon: '🧢', nom: 'Casquette', badge: 'Structured', prix: 1500, tag: null, id: 'casquette' },
    { icon: '👜', nom: 'Tote Bag', badge: 'Canvas premium', prix: 1200, tag: null, id: 'totebag' },
  ]
  return (
    <section style={{ background: C.white, padding: '100px 0' }}>
      <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
        <div ref={ref} className="flex items-end justify-between mb-12 flex-wrap gap-4">
          <div>
            <SectionLabel>Catalogue</SectionLabel>
            <h2 className="font-black tracking-tight" style={{ fontSize: 'clamp(30px,4vw,48px)', color: C.black, letterSpacing: '-0.02em' }}>Produits populaires.</h2>
          </div>
          <Link href="/#produits" className="text-[14px] font-bold no-underline" style={{ color: C.blue }}>Voir tout →</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
          {products.map((p, i) => (
            <ProduitCard key={p.id} icon={p.icon} nom={p.nom} badge={p.badge} prix={p.prix} tag={p.tag} href={`/designer?product=${p.id}`} delay={i * 60} />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── FEATURE CARD (composant séparé) ─────────────────────────────────── */
function FeatureCard({ icon, title, desc, delay }: { icon: string; title: string; desc: string; delay: number }) {
  const ref = useFadeIn(delay)
  return (
    <div ref={ref} className="rounded-[24px] p-6 transition-all hover:scale-[1.02]"
      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
      <span className="text-[32px] block mb-4">{icon}</span>
      <h3 className="font-bold text-[16px] text-white mb-2">{title}</h3>
      <p className="text-[14px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>{desc}</p>
    </div>
  )
}

function FeaturesSection() {
  const ref = useFadeIn()
  const features = [
    { icon: '⚡', title: 'Production en 48h', desc: 'Votre commande produite et prête à expédier en 48 heures ouvrables.' },
    { icon: '📦', title: "À partir d'1 pièce", desc: 'Pas de minimum. Commandez 1 pièce ou 10 000, le même prix dégressif.' },
    { icon: '🧵', title: 'Broderie premium', desc: 'Machines professionnelles, fils haute qualité, rendu 3D impeccable.' },
    { icon: '🖨️', title: 'DTF haute qualité', desc: "Impression jusqu'à 60cm. Couleurs vives, lavable et durable." },
    { icon: '🚚', title: 'Expédition nationale', desc: 'Livraison dans toute l\'Algérie. Retrait atelier disponible.' },
    { icon: '✅', title: 'Contrôle qualité', desc: 'Chaque pièce vérifiée. Non-conforme = reprise gratuite.' },
  ]
  return (
    <section style={{ background: C.black, padding: '100px 0' }}>
      <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
        <div ref={ref} className="text-center mb-16">
          <SectionLabel>Nos engagements</SectionLabel>
          <h2 className="font-black tracking-tight text-white" style={{ fontSize: 'clamp(30px,4vw,48px)', letterSpacing: '-0.02em' }}>Pourquoi nous choisir.</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => <FeatureCard key={f.title} icon={f.icon} title={f.title} desc={f.desc} delay={i * 60} />)}
        </div>
      </div>
    </section>
  )
}

function StatsSection() {
  const ref = useFadeIn()
  return (
    <section style={{ background: C.white, padding: '80px 0', borderTop: `1px solid ${C.gray2}`, borderBottom: `1px solid ${C.gray2}` }}>
      <div ref={ref} className="max-w-[1200px] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {[
            { value: '50 000+', label: 'Produits fabriqués' },
            { value: '500+', label: 'Marques & entreprises' },
            { value: '48h', label: 'Délai de production' },
            { value: '4.9★', label: 'Avis clients' },
          ].map(s => (
            <div key={s.label}>
              <p className="font-black tracking-tight" style={{ fontSize: 'clamp(36px,5vw,56px)', color: C.blue, letterSpacing: '-0.03em' }}>{s.value}</p>
              <p className="mt-2 text-[14px]" style={{ color: C.gray4 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── TESTIMONIAL CARD (composant séparé) ─────────────────────────────── */
function TestimonialCard({ init, name, role, company, text, delay }: {
  init: string; name: string; role: string; company: string; text: string; delay: number
}) {
  const ref = useFadeIn(delay)
  return (
    <div ref={ref} className="rounded-[24px] p-7 border transition-all hover:shadow-lg" style={{ background: C.white, borderColor: C.gray2 }}>
      <div className="flex gap-0.5 mb-5">{[...Array(5)].map((_, j) => <span key={j} style={{ color: '#F59E0B' }}>★</span>)}</div>
      <p className="text-[15px] leading-relaxed mb-6" style={{ color: '#374151' }}>"{text}"</p>
      <div className="flex items-center gap-3 pt-5" style={{ borderTop: `1px solid ${C.gray2}` }}>
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-[14px] font-black text-white flex-shrink-0" style={{ background: `linear-gradient(135deg, ${C.blue}, #7C3AED)` }}>{init}</div>
        <div>
          <p className="font-bold text-[14px]" style={{ color: C.black }}>{name}</p>
          <p className="text-[12px]" style={{ color: C.gray3 }}>{role} — {company}</p>
        </div>
      </div>
    </div>
  )
}

function TestimonialsSection() {
  const ref = useFadeIn()
  const testimonials = [
    { init: 'K', name: 'Karim B.', role: 'Gérant', company: 'Restaurant El Kef', text: '80 polos brodés pour notre équipe de salle. Rendu impeccable, délai respecté, suivi WhatsApp rassurant. On recommande sans hésiter.' },
    { init: 'S', name: 'Samira M.', role: 'Directrice', company: 'Clinique Al Chifa', text: 'Blouses brodées pour toute notre équipe médicale. La qualité du tissu et la précision sur le logo sont vraiment au-dessus de nos attentes.' },
    { init: 'Y', name: 'Yacine O.', role: 'Directeur', company: 'BTP Construct', text: '120 gilets de chantier en 5 jours. Troisième commande chez Caractère — la régularité et le sérieux sont là à chaque fois.' },
    { init: 'L', name: 'Lina K.', role: 'Fondatrice', company: 'Brand Vert', text: "J'ai lancé ma marque de t-shirts sans stock grâce à Caractère. Le designer est simple, la qualité est premium. Mes clients adorent." },
  ]
  return (
    <section style={{ background: C.gray1, padding: '100px 0' }}>
      <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
        <div ref={ref} className="text-center mb-14">
          <SectionLabel>Témoignages</SectionLabel>
          <h2 className="font-black tracking-tight" style={{ fontSize: 'clamp(30px,4vw,48px)', color: C.black, letterSpacing: '-0.02em' }}>Ils nous font confiance.</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {testimonials.map((t, i) => <TestimonialCard key={t.name} {...t} delay={i * 80} />)}
        </div>
      </div>
    </section>
  )
}

function CtaSection() {
  const ref = useFadeIn()
  return (
    <section style={{ background: C.white, padding: '100px 0' }}>
      <div className="max-w-[900px] mx-auto px-6 lg:px-10 text-center">
        <div ref={ref} className="rounded-[32px] p-12 md:p-16" style={{ background: `linear-gradient(135deg, ${C.black} 0%, #1a1a2e 100%)` }}>
          <Badge>Démarrez aujourd'hui</Badge>
          <h2 className="mt-6 font-black tracking-tight text-white" style={{ fontSize: 'clamp(28px,4vw,44px)', letterSpacing: '-0.02em' }}>
            Prêt à lancer votre marque<br />ou habiller votre équipe ?
          </h2>
          <p className="mt-4 text-[16px] mb-10" style={{ color: 'rgba(255,255,255,0.6)' }}>Devis gratuit · Réponse en 2h · Livraison nationale</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/configurateur" className="px-8 py-4 rounded-full text-[16px] font-bold text-white no-underline transition-all hover:-translate-y-0.5" style={{ background: C.blue, boxShadow: `0 8px 24px ${C.blue}50` }}>
              Configurer ma commande →
            </Link>
            <a href="https://wa.me/213557440522" target="_blank" rel="noopener noreferrer" className="px-8 py-4 rounded-full text-[16px] font-bold no-underline border-2" style={{ borderColor: 'rgba(255,255,255,0.3)', color: 'white', background: 'rgba(255,255,255,0.08)' }}>
              WhatsApp direct
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer style={{ background: C.black, padding: '60px 0 40px' }}>
      <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <p className="font-black text-white text-[20px] mb-3">Caractère</p>
            <p className="text-[13px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.4)' }}>Fabrication textile premium en Algérie. Broderie, DTF, Print on Demand.</p>
          </div>
          {[
            { title: 'Produits', links: [{ label: 'Print on Demand', href: '/designer' },{ label: 'Configurateur', href: '/configurateur' },{ label: 'Entreprise', href: '/configurateur' },{ label: 'Collection', href: '/collection' },{ label: 'Catalogue', href: '/catalogue' }]},
            { title: 'Support', links: [{ label: 'Contact', href: '/#contact' },{ label: 'FAQ', href: '/#faq' },{ label: 'Suivi commande', href: '/suivi' },{ label: 'WhatsApp', href: 'https://wa.me/213557440522' }]},
            { title: 'Réseaux', links: [{ label: 'Instagram', href: 'https://instagram.com/caractere.store' },{ label: 'TikTok', href: '#' },{ label: 'Facebook', href: '#' }]},
          ].map(col => (
            <div key={col.title}>
              <p className="text-white font-bold text-[14px] mb-4">{col.title}</p>
              <div className="flex flex-col gap-2.5">
                {col.links.map(l => (
                  <a key={l.label} href={l.href} className="text-[13px] no-underline transition-colors hover:text-white" style={{ color: 'rgba(255,255,255,0.4)' }}>{l.label}</a>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4 pt-8" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <p className="text-[12px]" style={{ color: 'rgba(255,255,255,0.3)' }}>© 2025 Caractère Store · Alger, Algérie</p>
          <p className="text-[12px]" style={{ color: 'rgba(255,255,255,0.3)' }}>@caractere.store · 297K abonnés</p>
        </div>
      </div>
    </footer>
  )
}

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
      <WhySection />
      <HowItWorksSection />
      <ProduitsSection />
      <FeaturesSection />
      <StatsSection />
      <TestimonialsSection />
      <CtaSection />
      <Footer />
    </>
  )
}
