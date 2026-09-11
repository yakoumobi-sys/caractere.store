import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import styles from './HomeChooser.module.css'

const WHATSAPP =
  'https://wa.me/213557440522?text=' +
  encodeURIComponent('Bonjour Caractère, je souhaite personnaliser des vêtements.')

// Pièces issues de lib/collection-products.ts : mêmes noms, mêmes prix, mêmes
// photos locales, et le lien mène au parcours de commande existant.
// Les trois produits dont la photo manque dans public/collection ne sont pas
// repris ici — on ne met pas la photo d'une pièce à la place d'une autre.
const SELECTION = [
  { nom: 'BMW M Power', theme: 'Automotive', prix: '3 200 DA', img: '/collection/IMG_7474.jpeg' },
  { nom: 'Pure Form', theme: 'Minimalist', prix: '3 200 DA', img: '/collection/IMG_7467.jpeg' },
  { nom: 'Urban Canvas', theme: 'Graphic & Art', prix: '3 200 DA', img: '/collection/IMG_7464.jpeg' },
  { nom: 'Monaco Grand Prix', theme: 'Limited Edition', prix: '3 200 DA', img: '/collection/IMG_7460.jpeg' },
]

export default function HomeChooser() {
  return (
    <div className={`c-scope ${styles.home}`}>
      <a className={styles.skip} href="#contenu">Aller au contenu</a>
      <Navbar />

      <main id="contenu">
        {/* ── Hero ───────────────────────────────────────────────── */}
        <section className={styles.hero}>
          <div className={styles.heroMot} aria-hidden="true">CARACTÈRE</div>
          <div className={`c-wrap ${styles.heroGrille}`}>
            <div>
              <p className="c-eyebrow">Personnalisation textile · Alger</p>
              <h1 className={styles.heroTitre}>
                Porte ton<br /><em>caractère.</em>
              </h1>
              <p className={styles.heroSous}>
                Des pièces à porter. Une identité à créer. Notre atelier imprime et brode
                à la pièce comme à la série, et livre dans les 58 wilayas.
              </p>
              <div className={styles.heroActions}>
                <Link href="/configurateur" className="c-btn c-btn-accent">Personnaliser une pièce</Link>
                <Link href="/collection" className="c-btn c-btn-ghost">Voir la collection</Link>
              </div>
              <p className={styles.heroMicro}>Dès 1 pièce · Sans avance sur le stock</p>
            </div>

            <div className={styles.heroVisuel}>
              <img
                src="/pod/higher-thinking-sweat.jpg"
                alt="Sweat-shirt Caractère gris anthracite imprimé « Higher Thinking », porté devant un mur de béton"
                width={1122}
                height={1402}
                fetchPriority="high"
              />
              <div className={styles.heroEncart}>
                <span><strong>Imprimé à Alger</strong>DTF, broderie et sérigraphie</span>
                <span>58 wilayas</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── Sélection de pièces ────────────────────────────────── */}
        <section className={`c-wrap ${styles.section}`} aria-labelledby="t-selection">
          <div className={styles.entete}>
            <div>
              <p className="c-eyebrow">La collection</p>
              <h2 id="t-selection" className={styles.titre}>Des pièces déjà prêtes.</h2>
            </div>
            <Link href="/collection" className={styles.lien}>Toute la collection →</Link>
          </div>

          <div className={styles.pieces}>
            {SELECTION.map(p => (
              <Link key={p.nom} href="/collection" className={styles.piece}>
                <div className={styles.pieceMedia}>
                  <img src={p.img} alt={`${p.nom} — pièce de la collection Caractère`} loading="lazy" width={900} height={1125} />
                </div>
                <div>
                  <p className={styles.pieceNom}>{p.nom}</p>
                  <div className={styles.pieceMeta}>
                    <span className={styles.pieceTheme}>{p.theme}</span>
                    <span className={styles.piecePrix}>{p.prix}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Deux parcours ──────────────────────────────────────── */}
        <section className={`c-wrap ${styles.section}`} aria-labelledby="t-parcours">
          <div className={styles.entete}>
            <div>
              <p className="c-eyebrow">Deux façons de travailler avec nous</p>
              <h2 id="t-parcours" className={styles.titre}>Ta marque, ou ton équipe.</h2>
            </div>
          </div>

          <div className={styles.parcours}>
            <Link href="/print-on-demand" className={styles.voie}>
              <img
                src="/pod/higher-than-yesterday-hoodie.jpg"
                alt=""
                aria-hidden="true"
                loading="lazy"
                width={1122}
                height={1402}
              />
              <div className={styles.voieContenu}>
                <p className="c-eyebrow">Créateurs</p>
                <h3 className={styles.voieTitre}>Créer ma marque</h3>
                <p className={styles.voieTexte}>
                  Tu dessines, on imprime à la commande et on expédie à ton client.
                  Aucun stock à constituer.
                </p>
                <span className={styles.voieAction}>Découvrir le print on demand →</span>
              </div>
            </Link>

            <Link href="/entreprises" className={styles.voie}>
              <img
                src="/produits-photos/polo.jpg"
                alt=""
                aria-hidden="true"
                loading="lazy"
                width={900}
                height={1125}
              />
              <div className={styles.voieContenu}>
                <p className="c-eyebrow">Entreprises &amp; équipes</p>
                <h3 className={styles.voieTitre}>Habiller mon équipe</h3>
                <p className={styles.voieTexte}>
                  Polos, t-shirts et vêtements de travail à ton logo, pour ton restaurant,
                  ton chantier, ton école ou ton événement.
                </p>
                <span className={styles.voieAction}>Préparer ma commande →</span>
              </div>
            </Link>
          </div>
        </section>

        {/* ── Plateau clair : la personnalisation ────────────────── */}
        <section className={styles.plateau} aria-labelledby="t-perso">
          <div className={`c-wrap ${styles.plateauGrille}`}>
            <div>
              <p className={styles.plateauEyebrow}>La personnalisation</p>
              <h2 id="t-perso" className={styles.plateauTitre}>Ton logo, ton dessin, ta pièce.</h2>
              <p className={styles.plateauTexte}>
                Deux techniques dans notre atelier, choisies selon le vêtement et le rendu
                recherché. Envoie ton fichier, ou compose ton visuel directement en ligne.
              </p>
              <ul className={styles.techniques}>
                <li>
                  <span className={styles.puce} aria-hidden="true" />
                  <span><b>Impression DTF</b> — visuels en couleurs, dégradés et photos, sur coton comme sur mélange.</span>
                </li>
                <li>
                  <span className={styles.puce} aria-hidden="true" />
                  <span><b>Broderie machine</b> — logos et monogrammes sur polos, casquettes et vêtements de travail.</span>
                </li>
              </ul>
              <div className={styles.plateauActions}>
                <Link href="/designer" className={`c-btn ${styles.btnSombre}`}>Créer mon design</Link>
                <Link href="/devis-express" className={`c-btn ${styles.btnClair}`}>Demander un devis</Link>
              </div>
            </div>

            <div className={styles.plateauVues}>
              <figure>
                <img src="/pod/essentiel-tshirt-jogger-noir.jpg" alt="Ensemble t-shirt et jogger noirs, porté de face en studio" loading="lazy" width={1122} height={1402} />
              </figure>
              <figure>
                <img src="/pod/essentiel-tshirt-jogger-gris-dos.jpg" alt="Ensemble t-shirt noir et jogger gris chiné, porté de dos en studio" loading="lazy" width={1122} height={1402} />
              </figure>
            </div>
          </div>
        </section>

        {/* ── Contact ────────────────────────────────────────────── */}
        <section className={`c-wrap ${styles.section}`} aria-labelledby="t-contact">
          <div className={styles.contact}>
            <div>
              <p className="c-eyebrow">On commence avec ton idée</p>
              <h2 id="t-contact" className={styles.contactTitre}>Parle-nous de ta pièce.</h2>
              <p className={styles.contactTexte}>
                Dis-nous le vêtement, la quantité et ce que tu veux dessus. On revient
                vers toi avec la simulation et le devis.
              </p>
            </div>
            <div className={styles.contactActions}>
              <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="c-btn c-btn-accent">
                Écrire sur WhatsApp
              </a>
              <Link href="/devis-express" className="c-btn c-btn-ghost">Remplir le formulaire</Link>
              <p className={styles.contactNote}>
                Ouvrir WhatsApp prépare le message : la commande n&apos;est enregistrée
                qu&apos;une fois l&apos;échange confirmé avec l&apos;atelier.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
