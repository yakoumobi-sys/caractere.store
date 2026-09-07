'use client'

import { useState } from 'react'
import Link from 'next/link'

import styles from './PrintOnDemand.module.css'

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
  { nom: 'T-shirt + Baggy Jogger', detail: 'Ensemble coton premium', prix: '4 000 DA', img: '/back-to-school/jogger-gallery-2.jpg' },
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

export default function PrintOnDemandClient() {
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  return (
    <div className={styles.page}>
      <a className="skip-link" href="#contenu">Aller au contenu</a>

      <header className="pod-header">
        <div className="pod-wrap inner">
          <Link href="/" aria-label="Caractère Store"><img src={LOGO} alt="Caractère" /></Link>
          <nav className="pod-nav" aria-label="Navigation Print on Demand">
            <a href="#comment">Le concept</a>
            <a href="#produits">Produits</a>
            <a href="#tarifs">Tarifs</a>
            <a href="#faq">Questions</a>
          </nav>
          <Link href="/designer" className="btn btn-dark btn-sm">Créer mon design</Link>
        </div>
      </header>

      <main id="contenu">
        <section className="pod-wrap hero">
          <div>
            <span className="eyebrow">Caractère / Print on demand</span>
            <h1>Tes idées.<br />Ta marque.<br /><span>Notre atelier.</span></h1>
            <p className="sub">
              Lance tes vêtements, sans gérer de stock. Tu crées, on imprime en 48h et on livre ton client
              dans les 58 wilayas.
            </p>
            <div className="cta-row">
              <Link href="/designer" className="btn btn-dark">Créer mon design <span aria-hidden="true">↗</span></Link>
              <a href={WA} target="_blank" rel="noopener noreferrer" className="btn btn-light">Parler à l&apos;atelier</a>
            </div>
            <p className="micro">Dès 1 pièce <span aria-hidden="true">/</span> Sans avance sur le stock</p>
          </div>
          <div className="hero-visual">
            <div className="visual-top"><span>IMAGINÉ PAR TOI.</span><span>FABRIQUÉ À ALGER.</span></div>
            <img src="/collection/IMG_7471.jpeg" alt="T-shirts avec un motif automobile imprimé, présentés sur un portant" fetchPriority="high" width={900} height={1200} />
            <div className="visual-caption"><span>Une idée devient<br /><strong>une vraie pièce.</strong></span><span className="visual-tag">À toi de créer ↗</span></div>
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

        <section className="section process-section" id="comment">
          <div className="pod-wrap">
            <span className="section-label">01 / LE CONCEPT</span><h2>Tu crées. On prend le relais.</h2>
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
            <span className="section-label">02 / LES SUPPORTS</span><h2>La base de ta prochaine collection.</h2>
            <p className="lead">Prix à la pièce, impression comprise.</p>
            <div className="products">
              {PRODUITS.map(p => (
                <Link key={p.nom} href={`/configurateur?produit=${encodeURIComponent(p.nom)}`} className="product">
                  <div className={`media${p.nom === 'T-shirt + Baggy Jogger' ? ' media-duo' : ''}`}>
                    {p.nom === 'T-shirt + Baggy Jogger' && <img src="/produits-photos/tshirt.jpg" alt="T-shirt de l’ensemble" loading="lazy" width={590} height={830} />}
                    <img src={p.img} alt={p.nom === 'T-shirt + Baggy Jogger' ? 'Baggy jogger de l’ensemble' : p.nom} loading="lazy" width={600} height={750} />
                    <span className="product-action" aria-hidden="true">↗</span>
                  </div>
                  <p className="name">{p.nom}</p>
                  <p className="detail">{p.detail}</p>
                  <p className="price">{p.prix}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="section pricing-section" id="tarifs">
          <div className="pod-wrap pricing-layout">
            <div>
            <span className="section-label">03 / LES TARIFS</span>
            <h2>Commence petit.<br />Vois plus grand.</h2>
            <p className="lead">Prix d&apos;un t-shirt DTF selon la quantité. La remise s&apos;applique automatiquement.</p>
            <a href={WA} target="_blank" rel="noopener noreferrer" className="text-link">Parlons de ton projet ↗</a>
            </div>
            <div className="table-scroll" role="region" aria-label="Tableau des tarifs" tabIndex={0}>
            <table className="table">
              <caption className="sr-only">Tarifs des t-shirts DTF, impression comprise, selon la quantité</caption>
              <thead>
              <tr><th scope="col">Quantité</th><th scope="col">Prix / pièce</th><th scope="col">Remise</th></tr>
              </thead><tbody>
              {TARIFS.map(t => (
                <tr key={t.qte}><th scope="row">{t.qte}</th><td className="prix">{t.prix}</td><td className="remise">{t.remise}</td></tr>
              ))}
              </tbody>
            </table>
            </div>
          </div>
        </section>

        <section className="section" id="faq">
          <div className="pod-wrap">
            <span className="section-label">04 / LES RÉPONSES</span><h2>Avant de te lancer.</h2>
            <div className="faq">
              {FAQS.map((f, i) => (
                <div key={f.q} className="faq-item">
                  <button type="button" onClick={() => setOpenFaq(openFaq === i ? null : i)} id={`faq-question-${i}`} aria-controls={`faq-answer-${i}`} aria-expanded={openFaq === i}>
                    {f.q}<span className="sign">{openFaq === i ? '−' : '+'}</span>
                  </button>
                  <div id={`faq-answer-${i}`} role="region" aria-labelledby={`faq-question-${i}`} hidden={openFaq !== i}><p>{f.a}</p></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="pod-wrap">
          <section className="final">
            <span className="section-label">LA SUITE T’APPARTIENT</span><h2>Fais porter<br />tes idées.</h2>
            <p>Teste avec une seule pièce avant de lancer ta marque dessus.</p>
            <div className="cta-row">
              <Link href="/designer" className="btn btn-invert">Créer mon design</Link>
              <a href={WA} target="_blank" rel="noopener noreferrer" className="btn" style={{ border: '1px solid rgba(255,255,255,.4)', color: 'white' }}>
                Écrire sur WhatsApp
              </a>
            </div>
            <p className="micro">Dès 1 pièce <span aria-hidden="true">/</span> Sans avance sur le stock</p>
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
