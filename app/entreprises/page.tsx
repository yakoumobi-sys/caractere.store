import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

const PACKS = [
  {
    tier: 'Starter',
    name: 'Pack Starter',
    subtitle: 'Ideal pour equipes, petites entreprises & evenements',
    prixReel: '20 800',
    prix: '19 900',
    articles: '10',
    economie: '-900 DA',
    featured: false,
    items: [
      { name: 'T-shirts personnalises', qty: 4 },
      { name: 'Casquettes', qty: 2 },
      { name: 'Polos', qty: 4 },
    ],
    wa: 'Bonjour, je suis interesse par le Pack Starter (19 900 DA).',
  },
  {
    tier: 'Pro',
    name: 'Pack Pro',
    subtitle: 'Pour petites entreprises, equipes terrain & staff complet',
    prixReel: '53 000',
    prix: '49 900',
    articles: '25',
    economie: '-3 100 DA',
    featured: true,
    items: [
      { name: 'T-shirts personnalises', qty: 10 },
      { name: 'Polos', qty: 6 },
      { name: 'Gilets', qty: 4 },
      { name: 'Casquettes', qty: 5 },
    ],
    wa: 'Bonjour, je suis interesse par le Pack Pro 25 articles (49 900 DA).',
  },
  {
    tier: 'Business',
    name: 'Pack Business',
    subtitle: 'Pour entreprises, grands evenements & staff complet',
    prixReel: '84 700',
    prix: '79 900',
    articles: '40',
    economie: '-4 800 DA',
    featured: false,
    items: [
      { name: 'T-shirts personnalises', qty: 16 },
      { name: 'Polos', qty: 10 },
      { name: 'Gilets', qty: 6 },
      { name: 'Casquettes', qty: 8 },
    ],
    wa: 'Bonjour, je suis interesse par le Pack Business 40 articles (79 900 DA).',
  },
]

const FEATURES = [
  { icon: '🎨', title: 'Personnalisation totale', desc: 'Logo, couleurs, texte — chaque article est imprime ou brode selon votre identite.' },
  { icon: '⚡', title: 'Delai rapide', desc: 'Production en atelier a Alger. Livraison sous 5 a 7 jours ouvres.' },
  { icon: '🏭', title: 'Fait en Algerie', desc: 'Atelier local, controle qualite sur chaque commande, sans intermediaire.' },
  { icon: '📦', title: 'Devis sur mesure', desc: 'Besoin de plus ? On adapte le pack selon vos quantites et votre budget.' },
]

export default function EntreprisesPage() {
  return (
    <>
      <Navbar />
      <main className="pt-14 min-h-screen" style={{ backgroundColor: '#F5F0E8' }}>

        {/* SAVINGS BAR */}
        <div
          className="flex items-center gap-6 overflow-x-auto px-6 py-3 text-[11px] font-bold uppercase tracking-widest"
          style={{ backgroundColor: '#0F0F0F', color: '#F5F0E8', whiteSpace: 'nowrap' }}
        >
          <span style={{ color: '#FF4D00' }}>✦</span>
          <span>Economisez jusqu'a 4 800 DA sur le Pack Business</span>
          <span style={{ color: '#FF4D00' }}>✦</span>
          <span>Broderie & DTF incluses</span>
          <span style={{ color: '#FF4D00' }}>✦</span>
          <span>Delai : 5-7 jours ouvres</span>
          <span style={{ color: '#FF4D00' }}>✦</span>
          <span>Devis personnalise disponible</span>
        </div>

        {/* HERO */}
        <section className="px-6 pb-12 pt-14 max-w-[900px] mx-auto">
          <span
            className="inline-flex items-center gap-2 border-2 px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest mb-5"
            style={{ borderColor: '#0F0F0F', backgroundColor: '#FF4D00', color: '#0F0F0F' }}
          >
            ✦ Solutions entreprises
          </span>
          <h1
            className="text-5xl font-extrabold leading-[1.05] tracking-tight mb-4"
            style={{ color: '#0F0F0F' }}
          >
            Equipez votre equipe.
            <br />
            <span style={{ color: '#FF4D00' }}>Sans compromis.</span>
          </h1>
          <p className="text-[15px] leading-relaxed mb-8 max-w-[520px]" style={{ color: '#6B6B6B' }}>
            Des packs cles-en-main pour habiller votre personnel, vos evenements et vos equipes.
            Livraison a Alger, personnalisation incluse.
          </p>
          <a
            href="https://wa.me/213557440522"
            target="_blank"
            className="inline-block border-2 px-8 py-3.5 text-[14px] font-bold uppercase tracking-wide no-underline"
            style={{
              borderColor: '#0F0F0F',
              backgroundColor: '#0F0F0F',
              color: '#F5F0E8',
              boxShadow: '4px 4px 0 #FF4D00',
            }}
          >
            Demander un devis →
          </a>
        </section>

        {/* PACKS */}
        <section className="px-6 pb-20 max-w-[1100px] mx-auto">
          <p className="text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: '#6B6B6B' }}>Nos offres</p>
          <h2 className="text-[28px] font-extrabold mb-8 tracking-tight" style={{ color: '#0F0F0F' }}>
            Choisissez votre pack
          </h2>

          <div
            className="grid grid-cols-1 md:grid-cols-3 border-2"
            style={{ borderColor: '#0F0F0F' }}
          >
            {PACKS.map((pack, i) => (
              <div
                key={pack.tier}
                className="relative p-8"
                style={{
                  backgroundColor: pack.featured ? '#0F0F0F' : '#FFFFFF',
                  color: pack.featured ? '#F5F0E8' : '#0F0F0F',
                  borderRight: i < 2 ? '2px solid #0F0F0F' : 'none',
                  borderBottom: '0',
                }}
              >
                {pack.featured && (
                  <div
                    className="absolute top-0 right-6 px-3 py-1 text-[10px] font-bold uppercase tracking-widest border-2 border-t-0"
                    style={{ backgroundColor: '#FF4D00', color: '#0F0F0F', borderColor: '#0F0F0F' }}
                  >
                    Populaire
                  </div>
                )}

                <p className="text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: '#FF4D00' }}>
                  {pack.tier}
                </p>
                <h3 className="text-[22px] font-extrabold mb-2">{pack.name}</h3>
                <p className="text-[13px] mb-6 leading-relaxed" style={{ color: pack.featured ? 'rgba(245,240,232,0.55)' : '#6B6B6B' }}>
                  {pack.subtitle}
                </p>

                <div className="mb-6">
                  <p className="text-[12px] line-through mb-1" style={{ color: pack.featured ? 'rgba(245,240,232,0.4)' : '#6B6B6B' }}>
                    Valeur reelle : {pack.prixReel} DA
                  </p>
                  <p className="text-[36px] font-extrabold leading-none" style={{ color: pack.featured ? '#FF4D00' : '#0F0F0F' }}>
                    {pack.prix} <span className="text-[16px] font-medium">DA</span>
                  </p>
                  <p className="text-[12px] mt-1" style={{ color: pack.featured ? 'rgba(245,240,232,0.5)' : '#6B6B6B' }}>
                    {pack.articles} articles personnalises
                  </p>
                  <span
                    className="inline-block text-[11px] font-bold mt-2 px-2 py-1"
                    style={{ backgroundColor: 'rgba(255,77,0,0.12)', color: '#FF4D00', fontFamily: 'monospace' }}
                  >
                    {pack.economie}
                  </span>
                </div>

                <div
                  className="h-[2px] my-5"
                  style={{ backgroundColor: pack.featured ? 'rgba(245,240,232,0.1)' : 'rgba(15,15,15,0.1)' }}
                />

                <p
                  className="text-[10px] font-bold uppercase tracking-widest mb-3"
                  style={{ color: pack.featured ? 'rgba(245,240,232,0.45)' : '#6B6B6B' }}
                >
                  Contenu du pack
                </p>
                <ul className="mb-6">
                  {pack.items.map((item) => (
                    <li
                      key={item.name}
                      className="flex justify-between items-center py-2 text-[13px] border-b"
                      style={{ borderColor: pack.featured ? 'rgba(245,240,232,0.08)' : 'rgba(15,15,15,0.07)' }}
                    >
                      <span style={{ fontWeight: 300 }}>{item.name}</span>
                      <span className="font-bold" style={{ color: '#FF4D00', fontFamily: 'monospace' }}>
                        x{item.qty}
                      </span>
                    </li>
                  ))}
                </ul>

                <a
                  href={`https://wa.me/213557440522?text=${encodeURIComponent(pack.wa)}`}
                  target="_blank"
                  className="block text-center py-3.5 text-[13px] font-bold uppercase tracking-wide border-2 no-underline"
                  style={
                    pack.featured
                      ? { backgroundColor: '#FF4D00', color: '#0F0F0F', borderColor: '#0F0F0F', boxShadow: '3px 3px 0 #0F0F0F' }
                      : { backgroundColor: '#0F0F0F', color: '#F5F0E8', borderColor: '#0F0F0F', boxShadow: '3px 3px 0 #FF4D00' }
                  }
                >
                  Commander ce pack
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* FEATURES */}
        <section
          className="px-6 py-16 border-t-2 border-b-2"
          style={{ backgroundColor: '#0F0F0F', borderColor: '#0F0F0F' }}
        >
          <div className="max-w-[1100px] mx-auto">
            <h2 className="text-[28px] font-extrabold mb-10" style={{ color: '#F5F0E8' }}>
              Pourquoi choisir <span style={{ color: '#FF4D00' }}>Caractere</span> ?
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 border border-[rgba(245,240,232,0.15)]">
              {FEATURES.map((f, i) => (
                <div
                  key={f.title}
                  className="p-6"
                  style={{ borderRight: i < 3 ? '1px solid rgba(245,240,232,0.1)' : 'none' }}
                >
                  <div className="text-[28px] mb-3">{f.icon}</div>
                  <h3 className="text-[14px] font-bold mb-2" style={{ color: '#F5F0E8' }}>{f.title}</h3>
                  <p className="text-[12px] leading-relaxed" style={{ color: 'rgba(245,240,232,0.5)' }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* BOTTOM CTA */}
        <section className="px-6 py-20 text-center max-w-[700px] mx-auto">
          <h2 className="text-[32px] font-extrabold leading-tight mb-4" style={{ color: '#0F0F0F' }}>
            Un besoin specifique ?<br />On vous fait un devis.
          </h2>
          <p className="text-[15px] leading-relaxed mb-10" style={{ color: '#6B6B6B' }}>
            Quantites differentes, articles hors catalogue, delai urgent — contactez-nous sur WhatsApp
            et obtenez une reponse sous 2h.
          </p>
          <a
            href="https://wa.me/213557440522?text=Bonjour, j'aimerais obtenir un devis personnalise pour ma commande entreprise."
            target="_blank"
            className="inline-flex items-center gap-3 no-underline border-2 px-8 py-4 text-[14px] font-bold uppercase tracking-wide"
            style={{
              backgroundColor: '#25D366',
              color: '#FFFFFF',
              borderColor: '#0F0F0F',
              boxShadow: '4px 4px 0 #0F0F0F',
            }}
          >
            <svg width="20" height="20" fill="white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Discuter sur WhatsApp
          </a>
        </section>

      </main>
      <Footer />
    </>
  )
}
