// Validation serveur d'une commande.
//
// L'API insérait auparavant `{ ...body }` directement dans la table : le
// navigateur choisissait donc les colonnes écrites (y compris `statut`, les
// prix, et n'importe quel champ ajouté au schéma) et les montants enregistrés
// étaient ceux qu'il avait calculés. Ce module fait l'inverse : il n'accepte
// qu'une liste explicite de champs, vérifie chacun contre les données de
// référence, et recalcule lui-même les prix à partir du catalogue.
//
// Le fichier ne dépend ni de Next ni de Supabase : il est testable seul.

import {
  resoudreProduit,
  couleursPourProduit,
  calculerTarif,
  estTailleVestimentaire,
  normaliser,
  type CatalogueProduit,
} from './catalogue'
import wilayas from './data/wilayas.json'

/** Clé de quantité utilisée pour les supports sans taille (casquette, tote bag). */
export const SANS_TAILLE = '__unique__'

export const TECHNIQUES_AUTORISEES = ['DTF', 'Broderie', 'Sérigraphie', 'Conseil équipe'] as const
export const CANAUX_AUTORISES = ['configurateur', 'entreprises', 'collection', 'revente'] as const

const LONGUEURS = {
  nom: 120,
  entreprise: 160,
  telephone: 32,
  email: 160,
  notes: 1000,
  commune: 120,
  adresse: 240,
  position: 120,
  couleur: 60,
} as const

/** Quantité totale plafonnée : au-delà, c'est un devis, pas une commande en ligne. */
export const QUANTITE_MAX = 10000
export const QUANTITE_PAR_TAILLE_MAX = 9999

const NOMS_WILAYAS = new Set(
  (wilayas as { code: number; name: string }[]).map(w => normaliser(w.name)),
)

/**
 * Hôtes autorisés pour l'URL de logo. Sans ce filtre, un client pouvait faire
 * enregistrer — puis afficher dans l'email envoyé à l'atelier — un lien vers
 * n'importe quel site.
 */
function hoteLogoAutorise(url: URL): boolean {
  if (url.protocol !== 'https:') return false
  const supabase = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (supabase) {
    try {
      if (url.host === new URL(supabase).host) return true
    } catch {
      /* variable mal formée : on retombe sur la liste ci-dessous */
    }
  }
  return url.host.endsWith('.supabase.co')
}

export type CommandeValidee = {
  produit_id: string
  produit: string
  couleur: string
  /** Répartition par taille, nettoyée. */
  quantites_tailles: Record<string, number>
  tailles: string[]
  quantite: number
  technique: string
  position: string
  urgent: boolean
  nom_client: string
  entreprise: string | null
  telephone: string
  email: string | null
  notes: string | null
  wilaya: string
  commune: string | null
  adresse: string | null
  logo_url: string | null
  canal: string
  /** Recalculés depuis le catalogue — jamais repris du client. */
  prix_unitaire: number
  prix_total: number
  /** `false` quand la pièce n'a pas de tarif publié : commande sur devis. */
  tarif_chiffre: boolean
}

export type Resultat =
  | { ok: true; commande: CommandeValidee; produit: CatalogueProduit }
  | { ok: false; erreurs: string[] }

function texte(valeur: unknown, max: number): string {
  if (typeof valeur !== 'string') return ''
  // On retire les caractères de contrôle : ils n'ont rien à faire dans un nom
  // ou une adresse, et brouillent les emails et l'admin.
  return valeur
    .replace(/[\u0000-\u001f\u007f]/g, ' ')
    .trim()
    .slice(0, max)
}

/** Normalise un numéro algérien en ne gardant que « + » et les chiffres. */
export function normaliserTelephone(valeur: unknown): string {
  const brut = texte(valeur, LONGUEURS.telephone)
  const nettoye = brut.replace(/[^\d+]/g, '')
  return nettoye.startsWith('+') ? `+${nettoye.slice(1).replace(/\+/g, '')}` : nettoye.replace(/\+/g, '')
}

export function telephoneValide(numero: string): boolean {
  const chiffres = numero.replace(/\D/g, '')
  // 9 chiffres (fixe local) à 15 (format international E.164 maximal).
  return chiffres.length >= 9 && chiffres.length <= 15
}

export function emailValide(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)
}

/**
 * Valide une commande reçue du navigateur.
 * Retourne soit la commande prête à insérer — champs explicites, prix
 * recalculés — soit la liste des erreurs.
 */
export function validerCommande(brut: unknown): Resultat {
  const erreurs: string[] = []
  if (!brut || typeof brut !== 'object' || Array.isArray(brut)) {
    return { ok: false, erreurs: ['Requête invalide.'] }
  }
  const corps = brut as Record<string, unknown>

  // ── Produit ──────────────────────────────────────────────────────
  const produit = resoudreProduit(
    typeof corps.produit_id === 'string' ? corps.produit_id : (corps.produit as string | undefined),
  )
  if (!produit) {
    return { ok: false, erreurs: ['Produit inconnu : cette pièce ne figure pas au catalogue.'] }
  }

  // ── Couleur ──────────────────────────────────────────────────────
  const couleursDispo = couleursPourProduit(produit)
  const couleurDemandee = texte(corps.couleur, LONGUEURS.couleur)
  const couleur = couleursDispo.find(c => normaliser(c.nom) === normaliser(couleurDemandee))
  if (couleurDemandee && !couleur) {
    erreurs.push(`Couleur « ${couleurDemandee} » indisponible pour ${produit.nom}.`)
  }
  // Sans couleur transmise, on retient le premier coloris réellement proposé
  // plutôt que d'enregistrer une chaîne vide.
  const couleurRetenue = couleur?.nom ?? couleursDispo[0]?.nom ?? ''

  // ── Quantités par taille ─────────────────────────────────────────
  const porteDesTailles = produit.tailles.some(estTailleVestimentaire)
  const taillesAutorisees = new Set(
    porteDesTailles
      ? produit.tailles.filter(estTailleVestimentaire).map(normaliser)
      : [normaliser(SANS_TAILLE)],
  )

  const quantites: Record<string, number> = {}
  const brutQuantites = corps.quantites
  if (brutQuantites && typeof brutQuantites === 'object' && !Array.isArray(brutQuantites)) {
    for (const [taille, valeur] of Object.entries(brutQuantites as Record<string, unknown>)) {
      const nombre = typeof valeur === 'number' ? valeur : Number(valeur)
      if (!Number.isFinite(nombre) || nombre <= 0) continue
      if (!taillesAutorisees.has(normaliser(taille))) {
        erreurs.push(`Taille « ${texte(taille, 20)} » indisponible pour ${produit.nom}.`)
        continue
      }
      const entier = Math.floor(nombre)
      if (entier > QUANTITE_PAR_TAILLE_MAX) {
        erreurs.push(`Quantité trop élevée pour la taille ${texte(taille, 20)}.`)
        continue
      }
      // Les tailles sont réécrites telles que le catalogue les orthographie.
      const officielle = porteDesTailles
        ? produit.tailles.find(t => normaliser(t) === normaliser(taille)) ?? taille
        : SANS_TAILLE
      quantites[officielle] = (quantites[officielle] ?? 0) + entier
    }
  }

  const quantite = Object.values(quantites).reduce((somme, n) => somme + n, 0)
  if (quantite < 1) {
    erreurs.push('Indiquez au moins une pièce à commander.')
  } else if (quantite > QUANTITE_MAX) {
    erreurs.push(`Au-delà de ${QUANTITE_MAX} pièces, contactez-nous pour un devis dédié.`)
  }

  // ── Coordonnées ──────────────────────────────────────────────────
  const nomClient = texte(corps.nom_client, LONGUEURS.nom)
  if (nomClient.length < 2) erreurs.push('Renseignez votre nom.')

  const telephone = normaliserTelephone(corps.telephone)
  if (!telephoneValide(telephone)) erreurs.push('Renseignez un numéro de téléphone valide.')

  const email = texte(corps.email, LONGUEURS.email)
  if (email && !emailValide(email)) erreurs.push('Adresse email invalide.')

  // ── Livraison ────────────────────────────────────────────────────
  const wilaya = texte(corps.wilaya, 80)
  if (!wilaya) erreurs.push('Indiquez la wilaya de livraison.')
  else if (!NOMS_WILAYAS.has(normaliser(wilaya))) erreurs.push(`Wilaya inconnue : ${wilaya}.`)

  // ── Options d'impression ─────────────────────────────────────────
  const techniqueDemandee = texte(corps.technique, 40)
  const technique =
    TECHNIQUES_AUTORISEES.find(t => normaliser(t) === normaliser(techniqueDemandee)) ?? 'DTF'

  const canalDemande = texte(corps.canal, 40)
  const canal = CANAUX_AUTORISES.find(c => normaliser(c) === normaliser(canalDemande)) ?? 'configurateur'

  // ── Logo ─────────────────────────────────────────────────────────
  let logoUrl: string | null = null
  const logoBrut = texte(corps.logo_url, 500)
  if (logoBrut) {
    try {
      const url = new URL(logoBrut)
      if (hoteLogoAutorise(url)) logoUrl = url.toString()
      else erreurs.push('Le fichier de logo doit être envoyé via le formulaire.')
    } catch {
      erreurs.push('Lien de logo invalide.')
    }
  }

  if (erreurs.length > 0) return { ok: false, erreurs }

  // ── Prix : recalculés côté serveur, à partir du catalogue ────────
  const tarif = calculerTarif(produit, quantite)

  return {
    ok: true,
    produit,
    commande: {
      produit_id: produit.id,
      produit: produit.nom,
      couleur: couleurRetenue,
      quantites_tailles: quantites,
      tailles: porteDesTailles ? Object.keys(quantites) : [],
      quantite,
      technique,
      position: texte(corps.position, LONGUEURS.position) || 'À définir avec l’atelier',
      urgent: corps.urgent === true,
      nom_client: nomClient,
      entreprise: texte(corps.entreprise, LONGUEURS.entreprise) || null,
      telephone,
      email: email || null,
      notes: texte(corps.notes, LONGUEURS.notes) || null,
      wilaya,
      commune: texte(corps.commune, LONGUEURS.commune) || null,
      adresse: texte(corps.adresse, LONGUEURS.adresse) || null,
      logo_url: logoUrl,
      canal,
      prix_unitaire: tarif.unitaire,
      prix_total: tarif.total,
      tarif_chiffre: tarif.chiffre,
    },
  }
}

/**
 * Projection publique d'une commande : ce qu'on peut renvoyer à quelqu'un qui
 * connaît seulement la référence. Aucune donnée personnelle — une référence
 * ne doit pas suffire à récupérer le nom, le téléphone ou l'adresse du client.
 */
export const CHAMPS_PUBLICS = [
  'reference',
  'statut',
  'produit',
  'produit_id',
  'quantite',
  'couleur',
  'technique',
  'urgent',
  'prix_total',
  'created_at',
] as const

export function projectionPublique(commande: Record<string, unknown>): Record<string, unknown> {
  const publique: Record<string, unknown> = {}
  for (const champ of CHAMPS_PUBLICS) {
    if (champ in commande) publique[champ] = commande[champ]
  }
  return publique
}

/** Échappe une valeur avant insertion dans un email HTML. */
export function echapperHtml(valeur: unknown): string {
  const texteBrut = valeur === null || valeur === undefined ? '' : String(valeur)
  return texteBrut.replace(/[&<>"']/g, caractere => {
    switch (caractere) {
      case '&': return '&amp;'
      case '<': return '&lt;'
      case '>': return '&gt;'
      case '"': return '&quot;'
      default: return '&#039;'
    }
  })
}
