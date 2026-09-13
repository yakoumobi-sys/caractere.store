'use client'

import { useState, useRef, useEffect, useCallback, useId } from 'react'
import Image from 'next/image'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import {
  collectionProducts,
  themes,
  TAILLES_COLLECTION,
  NOTE_COLORIS_COLLECTION,
  NOTE_PRIX_COLLECTION,
} from '@/lib/collection-products'
import { lienWhatsApp, WHATSAPP_URL } from '@/lib/contact'
import wilayas from '@/lib/data/wilayas.json'
import InfosCommerciales from '@/components/commun/InfosCommerciales'
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
   Elle prépare un message WhatsApp reprenant exactement ce que la page
   affiche : pièce, tailles, quantités et montants. Elle n'enregistre
   rien — et le dit, pour qu'un clic vers WhatsApp ne soit jamais pris
   pour une commande confirmée. */
function ModaleCommande({
  product,
  onClose,
}: {
  product: Product
  onClose: () => void
}) {
  // Une quantité par taille : la somme fait la quantité commandée, il n'y a
  // donc pas deux chiffres à réconcilier.
  const [quantites, setQuantites] = useState<Record<string, number>>({ M: 1 })
  const [nom, setNom] = useState('')
  const [telephone, setTelephone] = useState('')
  const [wilaya, setWilaya] = useState('')
  const [commune, setCommune] = useState('')
  const [adresse, setAdresse] = useState('')
  const [remarque, setRemarque] = useState('')
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

  const definirQuantite = (taille: string, valeur: number) => {
    const n = Number.isFinite(valeur) ? Math.max(0, Math.min(999, Math.floor(valeur))) : 0
    setQuantites(prev => {
      const suite = { ...prev }
      if (n === 0) delete suite[taille]
      else suite[taille] = n
      return suite
    })
  }

  const lignes = Object.entries(quantites)
    .filter(([, n]) => n > 0)
    .sort((a, b) => TAILLES_COLLECTION.indexOf(a[0] as never) - TAILLES_COLLECTION.indexOf(b[0] as never))
  const quantiteTotale = lignes.reduce((somme, [, n]) => somme + n, 0)
  const sousTotal = product.price * quantiteTotale

  const valider = () => {
    const e: Record<string, string> = {}
    if (quantiteTotale < 1) e.quantite = 'Indiquez au moins une pièce, taille par taille.'
    if (!nom.trim()) e.nom = 'Indiquez votre nom.'
    if (!telephone.trim()) e.telephone = 'Indiquez un numéro pour vous joindre.'
    if (!wilaya) e.wilaya = 'Choisissez votre wilaya de livraison.'
    if (!commune.trim()) e.commune = 'Indiquez votre commune ou ville.'
    setErreurs(e)
    if (Object.keys(e).length > 0) return

    // Le message reprend mot pour mot ce qui est affiché au-dessus du bouton.
    const message = [
      'Bonjour Caractère, je souhaite commander une pièce de la collection.',
      '',
      `Pièce : ${product.name}`,
      `Coloris : celui de la photo`,
      `Tailles : ${lignes.map(([taille, n]) => `${taille} × ${n}`).join(', ')}`,
      `Quantité totale : ${quantiteTotale}`,
      `Prix unitaire : ${daFormat(product.price)}`,
      `Sous-total vêtements : ${daFormat(sousTotal)}`,
      'Livraison : à confirmer',
      '',
      `Nom : ${nom.trim()}`,
      `Téléphone : ${telephone.trim()}`,
      `Livraison : ${wilaya} — ${commune.trim()}${adresse.trim() ? ` — ${adresse.trim()}` : ''}`,
      ...(remarque.trim() ? ['', `Remarque : ${remarque.trim()}`] : []),
    ].join('\n')

    window.open(lienWhatsApp(message), '_blank', 'noopener,noreferrer')
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
        <p className={styles.mention}>{NOTE_PRIX_COLLECTION}</p>

        {/* ── Tailles et quantités ── */}
        <div className={styles.champ}>
          <span className={styles.label}>Tailles et quantités</span>
          <div className={styles.tailles}>
            {TAILLES_COLLECTION.map(taille => {
              const valeur = quantites[taille] ?? 0
              return (
                <div key={taille} className={`${styles.ligneTaille} ${valeur > 0 ? styles.ligneTailleActive : ''}`}>
                  <span className={styles.ligneTailleNom}>{taille}</span>
                  <div className={styles.quantite}>
                    <button
                      type="button"
                      className={styles.qteBtn}
                      onClick={() => definirQuantite(taille, valeur - 1)}
                      disabled={valeur <= 0}
                      aria-label={`Retirer une pièce en taille ${taille}`}
                    >−</button>
                    <input
                      type="number"
                      min={0}
                      max={999}
                      inputMode="numeric"
                      className={styles.qteChamp}
                      value={valeur}
                      onChange={(e) => definirQuantite(taille, parseInt(e.target.value, 10))}
                      aria-label={`Quantité en taille ${taille}`}
                    />
                    <button
                      type="button"
                      className={styles.qteBtn}
                      onClick={() => definirQuantite(taille, valeur + 1)}
                      aria-label={`Ajouter une pièce en taille ${taille}`}
                    >+</button>
                  </div>
                </div>
              )
            })}
          </div>
          {erreurs.quantite && <span className={styles.erreur} role="alert">{erreurs.quantite}</span>}

          <details className={styles.guide}>
            <summary className={styles.guideResume}>Guide des tailles</summary>
            <div className={styles.guideCorps}>
              <p>
                Pièces imprimées sur t-shirt, disponibles du S au XXL. Les mensurations
                détaillées (largeur de poitrine, longueur) ne sont pas encore publiées :
                demandez-les à l’atelier sur{' '}
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">WhatsApp</a>{' '}
                avant une commande en série.
              </p>
            </div>
          </details>

          <p className={styles.mention}>{NOTE_COLORIS_COLLECTION}</p>
        </div>

        {/* ── Coordonnées et livraison ── */}
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
          <label className={styles.label} htmlFor={`${titreId}-wilaya`}>Wilaya de livraison</label>
          <select
            id={`${titreId}-wilaya`}
            className={`${styles.input} ${erreurs.wilaya ? styles.inputErreur : ''}`}
            value={wilaya}
            onChange={(e) => setWilaya(e.target.value)}
            aria-invalid={!!erreurs.wilaya}
            aria-describedby={erreurs.wilaya ? `${titreId}-wilaya-err` : undefined}
          >
            <option value="">—</option>
            {(wilayas as { code: number; name: string }[]).map(w => (
              <option key={w.code} value={w.name}>
                {String(w.code).padStart(2, '0')} · {w.name}
              </option>
            ))}
          </select>
          {erreurs.wilaya && <span className={styles.erreur} id={`${titreId}-wilaya-err`} role="alert">{erreurs.wilaya}</span>}
        </div>

        <div className={styles.champ}>
          <label className={styles.label} htmlFor={`${titreId}-commune`}>Commune ou ville</label>
          <input
            id={`${titreId}-commune`}
            className={`${styles.input} ${erreurs.commune ? styles.inputErreur : ''}`}
            value={commune}
            onChange={(e) => setCommune(e.target.value)}
            aria-invalid={!!erreurs.commune}
            aria-describedby={erreurs.commune ? `${titreId}-commune-err` : undefined}
            autoComplete="address-level2"
          />
          {erreurs.commune && <span className={styles.erreur} id={`${titreId}-commune-err`} role="alert">{erreurs.commune}</span>}
        </div>

        <div className={styles.champ}>
          <label className={styles.label} htmlFor={`${titreId}-adresse`}>
            Adresse ou point de retrait <span className={styles.facultatif}>(facultatif)</span>
          </label>
          <input
            id={`${titreId}-adresse`}
            className={styles.input}
            value={adresse}
            onChange={(e) => setAdresse(e.target.value)}
            autoComplete="street-address"
          />
        </div>

        <div className={styles.champ}>
          <label className={styles.label} htmlFor={`${titreId}-remarque`}>
            Remarque <span className={styles.facultatif}>(facultatif)</span>
          </label>
          <input
            id={`${titreId}-remarque`}
            className={styles.input}
            value={remarque}
            onChange={(e) => setRemarque(e.target.value)}
            placeholder="Autre coloris souhaité, délai…"
          />
        </div>

        {/* ── Montants : le vêtement d'un côté, la livraison de l'autre ── */}
        <div className={styles.montants}>
          <div className={styles.montantLigne}>
            <span>Pièces</span>
            <span aria-live="polite">
              {lignes.length > 0
                ? lignes.map(([taille, n]) => `${taille} × ${n}`).join(', ')
                : '—'}
            </span>
          </div>
          <div className={styles.montantLigne}>
            <span>Quantité totale</span>
            <span aria-live="polite">{quantiteTotale}</span>
          </div>
          <div className={styles.montantLigne}>
            <span>Sous-total vêtements</span>
            <span>{daFormat(sousTotal)}</span>
          </div>
          {/* Les frais de livraison ne nous ont pas été communiqués : on
              l'affiche tel quel plutôt que d'avancer un tarif inventé. */}
          <div className={styles.montantLigne}>
            <span>Livraison</span>
            <span className={styles.aConfirmer}>Livraison à confirmer</span>
          </div>
          <div className={styles.total}>
            <span className={styles.totalLabel}>À régler pour les vêtements</span>
            <span className={styles.totalValeur}>{daFormat(sousTotal)}</span>
          </div>
        </div>

        <div className={styles.modaleActions}>
          <button type="button" className="c-btn c-btn-ghost" onClick={onClose}>Annuler</button>
          <button type="button" className="c-btn c-btn-accent" onClick={valider}>Préparer sur WhatsApp</button>
        </div>
        <p className={styles.avertissement}>
          Ce bouton ouvre WhatsApp avec le récapitulatif déjà rédigé. Rien n&apos;est
          enregistré à ce stade : votre commande n&apos;est confirmée qu&apos;après
          réponse de l&apos;atelier, frais de livraison compris.
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
        <div className="c-wrap">
          <InfosCommerciales />
        </div>
      </main>

      <Footer />

      {selection && <ModaleCommande product={selection} onClose={fermer} />}
    </div>
  )
}
