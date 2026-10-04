import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import styles from "./HomeChooser.module.css";

const simulation =
  "https://wa.me/213557440522?text=" +
  encodeURIComponent(
    "Bonjour Caractère, je souhaite obtenir ma simulation gratuite. Je vous envoie mon logo et les détails de mon projet.",
  );
const studio =
  "https://wa.me/213557440522?text=" +
  encodeURIComponent(
    "Bonjour Caractère Media, je souhaite réserver le studio pour un podcast ou un tournage. Quelles sont les disponibilités ?",
  );
const products = [
  { name: "T-shirt", detail: "Le point de départ.", image: "tshirt" },
  { name: "Polo", detail: "L’esprit d’équipe.", image: "polo" },
  { name: "Hoodie", detail: "Une pièce. Votre signature.", image: "hoodie" },
  { name: "Tote bag", detail: "Vos idées vous suivent.", image: "totebag" },
];
const questions = [
  [
    "Puis-je commander une seule pièce ?",
    "Oui. La personnalisation commence dès une pièce. Pour une équipe ou une collection, indiquez votre quantité : nous vous proposons un devis adapté à votre projet.",
  ],
  [
    "Comment obtenir ma simulation gratuite ?",
    "Envoyez votre logo à notre équipe sur WhatsApp, avec le support et la quantité souhaités. Nous préparons votre simulation et votre devis avant toute mise en production.",
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

export default function HomeChooser() {
  return (
    <div className={`c-scope ${styles.home}`}>
      <a className={styles.skip} href="#contenu">
        Aller au contenu
      </a>
      <Navbar />
      <main id="contenu">
        <div className={styles.announcement}>
          Commandez vos vêtements personnalisés en quelques étapes.{" "}
          <span>Produit, quantité, personnalisation.</span>{" "}
          <Link href="/entreprises/commande">
            Ouvrir le configurateur.
          </Link>
        </div>
        <section className={styles.hero} aria-labelledby="hero-title">
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>CARACTÈRE</p>
            <h1 id="hero-title">
              Vos idées.
              <br />
              <span>À porter.</span>
            </h1>
            <p className={styles.intro}>
              Le textile personnalisé. Avec du caractère.
            </p>
            <div className={styles.actions}>
              <Link href="/entreprises/commande" className={styles.primary}>
                Configurer ma commande
              </Link>
              <a
                href={simulation}
                className={styles.textLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                Obtenir ma simulation gratuite <span aria-hidden="true">›</span>
              </a>
            </div>
          </div>
          <div className={styles.heroImage}>
            <Image
              src="/images/campaign/hero.webp"
              alt="T-shirt blanc, polo marine, tote bag et casquette personnalisés Caractère"
              fill
              priority
              sizes="(max-width: 760px) 100vw, 1100px"
            />
          </div>
          <p className={styles.caption}>
            Imaginé par vous. Personnalisé à Alger.
          </p>
        </section>
        <div className={styles.benefits}>
          <p>
            <strong>Dès 1 pièce.</strong>
            <span>La liberté de commencer.</span>
          </p>
          <p>
            <strong>Simulation gratuite.</strong>
            <span>Voyez avant de commander.</span>
          </p>
          <p>
            <strong>Livraison 58 wilayas.</strong>
            <span>De notre atelier à chez vous.</span>
          </p>
        </div>
        <section className={styles.business} aria-labelledby="business-title">
          <div className={styles.panelCopy}>
            <p className={styles.eyebrow}>CARACTÈRE PRO</p>
            <h2 id="business-title">
              L’esprit d’équipe.
              <br />
              Ça se porte.
            </h2>
            <p>Vos uniformes. Votre logo. Une vraie identité.</p>
            <div className={styles.actions}>
              <Link href="/entreprises/commande" className={styles.primary}>
                Configurer ma commande
              </Link>
              <Link href="/entreprises" className={styles.textLink}>
                Découvrir Caractère Pro <span aria-hidden="true">›</span>
              </Link>
            </div>
          </div>
          <div className={styles.businessImage}>
            <Image
              src="/images/campaign/entreprise.webp"
              alt="Trois professionnels travaillent ensemble dans des tenues coordonnées portant le même logo"
              fill
              sizes="(max-width: 760px) 100vw, 1200px"
            />
          </div>
        </section>
        <section className={styles.streetwear} aria-labelledby="brand-title">
          <div className={styles.panelCopy}>
            <p className={styles.eyebrow}>VOTRE MARQUE, PAR CARACTÈRE.</p>
            <h2 id="brand-title">Portez votre vision.</h2>
            <p>Du premier hoodie à votre première collection.</p>
            <div className={styles.actions}>
              <Link href="/print-on-demand" className={styles.primary}>
                Lancer ma marque
              </Link>
              <Link href="/designer" className={styles.textLink}>
                Créer mon design <span aria-hidden="true">›</span>
              </Link>
            </div>
          </div>
          <div className={styles.streetImage}>
            <Image
              src="/images/campaign/streetwear.webp"
              alt="Hoodie noir oversize avec grand imprimé typographique ivoire et bleu dans le dos"
              fill
              sizes="(max-width: 760px) 100vw, 1000px"
            />
          </div>
        </section>
        <div className={styles.duo}>
          <section className={styles.personal} aria-labelledby="personal-title">
            <div className={styles.panelCopy}>
              <p className={styles.eyebrow}>UNE PIÈCE. RIEN QU’À VOUS.</p>
              <h2 id="personal-title">100 % vous.</h2>
              <p>Un cadeau. Une envie. Une création originale.</p>
              <div className={styles.actions}>
                <Link href="/configurateur" className={styles.primary}>
                  Personnaliser ma pièce
                </Link>
                <Link href="/collection" className={styles.textLink}>
                  La collection <span aria-hidden="true">›</span>
                </Link>
              </div>
            </div>
            <div className={styles.personalImage}>
              <Image
                src="/images/campaign/hero.webp"
                alt="Supports textiles pour votre personnalisation à l’unité"
                fill
                sizes="(max-width: 760px) 100vw, 50vw"
              />
            </div>
          </section>
          <section className={styles.studio} aria-labelledby="studio-title">
            <div className={styles.panelCopy}>
              <p className={styles.eyebrow}>CARACTÈRE MEDIA</p>
              <h2 id="studio-title">À vous la lumière.</h2>
              <p>Podcasts. Vidéos. Vos idées prennent la parole.</p>
              <div className={styles.actions}>
                <a
                  href={studio}
                  className={styles.primary}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Réserver le studio
                </a>
              </div>
            </div>
            <div className={styles.studioImage}>
              <Image
                src="/images/campaign/studio.webp"
                alt="Deux personnes enregistrent un podcast dans un studio avec microphones professionnels"
                fill
                sizes="(max-width: 760px) 100vw, 50vw"
              />
            </div>
          </section>
        </div>
        <section className={styles.catalogue} aria-labelledby="products-title">
          <div className={styles.sectionHead}>
            <h2 id="products-title">
              Le bon support.
              <br />
              <span>Votre signature en plus.</span>
            </h2>
            <Link href="/produits" className={styles.textLink}>
              Tout le catalogue <span aria-hidden="true">›</span>
            </Link>
          </div>
          <div className={styles.products}>
            {products.map((product) => (
              <Link
                href="/produits"
                className={styles.product}
                key={product.image}
              >
                <div className={styles.productImage}>
                  <Image
                    src={`/produits-photos/${product.image}.jpg`}
                    alt={`${product.name} personnalisable`}
                    fill
                    sizes="(max-width: 760px) 65vw, 280px"
                  />
                </div>
                <h3>{product.name}</h3>
                <p>{product.detail}</p>
                <span className={styles.textLink}>
                  Découvrir <span aria-hidden="true">›</span>
                </span>
              </Link>
            ))}
          </div>
        </section>
        <section className={styles.process} aria-labelledby="process-title">
          <p className={styles.eyebrow}>DE VOTRE IDÉE À LA PIÈCE.</p>
          <h2 id="process-title">Simple. À chaque étape.</h2>
          <div className={styles.steps}>
            {[
              [
                "01",
                "Envoyez votre logo.",
                "Précisez le support, la quantité et votre idée. Notre équipe vous accompagne.",
              ],
              [
                "02",
                "Visualisez le résultat.",
                "Votre simulation et votre devis sont gratuits. Vous validez avant la production.",
              ],
              [
                "03",
                "Portez votre identité.",
                "Nous personnalisons vos pièces. Retirez-les à l’atelier ou faites-vous livrer.",
              ],
            ].map(([number, title, text]) => (
              <article key={number}>
                <span>{number}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
          <Link href="/comment-ca-marche" className={styles.textLink}>
            Découvrir notre savoir-faire <span aria-hidden="true">›</span>
          </Link>
        </section>
        <section className={styles.final}>
          <p className={styles.eyebrow}>VOTRE PROCHAINE IDÉE COMMENCE ICI.</p>
          <h2>
            Envoyez votre logo.
            <br />
            <span>On lui donne vie.</span>
          </h2>
          <p>Votre simulation est gratuite. Le prochain pas est simple.</p>
          <a
            href={simulation}
            className={styles.primary}
            target="_blank"
            rel="noopener noreferrer"
          >
            Obtenir ma simulation gratuite
          </a>
          <Link href="/devis-express" className={styles.textLink}>
            Ou demander un devis en ligne <span aria-hidden="true">›</span>
          </Link>
        </section>
        <section className={styles.faq}>
          <h2>
            Quelques réponses.
            <br />
            Avant de commencer.
          </h2>
          <div>
            {questions.map(([question, answer]) => (
              <details key={question}>
                <summary>
                  {question}
                  <span aria-hidden="true">+</span>
                </summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </section>
        <p className={styles.disclaimer}>
          Visuels de campagne générés à titre d’inspiration. Supports et
          personnalisation à confirmer avec notre équipe.
        </p>
      </main>
      <Footer />
    </div>
  );
}
