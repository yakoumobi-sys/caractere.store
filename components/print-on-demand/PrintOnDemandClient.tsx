'use client'

import { useState } from 'react'
import Link from 'next/link'

// Palette claire, volontairement réduite : encre noire, gris de support, vert lime
// réservé aux accents. Objectif de cette page : lisibilité et parcours court.
const C = {
  ink: '#0C0A09',
  body: '#57534E',
  muted: '#8A8580',
  line: '#E7E5E4',
  soft: '#F6F5F3',
  white: '#FFFFFF',
  lime: '#A3E635',
}

const LOGO = '/logo.jpg'
const WA = 'https://wa.me/213557440522'

// Chiffres affichés sous le hero : ce sont les objections qu'on nous oppose
// en premier (minimum, délai, zone, paiement), répondues avant d'être posées.
const FACTS = [
  { k: 'Dès 1', v: 'pièce, sans minimum' },
  { k: '48h', v: 'de production en atelier' },
  { k: '58', v: 'wilayas livrées' },
  { k: '0 DA', v: "d'avance sur le stock" },
]

const STEPS = [
  { n: '1', title: 'Tu crées ton design', desc: 'Dans le Designer en ligne, gratuitement. Ou tu nous envoies ton fichier.' },
  { n: '2', title: 'On imprime en 48h', desc: 'Impression DTF dans notre atelier à Alger, à la pièce. Aucun minimum.' },
  { n: '3', title: 'On livre ton client', desc: 'Expédition dans les 58 wilayas, à ton nom. Paiement à la livraison possible.' },
]

// Prix à la pièce, impression comprise. « Sur devis » quand le tarif dépend
// encore de la finition — on ne l'invente pas sur la page.
const PRODUITS = [
  { nom: 'T-shirt', detail: '100% coton', prix: '1 950 DA', img: '/produits-photos/tshirt.jpg' },
  { nom: 'T-shirt oversized', detail: 'Coupe large, 220g', prix: 'Sur devis', img: '/produits-photos/tshirt-oversized.jpg' },
  { nom: 'Polo', detail: 'Piqué coton premium', prix: '2 300 DA', img: '/produits-photos/polo.jpg' },
  { nom: 'Hoodie', detail: 'Molleton gratté', prix: 'Sur devis', img: '/produits-photos/hoodie.jpg' },
  { nom: 'Casquette', detail: 'Broderie structurée', prix: '1 200 DA', img: '/produits-photos/casquette.jpg' },
  { nom: 'Totebag', detail: 'Coton canvas', prix: '950 DA', img: '/produits-photos/totebag.jpg' },
  { nom: 'Tablier', detail: 'Restauration, café', prix: 'Sur devis', img: '/produits-photos/tablier.jpg' },
  { nom: 'Gilet de travail', detail: 'Chantier, logistique', prix: 'Sur devis', img: '/produits-photos/gilet.jpg' },
  { nom: 'T-shirt + Baggy Jogger', detail: 'Ensemble coton premium', prix: '4 000 DA', img: '/produits-photos/tshirt-jogger.jpg' },
]

const TARIFS = [
  { qte: '1 – 9 pièces', prix: '1 950 DA', remise: '—' },
  { qte: '10 – 49 pièces', prix: '1 650 DA', remise: '−15%' },
  { qte: '50 – 99 pièces', prix: '1 465 DA', remise: '−25%' },
  { qte: '100 – 249 pièces', prix: '1 365 DA', remise: '−30%' },
  { qte: '250 – 499 pièces', prix: '1 270 DA', remise: '−35%' },
  { qte: '500 pièces et +', prix: 'Sur devis', remise: '—' },
]

const FAQS = [
  { q: 'Y a-t-il un minimum de commande ?', a: "Non. On produit à partir d'une seule pièce, au même délai que les grosses séries. Le prix baisse automatiquement dès 10 pièces." },
  { q: 'Combien de temps pour produire ?', a: '48h ouvrées en atelier à Alger, puis 1 à 5 jours de livraison selon la wilaya.' },
  { q: 'Je ne sais pas créer un design, vous aidez ?', a: "Oui. Le Designer en ligne suffit pour un texte ou un logo. Si vous bloquez, envoyez votre idée sur WhatsApp : on prépare le fichier d'impression avec vous." },
  { q: 'Qui livre le client final ?', a: 'Au choix : on expédie directement à votre client dans les 58 wilayas, ou on vous livre le lot et vous gérez votre propre expédition.' },
  { q: 'Et si le rendu ne me convient pas ?', a: "Commandez une pièce test avant de lancer votre marque dessus. Si l'impression est défectueuse, on la refait ou on rembourse." },
]

const GlobalStyle = () => (
  <style dangerouslySetInnerHTML={{
    __html: `
    body, html { background: ${C.white}; color: ${C.ink}; }
    .pod * { box-sizing: border-box; }
    .pod { line-height: 1.6; -webkit-font-smoothing: antialiased; }
    .pod a { text-decoration: none; }

    .pod-wrap { max-width: 1160px; margin: 0 auto; padding: 0 24px; }

    .pod-header {
      position: sticky; top: 0; z-index: 50;
      background: rgba(255,255,255,.88); backdrop-filter: blur(14px);
      border-bottom: 1px solid ${C.line};
    }
    .pod-header .inner { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 12px 0; }
    .pod-header img { height: 40px; width: auto; display: block; }
    .pod-nav { display: flex; align-items: center; gap: 28px; }
    .pod-nav a { font-size: 14px; color: ${C.body}; }
    .pod-nav a:hover { color: ${C.ink}; }
    @media (max-width: 780px) { .pod-nav { display: none; } }

    .btn {
      display: inline-flex; align-items: center; justify-content: center; gap: 8px;
      border-radius: 999px; font-weight: 600; font-size: 15px; line-height: 1;
      padding: 16px 28px; border: 1px solid transparent; cursor: pointer;
      transition: background .2s ease, border-color .2s ease, color .2s ease;
    }
    .btn-sm { font-size: 14px; padding: 11px 18px; }
    .btn-dark { background: ${C.ink}; color: ${C.white}; }
    .btn-dark:hover { background: #2A2622; }
    .btn-light { background: ${C.white}; color: ${C.ink}; border-color: ${C.line}; }
    .btn-light:hover { border-color: ${C.ink}; }
    .btn-invert { background: ${C.white}; color: ${C.ink}; }
    .btn-invert:hover { background: #EDEBE8; }

    /* ---- Hero : le titre porte la page, l'image porte la preuve ---- */
    .hero { padding: 84px 0 72px; display: grid; grid-template-columns: 1.05fr 1fr; gap: 64px; align-items: center; }
    .hero h1 {
      font-size: clamp(40px, 6vw, 68px); line-height: 1.02; letter-spacing: -2.4px;
      font-weight: 600; margin: 0 0 22px; text-wrap: balance;
    }
    .hero p.sub { font-size: 19px; color: ${C.body}; margin: 0 0 32px; max-width: 470px; }
    .hero .cta-row { display: flex; gap: 12px; flex-wrap: wrap; }
    .hero .micro { margin-top: 22px; font-size: 13px; color: ${C.muted}; }
    .hero-visual { border-radius: 22px; overflow: hidden; background: ${C.soft}; aspect-ratio: 4/5; }
    .hero-visual img { width: 100%; height: 100%; object-fit: cover; display: block; }
    @media (max-width: 900px) {
      .hero { grid-template-columns: 1fr; gap: 36px; padding: 44px 0 40px; }
      .hero-visual { aspect-ratio: 4/3; order: -1; }
      .hero p.sub { font-size: 17px; }
    }

    .eyebrow {
      display: inline-flex; align-items: center; gap: 8px;
      font-size: 13px; font-weight: 600; color: ${C.body};
      border: 1px solid ${C.line}; border-radius: 999px; padding: 7px 14px; margin-bottom: 24px;
    }
    .eyebrow .dot { width: 7px; height: 7px; border-radius: 999px; background: ${C.lime}; }

    /* ---- Bandeau de chiffres : pas des cartes, juste des colonnes réglées ---- */
    .facts { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; padding: 30px 0 34px; border-top: 1px solid ${C.line}; border-bottom: 1px solid ${C.line}; }
    .fact .k { font-size: 26px; font-weight: 600; letter-spacing: -0.8px; line-height: 1.1; }
    .fact .v { font-size: 13px; color: ${C.muted}; margin-top: 4px; }
    @media (max-width: 720px) { .facts { grid-template-columns: repeat(2, 1fr); gap: 22px 16px; } .fact .k { font-size: 21px; } }

    .section { padding: 76px 0; border-top: 1px solid ${C.line}; }
    .section:first-of-type { border-top: none; }
    .section h2 { font-size: clamp(28px, 3.8vw, 40px); letter-spacing: -1.2px; font-weight: 600; margin: 0 0 12px; text-wrap: balance; }
    .section .lead { font-size: 16px; color: ${C.body}; margin: 0 0 44px; max-width: 520px; }

    .steps { display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px; }
    .step .n {
      width: 32px; height: 32px; border-radius: 999px; background: ${C.ink}; color: ${C.white};
      display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 600; margin-bottom: 16px;
    }
    .step h3 { font-size: 18px; font-weight: 600; margin: 0 0 6px; }
    .step p { font-size: 15px; color: ${C.body}; margin: 0; }
    @media (max-width: 720px) { .steps { grid-template-columns: 1fr; gap: 28px; } }

    /* ---- Catalogue : la photo fait le travail, le texte reste discret ---- */
    .products { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
    .product .media { border-radius: 16px; overflow: hidden; background: ${C.soft}; aspect-ratio: 4/5; margin-bottom: 14px; }
    .product .media img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform .5s cubic-bezier(.22,1,.36,1); }
    .product:hover .media img { transform: scale(1.04); }
    .product .name { font-size: 15px; font-weight: 600; color: ${C.ink}; }
    .product .detail { font-size: 13px; color: ${C.muted}; margin-top: 2px; }
    .product .price { font-size: 15px; font-weight: 600; color: ${C.ink}; margin-top: 8px; }
    @media (max-width: 980px) { .products { grid-template-columns: repeat(3, 1fr); } }
    @media (max-width: 720px) { .products { grid-template-columns: repeat(2, 1fr); gap: 14px; } }

    .table { border: 1px solid ${C.line}; border-radius: 18px; overflow: hidden; max-width: 640px; }
    .table .row { display: grid; grid-template-columns: 1fr auto auto; gap: 16px; align-items: center; padding: 16px 22px; border-bottom: 1px solid ${C.line}; }
    .table .row:last-child { border-bottom: none; }
    .table .row.head { background: ${C.soft}; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: ${C.muted}; }
    .table .qte { font-size: 15px; }
    .table .prix { font-size: 15px; font-weight: 600; min-width: 96px; text-align: right; font-variant-numeric: tabular-nums; }
    .table .remise { font-size: 13px; color: ${C.body}; min-width: 54px; text-align: right; font-variant-numeric: tabular-nums; }

    .faq { max-width: 700px; border-top: 1px solid ${C.line}; }
    .faq-item { border-bottom: 1px solid ${C.line}; }
    .faq-item button {
      width: 100%; display: flex; justify-content: space-between; align-items: center; gap: 20px;
      background: none; border: none; padding: 22px 0; cursor: pointer;
      font: inherit; font-size: 16px; font-weight: 600; color: ${C.ink}; text-align: left;
    }
    .faq-item .sign { color: ${C.muted}; font-size: 20px; font-weight: 400; line-height: 1; }
    .faq-item p { font-size: 15px; color: ${C.body}; margin: 0; padding: 0 0 24px; max-width: 610px; }

    .final { background: ${C.ink}; color: ${C.white}; border-radius: 28px; padding: 68px 40px; text-align: center; margin: 72px 0; }
    .final h2 { font-size: clamp(28px, 4vw, 42px); letter-spacing: -1.2px; font-weight: 600; margin: 0 0 14px; text-wrap: balance; }
    .final p { color: rgba(255,255,255,.7); font-size: 17px; margin: 0 0 32px; }
    .final .cta-row { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
    .final .micro { margin-top: 22px; font-size: 13px; color: rgba(255,255,255,.5); }
    @media (max-width: 720px) { .final { padding: 48px 22px; border-radius: 22px; margin: 48px 0; } }

    .pod-footer { border-top: 1px solid ${C.line}; padding: 32px 0 48px; display: flex; flex-wrap: wrap; gap: 12px; justify-content: space-between; align-items: center; }
    .pod-footer p, .pod-footer a { font-size: 13px; color: ${C.muted}; }
    .pod-footer a:hover { color: ${C.ink}; }
    .pod-footer nav { display: flex; gap: 18px; flex-wrap: wrap; }
  `}} />
)

export default function PrintOnDemandClient() {
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  return (
    <div className="pod" style={{ background: C.white, color: C.ink, minHeight: '100vh' }}>
      <GlobalStyle />

      <header className="pod-header">
        <div className="pod-wrap inner">
          <Link href="/" aria-label="Caractère Store"><img src={LOGO} alt="Caractère" /></Link>
          <nav className="pod-nav">
            <a href="#produits">Produits</a>
            <a href="#tarifs">Tarifs</a>
            <a href="#faq">Questions</a>
          </nav>
          <Link href="/designer" className="btn btn-dark btn-sm">Créer mon design</Link>
        </div>
      </header>

      <main>
        <section className="pod-wrap hero">
          <div>
            <span className="eyebrow"><span className="dot" /> Print on demand — atelier à Alger</span>
            <h1>Ta marque, imprimée à la commande.</h1>
            <p className="sub">
              Pas de stock, pas de minimum. Tu vends, on imprime en 48h et on livre ton client
              dans les 58 wilayas.
            </p>
            <div className="cta-row">
              <Link href="/designer" className="btn btn-dark">Créer mon design</Link>
              <a href={WA} target="_blank" rel="noopener noreferrer" className="btn btn-light">Parler à l&apos;atelier</a>
            </div>
            <p className="micro">Gratuit · sans compte · réponse sous 2h, 6j/7</p>
          </div>
          <div className="hero-visual">
            <img src="/produits-photos/tshirt.jpg" alt="T-shirt personnalisé imprimé par Caractère" />
          </div>
        </section>

        <div className="pod-wrap">
          <div className="facts">
            {FACTS.map(f => (
              <div key={f.k} className="fact">
                <div className="k">{f.k}</div>
                <div className="v">{f.v}</div>
              </div>
            ))}
          </div>
        </div>

        <section className="section">
          <div className="pod-wrap">
            <h2>Comment ça marche</h2>
            <p className="lead">Trois étapes, aucune avance de stock.</p>
            <div className="steps">
              {STEPS.map(s => (
                <div key={s.n} className="step">
                  <div className="n">{s.n}</div>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="produits">
          <div className="pod-wrap">
            <h2>Ce qu&apos;on imprime</h2>
            <p className="lead">Prix à la pièce, impression comprise.</p>
            <div className="products">
              {PRODUITS.map(p => (
                <Link key={p.nom} href={`/configurateur?produit=${encodeURIComponent(p.nom)}`} className="product">
                  <div className="media"><img src={p.img} alt={p.nom} loading="lazy" /></div>
                  <p className="name">{p.nom}</p>
                  <p className="detail">{p.detail}</p>
                  <p className="price">{p.prix}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="tarifs">
          <div className="pod-wrap">
            <h2>Tarifs dégressifs</h2>
            <p className="lead">Prix d&apos;un t-shirt DTF selon la quantité. La remise s&apos;applique automatiquement.</p>
            <div className="table">
              <div className="row head">
                <span className="qte">Quantité</span>
                <span className="prix">Prix / pièce</span>
                <span className="remise">Remise</span>
              </div>
              {TARIFS.map(t => (
                <div key={t.qte} className="row">
                  <span className="qte">{t.qte}</span>
                  <span className="prix">{t.prix}</span>
                  <span className="remise">{t.remise}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="faq">
          <div className="pod-wrap">
            <h2>Questions fréquentes</h2>
            <div className="faq" style={{ marginTop: 32 }}>
              {FAQS.map((f, i) => (
                <div key={f.q} className="faq-item">
                  <button type="button" onClick={() => setOpenFaq(openFaq === i ? null : i)} aria-expanded={openFaq === i}>
                    {f.q}<span className="sign">{openFaq === i ? '−' : '+'}</span>
                  </button>
                  {openFaq === i && <p>{f.a}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="pod-wrap">
          <section className="final">
            <h2>Ton premier design prend 10 minutes.</h2>
            <p>Teste avec une seule pièce avant de lancer ta marque dessus.</p>
            <div className="cta-row">
              <Link href="/designer" className="btn btn-invert">Créer mon design</Link>
              <a href={WA} target="_blank" rel="noopener noreferrer" className="btn" style={{ border: '1px solid rgba(255,255,255,.3)', color: C.white }}>
                Écrire sur WhatsApp
              </a>
            </div>
            <p className="micro">Gratuit · sans compte · réponse sous 2h, 6j/7</p>
          </section>
        </div>
      </main>

      <footer className="pod-wrap pod-footer">
        <p>© 2026 Caractère Store — Alger, 58 wilayas</p>
        <nav>
          <Link href="/produits">Produits</Link>
          <Link href="/configurateur">Configurateur</Link>
          <Link href="/collection">Collection</Link>
          <a href={WA} target="_blank" rel="noopener noreferrer">+213 557 440 522</a>
        </nav>
      </footer>
    </div>
  )
}
