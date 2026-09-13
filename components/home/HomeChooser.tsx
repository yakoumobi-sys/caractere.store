import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { CATALOGUE, lienConfigurateur, resoudreProduit } from '@/lib/catalogue'
import { lienWhatsApp } from '@/lib/contact'
import styles from './HomeChooser.module.css'

const WHATSAPP = lienWhatsApp('Bonjour Caractère, je souhaite personnaliser des vêtements.')

// Pièces mises en avant : ensembles, hoodies et joggers, les plus demandés.
// Elles viennent de lib/catalogue.ts — mêmes noms, mêmes photos et mêmes prix
// que le catalogue —, et chaque carte ouvre la configuration de la pièce
// qu'elle montre, pas une page de liste.
const MISES_EN_AVANT = [
  'ensemble-3-pieces',
  'ensemble-racing-07',
  'ensemble-dragon',
  'hoodie-premium-500gsm',
  'zipper-hoodie',
  'premium-baggy-joggers',
].flatMap(id => {
  const produit = resoudreProduit(id)
  return produit ? [produit] : []
})

const daFormat = (n: number) => `${n.toLocaleString('fr-DZ')} DA`

// Trois intentions d'achat, visibles dès l'accueil : avant, seuls « créer ma
// marque » et « habiller mon équipe » existaient, et un revendeur n'avait
// aucune porte d'entrée.
const INTENTIONS = [
  {
    eyebrow: 'Pour moi',
    titre: 'Personnaliser pour moi',
    texte:
      'Une pièce, votre visuel. Choisissez le vêtement, la couleur et la taille, envoyez votre logo ou votre dessin.',
    action: 'Configurer ma pièce →',
    href: '/configurateur',
    img: '/pod/higher-than-yesterday-tshirt.jpg',
  },
  {
    eyebrow: 'Revendeurs & boutiques',
    titre: 'Commander pour revendre',
    texte:
      'Composez votre série : plusieurs pièces, une quantité par taille, et un devis chiffré par l’atelier.',
    action: 'Composer ma série →',
    href: '/revente',
    img: '/ensembles/ensemble-racing-07.jpg',
  },
  {
    eyebrow: 'Entreprises & équipes',
    titre: 'Habiller mon équipe',
    texte:
      'Polos, t-shirts et vêtements de travail à votre logo, pour votre restaurant, votre chantier ou votre événement.',
    action: 'Préparer ma commande →',
    href: '/entreprises',
    img: '/produits-photos/polo.jpg',
  },
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
                <Link href="/revente" className="c-btn c-btn-ghost">Commander pour revendre</Link>
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

        {/* ── Trois intentions ───────────────────────────────────── */}
        <section className={`c-wrap ${styles.section}`} aria-labelledby="t-intentions">
          <div className={styles.entete}>
            <div>
              <p className="c-eyebrow">Par où commencer</p>
              <h2 id="t-intentions" className={styles.titre}>Qu&apos;est-ce que tu veux faire ?</h2>
            </div>
          </div>

          <div className={styles.intentions}>
            {INTENTIONS.map(i => (
              <Link key={i.href} href={i.href} className={styles.intention}>
                <div className={styles.intentionMedia}>
                  <img src={i.img} alt="" aria-hidden="true" loading="lazy" width={900} height={900} />
                </div>
                <div className={styles.intentionCorps}>
                  <p className="c-eyebrow">{i.eyebrow}</p>
                  <h3 className={styles.intentionTitre}>{i.titre}</h3>
                  <p className={styles.intentionTexte}>{i.texte}</p>
                  <span className={styles.intentionAction}>{i.action}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Pièces les plus demandées ──────────────────────────── */}
        <section className={`c-wrap ${styles.section}`} aria-labelledby="t-selection">
          <div className={styles.entete}>
            <div>
              <p className="c-eyebrow">Ensembles, hoodies &amp; joggers</p>
              <h2 id="t-selection" className={styles.titre}>Les pièces les plus demandées.</h2>
            </div>
            <Link href="/produits" className={styles.lien}>Tout le catalogue →</Link>
          </div>

          <div className={styles.pieces}>
            {MISES_EN_AVANT.map(p => (
              /* Le lien ouvre la configuration de cette pièce précise, et non
                 une page de liste où il faudrait la retrouver. */
              <Link key={p.id} href={lienConfigurateur(p)} className={styles.piece}>
                <div className={styles.pieceMedia}>
                  <img
                    src={p.image}
                    alt={`${p.nom} — ${p.description}`}
                    loading="lazy"
                    width={900}
                    height={900}
                  />
                </div>
                <div>
                  <p className={styles.pieceNom}>{p.nom}</p>
                  <div className={styles.pieceMeta}>
                    <span className={styles.pieceTheme}>{p.categorie}</span>
                    <span className={styles.piecePrix}>
                      {typeof p.prix === 'number' ? daFormat(p.prix) : 'Sur devis'}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <p className={styles.piecesNote}>
            {CATALOGUE.length} supports au catalogue. Les pièces sans tarif affiché sont
            chiffrées sur devis : l&apos;atelier ne publie que les prix qu&apos;il a confirmés.
          </p>
        </section>

        {/* ── Collection et print on demand ──────────────────────── */}
        <section className={`c-wrap ${styles.section}`} aria-labelledby="t-parcours">
          <div className={styles.entete}>
            <div>
              <p className="c-eyebrow">Déjà imprimé, ou à créer</p>
              <h2 id="t-parcours" className={styles.titre}>Prêt à porter, ou ta marque.</h2>
            </div>
          </div>

          <div className={styles.parcours}>
            <Link href="/collection" className={styles.voie}>
              <img
                src="/collection/IMG_7474.jpeg"
                alt=""
                aria-hidden="true"
                loading="lazy"
                width={900}
                height={1125}
              />
              <div className={styles.voieContenu}>
                <p className="c-eyebrow">Prêt à porter</p>
                <h3 className={styles.voieTitre}>La collection</h3>
                <p className={styles.voieTexte}>
                  Nos prints déjà dessinés, classés par univers. Commandez la taille et la
                  quantité qu&apos;il vous faut.
                </p>
                <span className={styles.voieAction}>Voir la collection →</span>
              </div>
            </Link>

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
