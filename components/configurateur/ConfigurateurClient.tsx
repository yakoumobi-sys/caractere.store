'use client'

import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import Link from 'next/link'
import { supabaseClient as supabase } from '@/lib/supabase'
import type { Produit as ProduitBase } from '@/types'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import SelecteurLangue from '@/components/layout/SelecteurLangue'
import { FournisseurLangue, useLangue, formaterDA } from '@/lib/i18n'
import { WHATSAPP_URL, lienWhatsApp } from '@/lib/contact'
import {
  CATALOGUE,
  PALETTE_ATELIER,
  PALIERS_REMISE,
  resoudreProduit,
  calculerTarif,
  couleursPourProduit,
  dedupliquerCouleurs,
  estTailleVestimentaire,
  normaliser,
  type CatalogueProduit,
  type Coloris,
} from '@/lib/catalogue'
import wilayas from '@/lib/data/wilayas.json'
import InfosCommerciales from '@/components/commun/InfosCommerciales'
import styles from './ConfigurateurClient.module.css'

// Le configurateur sert deux entrées : /configurateur (tout public) et
// /entreprises (commandes B2B). Seul le contexte éditorial change — la
// logique de commande, elle, reste unique.
export type ConfigurateurVariant = 'default' | 'b2b'

const TECHNIQUES = ['DTF', 'Broderie', 'Conseil équipe'] as const
const POSITIONS = [
  'Logo petit — côté cœur',
  'Grand visuel — devant',
  'Grand visuel — dos',
  'Manche',
  'À définir avec l’atelier',
] as const

/** Clé utilisée pour les supports qui n'ont pas de taille (casquette, tote bag). */
const SANS_TAILLE = '__unique__'

/**
 * Délai au-delà duquel on cesse d'attendre Supabase pour résoudre le lien
 * entrant. Le catalogue statique suffit à ouvrir la bonne pièce ; laisser le
 * client devant une étape 1 vide le temps d'un délai réseau serait pire.
 */
const ATTENTE_CATALOGUE_MS = 2500

type Etape = 1 | 2 | 3 | 4

type Etat = {
  produitId: string | null
  couleur: string
  couleurHex: string
  /** taille → nombre de pièces. La somme fait la quantité commandée. */
  quantites: Record<string, number>
  technique: string
  position: string
  logoNom: string | null
  logoTaille: number
  logoApercu: string | null
  logoUrlEnvoyee: string | null
  nom: string
  entreprise: string
  telephone: string
  email: string
  notes: string
  wilaya: string
  commune: string
  adresse: string
  urgent: boolean
}

const ETAT_INITIAL: Etat = {
  produitId: null,
  couleur: '',
  couleurHex: '',
  quantites: {},
  technique: 'DTF',
  position: POSITIONS[0],
  logoNom: null,
  logoTaille: 0,
  logoApercu: null,
  logoUrlEnvoyee: null,
  nom: '',
  entreprise: '',
  telephone: '',
  email: '',
  notes: '',
  wilaya: '',
  commune: '',
  adresse: '',
  urgent: false,
}

/**
 * Fusionne le catalogue statique avec la table `produits` de Supabase.
 * Le catalogue reste la base — la page s'affiche donc immédiatement, même si
 * Supabase tarde ou échoue. Les lignes de la base ne font qu'ajuster le prix
 * des pièces qu'elles reconnaissent, ou ajouter un support absent du fichier.
 */
function fusionnerCatalogue(lignes: ProduitBase[] | null): CatalogueProduit[] {
  if (!lignes || lignes.length === 0) return CATALOGUE

  const fusionne = CATALOGUE.map(p => ({ ...p }))
  const parId = new Map(fusionne.map(p => [p.id, p]))

  for (const ligne of lignes) {
    const cible = resoudreProduit(ligne.nom)
    const existant = cible ? parId.get(cible.id) : undefined
    if (existant) {
      if (typeof ligne.prix_base === 'number' && ligne.prix_base > 0) {
        existant.prix = ligne.prix_base
      }
      continue
    }
    // Support créé dans l'admin et absent du fichier : on l'ajoute tel quel,
    // sans lui inventer de couleurs ni de tailles qu'on ne connaît pas.
    fusionne.push({
      id: `supabase-${normaliser(ligne.nom)}`,
      nom: ligne.nom,
      image: '',
      categorie: 'B2B',
      tailles: ['S', 'M', 'L', 'XL'],
      couleurs: null,
      description: ligne.description ?? '',
      prix: typeof ligne.prix_base === 'number' && ligne.prix_base > 0 ? ligne.prix_base : undefined,
    })
  }
  return fusionne
}

/* ────────────────────────────────────────────────────────────────────── */

export default function ConfigurateurClient({ variant = 'default' }: { variant?: ConfigurateurVariant }) {
  return (
    <FournisseurLangue>
      <Configurateur variant={variant} />
    </FournisseurLangue>
  )
}

function Configurateur({ variant }: { variant: ConfigurateurVariant }) {
  const { t, langue } = useLangue()

  const [etape, setEtape] = useState<Etape>(1)
  const [etat, setEtat] = useState<Etat>(ETAT_INITIAL)

  const [catalogue, setCatalogue] = useState<CatalogueProduit[]>(CATALOGUE)
  const [palette, setPalette] = useState<Coloris[]>(PALETTE_ATELIER)
  // Tant que le chargement n'est pas terminé, on ne résout aucun lien entrant :
  // c'est exactement ce qui manquait avant, et qui faisait avancer le
  // configurateur avec un produit vide.
  const [donneesChargees, setDonneesChargees] = useState(false)

  /** Référence produit reçue dans l'URL mais introuvable au catalogue. */
  const [produitIntrouvable, setProduitIntrouvable] = useState<string | null>(null)
  /** Vrai uniquement après un import de logo effectivement réussi. */
  const [logoImporteDuDesigner, setLogoImporteDuDesigner] = useState(false)

  const [envoiLogo, setEnvoiLogo] = useState(false)
  const [erreurLogo, setErreurLogo] = useState<string | null>(null)
  const [enregistrement, setEnregistrement] = useState(false)
  const [erreurEnvoi, setErreurEnvoi] = useState<string | null>(null)
  const [reference, setReference] = useState('')
  const [afficherManquants, setAfficherManquants] = useState(false)
  const [imagesCassees, setImagesCassees] = useState<string[]>([])

  const champFichier = useRef<HTMLInputElement>(null)
  const prefillFait = useRef(false)

  const marquerImageCassee = (id: string) =>
    setImagesCassees(prev => (prev.includes(id) ? prev : [...prev, id]))

  // ── Chargement du catalogue ────────────────────────────────────────
  // Le préremplissage attend la fin de ce chargement — sinon il résout le
  // lien entrant contre une liste incomplète. Mais l'attente est bornée :
  // si Supabase ne répond pas, le client reste sinon bloqué le temps du
  // délai réseau sur la pièce qu'il vient de cliquer. Passé ce délai, on
  // continue avec le catalogue statique, qui contient déjà tout le
  // catalogue public ; les données de la base s'appliquent si elles
  // arrivent plus tard.
  useEffect(() => {
    let annule = false

    const relache = setTimeout(() => {
      if (!annule) setDonneesChargees(true)
    }, ATTENTE_CATALOGUE_MS)

    Promise.all([
      supabase.from('produits').select('*').eq('actif', true).order('ordre'),
      supabase.from('couleurs').select('*').eq('actif', true).order('ordre'),
    ])
      .then(([p, c]) => {
        if (annule) return
        setCatalogue(fusionnerCatalogue(p.data as ProduitBase[] | null))
        const couleursBase = (c.data ?? []) as Coloris[]
        setPalette(couleursBase.length > 0 ? dedupliquerCouleurs(couleursBase) : PALETTE_ATELIER)
      })
      .catch(() => {
        /* le catalogue statique reste affiché : la page n'est jamais vide */
      })
      .finally(() => {
        if (annule) return
        clearTimeout(relache)
        setDonneesChargees(true)
      })

    return () => {
      annule = true
      clearTimeout(relache)
    }
  }, [])

  const produit = useMemo(
    () => catalogue.find(p => p.id === etat.produitId) ?? null,
    [catalogue, etat.produitId],
  )

  const couleurs = useMemo(() => couleursPourProduit(produit, palette), [produit, palette])
  const tailles = useMemo(() => produit?.tailles ?? [], [produit])
  const aDesTailles = tailles.some(estTailleVestimentaire)

  /**
   * Applique un produit à l'état : couleur par défaut compatible, et
   * quantités par taille conservées quand la taille existe encore sur la
   * nouvelle pièce (retour arrière sans perdre la saisie).
   */
  const choisirProduit = useCallback(
    (cible: CatalogueProduit, quantiteDepart?: number) => {
      setProduitIntrouvable(null)
      setEtat(prev => {
        const dispo = couleursPourProduit(cible, palette)
        const couleurConservee = dispo.find(c => normaliser(c.nom) === normaliser(prev.couleur))
        const couleur = couleurConservee ?? dispo[0] ?? { nom: '', hex: '' }

        const taillesCible = cible.tailles
        const porteDesTailles = taillesCible.some(estTailleVestimentaire)
        const quantites: Record<string, number> = {}
        if (porteDesTailles) {
          for (const taille of taillesCible) {
            const conservee = prev.quantites[taille]
            if (conservee && conservee > 0) quantites[taille] = conservee
          }
        } else {
          const total =
            Object.values(prev.quantites).reduce((s, n) => s + n, 0) || quantiteDepart || 1
          quantites[SANS_TAILLE] = total
        }
        // Aucune taille encore saisie : on amorce la première taille avec la
        // quantité de départ de la variante (1 en B2C, 20 en B2B).
        if (porteDesTailles && Object.keys(quantites).length === 0) {
          const premiere = taillesCible.find(estTailleVestimentaire)
          if (premiere) quantites[premiere] = quantiteDepart ?? (variant === 'b2b' ? 20 : 1)
        }

        return { ...prev, produitId: cible.id, couleur: couleur.nom, couleurHex: couleur.hex, quantites }
      })
    },
    [palette, variant],
  )

  // ── Envoi du logo ──────────────────────────────────────────────────
  const televerser = useCallback(async (fichier: File) => {
    setEnvoiLogo(true)
    setErreurLogo(null)
    try {
      const donnees = new FormData()
      donnees.append('file', fichier)
      const res = await fetch('/api/upload-logo', { method: 'POST', body: donnees })
      if (!res.ok) throw new Error('upload')
      const data = await res.json()
      if (!data?.url) throw new Error('upload')
      setEtat(prev => ({ ...prev, logoUrlEnvoyee: data.url }))
    } catch {
      // On le dit franchement plutôt que d'afficher « Fichier prêt » à tort.
      setErreurLogo(t('logo.echec'))
      setEtat(prev => ({ ...prev, logoUrlEnvoyee: null }))
    } finally {
      setEnvoiLogo(false)
    }
  }, [t])

  // ── Préremplissage depuis /produits, /designer ou un ancien lien ────
  //
  // En deux temps, pour ne jamais faire attendre le client sur une pièce
  // qu'il vient de cliquer, ni annoncer « introuvable » trop tôt :
  //
  //  1. Le catalogue statique contient déjà tout le catalogue public : s'il
  //     reconnaît la référence, on ouvre la pièce immédiatement.
  //  2. Sinon seulement, on attend la fin du chargement (borné) avant de
  //     chercher dans le catalogue fusionné, et de conclure à l'introuvable.
  //
  // Dans tous les cas la sélection n'est jamais vide : ou bien un produit est
  // retenu, ou bien on reste à l'étape 1 avec une explication.

  /** Applique la pièce trouvée, plus la couleur de l'URL si elle est valide. */
  const appliquerPrefill = useCallback(
    (trouve: CatalogueProduit, refCouleur: string | null) => {
      choisirProduit(trouve)
      if (refCouleur) {
        const dispo = couleursPourProduit(trouve, palette)
        const couleur = dispo.find(c => normaliser(c.nom) === normaliser(refCouleur))
        if (couleur) setEtat(prev => ({ ...prev, couleur: couleur.nom, couleurHex: couleur.hex }))
      }
      setEtape(2)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    [choisirProduit, palette],
  )

  /**
   * Import éventuel d'un visuel préparé dans le Designer. La confirmation
   * n'est affichée qu'une fois le fichier réellement reconstitué — pas
   * avant, et pas quand il n'y a rien à importer.
   */
  const importerDepuisDesigner = useCallback(() => {
    try {
      const brut = sessionStorage.getItem('designer_layers')
      if (!brut) return
      sessionStorage.removeItem('designer_layers')
      const calques = JSON.parse(brut)
      if (!Array.isArray(calques) || calques.length === 0) return
      const premier = calques[0]
      if (!premier?.src) return
      fetch(premier.src)
        .then(res => (res.ok ? res.blob() : Promise.reject(new Error('import'))))
        .then(blob => {
          const fichier = new File([blob], premier.name || 'logo-designer.png', { type: blob.type })
          setEtat(prev => ({
            ...prev,
            logoNom: fichier.name,
            logoTaille: fichier.size,
            logoApercu: premier.src,
          }))
          setLogoImporteDuDesigner(true)
          return televerser(fichier)
        })
        .catch(() => {
          // Import raté : aucune confirmation affichée, l'étape Logo propose
          // simplement d'envoyer le fichier à la main.
          setLogoImporteDuDesigner(false)
        })
    } catch {
      setLogoImporteDuDesigner(false)
    }
  }, [televerser])

  // 1 — Résolution immédiate contre le catalogue statique.
  useEffect(() => {
    if (prefillFait.current) return
    const params = new URLSearchParams(window.location.search)
    const refProduit = params.get('produit')
    if (!refProduit) {
      prefillFait.current = true
      return
    }
    const trouve = resoudreProduit(refProduit)
    if (!trouve) return // on laissera le second temps trancher

    prefillFait.current = true
    appliquerPrefill(trouve, params.get('couleur'))
    importerDepuisDesigner()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 2 — Référence non reconnue par le fichier : on attend la fin du
  //     chargement avant de chercher plus loin, puis de conclure.
  useEffect(() => {
    if (!donneesChargees || prefillFait.current) return
    prefillFait.current = true

    const params = new URLSearchParams(window.location.search)
    const refProduit = params.get('produit')
    if (!refProduit) return

    const trouve =
      catalogue.find(p => normaliser(p.id) === normaliser(refProduit)) ??
      catalogue.find(p => normaliser(p.nom) === normaliser(refProduit)) ??
      null

    if (!trouve) {
      // On reste à l'étape 1 et on explique. Jamais d'étape 2 sans produit.
      setProduitIntrouvable(refProduit)
      setEtape(1)
      return
    }

    appliquerPrefill(trouve, params.get('couleur'))
    importerDepuisDesigner()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [donneesChargees])

  // ── Quantités ──────────────────────────────────────────────────────
  const quantiteTotale = useMemo(
    () => Object.values(etat.quantites).reduce((somme, n) => somme + (n > 0 ? n : 0), 0),
    [etat.quantites],
  )

  const taillesCommandees = useMemo(
    () =>
      Object.entries(etat.quantites)
        .filter(([, n]) => n > 0)
        .map(([taille, n]) => ({ taille, quantite: n })),
    [etat.quantites],
  )

  const definirQuantite = (taille: string, valeur: number) => {
    const n = Number.isFinite(valeur) ? Math.max(0, Math.min(9999, Math.floor(valeur))) : 0
    setEtat(prev => {
      const quantites = { ...prev.quantites }
      if (n === 0) delete quantites[taille]
      else quantites[taille] = n
      return { ...prev, quantites }
    })
  }

  const tarif = useMemo(() => calculerTarif(produit, quantiteTotale), [produit, quantiteTotale])

  // ── Champs manquants ───────────────────────────────────────────────
  type Manque = { cle: string; libelle: string; etape: Etape }
  const manquants = useMemo<Manque[]>(() => {
    const liste: Manque[] = []
    if (!produit) liste.push({ cle: 'produit', libelle: t('manquants.produit'), etape: 1 })
    if (quantiteTotale < 1) liste.push({ cle: 'quantite', libelle: t('manquants.quantite'), etape: 2 })
    if (!etat.nom.trim()) liste.push({ cle: 'nom', libelle: t('manquants.nom'), etape: 4 })
    if (!etat.telephone.trim()) liste.push({ cle: 'telephone', libelle: t('manquants.telephone'), etape: 4 })
    if (!etat.wilaya) liste.push({ cle: 'wilaya', libelle: t('manquants.wilaya'), etape: 4 })
    return liste
  }, [produit, quantiteTotale, etat.nom, etat.telephone, etat.wilaya, t])

  const manqueSurEtape = (cle: string) => afficherManquants && manquants.some(m => m.cle === cle)

  const recevoirFichier = (fichier: File) => {
    setLogoImporteDuDesigner(false)
    setEtat(prev => ({
      ...prev,
      logoNom: fichier.name,
      logoTaille: fichier.size,
      logoApercu: null,
      logoUrlEnvoyee: null,
    }))
    if (fichier.type.startsWith('image/')) {
      const lecteur = new FileReader()
      lecteur.onload = e =>
        setEtat(prev => ({ ...prev, logoApercu: (e.target?.result as string) ?? null }))
      lecteur.readAsDataURL(fichier)
    }
    void televerser(fichier)
  }

  // ── Message WhatsApp : reprend exactement ce que la page affiche ────
  const construireMessage = (ref?: string) => {
    const lignes: string[] = ['Bonjour Caractère 👋', '']
    lignes.push(ref ? `*Commande ${ref}*` : '*Demande de commande*', '')
    lignes.push(`Produit : ${produit?.nom ?? '—'}`)
    if (etat.couleur) lignes.push(`Couleur : ${etat.couleur}`)
    lignes.push(`Technique : ${etat.technique}`)
    lignes.push(`Position : ${etat.position}`)
    if (aDesTailles) {
      lignes.push(
        `Tailles : ${taillesCommandees.map(l => `${l.taille} × ${l.quantite}`).join(', ') || '—'}`,
      )
    }
    lignes.push(`Quantité totale : ${quantiteTotale}`)
    if (etat.urgent) lignes.push('Commande urgente')
    lignes.push('')
    lignes.push(`Nom : ${etat.nom || '—'}`)
    if (etat.entreprise) lignes.push(`Entreprise : ${etat.entreprise}`)
    lignes.push(`Téléphone : ${etat.telephone || '—'}`)
    if (etat.email) lignes.push(`Email : ${etat.email}`)
    lignes.push(`Livraison : ${[etat.wilaya, etat.commune, etat.adresse].filter(Boolean).join(' — ') || '—'}`)
    if (etat.notes) lignes.push(`Notes : ${etat.notes}`)
    lignes.push('')
    // Les montants repris sont ceux affichés à l'écran, pas un autre calcul.
    if (tarif.chiffre) {
      lignes.push(`Sous-total vêtements : ${formaterDA(tarif.total, langue)}`)
      if (tarif.remise > 0) lignes.push(`Remise volume appliquée : −${Math.round(tarif.remise * 100)} %`)
      lignes.push('Livraison : à confirmer avec l’atelier')
    } else {
      lignes.push('Montant : sur devis (tarif non communiqué pour cette pièce)')
    }
    return lignes.join('\n')
  }

  // ── Enregistrement ─────────────────────────────────────────────────
  const enregistrer = async () => {
    if (enregistrement) return
    if (manquants.length > 0) {
      setAfficherManquants(true)
      const premier = manquants[0]
      setEtape(premier.etape)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    setAfficherManquants(false)
    setErreurEnvoi(null)
    setEnregistrement(true)
    try {
      const res = await fetch('/api/commandes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // Le serveur revalide tout et recalcule les prix : il ne reçoit ici
          // que le choix du client, jamais un montant.
          produit_id: produit!.id,
          couleur: etat.couleur,
          quantites: etat.quantites,
          technique: etat.technique,
          position: etat.position,
          urgent: etat.urgent,
          nom_client: etat.nom,
          entreprise: etat.entreprise,
          telephone: etat.telephone,
          email: etat.email,
          notes: etat.notes,
          wilaya: etat.wilaya,
          commune: etat.commune,
          adresse: etat.adresse,
          logo_url: etat.logoUrlEnvoyee,
          canal: variant === 'b2b' ? 'entreprises' : 'configurateur',
        }),
      })
      const resultat = await res.json().catch(() => null)
      // Aucune confirmation tant que le serveur n'a pas renvoyé une référence.
      if (!res.ok || resultat?.success !== true || !resultat?.reference) {
        throw new Error(resultat?.error ?? 'enregistrement')
      }
      setReference(resultat.reference)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch {
      setErreurEnvoi(t('erreur.enregistrement'))
    } finally {
      setEnregistrement(false)
    }
  }

  const allerA = (cible: Etape) => {
    setEtape(cible)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const continuer = () => {
    if (etape === 1) {
      if (!produit) {
        setAfficherManquants(true)
        return
      }
      allerA(2)
      return
    }
    if (etape === 2) {
      if (quantiteTotale < 1) {
        setAfficherManquants(true)
        return
      }
      allerA(3)
      return
    }
    if (etape === 3) {
      allerA(4)
      return
    }
    void enregistrer()
  }

  // ── Écran de confirmation ──────────────────────────────────────────
  if (reference) {
    return (
      <div className={`c-scope ${styles.page}`}>
        <Navbar />
        <main className={`c-wrap ${styles.confirmation}`}>
          <div className={styles.confirmationIcone} aria-hidden="true">✓</div>
          <h1 className={styles.confirmationTitre}>{t('confirmation.titre')}</h1>
          <p className={styles.confirmationTexte}>{t('confirmation.texte')}</p>

          <div className={styles.reference}>
            <div className={styles.referenceCle}>{t('confirmation.reference')}</div>
            <div className={styles.referenceVal}>{reference}</div>
          </div>

          <div className={styles.confirmationBloc}>
            <Recapitulatif
              produit={produit}
              etat={etat}
              tarif={tarif}
              quantiteTotale={quantiteTotale}
              taillesCommandees={taillesCommandees}
              aDesTailles={aDesTailles}
              t={t}
              langue={langue}
              sansTitre
            />
          </div>

          <div className={styles.confirmationActions}>
            <a
              href={lienWhatsApp(construireMessage(reference))}
              target="_blank"
              rel="noopener noreferrer"
              className="c-btn c-btn-accent"
            >
              {t('confirmation.whatsapp')}
            </a>
            <Link href={`/suivi/${encodeURIComponent(reference)}`} className="c-btn c-btn-ghost">
              {t('confirmation.suivre')}
            </Link>
          </div>
          <p style={{ marginTop: 18 }}>
            <button
              type="button"
              className={styles.lienSobre}
              onClick={() => {
                setEtat(ETAT_INITIAL)
                setReference('')
                setEtape(1)
                setAfficherManquants(false)
                setLogoImporteDuDesigner(false)
              }}
            >
              {t('confirmation.nouvelle')}
            </button>
          </p>
        </main>
        <Footer />
      </div>
    )
  }

  const libellesEtapes: { n: Etape; label: string }[] = [
    { n: 1, label: t('etape.produit') },
    { n: 2, label: t('etape.options') },
    { n: 3, label: t('etape.logo') },
    { n: 4, label: t('etape.contact') },
  ]

  const texteBouton =
    etape === 4 ? (enregistrement ? t('nav.envoi') : t('nav.confirmer')) : t('nav.continuer')

  return (
    <div className={`c-scope ${styles.page}`}>
      <a className={styles.skip} href="#contenu">Aller au contenu</a>
      <Navbar />

      {variant === 'b2b' && (
        <section className={styles.bandeau}>
          <div className={`c-wrap ${styles.bandeauGrille}`}>
            <div>
              <p className="c-eyebrow">Espace entreprises</p>
              <p className={styles.bandeauTitre}>Configurez la commande de votre équipe</p>
              <p className={styles.bandeauTexte}>
                Uniformes, workwear et goodies personnalisés. Devis chiffré après étude de votre
                logo et de vos quantités.
              </p>
            </div>
            <div className={styles.puces}>
              {['Maquette avant production', 'Tarifs dégressifs dès 50 pièces', 'Vectorisation incluse'].map(p => (
                <span key={p} className={styles.puce}>{p}</span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Frise d'étapes 1 → 2 → 3 → 4 ── */}
      <div className={styles.frise}>
        <div className={`c-wrap ${styles.friseGrille}`}>
          <nav className={styles.frisePiste} aria-label="Étapes de la commande">
            {libellesEtapes.map((s, i) => {
              const faite = etape > s.n
              const active = etape === s.n
              // On ne laisse revenir que sur les étapes déjà franchies : la
              // saisie en cours n'est jamais perdue par un clic en avant.
              const accessible = s.n <= etape
              return (
                <div key={s.n} className={styles.etapeBloc}>
                  {i > 0 && <span className={`${styles.etapeTrait} ${faite || active ? styles.etapeTraitFait : ''}`} />}
                  <button
                    type="button"
                    className={`${styles.etape} ${faite ? styles.etapeFaite : ''} ${active ? styles.etapeActive : ''}`}
                    onClick={() => accessible && allerA(s.n)}
                    disabled={!accessible}
                    aria-current={active ? 'step' : undefined}
                  >
                    <span className={styles.etapeNum}>{faite ? '✓' : s.n}</span>
                    <span className={styles.etapeLabel}>{s.label}</span>
                  </button>
                </div>
              )
            })}
          </nav>

          <div className={styles.friseTotal}>
            <SelecteurLangue />
          </div>
        </div>
      </div>

      <main id="contenu" className={`c-wrap ${styles.corps}`}>
        <div className={styles.grille}>
          <div>
            {/* ═══ ÉTAPE 1 — Produit ═══ */}
            {etape === 1 && (
              <section>
                <p className={styles.etiquette}>{t('etape.numero')} 1 / 4</p>
                <h1 className={styles.titre}>
                  {variant === 'b2b' ? t('produit.b2bTitre') : t('produit.titre')}
                </h1>
                <p className={styles.sous}>
                  {variant === 'b2b' ? t('produit.b2bSous') : t('produit.sous')}
                </p>

                {produitIntrouvable && (
                  <div className={styles.alerte} role="alert">
                    <p className={styles.alerteTitre}>{t('introuvable.titre')}</p>
                    <p className={styles.alerteTexte}>{t('introuvable.texte')}</p>
                  </div>
                )}

                {!donneesChargees && <p className={styles.sous}>{t('produit.chargement')}</p>}

                <div className={styles.produits}>
                  {catalogue.map(p => {
                    const choisi = etat.produitId === p.id
                    const cassee = imagesCassees.includes(p.id) || !p.image
                    return (
                      <button
                        type="button"
                        key={p.id}
                        onClick={() => {
                          choisirProduit(p)
                          setAfficherManquants(false)
                          allerA(2)
                        }}
                        className={`${styles.produitCarte} ${choisi ? styles.produitCarteActive : ''}`}
                        aria-pressed={choisi}
                      >
                        <div className={styles.produitMedia}>
                          {cassee ? (
                            <span className={styles.produitMediaVide}>{p.nom}</span>
                          ) : (
                            <img
                              src={p.image}
                              alt={p.nom}
                              loading="lazy"
                              width={600}
                              height={600}
                              onError={() => marquerImageCassee(p.id)}
                            />
                          )}
                          {choisi && <span className={styles.produitCoche} aria-hidden="true">✓</span>}
                        </div>
                        <div className={styles.produitCorps}>
                          <span className={styles.produitNom}>{p.nom}</span>
                          {p.description && <span className={styles.produitDesc}>{p.description}</span>}
                          {typeof p.prix === 'number' ? (
                            <span className={styles.produitPrix}>
                              {t('produit.des')} {formaterDA(p.prix, langue)}
                            </span>
                          ) : (
                            <span className={styles.produitDevis}>{t('produit.devis')}</span>
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </section>
            )}

            {/* ═══ ÉTAPE 2 — Options ═══ */}
            {etape === 2 && produit && (
              <section>
                <p className={styles.etiquette}>{t('etape.numero')} 2 / 4</p>
                <h1 className={styles.titre}>{t('options.titre')}</h1>
                <p className={styles.sous}>{t('options.sous')}</p>

                {logoImporteDuDesigner && (
                  <div className={styles.importOk} role="status">
                    <span aria-hidden="true">✓</span>
                    <span>
                      <strong>{produit.nom}</strong> · {etat.couleur} — {t('logo.importe')}
                    </span>
                  </div>
                )}

                {/* Technique */}
                <div className={styles.bloc}>
                  <p className={styles.blocTitre}>{t('options.technique')}</p>
                  <div className={styles.choix}>
                    {TECHNIQUES.map(tech => (
                      <button
                        key={tech}
                        type="button"
                        onClick={() => setEtat(prev => ({ ...prev, technique: tech }))}
                        className={`${styles.choixBtn} ${etat.technique === tech ? styles.choixActif : ''}`}
                        aria-pressed={etat.technique === tech}
                      >
                        {tech}
                      </button>
                    ))}
                  </div>
                  {etat.technique === 'DTF' && (
                    <p className={styles.aide}>
                      Impression haute définition, couleurs et dégradés, sur coton comme sur mélange.
                    </p>
                  )}
                  {etat.technique === 'Broderie' && (
                    <p className={styles.aide}>
                      Fil cousu dans le textile : relief et tenue au lavage. Idéale pour les logos
                      sur polos, casquettes et vêtements de travail.
                    </p>
                  )}
                </div>

                {/* Position */}
                <div className={styles.bloc}>
                  <p className={styles.blocTitre}>Emplacement du visuel</p>
                  <div className={styles.choix}>
                    {POSITIONS.map(pos => (
                      <button
                        key={pos}
                        type="button"
                        onClick={() => setEtat(prev => ({ ...prev, position: pos }))}
                        className={`${styles.choixBtn} ${etat.position === pos ? styles.choixActif : ''}`}
                        aria-pressed={etat.position === pos}
                      >
                        {pos}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Couleur — uniquement les coloris où la pièce existe */}
                <div className={styles.bloc}>
                  <p className={styles.blocTitre}>
                    {t('options.couleur')} — <em>{etat.couleur || '—'}</em>
                  </p>
                  {couleurs.length <= 1 ? (
                    <p className={styles.couleurUnique}>{t('options.couleurUnique')}</p>
                  ) : (
                    <div className={styles.pastilles}>
                      {couleurs.map(c => (
                        <button
                          key={`${c.nom}-${c.hex}`}
                          type="button"
                          title={c.nom}
                          aria-label={c.nom}
                          aria-pressed={normaliser(etat.couleur) === normaliser(c.nom)}
                          onClick={() => setEtat(prev => ({ ...prev, couleur: c.nom, couleurHex: c.hex }))}
                          className={`${styles.pastille} ${normaliser(etat.couleur) === normaliser(c.nom) ? styles.pastilleActive : ''}`}
                          style={{ background: c.hex }}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Tailles et quantités */}
                <div className={styles.bloc}>
                  <p className={styles.blocTitre}>
                    {aDesTailles ? t('options.tailles') : t('options.sansTaille')}
                  </p>
                  {aDesTailles && <p className={styles.aide} style={{ marginTop: 0, marginBottom: 12 }}>{t('options.taillesAide')}</p>}

                  <div className={styles.tailles}>
                    {(aDesTailles ? tailles.filter(estTailleVestimentaire) : [SANS_TAILLE]).map(taille => {
                      const valeur = etat.quantites[taille] ?? 0
                      return (
                        <div
                          key={taille}
                          className={`${styles.ligneTaille} ${valeur > 0 ? styles.ligneTailleActive : ''}`}
                        >
                          <span className={styles.ligneTailleNom}>
                            {taille === SANS_TAILLE ? 'Pièces' : taille}
                          </span>
                          <div className={styles.compteur}>
                            <button
                              type="button"
                              className={styles.compteurBtn}
                              onClick={() => definirQuantite(taille, valeur - 1)}
                              disabled={valeur <= 0}
                              aria-label={`Retirer une pièce en ${taille === SANS_TAILLE ? 'taille unique' : taille}`}
                            >−</button>
                            <input
                              type="number"
                              min={0}
                              max={9999}
                              inputMode="numeric"
                              className={styles.compteurChamp}
                              value={valeur}
                              onChange={e => definirQuantite(taille, parseInt(e.target.value, 10))}
                              aria-label={`Quantité en ${taille === SANS_TAILLE ? 'taille unique' : taille}`}
                            />
                            <button
                              type="button"
                              className={styles.compteurBtn}
                              onClick={() => definirQuantite(taille, valeur + 1)}
                              aria-label={`Ajouter une pièce en ${taille === SANS_TAILLE ? 'taille unique' : taille}`}
                            >+</button>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  <p className={styles.totalPieces}>
                    <span>{t('options.total')}</span>
                    <span className={styles.totalPiecesValeur} aria-live="polite">{quantiteTotale}</span>
                  </p>
                  {manqueSurEtape('quantite') && (
                    <p className={styles.erreur} role="alert">{t('manquants.quantite')}</p>
                  )}

                  {aDesTailles && <GuideTailles tailles={tailles} produit={produit} />}

                  {/* Paliers de remise — seulement si la pièce a un tarif connu */}
                  {typeof produit.prix === 'number' && (
                    <>
                      <p className={styles.blocTitre} style={{ marginTop: 22 }}>{t('options.paliers')}</p>
                      <div className={styles.paliers}>
                        {[...PALIERS_REMISE].reverse().map(palier => {
                          const actif =
                            quantiteTotale >= palier.min &&
                            !PALIERS_REMISE.some(p => p.min > palier.min && quantiteTotale >= p.min)
                          return (
                            <span key={palier.min} className={`${styles.palier} ${actif ? styles.palierActif : ''}`}>
                              <span className={styles.palierNom}>{palier.label}</span> · {palier.info}
                            </span>
                          )
                        })}
                      </div>
                    </>
                  )}
                </div>
              </section>
            )}

            {/* Garde-fou : impossible d'être à l'étape 2+ sans produit. */}
            {etape > 1 && !produit && (
              <section>
                <div className={styles.alerte} role="alert">
                  <p className={styles.alerteTitre}>{t('introuvable.titre')}</p>
                  <p className={styles.alerteTexte}>{t('introuvable.texte')}</p>
                </div>
                <button type="button" className="c-btn c-btn-primary" onClick={() => allerA(1)}>
                  {t('manquants.produit')}
                </button>
              </section>
            )}

            {/* ═══ ÉTAPE 3 — Logo ═══ */}
            {etape === 3 && produit && (
              <section>
                <p className={styles.etiquette}>{t('etape.numero')} 3 / 4</p>
                <h1 className={styles.titre}>{t('logo.titre')}</h1>
                <p className={styles.sous}>{t('logo.sous')}</p>

                {!etat.logoNom ? (
                  <div
                    className={styles.depot}
                    role="button"
                    tabIndex={0}
                    onClick={() => champFichier.current?.click()}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        champFichier.current?.click()
                      }
                    }}
                    onDragOver={e => e.preventDefault()}
                    onDrop={e => {
                      e.preventDefault()
                      const f = e.dataTransfer.files[0]
                      if (f) recevoirFichier(f)
                    }}
                  >
                    <p className={styles.depotTitre}>{t('logo.depot')}</p>
                    <p className={styles.depotSous}>{t('logo.parcourir')}</p>
                    <span className={styles.depotFormats}>AI · EPS · SVG · PDF · PNG · JPG</span>
                  </div>
                ) : (
                  <div className={styles.fichier}>
                    {etat.logoApercu && (
                      <img src={etat.logoApercu} alt="" className={styles.fichierVignette} />
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p className={styles.fichierNom}>{etat.logoNom}</p>
                      <p className={styles.fichierMeta}>{Math.max(1, Math.round(etat.logoTaille / 1024))} Ko</p>
                      {envoiLogo && <p className={styles.fichierMeta}>{t('logo.envoi')}</p>}
                      {/* La mention n'apparaît qu'après un envoi réellement abouti. */}
                      {!envoiLogo && etat.logoUrlEnvoyee && <p className={styles.fichierPret}>{t('logo.pret')}</p>}
                      {!envoiLogo && erreurLogo && <p className={styles.erreur} role="alert">{erreurLogo}</p>}
                    </div>
                    <button
                      type="button"
                      className={styles.fichierRetirer}
                      onClick={() => {
                        setEtat(prev => ({
                          ...prev,
                          logoNom: null,
                          logoTaille: 0,
                          logoApercu: null,
                          logoUrlEnvoyee: null,
                        }))
                        setErreurLogo(null)
                        setLogoImporteDuDesigner(false)
                      }}
                    >
                      {t('logo.retirer')}
                    </button>
                  </div>
                )}

                <input
                  ref={champFichier}
                  type="file"
                  hidden
                  accept=".ai,.eps,.svg,.pdf,.png,.jpg,.jpeg"
                  onChange={e => {
                    const f = e.target.files?.[0]
                    if (f) recevoirFichier(f)
                  }}
                />

                <p className={styles.aide}>
                  Pas de fichier vectoriel ? Envoyez ce que vous avez — photo ou croquis. La
                  vectorisation est réalisée par l’atelier avant production.
                </p>
              </section>
            )}

            {/* ═══ ÉTAPE 4 — Coordonnées ═══ */}
            {etape === 4 && produit && (
              <section>
                <p className={styles.etiquette}>{t('etape.numero')} 4 / 4</p>
                <h1 className={styles.titre}>{t('contact.titre')}</h1>
                <p className={styles.sous}>{t('contact.sous')}</p>

                <div className={styles.champs}>
                  <Champ
                    id="nom"
                    label={t('contact.nom')}
                    requis
                    valeur={etat.nom}
                    onChange={v => setEtat(p => ({ ...p, nom: v }))}
                    erreur={manqueSurEtape('nom') ? t('manquants.nom') : null}
                    autoComplete="name"
                    t={t}
                  />
                  <Champ
                    id="entreprise"
                    label={t('contact.entreprise')}
                    valeur={etat.entreprise}
                    onChange={v => setEtat(p => ({ ...p, entreprise: v }))}
                    autoComplete="organization"
                    t={t}
                  />
                  <Champ
                    id="telephone"
                    label={t('contact.telephone')}
                    requis
                    type="tel"
                    placeholder="+213 6XX XXX XXX"
                    valeur={etat.telephone}
                    onChange={v => setEtat(p => ({ ...p, telephone: v }))}
                    erreur={manqueSurEtape('telephone') ? t('manquants.telephone') : null}
                    autoComplete="tel"
                    t={t}
                  />
                  <Champ
                    id="email"
                    label={t('contact.email')}
                    type="email"
                    placeholder="vous@exemple.com"
                    valeur={etat.email}
                    onChange={v => setEtat(p => ({ ...p, email: v }))}
                    autoComplete="email"
                    t={t}
                  />

                  <div className={styles.champ}>
                    <label className={styles.label} htmlFor="wilaya">
                      {t('contact.wilaya')} <span className={styles.labelOption}>({t('contact.obligatoire')})</span>
                    </label>
                    <select
                      id="wilaya"
                      className={`${styles.input} ${manqueSurEtape('wilaya') ? styles.inputErreur : ''}`}
                      value={etat.wilaya}
                      onChange={e => setEtat(p => ({ ...p, wilaya: e.target.value }))}
                      aria-invalid={manqueSurEtape('wilaya')}
                    >
                      <option value="">—</option>
                      {(wilayas as { code: number; name: string }[]).map(w => (
                        <option key={w.code} value={w.name}>
                          {String(w.code).padStart(2, '0')} · {w.name}
                        </option>
                      ))}
                    </select>
                    {manqueSurEtape('wilaya') && (
                      <span className={styles.erreur} role="alert">{t('manquants.wilaya')}</span>
                    )}
                  </div>

                  <Champ
                    id="commune"
                    label={t('contact.commune')}
                    valeur={etat.commune}
                    onChange={v => setEtat(p => ({ ...p, commune: v }))}
                    autoComplete="address-level2"
                    t={t}
                  />
                  <div className={styles.champLarge}>
                    <Champ
                      id="adresse"
                      label={t('contact.adresse')}
                      valeur={etat.adresse}
                      onChange={v => setEtat(p => ({ ...p, adresse: v }))}
                      autoComplete="street-address"
                      t={t}
                    />
                  </div>

                  <div className={styles.champLarge}>
                    <button
                      type="button"
                      className={`${styles.bascule} ${etat.urgent ? styles.basculeActive : ''}`}
                      onClick={() => setEtat(p => ({ ...p, urgent: !p.urgent }))}
                      aria-pressed={etat.urgent}
                    >
                      <span>
                        <span className={styles.basculeTitre}>{t('contact.urgent')}</span>
                        <span className={styles.basculeSous}>{t('contact.urgentSous')}</span>
                      </span>
                      <span className={styles.basculeVoyant} aria-hidden="true" />
                    </button>
                  </div>

                  <div className={`${styles.champ} ${styles.champLarge}`}>
                    <label className={styles.label} htmlFor="notes">
                      {t('contact.notes')} <span className={styles.labelOption}>({t('contact.facultatif')})</span>
                    </label>
                    <textarea
                      id="notes"
                      className={styles.zone}
                      rows={3}
                      value={etat.notes}
                      placeholder="Précisions sur le visuel, les couleurs, le délai souhaité…"
                      onChange={e => setEtat(p => ({ ...p, notes: e.target.value }))}
                    />
                  </div>
                </div>

                {afficherManquants && manquants.length > 0 && (
                  <div className={styles.manquants} role="alert">
                    <p className={styles.manquantsTitre}>{t('manquants.titre')}</p>
                    <ul className={styles.manquantsListe}>
                      {manquants.map(m => (
                        <li key={m.cle}>
                          <button type="button" onClick={() => allerA(m.etape)}>{m.libelle}</button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {erreurEnvoi && (
                  <div className={styles.manquants} role="alert">
                    <p className={styles.manquantsTitre}>{erreurEnvoi}</p>
                    <a
                      href={lienWhatsApp(construireMessage())}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="c-btn c-btn-ghost"
                      style={{ marginTop: 12 }}
                    >
                      {t('erreur.whatsapp')}
                    </a>
                  </div>
                )}
              </section>
            )}

            {/* Navigation (écrans larges) */}
            <div className={styles.nav}>
              {etape > 1 && (
                <button type="button" className="c-btn c-btn-ghost" onClick={() => allerA((etape - 1) as Etape)}>
                  {t('nav.retour')}
                </button>
              )}
              {(etape > 1 || produit) && (
                <button
                  type="button"
                  className="c-btn c-btn-accent"
                  onClick={continuer}
                  disabled={enregistrement}
                >
                  {etape === 3 && !etat.logoNom ? t('nav.passer') : texteBouton}
                </button>
              )}
            </div>
          </div>

          {/* ── Colonne résumé ── */}
          <aside className={styles.aside}>
            {produit?.image && !imagesCassees.includes(produit.id) && (
              <div className={styles.apercu}>
                <img
                  src={produit.image}
                  alt={produit.nom}
                  width={600}
                  height={600}
                  onError={() => marquerImageCassee(produit.id)}
                />
              </div>
            )}

            <div className={styles.resume}>
              <Recapitulatif
                produit={produit}
                etat={etat}
                tarif={tarif}
                quantiteTotale={quantiteTotale}
                taillesCommandees={taillesCommandees}
                aDesTailles={aDesTailles}
                t={t}
                langue={langue}
              />
            </div>

            <div className={styles.garanties}>
              {[
                { titre: 'Atelier à Alger', sous: 'DTF, broderie et sérigraphie sur place' },
                { titre: 'Livraison 58 wilayas', sous: 'Frais et délai confirmés avec l’atelier' },
                { titre: 'Maquette avant production', sous: 'Validation de votre visuel avant lancement' },
              ].map(g => (
                <div key={g.titre} className={styles.garantie}>
                  <span aria-hidden="true">•</span>
                  <span>
                    <span className={styles.garantieTitre}>{g.titre}</span>
                    <span className={styles.garantieSous} style={{ display: 'block' }}>{g.sous}</span>
                  </span>
                </div>
              ))}
            </div>
          </aside>
        </div>
        <InfosCommerciales produit={produit ?? undefined} compact />
      </main>

      {/* ── Barre d'action mobile ──
          Elle ne recouvre pas le formulaire : le corps de page réserve sa
          hauteur, et le bouton reste à portée de pouce. */}
      {(etape > 1 || produit) && (
        <div className={styles.barreMobile}>
          {etape > 1 && (
            <button
              type="button"
              className="c-btn c-btn-ghost"
              onClick={() => allerA((etape - 1) as Etape)}
              aria-label={t('nav.retour')}
            >
              ←
            </button>
          )}
          <div className={styles.barreMobileTotal}>
            <span className={styles.barreMobileCle}>{t('resume.total')}</span>
            <span className={styles.barreMobileVal}>
              {tarif.chiffre ? formaterDA(tarif.total, langue) : t('produit.devis')}
            </span>
          </div>
          <button
            type="button"
            className={`c-btn c-btn-accent ${styles.barreMobileBtn}`}
            onClick={continuer}
            disabled={enregistrement}
          >
            {etape === 3 && !etat.logoNom ? t('nav.passer') : texteBouton}
          </button>
        </div>
      )}

      <Footer />
    </div>
  )
}

/* ── Sous-composants ───────────────────────────────────────────────── */

function Champ({
  id, label, valeur, onChange, requis, type = 'text', placeholder, erreur, autoComplete, t,
}: {
  id: string
  label: string
  valeur: string
  onChange: (v: string) => void
  requis?: boolean
  type?: string
  placeholder?: string
  erreur?: string | null
  autoComplete?: string
  t: (c: string) => string
}) {
  return (
    <div className={styles.champ}>
      <label className={styles.label} htmlFor={id}>
        {label}{' '}
        <span className={styles.labelOption}>
          ({requis ? t('contact.obligatoire') : t('contact.facultatif')})
        </span>
      </label>
      <input
        id={id}
        type={type}
        className={`${styles.input} ${erreur ? styles.inputErreur : ''}`}
        value={valeur}
        placeholder={placeholder}
        autoComplete={autoComplete}
        onChange={e => onChange(e.target.value)}
        aria-invalid={!!erreur}
        aria-describedby={erreur ? `${id}-err` : undefined}
      />
      {erreur && <span className={styles.erreur} id={`${id}-err`} role="alert">{erreur}</span>}
    </div>
  )
}

/**
 * Guide des tailles.
 * L'atelier ne nous a pas communiqué de tableau de mensurations : on n'en
 * invente pas. Le guide dit ce qui est connu — les tailles réellement
 * produites pour cette pièce et sa coupe — et renvoie vers l'atelier pour
 * les mesures exactes.
 */
function GuideTailles({ tailles, produit }: { tailles: string[]; produit: CatalogueProduit }) {
  const vestimentaires = tailles.filter(estTailleVestimentaire)
  const coupe = /oversized/i.test(produit.nom)
    ? 'Coupe oversized — prévoir une taille en dessous pour un porté ajusté.'
    : /regular/i.test(produit.nom)
      ? 'Coupe regular — taille normale.'
      : null

  return (
    <details className={styles.guide}>
      <summary className={styles.guideResume}>Guide des tailles</summary>
      <div className={styles.guideCorps}>
        <table className={styles.guideTable}>
          <thead>
            <tr>
              <th scope="col">Taille</th>
              <th scope="col">Disponible sur cette pièce</th>
            </tr>
          </thead>
          <tbody>
            {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(taille => (
              <tr key={taille}>
                <th scope="row">{taille}</th>
                <td>{vestimentaires.includes(taille) ? 'Oui' : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {coupe && <p className={styles.guideNote}>{coupe}</p>}
        {produit.matiere && <p className={styles.guideNote}>Matière : {produit.matiere}.</p>}
        {produit.grammage && <p className={styles.guideNote}>Grammage : {produit.grammage}.</p>}
        <p className={styles.guideNote}>
          Les mensurations détaillées (largeur de poitrine, longueur) ne sont pas encore
          publiées. Demandez-les à l’atelier sur{' '}
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">WhatsApp</a> avant de
          commander en série.
        </p>
      </div>
    </details>
  )
}

function Recapitulatif({
  produit, etat, tarif, quantiteTotale, taillesCommandees, aDesTailles, t, langue, sansTitre,
}: {
  produit: CatalogueProduit | null
  etat: Etat
  tarif: ReturnType<typeof calculerTarif>
  quantiteTotale: number
  taillesCommandees: { taille: string; quantite: number }[]
  aDesTailles: boolean
  t: (c: string) => string
  langue: 'fr' | 'ar'
  sansTitre?: boolean
}) {
  const lignes: { cle: string; valeur: string; vide?: boolean; couleur?: string }[] = [
    { cle: t('resume.produit'), valeur: produit?.nom ?? t('resume.vide'), vide: !produit },
    { cle: t('resume.technique'), valeur: etat.technique },
    { cle: t('resume.couleur'), valeur: etat.couleur || t('resume.vide'), vide: !etat.couleur, couleur: etat.couleurHex },
  ]
  if (aDesTailles) {
    lignes.push({
      cle: t('resume.tailles'),
      valeur: taillesCommandees.length
        ? taillesCommandees.map(l => `${l.taille} × ${l.quantite}`).join(', ')
        : t('resume.vide'),
      vide: taillesCommandees.length === 0,
    })
  }
  lignes.push({ cle: t('resume.quantite'), valeur: String(quantiteTotale), vide: quantiteTotale === 0 })
  lignes.push({
    cle: t('resume.logo'),
    valeur: etat.logoNom ?? t('resume.aucunLogo'),
    vide: !etat.logoNom,
  })

  return (
    <>
      {!sansTitre && <p className={styles.resumeTitre}>{t('resume.titre')}</p>}
      {lignes.map(l => (
        <div key={l.cle} className={styles.resumeLigne}>
          <span className={styles.resumeCle}>{l.cle}</span>
          <span className={`${styles.resumeVal} ${l.vide ? styles.resumeVide : ''}`}>
            {l.couleur && !l.vide && (
              <span className={styles.resumePastille} style={{ background: l.couleur }} aria-hidden="true" />
            )}
            {l.valeur}
          </span>
        </div>
      ))}

      <div className={styles.resumeTotaux}>
        {tarif.chiffre ? (
          <>
            <div className={styles.resumeLigne}>
              <span className={styles.resumeCle}>{t('resume.sousTotal')}</span>
              <span className={styles.resumeVal}>{formaterDA(tarif.total, langue)}</span>
            </div>
            {tarif.remise > 0 && (
              <div className={styles.resumeLigne}>
                <span className={styles.resumeCle}>{t('resume.remise')}</span>
                <span className={`${styles.resumeVal} ${styles.resumeRemise}`}>
                  −{Math.round(tarif.remise * 100)} %
                </span>
              </div>
            )}
            {/* Les frais de livraison ne sont pas connus à ce stade : on le dit,
                on n'invente pas de tarif et on ne l'additionne pas. */}
            <div className={styles.resumeLigne}>
              <span className={styles.resumeCle}>{t('resume.livraison')}</span>
              <span className={`${styles.resumeVal} ${styles.resumeVide}`}>
                {t('resume.livraisonAConfirmer')}
              </span>
            </div>
            <div className={styles.resumeTotal}>
              <span className={styles.resumeTotalCle}>{t('resume.sousTotal')}</span>
              <span className={styles.resumeTotalVal}>{formaterDA(tarif.total, langue)}</span>
            </div>
          </>
        ) : (
          <p className={styles.resumeDevis}>{t('resume.devis')}</p>
        )}
      </div>
    </>
  )
}
