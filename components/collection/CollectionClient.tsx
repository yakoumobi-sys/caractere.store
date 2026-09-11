'use client'

import { useState, useRef, useEffect, useCallback, useId } from 'react'
import Image from 'next/image'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { collectionProducts, themes } from '@/lib/collection-products'
import styles from './CollectionClient.module.css'

interface Product {
  id: string
  name: string
  image: string
  price: number
  theme: string
}

const daFormat = (n: number) => `${n.toLocaleString('fr-DZ')} DA`

/* ── Photo produit ──────────────────────────────────────────────────
   Trois fichiers référencés par lib/collection-products.ts sont absents
   de public/collection. Plutôt qu'une image cassée — ou, pire, la photo
   d'une autre pièce — la carte annonce que la photo manque. */
function PhotoProduit({ product }: { product: Product }) {
  const [absente, setAbsente] = useState(false)

  if (absente) {
    return (
      <div className={styles.mediaVide}>
        <strong>Photo à venir</strong>
        <span>La pièce existe, son visuel n&apos;est pas encore en ligne.</span>
      </div>
    )
  }

  return (
    <Image
      src={product.image}
      alt={`${product.name} — pièce de la collection Caractère`}
      fill
      sizes="(max-width: 700px) 50vw, (max-width: 980px) 45vw, 30vw"
      onError={() => setAbsente(true)}
    />
  )
}

/* ── Modale de commande ─────────────────────────────────────────────
   Elle prépare un message WhatsApp. Elle n'enregistre rien : le texte
   de l'interface le dit explicitement. */
function ModaleCommande({
  product,
  onClose,
}: {
  product: Product
  onClose: () => void
}) {
  const [quantite, setQuantite] = useState(1)
  const [nom, setNom] = useState('')
  const [telephone, setTelephone] = useState('')
  const [ville, setVille] = useState('')
  const [erreurs, setErreurs] = useState<Record<string, string>>({})

  const modaleRef = useRef<HTMLDivElement>(null)
  const titreId = useId()

  // Échap ferme la modale, et le focus entre dedans à l'ouverture.
  // Le retour du focus sur le déclencheur est géré par le parent, qui
  // seul sait quel bouton a ouvert la modale.
  useEffect(() => {
    const surTouche = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', surTouche)
    modaleRef.current?.querySelector<HTMLElement>('input, button')?.focus()

    // Le fond ne doit pas défiler sous la modale sur mobile.
    const overflowInitial = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', surTouche)
      document.body.style.overflow = overflowInitial
    }
  }, [onClose])

  // Après un échec de validation, le focus part sur le premier champ fautif.
  // Il faut attendre le rendu : aria-invalid n'existe pas encore au moment
  // où setErreurs est appelé.
  useEffect(() => {
    if (Object.keys(erreurs).length === 0) return
    modaleRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
  }, [erreurs])

  const total = product.price * quantite

  const valider = () => {
    const e: Record<string, string> = {}
    if (!nom.trim()) e.nom = 'Indiquez votre nom.'
    if (!telephone.trim()) e.telephone = 'Indiquez un numéro pour vous joindre.'
    if (!ville.trim()) e.ville = 'Indiquez votre ville de livraison.'
    setErreurs(e)
    if (Object.keys(e).length > 0) return

    const message = [
      'Bonjour Caractère, je souhaite commander une pièce de la collection.',
      '',
      `Pièce : ${product.name}`,
      `Quantité : ${quantite}`,
      `Prix unitaire : ${daFormat(product.price)}`,
      `Total : ${daFormat(total)}`,
      '',
      `Nom : ${nom.trim()}`,
      `Téléphone : ${telephone.trim()}`,
      `Ville : ${ville.trim()}`,
    ].join('\n')

    window.open(`https://wa.me/213557440522?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer')
    onClose()
  }

  return (
    <div className={styles.voile} onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div
        ref={modaleRef}
        className={styles.modale}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titreId}
      >
        <div className={styles.modaleEntete}>
          <h2 id={titreId} className={styles.modaleTitre}>{product.name}</h2>
          <button type="button" className={styles.modaleFermer} onClick={onClose} aria-label="Fermer">✕</button>
        </div>
        <p className={styles.modalePrix}>{daFormat(product.price)} la pièce</p>

        <div className={styles.champ}>
          <span className={styles.label} id={`${titreId}-q`}>Quantité</span>
          <div className={styles.quantite}>
            <button
              type="button"
              className={styles.qteBtn}
              onClick={() => setQuantite(q => Math.max(1, q - 1))}
              disabled={quantite <= 1}
              aria-label="Retirer une pièce"
            >−</button>
            <output className={styles.qteValeur} aria-live="polite" aria-labelledby={`${titreId}-q`}>{quantite}</output>
            <button
              type="button"
              className={styles.qteBtn}
              onClick={() => setQuantite(q => Math.min(999, q + 1))}
              disabled={quantite >= 999}
              aria-label="Ajouter une pièce"
            >+</button>
          </div>
        </div>

        <div className={styles.champ}>
          <label className={styles.label} htmlFor={`${titreId}-nom`}>Votre nom</label>
          <input
            id={`${titreId}-nom`}
            className={`${styles.input} ${erreurs.nom ? styles.inputErreur : ''}`}
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            aria-invalid={!!erreurs.nom}
            aria-describedby={erreurs.nom ? `${titreId}-nom-err` : undefined}
            autoComplete="name"
          />
          {erreurs.nom && <span className={styles.erreur} id={`${titreId}-nom-err`} role="alert">{erreurs.nom}</span>}
        </div>

        <div className={styles.champ}>
          <label className={styles.label} htmlFor={`${titreId}-tel`}>Téléphone (WhatsApp)</label>
          <input
            id={`${titreId}-tel`}
            type="tel"
            inputMode="tel"
            className={`${styles.input} ${erreurs.telephone ? styles.inputErreur : ''}`}
            value={telephone}
            onChange={(e) => setTelephone(e.target.value)}
            placeholder="+213 6XX XXX XXX"
            aria-invalid={!!erreurs.telephone}
            aria-describedby={erreurs.telephone ? `${titreId}-tel-err` : undefined}
            autoComplete="tel"
          />
          {erreurs.telephone && <span className={styles.erreur} id={`${titreId}-tel-err`} role="alert">{erreurs.telephone}</span>}
        </div>

        <div className={styles.champ}>
          <label className={styles.label} htmlFor={`${titreId}-ville`}>Ville de livraison</label>
          <input
            id={`${titreId}-ville`}
            className={`${styles.input} ${erreurs.ville ? styles.inputErreur : ''}`}
            value={ville}
            onChange={(e) => setVille(e.target.value)}
            aria-invalid={!!erreurs.ville}
            aria-describedby={erreurs.ville ? `${titreId}-ville-err` : undefined}
            autoComplete="address-level2"
          />
          {erreurs.ville && <span className={styles.erreur} id={`${titreId}-ville-err`} role="alert">{erreurs.ville}</span>}
        </div>

        <div className={styles.total}>
          <span className={styles.totalLabel}>Total</span>
          <span className={styles.totalValeur}>{daFormat(total)}</span>
        </div>

        <div className={styles.modaleActions}>
          <button type="button" className="c-btn c-btn-ghost" onClick={onClose}>Annuler</button>
          <button type="button" className="c-btn c-btn-accent" onClick={valider}>Préparer sur WhatsApp</button>
        </div>
        <p className={styles.avertissement}>
          Ce bouton ouvre WhatsApp avec le récapitulatif déjà rédigé. Votre commande
          n&apos;est enregistrée qu&apos;une fois l&apos;atelier vous ayant répondu.
        </p>
      </div>
    </div>
  )
}

export default function CollectionClient() {
  const [selection, setSelection] = useState<Product | null>(null)
  // Élément qui a ouvert la modale : le focus y revient à la fermeture.
  const declencheurRef = useRef<HTMLElement | null>(null)

  const ouvrir = (product: Product, e: React.MouseEvent<HTMLButtonElement>) => {
    declencheurRef.current = e.currentTarget
    setSelection(product)
  }

  const fermer = useCallback(() => {
    setSelection(null)
    declencheurRef.current?.focus()
  }, [])

  return (
    <div className={`c-scope ${styles.page}`}>
      <a className={styles.skip} href="#contenu">Aller au contenu</a>
      <Navbar />

      <main id="contenu">
        <section className={`c-wrap ${styles.hero}`}>
          <p className="c-eyebrow">Pièces prêtes à porter</p>
          <h1 className={styles.titre}>La collection</h1>
          <p className={styles.chapo}>
            Nos prints, classés par univers. Chaque pièce est imprimée dans notre
            atelier à Alger et livrée dans les 58 wilayas.
          </p>
          <nav className={styles.sommaire} aria-label="Univers de la collection">
            {themes.map(t => <a key={t.key} href={`#${t.key}`}>{t.label}</a>)}
          </nav>
        </section>

        {themes.map(theme => {
          const data = collectionProducts[theme.key as keyof typeof collectionProducts]
          return (
            <section key={theme.key} id={theme.key} className={`c-wrap ${styles.theme}`} aria-labelledby={`t-${theme.key}`}>
              <p className="c-eyebrow">Univers</p>
              <h2 id={`t-${theme.key}`} className={styles.themeTitre}>{theme.label}</h2>
              <p className={styles.themeTexte}>{data.description}</p>

              <div className={styles.grille}>
                {data.products.map(product => (
                  <article key={product.id} className={styles.carte}>
                    <div className={styles.media}>
                      <PhotoProduit product={product} />
                    </div>
                    <h3 className={styles.nom}>{product.name}</h3>
                    <div className={styles.ligne}>
                      <span className={styles.prix}>{daFormat(product.price)}</span>
                    </div>
                    <button
                      type="button"
                      className={`c-btn c-btn-primary ${styles.commander}`}
                      onClick={(e) => ouvrir(product, e)}
                    >
                      Commander
                    </button>
                  </article>
                ))}
              </div>
            </section>
          )
        })}
      </main>

      <Footer />

      {selection && <ModaleCommande product={selection} onClose={fermer} />}
    </div>
  )
}
