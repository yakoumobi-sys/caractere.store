import Link from 'next/link'
import type { Produit } from '@/types'

// ── HERO ──
export function HeroSection({ config }: { config: Record<string, string> }) {
  const titre = config['hero_titre'] ?? 'Habillez votre équipe. Faites-le bien.'
  const sous = config['hero_sous_titre'] ?? "Vêtements personnalisés, DTF, broderie — de 1 à 10 000 pièces. Simulation et devis gratuits."
  return (
    <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-32 pb-20 bg-white">
      <div className="w-[90px] h-[90px] bg-brand-dark rounded-[22px] flex items-center justify-center mb-11 mx-auto">
        <span className="text-white text-[28px] font-bold tracking-tight">C</span>
      </div>
      <span className="text-[13px] font-medium text-brand-gray mb-[18px] block">Personnalisation Textile — Alger</span>
      <h1 className="text-[clamp(42px,7vw,86px)] font-bold leading-[1.04] tracking-tight text-brand-dark max-w-[760px] mx-auto mb-[22px]">{titre}</h1>
      <p className="text-[19px] font-light text-brand-gray leading-relaxed max-w-[500px] mx-auto mb-11">{sous}</p>
      <div className="flex gap-3.5 justify-center flex-wrap mb-[72px]">
        <Link href="/configurateur" className="bg-brand-dark text-white px-7 py-3.5 rounded-full text-[15px] font-medium hover:bg-neutral-800 transition-colors no-underline">Configurer ma commande</Link>
        <a href="/#produits" className="bg-transparent text-brand-dark px-7 py-3.5 rounded-full text-[15px] font-medium border border-black/20 hover:border-black/50 transition-colors no-underline">Voir nos réalisations</a>
      </div>
      <div className="flex gap-14 justify-center flex-wrap pt-9 border-t border-black/[0.08] w-full max-w-[600px] mx-auto">
        {[{n:'297K',l:'Abonnés Instagram'},{n:'5+',l:"Ans d'activité"},{n:'3–5j',l:'Délai production'},{n:'1',l:'Pièce minimum'}].map(s => (
          <div key={s.l} className="text-center">
            <div className="text-[32px] font-bold tracking-tight leading-none">{s.n}</div>
            <div className="text-[12px] text-brand-gray mt-1">{s.l}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

// ── MARQUEE ──
export function MarqueeStrip() {
  const items = ['BRODERIE PREMIUM','DTF 60CM','PERSONNALISATION TEXTILE','LIVRAISON NATIONALE','DEVIS GRATUIT','QUALITÉ GARANTIE','ALGER','1 PIÈCE MIN']
  const doubled = [...items, ...items]
  return (
    <div className="bg-brand-light py-[11px] overflow-hidden whitespace-nowrap border-t border-b border-black/[0.06]">
      <div className="inline-flex gap-9 animate-marquee">
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center gap-9 flex-shrink-0">
            <span className="text-[12px] font-medium text-brand-gray tracking-[0.02em]">{item}</span>
            <span className="text-[#c8c8c8]">·</span>
          </span>
        ))}
      </div>
    </div>
  )
}

// ── SERVICES ──
export function ServicesSection() {
  const services = [
    {e:'🧵',n:'Broderie machine',d:"Logos nets, tenu dans le temps. Rendu 3D premium sur tous textiles."},
    {e:'🖨',n:'Impression DTF',d:"Designs full color jusqu'à 60cm. Idéal pour motifs complexes."},
    {e:'👔',n:'Uniformes complets',d:"De la conception à la livraison. Prise en charge totale de votre projet."},
    {e:'🎨',n:'Personnalisation',d:"Adaptation de votre charte graphique. Vectorisation gratuite."},
    {e:'📦',n:'Commandes B2B',d:"À partir de 1 pièce, jusqu'à 10 000. Tarifs dégressifs."},
    {e:'🚚',n:'Livraison nationale',d:"Retrait atelier ou envoi partout en Algérie via partenaires."},
  ]
  return (
    <section id="services" className="py-28 px-6">
      <div className="max-w-[980px] mx-auto">
        <span className="text-[11px] font-bold tracking-widest uppercase text-brand-gray block mb-3.5">Nos services</span>
        <h2 className="text-[clamp(30px,4.5vw,50px)] font-bold tracking-tight leading-[1.06] text-brand-dark">Tout pour habiller<br />votre équipe.</h2>
        <div className="apple-grid mt-14" style={{gridTemplateColumns:'repeat(3,1fr)'}}>
          {services.map((s,i) => (
            <div key={i} className="apple-grid-cell p-10">
              <span className="text-[32px] mb-[18px] block">{s.e}</span>
              <h3 className="text-[19px] font-semibold tracking-tight mb-2">{s.n}</h3>
              <p className="text-[14px] text-brand-gray leading-relaxed">{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── PRODUITS ──
export function ProduitsSection({ produits }: { produits: Produit[] }) {
  return (
    <section id="produits" className="py-28 px-6 bg-brand-light">
      <div className="max-w-[980px] mx-auto">
        <span className="text-[11px] font-bold tracking-widest uppercase text-brand-gray block mb-3.5">Produits</span>
        <h2 className="text-[clamp(30px,4.5vw,50px)] font-bold tracking-tight leading-[1.06] text-brand-dark">Les essentiels<br />de l uniforme.</h2>
        <div className="flex bg-white rounded-xl overflow-hidden mb-10 mt-8 border border-black/[0.06]">
          {['Livraison nationale','Devis gratuit','Qualite garantie'].map((item,i) => (
            <div key={i} className="flex-1 px-5 py-4 text-[13px] font-medium text-brand-dark flex items-center gap-2 border-r border-black/[0.06] last:border-r-0">
              <span className="bg-brand-dark text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full">ok</span>
              {item}
            </div>
          ))}
        </div>
        <div className="apple-grid" style={{gridTemplateColumns:'repeat(3,1fr)'}}>
          {produits.map(p => (
            <div key={p.id} className="apple-grid-cell flex flex-col">
              <div className="w-full aspect-square bg-brand-light flex items-center justify-center text-[64px]">{p.emoji}</div>
              <div className="p-5 pb-6 flex-1 flex flex-col bg-white">
                <div className="text-[16px] font-semibold tracking-tight mb-1">{p.nom}</div>
                <p className="text-[13px] text-brand-gray mb-4 flex-1 leading-relaxed">{p.description}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[20px] font-bold tracking-tight">{p.prix_base.toLocaleString('fr-FR')} DA</div>
                    <div className="text-[11px] text-brand-gray mt-0.5">/ piece</div>
                  </div>
                  <Link href="/configurateur" className="text-[13px] font-medium text-blue-600 no-underline hover:gap-2 transition-all">Configurer</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── PROCESS ──
export function ProcessSection() {
  const steps = [
    {n:'1',t:'Devis gratuit',d:'Envoyez votre logo et quantites. Reponse sous 24h.'},
    {n:'2',t:'Validation maquette',d:'On adapte votre design pour un rendu optimal.'},
    {n:'3',t:'Production atelier',d:'Fabrication avec controle qualite a chaque etape.'},
    {n:'4',t:'Livraison',d:"Expedition nationale ou retrait a l atelier Alger."},
  ]
  return (
    <section className="py-28 px-6">
      <div className="max-w-[980px] mx-auto text-center">
        <span className="text-[11px] font-bold tracking-widest uppercase text-brand-gray block mb-3.5">Comment ca marche</span>
        <h2 className="text-[clamp(30px,4.5vw,50px)] font-bold tracking-tight leading-[1.06] text-brand-dark">De la commande<br />a la livraison.</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mt-[72px] relative">
          <div className="hidden md:block absolute top-5 left-[10%] right-[10%] h-px bg-black/10" />
          {steps.map(s => (
            <div key={s.n} className="text-center">
              <div className="w-10 h-10 bg-brand-dark text-white rounded-full flex items-center justify-center text-[14px] font-bold mx-auto mb-[18px] relative z-10">{s.n}</div>
              <h4 className="text-[15px] font-semibold tracking-tight mb-1.5">{s.t}</h4>
              <p className="text-[13px] text-brand-gray leading-[1.55]">{s.d}</p>
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
    {n:'01',t:'Atelier propre a Alger',d:'3 machines a broder, 2 imprimantes DTF. Aucun intermediaire.'},
    {n:'02',t:'Resultat garanti',d:'Toute commande non-conforme est reprise sans frais.'},
    {n:'03',t:'A partir de 1 piece',d:"Petites commandes ou grandes entreprises — on s adapte."},
    {n:'04',t:'Suivi WhatsApp en temps reel',d:'Pas de silence, pas de surprise.'},
  ]
  return (
    <section className="py-28 px-6 bg-brand-light">
      <div className="max-w-[980px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[72px] items-center">
          <div>
            <span className="text-[11px] font-bold tracking-widest uppercase text-brand-gray block mb-3.5">Pourquoi Caractere</span>
            <h2 className="text-[clamp(30px,4.5vw,50px)] font-bold tracking-tight leading-[1.06] text-brand-dark">La difference<br />qui compte.</h2>
            <div className="flex flex-col mt-9">
              {items.map(item => (
                <div key={item.n} className="flex gap-[18px] py-6 border-b border-black/[0.07] first:border-t first:border-black/[0.07] items-start">
                  <span className="text-[12px] font-bold text-brand-gray min-w-[22px] mt-0.5">{item.n}</span>
                  <div><h4 className="text-[15px] font-semibold tracking-tight mb-0.5">{item.t}</h4><p className="text-[13px] text-brand-gray leading-relaxed">{item.d}</p></div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-[20px] p-11 border border-black/[0.06]">
            <div className="grid grid-cols-2 gap-[18px]">
              {[{n:'297K',l:'Abonnes Instagram'},{n:'5+',l:"Ans d activite"},{n:'40+',l:'Employes'},{n:'3-5j',l:'Delai production'}].map(s => (
                <div key={s.l} className="bg-brand-light rounded-[14px] p-6">
                  <div className="text-[36px] font-bold tracking-tight leading-none">{s.n}</div>
                  <div className="text-[12px] text-brand-gray mt-1.5">{s.l}</div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 mt-[18px]">
              {['Brother Pro','DTF 60cm i3200','DTF 42cm XP600','Encres premium'].map(c => (
                <span key={c} className="bg-brand-light rounded-full px-3.5 py-1.5 text-[12px] font-medium text-brand-dark border border-black/10">{c}</span>
              ))}
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
    {e:'🍽️',n:'Restauration & Hotellerie',d:'Tabliers, polos et uniformes de service.'},
    {e:'🏥',n:'Sante & Cliniques',d:'Blouses et tenues medicales brodees.'},
    {e:'🏗️',n:'BTP & Construction',d:'Gilets, t-shirts et vestes de chantier.'},
    {e:'🏪',n:'Commerce & Retail',d:"Uniformes vendeurs et tenues d equipe."},
    {e:'🎓',n:'Education',d:'Tenues scolaires, clubs et associations.'},
    {e:'⚽',n:'Sport & Evenements',d:'Maillots et kits complets pour equipes.'},
    {e:'🏭',n:'Industrie',d:'Vetements de travail avec signaletique.'},
    {e:'💼',n:'Corporate',d:'Polos premium pour equipes commerciales.'},
  ]
  return (
    <section id="secteurs" className="py-28 px-6">
      <div className="max-w-[980px] mx-auto">
        <span className="text-[11px] font-bold tracking-widest uppercase text-brand-gray block mb-3.5">B2B</span>
        <h2 className="text-[clamp(30px,4.5vw,50px)] font-bold tracking-tight leading-[1.06] text-brand-dark">Nous equipons<br />votre secteur.</h2>
        <div className="apple-grid mt-[52px]" style={{gridTemplateColumns:'repeat(4,1fr)'}}>
          {s.map((sec,i) => (
            <div key={i} className="apple-grid-cell p-7">
              <span className="text-[22px] mb-3 block">{sec.e}</span>
              <h4 className="text-[14px] font-semibold tracking-tight mb-1.5">{sec.n}</h4>
              <p className="text-[12px] text-brand-gray leading-relaxed">{sec.d}</p>
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
    {i:'K',n:'Karim B.',r:'Gerant',c:'Restaurant El Kef',txt:'80 polos brodes pour notre equipe de salle. Rendu impeccable, delai respecte, suivi WhatsApp rassurant. On recommande sans hesiter.'},
    {i:'S',n:'Samira M.',r:'Directrice',c:'Clinique Al Chifa',txt:"Blouses brodees pour toute notre equipe medicale. La qualite du tissu et la precision sur le logo sont vraiment au-dessus de nos attentes."},
    {i:'Y',n:'Yacine O.',r:'Directeur',c:'BTP Construct',txt:'120 gilets de chantier en 5 jours. Troisieme commande chez Caractere — la regularite et le serieux sont la a chaque fois.'},
  ]
  return (
    <section id="avis" className="py-28 px-6 bg-brand-light">
      <div className="max-w-[980px] mx-auto">
        <span className="text-[11px] font-bold tracking-widest uppercase text-brand-gray block mb-3.5">Temoignages</span>
        <h2 className="text-[clamp(30px,4.5vw,50px)] font-bold tracking-tight leading-[1.06] text-brand-dark">Ils nous font<br />confiance.</h2>
        <div className="apple-grid mt-[52px]" style={{gridTemplateColumns:'repeat(3,1fr)'}}>
          {t.map((tm,i) => (
            <div key={i} className="apple-grid-cell p-9">
              <div className="text-[12px] text-brand-dark tracking-[2px] mb-4">★★★★★</div>
              <p className="text-[14px] text-brand-dark leading-[1.7] mb-6 font-light">{tm.txt}</p>
              <div className="flex items-center gap-3">
                <div className="w-[34px] h-[34px] bg-brand-dark rounded-full flex items-center justify-center text-[13px] font-bold text-white flex-shrink-0">{tm.i}</div>
                <div><div className="text-[14px] font-semibold tracking-tight">{tm.n}</div><div className="text-[12px] text-brand-gray">{tm.r} — {tm.c}</div></div>
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
    <div className="bg-brand-dark py-28 px-6 text-center">
      <span className="text-[11px] font-bold tracking-widest uppercase text-white/45 block mb-3.5">Pret a demarrer ?</span>
      <h2 className="text-[clamp(30px,4.5vw,50px)] font-bold tracking-tight leading-[1.06] text-white max-w-[580px] mx-auto">Habillons vos<br />equipes ensemble.</h2>
      <p className="text-[17px] font-light text-white/45 mt-[18px] mb-10 mx-auto max-w-[400px] leading-relaxed">Simulation et devis gratuits. Sans engagement.</p>
      <div className="flex gap-3.5 justify-center flex-wrap">
        <Link href="/configurateur" className="bg-white text-brand-dark px-7 py-3.5 rounded-full text-[15px] font-medium hover:bg-neutral-100 transition-colors no-underline">Configurer ma commande</Link>
        <a href="https://wa.me/213557440522" className="bg-transparent text-white/70 px-7 py-3.5 rounded-full text-[15px] font-medium border border-white/20 hover:border-white/50 hover:text-white transition-colors no-underline" target="_blank" rel="noopener noreferrer">WhatsApp direct</a>
      </div>
    </div>
  )
}
