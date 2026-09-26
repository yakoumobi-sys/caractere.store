import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import styles from "./HomeChooser.module.css";

const products = [
  {
    name: "T-shirt",
    label: "Le point de départ.",
    image: "tshirt",
    category: "L’essentiel",
  },
  {
    name: "Polo",
    label: "L’esprit d’équipe.",
    image: "polo",
    category: "Entreprise",
  },
  {
    name: "Gilet de travail",
    label: "Sur tous les terrains.",
    image: "gilet",
    category: "Workwear",
  },
  {
    name: "Casquette",
    label: "Le détail qui signe.",
    image: "casquette",
    category: "Accessoire",
  },
];
const questions = [
  [
    "Puis-je commander une seule pièce ?",
    "Oui. La personnalisation commence dès une pièce. Pour une équipe ou une collection, indiquez votre quantité : nous vous proposons un devis adapté à votre projet.",
  ],
  [
    "Je n’ai pas de fichier prêt pour l’impression. Que faire ?",
    "Envoyez-nous votre logo ou expliquez votre idée. Notre équipe vous accompagne pour préparer le visuel et vous présenter une simulation avant validation.",
  ],
  [
    "Broderie ou impression DTF ?",
    "La broderie apporte du relief aux logos et aux inscriptions. Le DTF reproduit les illustrations, les photos et les dégradés. Nous vous conseillons selon votre visuel, le support et l’usage.",
  ],
  [
    "Quels sont les délais et les options de livraison ?",
    "Le délai est confirmé avec votre devis, selon le stock, la quantité et la technique. Le retrait à l’atelier d’Alger et la livraison dans les 58 wilayas sont possibles. Précisez votre date si le projet est urgent.",
  ],
];
const whatsapp =
  "https://wa.me/213557440522?text=" +
  encodeURIComponent(
    "Bonjour Caractère, j’aimerais parler de mon projet de personnalisation textile.",
  );

export default function HomeChooser() {
  return (
    <div className={`c-scope ${styles.home}`}>
      <a className={styles.skip} href="#contenu">
        Aller au contenu
      </a>
      <div className={styles.announcement}>
        <span>De votre idée à la pièce. Fabriqué avec Caractère.</span>
        <span>Alger · Livraison 58 wilayas</span>
      </div>
      <Navbar />
      <main id="contenu">
        <section className={`c-wrap ${styles.hero}`}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>
              <span className={styles.dot} /> ATELIER DE PERSONNALISATION
              TEXTILE
            </p>
            <h1>
              Ne passez pas
              <br />
              inaperçu.
              <br />
              <span>
                Portez votre
                <br />
                caractère.
              </span>
            </h1>
            <p className={styles.intro}>
              Votre marque. Votre équipe. Votre identité.
              <br />
              Nous donnons vie à vos idées sur textile, de la première pièce à
              la grande série.
            </p>
            <div className={styles.actions}>
              <Link href="/configurateur" className="c-btn c-btn-accent">
                Créer ma pièce <span aria-hidden="true">↗</span>
              </Link>
              <Link href="/entreprises" className={styles.textLink}>
                Habiller mon équipe <span aria-hidden="true">→</span>
              </Link>
            </div>
            <div className={styles.heroProof}>
              <span>01 pièce minimum</span>
              <span>Simulation gratuite</span>
              <span>DTF & broderie</span>
            </div>
          </div>
          <div className={styles.heroImage}>
            <Image
              src="/pod/higher-thinking-sweat.jpg"
              alt="Sweat anthracite personnalisé, illustration et typographie imprimées sur la poitrine"
              fill
              priority
              sizes="(max-width: 760px) 100vw, 48vw"
            />
            <div className={styles.imageTop}>
              <span>CARACTÈRE®</span>
              <span>DES IDÉES À PORTER.</span>
            </div>
            <div className={styles.imageBottom}>
              <span>
                Votre prochain projet
                <br />
                <b>commence ici.</b>
              </span>
              <Link href="/designer" aria-label="Ouvrir le studio de création">
                ↗
              </Link>
            </div>
          </div>
        </section>
        <div className={styles.ribbon}>
          <span>IMAGINÉ PAR VOUS</span>
          <i aria-hidden="true">✳</i>
          <span>PERSONNALISÉ PAR NOUS</span>
          <i aria-hidden="true">✳</i>
          <span>PORTÉ AVEC FIERTÉ</span>
          <i aria-hidden="true">✳</i>
        </div>

        <section
          className={`c-wrap ${styles.section}`}
          id="projets"
          aria-labelledby="projects-title"
        >
          <div className={styles.heading}>
            <div>
              <p className={styles.eyebrow}>01 / À CHACUN SON CARACTÈRE</p>
              <h2 id="projects-title">
                Une idée en tête ?<br />
                <span>On a le bon point de départ.</span>
              </h2>
            </div>
            <p>
              Choisissez votre projet.
              <br />
              On s’occupe de la suite, ensemble.
            </p>
          </div>
          <div className={styles.pathways}>
            <Link href="/entreprises" className={styles.pathCard}>
              <div className={styles.pathImage}>
                <Image
                  src="/produits-photos/polo.jpg"
                  alt="Polo blanc avec emplacement de logo côté cœur"
                  fill
                  sizes="(max-width: 760px) 100vw, 33vw"
                />
              </div>
              <div className={styles.pathBody}>
                <span className={styles.eyebrow}>POUR LES ENTREPRISES</span>
                <h3>
                  Une équipe.
                  <br />
                  Une identité.
                </h3>
                <p>
                  Uniformes, polos et vêtements de travail qui représentent
                  votre entreprise.
                </p>
                <span className={styles.pathAction}>
                  Équiper mon entreprise <b>↗</b>
                </span>
              </div>
            </Link>
            <Link href="/print-on-demand" className={styles.pathCard}>
              <div className={styles.pathImage}>
                <Image
                  src="/pod/higher-than-yesterday-hoodie.jpg"
                  alt="Hoodie imprimé pour une collection de marque"
                  fill
                  sizes="(max-width: 760px) 100vw, 33vw"
                />
              </div>
              <div className={styles.pathBody}>
                <span className={styles.eyebrow}>POUR LES CRÉATEURS</span>
                <h3>
                  Votre marque.
                  <br />
                  Votre prochain chapitre.
                </h3>
                <p>
                  Lancez vos designs avec le print on demand et produisez à la
                  commande.
                </p>
                <span className={styles.pathAction}>
                  Lancer ma marque <b>↗</b>
                </span>
              </div>
            </Link>
            <Link href="/configurateur" className={styles.pathCard}>
              <div className={styles.pathImage}>
                <Image
                  src="/pod/higher-perspective-tshirt.jpg"
                  alt="T-shirt avec illustration personnalisée"
                  fill
                  sizes="(max-width: 760px) 100vw, 33vw"
                />
              </div>
              <div className={styles.pathBody}>
                <span className={styles.eyebrow}>POUR VOS ENVIES</span>
                <h3>
                  Une pièce.
                  <br />
                  100 % vous.
                </h3>
                <p>
                  Un cadeau, un événement ou juste une idée à porter. Dès une
                  seule pièce.
                </p>
                <span className={styles.pathAction}>
                  Personnaliser ma pièce <b>↗</b>
                </span>
              </div>
            </Link>
          </div>
        </section>

        <section className={styles.light} aria-labelledby="products-title">
          <div className={`c-wrap ${styles.section}`}>
            <div className={styles.heading}>
              <div>
                <p className={styles.eyebrow}>
                  02 / LE BON SUPPORT CHANGE TOUT
                </p>
                <h2 id="products-title">
                  À vous de leur
                  <br />
                  donner du caractère.
                </h2>
              </div>
              <Link href="/produits" className={styles.textLink}>
                Explorer le catalogue <span>↗</span>
              </Link>
            </div>
            <div className={styles.products}>
              {products.map((p, index) => (
                <Link
                  key={p.name}
                  href={`/configurateur?produit=${encodeURIComponent(p.name)}`}
                  className={styles.product}
                >
                  <div className={styles.productImage}>
                    <Image
                      src={`/produits-photos/${p.image}.jpg`}
                      alt={`${p.name} à personnaliser avec votre logo`}
                      fill
                      sizes="(max-width: 760px) 50vw, 25vw"
                    />
                    <span className={styles.productIndex}>0{index + 1}</span>
                    <span className={styles.productArrow}>↗</span>
                  </div>
                  <div className={styles.productMeta}>
                    <h3>{p.name}</h3>
                    <span>{p.category}</span>
                  </div>
                  <p>{p.label}</p>
                </Link>
              ))}
            </div>
            <div className={styles.catalogueNote}>
              <span>
                Couleurs, tailles, quantités : composez votre projet en ligne.
              </span>
              <Link href="/devis-express">
                Besoin d’un prix pour une série ? Demander un devis →
              </Link>
            </div>
          </div>
        </section>

        <section
          className={`c-wrap ${styles.section} ${styles.studio}`}
          aria-labelledby="studio-title"
        >
          <div className={styles.studioVisual}>
            <Image
              src="/pod/essentiel-tshirt-jogger-noir.jpg"
              alt="T-shirt et pantalon noirs, base pour une identité textile sur mesure"
              fill
              sizes="(max-width: 760px) 100vw, 45vw"
            />
            <span className={styles.studioLabel}>
              LE SUPPORT. LE VISUEL. VOUS.
            </span>
          </div>
          <div className={styles.studioCopy}>
            <p className={styles.eyebrow}>03 / DU FICHIER À LA FIBRE</p>
            <h2 id="studio-title">
              Votre imagination.
              <br />
              <span>Notre savoir-faire.</span>
            </h2>
            <p>
              Un logo discret sur le cœur ou une illustration qui prend toute la
              place. Chaque projet mérite la bonne technique.
            </p>
            <div className={styles.technique}>
              <span>01</span>
              <div>
                <h3>Impression DTF</h3>
                <p>Couleurs, détails et dégradés. Faites parler vos visuels.</p>
              </div>
              <span aria-hidden="true">↗</span>
            </div>
            <div className={styles.technique}>
              <span>02</span>
              <div>
                <h3>Broderie</h3>
                <p>Du relief, de la texture et une signature soignée.</p>
              </div>
              <span aria-hidden="true">↗</span>
            </div>
            <Link href="/designer" className="c-btn c-btn-accent">
              Essayer le studio de création <span>↗</span>
            </Link>
          </div>
        </section>

        <section className={styles.processSection}>
          <div className={`c-wrap ${styles.section}`}>
            <div className={styles.heading}>
              <div>
                <p className={styles.eyebrow}>04 / SIMPLE, DU DÉBUT À LA FIN</p>
                <h2>
                  Vous imaginez.
                  <br />
                  On concrétise.
                </h2>
              </div>
              <Link href="/comment-ca-marche" className={styles.textLink}>
                Le fonctionnement en détail ↗
              </Link>
            </div>
            <div className={styles.steps}>
              {[
                [
                  "01",
                  "Décrivez votre projet.",
                  "Choisissez le vêtement, la quantité et le visuel. Ou demandez conseil à notre équipe.",
                ],
                [
                  "02",
                  "Validez votre simulation.",
                  "Nous précisons le rendu, le prix et les délais avant de lancer la production.",
                ],
                [
                  "03",
                  "Portez votre caractère.",
                  "Récupérez vos pièces à Alger ou faites-vous livrer dans votre wilaya.",
                ],
              ].map(([n, t, d]) => (
                <div key={n}>
                  <span className={styles.stepNumber}>{n}</span>
                  <h3>{t}</h3>
                  <p>{d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          className={`c-wrap ${styles.section} ${styles.faq}`}
          aria-labelledby="faq-title"
        >
          <div>
            <p className={styles.eyebrow}>AVANT DE VOUS LANCER</p>
            <h2 id="faq-title">
              Les bonnes
              <br />
              questions.
            </h2>
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.textLink}
            >
              Parlons de votre projet ↗
            </a>
          </div>
          <div>
            {questions.map(([q, a]) => (
              <details className={styles.question} key={q}>
                <summary>
                  {q}
                  <span aria-hidden="true">+</span>
                </summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </section>
        <section className={styles.final}>
          <div className="c-wrap">
            <p className={styles.eyebrow}>LA SUITE S’ÉCRIT AVEC VOUS.</p>
            <h2>
              Faites bonne
              <br />
              <span>impression.</span>
            </h2>
            <div className={styles.actions}>
              <Link href="/devis-express" className="c-btn c-btn-primary">
                Obtenir mon devis gratuit ↗
              </Link>
              <a
                href={whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.textLink}
              >
                Discuter sur WhatsApp ↗
              </a>
            </div>
            <p>Une idée suffit pour commencer.</p>
          </div>
        </section>
      </main>
      <Footer />
      <div className={styles.mobileCta}>
        <Link href="/configurateur">Créer ma pièce ↗</Link>
        <Link href="/devis-express">Devis gratuit ↗</Link>
      </div>
    </div>
  );
}
