// Source unique du catalogue Caractère.
//
// Avant ce module, /produits et /configurateur tenaient chacun leur propre
// liste de produits. Le catalogue passait un **nom** dans l'URL
// (`?produit=ENSEMBLE 3 PIÈCES`) que le configurateur cherchait par égalité
// stricte dans une liste qui ne contenait que « T-shirt », « Polo »… La
// correspondance échouait toujours, et le configurateur avançait quand même
// avec un produit vide.
//
// Désormais les deux pages lisent ce fichier, et l'URL transporte un
// identifiant stable (`?produit=ensemble-3-pieces`). `resoudreProduit()`
// accepte encore les anciens liens par nom : les liens déjà partagés,
// indexés ou collés dans une conversation WhatsApp continuent de fonctionner.
//
// Règle de contenu : on ne renseigne ici que ce que l'atelier a réellement
// communiqué. Un produit sans prix connu n'a pas de `prix` — l'interface
// affiche « Prix sur devis » plutôt que d'inventer un tarif.

export type Categorie = 'Streetwear' | 'Ensembles' | 'B2B'

export type CatalogueProduit = {
  /** Identifiant stable — c'est lui qui circule dans les URL et les commandes. */
  id: string
  nom: string
  image: string
  categorie: Categorie
  /** Tailles réellement proposées pour cette pièce. */
  tailles: string[]
  /**
   * Couleurs disponibles pour ce support.
   * `null` = le support est personnalisable dans toute la palette atelier.
   * Un tableau = la pièce n'existe que dans ces coloris (ex. un ensemble
   * imprimé n'existe que sur fond gris).
   */
  couleurs: string[] | null
  description: string
  badge?: string
  /** Prix unitaire en DA. Absent = tarif non communiqué, donc sur devis. */
  prix?: number
  /** Matière, telle que décrite par l'atelier. */
  matiere?: string
  /** Grammage, quand il figure sur la fiche produit de l'atelier. */
  grammage?: string
  /** Anciens noms/identifiants, pour que les liens déjà diffusés résolvent. */
  alias?: string[]
}

/**
 * Palette de l'atelier. Ce sont les coloris dans lesquels les supports
 * personnalisables sont imprimés — la même liste que celle servie par la
 * table `couleurs` de Supabase, reprise ici pour que la page ne dépende pas
 * d'un aller-retour réseau pour s'afficher.
 */
export const PALETTE_ATELIER: { nom: string; hex: string }[] = [
  { nom: 'Noir', hex: '#1A1A1A' },
  { nom: 'Blanc', hex: '#FFFFFF' },
  { nom: 'Gris', hex: '#888888' },
  { nom: 'Beige', hex: '#E8D5B0' },
  { nom: 'Rouge', hex: '#CC1111' },
  { nom: 'Bordeaux', hex: '#6B1A2A' },
  { nom: 'Bleu Nuit', hex: '#1B2A4A' },
  { nom: 'Bleu Roi', hex: '#1A5DC8' },
  { nom: 'Vert', hex: '#1A9A3C' },
]

const TAILLES_COURTES = ['S', 'M', 'L', 'XL']
const TAILLES_LONGUES = ['S', 'M', 'L', 'XL', 'XXL']

/** Ensembles imprimés : la pièce n'existe que sur le fond gris photographié. */
const GRIS_SEUL = ['Gris']

export const CATALOGUE: CatalogueProduit[] = [
  // ───────────────────────── STREETWEAR ─────────────────────────
  {
    id: 'chrome-one',
    nom: 'CHROME ONE',
    image: 'https://cdn.shopify.com/s/files/1/0668/1418/1491/files/1621F031-176E-4755-B2A4-A7585A2F9031.png',
    categorie: 'Streetwear',
    tailles: TAILLES_COURTES,
    couleurs: null,
    description: 'Tissu bouclette (serbita). Pièce signature.',
    matiere: 'Bouclette (serbita)',
    badge: 'Exclusif',
  },
  {
    id: 'black-regular-tee',
    nom: 'BLACK REGULAR TEE 210GSM',
    image: 'https://cdn.shopify.com/s/files/1/0668/1418/1491/files/CFE2A2DA-BA00-4B18-B6F9-9975D4FBC581.jpg',
    categorie: 'Streetwear',
    tailles: TAILLES_LONGUES,
    couleurs: ['Noir'],
    description: 'T-shirt coton premium 210gsm. Coupe Regular.',
    matiere: 'Coton premium',
    grammage: '210 g/m²',
  },
  {
    id: 'white-regular-tee',
    nom: 'WHITE REGULAR TEE 250GSM',
    image: 'https://cdn.shopify.com/s/files/1/0668/1418/1491/files/4FC9A90A-56B6-4321-861C-8A25489163D6.jpg',
    categorie: 'Streetwear',
    tailles: TAILLES_LONGUES,
    couleurs: ['Blanc'],
    description: 'T-shirt coton premium 250gsm. Coupe Regular.',
    matiere: 'Coton premium',
    grammage: '250 g/m²',
  },
  {
    id: 'white-oversized-tee',
    nom: 'WHITE OVERSIZED TEE 250GSM',
    image: 'https://cdn.shopify.com/s/files/1/0668/1418/1491/files/76CA8FA6-887F-4184-A691-1A188FF315A9.jpg',
    categorie: 'Streetwear',
    tailles: TAILLES_LONGUES,
    couleurs: ['Blanc'],
    description: 'T-shirt oversized coton épais 250gsm.',
    matiere: 'Coton épais',
    grammage: '250 g/m²',
  },
  {
    id: 'black-oversized-tee',
    nom: 'BLACK OVERSIZED TEE 250GSM',
    image: 'https://cdn.shopify.com/s/files/1/0668/1418/1491/files/3D8BCF35-BF82-47A6-9A20-1E64D94EABEE.jpg',
    categorie: 'Streetwear',
    tailles: TAILLES_LONGUES,
    couleurs: ['Noir'],
    description: 'T-shirt oversized coton épais 250gsm.',
    matiere: 'Coton épais',
    grammage: '250 g/m²',
  },
  {
    id: 'short-caractere',
    nom: 'SHORT CARACTERE',
    image: 'https://cdn.shopify.com/s/files/1/0668/1418/1491/files/IMG-8887.png',
    categorie: 'Streetwear',
    tailles: TAILLES_LONGUES,
    couleurs: null,
    description: 'Short premium. Coupe moderne, tissu respirant.',
  },
  {
    id: 'baggy-jogger',
    nom: 'BAGGY JOGGER',
    image: 'https://cdn.shopify.com/s/files/1/0668/1418/1491/files/D0319F16-6189-4EC1-8F32-A0C9EF3BA832.png',
    categorie: 'Streetwear',
    tailles: TAILLES_COURTES,
    couleurs: null,
    description: 'Jogger baggy confort ultime. Coupe ample.',
  },
  {
    id: 'oversized-jogger',
    nom: 'OVERSIZED JOGGER',
    image: 'https://cdn.shopify.com/s/files/1/0668/1418/1491/files/7027F65B-78FA-4D0E-8B0D-0C50240AACA0.jpg',
    categorie: 'Streetwear',
    tailles: TAILLES_COURTES,
    couleurs: null,
    description: 'Jogger surdimensionné tissu doux et extensible.',
  },
  {
    id: 'premium-baggy-joggers',
    nom: 'PREMIUM BAGGY JOGGERS',
    image: 'https://cdn.shopify.com/s/files/1/0668/1418/1491/files/B08118E1-A004-4F3A-B2E3-676CE6E75870.jpg',
    categorie: 'Streetwear',
    tailles: TAILLES_COURTES,
    couleurs: null,
    description: 'Baggy jogger premium.',
  },
  {
    id: 'hoodie-medium',
    nom: 'HOODIE MEDIUM',
    image: 'https://cdn.shopify.com/s/files/1/0668/1418/1491/files/7668ABF0-890B-48D4-A05D-22D3E8090A7A.jpg',
    categorie: 'Streetwear',
    tailles: TAILLES_COURTES,
    couleurs: null,
    description: 'Hoodie polyvalent et confortable.',
  },
  {
    id: 'premium-hoodie',
    nom: 'PREMIUM HOODIE',
    image: 'https://cdn.shopify.com/s/files/1/0668/1418/1491/files/0D2EF14B-6EF7-4CCF-AFAF-0A7B02A3B304.png',
    categorie: 'Streetwear',
    tailles: TAILLES_LONGUES,
    couleurs: null,
    description: 'Sweat-shirt premium confort incomparable.',
  },
  {
    id: 'hoodie-premium-500gsm',
    nom: 'HOODIE PREMIUM 500GSM',
    image: 'https://cdn.shopify.com/s/files/1/0668/1418/1491/files/058ECD43-1772-45BA-AE92-6DAF6F6CCCB2.jpg',
    categorie: 'Streetwear',
    tailles: TAILLES_COURTES,
    couleurs: null,
    description: 'Le hoodie ultime 500gsm. Tissu lourd, coupe parfaite.',
    grammage: '500 g/m²',
    badge: 'Premium',
  },
  {
    id: 'zipper-hoodie',
    nom: 'ZIPPER HOODIE',
    image: 'https://cdn.shopify.com/s/files/1/0668/1418/1491/files/610D63C2-C065-4AEE-9444-6E9929D307D1.png',
    categorie: 'Streetwear',
    tailles: TAILLES_LONGUES,
    couleurs: null,
    description: 'Sweat à capuche zippé. Design pratique et élégant.',
  },
  {
    id: 'pull-caractere',
    nom: 'PULL CARACTERE',
    image: 'https://cdn.shopify.com/s/files/1/0668/1418/1491/files/IMG-1210.png',
    categorie: 'Streetwear',
    tailles: TAILLES_LONGUES,
    couleurs: null,
    description: 'Pull incontournable. Tissu doux, idéal saison froide.',
  },
  {
    id: 'veste-ninja',
    nom: 'VESTE NINJA CARACTERE',
    image: 'https://cdn.shopify.com/s/files/1/0668/1418/1491/files/IMG-1535.webp',
    categorie: 'Streetwear',
    tailles: TAILLES_COURTES,
    couleurs: null,
    description: 'Veste technique au style unique. Coupe ninja ajustée.',
    badge: 'Nouveau',
  },

  // ───────────────────────── ENSEMBLES ─────────────────────────
  {
    id: 'ensemble-blanc',
    nom: 'ENSEMBLE BLANC (HOODIE + JOGGER)',
    image: 'https://cdn.shopify.com/s/files/1/0668/1418/1491/files/8FA331B2-CB03-421D-B7A6-C71A77EB48A3.jpg',
    categorie: 'Ensembles',
    tailles: TAILLES_LONGUES,
    couleurs: ['Blanc'],
    description: 'Ensemble hoodie + jogger assorti.',
  },
  {
    id: 'ensemble-noir',
    nom: 'ENSEMBLE HOODIE + JOGGER – NOIR',
    image: 'https://cdn.shopify.com/s/files/1/0668/1418/1491/files/DC846844-3B4B-4123-BF75-707B645CCF84.png',
    categorie: 'Ensembles',
    tailles: TAILLES_LONGUES,
    couleurs: ['Noir'],
    description: 'Ensemble hoodie + jogger noir.',
  },
  {
    id: 'ensemble-gris',
    nom: 'ENSEMBLE HOODIE + JOGGER – GRIS',
    image: 'https://cdn.shopify.com/s/files/1/0668/1418/1491/files/A221C04C-1598-4ACD-BD22-51B4D9351944.png',
    categorie: 'Ensembles',
    tailles: TAILLES_LONGUES,
    couleurs: GRIS_SEUL,
    description: 'Ensemble hoodie + jogger gris.',
  },
  {
    id: 'ensemble-zipper-baggy',
    nom: 'ENSEMBLE ZIPPER + BAGGY',
    // Photo de l'atelier, hébergée avec le site : ce visuel ne dépend pas
    // d'un CDN externe, contrairement au reste du catalogue.
    image: '/ensembles/ensemble-zipper-baggy-noir.jpg',
    categorie: 'Ensembles',
    tailles: TAILLES_LONGUES,
    couleurs: ['Noir'],
    description: 'Ensemble veste zippée + pantalon ample.',
  },
  {
    id: 'ensemble-veste-baggy',
    nom: 'VESTE + BAGGY ELASTIQUE',
    image: 'https://cdn.shopify.com/s/files/1/0668/1418/1491/files/38B475A2-3673-4DFD-9980-EBF27E2FE871.jpg',
    categorie: 'Ensembles',
    tailles: TAILLES_COURTES,
    couleurs: null,
    description: 'Ensemble veste + baggy élastique.',
  },
  // Ensembles imprimés — photos de l'atelier, hébergées avec le site. Les
  // descriptions ne disent que ce que la photo montre, et aucun prix n'est
  // renseigné tant que l'atelier ne l'a pas communiqué.
  {
    id: 'ensemble-racing-07',
    nom: 'ENSEMBLE RACING DIVISION 07',
    image: '/ensembles/ensemble-racing-07.jpg',
    categorie: 'Ensembles',
    tailles: TAILLES_LONGUES,
    couleurs: GRIS_SEUL,
    description: 'Ensemble zippé + jogger gris, impression racing rouge et noire, damier sur la manche.',
    badge: 'Nouveau',
  },
  {
    id: 'ensemble-dragon',
    nom: 'ENSEMBLE DRAGON',
    image: '/ensembles/ensemble-dragon.jpg',
    categorie: 'Ensembles',
    tailles: TAILLES_LONGUES,
    couleurs: GRIS_SEUL,
    description: "Ensemble zippé + jogger gris, dragon japonais et nuages d'encre, soleil rouge.",
    badge: 'Nouveau',
  },
  {
    id: 'ensemble-koi',
    nom: 'ENSEMBLE KOÏ',
    image: '/ensembles/ensemble-koi.jpg',
    categorie: 'Ensembles',
    tailles: TAILLES_LONGUES,
    couleurs: GRIS_SEUL,
    description: 'Ensemble zippé + jogger gris, carpes koï et vagues bleues.',
    badge: 'Nouveau',
  },
  {
    id: 'ensemble-athletic-club',
    nom: 'ENSEMBLE ATHLETIC CLUB 1996',
    image: '/ensembles/ensemble-athletic-club.jpg',
    categorie: 'Ensembles',
    tailles: TAILLES_LONGUES,
    couleurs: GRIS_SEUL,
    description: 'Ensemble zippé + jogger gris, lettrage varsity marine et initiale sur la jambe.',
    badge: 'Nouveau',
  },
  {
    id: 'ensemble-create-your-way',
    nom: 'ENSEMBLE CREATE YOUR WAY',
    image: '/ensembles/ensemble-create-your-way.jpg',
    categorie: 'Ensembles',
    tailles: TAILLES_LONGUES,
    couleurs: GRIS_SEUL,
    description: 'Ensemble zippé + jogger gris, graffiti bleu, jaune et noir.',
    badge: 'Nouveau',
  },
  {
    id: 'ensemble-3-pieces',
    nom: 'ENSEMBLE 3 PIÈCES',
    image: 'https://cdn.shopify.com/s/files/1/0668/1418/1491/files/BF32F9EB-46BA-42AD-AC98-D86BA988FB4A.png',
    categorie: 'Ensembles',
    tailles: TAILLES_COURTES,
    couleurs: null,
    description: 'Ensemble 3 pièces complet.',
    prix: 5000,
    badge: 'Premium',
  },

  // ───────────────────────────── B2B ─────────────────────────────
  {
    id: 'tshirt-personnalise',
    nom: 'T-SHIRTS PERSONNALISÉS',
    image: 'https://cdn.shopify.com/s/files/1/0668/1418/1491/files/3D3096AD-C813-4B16-B8C8-AFE451835942.jpg',
    categorie: 'B2B',
    tailles: TAILLES_LONGUES,
    couleurs: null,
    description: 'T-shirts personnalisés. DTF ou broderie.',
    matiere: '100 % coton',
    prix: 1950,
    badge: 'Devis gratuit',
    // Nom porté par la fiche du configurateur avant la fusion des catalogues.
    alias: ['T-shirt', 'T-shirt Oversized 250GSM'],
  },
  {
    id: 'polo-personnalise',
    nom: 'POLO PERSONNALISÉ',
    image: 'https://cdn.shopify.com/s/files/1/0668/1418/1491/files/506E8F49-8A75-4785-AA5C-B15E9BDD4667.webp',
    categorie: 'B2B',
    tailles: TAILLES_LONGUES,
    couleurs: null,
    description: 'Polo personnalisé DTF ou broderie pour entreprises.',
    matiere: 'Piqué coton premium',
    prix: 2300,
    badge: 'Devis gratuit',
    alias: ['Polo'],
  },
  {
    id: 'polo-pro',
    nom: 'POLO CARACTERE',
    image: 'https://cdn.shopify.com/s/files/1/0668/1418/1491/files/30D38768-C5B4-475D-8387-B77C07BE3EC6.jpg',
    categorie: 'B2B',
    tailles: TAILLES_LONGUES,
    couleurs: null,
    description: 'Polo demi-manche professionnel. Confort et élégance.',
    matiere: 'Piqué coton premium',
  },
  {
    id: 'gilet-travail',
    nom: 'GILET DE TRAVAIL',
    image: 'https://cdn.shopify.com/s/files/1/0668/1418/1491/files/F096140F-DEDA-4418-81D7-B3C688C02B4F.jpg',
    categorie: 'B2B',
    tailles: TAILLES_COURTES,
    couleurs: null,
    description: 'Gilet de travail sans manches. Liberté de mouvement.',
    prix: 2500,
    alias: ['Gilet de travail'],
  },
  {
    id: 'gilet-securite',
    nom: 'GILET DE SÉCURITÉ',
    image: '/produits-photos/gilet-securite.jpg',
    categorie: 'B2B',
    tailles: TAILLES_COURTES,
    couleurs: null,
    description: 'Gilet haute visibilité.',
    prix: 1600,
    alias: ['Gilet de securite', 'Gilet de sécurité'],
  },
  {
    id: 'gilet-col-haut',
    nom: 'GILET COL HAUT + POCHE',
    image: 'https://cdn.shopify.com/s/files/1/0668/1418/1491/files/5717612A-4250-4225-B79E-72B0941C4DCA.jpg',
    categorie: 'B2B',
    tailles: TAILLES_COURTES,
    couleurs: null,
    description: 'Gilet col haut multipoches. Fonctionnel et confortable.',
    badge: 'Devis gratuit',
  },
  {
    id: 'gilet-personnalise',
    nom: 'GILET PERSONNALISÉ COL ROND',
    image: 'https://cdn.shopify.com/s/files/1/0668/1418/1491/files/2ABA5114-8B2D-481B-800C-B24FA51CD855.webp',
    categorie: 'B2B',
    tailles: TAILLES_LONGUES,
    couleurs: null,
    description: 'Gilet col rond personnalisé. Simulation gratuite.',
    badge: 'Devis gratuit',
  },
  {
    id: 'combinaison-travail',
    nom: 'COMBINAISON DE TRAVAIL',
    image: '/produits-photos/combinaison-travail.jpg',
    categorie: 'B2B',
    tailles: TAILLES_COURTES,
    couleurs: null,
    description: 'Combinaison professionnelle multipoches.',
    prix: 5900,
    alias: ['Combinaison de travail'],
  },
  {
    id: 'tote-bag',
    nom: 'TOTE BAG PERSONNALISÉ',
    image: 'https://cdn.shopify.com/s/files/1/0668/1418/1491/files/IMG-3828.webp',
    categorie: 'B2B',
    tailles: ['Unique'],
    couleurs: null,
    description: 'Tote bag coton naturel + impression DTF.',
    matiere: 'Coton canvas',
    prix: 950,
    badge: 'Devis gratuit',
    alias: ['Totebag'],
  },
  {
    id: 'tablier',
    nom: 'TABLIER DE CUISINE PERSONNALISÉ',
    image: 'https://cdn.shopify.com/s/files/1/0668/1418/1491/files/IMG-3999.jpg',
    categorie: 'B2B',
    tailles: ['Unique'],
    couleurs: null,
    description: 'Tablier personnalisé durable. Idéal restauration.',
    prix: 1500,
    badge: 'Devis gratuit',
    alias: ['Tablier'],
  },
  {
    id: 'casquette',
    nom: 'CASQUETTE PERSONNALISÉE',
    image: 'https://cdn.shopify.com/s/files/1/0668/1418/1491/files/FFFDE421-D0F4-4B34-9096-BF52C840793D.webp',
    categorie: 'B2B',
    tailles: ['Unique'],
    couleurs: null,
    description: 'Casquette personnalisée broderie ou DTF.',
    prix: 1200,
    badge: 'Devis gratuit',
    alias: ['Casquette'],
  },
  {
    id: 'pack-tshirt-b2b',
    nom: 'T-SHIRT ENTREPRISE – PACK B2B',
    image: 'https://cdn.shopify.com/s/files/1/0668/1418/1491/files/3D3096AD-C813-4B16-B8C8-AFE451835942.jpg',
    categorie: 'B2B',
    tailles: TAILLES_COURTES,
    couleurs: null,
    description: 'Pack 10 t-shirts entreprise personnalisés DTF.',
    badge: 'Pack B2B',
  },
  {
    id: 'pack-polo-b2b',
    nom: 'POLO PROFESSIONNEL BRODÉ – PACK B2B',
    image: 'https://cdn.shopify.com/s/files/1/0668/1418/1491/files/506E8F49-8A75-4785-AA5C-B15E9BDD4667.webp',
    categorie: 'B2B',
    tailles: TAILLES_COURTES,
    couleurs: null,
    description: 'Pack polo professionnel brodé pour entreprises.',
    badge: 'Pack B2B',
  },
  {
    id: 'pack-veste-b2b',
    nom: 'VESTE DE TRAVAIL – PACK B2B',
    image: 'https://cdn.shopify.com/s/files/1/0668/1418/1491/files/F096140F-DEDA-4418-81D7-B3C688C02B4F.jpg',
    categorie: 'B2B',
    tailles: TAILLES_COURTES,
    couleurs: null,
    description: 'Pack veste de travail personnalisée BTP/logistique.',
    badge: 'Pack B2B',
  },
  {
    id: 'pack-uniforme-complet',
    nom: 'PACK UNIFORME COMPLET – CLÉ EN MAIN',
    image: 'https://cdn.shopify.com/s/files/1/0668/1418/1491/files/30D38768-C5B4-475D-8387-B77C07BE3EC6.jpg',
    categorie: 'B2B',
    tailles: ['Sur mesure'],
    couleurs: null,
    description: 'Solution clé en main. Polo, T-shirt, Veste ou formule sur mesure.',
    badge: 'Clé en main',
  },
]

export const CATEGORIES: Categorie[] = ['Streetwear', 'Ensembles', 'B2B']

/**
 * Normalise une chaîne pour la comparaison : minuscules, accents retirés,
 * ponctuation et espaces réduits à un tiret. « ENSEMBLE 3 PIÈCES »,
 * « ensemble-3-pieces » et « Ensemble 3 pieces » donnent la même clé.
 */
export function normaliser(valeur: string): string {
  return valeur
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const INDEX: Map<string, CatalogueProduit> = (() => {
  const index = new Map<string, CatalogueProduit>()
  for (const produit of CATALOGUE) {
    // L'identifiant a toujours la priorité : il ne doit jamais être masqué
    // par le nom d'une autre pièce.
    index.set(normaliser(produit.id), produit)
  }
  for (const produit of CATALOGUE) {
    for (const cle of [produit.nom, ...(produit.alias ?? [])]) {
      const normalisee = normaliser(cle)
      if (!index.has(normalisee)) index.set(normalisee, produit)
    }
  }
  return index
})()

/**
 * Résout un produit depuis un identifiant, un nom ou un ancien alias.
 * Retourne `null` quand rien ne correspond — l'appelant doit alors le dire
 * à l'utilisateur, jamais avancer avec un produit vide.
 */
export function resoudreProduit(valeur: string | null | undefined): CatalogueProduit | null {
  if (!valeur) return null
  return INDEX.get(normaliser(valeur)) ?? null
}

/** Lien vers le configurateur pour une pièce donnée, identifiant stable. */
export function lienConfigurateur(produit: CatalogueProduit): string {
  return `/configurateur?produit=${encodeURIComponent(produit.id)}`
}

// ─────────────────────────── Tarification ───────────────────────────
// Les paliers sont la référence unique : le client les affiche, le serveur
// les applique. Un prix envoyé par le navigateur n'est jamais retenu.

export const PALIERS_REMISE = [
  { min: 100, remise: 0.1, label: '100 pièces et plus', info: '−10 %' },
  { min: 50, remise: 0.05, label: '50 à 99 pièces', info: '−5 %' },
  { min: 1, remise: 0, label: '1 à 49 pièces', info: 'Prix unitaire' },
] as const

export function remisePourQuantite(quantite: number): number {
  const palier = PALIERS_REMISE.find(p => quantite >= p.min)
  return palier ? palier.remise : 0
}

export type Tarif = {
  /** `false` quand l'atelier n'a pas communiqué de prix pour cette pièce. */
  chiffre: boolean
  unitaire: number
  total: number
  remise: number
}

/**
 * Calcule le tarif d'une ligne. Sans prix de référence, on renvoie
 * `chiffre: false` : l'interface affiche « Prix sur devis » et n'additionne
 * rien. C'est aussi ce que le serveur enregistre, pour qu'une commande sur
 * devis ne soit jamais stockée à 0 DA comme si elle était gratuite.
 */
export function calculerTarif(
  produit: Pick<CatalogueProduit, 'prix'> | null | undefined,
  quantite: number,
): Tarif {
  const qte = Number.isFinite(quantite) ? Math.max(0, Math.floor(quantite)) : 0
  if (!produit || typeof produit.prix !== 'number') {
    return { chiffre: false, unitaire: 0, total: 0, remise: 0 }
  }
  const remise = remisePourQuantite(qte)
  const unitaire = Math.round(produit.prix * (1 - remise))
  return { chiffre: true, unitaire, total: unitaire * qte, remise }
}

// ───────────────────────────── Couleurs ─────────────────────────────

export type Coloris = { nom: string; hex: string }

/**
 * Retire les doublons d'une liste de coloris.
 *
 * Deux entrées de même teinte (même hex) sont le même coloris, quel que soit
 * leur libellé — on garde la première. En revanche deux entrées de même nom
 * mais de teintes différentes sont deux nuances réellement distinctes : on
 * les conserve toutes les deux, la pastille montre la différence.
 */
export function dedupliquerCouleurs(couleurs: Coloris[]): Coloris[] {
  const vues = new Set<string>()
  const resultat: Coloris[] = []
  for (const couleur of couleurs) {
    if (!couleur?.hex || !couleur?.nom) continue
    const teinte = couleur.hex.trim().toLowerCase()
    if (vues.has(teinte)) continue
    vues.add(teinte)
    resultat.push({ nom: couleur.nom.trim(), hex: couleur.hex.trim() })
  }
  return resultat
}

/**
 * Coloris réellement commandables pour un produit : l'intersection entre la
 * palette proposée et les coloris dans lesquels la pièce existe. Un ensemble
 * imprimé sur fond gris ne doit pas laisser choisir « Rouge ».
 */
export function couleursPourProduit(
  produit: Pick<CatalogueProduit, 'couleurs'> | null | undefined,
  palette: Coloris[] = PALETTE_ATELIER,
): Coloris[] {
  const uniques = dedupliquerCouleurs(palette)
  if (!produit || produit.couleurs === null || produit.couleurs === undefined) return uniques

  const autorisees = new Set(produit.couleurs.map(normaliser))
  const compatibles = uniques.filter(c => autorisees.has(normaliser(c.nom)))

  // Un coloris annoncé par la fiche produit mais absent de la palette reste
  // commandable : c'est la fiche qui fait foi sur ce que l'atelier fabrique.
  for (const nom of produit.couleurs) {
    if (compatibles.some(c => normaliser(c.nom) === normaliser(nom))) continue
    const connue = PALETTE_ATELIER.find(c => normaliser(c.nom) === normaliser(nom))
    compatibles.push({ nom, hex: connue?.hex ?? '#CCCCCC' })
  }
  return compatibles
}

/**
 * Tailles réellement disponibles pour un produit. Les tailles « Unique » et
 * « Sur mesure » ne sont pas des tailles de vêtement : l'interface ne doit
 * pas afficher de sélecteur S/M/L pour une casquette.
 */
const TAILLES_NON_VESTIMENTAIRES = new Set(['unique', 'sur-mesure', 'disponible'])

export function taillesPourProduit(
  produit: Pick<CatalogueProduit, 'tailles'> | null | undefined,
): string[] {
  return produit?.tailles ?? []
}

export function estTailleVestimentaire(taille: string): boolean {
  return !TAILLES_NON_VESTIMENTAIRES.has(normaliser(taille))
}

export function produitAvecTailles(
  produit: Pick<CatalogueProduit, 'tailles'> | null | undefined,
): boolean {
  return taillesPourProduit(produit).some(estTailleVestimentaire)
}
