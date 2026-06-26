import Link from 'next/link'
import type { Produit } from '@/types'

const BLUE_DARK = '#0C4A6E'
const BLUE_MID = '#1E6FA8'
const BLUE_LIGHT = '#38BDF8'
const BLUE_PALE = '#EFF6FF'
const BLUE_MUTED = '#BAE6FD'

// ── MARQUEE ──
export function MarqueeStrip() {
  const items = ['BRODERIE PREMIUM','DTF 60CM','PERSONNALISATION TEXTILE','LIVRAISON NATIONALE','DEVIS GRATUIT','QUALITE GARANTIE','ALGER','1 PIECE MIN']
  const doubled = [...items, ...items]
  return (
    <div className="overflow-hidden whitespace-nowrap py-3 border-t border-b" style={{ backgroundColor: BLUE_DARK, borderColor: 'rgba(255,255,255,0.1)' }}>
      <div className="inline-flex gap-9 animate-marquee">
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center gap-9 flex-shrink-0">
            <span className="text-[11px] font-semibold tracking-widest" style={{ color: BLUE_MUTED }}>{item}</span>
            <span style={{ color: BLUE_LIGHT }}>✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}

// ── SERVICES ──
export function ServicesSection() {
  const services = [
    { icon: '🧵', name: 'Broderie machine', desc: "Logos nets, tenus dans le temps. Rendu 3D premium sur tous textiles.", accent: '#0C4A6E' },
    { icon: '🖨️', name: 'Impression DTF', desc: "Designs full color jusqu'a 60cm. Ideal pour motifs complexes.", accent: '#1E6FA8' },
    { icon: '👔', name: 'Uniformes complets', desc: "De la conception a la livraison. Prise en charge totale de votre projet.", accent: '#38BDF8' },
    { icon: '🎨', name: 'Personnalisation', desc: "Adaptation de votre charte graphique. Vectorisation gratuite.", accent: '#0C4A6E' },
    { icon: '📦', name: 'Commandes B2B', desc: "A partir de 1 piece, jusqu'a 10 000. Tarifs degressifs.", accent: '#1E6FA8' },
    { icon: '🚚', name: 'Livraison nationale', desc: "Retrait atelier ou envoi partout en Algerie via partenaires.", accent: '#38BDF8' },
  ]
  return (
    <section id="services" className="py-20 px-6 bg-white">
      <div className="max-w-[980px] mx-auto">
        <div className="mb-12">
          <span className="inline-block text-[11px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full mb-4"
            style={{ backgroundColor: BLUE_PALE, color: BLUE_DARK }}>
            Nos services
          </span>
          <h2 className="text-[clamp(28px,4vw,46px)] font-bold tracking-tight leading-[1.06]" style={{ color: BLUE_DARK }}>
            Tout pour habiller<br />votre equipe.
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((s, i) => (
            <div key={i} className="rounded-2xl p-6 border transition-all hover:shadow-md"
              style={{ borderColor: 'rgba(12,74,110,0.08)', backgroundColor: i % 3 === 1 ? BLUE_PALE : '#fff' }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4"
                style={{ backgroundColor: i % 3 === 1 ? '#DBEAFE' : BLUE_PALE }}>
                {s.icon}
              </div>
              <h3 className="text-[16px] font-bold mb-2" style={{ color: BLUE_DARK }}>{s.name}</h3>
              <p className="text-[13px] leading-relaxed" style={{ color: '#6B7280' }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── PRODUITS ──

// Map nom produit → id designer
const DESIGNER_IDS: Record<string, string> = {
  'T-shirt':               'tshirt',
  'T-shirt Oversized 250GSM': 'tshirt',
  'Polo':                  'polo',
  'Gilet de travail':      'gilet',
  'Gilet de securite':     'gilet_securite',
  'Casquette':             'casquette',
  'Totebag':               'totebag',
  'Tablier':               'tablier',
}

export function ProduitsSection({ produits }: { produits: Produit[] }) {
  const BASE = 'https://aijlvbipvqnvbywxhlbd.supabase.co/storage/v1/object/public/image'
  const imgs: Record<string, string> = {
    'T-shirt': BASE + '/IMG_5850.jpeg',
    'T-shirt Oversized 250GSM': BASE + '/tshirt-oversized.jpeg',
    'Polo': BASE + '/IMG_5851.jpeg',
    'Casquette': BASE + '/IMG_5853.jpeg',
    'Totebag': BASE + '/IMG_5854.jpeg',
    'Gilet de travail': BASE + '/IMG_5852.jpeg',
    'Gilet de securite': BASE + '/IMG_5852.jpeg',
    'Tablier': BASE + '/IMG_5850.jpeg',
  }

  return (
    <section id="produits" className="py-20 px-6" style={{ backgroundColor: '#F0F9FF' }}>
      <div className="max-w-[980px] mx-auto">
        <div className="mb-10">
          <span className="inline-block text-[11px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full mb-4"
            style={{ backgroundColor: BLUE_PALE, color: BLUE_DARK }}>
            Produits
          </span>
          <h2 className="text-[clamp(28px,4vw,46px)] font-bold tracking-tight leading-[1.06]" style={{ color: BLUE_DARK }}>
            Les essentiels<br />de l uniforme.
          </h2>
        </div>

        {/* Badges */}
        <div className="flex gap-3 flex-wrap mb-8">
          {['Livraison nationale', 'Devis gratuit', 'Qualite garantie'].map((item) => (
            <span key={item} className="flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-semibold border"
              style={{ backgroundColor: '#fff', borderColor: 'rgba(12,74,110,0.15)', color: BLUE_DARK }}>
              <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                style={{ backgroundColor: BLUE_DARK }}>✓</span>
              {item}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {produits.map(p => {
            const designerId = DESIGNER_IDS[p.nom]
            return (
              <div key={p.id} className="rounded-2xl overflow-hidden border bg-white transition-all hover:shadow-lg hover:-translate-y-0.5"
                style={{ borderColor: 'rgba(12,74,110,0.08)' }}>

                {/* Image */}
                <div className="w-full aspect-square overflow-hidden" style={{ backgroundColor: '#F0F9FF' }}>
                  <img src={imgs[p.nom] || BASE + '/IMG_5509.png'} alt={p.nom} className="w-full h-full object-cover" />
                </div>

                <div className="p-4">
                  <div className="text-[15px] font-bold mb-1" style={{ color: BLUE_DARK }}>{p.nom}</div>
                  <p className="text-[12px] mb-3 leading-relaxed" style={{ color: '#6B7280' }}>{p.description}</p>

                  <div className="text-[18px] font-bold mb-3" style={{ color: BLUE_DARK }}>
                    {p.prix_base.toLocaleString('fr-FR')} DA
                    <span className="text-[11px] font-normal ml-1" style={{ color: '#9CA3AF' }}>/piece</span>
                  </div>

                  {/* Boutons */}
                  <div className="flex gap-2">
                    <Link
                      href="/configurateur"
                      className="flex-1 text-center text-[12px] font-semibold px-3 py-2 rounded-full no-underline transition-all"
                      style={{ backgroundColor: BLUE_PALE, color: BLUE_DARK }}
                    >
                      Configurer →
                    </Link>
                    {designerId && (
                      <Link
                        href={`/designer?product=${designerId}`}
                        className="flex-1 text-center text-[12px] font-semibold px-3 py-2 rounded-full no-underline transition-all text-white"
                        style={{ backgroundColor: BLUE_DARK }}
                      >
                        ✏️ Designer
                      </Link>
                    )}
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

// ── PROCESS ──
export function ProcessSection() {
  const steps = [
    { n: '1', t: 'Devis gratuit', d: 'Envoyez votre logo et quantites. Reponse sous 24h.' },
    { n: '2', t: 'Validation maquette', d: 'On adapte votre design pour un rendu optimal.' },
    { n: '3', t: 'Production atelier', d: 'Fabrication avec controle qualite a chaque etape.' },
    { n: '4', t: 'Livraison', d: 'Expedition nationale ou retrait a l atelier Alger.' },
  ]
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-[980px] mx-auto text-center">
        <span className="inline-block text-[11px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full mb-4"
          style={{ backgroundColor: BLUE_PALE, color: BLUE_DARK }}>
          Comment ca marche
        </span>
        <h2 className="text-[clamp(28px,4vw,46px)] font-bold tracking-tight leading-[1.06] mb-14" style={{ color: BLUE_DARK }}>
          De la commande<br />a la livraison.
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 relative">
          <div className="hidden md:block absolute top-6 left-[12%] right-[12%] h-px"
            style={{ background: `linear-gradient(90deg, ${BLUE_DARK}, ${BLUE_LIGHT})` }} />
          {steps.map((s, i) => (
            <div key={s.n} className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-[15px] font-bold text-white mb-4 relative z-10 shadow-lg"
                style={{ background: `linear-gradient(135deg, ${BLUE_DARK}, ${BLUE_LIGHT})` }}>
                {s.n}
              </div>
              <h4 className="text-[14px] font-bold mb-2" style={{ color: BLUE_DARK }}>{s.t}</h4>
              <p className="text-[12px] leading-relaxed" style={{ color: '#6B7280' }}>{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── WHY ──
export function WhySection() {
  const items = [
    { n: '01', t: 'Atelier propre a Alger', d: '3 machines a broder, 2 imprimantes DTF. Aucun intermediaire.' },
    { n: '02', t: 'Resultat garanti', d: 'Toute commande non-conforme est reprise sans frais.' },
    { n: '03', t: 'A partir de 1 piece', d: "Petites commandes ou grandes entreprises — on s adapte." },
    { n: '04', t: 'Suivi WhatsApp en temps reel', d: 'Pas de silence, pas de surprise.' },
  ]
  const stats = [
    { n: '297K', l: 'Abonnes Instagram' },
    { n: '5+', l: "Ans d activite" },
    { n: '20+', l: 'Employes' },
    { n: '3-5j', l: 'Delai production' },
  ]
  return (
    <section className="py-20 px-6" style={{ backgroundColor: '#F0F9FF' }}>
      <div className="max-w-[980px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
          <div>
            <span className="inline-block text-[11px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full mb-4"
              style={{ backgroundColor: BLUE_PALE, color: BLUE_DARK }}>
              Pourquoi Caractere
            </span>
            <h2 className="text-[clamp(28px,4vw,46px)] font-bold tracking-tight leading-[1.06] mb-8" style={{ color: BLUE_DARK }}>
              La difference<br />qui compte.
            </h2>
            <div className="flex flex-col gap-0">
              {items.map((item, i) => (
                <div key={item.n} className="flex gap-4 py-5 border-b"
                  style={{ borderColor: 'rgba(12,74,110,0.08)' }}>
                  <span className="text-[11px] font-bold mt-0.5 w-6 flex-shrink-0"
                    style={{ color: BLUE_LIGHT }}>{item.n}</span>
                  <div>
                    <h4 className="text-[15px] font-bold mb-1" style={{ color: BLUE_DARK }}>{item.t}</h4>
                    <p className="text-[13px] leading-relaxed" style={{ color: '#6B7280' }}>{item.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden border" style={{ borderColor: 'rgba(12,74,110,0.1)' }}>
            <div className="p-6 text-white" style={{ background: `linear-gradient(165deg, ${BLUE_DARK}, ${BLUE_LIGHT})` }}>
              <p className="text-[12px] font-semibold uppercase tracking-widest mb-4" style={{ color: BLUE_MUTED }}>En chiffres</p>
              <div className="grid grid-cols-2 gap-4">
                {stats.map(s => (
                  <div key={s.l} className="rounded-xl p-4" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                    <div className="text-[30px] font-bold leading-none text-white">{s.n}</div>
                    <div className="text-[11px] mt-1" style={{ color: BLUE_MUTED }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-5 bg-white">
              <p className="text-[11px] font-bold uppercase tracking-widest mb-3" style={{ color: '#9CA3AF' }}>Notre equipement</p>
              <div className="flex flex-wrap gap-2">
                {['Brother Pro', 'DTF 60cm i3200', 'DTF 42cm XP600', 'Encres premium'].map(c => (
                  <span key={c} className="px-3 py-1.5 rounded-full text-[12px] font-medium border"
                    style={{ backgroundColor: BLUE_PALE, color: BLUE_DARK, borderColor: 'rgba(12,74,110,0.15)' }}>
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── SECTEURS ──
export function SecteursSection() {
  const s = [
    { e: '🍽️', n: 'Restauration & Hotellerie', d: 'Tabliers, polos et uniformes de service.' },
    { e: '🏥', n: 'Sante & Cliniques', d: 'Blouses et tenues medicales brodees.' },
    { e: '🏗️', n: 'BTP & Construction', d: 'Gilets, t-shirts et vestes de chantier.' },
    { e: '🏪', n: 'Commerce & Retail', d: "Uniformes vendeurs et tenues d equipe." },
    { e: '🎓', n: 'Education', d: 'Tenues scolaires, clubs et associations.' },
    { e: '⚽', n: 'Sport & Evenements', d: 'Maillots et kits complets pour equipes.' },
    { e: '🏭', n: 'Industrie', d: 'Vetements de travail avec signaletique.' },
    { e: '💼', n: 'Corporate', d: 'Polos premium pour equipes commerciales.' },
  ]
  return (
    <section id="secteurs" className="py-20 px-6 bg-white">
      <div className="max-w-[980px] mx-auto">
        <div className="mb-12">
          <span className="inline-block text-[11px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full mb-4"
            style={{ backgroundColor: BLUE_PALE, color: BLUE_DARK }}>
            B2B
          </span>
          <h2 className="text-[clamp(28px,4vw,46px)] font-bold tracking-tight leading-[1.06]" style={{ color: BLUE_DARK }}>
            Nous equipons<br />votre secteur.
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {s.map((sec, i) => (
            <div key={i} className="rounded-2xl p-5 border transition-all hover:shadow-md hover:-translate-y-0.5 cursor-default"
              style={{
                borderColor: 'rgba(12,74,110,0.08)',
                backgroundColor: i % 4 === 0 ? BLUE_PALE : '#fff'
              }}>
              <span className="text-2xl mb-3 block">{sec.e}</span>
              <h4 className="text-[13px] font-bold mb-1.5" style={{ color: BLUE_DARK }}>{sec.n}</h4>
              <p className="text-[12px] leading-relaxed" style={{ color: '#6B7280' }}>{sec.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── TESTIMONIALS ──
export function TestimonialsSection() {
  const t = [
    { i: 'K', n: 'Karim B.', r: 'Gerant', c: 'Restaurant El Kef', txt: '80 polos brodes pour notre equipe de salle. Rendu impeccable, delai respecte, suivi WhatsApp rassurant. On recommande sans hesiter.' },
    { i: 'S', n: 'Samira M.', r: 'Directrice', c: 'Clinique Al Chifa', txt: "Blouses brodees pour toute notre equipe medicale. La qualite du tissu et la precision sur le logo sont vraiment au-dessus de nos attentes." },
    { i: 'Y', n: 'Yacine O.', r: 'Directeur', c: 'BTP Construct', txt: '120 gilets de chantier en 5 jours. Troisieme commande chez Caractere — la regularite et le serieux sont la a chaque fois.' },
  ]
  return (
    <section id="avis" className="py-20 px-6" style={{ backgroundColor: '#F0F9FF' }}>
      <div className="max-w-[980px] mx-auto">
        <div className="mb-12">
          <span className="inline-block text-[11px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full mb-4"
            style={{ backgroundColor: BLUE_PALE, color: BLUE_DARK }}>
            Temoignages
          </span>
          <h2 className="text-[clamp(28px,4vw,46px)] font-bold tracking-tight leading-[1.06]" style={{ color: BLUE_DARK }}>
            Ils nous font<br />confiance.
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {t.map((tm, i) => (
            <div key={i} className="rounded-2xl p-6 border bg-white transition-all hover:shadow-md"
              style={{ borderColor: 'rgba(12,74,110,0.08)' }}>
              <div className="flex gap-0.5 mb-4">
                {[...Array(5)].map((_, j) => (
                  <span key={j} className="text-sm" style={{ color: BLUE_LIGHT }}>★</span>
                ))}
              </div>
              <p className="text-[13px] leading-relaxed mb-5 flex-1" style={{ color: '#374151' }}>{tm.txt}</p>
              <div className="flex items-center gap-3 pt-4 border-t" style={{ borderColor: 'rgba(12,74,110,0.06)' }}>
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-bold text-white flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${BLUE_DARK}, ${BLUE_LIGHT})` }}>
                  {tm.i}
                </div>
                <div>
                  <div className="text-[13px] font-bold" style={{ color: BLUE_DARK }}>{tm.n}</div>
                  <div className="text-[11px]" style={{ color: '#9CA3AF' }}>{tm.r} — {tm.c}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── CTA DARK ──
export function CtaDarkSection() {
  return (
    <section className="py-20 px-6 text-center text-white"
      style={{ background: `linear-gradient(165deg, ${BLUE_DARK} 0%, ${BLUE_MID} 100%)` }}>
      <div className="max-w-[600px] mx-auto">
        <span className="inline-block text-[11px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full mb-5"
          style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: BLUE_MUTED }}>
          Pret a demarrer ?
        </span>
        <h2 className="text-[clamp(28px,4vw,46px)] font-bold tracking-tight leading-[1.06] text-white mb-4">
          Habillons vos<br />equipes ensemble.
        </h2>
        <p className="text-[16px] mb-10 leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>
          Simulation et devis gratuits. Sans engagement.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link href="/configurateur"
            className="rounded-full px-7 py-3.5 text-[15px] font-semibold no-underline transition-all hover:opacity-90"
            style={{ backgroundColor: '#fff', color: BLUE_DARK }}>
            Configurer ma commande
          </Link>
          <a href="https://wa.me/213557440522"
            className="rounded-full px-7 py-3.5 text-[15px] font-semibold no-underline border-2 transition-all"
            style={{ borderColor: 'rgba(255,255,255,0.4)', color: '#fff', backgroundColor: 'rgba(255,255,255,0.08)' }}
            target="_blank" rel="noopener noreferrer">
            WhatsApp direct
          </a>
        </div>
      </div>
    </section>
  )
}

// ── CONTACT ──
export function ContactSection() {
  return (
    <section id="contact" className="py-20 px-6 bg-white">
      <div className="max-w-[980px] mx-auto">
        <div className="mb-10">
          <span className="inline-block text-[11px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full mb-4"
            style={{ backgroundColor: BLUE_PALE, color: BLUE_DARK }}>
            Contact
          </span>
          <h2 className="text-[clamp(28px,4vw,46px)] font-bold tracking-tight leading-[1.06]" style={{ color: BLUE_DARK }}>
            Parlons de<br />votre projet.
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: '📱', title: 'WhatsApp', desc: 'Reponse sous 2h', link: 'https://wa.me/213557440522', cta: '0557 44 05 22' },
            { icon: '📍', title: 'Atelier', desc: 'Alger, Algerie', link: '#', cta: 'Voir sur la carte' },
            { icon: '📸', title: 'Instagram', desc: '297K abonnes', link: 'https://instagram.com/caractere.store', cta: '@caractere.store' },
          ].map((c, i) => (
            <a key={i} href={c.link} target="_blank" rel="noopener noreferrer"
              className="rounded-2xl p-6 border no-underline transition-all hover:shadow-md hover:-translate-y-0.5 block"
              style={{ borderColor: 'rgba(12,74,110,0.08)', backgroundColor: i === 0 ? BLUE_PALE : '#fff' }}>
              <div className="text-3xl mb-3">{c.icon}</div>
              <h3 className="text-[15px] font-bold mb-1" style={{ color: BLUE_DARK }}>{c.title}</h3>
              <p className="text-[12px] mb-2" style={{ color: '#9CA3AF' }}>{c.desc}</p>
              <p className="text-[13px] font-semibold" style={{ color: BLUE_MID }}>{c.cta}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── FAQ ──
export function FaqSection() {
  const faqs = [
    { q: 'Quel est le minimum de commande ?', r: 'A partir de 1 piece. Les tarifs sont degressifs a partir de 10, 50 et 100 pieces.' },
    { q: 'Quels formats de logo acceptez-vous ?', r: 'AI, EPS, SVG, PDF vectoriel. On vectorise gratuitement si vous n avez que du JPG/PNG.' },
    { q: 'Quel est le delai de production ?', r: '3 a 5 jours ouvres en standard. Commande urgente disponible sur demande.' },
    { q: 'Livrez-vous en dehors d Alger ?', r: 'Oui, livraison nationale via nos partenaires logistiques.' },
    { q: 'Peut-on voir un echantillon avant ?', r: 'Oui, nous pouvons produire 1 piece test avant validation de la commande entiere.' },
  ]
  return (
    <section className="py-20 px-6" style={{ backgroundColor: '#F0F9FF' }}>
      <div className="max-w-[700px] mx-auto">
        <div className="mb-10">
          <span className="inline-block text-[11px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full mb-4"
            style={{ backgroundColor: BLUE_PALE, color: BLUE_DARK }}>
            FAQ
          </span>
          <h2 className="text-[clamp(28px,4vw,46px)] font-bold tracking-tight leading-[1.06]" style={{ color: BLUE_DARK }}>
            Questions<br />frequentes.
          </h2>
        </div>
        <div className="flex flex-col gap-3">
          {faqs.map((f, i) => (
            <div key={i} className="rounded-2xl p-5 border bg-white"
              style={{ borderColor: 'rgba(12,74,110,0.08)' }}>
              <h4 className="text-[14px] font-bold mb-2" style={{ color: BLUE_DARK }}>{f.q}</h4>
              <p className="text-[13px] leading-relaxed" style={{ color: '#6B7280' }}>{f.r}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
