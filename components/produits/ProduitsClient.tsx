'use client'

import { useState } from "react"
import Link from "next/link"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import styles from "./ProduitsClient.module.css"

type Produit = {
  id: string
  nom: string
  image: string
  categorie: string
  tailles: string[]
  description: string
  badge?: string
  /** Affiché seulement si renseigné — on n'invente pas de tarif pour les autres pièces. */
  prix?: string
}

const PRODUITS: Produit[] = [
  // ── CHROME ONE EN PREMIER ──
  {
    id: "chrome-one",
    nom: "CHROME ONE",
    image: "https://cdn.shopify.com/s/files/1/0668/1418/1491/files/1621F031-176E-4755-B2A4-A7585A2F9031.png",
    categorie: "Streetwear",
    tailles: ["S","M","L","XL"],
    description: "Tissu bouclette (serbita). Pièce signature.",
    badge: "Exclusif",
  },
  // ── STREETWEAR ──
  {
    id: "black-regular-tee",
    nom: "BLACK REGULAR TEE 210GSM",
    image: "https://cdn.shopify.com/s/files/1/0668/1418/1491/files/CFE2A2DA-BA00-4B18-B6F9-9975D4FBC581.jpg",
    categorie: "Streetwear",
    tailles: ["S","M","L","XL","XXL"],
    description: "T-shirt coton premium 210gsm. Coupe Regular.",
  },
  {
    id: "white-regular-tee",
    nom: "WHITE REGULAR TEE 250GSM",
    image: "https://cdn.shopify.com/s/files/1/0668/1418/1491/files/4FC9A90A-56B6-4321-861C-8A25489163D6.jpg",
    categorie: "Streetwear",
    tailles: ["S","M","L","XL","XXL"],
    description: "T-shirt coton premium 250gsm. Coupe Regular.",
  },
  {
    id: "white-oversized-tee",
    nom: "WHITE OVERSIZED TEE 250GSM",
    image: "https://cdn.shopify.com/s/files/1/0668/1418/1491/files/76CA8FA6-887F-4184-A691-1A188FF315A9.jpg",
    categorie: "Streetwear",
    tailles: ["S","M","L","XL","XXL"],
    description: "T-shirt oversized coton épais 250gsm.",
  },
  {
    id: "black-oversized-tee",
    nom: "BLACK OVERSIZED TEE 250GSM",
    image: "https://cdn.shopify.com/s/files/1/0668/1418/1491/files/3D8BCF35-BF82-47A6-9A20-1E64D94EABEE.jpg",
    categorie: "Streetwear",
    tailles: ["S","M","L","XL","XXL"],
    description: "T-shirt oversized coton épais 250gsm.",
  },
  {
    id: "short-caractere",
    nom: "SHORT CARACTERE",
    image: "https://cdn.shopify.com/s/files/1/0668/1418/1491/files/IMG-8887.png",
    categorie: "Streetwear",
    tailles: ["S","M","L","XL","XXL"],
    description: "Short premium. Coupe moderne, tissu respirant.",
  },
  {
    id: "baggy-jogger",
    nom: "BAGGY JOGGER",
    image: "https://cdn.shopify.com/s/files/1/0668/1418/1491/files/D0319F16-6189-4EC1-8F32-A0C9EF3BA832.png",
    categorie: "Streetwear",
    tailles: ["S","M","L","XL"],
    description: "Jogger baggy confort ultime. Coupe ample.",
  },
  {
    id: "oversized-jogger",
    nom: "OVERSIZED JOGGER",
    image: "https://cdn.shopify.com/s/files/1/0668/1418/1491/files/7027F65B-78FA-4D0E-8B0D-0C50240AACA0.jpg",
    categorie: "Streetwear",
    tailles: ["S","M","L","XL"],
    description: "Jogger surdimensionné tissu doux et extensible.",
  },
  {
    id: "premium-baggy-joggers",
    nom: "PREMIUM BAGGY JOGGERS",
    image: "https://cdn.shopify.com/s/files/1/0668/1418/1491/files/B08118E1-A004-4F3A-B2E3-676CE6E75870.jpg",
    categorie: "Streetwear",
    tailles: ["S","M","L","XL"],
    description: "Baggy jogger premium.",
  },
  {
    id: "hoodie-medium",
    nom: "HOODIE MEDIUM",
    image: "https://cdn.shopify.com/s/files/1/0668/1418/1491/files/7668ABF0-890B-48D4-A05D-22D3E8090A7A.jpg",
    categorie: "Streetwear",
    tailles: ["S","M","L","XL"],
    description: "Hoodie polyvalent et confortable.",
  },
  {
    id: "premium-hoodie",
    nom: "PREMIUM HOODIE",
    image: "https://cdn.shopify.com/s/files/1/0668/1418/1491/files/0D2EF14B-6EF7-4CCF-AFAF-0A7B02A3B304.png",
    categorie: "Streetwear",
    tailles: ["S","M","L","XL","XXL"],
    description: "Sweat-shirt premium confort incomparable.",
  },
  {
    id: "hoodie-premium-500gsm",
    nom: "HOODIE PREMIUM 500GSM",
    image: "https://cdn.shopify.com/s/files/1/0668/1418/1491/files/058ECD43-1772-45BA-AE92-6DAF6F6CCCB2.jpg",
    categorie: "Streetwear",
    tailles: ["S","M","L","XL"],
    description: "Le hoodie ultime 500gsm. Tissu lourd, coupe parfaite.",
    badge: "Premium",
  },
  {
    id: "zipper-hoodie",
    nom: "ZIPPER HOODIE",
    image: "https://cdn.shopify.com/s/files/1/0668/1418/1491/files/610D63C2-C065-4AEE-9444-6E9929D307D1.png",
    categorie: "Streetwear",
    tailles: ["S","M","L","XL","XXL"],
    description: "Sweat à capuche zippé. Design pratique et élégant.",
  },
  {
    id: "pull-caractere",
    nom: "PULL CARACTERE",
    image: "https://cdn.shopify.com/s/files/1/0668/1418/1491/files/IMG-1210.png",
    categorie: "Streetwear",
    tailles: ["S","M","L","XL","XXL"],
    description: "Pull incontournable. Tissu doux, idéal saison froide.",
  },
  {
    id: "veste-ninja",
    nom: "VESTE NINJA CARACTERE",
    image: "https://cdn.shopify.com/s/files/1/0668/1418/1491/files/IMG-1535.webp",
    categorie: "Streetwear",
    tailles: ["S","M","L","XL"],
    description: "Veste technique au style unique. Coupe ninja ajustée.",
    badge: "Nouveau",
  },
  // ── ENSEMBLES ──
  {
    id: "ensemble-blanc",
    nom: "ENSEMBLE BLANC (HOODIE + JOGGER)",
    image: "https://cdn.shopify.com/s/files/1/0668/1418/1491/files/8FA331B2-CB03-421D-B7A6-C71A77EB48A3.jpg",
    categorie: "Ensembles",
    tailles: ["S","M","L","XL","XXL"],
    description: "Ensemble hoodie + jogger assorti.",
  },
  {
    id: "ensemble-noir",
    nom: "ENSEMBLE HOODIE + JOGGER – NOIR",
    image: "https://cdn.shopify.com/s/files/1/0668/1418/1491/files/DC846844-3B4B-4123-BF75-707B645CCF84.png",
    categorie: "Ensembles",
    tailles: ["S","M","L","XL","XXL"],
    description: "Ensemble hoodie + jogger noir.",
  },
  {
    id: "ensemble-gris",
    nom: "ENSEMBLE HOODIE + JOGGER – GRIS",
    image: "https://cdn.shopify.com/s/files/1/0668/1418/1491/files/A221C04C-1598-4ACD-BD22-51B4D9351944.png",
    categorie: "Ensembles",
    tailles: ["S","M","L","XL","XXL"],
    description: "Ensemble hoodie + jogger gris.",
  },
  {
    id: "ensemble-zipper-baggy",
    nom: "ENSEMBLE ZIPPER + BAGGY",
    image: "https://cdn.shopify.com/s/files/1/0668/1418/1491/files/1C56C89E-1127-4FA1-8A27-7AF7C757619C.jpg",
    categorie: "Ensembles",
    tailles: ["S","M","L","XL","XXL"],
    description: "Ensemble veste zippée + pantalon ample.",
  },
  {
    id: "ensemble-veste-baggy",
    nom: "VESTE + BAGGY ELASTIQUE",
    image: "https://cdn.shopify.com/s/files/1/0668/1418/1491/files/38B475A2-3673-4DFD-9980-EBF27E2FE871.jpg",
    categorie: "Ensembles",
    tailles: ["S","M","L","XL"],
    description: "Ensemble veste + baggy élastique.",
  },
  {
    id: "ensemble-3-pieces",
    nom: "ENSEMBLE 3 PIÈCES",
    image: "https://cdn.shopify.com/s/files/1/0668/1418/1491/files/BF32F9EB-46BA-42AD-AC98-D86BA988FB4A.png",
    categorie: "Ensembles",
    tailles: ["S","M","L","XL"],
    description: "Ensemble 3 pièces complet.",
    prix: "5 000 DA",
    badge: "Premium",
  },
  // ── B2B ──
  {
    id: "polo-personnalise",
    nom: "POLO PERSONNALISÉ",
    image: "https://cdn.shopify.com/s/files/1/0668/1418/1491/files/506E8F49-8A75-4785-AA5C-B15E9BDD4667.webp",
    categorie: "B2B",
    tailles: ["S","M","L","XL","XXL"],
    description: "Polo personnalisé DTF ou broderie pour entreprises.",
    badge: "Devis gratuit",
  },
  {
    id: "polo-pro",
    nom: "POLO CARACTERE",
    image: "https://cdn.shopify.com/s/files/1/0668/1418/1491/files/30D38768-C5B4-475D-8387-B77C07BE3EC6.jpg",
    categorie: "B2B",
    tailles: ["S","M","L","XL","XXL"],
    description: "Polo demi-manche professionnel. Confort et élégance.",
  },
  {
    id: "tshirt-personnalise",
    nom: "T-SHIRTS PERSONNALISÉS",
    image: "https://cdn.shopify.com/s/files/1/0668/1418/1491/files/3D3096AD-C813-4B16-B8C8-AFE451835942.jpg",
    categorie: "B2B",
    tailles: ["S","M","L","XL","XXL"],
    description: "T-shirts personnalisés +15 couleurs. DTF ou broderie.",
    badge: "Devis gratuit",
  },
  {
    id: "gilet-travail",
    nom: "GILET DE TRAVAIL",
    image: "https://cdn.shopify.com/s/files/1/0668/1418/1491/files/F096140F-DEDA-4418-81D7-B3C688C02B4F.jpg",
    categorie: "B2B",
    tailles: ["S","M","L","XL"],
    description: "Gilet de travail sans manches. Liberté de mouvement.",
  },
  {
    id: "gilet-col-haut",
    nom: "GILET COL HAUT + POCHE",
    image: "https://cdn.shopify.com/s/files/1/0668/1418/1491/files/5717612A-4250-4225-B79E-72B0941C4DCA.jpg",
    categorie: "B2B",
    tailles: ["S","M","L","XL"],
    description: "Gilet col haut multipoches. Fonctionnel et confortable.",
    badge: "Devis gratuit",
  },
  {
    id: "gilet-personnalise",
    nom: "GILET PERSONNALISÉ COL ROND",
    image: "https://cdn.shopify.com/s/files/1/0668/1418/1491/files/2ABA5114-8B2D-481B-800C-B24FA51CD855.webp",
    categorie: "B2B",
    tailles: ["S","M","L","XL","XXL"],
    description: "Gilet col rond personnalisé. Simulation gratuite.",
    badge: "Devis gratuit",
  },
  {
    id: "tote-bag",
    nom: "TOTE BAG PERSONNALISÉ",
    image: "https://cdn.shopify.com/s/files/1/0668/1418/1491/files/IMG-3828.webp",
    categorie: "B2B",
    tailles: ["Unique"],
    description: "Tote bag coton naturel + impression DTF.",
    badge: "Devis gratuit",
  },
  {
    id: "tablier",
    nom: "TABLIER DE CUISINE PERSONNALISÉ",
    image: "https://cdn.shopify.com/s/files/1/0668/1418/1491/files/IMG-3999.jpg",
    categorie: "B2B",
    tailles: ["Unique"],
    description: "Tablier personnalisé durable. Idéal restauration.",
    badge: "Devis gratuit",
  },
  {
    id: "casquette",
    nom: "CASQUETTE PERSONNALISÉE",
    image: "https://cdn.shopify.com/s/files/1/0668/1418/1491/files/FFFDE421-D0F4-4B34-9096-BF52C840793D.webp",
    categorie: "B2B",
    tailles: ["Unique"],
    description: "Casquette personnalisée broderie ou DTF.",
    badge: "Devis gratuit",
  },
  {
    id: "pack-tshirt-b2b",
    nom: "T-SHIRT ENTREPRISE – PACK B2B",
    image: "https://cdn.shopify.com/s/files/1/0668/1418/1491/files/3D3096AD-C813-4B16-B8C8-AFE451835942.jpg",
    categorie: "B2B",
    tailles: ["S","M","L","XL"],
    description: "Pack 10 t-shirts entreprise personnalisés DTF.",
    badge: "Pack B2B",
  },
  {
    id: "pack-polo-b2b",
    nom: "POLO PROFESSIONNEL BRODÉ – PACK B2B",
    image: "https://cdn.shopify.com/s/files/1/0668/1418/1491/files/506E8F49-8A75-4785-AA5C-B15E9BDD4667.webp",
    categorie: "B2B",
    tailles: ["S","M","L","XL"],
    description: "Pack polo professionnel brodé pour entreprises.",
    badge: "Pack B2B",
  },
  {
    id: "pack-veste-b2b",
    nom: "VESTE DE TRAVAIL – PACK B2B",
    image: "https://cdn.shopify.com/s/files/1/0668/1418/1491/files/F096140F-DEDA-4418-81D7-B3C688C02B4F.jpg",
    categorie: "B2B",
    tailles: ["S","M","L","XL"],
    description: "Pack veste de travail personnalisée BTP/logistique.",
    badge: "Pack B2B",
  },
  {
    id: "pack-uniforme-complet",
    nom: "PACK UNIFORME COMPLET – CLÉ EN MAIN",
    image: "https://cdn.shopify.com/s/files/1/0668/1418/1491/files/30D38768-C5B4-475D-8387-B77C07BE3EC6.jpg",
    categorie: "B2B",
    tailles: ["Sur mesure"],
    description: "Solution clé en main. Polo, T-shirt, Veste ou formule sur mesure.",
    badge: "Clé en main",
  },
]

const CATEGORIES = ["Tous", "Streetwear", "Ensembles", "B2B"]

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
  const afficherTailles =
    p.tailles.length > 0 &&
    !["Disponible", "Sur mesure", "Unique"].includes(p.tailles[0])

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
      {p.prix && <p className={styles.prix}>{p.prix}</p>}

      {afficherTailles && (
        <div className={styles.tailles}>
          {p.tailles.map((t) => (
            <span key={t} className={styles.taille}>{t}</span>
          ))}
        </div>
      )}

      <div className={styles.actions}>
        <Link href={`/configurateur?produit=${encodeURIComponent(p.nom)}`} className="c-btn c-btn-primary">
          Configurer ma commande
        </Link>
        <a
          href={`https://wa.me/213557440522?text=${waMsg}`}
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
              {CATEGORIES.map((cat) => {
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
                href="https://wa.me/213557440522"
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
