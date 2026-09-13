'use client'

import { useState } from "react"
import Link from "next/link"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import {
  CATALOGUE,
  CATEGORIES,
  lienConfigurateur,
  estTailleVestimentaire,
  type CatalogueProduit,
} from "@/lib/catalogue"
import { WHATSAPP_NUMERO } from "@/lib/contact"
import InfosCommerciales from "@/components/commun/InfosCommerciales"
import styles from "./ProduitsClient.module.css"

// Les fiches produits viennent de lib/catalogue.ts, la source partagée avec le
// configurateur. Le bouton « Configurer ma commande » transporte l'identifiant
// stable de la pièce : c'est ce qui garantit que le configurateur ouvre bien le
// produit cliqué, et non un produit vide.
type Produit = CatalogueProduit

const PRODUITS = CATALOGUE

const FILTRES = ["Tous", ...CATEGORIES] as const

const daFormat = (n: number) => `${n.toLocaleString("fr-DZ")} DA`

// Seuls « Exclusif » et « Premium » prennent l'accent ; les autres badges
// restent neutres pour ne pas transformer la grille en sapin de Noël.
const BADGES_ACCENT = new Set(["Exclusif", "Premium"])

function PhotoProduit({ p }: { p: Produit }) {
  const [absente, setAbsente] = useState(false)

  if (absente) {
    return (
      <div className={styles.mediaVide}>
        <strong>Photo indisponible</strong>
        <span>Le support existe, son visuel ne charge pas.</span>
      </div>
    )
  }

  return (
    <img
      src={p.image}
      alt={p.nom}
      loading="lazy"
      width={600}
      height={600}
      onError={() => setAbsente(true)}
    />
  )
}

function CarteProduct({ p }: { p: Produit }) {
  const waMsg = encodeURIComponent(
    `Bonjour Caractère Store 👋\n\nJe suis intéressé(e) par une commande en gros :\n\n🛍️ Produit : ${p.nom}\n📦 Quantité : (à préciser)\n📏 Tailles : (à préciser)\n\nPouvez-vous me faire un devis ?`
  )
  const afficherTailles = p.tailles.some(estTailleVestimentaire)

  return (
    <article className={styles.carte}>
      <div className={styles.media}>
        {p.badge && (
          <span className={`${styles.badge} ${BADGES_ACCENT.has(p.badge) ? styles.badgeAccent : ""}`}>
            {p.badge}
          </span>
        )}
        <PhotoProduit p={p} />
      </div>

      <h3 className={styles.nom}>{p.nom}</h3>
      <p className={styles.desc}>{p.description}</p>
      {typeof p.prix === "number"
        ? <p className={styles.prix}>{daFormat(p.prix)}</p>
        : <p className={styles.prixDevis}>Prix sur devis</p>}

      {afficherTailles && (
        <div className={styles.tailles}>
          {p.tailles.map((t) => (
            <span key={t} className={styles.taille}>{t}</span>
          ))}
        </div>
      )}

      <div className={styles.actions}>
        <Link href={lienConfigurateur(p)} className="c-btn c-btn-primary">
          Configurer ma commande
        </Link>
        <a
          href={`https://wa.me/${WHATSAPP_NUMERO}?text=${waMsg}`}
          target="_blank"
          rel="noopener noreferrer"
          className="c-btn c-btn-ghost"
        >
          Commander en gros
        </a>
      </div>
    </article>
  )
}

export default function ProduitsClient() {
  const [categorie, setCategorie] = useState("Tous")
  const [recherche, setRecherche] = useState("")

  const filtres = PRODUITS.filter((p) => {
    const matchCat = categorie === "Tous" || p.categorie === categorie
    const q = recherche.trim().toLowerCase()
    const matchSearch =
      q === "" ||
      p.nom.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    return matchCat && matchSearch
  })

  return (
    <div className={`c-scope ${styles.page}`}>
      <a className={styles.skip} href="#contenu">Aller au contenu</a>
      <Navbar />

      <main id="contenu">
        <section className={`c-wrap ${styles.hero}`}>
          <p className="c-eyebrow">Le catalogue</p>
          <h1 className={styles.titre}>Les supports</h1>
          <p className={styles.chapo}>
            {PRODUITS.length} pièces à personnaliser : streetwear, ensembles et
            vêtements d&apos;entreprise. Chaque support peut recevoir votre visuel
            en impression DTF ou en broderie.
          </p>

          <div className={styles.recherche}>
            <label className={styles.rechercheLabel} htmlFor="recherche-produit">
              Rechercher un support
            </label>
            <input
              id="recherche-produit"
              type="search"
              className={styles.rechercheInput}
              placeholder="T-shirt, polo, hoodie…"
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
            />
          </div>
        </section>

        <div className={styles.filtres}>
          <div className="c-wrap">
            <div className={styles.filtresPiste} role="group" aria-label="Filtrer par catégorie">
              {FILTRES.map((cat) => {
                const actif = categorie === cat
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategorie(cat)}
                    aria-pressed={actif}
                    className={`${styles.filtre} ${actif ? styles.filtreActif : ""}`}
                  >
                    {cat}
                    {cat !== "Tous" && (
                      <span className={styles.filtreCompte}>
                        {PRODUITS.filter((p) => p.categorie === cat).length}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <section className={`c-wrap ${styles.resultats}`} aria-label="Résultats">
          <p className={styles.compte} aria-live="polite">
            {filtres.length === 0
              ? "Aucun support ne correspond."
              : `${filtres.length} support${filtres.length > 1 ? "s" : ""} affiché${filtres.length > 1 ? "s" : ""}`}
          </p>

          {filtres.length === 0 ? (
            <div className={styles.vide}>
              <p>Essayez un autre mot, ou revenez à la catégorie « Tous ».</p>
            </div>
          ) : (
            <div className={styles.grille}>
              {filtres.map((p) => (
                <CarteProduct key={p.id} p={p} />
              ))}
            </div>
          )}
        </section>

        {/* Planche récapitulative fournie par l'atelier : consultable en ligne
            et téléchargeable pour être envoyée à un client ou imprimée. */}
        <section className={`c-wrap ${styles.planche}`} aria-labelledby="t-planche">
          <div className={styles.plancheCarte}>
            <figure className={styles.plancheVue}>
              <img
                src="/catalogue/caractere-nos-produits-uniformes.jpg"
                alt="Planche Caractère « Nos produits & uniformes » : vingt-deux supports photographiés avec leur nom et leur grammage"
                loading="lazy"
                width={1024}
                height={1536}
              />
            </figure>
            <div>
              <p className="c-eyebrow">La planche</p>
              <h2 id="t-planche" className={styles.plancheTitre}>Nos produits &amp; uniformes, sur une page.</h2>
              <p className={styles.plancheTexte}>
                Tous nos supports photographiés avec leur nom et leur grammage. À
                garder sous la main, à imprimer ou à transmettre à votre équipe.
              </p>
              <div className={styles.plancheActions}>
                <a
                  href="/catalogue/caractere-nos-produits-uniformes.jpg"
                  download="caractere-nos-produits-uniformes.jpg"
                  className="c-btn c-btn-primary"
                >
                  Télécharger la planche
                </a>
                <a
                  href="/catalogue/caractere-nos-produits-uniformes.jpg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="c-btn c-btn-ghost"
                >
                  Voir en grand
                </a>
              </div>
            </div>
          </div>
        </section>

        <div className="c-wrap">
          <InfosCommerciales />
        </div>

        <section className={styles.final}>
          <div className="c-wrap">
            <p className={styles.finalEyebrow}>Une demande particulière</p>
            <h2 className={styles.finalTitre}>Un support qui n&apos;est pas dans la liste ?</h2>
            <p className={styles.finalTexte}>
              Dites-nous le vêtement, la quantité et la technique souhaitée. On
              revient vers vous avec la simulation et le devis.
            </p>
            <div className={styles.finalActions}>
              <a
                href={`https://wa.me/${WHATSAPP_NUMERO}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`c-btn ${styles.btnSombre}`}
              >
                Écrire sur WhatsApp
              </a>
              <Link href="/devis-express" className={`c-btn ${styles.btnClair}`}>
                Demander un devis
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
