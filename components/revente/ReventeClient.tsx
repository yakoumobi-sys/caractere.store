'use client'

// Parcours revendeur.
//
// Il manquait une entrée dédiée : un revendeur devait passer par le
// configurateur, pensé pour une pièce personnalisée à la fois. Ici, il
// compose directement sa série — plusieurs pièces du catalogue, une quantité
// par taille pour chacune — et demande un devis.
//
// Rien n'est chiffré tant que l'atelier n'a pas répondu : les paliers de
// remise sont affichés, mais les tarifs de gros et les frais de livraison
// ne nous ont pas été communiqués, donc la page ne les invente pas.

import { useMemo, useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import {
  CATALOGUE,
  PALIERS_REMISE,
  estTailleVestimentaire,
  lienConfigurateur,
  type CatalogueProduit,
} from '@/lib/catalogue'
import { lienWhatsApp } from '@/lib/contact'
import wilayas from '@/lib/data/wilayas.json'
import InfosCommerciales from '@/components/commun/InfosCommerciales'
import styles from './ReventeClient.module.css'

const daFormat = (n: number) => `${n.toLocaleString('fr-DZ')} DA`

/** Pièces les plus demandées en revente : ensembles, hoodies et joggers. */
const MISES_EN_AVANT = ['Ensembles', 'Streetwear'] as const

type Selection = Record<string, Record<string, number>>

export default function ReventeClient() {
  const [selection, setSelection] = useState<Selection>({})
  const [ouvert, setOuvert] = useState<string | null>(null)
  const [nom, setNom] = useState('')
  const [boutique, setBoutique] = useState('')
  const [telephone, setTelephone] = useState('')
  const [wilaya, setWilaya] = useState('')
  const [message, setMessage] = useState('')
  const [erreurs, setErreurs] = useState<Record<string, string>>({})

  const produits = useMemo(
    () => CATALOGUE.filter(p => (MISES_EN_AVANT as readonly string[]).includes(p.categorie)),
    [],
  )

  const definirQuantite = (produitId: string, taille: string, valeur: number) => {
    const n = Number.isFinite(valeur) ? Math.max(0, Math.min(9999, Math.floor(valeur))) : 0
    setSelection(prev => {
      const suite = { ...prev }
      const lignes = { ...(suite[produitId] ?? {}) }
      if (n === 0) delete lignes[taille]
      else lignes[taille] = n
      if (Object.keys(lignes).length === 0) delete suite[produitId]
      else suite[produitId] = lignes
      return suite
    })
  }

  /** Lignes retenues, avec le détail par taille et le sous-total quand il est connu. */
  const lignes = useMemo(() => {
    return Object.entries(selection)
      .map(([produitId, tailles]) => {
        const produit = produits.find(p => p.id === produitId)
        if (!produit) return null
        const detail = Object.entries(tailles)
          .filter(([, n]) => n > 0)
          .sort((a, b) => produit.tailles.indexOf(a[0]) - produit.tailles.indexOf(b[0]))
        const quantite = detail.reduce((somme, [, n]) => somme + n, 0)
        return { produit, detail, quantite }
      })
      .filter((l): l is { produit: CatalogueProduit; detail: [string, number][]; quantite: number } =>
        l !== null && l.quantite > 0,
      )
  }, [selection, produits])

  const quantiteTotale = lignes.reduce((somme, l) => somme + l.quantite, 0)

  // Sous-total des seules pièces dont le tarif unitaire est publié.
  const piecesChiffrees = lignes.filter(l => typeof l.produit.prix === 'number')
  const piecesSurDevis = lignes.filter(l => typeof l.produit.prix !== 'number')
  const sousTotalConnu = piecesChiffrees.reduce(
    (somme, l) => somme + (l.produit.prix as number) * l.quantite,
    0,
  )

  const envoyer = () => {
    const e: Record<string, string> = {}
    if (quantiteTotale < 1) e.selection = 'Ajoutez au moins une pièce à votre série.'
    if (!nom.trim()) e.nom = 'Indiquez votre nom.'
    if (!telephone.trim()) e.telephone = 'Indiquez un numéro pour vous joindre.'
    if (!wilaya) e.wilaya = 'Choisissez votre wilaya.'
    setErreurs(e)
    if (Object.keys(e).length > 0) return

    // Le message reprend exactement le tableau affiché à l'écran.
    const corps = [
      'Bonjour Caractère, je souhaite un devis revendeur.',
      '',
      ...lignes.map(
        l =>
          `• ${l.produit.nom} — ${l.detail.map(([t, n]) => `${t} × ${n}`).join(', ')} (total ${l.quantite})`,
      ),
      '',
      `Quantité totale : ${quantiteTotale} pièces`,
      piecesChiffrees.length > 0
        ? `Sous-total aux tarifs affichés : ${daFormat(sousTotalConnu)}${piecesSurDevis.length > 0 ? ' (hors pièces sur devis)' : ''}`
        : 'Montant : sur devis',
      'Livraison : à confirmer',
      '',
      `Nom : ${nom.trim()}`,
      ...(boutique.trim() ? [`Boutique / marque : ${boutique.trim()}`] : []),
      `Téléphone : ${telephone.trim()}`,
      `Wilaya : ${wilaya}`,
      ...(message.trim() ? ['', `Message : ${message.trim()}`] : []),
    ].join('\n')

    window.open(lienWhatsApp(corps), '_blank', 'noopener,noreferrer')
  }

  return (
    <div className={`c-scope ${styles.page}`}>
      <a className={styles.skip} href="#contenu">Aller au contenu</a>
      <Navbar />

      <main id="contenu">
        <section className={`c-wrap ${styles.hero}`}>
          <p className="c-eyebrow">Revendeurs &amp; boutiques</p>
          <h1 className={styles.titre}>Commander pour revendre</h1>
          <p className={styles.chapo}>
            Composez votre série : choisissez les pièces, indiquez les quantités par taille,
            et recevez un devis chiffré. Les tarifs revendeurs et les frais de livraison sont
            confirmés par l’atelier avant toute production.
          </p>

          <div className={styles.paliers}>
            {[...PALIERS_REMISE].reverse().map(palier => (
              <span key={palier.min} className={styles.palier}>
                <b>{palier.label}</b> · {palier.info}
              </span>
            ))}
          </div>
          <p className={styles.note}>
            Paliers appliqués aux pièces dont le tarif unitaire est publié. Pour les autres,
            l’atelier chiffre la série.
          </p>
        </section>

        {/* ── Sélection des pièces ── */}
        <section className={`c-wrap ${styles.section}`} aria-labelledby="t-pieces">
          <h2 id="t-pieces" className={styles.sousTitre}>1 · Choisissez vos pièces</h2>
          <p className={styles.note}>
            {produits.length} pièces disponibles en série. Dépliez une pièce pour saisir les
            quantités par taille.
          </p>

          <div className={styles.grille}>
            {produits.map(produit => {
              const tailles = produit.tailles.filter(estTailleVestimentaire)
              const lignesPiece = selection[produit.id] ?? {}
              const quantitePiece = Object.values(lignesPiece).reduce((s, n) => s + n, 0)
              const deplie = ouvert === produit.id

              return (
                <article
                  key={produit.id}
                  className={`${styles.carte} ${quantitePiece > 0 ? styles.carteActive : ''}`}
                >
                  <div className={styles.media}>
                    {produit.image ? (
                      <img src={produit.image} alt={produit.nom} loading="lazy" width={600} height={600} />
                    ) : (
                      <span className={styles.mediaVide}>{produit.nom}</span>
                    )}
                    {quantitePiece > 0 && (
                      <span className={styles.compteurBadge}>{quantitePiece}</span>
                    )}
                  </div>

                  <h3 className={styles.nom}>{produit.nom}</h3>
                  <p className={styles.desc}>{produit.description}</p>
                  {typeof produit.prix === 'number' ? (
                    <p className={styles.prix}>{daFormat(produit.prix)} / pièce</p>
                  ) : (
                    <p className={styles.prixDevis}>Tarif sur devis</p>
                  )}
                  {(produit.matiere || produit.grammage) && (
                    <p className={styles.matiere}>
                      {[produit.matiere, produit.grammage].filter(Boolean).join(' · ')}
                    </p>
                  )}

                  <button
                    type="button"
                    className={`c-btn c-btn-ghost ${styles.deplier}`}
                    onClick={() => setOuvert(deplie ? null : produit.id)}
                    aria-expanded={deplie}
                  >
                    {deplie ? 'Masquer les tailles' : 'Quantités par taille'}
                  </button>

                  {deplie && (
                    <div className={styles.tailles}>
                      {tailles.length === 0 ? (
                        <p className={styles.note}>Taille unique.</p>
                      ) : (
                        tailles.map(taille => {
                          const valeur = lignesPiece[taille] ?? 0
                          return (
                            <div key={taille} className={styles.ligneTaille}>
                              <span className={styles.ligneTailleNom}>{taille}</span>
                              <div className={styles.compteur}>
                                <button
                                  type="button"
                                  className={styles.compteurBtn}
                                  onClick={() => definirQuantite(produit.id, taille, valeur - 1)}
                                  disabled={valeur <= 0}
                                  aria-label={`Retirer une pièce ${produit.nom} en ${taille}`}
                                >−</button>
                                <input
                                  type="number"
                                  min={0}
                                  max={9999}
                                  inputMode="numeric"
                                  className={styles.compteurChamp}
                                  value={valeur}
                                  onChange={e =>
                                    definirQuantite(produit.id, taille, parseInt(e.target.value, 10))
                                  }
                                  aria-label={`Quantité ${produit.nom} en ${taille}`}
                                />
                                <button
                                  type="button"
                                  className={styles.compteurBtn}
                                  onClick={() => definirQuantite(produit.id, taille, valeur + 1)}
                                  aria-label={`Ajouter une pièce ${produit.nom} en ${taille}`}
                                >+</button>
                              </div>
                            </div>
                          )
                        })
                      )}
                      <Link href={lienConfigurateur(produit)} className={styles.lienFiche}>
                        Personnaliser cette pièce →
                      </Link>
                    </div>
                  )}
                </article>
              )
            })}
          </div>
          {erreurs.selection && <p className={styles.erreur} role="alert">{erreurs.selection}</p>}
        </section>

        {/* ── Récapitulatif et demande de devis ── */}
        <section className={`c-wrap ${styles.section}`} aria-labelledby="t-devis">
          <h2 id="t-devis" className={styles.sousTitre}>2 · Demandez votre devis</h2>

          <div className={styles.devisGrille}>
            <div className={styles.recap}>
              <p className={styles.recapTitre}>Votre série</p>
              {lignes.length === 0 ? (
                <p className={styles.note}>Aucune pièce sélectionnée pour l’instant.</p>
              ) : (
                <>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th scope="col">Pièce</th>
                        <th scope="col">Tailles</th>
                        <th scope="col">Qté</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lignes.map(l => (
                        <tr key={l.produit.id}>
                          <th scope="row">{l.produit.nom}</th>
                          <td>{l.detail.map(([t, n]) => `${t} × ${n}`).join(', ')}</td>
                          <td className={styles.nombre}>{l.quantite}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className={styles.montants}>
                    <div className={styles.montantLigne}>
                      <span>Quantité totale</span>
                      <span aria-live="polite">{quantiteTotale} pièces</span>
                    </div>
                    {piecesChiffrees.length > 0 && (
                      <div className={styles.montantLigne}>
                        <span>
                          Sous-total aux tarifs affichés
                          {piecesSurDevis.length > 0 && ' (hors pièces sur devis)'}
                        </span>
                        <span>{daFormat(sousTotalConnu)}</span>
                      </div>
                    )}
                    {piecesSurDevis.length > 0 && (
                      <div className={styles.montantLigne}>
                        <span>Pièces sur devis</span>
                        <span className={styles.aConfirmer}>{piecesSurDevis.length}</span>
                      </div>
                    )}
                    {/* Ni le tarif revendeur ni la livraison ne nous ont été
                        communiqués : on l'affiche, on ne l'estime pas. */}
                    <div className={styles.montantLigne}>
                      <span>Tarif revendeur</span>
                      <span className={styles.aConfirmer}>À confirmer par l’atelier</span>
                    </div>
                    <div className={styles.montantLigne}>
                      <span>Livraison</span>
                      <span className={styles.aConfirmer}>Livraison à confirmer</span>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className={styles.formulaire}>
              <div className={styles.champ}>
                <label className={styles.label} htmlFor="rev-nom">Votre nom</label>
                <input
                  id="rev-nom"
                  className={`${styles.input} ${erreurs.nom ? styles.inputErreur : ''}`}
                  value={nom}
                  onChange={e => setNom(e.target.value)}
                  autoComplete="name"
                  aria-invalid={!!erreurs.nom}
                />
                {erreurs.nom && <span className={styles.erreur} role="alert">{erreurs.nom}</span>}
              </div>

              <div className={styles.champ}>
                <label className={styles.label} htmlFor="rev-boutique">
                  Boutique ou marque <span className={styles.facultatif}>(facultatif)</span>
                </label>
                <input
                  id="rev-boutique"
                  className={styles.input}
                  value={boutique}
                  onChange={e => setBoutique(e.target.value)}
                  autoComplete="organization"
                />
              </div>

              <div className={styles.champ}>
                <label className={styles.label} htmlFor="rev-tel">Téléphone (WhatsApp)</label>
                <input
                  id="rev-tel"
                  type="tel"
                  inputMode="tel"
                  className={`${styles.input} ${erreurs.telephone ? styles.inputErreur : ''}`}
                  value={telephone}
                  onChange={e => setTelephone(e.target.value)}
                  placeholder="+213 6XX XXX XXX"
                  autoComplete="tel"
                  aria-invalid={!!erreurs.telephone}
                />
                {erreurs.telephone && <span className={styles.erreur} role="alert">{erreurs.telephone}</span>}
              </div>

              <div className={styles.champ}>
                <label className={styles.label} htmlFor="rev-wilaya">Wilaya</label>
                <select
                  id="rev-wilaya"
                  className={`${styles.input} ${erreurs.wilaya ? styles.inputErreur : ''}`}
                  value={wilaya}
                  onChange={e => setWilaya(e.target.value)}
                  aria-invalid={!!erreurs.wilaya}
                >
                  <option value="">—</option>
                  {(wilayas as { code: number; name: string }[]).map(w => (
                    <option key={w.code} value={w.name}>
                      {String(w.code).padStart(2, '0')} · {w.name}
                    </option>
                  ))}
                </select>
                {erreurs.wilaya && <span className={styles.erreur} role="alert">{erreurs.wilaya}</span>}
              </div>

              <div className={styles.champ}>
                <label className={styles.label} htmlFor="rev-message">
                  Message <span className={styles.facultatif}>(facultatif)</span>
                </label>
                <textarea
                  id="rev-message"
                  className={styles.zone}
                  rows={3}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Impression de votre logo, étiquettes, délai souhaité…"
                />
              </div>

              <button type="button" className="c-btn c-btn-accent" onClick={envoyer}>
                Demander le devis sur WhatsApp
              </button>
              <p className={styles.avertissement}>
                Ce bouton ouvre WhatsApp avec votre série déjà rédigée. Rien n’est enregistré
                à ce stade : la commande n’est confirmée qu’après le devis de l’atelier.
              </p>
            </div>
          </div>
        </section>
        <div className="c-wrap">
          <InfosCommerciales />
        </div>
      </main>

      <Footer />
    </div>
  )
}
